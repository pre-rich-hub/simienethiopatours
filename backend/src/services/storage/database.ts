import { prisma } from "../../config/database.js";
import type { SaveResult, StorageProvider, UploadKind } from "./types.js";

const mediaPathPrefix = "/api/v1/media/";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Extract the media asset id from whatever the caller holds:
 * - bare id "0f8…"
 * - relative URL "/api/v1/media/0f8…" or "api/v1/media/0f8…"
 * - absolute URL "https://api.example.com/api/v1/media/0f8…"
 */
function mediaIdFromPath(value: string): string | null {
  const withoutPrefix = value.replace(/^https?:\/\/[^/]+/i, "");
  const candidate = withoutPrefix.startsWith("/")
    ? withoutPrefix.slice(1)
    : withoutPrefix;
  const id = candidate.startsWith("api/v1/media/")
    ? candidate.slice("api/v1/media/".length)
    : candidate;
  return UUID_RE.test(id) ? id : null;
}

export class DatabaseStorageProvider implements StorageProvider {
  async save(
    file: { buffer: Buffer; originalname: string; mimetype?: string },
    _kind: UploadKind,
  ): Promise<SaveResult> {
    const asset = await prisma.mediaAsset.create({
      data: {
        content: Uint8Array.from(file.buffer),
        mimeType: file.mimetype || "application/octet-stream",
        originalName: file.originalname,
        size: file.buffer.length,
      },
      select: { id: true },
    });

    return { storedPath: asset.id, url: this.getUrl(asset.id) };
  }

  async delete(storedPath: string): Promise<void> {
    const id = mediaIdFromPath(storedPath);
    if (!id) return;
    try {
      await prisma.mediaAsset.delete({ where: { id } });
    } catch {
      // Missing media must not fail deleting its parent record.
    }
  }

  getUrl(storedPath: string): string {
    return `${mediaPathPrefix}${storedPath}`;
  }
}