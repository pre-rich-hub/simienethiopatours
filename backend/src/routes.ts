import type { Express } from "express";
import { healthRouter } from "./modules/health/health.routes.js";
import { assistantRouter } from "./modules/assistant/assistant.routes.js";
import { contentRouter } from "./modules/content/content.routes.js";
import { toursRouter } from "./modules/catalog/tours.routes.js";
import { destinationsRouter } from "./modules/catalog/destinations.routes.js";
import { galleryRouter } from "./modules/catalog/gallery.routes.js";
import {
  blogCategoriesRouter,
  categoriesRouter,
} from "./modules/catalog/categories.routes.js";
import { blogRouter } from "./modules/blog/blog.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";

export function registerRoutes(app: Express) {
  app.use("/health", healthRouter);
  app.use("/api/v1/assistant", assistantRouter);
  app.use("/api/v1/testimonials", contentRouter);
  app.use("/api/v1/tours", toursRouter);
  app.use("/api/v1/destinations", destinationsRouter);
  app.use("/api/v1/gallery", galleryRouter);
  app.use("/api/v1/blog", blogRouter);
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/blog-categories", blogCategoriesRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/admin", adminRouter);
}