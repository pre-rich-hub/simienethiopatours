import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { serializeDetail } from "./tour.serializers.js";
import { serializeDestination } from "./destination.serializers.js";
import { tourContentSchema } from "./tour-content.js";
import { destinationContentSchema } from "./destination-content.js";
import { publicCatalogueSchema, publicPostSchema } from "./public-catalogue.schema.js";

export const publishedCatalogueWhere = { isPublished: true, editorialStatus: "published" } as const;
export const publishedBlogWhere = { isPublished: true, publishedAt: { not: null } } as const;

/** Only public fields cross this boundary. English always comes from current CMS fields. */
export async function buildPublicCatalogue(client: typeof prisma = prisma) {
  return client.$transaction(tx => readPublicCatalogue(tx), { isolationLevel: "RepeatableRead" });
}

async function readPublicCatalogue(client: Prisma.TransactionClient) {
  const [tours, destinations, posts, translations] = await Promise.all([
    client.tour.findMany({ where: publishedCatalogueWhere, include: { destinations: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    client.destination.findMany({ where: publishedCatalogueWhere, include: { tourLinks: { where: { tour: publishedCatalogueWhere }, include: { tour: true } } }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    client.blog.findMany({ where: publishedBlogWhere, include: { category: true }, orderBy: [{ publishedAt: "desc" }, { id: "desc" }] }),
    client.contentTranslation.findMany({ where: { status: "published", reviewedAt: { not: null }, locale: { in: ["es", "de", "fr"] } } }),
  ]);
  function variants<T extends object>(entityType: string, slug: string, source: T, schema: { safeParse: (v: unknown) => { success: boolean; data?: unknown } }) {
    const result: Array<{ locale: "en" | "es" | "de" | "fr"; content: T; updatedAt?: Date }> = [{ locale: "en", content: source }];
    for (const translation of translations.filter(t => t.entityType === entityType && t.entitySlug === slug)) {
      try {
        const parsed = schema.safeParse(JSON.parse(translation.content));
        if (parsed.success) result.push({ locale: translation.locale as "es" | "de" | "fr", content: parsed.data as T, updatedAt: translation.updatedAt });
      } catch { /* Invalid translations remain unavailable. */ }
    }
    return result;
  }
  const tourRows = tours.flatMap(row => {
    const source = serializeDetail(row);
    const versions = variants("tour", row.slug, source, tourContentSchema);
    return versions.map(v => ({ ...source, ...v.content,
      // Publication, identity, media URLs and relationships cannot be overwritten by translations.
      slug: row.slug, isPublished: true, isFeatured: row.isFeatured, sortOrder: row.sortOrder,
      image: row.image, path: `/treks/${row.slug}`, locale: v.locale,
      updatedAt: new Date(Math.max(row.updatedAt.getTime(), v.updatedAt?.getTime() ?? 0)).toISOString(), availableLocales: versions.map(v => v.locale),
    }));
  });
  const destinationRows = destinations.flatMap(row => {
    const source = serializeDestination(row, true);
    const input = { ...source, destinationName: source.name, tourIds: row.tourLinks.map(t => t.tourId) };
    const versions = variants("destination", row.slug, input, destinationContentSchema);
    return versions.map(v => ({ ...source, ...v.content, slug: row.slug,
      name: v.content.destinationName, area: row.area, type: row.type, imageUrl: row.imageUrl ?? "",
      location: v.content.location ?? "", heroTitle: v.content.heroTitle ?? v.content.destinationName,
      heroAccent: v.content.heroAccent ?? "", imageAlt: v.content.imageAlt ?? "",
      tourSlugs: row.tourLinks.map(t => t.tour.slug), sortOrder: row.sortOrder,
      path: `/${row.area === "simien" ? "simien-mountains" : row.area === "northern" ? "northern-ethiopia" : "gondar"}/${row.slug}`,
      locale: v.locale, availableLocales: versions.map(v => v.locale),
      updatedAt: new Date(Math.max(row.updatedAt.getTime(), v.updatedAt?.getTime() ?? 0)).toISOString(),
    }));
  });
  const postRows = posts.flatMap(row => {
    const source = {
      ...row,
      category: row.category ? { slug: row.category.slug, name: row.category.name } : null,
      publishedAt: row.publishedAt!.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      path: `/journal/${row.slug}`,
      locale: "en" as const,
      availableLocales: ["en" as const],
    };
    const versions = variants("blog", row.slug, source, publicPostSchema);
    return versions.map(v => ({ ...source, ...v.content, slug: row.slug, category: row.category,
      path: source.path, imageUrl: row.imageUrl, publishedAt: source.publishedAt,
      updatedAt: new Date(Math.max(row.updatedAt.getTime(), v.updatedAt?.getTime() ?? 0)).toISOString(),
      locale: v.locale, availableLocales: versions.map(v => v.locale),
    }));
  });
  return publicCatalogueSchema.parse({ schemaVersion: 1, tours: tourRows, destinations: destinationRows, posts: postRows });
}
