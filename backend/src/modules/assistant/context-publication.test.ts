import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../config/env.js", () => ({
  env: { ASSISTANT_CONTEXT_TTL_MS: 300000, ASSISTANT_MAX_CONTEXT_CHARS: 100000 },
}));

vi.mock("../catalog/public-catalogue.js", () => ({
  buildPublicCatalogue: vi.fn(),
}));

import { buildPublicCatalogue } from "../catalog/public-catalogue.js";
import {
  CatalogContextBuilder,
  getCatalogContext,
  invalidateCatalogContext,
  pickLocaleRows,
} from "./context-builder.js";

const mockCatalogue = buildPublicCatalogue as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  invalidateCatalogContext();
  mockCatalogue.mockReset();
});

describe("assistant catalogue invalidation", () => {
  it("rebuilds after publication invalidation", async () => {
    const build = vi.fn(async () => ({
      sections: ["published"],
      tokenEstimate: 1,
      builtAt: new Date(),
      truncated: false,
      locale: "en" as const,
    }));
    await getCatalogContext({ build });
    await getCatalogContext({ build });
    expect(build).toHaveBeenCalledTimes(1);
    invalidateCatalogContext();
    await getCatalogContext({ build });
    expect(build).toHaveBeenCalledTimes(2);
  });

  it("does not cache an in-flight result invalidated by an admin mutation", async () => {
    let release!: () => void;
    const build = vi.fn(async () => {
      await new Promise<void>((r) => {
        release = r;
      });
      return {
        sections: [],
        tokenEstimate: 0,
        builtAt: new Date(),
        truncated: false,
        locale: "en" as const,
      };
    });
    const pending = getCatalogContext({ build });
    invalidateCatalogContext();
    release();
    await pending;
    const second = getCatalogContext({ build });
    expect(build).toHaveBeenCalledTimes(2);
    release();
    await second;
  });

  it("caches locales independently", async () => {
    const build = vi.fn(async (locale = "en") => ({
      sections: [locale],
      tokenEstimate: 1,
      builtAt: new Date(),
      truncated: false,
      locale: locale as "en" | "es",
    }));
    await getCatalogContext({ build }, "en");
    await getCatalogContext({ build }, "es");
    await getCatalogContext({ build }, "en");
    expect(build).toHaveBeenCalledTimes(2);
    expect(build).toHaveBeenNthCalledWith(1, "en");
    expect(build).toHaveBeenNthCalledWith(2, "es");
  });
});

describe("pickLocaleRows", () => {
  it("prefers the requested locale and falls back to English", () => {
    const rows = [
      { slug: "a", locale: "en", name: "EN-A" },
      { slug: "a", locale: "es", name: "ES-A" },
      { slug: "b", locale: "en", name: "EN-B" },
    ];
    expect(pickLocaleRows(rows, "es")).toEqual([
      { slug: "a", locale: "es", name: "ES-A" },
      { slug: "b", locale: "en", name: "EN-B" },
    ]);
    expect(pickLocaleRows(rows, "en")).toEqual([
      { slug: "a", locale: "en", name: "EN-A" },
      { slug: "b", locale: "en", name: "EN-B" },
    ]);
  });
});

describe("CatalogContextBuilder publication boundary", () => {
  it("builds from published public catalogue fields and omits drafts/internal notes/prices", async () => {
    mockCatalogue.mockResolvedValue({
      schemaVersion: 1,
      tours: [
        {
          slug: "4-day-simien-classic",
          tourName: "4-Day Simien Classic",
          locale: "en",
          overview: "Classic corridor",
          duration: "4 Days",
          style: null,
          difficulty: "Moderate",
          fit: null,
          inquiry: null,
          notice: null,
          route: ["Gondar", "Chenek"],
          facts: [],
          introduction: [],
          highlights: [{ title: "01", body: "Imet Gogo" }],
          preparation: [],
          included: ["Park fees"],
          excluded: ["Flights"],
          itinerary: [],
          adultPrice: 999,
          childPrice: 500,
          rating: 4.9,
          editorialSourceNotes: "PRIVATE — never publish",
          sourceNotes: "INTERNAL",
        },
        {
          slug: "4-day-simien-classic",
          tourName: "Clásico de 4 días",
          locale: "es",
          overview: "Corredor clásico",
          duration: "4 días",
          style: null,
          difficulty: "Moderado",
          fit: null,
          inquiry: null,
          notice: null,
          route: ["Gondar", "Chenek"],
          facts: [],
          introduction: [],
          highlights: [],
          preparation: [],
          included: ["Entradas al parque"],
          excluded: [],
          itinerary: [],
        },
      ],
      destinations: [
        {
          slug: "imet-gogo",
          name: "Imet Gogo",
          locale: "en",
          location: "Simien",
          overview: ["Viewpoint"],
          highlights: ["Ridges"],
          thingsToDo: ["Walk"],
          tourSlugs: ["4-day-simien-classic"],
        },
      ],
      posts: [],
    });

    const builder = new CatalogContextBuilder({} as never);
    const en = await builder.build("en");
    const text = en.sections.join("\n");
    expect(text).toContain("4-Day Simien Classic");
    expect(text).toContain("Park fees");
    expect(text).toContain("Imet Gogo");
    expect(text).not.toContain("PRIVATE");
    expect(text).not.toContain("INTERNAL");
    expect(text).not.toContain("999");
    expect(text).not.toContain("adultPrice");
    expect(text).not.toContain("Clásico de 4 días");

    const es = await builder.build("es");
    expect(es.sections.join("\n")).toContain("Clásico de 4 días");
    expect(es.sections.join("\n")).toContain("Entradas al parque");
    expect(mockCatalogue).toHaveBeenCalled();
  });
});
