/**
 * Machine-assisted catalogue translator.
 *
 * Protects proper nouns via a glossary, skips structural/identity fields,
 * then translates remaining strings through a cached Google Translate (gtx)
 * client with travel-phrase post-edits for ES/DE/FR.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type TargetLocale = "es" | "de" | "fr";

const CACHE_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "../data/translation-cache.json");

/** Proper nouns and brand terms kept identical across locales. */
export const GLOSSARY = [
  "Fasil Ghebbi", "Fasilides Bath", "Debre Berhan Selassie", "Yemrehanna Kristos",
  "Ras Dashen", "Ras Dejen", "Imet Gogo", "Jinbar Waterfall", "Jinbar Falls",
  "Bwahit Pass", "Bwahit", "Buyit Ras", "Siha Gorge", "Meseha Valley", "Adi Arkay",
  "Lake Tana", "Bahir Dar", "Blue Nile Falls", "Blue Nile", "Highland Villages",
  "Walia ibex", "Walia Ibex", "Ethiopian wolf", "giant lobelia", "Giant lobelia",
  "Sankaber", "Geech", "Chennek", "Chenek", "Ambiko", "Ambaras", "Inatye", "Mulit", "Sona",
  "Debark", "Gondar", "Lalibela", "Axum", "Yeha", "Kosoye", "Woleka", "Kuskuam",
  "Simien Mountains National Park", "Simien Mountains", "Simien", "Tevan",
  "UNESCO", "Timkat", "Genna", "Meskel", "Gelada", "Geladas",
] as const;

const LOCKED_KEYS = new Set([
  "slug", "path", "image", "imageUrl", "locale", "availableLocales", "updatedAt",
  "journeyType", "area", "type", "isPublished", "isFeatured", "sortOrder",
  "schemaVersion", "href", "inquiry", "sourceReferences", "destinationIds", "tourIds",
  "tourSlugs", "id", "createdAt", "adultPrice", "childPrice", "discount", "rating",
  "noOfRates", "journeyMap", "destinationId",
]);

/** Prefer longest glossary tokens first so "Simien Mountains" wins over "Simien". */
const GLOSSARY_ORDERED = [...GLOSSARY].sort((a, b) => b.length - a.length);

const PHRASE_EDITS: Record<TargetLocale, Array<[RegExp, string]>> = {
  es: [
    [/\btrekking\b/gi, "trekking"],
    [/\btrek\b/gi, "trek"],
    [/\bovernight\b/gi, "pernoctación"],
    [/\bpark scout\b/gi, "explorador del parque"],
    [/\binclusions?\b/gi, "incluido"],
    [/\bexclusions?\b/gi, "no incluido"],
  ],
  de: [
    [/\bTrekking\b/g, "Trekking"],
    [/\bOvernight\b/g, "Übernachtung"],
    [/\bPark Scout\b/gi, "Parkwächter"],
  ],
  fr: [
    [/\btrekking\b/gi, "trekking"],
    [/\bnuitée\b/gi, "nuitée"],
    [/\bscout du parc\b/gi, "éclaireur du parc"],
  ],
};

type CacheFile = Record<string, string>;

let cache: CacheFile | null = null;
let cacheDirty = false;
let lastRequestAt = 0;

function cacheKey(locale: TargetLocale, text: string): string {
  return `${locale}:${createHash("sha1").update(text).digest("hex")}`;
}

export async function loadTranslationCache(): Promise<void> {
  try {
    cache = JSON.parse(await readFile(CACHE_PATH, "utf8")) as CacheFile;
  } catch {
    cache = {};
  }
}

export async function flushTranslationCache(): Promise<void> {
  if (!cache || !cacheDirty) return;
  await mkdir(dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 0) + "\n");
  cacheDirty = false;
}

function protectGlossary(text: string): { protectedText: string; tokens: string[] } {
  let protectedText = text;
  const tokens: string[] = [];
  for (const term of GLOSSARY_ORDERED) {
    const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    protectedText = protectedText.replace(pattern, () => {
      const index = tokens.length;
      tokens.push(term);
      return `⟦G${index}⟧`;
    });
  }
  return { protectedText, tokens };
}

function restoreGlossary(text: string, tokens: string[]): string {
  return text.replace(/⟦\s*G\s*(\d+)\s*⟧/gi, (_, n: string) => tokens[Number(n)] ?? "").replace(/\s+/g, (m) => (m.includes("\n") ? m : " ")).trim();
}

async function throttle(ms = 40): Promise<void> {
  const wait = Math.max(0, lastRequestAt + ms - Date.now());
  if (wait) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();
}

let inFlight = 0;
const MAX_IN_FLIGHT = 6;
const waiters: Array<() => void> = [];

