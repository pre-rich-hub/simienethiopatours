/**
 * Upload middleware contract helpers — MIME allowlist, size limit, filename sanitization.
 * Kept free of Express so vitest can assert controls without spinning multer.
 */
import path from "node:path";
import { env } from "../config/env.js";

export const ALLOWED_UPLOAD_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

export function isAllowedUploadMime(mimetype: string, originalname: string): boolean {
  const ext = path.extname(originalname).replace(".", "").toLowerCase();
  return (
    (ALLOWED_UPLOAD_EXTENSIONS as readonly string[]).includes(ext) &&
    mimetype.startsWith("image/")
  );
}

export function maxUploadBytes(): number {
  return env.MAX_UPLOAD_MB * 1024 * 1024;
}

export function exceedsUploadBudget(byteLength: number): boolean {
  return byteLength > maxUploadBytes();
}

/** Reject path traversal and keep a stable basename for storage. */
export function sanitizeUploadFilename(originalname: string): string {
  const base = path.basename(originalname).replace(/[^\w.\-]+/g, "_");
  if (!base || base === "." || base === "..") {
    throw new Error("Invalid upload filename");
  }
  return base;
}
