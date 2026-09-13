import { pageMetadata, localeFromParam, localePath, absoluteUrl, type PageMetadataInput } from "@/lib/seo";
export function catalogueAlternates(path: string, locales: readonly string[]) {
  return Object.fromEntries([...locales.map(locale => [locale, absoluteUrl(localePath(path, localeFromParam(locale)))]), ["x-default", absoluteUrl(localePath(path, "en"))]]);
}
export function catalogueMetadata(input: PageMetadataInput, availableLocales: readonly string[]) {
  const metadata = pageMetadata({ ...input, languages: false });
  return { ...metadata, openGraph: { ...metadata.openGraph, alternateLocale: availableLocales.filter(l => l !== input.locale).map(l => ({ en: "en_US", es: "es_ES", de: "de_DE", fr: "fr_FR" })[l as "en" | "es" | "de" | "fr"]) }, alternates: { ...metadata.alternates, languages: catalogueAlternates(input.path, availableLocales) } };
}

export const localizedMetadata = catalogueMetadata;
