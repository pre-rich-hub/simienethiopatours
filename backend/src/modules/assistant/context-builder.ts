import { prisma } from "../../config/database.js";
import { env } from "../../config/env.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CatalogContext = {
  sections: string[];
  tokenEstimate: number;
  builtAt: Date;
  truncated: boolean;
};

export interface ContextBuilder {
  build(): Promise<CatalogContext>;
}

type CatalogRow = Record<string, unknown>;

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
          ? `# Day ${index + 1}: ${title} — ${subtitle}`
          : `# Day ${index + 1}: ${title}`,
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
// Fetches structured data from the database and formats it as sections that
// get injected into the AI system prompt. Rich tour fields (itinerary, route,
// facts, introduction, highlights, preparation, included/excluded) are stored
// as JSON text and parsed back into readable markdown here.
// ---------------------------------------------------------------------------

export class CatalogContextBuilder implements ContextBuilder {
  constructor(private client: typeof prisma = prisma) {}

  async build(): Promise<CatalogContext> {
    const [tours, destinations, posts] = await Promise.all([
      this.client.tour.findMany({
        select: {
          tourName: true,
          overview: true,
          duration: true,
          style: true,
          difficulty: true,
          fit: true,
          inquiry: true,
          notice: true,
          route: true,
          facts: true,
          introduction: true,
          highlights: true,
          preparation: true,
          included: true,
          excluded: true,
          itinerary: true,
        },
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      }),
      this.client.destination.findMany({
        select: { destinationName: true, description: true },
        orderBy: { id: "asc" },
      }),
      this.client.blog.findMany({
        select: { blogTitle: true, description: true, content: true },
        orderBy: { id: "asc" },
      }),
    ]);

    const sections: string[] = [
      "## Tour packages",
      ...safe(tours).map((tour) => this.formatTour(tour)),
      "## Destinations",
      ...safe(destinations).map((dest) =>
        this.formatEntry(dest, ["destinationName", "description"]),
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
    };
  }

  private formatEntry(row: CatalogRow, fields: string[]): string {
    const lines: string[] = [];
    for (const field of fields) {
      const raw = row[field];
      if (raw === null || raw === undefined || raw === "") continue;
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
// Memoized context cache
// ---------------------------------------------------------------------------

type MemoEntry = { expiresAt: number; context: CatalogContext };

let memo: MemoEntry | null = null;

export async function getCatalogContext(
  builder: ContextBuilder,
): Promise<CatalogContext> {
  if (memo && memo.expiresAt > Date.now()) return memo.context;
  const context = await builder.build();
  memo = { expiresAt: Date.now() + env.ASSISTANT_CONTEXT_TTL_MS, context };
  return context;
}

export function resetForTests(): void {
  memo = null;
}