import { describe, expect, it } from "vitest";
import {
  faqPageJsonLd,
  absoluteUrl,
  languageAlternates,
  absoluteLanguageAlternates,
  SITE_URL,
} from "@/lib/seo";
import robots from "@/app/robots";
import { INDEX_PATHS } from "@/app/sitemap-paths";

describe("faqPageJsonLd", () => {
  it("emits FAQPage entities from visible Q&A without inventing ratings or prices", () => {
    const json = faqPageJsonLd([
      {
        question: "Who operates Gondar Simien Tours?",
        answer: "Journeys are operated by Simien Ethio Tours, based in Gondar.",
      },
      {
        question: "How does booking work?",
        answer: "Planning is inquiry-only. Tevan confirms a written proposal for your dates.",
      },
    ]);

    expect(json["@type"]).toBe("FAQPage");
    expect(json.mainEntity).toHaveLength(2);
    expect(json.mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: "Who operates Gondar Simien Tours?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Journeys are operated by Simien Ethio Tours, based in Gondar.",
      },
    });
    expect(JSON.stringify(json)).not.toMatch(/AggregateRating|priceRange|"price"/i);
  });
});

describe("absoluteUrl and hreflang helpers", () => {
  it("builds absolute URLs from SITE_URL without double slashes", () => {
    expect(absoluteUrl("/")).toBe(SITE_URL);
    expect(absoluteUrl("/en/plan")).toBe(`${SITE_URL}/en/plan`);
    expect(absoluteUrl("en/treks")).toBe(`${SITE_URL}/en/treks`);
  });

  it("languageAlternates includes every locale plus x-default", () => {
    const languages = languageAlternates("/plan");
    expect(languages).toMatchObject({
      "x-default": "/en/plan",
      en: "/en/plan",
      es: "/es/plan",
      de: "/de/plan",
      fr: "/fr/plan",
    });
  });

  it("absoluteLanguageAlternates uses absolute URLs for sitemap alternates", () => {
    const languages = absoluteLanguageAlternates("/treks");
    expect(languages["x-default"]).toBe(`${SITE_URL}/en/treks`);
    expect(languages.en).toBe(`${SITE_URL}/en/treks`);
    expect(languages.fr).toBe(`${SITE_URL}/fr/treks`);
  });
});

describe("sitemap inclusion and robots exclusion", () => {
  it("robots disallow includes /admin and does not allow crawling admin", () => {
    const rules = robots();
    const disallow = Array.isArray(rules.rules)
      ? rules.rules.flatMap((r) => r.disallow ?? [])
      : (rules.rules.disallow ?? []);
    const list = (Array.isArray(disallow) ? disallow : [disallow]).map(String);
    expect(list.some((p) => p === "/admin" || p.startsWith("/admin"))).toBe(true);
  });

  it("INDEX_PATHS never includes /admin", () => {
    for (const path of INDEX_PATHS) {
      expect(path.startsWith("/admin")).toBe(false);
      expect(path).not.toContain("/admin/");
    }
  });
});

describe("root locale redirect contract", () => {
  it("uses localePrefix always with default en (forces / → /en)", async () => {
    const { routing } = await import("@/i18n/routing");
    expect(routing.localePrefix).toBe("always");
    expect(routing.defaultLocale).toBe("en");
    expect(routing.locales).toEqual(["en", "es", "de", "fr"]);
  });
});
