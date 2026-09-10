import { Router } from "express";
import { prisma } from "../../config/database.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { ok } from "../../utils/api-response.js";
import { setPublicCache } from "../../utils/serializers.js";

export const blogRouter = Router();

const blogSelect = {
  id: true,
  slug: true,
  blogTitle: true,
  description: true,
  content: true,
  imageUrl: true,
  href: true,
  categoryId: true,
  createdAt: true,
  category: { select: { name: true } },
} as const;

type BlogRow = {
  id: number;
  slug: string;
  blogTitle: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  href: string | null;
  categoryId: number | null;
  createdAt: Date;
  category: { name: string } | null;
};

function serializePost(post: BlogRow) {
  return {
    id: post.id,
    slug: post.slug,
    blogTitle: post.blogTitle,
    description: post.description,
    content: post.content,
    imageUrl: post.imageUrl,
    href: post.href,
    categoryId: post.categoryId,
    categoryName: post.category?.name ?? null,
    createdAt: post.createdAt,
  };
}

// GET /api/v1/blog — all posts, newest first, with category name
blogRouter.get("/", async (_req, res, next) => {
  try {
    const posts = await prisma.blog.findMany({
      select: blogSelect,
      orderBy: { createdAt: "desc" },
    });
    setPublicCache(res);
    ok(res, posts.map(serializePost), "Blog posts fetched");
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/blog/slug/:slug — single post; 404 for unknown slugs
blogRouter.get("/slug/:slug", async (req, res, next) => {
  try {
    const post = await prisma.blog.findFirst({
      where: { slug: req.params.slug },
      select: blogSelect,
    });
    if (!post) throw new HttpError(404, "Blog post not found");
    setPublicCache(res);
    ok(res, serializePost(post), "Blog post fetched");
  } catch (error) {
    next(error);
  }
});