/** Locale selection shared by catalogue.ts and unit tests (no server-only import). */
export function selectLocale<T extends { slug: string; locale: string }>(
  rows: T[],
  locale: string,
): T[] {
  if (locale === "en") return rows.filter((row) => row.locale === "en");
  const exact = rows.filter((row) => row.locale === locale);
  const exactSlugs = new Set(exact.map((row) => row.slug));
  const sourceRows = rows.filter((row) => row.locale === "en" && !exactSlugs.has(row.slug));
  return [...exact, ...sourceRows];
}
