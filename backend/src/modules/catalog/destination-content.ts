import { z } from "zod";

export const destinationAreas = ["simien", "gondar", "northern", "explore", "southern"] as const;
export const destinationTypes = [
  "park", "gateway", "camp", "viewpoint", "waterfall", "heritage",
  "rural", "lake", "extension", "corridor", "other",
] as const;
const text = z.string().trim().min(1);
const url = z.string().refine((value) => /^https?:\/\//i.test(value), "Use an HTTP(S) source URL");

export const destinationContentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(255),
  destinationName: text.max(255),
  area: z.enum(destinationAreas),
  type: z.enum(destinationTypes),
  location: z.string().nullable(),
  alsoKnownAs: z.array(text),
  heroTitle: z.string().nullable(),
  heroAccent: z.string().nullable(),
  overview: z.array(text),
  highlights: z.array(text),
  thingsToDo: z.array(text),
  imageUrl: z.string().nullable(),
  imageAlt: z.string().nullable(),
  sourceReferences: z.array(url),
  isPublished: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  tourIds: z.array(z.number().int().positive()),
});
export type DestinationContent = z.infer<typeof destinationContentSchema>;

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed as T;
  } catch {
    return fallback;
  }
}