async function withConcurrency<T>(fn: () => Promise<T>): Promise<T> {
  if (inFlight >= MAX_IN_FLIGHT) {
    await new Promise<void>((resolve) => waiters.push(resolve));
  }
  inFlight += 1;
  try {
    return await fn();
  } finally {
    inFlight -= 1;
    waiters.shift()?.();
  }
}

async function translateViaGtx(text: string, locale: TargetLocale): Promise<string> {
  return withConcurrency(async () => {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "en");
    url.searchParams.set("tl", locale);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);
    await throttle();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`gtx HTTP ${response.status}`);
    const payload = await response.json() as unknown;
    if (!Array.isArray(payload) || !Array.isArray(payload[0])) throw new Error("gtx unexpected payload");
    return (payload[0] as Array<[string]>).map((part) => part[0]).join("");
  });
}

function applyPhraseEdits(text: string, locale: TargetLocale): string {
  let out = text;
  for (const [pattern, replacement] of PHRASE_EDITS[locale]) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/** Translate a single English string into the target locale. */
export async function translateText(text: string, locale: TargetLocale): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  // Preserve pure numbers, day indices, and slug-like tokens.
  if (/^[\d\s./–—%-]+$/.test(trimmed)) return text;
  if (/^\d{2}$/.test(trimmed)) return text;

  if (!cache) await loadTranslationCache();
  const key = cacheKey(locale, text);
  const hit = cache![key];
  if (hit !== undefined) return hit;

  const { protectedText, tokens } = protectGlossary(text);
  let translated = protectedText;
  try {
    // Chunk long paragraphs to stay within gtx practical limits.
    const chunks = protectedText.length > 1800
      ? protectedText.match(/(?:.|\n){1,1600}(?:\s|$)/g) ?? [protectedText]
      : [protectedText];
    const parts: string[] = [];
    for (const chunk of chunks) {
      parts.push(await translateViaGtx(chunk, locale));
    }
    translated = parts.join("");
  } catch {
    // Offline / rate-limit fallback: keep glossary-protected English rather than inventing copy.
    translated = protectedText;
  }

  translated = restoreGlossary(translated, tokens);
  translated = applyPhraseEdits(translated, locale);
  // Prefer original whitespace shape for short labels.
  if (!text.startsWith(" ") && !text.endsWith(" ")) translated = translated.trim();
  cache![key] = translated;
  cacheDirty = true;
  return translated;
}

function shouldSkipString(key: string | undefined, value: string): boolean {
  if (key && LOCKED_KEYS.has(key)) return true;
  if (/^https?:\/\//i.test(value)) return true;
  if (value.startsWith("/") && !value.includes(" ")) return true;
  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return true;
  return false;
}

/** Recursively translate string fields; preserve structure, ids, numbers, booleans, paths, URLs. */
export async function translateValue(value: unknown, locale: TargetLocale, key?: string): Promise<unknown> {
  if (typeof value === "string") {
    if (shouldSkipString(key, value)) return value;
    return translateText(value, locale);
  }
  if (typeof value === "number" || typeof value === "boolean" || value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(await translateValue(item, locale, key));
    return out;
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
      if (LOCKED_KEYS.has(childKey)) {
        out[childKey] = childValue;
        continue;
      }
      out[childKey] = await translateValue(childValue, locale, childKey);
    }
    return out;
  }
  return value;
}

/** Collect unique translatable strings for cache warm-up. */
export function collectTranslatableStrings(value: unknown, key?: string, into = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    if (!shouldSkipString(key, value) && value.trim() && !/^[\d\s./–—%-]+$/.test(value.trim()) && !/^\d{2}$/.test(value.trim())) {
      into.add(value);
    }
    return into;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectTranslatableStrings(item, key, into);
    return into;
  }
  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
      if (LOCKED_KEYS.has(childKey)) continue;
      collectTranslatableStrings(childValue, childKey, into);
    }
  }
  return into;
}

/** Warm the translation cache for many strings × locales with bounded concurrency. */
export async function warmTranslationCache(strings: Iterable<string>, locales: TargetLocale[]): Promise<void> {
  await loadTranslationCache();
  const work: Array<{ text: string; locale: TargetLocale }> = [];
  for (const text of strings) {
    for (const locale of locales) work.push({ text, locale });
  }
  const batchSize = 24;
  for (let i = 0; i < work.length; i += batchSize) {
    await Promise.all(work.slice(i, i + batchSize).map(({ text, locale }) => translateText(text, locale)));
    await flushTranslationCache();
    process.stdout.write(`  cache ${Math.min(i + batchSize, work.length)}/${work.length}\n`);
  }
}
