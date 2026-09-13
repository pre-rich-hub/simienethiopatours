import { getStorageProvider } from "./storage/index.js";

/**
 * Convert whatever the database holds (URL-relative path, bare stored path or
 * absolute file URL) back to the key the storage provider can delete.
 *
 * - Full HTTP(S) URLs are passed through: the provider decides whether it owns
 *   them (Vercel Blob deletes its own URLs; the local driver ignores them).
 * - Leading-slash relative URLs like "/assets/images/tours/TOUR-1.jpg" → strip the slash
 * - Bare stored paths like "assets/images/tours/TOUR-1.jpg" → pass through
 */
function resolveStoredPath(urlOrPath: string): string {
  // URL-relative form with leading slash (e.g., "/assets/images/…")
  if (urlOrPath.startsWith("/")) return urlOrPath.slice(1);

  return urlOrPath;
}

export async function removeStoredFile(
  urlOrPath: string | null | undefined,
) {
  if (!urlOrPath) return;
  const storedPath = resolveStoredPath(urlOrPath);
  const provider = await getStorageProvider();
  await provider.delete(storedPath);
}
