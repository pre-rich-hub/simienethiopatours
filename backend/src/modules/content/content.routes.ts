import { Router } from "express";
import { prisma } from "../../config/database.js";
import { ok } from "../../utils/api-response.js";
import { setPublicCache } from "../../utils/serializers.js";

export const contentRouter = Router();

// GET /api/v1/testimonials — public review list. Rows keep their insertion
// order, which matches the original frontend reviews sequence.
contentRouter.get("/", async (_req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      select: {
        id: true,
        reviewerName: true,
        message: true,
        source: true,
        title: true,
        date: true,
        avatarTone: true,
        translatedFrom: true,
      },
      orderBy: { id: "asc" },
    });
    setPublicCache(res);
    ok(res, testimonials, "Testimonials fetched");
  } catch (error) {
    next(error);
  }
});