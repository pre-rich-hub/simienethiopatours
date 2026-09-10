import { Router } from "express";
import { prisma } from "../../config/database.js";
import { ok } from "../../utils/api-response.js";
import { setPublicCache } from "../../utils/serializers.js";

export const galleryRouter = Router();

// GET /api/v1/gallery — all gallery photographs, all fields
galleryRouter.get("/", async (_req, res, next) => {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { id: "asc" },
    });
    setPublicCache(res);
    ok(res, gallery, "Gallery fetched");
  } catch (error) {
    next(error);
  }
});