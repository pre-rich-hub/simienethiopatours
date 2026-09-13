import type { RequestHandler } from "express";
import { invalidateCatalogContext } from "../assistant/context-builder.js";

/** Runs after a successful committed mutation, before returning its response. */
export const catalogueInvalidation: RequestHandler = (req, res, next) => {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method) || !/^\/(tours|destinations|blog|blog-categories|translations)(\/|$)/.test(req.path)) return next();
  const send = res.json.bind(res);
  res.json = ((body: unknown) => {
    if (res.statusCode >= 400) return send(body);
    invalidateCatalogContext();
    void (async () => {
      let warning: string | undefined;
      try {
        const url = process.env.CATALOGUE_REVALIDATE_URL;
        const secret = process.env.CATALOGUE_REVALIDATE_SECRET;
        if (!url || !secret) throw new Error("unconfigured");
        const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(2000) });
        if (!response.ok) throw new Error("delivery");
      } catch {
        warning = "Saved. Public cache refresh could not be confirmed; allow up to 60 seconds for refresh.";
        console.warn(JSON.stringify({ event: "catalogue_invalidation_failed", resource: req.path.split("/")[1] }));
      }
      send({ ...(body as object), ...(warning ? { warning } : {}) });
    })();
    return res;
  }) as typeof res.json;
  next();
};
