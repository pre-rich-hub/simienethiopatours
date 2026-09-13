import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import type { Server } from "node:http";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import { fail } from "../../utils/api-response.js";
import { HttpError } from "../../middleware/error.middleware.js";

const tourFindMany = vi.fn();
const destinationFindMany = vi.fn();
const adminFindUnique = vi.fn();

vi.mock("../../config/database.js", () => ({
  prisma: {
    tour: { findMany: (...args: unknown[]) => tourFindMany(...args) },
    destination: { findMany: (...args: unknown[]) => destinationFindMany(...args) },
    admin: { findUnique: (...args: unknown[]) => adminFindUnique(...args) },
  },
}));

vi.mock("../../middleware/rate-limit.middleware.js", () => ({
  publicFormLimiter: (_req: unknown, _res: unknown, next: () => void) => next(),
  globalLimiter: (_req: unknown, _res: unknown, next: () => void) => next(),
  loginLimiter: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import { toursRouter } from "../catalog/tours.routes.js";
import { destinationsRouter } from "../catalog/destinations.routes.js";
import { authRouter } from "../auth/auth.routes.js";
import { env } from "../../config/env.js";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1/tours", toursRouter);
  app.use("/api/v1/destinations", destinationsRouter);
  app.use("/api/v1/auth", authRouter);
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof ZodError) {
      return fail(
        res,
        "Validation failed",
        err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
        422,
      );
    }
    if (err instanceof HttpError) {
      return fail(res, err.message, [], err.status);
    }
    return fail(res, err instanceof Error ? err.message : "Internal server error", [], 500);
  });
  return app;
}

async function withServer(run: (base: string) => Promise<void>) {
  const app = buildApp();
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("expected TCP address");
  const base = `http://127.0.0.1:${address.port}`;
  try {
    await run(base);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

describe("public catalogue + auth API contracts", () => {
  beforeEach(() => {
    tourFindMany.mockReset();
    destinationFindMany.mockReset();
    adminFindUnique.mockReset();
  });

  it("GET /api/v1/tours returns published tour cards", async () => {
    tourFindMany.mockResolvedValue([
      {
        id: 1,
        slug: "4-day-simien-classic",
        tourName: "Simien Classic",
        heroTitle: null,
        heroAccent: null,
        image: "/images/imet-gogo.jpg",
        imageAlt: "Escarpment",
        duration: "4 Days",
        style: null,
        difficulty: "Moderate",
        journeyType: null,
        fit: null,
        inquiry: null,
        notice: null,
        route: "[]",
        facts: "[]",
        introduction: "[]",
        highlights: "[]",
        preparation: "[]",
        related: "[]",
        overview: null,
        summary: null,
        itineraryIntro: null,
        itineraryNotes: "[]",
        destinationId: null,
        destinations: [],
        included: "[]",
        excluded: "[]",
        itinerary: "[]",
        journeyMap: null,
        adultPrice: null,
        childPrice: null,
        discount: null,
        rating: null,
        noOfRates: null,
        isFeatured: true,
        isPublished: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/tours`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe("ok");
      expect(body.data).toHaveLength(1);
      expect(body.data[0]).toMatchObject({
        slug: "4-day-simien-classic",
        tourName: "Simien Classic",
      });
      expect(tourFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isPublished: true, editorialStatus: "published" },
        }),
      );
    });
  });

  it("GET /api/v1/destinations returns published destinations", async () => {
    destinationFindMany.mockResolvedValue([
      {
        id: 2,
        slug: "imet-gogo",
        destinationName: "Imet Gogo",
        description: "Highland viewpoint",
        area: "simien",
        type: "viewpoint",
        location: "Simien Mountains",
        alsoKnownAs: "[]",
        heroTitle: null,
        heroAccent: null,
        overview: "[]",
        highlights: "[]",
        thingsToDo: "[]",
        imageUrl: "/images/imet-gogo.jpg",
        imageAlt: "Imet Gogo",
        sourceReferences: "[]",
        isPublished: true,
        sortOrder: 1,
        updatedAt: new Date(),
        _count: { tourLinks: 2 },
      },
    ]);

    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/destinations`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe("ok");
      expect(body.data[0]).toMatchObject({ slug: "imet-gogo", name: "Imet Gogo" });
    });
  });

  it("GET /api/v1/auth/me returns 401 without a session cookie", async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/auth/me`);
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.status).toBe("error");
      expect(adminFindUnique).not.toHaveBeenCalled();
    });
  });

  it("GET /api/v1/auth/me returns 401 for an expired or invalid session token", async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/auth/me`, {
        headers: { cookie: `${env.AUTH_COOKIE_NAME}=not.a.valid.jwt` },
      });
      expect(res.status).toBe(401);
      expect(adminFindUnique).not.toHaveBeenCalled();
    });
  });
});
