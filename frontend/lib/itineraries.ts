import type { Feature, ItineraryDay } from "@/components/Editorial";
import { approvedTourContents, type TourContent } from "@/lib/tour-content";

export type JourneyDetail = {
  slug: string; inquiry: string; title: string; heroTitle: string; heroAccent: string;
  description: string; image: string; imageAlt: string; duration: string; route: string[];
  facts: { label: string; value: string }[]; introduction: string[];
  days: ItineraryDay[]; highlights: Feature[]; preparation: string[]; inclusions: string[];
  exclusions?: string[]; notice?: string; related?: Feature[];
  summary?: string; itineraryIntro?: string; itineraryNotes?: string[];
};

// One approved catalogue feeds the public pages, CMS fallback and database seed.
export function tourContentToJourneyDetail(tour: TourContent): JourneyDetail {
  return {
    slug: tour.slug, inquiry: tour.inquiry ?? tour.slug, title: tour.tourName,
    heroTitle: tour.heroTitle ?? tour.tourName, heroAccent: tour.heroAccent ?? "",
    description: tour.overview ?? "", summary: tour.summary ?? "",
    image: tour.image ?? "", imageAlt: tour.imageAlt ?? "",
    duration: tour.duration ?? "", route: tour.route,
    facts: tour.facts, introduction: tour.introduction,
    days: tour.itinerary, highlights: tour.highlights, preparation: tour.preparation,
    inclusions: tour.included, exclusions: tour.excluded,
    notice: tour.notice ?? undefined, related: tour.related,
    itineraryIntro: tour.itineraryIntro ?? undefined, itineraryNotes: tour.itineraryNotes,
  };
}
export const detailedJourneys = approvedTourContents.map(tourContentToJourneyDetail);

export const timkatDays: ItineraryDay[] = detailedJourneys.find((journey) => journey.slug === "timkat-simien")!.days;
