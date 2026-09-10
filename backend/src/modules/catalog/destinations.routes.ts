import { Router } from "express";
import { prisma } from "../../config/database.js";
import { ok } from "../../utils/api-response.js";
import { setPublicCache } from "../../utils/serializers.js";

export const destinationsRouter = Router();

// GET /api/v1/destinations — public destination list
destinationsRouter.get("/", async (_req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
      select: {
        id: true,
        slug: true,
        destinationName: true,
        description: true,
        imageUrl: true,
      },
      orderBy: { id: "asc" },
    });
    setPublicCache(res);
    ok(res, destinations, "Destinations fetched");
  } catch (error) {
    next(error);
  }
});