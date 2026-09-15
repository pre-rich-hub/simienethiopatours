import { describe, expect, it } from "vitest";
import {
  faqPageJsonLd,
  destinationJsonLd,
  howToJsonLd,
  websiteJsonLd,
  pageMetadata,
  absoluteUrl,
  languageAlternates,
  absoluteLanguageAlternates,
  SITE_URL,
  nap,
} from "@/lib/seo";
import { llmsTxtMarkdown } from "@/lib/llms-txt";
import robots from "@/app/robots";
import { INDEX_PATHS } from "@/app/sitemap-paths";

describe("pageMetadata titles", () => {
  it("passes bare title segments (root template owns the brand)", () => {
    const meta = pageMetadata({
      title: "About Us",
      description: "Meet Tevan.",
      path: "/about",
    });
    expect(meta.title).toBe("About Us");
  });

  it("uses absolute titles only when titleAbsolute is set (home)", () => {
    const meta = pageMetadata({
      title: "Gondar Simien Tours | Your Local Gateway to the Simien Mountains",
      description: "Private guided journeys.",
      path: "/",
      titleAbsolute: true,
    });
    expect(meta.title).toEqual({
      absolute: "Gondar Simien Tours | Your Local Gateway to the Simien Mountains",
    });
  });

  it("falls back to the default OG image when image is omitted, not when empty", () => {
    const withDefault = pageMetadata({
      title: "Gondar",
      description: "Royal city.",
      path: "/gondar",
    });
    expect(withDefault.openGraph?.images).toEqual(
      expect.arrayContaining([expect.objectContaining({ url: expect.stringContaining("Sankaber") })]),
    );

    const withoutImage = pageMetadata({
      title: "Explore Ethiopia",
      description: "Northern routes.",
      path: "/explore-ethiopia",
      image: null,
    });
    expect(withoutImage.openGraph?.images).toEqual([]);
  });
});

describe("destinationJsonLd", () => {
  it("emits TouristAttraction with containedInPlace and no invented coordinates", () => {
    const json = destinationJsonLd({
      name: "Imet Gogo",
      description: "A dramatic escarpment viewpoint on the classic Simien corridor.",
      path: "/simien-mountains/imet-gogo",
      location: "Simien Mountains National Park",
      alternateName: ["Imat Gogo"],
      image: "/images/imet-gogo.jpg",
    });

    expect(json).toMatchObject({
      "@type": "TouristAttraction",
      name: "Imet Gogo",
      containedInPlace: { "@type": "Place", name: "Simien Mountains National Park" },
      alternateName: ["Imat Gogo"],
    });
    expect(JSON.stringify(json)).not.toMatch(/geo|GeoCoordinates|latitude|AggregateRating|"price"/i);
  });
});

describe("howToJsonLd", () => {
  it("emits HowTo steps from visible planning copy without inventing tools or prices", () => {
    const json = howToJsonLd({
      name: "Plan Your Simien Journey",
      description: "Tell Tevan your timing and interests.",
      path: "/plan",
      steps: [
        { name: "You share the outline", text: "Dates, group, interests." },
        { name: "Tevan asks useful questions", text: "Walking comfort and priorities." },
        { name: "We shape the journey", text: "A route and quote for current logistics." },
      ],
    });

    expect(json["@type"]).toBe("HowTo");
    expect(json.step).toHaveLength(3);
    expect(json.step[0]).toMatchObject({
      "@type": "HowToStep",
      position: 1,
      name: "You share the outline",
    });
    expect(JSON.stringify(json)).not.toMatch(/AggregateRating|tool|supply|"price"/i);
  });
});

describe("websiteJsonLd", () => {
  it("emits WebSite without SearchAction", () => {
    const json = websiteJsonLd();
    expect(json).toMatchObject({
      "@type": "WebSite",
      name: nap.name,
      url: SITE_URL,
    });
    expect(json.inLanguage).toEqual(["en", "es", "de", "fr"]);
    expect(JSON.stringify(json)).not.toMatch(/SearchAction/);
  });
});

describe("llmsTxtMarkdown", () => {
  it("follows the llms.txt shape with absolute English hub links", () => {
    const body = llmsTxtMarkdown();
    expect(body.startsWith(`# ${nap.name}`)).toBe(true);
    expect(body).toContain(`> Private, locally guided`);
    expect(body).toContain("## Main pages");
    expect(body).toContain(`${SITE_URL}/en/plan`);
    expect(body).toContain(`${SITE_URL}/en/simien-mountains/planning`);
    expect(body).not.toMatch(/AggregateRating|guaranteed sightings/i);
  });
});

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
  it("robots disallow includes /admin for default and AI user-agents", () => {
    const rules = robots();
    const ruleList = Array.isArray(rules.rules) ? rules.rules : [rules.rules];
    expect(ruleList.length).toBeGreaterThan(1);

    for (const rule of ruleList) {
      const disallow = rule.disallow ?? [];
      const list = (Array.isArray(disallow) ? disallow : [disallow]).map(String);
      expect(list.some((p) => p === "/admin" || p.startsWith("/admin"))).toBe(true);
      expect(rule.allow === "/" || (Array.isArray(rule.allow) && rule.allow.includes("/"))).toBe(true);
    }

    const agents = ruleList.flatMap((rule) => {
      const ua = rule.userAgent;
      return Array.isArray(ua) ? ua : [ua];
    });
    expect(agents).toEqual(expect.arrayContaining(["*", "GPTBot", "OAI-SearchBot", "ClaudeBot", "Google-Extended"]));
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
