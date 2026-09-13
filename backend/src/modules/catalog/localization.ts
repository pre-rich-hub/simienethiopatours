export const supportedContentLocales = ["en", "es", "de", "fr"] as const;
export type ContentLocale = (typeof supportedContentLocales)[number];
export const translationStatuses = ["missing", "draft", "reviewed", "published"] as const;
export type TranslationStatus = (typeof translationStatuses)[number];

export function canPublishTranslation(status: string, locale: string): boolean {
  return supportedContentLocales.includes(locale as ContentLocale) &&
    (status === "published" || (locale === "en" && status === "reviewed"));
}

export function fallbackLocaleStatus(locale: string, status: string): {
  locale: string; status: TranslationStatus | "unknown"; fallbackLocale: "en" | null; visible: boolean;
} {
  const known = (translationStatuses as readonly string[]).includes(status);
  return { locale, status: known ? status as TranslationStatus : "unknown", fallbackLocale: locale === "en" ? null : "en", visible: canPublishTranslation(status, locale) };
}
