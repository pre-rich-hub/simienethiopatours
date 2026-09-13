import { del, put } from "@vercel/blob";
import type { SaveResult, StorageProvider, UploadKind } from "./types.js";

// Public Vercel Blob URLs look like
// https://<store-id>.public.blob.vercel-storage.com/<key>. Only these are
// deletable by this provider; external or relative paths are left alone.
const BLOB_PUBLIC_URL_RE = /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//i;

function extFromName(name: string): string {
  const match = name.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[0].toLowerCase() : "";
}

export class VercelBlobStorageProvider implements StorageProvider {
  async save(
    file: { buffer: Buffer; originalname: string; mimetype?: string },
    kind: UploadKind,
  ): Promise<SaveResult> {
    const ext = extFromName(file.originalname);
    const key = `${kind}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    // Requires BLOB_READ_WRITE_TOKEN in the environment. The SDK reads it
    // automatically; when it is missing, put() throws and the upload
    // middleware maps that to a 503 with a clear message.
    const blob = await put(key, file.buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.mimetype || "application/octet-stream",
    });

    return { storedPath: blob.url, url: blob.url };
  }

  async delete(storedPath: string): Promise<void> {
    if (!BLOB_PUBLIC_URL_RE.test(storedPath)) return;
    try {
      await del(storedPath);
    } catch {
      // Missing blobs should not fail database operations.
    }
  }

  getUrl(storedPath: string): string {
    return storedPath;
  }
}