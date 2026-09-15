import { describe, expect, it } from "vitest";
import { enrichTourRecord } from "./tour-enrichment";
import { enrichDestinationPlace } from "./destination-enrichment";
import snapshot from "./generated/catalogue.json";
import { publicCatalogueSchema } from "./catalogue-contract/public-catalogue.schema";

describe("tour enrichment", () => {
  it("fills empty fit, facts, preparation and related for English core treks", () => {
    const catalogue = publicCatalogueSchema.parse(snapshot.catalogue);
    const classic = catalogue.tours.find((t) => t.slug === "4-day-simien-classic" && t.locale === "en")!;
    expect(classic.preparation).toEqual([]);
    expect(classic.related).toEqual([]);

    const enriched = enrichTourRecord(classic);
    expect(enriched.fit).toMatch(/classic trail/i);
    expect(enriched.facts.length).toBeGreaterThan(0);
    expect(enriched.facts.some((f) => f.label === "Duration")).toBe(true);
    expect(enriched.preparation.length).toBeGreaterThan(0);
    expect(enriched.related.some((r) => r.href === "/treks/3-day-simien-trek")).toBe(true);
  });

  it("does not invent English fit copy for other locales", () => {
    const catalogue = publicCatalogueSchema.parse(snapshot.catalogue);
    const spanish = catalogue.tours.find((t) => t.slug === "royal-gondar" && t.locale === "es");
    if (!spanish) return;
    const enriched = enrichTourRecord(spanish);
    expect(enriched.fit == null || enriched.fit === "").toBe(true);
    expect(enriched.facts.length).toBeGreaterThan(0);
  });
});

describe("destination enrichment", () => {
  it("adds a practical about paragraph for thin English destinations", () => {
    const place = {
      slug: "debre-berhan-selassie",
      name: "Debre Berhan Selassie",
      about: ["Short overview under four hundred characters for the church."],
      highlights: ["Famous painted ceiling", "Historic church"],
      thingsToDo: ["Visit with a guide"],
      heroTitle: "Debre Berhan",
      heroAccent: "Selassie.",
      location: "Gondar",
      image: "/x.jpg",
      imageAlt: "Church",
      alsoKnownAs: [] as string[],
      path: "/gondar/debre-berhan-selassie",
    };
    const enriched = enrichDestinationPlace(place, "en");
    expect(enriched.about.length).toBe(2);
    expect(enriched.highlights[0].length).toBeGreaterThan(40);
  });
});
