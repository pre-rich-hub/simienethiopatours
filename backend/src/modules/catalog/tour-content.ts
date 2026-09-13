import { z } from "zod";

// Canonical editorial contract. Database JSON-text columns are decoded at the
// boundary; neither public consumers nor editors need to guess array shapes.
const text = z.string().trim().min(1);
export const tourStageSchema = z.object({ label: text, body: text }).strict();
export const tourDaySchema = z.object({
  title: text,
  subtitle: z.string().default(""),
  dayLabel: z.string().trim().max(40).optional(),
  paragraphs: z.array(text),
  overnight: z.string().optional(),
  notes: z.array(text).optional(),
  stages: z.array(tourStageSchema).optional(),
}).strict();
export const tourArrays = {
  route: z.array(text),
  facts: z.array(z.object({ label: text, value: text }).strict()),
  introduction: z.array(text),
  highlights: z.array(z.object({ title: text, body: text }).strict()),
  preparation: z.array(text),
  related: z.array(z.object({
    title: text, body: text,
    href: z.string().refine((value) => !value || /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), "Use a local path or HTTP(S) URL").optional(),
  }).strict()),
  included: z.array(text),
  excluded: z.array(text),
  itinerary: z.array(tourDaySchema),
  itineraryNotes: z.array(text),
};
const optionalText = z.string().nullable();
export const journeyTypes = ["core-trek", "summit-expedition", "wildlife-journey", "photography-journey", "gondar-cultural", "seasonal-festival", "private-combination"] as const;
export const tourContentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(255),
  tourName: text.max(255),
  summary: optionalText,
  overview: optionalText,
  heroTitle: optionalText, heroAccent: optionalText,
  duration: optionalText, style: optionalText, difficulty: optionalText,
  fit: optionalText,
  journeyType: z.enum(journeyTypes),
  image: optionalText, imageAlt: optionalText,
  inquiry: optionalText, notice: optionalText,
  itineraryIntro: optionalText,
  ...tourArrays,
  isPublished: z.boolean(), isFeatured: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  destinationIds: z.array(z.number().int().positive()),
});
export type TourContent = z.infer<typeof tourContentSchema>;
export type TourDay = z.infer<typeof tourDaySchema>;

/** Multipart inputs stay JSON text for existing persistence code, but malformed
 * or incorrectly shaped content now produces a validation error, never "[]". */
export function jsonText<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((value) => {
    if (typeof value !== "string") return value;
    try { return JSON.parse(value); } catch { return value; }
  }, schema).transform((value) => JSON.stringify(value)).optional();
}
