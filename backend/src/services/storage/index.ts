import { env } from "../../config/env.js";
import { LocalStorageProvider } from "./local.js";
import type { SaveResult, StorageProvider, UploadKind } from "./types.js";

export type { SaveResult, StorageProvider, UploadKind } from "./types.js";

let _provider: StorageProvider | null = null;

async function resolveProvider(): Promise<StorageProvider> {
  if (_provider) return _provider;

  switch (env.STORAGE_DRIVER) {
    case "database": {
      const { DatabaseStorageProvider } = await import("./database.js");
      _provider = new DatabaseStorageProvider();
      break;
    }
    case "cloudinary": {
      // Not wired in this project yet. The provider interface (save/delete/
      // getUrl) is the contract a Cloudinary driver must implement.
      throw new Error(
        "STORAGE_DRIVER=cloudinary is not implemented in this project yet; use STORAGE_DRIVER=local or database",
      );
    }
    default: {
      _provider = new LocalStorageProvider();
    }
  }

  return _provider;
}

export function getStorageProvider(): Promise<StorageProvider> {
  return resolveProvider();
}