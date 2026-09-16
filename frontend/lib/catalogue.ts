import { catalogueFromSnapshot } from "@/lib/catalogue-contract/catalogue-snapshot";
import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { type PublicCatalogue, type PublicTour, type PublicDestination, type PublicPost } from "@/lib/catalogue-contract/public-catalogue.schema";
import snapshot from "@/lib/generated/catalogue.json";
import type { JourneyPackage } from "@/lib/journey-packages";
import { fetchCatalogue, CatalogueFetchError } from "@/lib/catalogue-fetch";
import { selectLocale } from "@/lib/catalogue-locale";
import { resolveMediaUrl } from "@/lib/media-url";
import { enrichTourRecord } from "@/lib/tour-enrichment";
export { resolveMediaUrl };
export type { PublicCatalogue, PublicTour, PublicDestination, PublicPost };
export { selectLocale };

// Keep approved client assets visible while a CMS catalogue is being refreshed.
// The backend importer writes these values to the tour records; this fallback
// also covers an older local/exported catalogue that still has null or stale media.
const journeyImageOverrides: Record<string, { url: string; alt: string }> = {
  "southern-ethiopia-journey": {
    // Cloudinary public_id still has the missing leading "S"; rename on re-upload.
    url: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465911/outhern-Ethiopia-Journey.jpg",
    alt: "Southern Ethiopia landscapes and road journey",
  },
  "bale-mountains-extension": {
    url: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386863/bale-mountains-national-park.jpg",
    alt: "Bale Mountains National Park landscape",
  },
  "northern-ethiopia-long-way-north": {
    url: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465910/Northern-Ethiopia.jpg",
    alt: "Northern Ethiopia highland and historic landscapes",
  },
  "gheralta-tigray-extension": {
    url: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465909/Gheralta.jpg",
    alt: "Gheralta sandstone cliffs and rock churches in Tigray",
  },
  "ras-dashen-add-on": {
    url: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465918/Ras-Dashen-Add-on.png",
    alt: "Ras Dashen trekking landscape in the Simien Mountains",
  },
  "run-the-simien-7-days": {
    url: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465910/run-simien.jpg",
    alt: "Trail running in the Simien Mountains",
  },
  "timkat-simien": {
    url: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465909/timket.jpg",
    alt: "Timkat celebration in Gondar",
  },
  "timkat-ras-dashen": {
    url: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465909/timket.jpg",
    alt: "Timkat celebration in Gondar",
  },
};

export function tourMedia(tour: Pick<PublicTour, "slug" | "image" | "imageAlt">) {
  const override = journeyImageOverrides[tour.slug];
  return {
    image: resolveMediaUrl(override?.url || tour.image || null),
    imageAlt: override?.alt || tour.imageAlt || "",
  };
}

type CatalogueLoad =
  | { ok: true; data: PublicCatalogue }
  | { ok: false; kind: CatalogueFetchError["kind"]; allowFallback: boolean };

/** Catch inside the cache so API-down does not surface as a Next.js error overlay. */
const cachedCatalogue = unstable_cache(async (): Promise<CatalogueLoad> => {
  try {
    return { ok: true, data: await fetchCatalogue() };
  } catch (error) {
    if (error instanceof CatalogueFetchError) {
      return { ok: false, kind: error.kind, allowFallback: error.allowFallback };
    }
    return { ok: false, kind: "network", allowFallback: true };
  }
}, ["public-catalogue-v2"], { revalidate: 60, tags: ["catalogue"] });

export const getCatalogue = cache(async (): Promise<PublicCatalogue> => {
  const result = await cachedCatalogue();
  const fallback = () => {
    console.warn(JSON.stringify({ event: "catalogue_fallback", reason: result.ok ? "missing_explore" : result.kind, version: snapshot.version }));
    return catalogueFromSnapshot(snapshot, process.env.NODE_ENV === "production");
  };

  if (result.ok) {
    const hasExploreHub = result.data.destinations.some(
      (row) => row.area === "explore" || row.area === "southern",
    );
    if (result.data.destinations.length > 0 && hasExploreHub) return result.data;
    return fallback();
  }
  if (!result.allowFallback) throw new CatalogueFetchError(result.kind, false);
  return fallback();
});
export function requireContentLocale<T extends { locale: string; path: string }>(record: T, locale: string): T {
  if (record.locale !== locale) redirect(`/${record.locale}${record.path}`);
  return record;
}
export async function getTours(locale = "en") {
  return selectLocale((await getCatalogue()).tours, locale);
}
export async function getTour(slug: string, locale = "en") { return (await getTours(locale)).find(row => row.slug === slug) ?? null; }
export async function getDestinations(locale = "en", area?: string) {
  return selectLocale((await getCatalogue()).destinations, locale).filter(row => !area || row.area === area);
}
export async function getDestination(slug: string, locale = "en") { return (await getDestinations(locale)).find(row => row.slug === slug) ?? null; }
export async function getPosts(locale = "en") { return selectLocale((await getCatalogue()).posts, locale); }
export async function getTourForRoute(slug: string, locale = "en") {
  const catalogue = await getCatalogue();
  return catalogue.tours.find(row => row.slug === slug && row.locale === locale)
    ?? catalogue.tours.find(row => row.slug === slug && row.locale === "en") ?? null;
}
export async function getDestinationForRoute(slug: string, locale = "en") {
  const catalogue = await getCatalogue();
  return catalogue.destinations.find(row => row.slug === slug && row.locale === locale)
    ?? catalogue.destinations.find(row => row.slug === slug && row.locale === "en") ?? null;
}
export async function getPostForRoute(slug: string, locale = "en") {
  const catalogue = await getCatalogue();
  return catalogue.posts.find(row => row.slug === slug && row.locale === locale)
    ?? catalogue.posts.find(row => row.slug === slug && row.locale === "en") ?? null;
}
export function tourToJourney(tour: PublicTour): JourneyPackage & { locale: PublicTour["locale"]; summary: string; fit: string; preparation: string[]; facts: PublicTour["facts"]; journeyType: PublicTour["journeyType"] } {
  const enriched = enrichTourRecord(tour);
  const media = tourMedia(enriched);
  return {
    slug: enriched.slug, name: enriched.tourName, duration: enriched.duration ?? "", route: enriched.route.join(" → "),
    difficulty: enriched.difficulty ?? "", heroTitle: enriched.heroTitle ?? enriched.tourName, heroAccent: enriched.heroAccent ?? "",
    overview: [enriched.overview, ...enriched.introduction].filter((v): v is string => Boolean(v)),
    highlights: enriched.highlights.map(h => h.body), itineraryMode: "days", days: enriched.itinerary,
    itineraryIntro: enriched.itineraryIntro ?? undefined, itineraryNotes: enriched.itineraryNotes,
    included: enriched.included, excluded: enriched.excluded, includedNote: enriched.notice ?? undefined,
    image: media.image, imageAlt: media.imageAlt, locale: enriched.locale,
    summary: enriched.summary ?? enriched.overview ?? "", fit: enriched.fit ?? "", preparation: enriched.preparation, facts: enriched.facts,
    journeyType: enriched.journeyType,
  };
}
export function destinationToPlace(row: PublicDestination) {
  return { ...row, about: row.overview, image: resolveMediaUrl(row.imageUrl) };
}
