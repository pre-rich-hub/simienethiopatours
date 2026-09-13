import { Router } from "express";
import { prisma } from "../../config/database.js";
import { ok } from "../../utils/api-response.js";
import { setPublicCache } from "../../utils/serializers.js";
import { serializeDestination } from "./destination.serializers.js";
import { HttpError } from "../../middleware/error.middleware.js";

export const destinationsRouter = Router();

const destinationSelect = {
  updatedAt: true, id: true, slug: true, destinationName: true, description: true,
  area: true, type: true, location: true, alsoKnownAs: true,
  heroTitle: true, heroAccent: true, overview: true, highlights: true,
  thingsToDo: true, imageUrl: true, imageAlt: true, sourceReferences: true,
  isPublished: true, sortOrder: true,
  _count: { select: { tourLinks: true } },
} as const;

destinationsRouter.get("/", async (_req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
  where: { isPublished: true, editorialStatus: "published" },
      select: destinationSelect,
      orderBy: [{ area: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
    });
    setPublicCache(res);
    ok(res, destinations.map((row) => serializeDestination(row)), "Destinations fetched");
  } catch (error) {
    next(error);
  }
});

destinationsRouter.get("/slug/:slug", async (req, res, next) => {
  try {
    const destination = await prisma.destination.findFirst({
      where: { slug: req.params.slug, isPublished: true, editorialStatus: "published" },
      select: {
        ...destinationSelect,
        tourLinks: {
          where: { tour: { isPublished: true, editorialStatus: "published" } },
          select: { tourId: true, tour: { select: { slug: true, tourName: true, isPublished: true } } },
        },
      },
    });
    if (!destination) throw new HttpError(404, "Destination not found");
    setPublicCache(res);
    ok(res, serializeDestination(destination, true), "Destination fetched");
  } catch (error) {
    next(error);
  }
});
