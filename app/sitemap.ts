import type { MetadataRoute } from "next";
import { detailedJourneys } from "@/lib/itineraries";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://gondarsimientours.com";
  return ["", "/simien-mountains", "/treks", "/gondar", "/ras-dashen", "/whats-included", "/about", "/reviews", "/gallery", "/travel-guide", "/plan", "/photo-credits", "/beyond-the-trail", "/festival-journeys", "/gondar-running-experience", "/simien-photography-tour", "/where-to-stay-gondar-simien", ...detailedJourneys.map(({ slug }) => `/treks/${slug}`)].map((path, index) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: index === 0 ? "weekly" : "monthly", priority: index === 0 ? 1 : path === "/plan" ? .9 : .8 }));
}
