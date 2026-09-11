import type { MetadataRoute } from "next";
import { gondarPlacePath, gondarPlaces } from "@/lib/gondar-destinations";
import { journeyPackagePath, journeyPackages } from "@/lib/journey-packages";
import { simienPlacePath, simienPlaces } from "@/lib/simien-destinations";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://gondarsimientours.com";

  const journeyPaths = journeyPackages.map((journey) => journeyPackagePath(journey.slug));
  const simienPlacePaths = simienPlaces.map((place) => simienPlacePath(place.slug));
  const gondarPlacePaths = gondarPlaces.map((place) => gondarPlacePath(place.slug));

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
    ...simienPlacePaths,
    ...gondarPlacePaths,
    ...journeyPaths,
  ];

  return staticPaths.map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : path === "/plan" ? 0.9 : 0.8,
  }));
}
