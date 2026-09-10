import { getStorageProvider } from "./storage/index.js";

/**
 * Convert a URL-relative path or storedPath back to the raw storedPath
 * that the storage provider can delete.
 *
 * - Full HTTP(S) URLs are external → return null (skip disk delete)
 * - Leading-slash relative URLs like "/assets/images/tours/TOUR-1.jpg" → strip the slash
 * - Bare stored paths like "assets/images/tours/TOUR-1.jpg" → pass through
 */
function resolveStoredPath(urlOrPath: string): string | null {
  // Full URLs (http/https) are not local files — skip disk deletion
  if (/^https?:\/\//i.test(urlOrPath)) return null;

  // URL-relative form with leading slash (e.g., "/assets/images/…")
  if (urlOrPath.startsWith("/")) return urlOrPath.slice(1);

  return urlOrPath;
}

export async function removeStoredFile(
  urlOrPath: string | null | undefined,
) {
  if (!urlOrPath) return;
  const storedPath = resolveStoredPath(urlOrPath);
  if (!storedPath) return;
  const provider = await getStorageProvider();
  await provider.delete(storedPath);
}
