import { Router } from "express";
import { prisma } from "../../config/database.js";
import { ok } from "../../utils/api-response.js";
import { setPublicCache } from "../../utils/serializers.js";

export const categoriesRouter = Router();
export const blogCategoriesRouter = Router();

// GET /api/v1/categories — tour categories with their tour counts
categoriesRouter.get("/", async (_req, res, next) => {
  try {
    const categories = await prisma.tourCategory.findMany({
      select: {
        id: true,
        categoryName: true,
        slug: true,
        _count: { select: { tours: true } },
      },
      orderBy: { id: "asc" },
    });
    setPublicCache(res);
    ok(
      res,
      categories.map((category) => ({
        id: category.id,
        name: category.categoryName,
        slug: category.slug,
        tourCount: category._count.tours,
      })),
      "Categories fetched",
    );
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/blog-categories — blog categories with their post counts
blogCategoriesRouter.get("/", async (_req, res, next) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { posts: true } },
      },
      orderBy: { id: "asc" },
    });
    setPublicCache(res);
    ok(
      res,
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        postCount: category._count.posts,
      })),
      "Blog categories fetched",
    );
  } catch (error) {
    next(error);
  }
});