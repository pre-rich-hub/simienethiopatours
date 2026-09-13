// Type-only import keeps the server's validator out of the browser bundle.
export type { TourContent, TourDay } from "../../backend/src/modules/catalog/tour-content";
import type { TourContent } from "../../backend/src/modules/catalog/tour-content";
import { journeyPackages, type JourneyPackage } from "@/lib/journey-packages";

type JourneyType = TourContent["journeyType"];
const typeSets: Record<JourneyType, string[]> = {
  "core-trek": ["simien-day-trip", "simien-introduction", "3-day-simien-trek", "4-day-simien-classic", "5-day-gondar-simien", "gondar-heritage-simien"],
  "summit-expedition": ["ras-dashen-challenge", "ras-dashen-expedition", "simien-ras-dashen-8-day", "10-day-simien-ras-dashen", "timkat-ras-dashen"],
  "wildlife-journey": ["gelada-country", "simien-wildlife-journey"],
  "photography-journey": ["simien-photography-day", "wildlife-landscape-photography", "simien-photography-expedition", "gondar-photography-walk"],
  "gondar-cultural": ["royal-gondar", "gondar-through-local-eyes", "gondar-food-coffee", "gondar-history-culture", "gondar-market-local-life", "gondar-kosoye", "gondar-running"],
  "seasonal-festival": ["timkat-simien", "genna-simien", "meskel-simien"],
  "private-combination": ["mountains-sacred-stone"],
};
export function journeyTypeForSlug(slug: string): JourneyType {
  const match = Object.entries(typeSets).find(([, slugs]) => slugs.includes(slug));
  if (!match) throw new Error(`Unclassified journey slug: ${slug}`);
  return match[0] as JourneyType;
}

/** Bundled copy is an input adapter, not a separate CMS contract. Day trips
 * become a single programme with stages; grouped days retain dayLabel. */
export function journeyToTourContent(journey: JourneyPackage, sortOrder = 0): TourContent {
  return {
    slug: journey.slug, tourName: journey.name,
    summary: journey.overview[0] ?? null, overview: journey.overview[0] ?? null,
    introduction: journey.overview.slice(1),
    heroTitle: journey.heroTitle, heroAccent: journey.heroAccent,
    duration: journey.duration, difficulty: journey.difficulty,
    journeyType: journeyTypeForSlug(journey.slug),
    style: null, fit: null,
    image: journey.image, imageAlt: journey.imageAlt,
    inquiry: journey.slug, notice: journey.includedNote ?? null,
    route: journey.route.split(" → "),
    facts: [],
    highlights: journey.highlights.map((body, index) => ({ title: String(index + 1).padStart(2, "0"), body })),
    itinerary: journey.days ?? [{ title: journey.name, subtitle: journey.duration, paragraphs: journey.outline ?? [], stages: journey.segments }],
    itineraryIntro: journey.itineraryIntro ?? null,
    itineraryNotes: journey.itineraryNotes ?? [],
    included: journey.included, excluded: journey.excluded,
    preparation: [], related: [], destinationIds: [],
    isPublished: true,
    isFeatured: ["3-day-simien-trek", "4-day-simien-classic", "ras-dashen-challenge"].includes(journey.slug),
    sortOrder,
  };
}
export const approvedTourContents = journeyPackages.map((journey, index) => journeyToTourContent(journey, index + 1));
