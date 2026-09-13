import { describe, expect, it } from "vitest";
import {
  exceedsUploadBudget,
  isAllowedUploadMime,
  maxUploadBytes,
  sanitizeUploadFilename,
} from "./upload-controls.js";

describe("upload controls", () => {
  it("allows image MIME + extension pairs used by the CMS", () => {
    expect(isAllowedUploadMime("image/jpeg", "hero.jpg")).toBe(true);
    expect(isAllowedUploadMime("image/png", "badge.png")).toBe(true);
    expect(isAllowedUploadMime("image/webp", "shot.webp")).toBe(true);
    expect(isAllowedUploadMime("application/pdf", "doc.pdf")).toBe(false);
    expect(isAllowedUploadMime("image/jpeg", "notes.txt")).toBe(false);
  });

  it("enforces MAX_UPLOAD_MB budget", () => {
    const max = maxUploadBytes();
    expect(max).toBeGreaterThan(0);
    expect(exceedsUploadBudget(max)).toBe(false);
    expect(exceedsUploadBudget(max + 1)).toBe(true);
  });

  it("sanitizes filenames and rejects traversal", () => {
    expect(sanitizeUploadFilename("../../etc/passwd.jpg")).toBe("passwd.jpg");
    expect(sanitizeUploadFilename("My Tour Hero!.JPG")).toBe("My_Tour_Hero_.JPG");
    expect(() => sanitizeUploadFilename("..")).toThrow(/Invalid/);
  });
});
