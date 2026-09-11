import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/database.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/api-response.js";
import { validate } from "../../middleware/validate.middleware.js";
import { publicFormLimiter } from "../../middleware/rate-limit.middleware.js";
import { sendContactAdminEmail } from "../../services/email.service.js";

export const contactsRouter = Router();

const contactCreateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().email("A valid email is required").max(200),
    message: z.string().trim().min(1, "Message is required").max(8000),
  }),
});

contactsRouter.post(
  "/",
  publicFormLimiter,
  validate(contactCreateSchema),
  asyncHandler(async (req, res) => {
    const { name, email, message } = req.body as {
      name: string;
      email: string;
      message: string;
    };

    const contact = await prisma.contact.create({
      data: { name, email, message },
    });

    try {
      await sendContactAdminEmail({ name, email, message });
    } catch {
      // Persist the inquiry even if admin email is not configured.
    }

    return ok(
      res,
      { id: contact.id },
      "Inquiry received",
    );
  }),
);
