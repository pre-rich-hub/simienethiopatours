/**
 * Resolves a media URL returned by the backend into a browser-usable URL.
 *
 * The backend returns relative URLs for uploads stored without an explicit
 * PUBLIC_FILE_BASE_URL (e.g. local files under "/assets/..." or database
 * media under "/api/v1/media/<uuid>"). Those live on the API origin, not the
 * frontend origin, so prefix them before handing them to <img> or metadata.
 * Client Cloudinary originals are capped for metadata and plain image consumers.
 * The shared Image component replaces this cap with responsive CDN sizes.
 * Stored URLs remain unchanged. Other
 * absolute URLs and frontend /images/ paths pass through unchanged.
 *
 * Pure module: safe to import from both server and client components.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  // Only unsigned, versioned originals in the client's account. Leave existing
  // transformations untouched so resolving an already resolved URL is safe.
  const cloudinary = "https://res.cloudinary.com/ps4gvvqu/image/upload/";
  if (url.startsWith(cloudinary) && /^v\d+\//.test(url.slice(cloudinary.length))) {
    return `${cloudinary}c_limit,w_2048/q_auto/${url.slice(cloudinary.length)}`;
  }
  const origin = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");
  return url.startsWith("/assets/") || url.startsWith("/api/v1/media/") ? `${origin}${url}` : url;
}
