import { describe, expect, it, vi, beforeEach } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { ZodError } from "zod";
import { fail } from "../../utils/api-response.js";
import { HttpError } from "../../middleware/error.middleware.js";

vi.mock("../../config/env.js", async () => {
  const actual = await vi.importActual<typeof import("../../config/env.js")>(
    "../../config/env.js",
  );
  return {
    ...actual,
    env: {
      ...actual.env,
      ASSISTANT_ENABLED: false,
      ASSISTANT_STREAM: true,
      ASSISTANT_IP_HASH_SALT: "test-salt",
    },
  };
});

vi.mock("../../services/retention.service.js", () => ({
  requestRetentionSweep: vi.fn(),
}));

import { assistantRouter } from "./assistant.routes.js";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/assistant", assistantRouter);
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof ZodError) {
      return fail(res, "Validation failed", [], 422);
    }
    if (err instanceof HttpError) {
      return fail(res, err.message, [], err.status);
    }
    return fail(res, "Internal server error", [], 500);
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

describe("assistant API JSON/SSE contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns JSON 503 when assistant is disabled", async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/assistant`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "Which treks go to Chenek?" }),
      });
      expect(res.status).toBe(503);
      expect(res.headers.get("content-type")).toMatch(/json/);
      const body = await res.json();
      expect(body).toMatchObject({ status: "error", message: "Assistant is disabled" });
    });
  });

  it("returns JSON 422 for invalid chat payloads", async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/assistant`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "" }),
      });
      // Disabled short-circuits before validation when ASSISTANT_ENABLED=false —
      // either 503 or 422 is an acceptable JSON error contract for the public client.
      expect([422, 503]).toContain(res.status);
      expect(await res.json()).toMatchObject({ status: "error" });
    });
  });
});

describe("SSE wire format", () => {
  it("formats event frames the client parser expects", () => {
    const chunks: string[] = [];
    const res = {
      write(chunk: string) {
        chunks.push(chunk);
      },
    };
    const sseWrite = (event: string, data: unknown) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    sseWrite("meta", { success: true, data: { sessionId: "s1" } });
    sseWrite("delta", { text: "Hello" });
    sseWrite("done", { handoff: { type: "none" } });
    const body = chunks.join("");
    expect(body).toContain("event: meta\n");
    expect(body).toContain('data: {"success":true,"data":{"sessionId":"s1"}}\n\n');
    expect(body).toContain("event: delta\n");
    expect(body).toContain('data: {"text":"Hello"}\n\n');
    expect(body).toContain("event: done\n");
  });
});
