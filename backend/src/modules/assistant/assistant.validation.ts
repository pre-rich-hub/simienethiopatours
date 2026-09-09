import { z } from "zod";

export const assistantSchema = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().trim().min(1).max(2000),
});

export type AssistantInput = z.infer<typeof assistantSchema>;
