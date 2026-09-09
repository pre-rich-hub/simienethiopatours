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

// ---------------------------------------------------------------------------
// CatalogContextBuilder
//
// Fetches structured data from the database and formats it as sections that
// get injected into the AI system prompt. Customize the queries and field
// mappings below for each client's domain.
// ---------------------------------------------------------------------------

export class CatalogContextBuilder implements ContextBuilder {
  constructor(private client: typeof prisma = prisma) {}

  async build(): Promise<CatalogContext> {
    const [tours, destinations, posts] = await Promise.all([
      this.client.tour.findMany({
        select: {
          tourName: true,
          overview: true,
          included: true,
          excluded: true,
          itinerary: true,
        },
        orderBy: { id: "asc" },
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
      ...safe(tours).map((tour) =>
        this.formatEntry(tour, [
          "tourName",
          "overview",
          "included",
          "excluded",
          "itinerary",
        ]),
      ),
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
