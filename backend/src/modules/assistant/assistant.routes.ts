import { createHmac } from "node:crypto";
import { Router } from "express";
import type { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { env, isProduction } from "../../config/env.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { fail, ok } from "../../utils/api-response.js";
import { assistantSchema } from "./assistant.validation.js";
import { loadUsage, runChat } from "./assistant.service.js";
import { requestRetentionSweep } from "../../services/retention.service.js";

export const assistantRouter = Router();

// ---------------------------------------------------------------------------
// Rate limiter — 20 requests per 10 minutes per IP
// ---------------------------------------------------------------------------

const assistantLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return fail(res, "Too many assistant requests. Please try again later.", [], 429);
  },
});

// ---------------------------------------------------------------------------
// SSE helpers
// ---------------------------------------------------------------------------

type SseEvent = "meta" | "delta" | "done" | "error" | "data";

function sseWrite(res: Response, event: SseEvent, data: unknown): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// ---------------------------------------------------------------------------
// IP hashing
// ---------------------------------------------------------------------------

function hashIp(ip: string): string {
  return createHmac("sha256", env.ASSISTANT_IP_HASH_SALT)
    .update(ip)
    .digest("hex");
}

// ---------------------------------------------------------------------------
// Chat handler
// ---------------------------------------------------------------------------

async function handleChatRequest(req: Request, res: Response): Promise<void> {
  try {
    requestRetentionSweep();
    if (!env.ASSISTANT_ENABLED) {
      fail(res, "Assistant is disabled", [], 503);
      return;
    }

    const parsed = assistantSchema.safeParse(req.body);
    if (!parsed.success) {
      fail(
        res,
        "Validation failed",
        parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
        422,
      );
      return;
    }

    const { sessionId, message } = parsed.data;
    const result = await runChat({
      sessionId,
      message,
      ipHash: hashIp(req.ip ?? ""),
    });

    // Handoff (limit reached) — send polite text immediately
    if (result.handoff !== "none") {
      const usage = await loadUsage(result.sessionId);

      if (!env.ASSISTANT_STREAM) {
        ok(res, {
          text: result.politeText ?? "",
          sessionId: result.sessionId,
          messageId: result.messageId,
        }, "Assistant replied");
        return;
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.flushHeaders();
      sseWrite(res, "meta", {
        success: true,
        message: "Assistant reply",
        data: {
          sessionId: result.sessionId,
          messageId: result.messageId,
          resumed: result.resumed,
        },
      });
      sseWrite(res, "delta", { text: result.politeText ?? "" });
      sseWrite(res, "done", {
        sessionId: result.sessionId,
        messageId: result.messageId,
        handoff: { type: result.handoff },
        usage,
      });
      res.end();
      return;
    }

    // Normal streaming response
    const stream = result.stream;
    if (!stream) {
      throw new Error("Assistant stream was not created");
    }

    if (!env.ASSISTANT_STREAM) {
      let text = "";
      for await (const delta of stream) {
        text += delta.text;
      }
      ok(res, {
        text,
        sessionId: result.sessionId,
        messageId: result.messageId,
      }, "Assistant replied");
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.flushHeaders();
    sseWrite(res, "meta", {
      success: true,
      message: "Assistant reply",
      data: {
        sessionId: result.sessionId,
        messageId: result.messageId,
        resumed: result.resumed,
      },
    });

    const onClose = () => result.abort();
    res.on("close", onClose);

    try {
      for await (const delta of stream) {
        sseWrite(res, "delta", { text: delta.text });
      }
    } catch (error) {
      if (!res.destroyed && !res.writableEnded) {
        sseWrite(res, "error", {
          success: false,
          message: error instanceof Error ? error.message : "Assistant reply failed",
          errors: [],
        });
      }
      res.end();
      return;
    } finally {
      res.off("close", onClose);
    }

    const usage = await loadUsage(result.sessionId);
    if (!res.destroyed && !res.writableEnded) {
      sseWrite(res, "done", {
        sessionId: result.sessionId,
        messageId: result.messageId,
        handoff: { type: "none" },
        usage,
      });
    }
    res.end();
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Assistant request failed";

    if (res.headersSent) {
      sseWrite(res, "error", {
        success: false,
        message: isProduction ? "Assistant reply failed" : message,
        errors: [],
      });
      res.end();
    } else {
      fail(res, isProduction ? "Internal server error" : message, [], status);
    }
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

assistantRouter.post("/", assistantLimiter, handleChatRequest);
