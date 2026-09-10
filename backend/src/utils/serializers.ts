import type { Response } from "express";

// Public content routes are CDN-cacheable: pages refresh at most every 60s at
// the edge, stale content is served for up to 5 minutes while refreshing.
export const PUBLIC_CACHE_CONTROL =
  "public, s-maxage=60, stale-while-revalidate=300";

export function setPublicCache(res: Response): void {
  res.set("Cache-Control", PUBLIC_CACHE_CONTROL);
}

// Prisma Decimal fields (adultPrice, childPrice, rating) serialize to JSON
// as strings; map them to numbers (or null) for a stable API shape.
export function decimalToNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseJsonArray<T = unknown>(
  value: string | null | undefined,
): T[] | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

export function parseJsonObject<T = unknown>(
  value: string | null | undefined,
): T | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed !== null && typeof parsed === "object" ? (parsed as T) : null;
  } catch {
    return null;
  }
}