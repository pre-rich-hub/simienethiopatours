import { getLocale } from "next-intl/server";
import { HeaderClient } from "./HeaderClient";
import { getTours, getDestinations, resolveMediaUrl } from "@/lib/catalogue";
import { menuSelections } from "@/lib/nav-menus";
import { cardBlurb } from "@/lib/card-blurb";
export async function Header({ light = false }: { light?: boolean }) {
  const locale = await getLocale();
  const [tours, places] = await Promise.all([getTours(locale), getDestinations(locale)]);
  const tourCards = tours.map(row => ({ slug: row.slug, href: row.path, locale: row.locale, tag: row.duration ?? "", title: row.tourName, style: row.style ?? "", summary: cardBlurb(row.summary ?? "", 110), image: resolveMediaUrl(row.image), imageAlt: row.imageAlt ?? "" }));
  const placeCards = places.map(row => ({ slug: row.slug, href: row.path, locale: row.locale, tag: row.type, title: row.name, style: row.location, summary: cardBlurb(row.overview[0] ?? "", 110), image: resolveMediaUrl(row.imageUrl), imageAlt: row.imageAlt }));
  const select = <T extends { slug: string }>(slugs: readonly string[], rows: T[]) => slugs.flatMap(slug => rows.filter(row => row.slug === slug));
  return <HeaderClient light={light} journeyMenuCards={select(menuSelections.journeys, tourCards)} simienMenuCards={select(menuSelections.simien, placeCards)} gondarMenuCards={select(menuSelections.gondar, placeCards.filter(row => places.find(p => p.slug === row.slug)?.area === "gondar"))} publishedPaths={[...tours, ...places].map(row => row.path)} />;
}
