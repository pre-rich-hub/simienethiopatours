import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const exec = promisify(execFile);
const root = new URL("./data/ethiopia-expansion/", import.meta.url);
const source = JSON.parse(await readFile(new URL("en.json", root), "utf8"));
const cachePath = "/tmp/ethiopia-translation-cache.json";
const cache: Record<string, string> = JSON.parse(await readFile(cachePath, "utf8"));
const locked = new Set(["slug", "area", "type", "imageUrl", "sourceReferences", "alsoKnownAs", "tourIds"]);
const terms = ["Fasil Ghebbi", "Fasilides Bath", "Debre Berhan Selassie", "Yemrehanna Kristos", "Ras Dashen", "Ras Dejen", "Imet Gogo", "Jinbar Waterfall", "Bwahit Pass", "Bwahit", "Buyit Ras", "Siha Gorge", "Meseha Valley", "Adi Arkay", "Lake Tana", "Bahir Dar", "Blue Nile Falls", "Highland Villages", "Walia ibex", "Ethiopian wolf", "giant lobelia", "Sankaber", "Geech", "Chennek", "Chenek", "Ambiko", "Ambaras", "Inatye", "Mulit", "Sona", "Debark", "Gondar", "Lalibela", "Axum", "Yeha", "Kosoye", "Woleka", "Kuskuam", "Simien Mountains National Park", "Simien Mountains", "Simien", "Tevan", "UNESCO", "Timkat", "Genna", "Meskel", "Gelada", "Geladas", "Gondar Simien Tours", "Simien Ethio Tours", "The Southern Ethiopia Journey", "Addis Ababa", "Gheralta", "Geralta", "Hawzen", "Tigray", "Afar", "Kidis Yared", "Arba Minch", "Chamo", "Guge", "Dorze", "Konso", "Jinka", "Mago", "Mursi", "Key Afer", "Turmi", "Hamer", "Karo", "Omo", "Omorate", "Dassanech", "Yirgalem", "Sidama", "Ziway", "Langano", "Bale", "Dinsho", "Sanetti", "Harenna", "Aksum"].sort((a, b) => b.length - a.length);
const glossary = new RegExp(terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
const hash = (locale: string, text: string) => `${locale}:${createHash("sha256").update(text).digest("hex")}`;
const strings = new Set<string>();
function collect(value: unknown, key = "") {
  if (locked.has(key)) return;
  if (typeof value === "string" && value.trim()) strings.add(value);
  else if (Array.isArray(value)) value.forEach((item) => collect(item, key));
  else if (value && typeof value === "object") Object.entries(value).forEach(([childKey, child]) => collect(child, childKey));
}
collect(source);

async function translateBatch(locale: string, items: string[]) {
  const separator = "__ETHIOPIA_TRANSLATION_SEPARATOR_9f6c__";
  const tokens: string[][] = [];
  const protectedItems = items.map((item) => {
    const itemTokens: string[] = [];
    const protectedText = item.replace(glossary, (term) => { itemTokens.push(term); return `⟦G${itemTokens.length - 1}⟧`; });
    tokens.push(itemTokens);
    return protectedText;
  });
  const query = protectedItems.join(` ${separator} `);
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  for (const [key, value] of Object.entries({ client: "gtx", sl: "en", tl: locale, dt: "t", q: query })) url.searchParams.set(key, value);
  const { stdout } = await exec("curl", ["-fsS", "--max-time", "30", url.href], { maxBuffer: 2 * 1024 * 1024 });
  const payload = JSON.parse(stdout);
  const translated = payload[0].map((part: [string]) => part[0]).join("");
  const pieces = translated.split(separator);
  if (pieces.length !== items.length) throw new Error(`${locale}: separator lost (${pieces.length}/${items.length})`);
  pieces.forEach((piece: string, index: number) => {
    let restored = piece.trim().replace(/⟦\s*G\s*(\d+)\s*⟧/gi, (_match, number: string) => tokens[index][Number(number)] ?? "");
    if (!restored || /⟦|⟧/.test(restored) || (items[index].length > 65 && restored === items[index])) throw new Error(`${locale}: incomplete translation`);
    // A few long requests can cause the public endpoint to drop a token. Keep
    // that item in English rather than publishing a corrupted place name.
    if (tokens[index].some((term) => !restored.toLocaleLowerCase().includes(term.toLocaleLowerCase()))) restored = items[index];
    cache[hash(locale, items[index])] = restored;
  });
}

for (const locale of ["es", "de", "fr"]) {
  const missing = [...strings].filter((item) => !cache[hash(locale, item)]);
  for (let offset = 0; offset < missing.length; offset += 8) {
    const batch = missing.slice(offset, offset + 8);
    let complete = false;
    for (let attempt = 0; attempt < 3 && !complete; attempt++) {
      try { await translateBatch(locale, batch); complete = true; }
      catch (error) { if (attempt === 2) throw error; await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1))); }
    }
    await writeFile(cachePath, JSON.stringify(cache));
    console.log(`${locale}: ${Math.min(offset + batch.length, missing.length)}/${missing.length}`);
  }
}

function localize(value: unknown, locale: string, key = ""): unknown {
  if (locked.has(key)) return value;
  if (typeof value === "string") return value.trim() ? cache[hash(locale, value)] : value;
  if (Array.isArray(value)) return value.map((item) => localize(item, locale, key));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, localize(child, locale, childKey)]));
  return value;
}
for (const locale of ["es", "de", "fr"]) await writeFile(new URL(`${locale}.json`, root), `${JSON.stringify(localize(source, locale), null, 2)}\n`);
console.log("Prepared es/de/fr destination content.");
