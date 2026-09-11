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
    "/about",
    "/gallery",
    "/plan",
    "/privacy",
    "/terms",
  ];

  const allPaths = [...staticPaths, ...tourPaths];

  return allPaths.map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : path === "/plan" ? 0.9 : 0.8,
  }));
}
