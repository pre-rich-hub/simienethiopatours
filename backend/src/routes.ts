import type { Express } from "express";
import { healthRouter } from "./modules/health/health.routes.js";
import { assistantRouter } from "./modules/assistant/assistant.routes.js";

export function registerRoutes(app: Express) {
  app.use("/health", healthRouter);
  app.use("/api/v1/assistant", assistantRouter);

  // Add your module routes here:
  // app.use("/api/v1/tours", toursRouter);
}
