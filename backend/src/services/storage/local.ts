import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../../config/env.js";
import type { SaveResult, StorageProvider, UploadKind } from "./types.js";

const uploadConfig: Record<UploadKind, { dir: string; prefix: string }> = {
  tour:        { dir: "assets/images/tours",        prefix: "TOUR-" },
  destination: { dir: "assets/images/destinations", prefix: "DEST-" },
  blog:        { dir: "assets/images/blog",         prefix: "BLOG-" },
  gallery:     { dir: "assets/images/gallery",      prefix: "IMG-" },
  admin:       { dir: "assets/images/admin",        prefix: "IMG-" },
  document:    { dir: "data",                       prefix: "DOC-" },
};

export class LocalStorageProvider implements StorageProvider {
  async save(
    file: { buffer: Buffer; originalname: string },
    kind: UploadKind,
  ): Promise<SaveResult> {
    const config = uploadConfig[kind];
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${config.prefix}${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const storedPath = `${config.dir}/${filename}`;
    const absolutePath = path.resolve(process.cwd(), env.UPLOAD_ROOT, storedPath);

    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, file.buffer);

    return { storedPath, url: this.getUrl(storedPath) };
  }

  async delete(storedPath: string): Promise<void> {
    try {
      await fs.unlink(path.resolve(process.cwd(), env.UPLOAD_ROOT, storedPath));
    } catch {
      // missing files should not fail db operations
    }
  }

  getUrl(storedPath: string): string {
    if (env.PUBLIC_FILE_BASE_URL) {
      return `${env.PUBLIC_FILE_BASE_URL.replace(/\/+$/, "")}/${storedPath}`;
    }
    return `/${storedPath}`;
  }
}