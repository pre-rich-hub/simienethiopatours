import type { MetadataRoute } from "next";
import { getCatalogue } from "@/lib/catalogue";
import { routing } from "@/i18n/routing";
import { absoluteLanguageAlternates, absoluteUrl, localePath, localeFromParam } from "@/lib/seo";
import { catalogueAlternates } from "@/lib/catalogue-seo";
import { INDEX_PATHS } from "@/app/sitemap-paths";
export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalogue = await getCatalogue();
  const categories = [...new Set(catalogue.posts.flatMap(p => p.category ? [`/journal/category/${p.category.slug}`] : []))];
  const hubs: MetadataRoute.Sitemap = [...INDEX_PATHS, ...categories].flatMap(path => routing.locales.map(locale => ({ url: absoluteUrl(localePath(path, locale)), changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.8, alternates: { languages: absoluteLanguageAlternates(path) } })));
  const entities: MetadataRoute.Sitemap = [...catalogue.tours, ...catalogue.destinations, ...catalogue.posts].map(row => ({ url: absoluteUrl(localePath(row.path, localeFromParam(row.locale))), lastModified: row.updatedAt, changeFrequency: "monthly", priority: 0.7, alternates: { languages: catalogueAlternates(row.path, row.availableLocales) } }));
  return [...hubs, ...entities];
}
