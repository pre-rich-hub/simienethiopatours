/**
 * Resolves a media URL returned by the backend into a browser-usable URL.
 *
 * The backend returns relative URLs for uploads stored without an explicit
 * PUBLIC_FILE_BASE_URL (e.g. local files under "/assets/..." or database
 * media under "/api/v1/media/<uuid>"). Those live on the API origin, not the
 * frontend origin, so prefix them before handing them to <img> or metadata.
 * Absolute URLs (PUBLIC_FILE_BASE_URL, Cloudinary, seeded /images/...) pass
 * through unchanged.
 *
 * Pure module: safe to import from both server and client components.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  const origin = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");
  return url.startsWith("/assets/") || url.startsWith("/api/v1/media/") ? `${origin}${url}` : url;
}