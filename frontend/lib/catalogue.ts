import { catalogueFromSnapshot } from "../../backend/src/modules/catalog/catalogue-snapshot";
import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { type PublicCatalogue, type PublicTour, type PublicDestination, type PublicPost } from "../../backend/src/modules/catalog/public-catalogue.schema";
import snapshot from "@/lib/generated/catalogue.json";
import type { JourneyPackage } from "@/lib/journey-packages";
import { fetchCatalogue, CatalogueFetchError } from "@/lib/catalogue-fetch";
import { selectLocale } from "@/lib/catalogue-locale";
export type { PublicCatalogue, PublicTour, PublicDestination, PublicPost };
export { selectLocale } from "@/lib/catalogue-locale";

const cachedCatalogue = unstable_cache(async () => fetchCatalogue(), ["public-catalogue-v1"], { revalidate: 60, tags: ["catalogue"] });
export const getCatalogue = cache(async (): Promise<PublicCatalogue> => {
  try { return await cachedCatalogue(); }
  catch (error) {
    if (!(error instanceof CatalogueFetchError) || !error.allowFallback) throw error;
    console.warn(JSON.stringify({ event: "catalogue_fallback", reason: error.kind, version: snapshot.version }));
    return catalogueFromSnapshot(snapshot, process.env.NODE_ENV === "production");
  }
});
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  const origin = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");
  return url.startsWith("/assets/") ? `${origin}${url}` : url;
}
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
export function tourToJourney(tour: PublicTour): JourneyPackage & { locale: PublicTour["locale"]; summary: string; fit: string; preparation: string[]; facts: PublicTour["facts"] } {
  return {
    slug: tour.slug, name: tour.tourName, duration: tour.duration ?? "", route: tour.route.join(" → "),
    difficulty: tour.difficulty ?? "", heroTitle: tour.heroTitle ?? tour.tourName, heroAccent: tour.heroAccent ?? "",
    overview: [tour.overview, ...tour.introduction].filter((v): v is string => Boolean(v)),
    highlights: tour.highlights.map(h => h.body), itineraryMode: "days", days: tour.itinerary,
    itineraryIntro: tour.itineraryIntro ?? undefined, itineraryNotes: tour.itineraryNotes,
    included: tour.included, excluded: tour.excluded, includedNote: tour.notice ?? undefined,
    image: resolveMediaUrl(tour.image), imageAlt: tour.imageAlt ?? "", locale: tour.locale,
    summary: tour.summary ?? tour.overview ?? "", fit: tour.fit ?? "", preparation: tour.preparation, facts: tour.facts,
  };
}
export function destinationToPlace(row: PublicDestination) {
  return { ...row, about: row.overview, image: resolveMediaUrl(row.imageUrl) };
}
