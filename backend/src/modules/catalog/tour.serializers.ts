import type { Tour } from "@prisma/client";
import type { TourContent } from "./tour-content.js";
import { decimalToNumber, parseJsonArray } from "../../utils/serializers.js";
type TourRow = Omit<Tour, "editorialStatus" | "editorialSourceNotes"> & { editorialStatus?: string; editorialSourceNotes?: string | null; destinations?: { destinationId: number }[] };

// Card shape for list endpoints: enough for a tile, no itinerary/editorial
// payload.
export function serializeCard(tour: Partial<TourRow> & Pick<TourRow, "slug" | "tourName" | "isFeatured">) {
  return {
    slug: tour.slug,
    tourName: tour.tourName,
    image: tour.image ?? null,
    duration: tour.duration ?? null,
    style: tour.style ?? null,
    difficulty: tour.difficulty ?? null,
    journeyType: tour.journeyType ?? "core-trek",
    fit: tour.fit ?? null,
    summary: tour.summary ?? tour.overview?.split("\n\n")[0] ?? null,
    isFeatured: Boolean(tour.isFeatured),
    adultPrice: decimalToNumber(tour.adultPrice),
    childPrice: decimalToNumber(tour.childPrice),
    rating: decimalToNumber(tour.rating),
  };
}

// Full detail: editorial JSON columns parsed back into arrays/objects.
export function serializeDetail(tour: TourRow) {
  return {
    id: tour.id,
    slug: tour.slug,
    tourName: tour.tourName,
    heroTitle: tour.heroTitle,
    heroAccent: tour.heroAccent,
    image: tour.image,
    imageAlt: tour.imageAlt,
    duration: tour.duration,
    style: tour.style,
    difficulty: tour.difficulty,
    journeyType: (tour.journeyType ?? "core-trek") as TourContent["journeyType"],
    fit: tour.fit,
    inquiry: tour.inquiry,
    notice: tour.notice,
    route: parseJsonArray<string>(tour.route) ?? [],
    facts: parseJsonArray<{ label: string; value: string }>(tour.facts) ?? [],
    introduction: parseJsonArray<string>(tour.introduction) ?? [],
    highlights: parseJsonArray<{ title: string; body: string }>(tour.highlights) ?? [],
    preparation: parseJsonArray<string>(tour.preparation) ?? [],
    related: parseJsonArray<{ title: string; body: string; href?: string }>(tour.related) ?? [],
    overview: tour.overview,
    summary: tour.summary,
    itineraryIntro: tour.itineraryIntro,
    itineraryNotes: parseJsonArray<string>(tour.itineraryNotes) ?? [],
    destinationIds: [...new Set([...(tour.destinationId ? [tour.destinationId] : []), ...(tour.destinations ?? []).map((link) => link.destinationId)])],
    included: parseJsonArray<string>(tour.included) ?? [],
    excluded: parseJsonArray<string>(tour.excluded) ?? [],
    itinerary: (parseJsonArray<{
      title: string;
      subtitle?: string;
      paragraphs: string[];
      overnight?: string;
      dayLabel?: string;
      notes?: string[];
      stages?: { label: string; body: string }[];
    }>(tour.itinerary) ?? []).map((day) => ({ ...day, subtitle: day.subtitle ?? "" })),
    journeyMap: tour.journeyMap,
    adultPrice: decimalToNumber(tour.adultPrice),
    childPrice: decimalToNumber(tour.childPrice),
    discount: tour.discount,
    rating: decimalToNumber(tour.rating),
    noOfRates: tour.noOfRates,
    isFeatured: Boolean(tour.isFeatured),
    isPublished: tour.isPublished,
    sortOrder: tour.sortOrder,
    createdAt: tour.createdAt,
    updatedAt: tour.updatedAt,
  } satisfies TourContent & Record<string, unknown>;
}
