import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveMediaUrl } from "./media-url";

afterEach(() => vi.unstubAllEnvs());

describe("mixed image storage", () => {
  it("keeps local frontend images and resolves both backend upload types", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/");
    expect(resolveMediaUrl("/images/old-photo.jpg")).toBe("/images/old-photo.jpg");
    expect(resolveMediaUrl("/assets/images/tours/new.jpg")).toBe("https://api.example.com/assets/images/tours/new.jpg");
    expect(resolveMediaUrl("/api/v1/media/asset-id")).toBe("https://api.example.com/api/v1/media/asset-id");
    expect(resolveMediaUrl(null)).toBe("");
  });

  it("caps client originals without changing the asset identity or repeatedly transforming", () => {
    const original = "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386871/Sankaber.jpg";
    const display = resolveMediaUrl(original);
    expect(display).toBe("https://res.cloudinary.com/ps4gvvqu/image/upload/c_limit,w_2048/q_auto/v1789386871/Sankaber.jpg");
    expect(resolveMediaUrl(display)).toBe(display);
  });

  it("preserves other providers, accounts and signed Cloudinary URLs", () => {
    for (const url of [
      "https://cdn.example.com/photo.jpg",
      "https://res.cloudinary.com/another-account/image/upload/v123/photo.jpg",
      "https://res.cloudinary.com/ps4gvvqu/image/upload/s--signature--/v123/photo.jpg",
    ]) expect(resolveMediaUrl(url)).toBe(url);
  });
});
