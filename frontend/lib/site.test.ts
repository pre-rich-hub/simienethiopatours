import { describe, expect, it } from "vitest";
import { site, verifiedSocialLinks } from "@/lib/site";

describe("verifiedSocialLinks", () => {
  it("returns only http(s) profiles and hides empty slots", () => {
    const links = verifiedSocialLinks();
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.href).toMatch(/^https?:\/\//i);
      expect(link.href).not.toBe("#");
    }
    expect(links.some((link) => link.network === "instagram")).toBe(true);
    expect(links.some((link) => link.network === "facebook")).toBe(true);
  });

  it("keeps unverified networks empty in site.social", () => {
    expect(site.social.x).toBe("");
    expect(site.social.tiktok).toBe("");
    expect(site.social.youtube).toBe("");
  });
});
