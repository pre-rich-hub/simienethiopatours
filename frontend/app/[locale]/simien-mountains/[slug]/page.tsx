import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DestinationPlaceView } from "@/components/DestinationPlaceView";
import { getDestinationForRoute, getTours, tourToJourney, destinationToPlace, requireContentLocale } from "@/lib/catalogue";
import { catalogueMetadata } from "@/lib/catalogue-seo";
import { localeFromParam } from "@/lib/seo";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const record = await getDestinationForRoute(slug, locale);
  const place = record ? destinationToPlace(record) : null;
  if (!place) return {};
  requireContentLocale(record!, locale);
  return catalogueMetadata({
    locale: localeFromParam(locale),
    title: `${place.name} — Simien Mountains`,
    description: place.about[0] ?? "",
    path: place.path,
    image: place.image ? { url: place.image, alt: place.imageAlt } : undefined,
  }, record!.availableLocales);
}

export default async function SimienPlacePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const record = await getDestinationForRoute(slug, locale);
  const place = record ? destinationToPlace(record) : null;
  if (!place || !record) notFound();
  if (!record.path.startsWith("/simien-mountains/")) permanentRedirect(`/${locale}${record.path}`);
  requireContentLocale(record, locale);
  const routes = (await getTours(locale)).filter((tour) => record.tourSlugs.includes(tour.slug)).map(tourToJourney);
  const appLocale = localeFromParam(locale);

  return (
    <DestinationPlaceView
      place={place}
      locale={appLocale}
      hub={{ eyebrowKey: "simienEyebrow", href: "/simien-mountains", backKey: "backSimien" }}
      routes={routes}
    />
  );
}
