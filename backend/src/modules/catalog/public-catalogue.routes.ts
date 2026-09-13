import { Router } from "express";
import { buildPublicCatalogue } from "./public-catalogue.js";
import { ok } from "../../utils/api-response.js";
export const publicCatalogueRouter = Router();
publicCatalogueRouter.get("/", async (_req, res, next) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    ok(res, await buildPublicCatalogue());
  } catch (error) { next(error); }
});
