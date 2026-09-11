import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/database.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/api-response.js";
import { validate } from "../../middleware/validate.middleware.js";
import { publicFormLimiter } from "../../middleware/rate-limit.middleware.js";

export const subscribersRouter = Router();

const subscriberCreateSchema = z.object({
  body: z.object({
    email: z.string().trim().email("A valid email is required").max(200),
  }),
});

subscribersRouter.post(
  "/",
  publicFormLimiter,
  validate(subscriberCreateSchema),
  asyncHandler(async (req, res) => {
    const email = String((req.body as { email: string }).email).toLowerCase();

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return ok(res, { id: existing.id, alreadySubscribed: true }, "Already subscribed");
    }

    try {
      const subscriber = await prisma.subscriber.create({
        data: { email },
      });
      return ok(res, { id: subscriber.id, alreadySubscribed: false }, "Subscribed");
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
        const row = await prisma.subscriber.findUnique({ where: { email } });
        return ok(res, { id: row?.id ?? existing?.id ?? 0, alreadySubscribed: true }, "Already subscribed");
      }
      throw err;
    }
  }),
);
