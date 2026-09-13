import { describe, expect, it } from "vitest";
import { photoCredits, verifiedPhotoCreditCount } from "@/lib/photo-credits";

describe("photoCredits", () => {
  it("marks every production photograph as verified with attribution", () => {
    expect(photoCredits.length).toBeGreaterThan(0);
    expect(verifiedPhotoCreditCount).toBe(photoCredits.length);
    for (const photo of photoCredits) {
      expect(photo.status).toBe("verified");
      expect(photo.file).toMatch(/\.(jpe?g|png|webp)$/i);
      expect(photo.attribution.trim().length).toBeGreaterThan(0);
      expect(photo.sourceUrl).toMatch(/^https?:\/\//i);
      expect(photo.author.trim().length).toBeGreaterThan(0);
      expect(photo.license.trim().length).toBeGreaterThan(0);
    }
  });
});
