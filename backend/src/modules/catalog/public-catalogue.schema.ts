import { z } from "zod";
import { tourContentSchema } from "./tour-content.ts";
const locale = z.enum(["en", "es", "de", "fr"]);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const stamp = z.string().datetime();
const media = z.string().refine(v => !v || /^\/(?!\/)/.test(v) || /^https?:\/\//.test(v));
export const publicTourSchema = tourContentSchema.omit({ destinationIds: true }).extend({
  image: media.nullable(), locale, availableLocales: z.array(locale), updatedAt: stamp,
  path: z.string().startsWith("/treks/"),
});
export const publicDestinationSchema = z.object({
  slug, name: z.string().min(1), area: z.enum(["simien", "gondar", "northern"]), type: z.string(),
  location: z.string(), alsoKnownAs: z.array(z.string()), heroTitle: z.string(), heroAccent: z.string(),
  overview: z.array(z.string()), highlights: z.array(z.string()), thingsToDo: z.array(z.string()),
  imageUrl: media, imageAlt: z.string(), sortOrder: z.number(), tourSlugs: z.array(slug),
  path: z.string().regex(/^\/(simien-mountains|gondar|northern-ethiopia)\//),
  locale, availableLocales: z.array(locale), updatedAt: stamp,
});
export const publicPostSchema = z.object({
  slug, blogTitle: z.string().min(1), description: z.string().min(1), content: z.string().min(1),
  author: z.string().min(1), imageUrl: media.nullable(), imageAlt: z.string().nullable(),
  category: z.object({ slug, name: z.string() }).nullable(),
  publishedAt: stamp, updatedAt: stamp, locale, availableLocales: z.array(locale),
  path: z.string().startsWith("/journal/"),
});
export const publicCatalogueSchema = z.object({
  schemaVersion: z.literal(1), tours: z.array(publicTourSchema),
  destinations: z.array(publicDestinationSchema), posts: z.array(publicPostSchema),
}).superRefine((data, ctx) => {
  for (const rows of [data.tours, data.destinations, data.posts]) {
    const seen = new Set<string>();
    for (const row of rows) {
      if (!row.availableLocales.includes(row.locale) || !row.availableLocales.includes("en") || row.availableLocales.some(locale => !rows.some(other => other.slug === row.slug && other.locale === locale))) ctx.addIssue({ code: "custom", message: "Invalid available locales" });
    }
    for (const row of rows) {
      const key = `${row.locale}:${row.slug}`;
      if (seen.has(key)) ctx.addIssue({ code: "custom", message: "Duplicate locale/slug" });
      seen.add(key);
    }
  }
  for (const tour of data.tours) {
    if (!tour.isPublished || tour.path !== `/treks/${tour.slug}` || (tour.image && !tour.imageAlt?.trim())) ctx.addIssue({ code: "custom", message: "Invalid published tour" });
  }
  for (const post of data.posts) {
    if (post.path !== `/journal/${post.slug}` || (post.imageUrl && !post.imageAlt?.trim())) ctx.addIssue({ code: "custom", message: "Invalid published article" });
  }
  for (const destination of data.destinations) {
    const areaPath = destination.area === "simien" ? "simien-mountains" : destination.area === "northern" ? "northern-ethiopia" : "gondar";
    if (destination.path !== `/${areaPath}/${destination.slug}` || (destination.imageUrl && !destination.imageAlt.trim())) ctx.addIssue({ code: "custom", message: "Invalid destination path or image" });
    for (const tourSlug of destination.tourSlugs) {
      if (!data.tours.some(t => t.slug === tourSlug)) ctx.addIssue({ code: "custom", message: "Unknown related tour" });
    }
  }
});
export type PublicCatalogue = z.infer<typeof publicCatalogueSchema>;
export type PublicTour = z.infer<typeof publicTourSchema>;
export type PublicDestination = z.infer<typeof publicDestinationSchema>;
export type PublicPost = z.infer<typeof publicPostSchema>;
