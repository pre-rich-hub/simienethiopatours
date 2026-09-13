import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { selectLocale } from "@/lib/catalogue-locale";

type Snapshot = {
  catalogue: {
    tours: Array<{ slug: string; locale: string }>;
    destinations: Array<{ slug: string; locale: string; tourSlugs: string[] }>;
  };
};

const snapshot = JSON.parse(
  readFileSync(join(process.cwd(), "lib/generated/catalogue.json"), "utf8"),
) as Snapshot;

describe("destination–tour slug relationships", () => {
  it("every destination tourSlug references a published tour slug", () => {
    const tourSlugs = new Set(snapshot.catalogue.tours.map((t) => t.slug));
    let linked = 0;
    for (const destination of snapshot.catalogue.destinations) {
      for (const slug of destination.tourSlugs ?? []) {
        expect(tourSlugs.has(slug), `${destination.slug} → missing tour ${slug}`).toBe(true);
        linked += 1;
      }
    }
    expect(linked).toBeGreaterThan(0);
  });

  it("EN destinations with links keep the same tourSlugs across locales when present", () => {
    const byLocale = new Map<string, typeof snapshot.catalogue.destinations>();
    for (const row of snapshot.catalogue.destinations) {
      const list = byLocale.get(row.locale) ?? [];
      list.push(row);
      byLocale.set(row.locale, list);
    }
    const en = byLocale.get("en") ?? [];
    const linked = en.filter((d) => (d.tourSlugs?.length ?? 0) > 0);
    expect(linked.length).toBeGreaterThan(0);
    for (const dest of linked.slice(0, 5)) {
      for (const locale of ["es", "de", "fr"]) {
        const localized = (byLocale.get(locale) ?? []).find((d) => d.slug === dest.slug);
        if (!localized) continue;
        expect(new Set(localized.tourSlugs)).toEqual(new Set(dest.tourSlugs));
      }
    }
  });
});

describe("CMS locale fallback helpers", () => {
  it("selectLocale prefers exact locale and fills missing slugs from English", () => {
    const rows = [
      { slug: "a", locale: "en", label: "A-en" },
      { slug: "b", locale: "en", label: "B-en" },
      { slug: "a", locale: "es", label: "A-es" },
    ];
    expect(selectLocale(rows, "en").map((r) => r.label)).toEqual(["A-en", "B-en"]);
    expect(selectLocale(rows, "es").map((r) => r.label)).toEqual(["A-es", "B-en"]);
  });
});
