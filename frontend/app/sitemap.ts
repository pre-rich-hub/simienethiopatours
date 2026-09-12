import type { MetadataRoute } from "next";
import { gondarPlacePath, gondarPlaces } from "@/lib/gondar-destinations";
import { journeyPackagePath, journeyPackages } from "@/lib/journey-packages";
import { simienPlacePath, simienPlaces } from "@/lib/simien-destinations";
import { absoluteUrl } from "@/lib/seo";

/** Indexable public routes only. Privacy/terms are noindex; admin is omitted. */
const INDEX_PATHS = [
  "/",
  "/simien-mountains",
  "/treks",
  "/gondar",
  "/about",
  "/gallery",
  "/plan",
] as const;

function sitemapEntry(path: string): MetadataRoute.Sitemap[number] {
  const isHome = path === "/";
  const isHub = INDEX_PATHS.includes(path as (typeof INDEX_PATHS)[number]);
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: isHome ? "weekly" : "monthly",
    priority: isHome ? 1 : path === "/plan" ? 0.9 : isHub ? 0.8 : 0.7,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const placeAndJourneyPaths = [
    ...simienPlaces.map((place) => simienPlacePath(place.slug)),
    ...gondarPlaces.map((place) => gondarPlacePath(place.slug)),
    ...journeyPackages.map((journey) => journeyPackagePath(journey.slug)),
  ];

  return [...INDEX_PATHS, ...placeAndJourneyPaths].map(sitemapEntry);
}
