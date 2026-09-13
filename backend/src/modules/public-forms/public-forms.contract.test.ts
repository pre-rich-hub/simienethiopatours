import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { ZodError } from "zod";
import { fail } from "../../utils/api-response.js";

const contactCreate = vi.fn();
const subscriberFindUnique = vi.fn();
const subscriberCreate = vi.fn();
const sendContactAdminEmail = vi.fn();
const requestRetentionSweep = vi.fn();

vi.mock("../../config/database.js", () => ({
  prisma: {
    contact: { create: (...args: unknown[]) => contactCreate(...args) },
    subscriber: {
      findUnique: (...args: unknown[]) => subscriberFindUnique(...args),
      create: (...args: unknown[]) => subscriberCreate(...args),
    },
  },
}));

vi.mock("../../services/email.service.js", () => ({
  sendContactAdminEmail: (...args: unknown[]) => sendContactAdminEmail(...args),
}));

vi.mock("../../services/retention.service.js", () => ({
  requestRetentionSweep: (...args: unknown[]) => requestRetentionSweep(...args),
}));

vi.mock("../../middleware/rate-limit.middleware.js", () => ({
  publicFormLimiter: (_req: unknown, _res: unknown, next: () => void) => next(),
  globalLimiter: (_req: unknown, _res: unknown, next: () => void) => next(),
  loginLimiter: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import { contactsRouter } from "./contacts.routes.js";
import { subscribersRouter } from "./subscribers.routes.js";
import { healthRouter } from "../health/health.routes.js";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/health", healthRouter);
  app.use("/api/v1/contacts", contactsRouter);
  app.use("/api/v1/subscribers", subscribersRouter);
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof ZodError) {
      return fail(
        res,
        "Validation failed",
        err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
        422,
      );
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

describe("public forms + health API contract", () => {
  beforeEach(() => {
    contactCreate.mockReset();
    subscriberFindUnique.mockReset();
    subscriberCreate.mockReset();
    sendContactAdminEmail.mockReset();
    requestRetentionSweep.mockReset();
  });

  it("GET /health and /health/ready return ok", async () => {
    await withServer(async (base) => {
      for (const path of ["/health", "/health/ready"]) {
        const res = await fetch(`${base}${path}`);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ status: "ok" });
      }
    });
  });

  it("POST /api/v1/contacts persists inquiry and returns id", async () => {
    contactCreate.mockResolvedValue({ id: 42 });
    sendContactAdminEmail.mockResolvedValue(undefined);

    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/contacts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "QA Traveler",
          email: "qa@example.com",
          message: "Local contract smoke — not a real booking.",
        }),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toMatchObject({
        status: "ok",
        message: "Inquiry received",
        data: { id: 42 },
      });
      expect(contactCreate).toHaveBeenCalledWith({
        data: {
          name: "QA Traveler",
          email: "qa@example.com",
          message: "Local contract smoke — not a real booking.",
        },
      });
      expect(requestRetentionSweep).toHaveBeenCalled();
    });
  });

  it("POST /api/v1/contacts rejects invalid payloads", async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/contacts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "", email: "not-an-email", message: "" }),
      });
      expect(res.status).toBe(422);
      const body = await res.json();
      expect(body.status).toBe("error");
      expect(contactCreate).not.toHaveBeenCalled();
    });
  });

  it("POST /api/v1/subscribers creates or reports already subscribed", async () => {
    subscriberFindUnique.mockResolvedValueOnce(null);
    subscriberCreate.mockResolvedValueOnce({ id: 7, email: "news@example.com" });

    await withServer(async (base) => {
      const created = await fetch(`${base}/api/v1/subscribers`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "News@Example.com" }),
      });
      expect(created.status).toBe(200);
      expect(await created.json()).toMatchObject({
        status: "ok",
        data: { id: 7, alreadySubscribed: false },
      });
      expect(subscriberCreate).toHaveBeenCalledWith({ data: { email: "news@example.com" } });

      subscriberFindUnique.mockResolvedValueOnce({ id: 7, email: "news@example.com" });
      const again = await fetch(`${base}/api/v1/subscribers`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "news@example.com" }),
      });
      expect(again.status).toBe(200);
      expect(await again.json()).toMatchObject({
        data: { id: 7, alreadySubscribed: true },
      });
    });
  });
});
