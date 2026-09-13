import { buildPublicCatalogue } from "../catalog/public-catalogue.js";
import { prisma } from "../../config/database.js";
import { env } from "../../config/env.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AssistantLocale = "en" | "es" | "de" | "fr";

export type CatalogContext = {
  sections: string[];
  tokenEstimate: number;
  builtAt: Date;
  truncated: boolean;
  locale: AssistantLocale;
};

export interface ContextBuilder {
  build(locale?: AssistantLocale): Promise<CatalogContext>;
}

type CatalogRow = Record<string, unknown> & { slug?: string; locale?: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function safe(rows: unknown): CatalogRow[] {
  return Array.isArray(rows) ? (rows as CatalogRow[]) : [];
}

function parseArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function asString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function formatBullets(items: unknown[]): string {
  return items
    .map((item) => {
      const text = String(item).trim();
      return text === "" ? null : `- ${text}`;
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Prefer the requested locale row per slug; fall back to English so the model
 * always has a published public record when a translation is missing.
 */
export function pickLocaleRows<T extends { slug: string; locale: string }>(
  rows: T[],
  locale: AssistantLocale,
): T[] {
  const bySlug = new Map<string, T>();
  for (const row of rows) {
    if (row.locale === "en") bySlug.set(row.slug, row);
  }
  if (locale !== "en") {
    for (const row of rows) {
      if (row.locale === locale) bySlug.set(row.slug, row);
    }
  }
  return [...bySlug.values()];
}

// Itinerary rows store the ItineraryDay[] shape as JSON:
// { title, subtitle?, paragraphs[], overnight?, notes?, stages?[] }.
// Render it as readable markdown so the model reads an itinerary, not JSON.
function formatItinerary(raw: unknown): string {
  const days = parseArray(raw);
  return days
    .map((day, index) => {
      const entry = day as Record<string, unknown>;
      const title = asString(entry.title) ?? `Day ${index + 1}`;
      const subtitle = asString(entry.subtitle);
      const lines: string[] = [
        subtitle
          ? `# Day ${asString(entry.dayLabel) ?? index + 1}: ${title} — ${subtitle}`
          : `# Day ${asString(entry.dayLabel) ?? index + 1}: ${title}`,
      ];

      const paragraphs = parseArray(entry.paragraphs);
      for (const paragraph of paragraphs) {
        const text = asString(paragraph);
        if (text) lines.push(text);
      }

      const stages = parseArray(entry.stages);
      for (const stage of stages) {
        const item = stage as Record<string, unknown>;
        const label = asString(item.label);
        const body = asString(item.body);
        if (label && body) lines.push(`  - ${label}: ${body}`);
        else if (label || body) lines.push(`  - ${label ?? body}`);
      }

      const notes = parseArray(entry.notes);
      for (const note of notes) {
        const text = asString(note);
        if (text) lines.push(`  - Note: ${text}`);
      }

      const overnight = asString(entry.overnight);
      if (overnight) lines.push(`Overnight: ${overnight}`);

      return lines.join("\n");
    })
    .join("\n\n");
}

// ---------------------------------------------------------------------------
// CatalogContextBuilder
//
// Builds from the same published public catalogue as the frontend
// (`buildPublicCatalogue`: isPublished + editorialStatus published only).
// Drafts and private source/review notes never cross that boundary.
// ---------------------------------------------------------------------------

export class CatalogContextBuilder implements ContextBuilder {
  constructor(private client: typeof prisma = prisma) {}

  async build(locale: AssistantLocale = "en"): Promise<CatalogContext> {
    const catalogue = await buildPublicCatalogue(this.client);
    const tours = pickLocaleRows(catalogue.tours, locale);
    const destinations = pickLocaleRows(catalogue.destinations, locale);
    const posts = pickLocaleRows(catalogue.posts, locale);

    const sections: string[] = [
      `## Tour packages (locale: ${locale})`,
      ...safe(tours).map((tour) => this.formatTour(tour)),
      "## Destinations",
      ...safe(destinations).map((dest) =>
        this.formatEntry(dest, ["name", "location", "overview", "highlights", "thingsToDo", "tourSlugs"]),
      ),
      "## Travel journal",
      ...safe(posts).map((post) =>
        this.formatEntry(post, ["blogTitle", "description", "content"]),
      ),
    ];

    const joined = sections.join("\n\n");
    const truncated = joined.length > env.ASSISTANT_MAX_CONTEXT_CHARS;
    const trimmed = truncated
      ? joined.slice(0, env.ASSISTANT_MAX_CONTEXT_CHARS)
      : joined;

    return {
      sections: [trimmed],
      tokenEstimate: estimateTokens(trimmed),
      builtAt: new Date(),
      truncated,
      locale,
    };
  }

  private formatEntry(row: CatalogRow, fields: string[]): string {
    const lines: string[] = [];
    for (const field of fields) {
      const raw = row[field];
      if (raw === null || raw === undefined || raw === "") continue;
      if (Array.isArray(raw)) {
        const bullets = formatBullets(raw);
        if (bullets) lines.push(`${field}:\n${bullets}`);
        continue;
      }
      lines.push(`${field}: ${String(raw)}`);
    }
    return lines.join("\n");
  }

  private formatTour(row: CatalogRow): string {
    const lines: string[] = [];
    const push = (label: string, value: unknown): void => {
      const text = asString(value);
      if (text) lines.push(`${label}: ${text}`);
    };

    // Public editorial fields only — never adultPrice/childPrice/rating/source notes.
    push("slug", row.slug);
    push("tourName", row.tourName);
    push("overview", row.overview);
    push("duration", row.duration);
    push("style", row.style);
    push("difficulty", row.difficulty);
    push("fit", row.fit);
    push("inquiry", row.inquiry);
    push("notice", row.notice);

    const route = parseArray(row.route);
    if (route.length > 0) {
      const stops = route.map((stop) => String(stop)).filter(Boolean);
      if (stops.length > 0) lines.push(`route: ${stops.join(" → ")}`);
    }

    const facts = parseArray(row.facts);
    if (facts.length > 0) {
      lines.push(
        "facts:\n" +
          facts
            .map((fact) => {
              const item = fact as Record<string, unknown>;
              return `- ${asString(item.label) ?? "?"}: ${asString(item.value) ?? ""}`;
            })
            .join("\n"),
      );
    }

    const introduction = parseArray(row.introduction);
    if (introduction.length > 0) {
      lines.push(`introduction:\n${introduction.map(String).join("\n")}`);
    }

    const highlights = parseArray(row.highlights);
    if (highlights.length > 0) {
      lines.push(
        "highlights:\n" +
          highlights
            .map((highlight) => {
              const item = highlight as Record<string, unknown>;
              return `- ${asString(item.title) ?? ""}: ${asString(item.body) ?? ""}`;
            })
            .join("\n"),
      );
    }

    const preparation = parseArray(row.preparation);
    if (preparation.length > 0) {
      lines.push(`preparation:\n${formatBullets(preparation)}`);
    }

    const included = parseArray(row.included);
    if (included.length > 0) {
      lines.push(`included:\n${formatBullets(included)}`);
    }

    const excluded = parseArray(row.excluded);
    if (excluded.length > 0) {
      lines.push(`excluded:\n${formatBullets(excluded)}`);
    }

    const itinerary = formatItinerary(row.itinerary);
    if (itinerary) lines.push(`itinerary:\n${itinerary}`);

    return lines.join("\n");
  }
}

// ---------------------------------------------------------------------------
// Memoized context cache (keyed by locale)
// ---------------------------------------------------------------------------

type MemoEntry = { expiresAt: number; context: CatalogContext };

const memo = new Map<AssistantLocale, MemoEntry>();
let revision = 0;

export function invalidateCatalogContext(): void {
  memo.clear();
  revision += 1;
}

export async function getCatalogContext(
  builder: ContextBuilder,
  locale: AssistantLocale = "en",
): Promise<CatalogContext> {
  const cached = memo.get(locale);
  if (cached && cached.expiresAt > Date.now()) return cached.context;
  const startedRevision = revision;
  const context = await builder.build(locale);
  if (startedRevision === revision) {
    memo.set(locale, {
      expiresAt: Date.now() + Math.min(env.ASSISTANT_CONTEXT_TTL_MS, 60_000),
      context,
    });
  }
  return context;
}

export function resetForTests(): void {
  invalidateCatalogContext();
}
