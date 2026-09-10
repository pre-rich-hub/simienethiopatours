import { Router } from "express";
import { prisma } from "../../config/database.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { ok } from "../../utils/api-response.js";
import {
  decimalToNumber,
  parseJsonArray,
  parseJsonObject,
  setPublicCache,
} from "../../utils/serializers.js";

type TourRow = {
  id: number;
  slug: string;
  tourName: string;
  heroTitle: string | null;
  heroAccent: string | null;
  image: string | null;
  imageAlt: string | null;
  duration: string | null;
  style: string | null;
  difficulty: string | null;
  fit: string | null;
  inquiry: string | null;
  notice: string | null;
  route: string | null;
  facts: string | null;
  introduction: string | null;
  highlights: string | null;
  preparation: string | null;
  related: string | null;
  overview: string | null;
  included: string | null;
  excluded: string | null;
  itinerary: string | null;
  journeyMap: string | null;
  adultPrice: unknown;
  childPrice: unknown;
  discount: string | null;
  rating: unknown;
  noOfRates: number | null;
  isFeatured: boolean | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

// Card shape for list endpoints: enough for a tile, no itinerary/editorial
// payload.
function serializeCard(tour: Partial<TourRow> & Pick<TourRow, "slug" | "tourName" | "isFeatured">) {
  return {
    slug: tour.slug,
    tourName: tour.tourName,
    image: tour.image ?? null,
    duration: tour.duration ?? null,
    style: tour.style ?? null,
    difficulty: tour.difficulty ?? null,
    fit: tour.fit ?? null,
    summary: tour.overview ?? null,
    isFeatured: Boolean(tour.isFeatured),
    adultPrice: decimalToNumber(tour.adultPrice),
    childPrice: decimalToNumber(tour.childPrice),
    rating: decimalToNumber(tour.rating),
  };
}

// Full detail: editorial JSON columns parsed back into arrays/objects.
function serializeDetail(tour: TourRow) {
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
    fit: tour.fit,
    inquiry: tour.inquiry,
    notice: tour.notice,
    route: parseJsonArray<string>(tour.route),
    facts: parseJsonArray<{ label: string; value: string }>(tour.facts),
    introduction: parseJsonArray<string>(tour.introduction),
    highlights: parseJsonArray<{ title: string; body: string }>(tour.highlights),
    preparation: parseJsonArray<string>(tour.preparation),
    related: parseJsonArray<{ title: string; body: string; href?: string }>(tour.related),
    overview: tour.overview,
    included: parseJsonArray<string>(tour.included),
    excluded: parseJsonArray<string>(tour.excluded),
    itinerary: parseJsonArray<{
      title: string;
      subtitle?: string;
      paragraphs: string[];
      overnight?: string;
      notes?: string[];
      stages?: { label: string; body: string }[];
    }>(tour.itinerary),
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
  };
}

// Used by both the card and detail shapes; keeps the select list in one place.
const tourSelect = {
  id: true,
  slug: true,
  tourName: true,
  heroTitle: true,
  heroAccent: true,
  image: true,
  imageAlt: true,
  duration: true,
  style: true,
  difficulty: true,
  fit: true,
  inquiry: true,
  notice: true,
  route: true,
  facts: true,
  introduction: true,
  highlights: true,
  preparation: true,
  related: true,
  overview: true,
  included: true,
  excluded: true,
  itinerary: true,
  journeyMap: true,
  adultPrice: true,
  childPrice: true,
  discount: true,
  rating: true,
  noOfRates: true,
  isFeatured: true,
  isPublished: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const toursRouter = Router();

// GET /api/v1/tours — published tours only, editorial order (sortOrder then id)
toursRouter.get("/", async (_req, res, next) => {
  try {
    const tours = await prisma.tour.findMany({
      where: { isPublished: true },
      select: tourSelect,
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    setPublicCache(res);
    ok(res, tours.map(serializeCard), "Tours fetched");
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tours/featured — the home tiles
toursRouter.get("/featured", async (_req, res, next) => {
  try {
    const tours = await prisma.tour.findMany({
      where: { isPublished: true, isFeatured: true },
      select: tourSelect,
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    setPublicCache(res);
    ok(res, tours.map(serializeCard), "Featured tours fetched");
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tours/slug/:slug — full detail; 404 for unknown or unpublished
toursRouter.get("/slug/:slug", async (req, res, next) => {
  try {
    const tour = await prisma.tour.findFirst({
      where: { slug: req.params.slug, isPublished: true },
      select: tourSelect,
    });
    if (!tour) throw new HttpError(404, "Tour not found");
    setPublicCache(res);
    ok(res, serializeDetail(tour), "Tour fetched");
  } catch (error) {
    next(error);
  }
});