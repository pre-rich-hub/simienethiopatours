import "server-only";
import { getTours, getDestinations, resolveMediaUrl } from "./catalogue";
import { cardBlurb } from "./card-blurb";

export async function getHomeCatalogue(locale: string) {
  const [tours, places] = await Promise.all([getTours(locale), getDestinations(locale)]);
  const tourCards = tours.map((t) => ({
    id: t.slug,
    slug: t.slug,
    href: t.path,
    locale: t.locale,
    title: t.tourName,
    summary: cardBlurb(t.summary ?? t.overview ?? "", 130),
    image: resolveMediaUrl(t.image),
    imageAlt: t.imageAlt ?? "",
    tag: t.duration ?? "",
    detail: cardBlurb(t.fit ?? t.summary ?? "", 160),
    duration: t.duration ?? "",
    style: t.style ?? "",
    difficulty: t.difficulty ?? "",
    fit: t.fit ?? "",
  }));
  const placeCards = places.map((p) => ({
    id: p.slug,
    slug: p.slug,
    href: p.path,
    locale: p.locale,
    title: p.name,
    summary: cardBlurb(p.overview[0] ?? "", 130),
    image: resolveMediaUrl(p.imageUrl),
    imageAlt: p.imageAlt,
    tag: p.type,
    detail: cardBlurb(p.overview[1] ?? p.overview[0] ?? p.location, 160),
    duration: "",
    style: p.location,
    difficulty: "",
    fit: "",
  }));
  const cards = [...tourCards, ...placeCards];
  const select = (slugs: string[]) => slugs.flatMap((slug) => cards.filter((c) => c.slug === slug));

  return {
    horizons: select(["imet-gogo", "gelada-country", "ras-dashen"]).map((c, i) => ({
      ...c,
      short: c.summary,
      tall: i === 0,
    })),
    signatures: cards.filter((c) => tours.some((t) => t.slug === c.slug && t.isFeatured)),
    beyond: select(["gondar-food-coffee", "gondar-running", "timkat-simien"]).map((c) => ({
      ...c,
      body: c.summary,
      image: { src: c.image, alt: c.imageAlt, caption: c.title },
    })),
    collections: [
      { id: "by-time", label: "By time", cards: select(["simien-day-trip", "4-day-simien-classic", "10-day-simien-ras-dashen"]) },
      { id: "by-interest", label: "By interest", cards: select(["3-day-simien-trek", "gelada-country", "simien-photography-expedition"]) },
    ],
  };
}
