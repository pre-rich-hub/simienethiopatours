import type { MetadataRoute } from "next";
import { cms } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://gondarsimientours.com";

  // Tour slugs from CMS (published tours only). Fallback: bundled itineraries.
  const tours = await cms.getAllTours();
  const tourPaths = tours.map((t) => `/treks/${t.slug}`);

  const staticPaths = [
    "",
    "/simien-mountains",
    "/treks",
    "/gondar",
    "/ras-dashen",
    "/whats-included",
    "/about",
    "/reviews",
    "/gallery",
    "/travel-guide",
    "/plan",
    "/photo-credits",
    "/beyond-the-trail",
    "/festival-journeys",
    "/gondar-running-experience",
    "/simien-photography-tour",
    "/where-to-stay-gondar-simien",
  ];

  const allPaths = [...staticPaths, ...tourPaths];

  return allPaths.map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : path === "/plan" ? 0.9 : 0.8,
  }));
}
