import { Router } from "express";
import { prisma } from "../../config/database.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { ok } from "../../utils/api-response.js";
import { setPublicCache } from "../../utils/serializers.js";
import { serializeCard, serializeDetail } from "./tour.serializers.js";

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
  journeyType: true,
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
  summary: true,
  itineraryIntro: true,
  itineraryNotes: true,
  destinationId: true,
  destinations: { select: { destinationId: true } },
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
      where: { isPublished: true, editorialStatus: "published" },
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
      where: { isPublished: true, editorialStatus: "published", isFeatured: true },
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
      where: { slug: req.params.slug, isPublished: true, editorialStatus: "published" },
      select: tourSelect,
    });
    if (!tour) throw new HttpError(404, "Tour not found");
    setPublicCache(res);
    ok(res, serializeDetail(tour), "Tour fetched");
  } catch (error) {
    next(error);
  }
});
