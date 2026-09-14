import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Image from "@/components/Image";
import { resolveMediaUrl } from "./media-url";
import { cloudinaryImageLoader, isClientCloudinaryImage } from "./cloudinary-image";
import clientPhotos from "./client-photos.json";

describe("direct Cloudinary image delivery", () => {
  it("serves every client photo at its requested width from originals and resolved URLs", () => {
    for (const { url } of Object.values(clientPhotos)) {
      for (const src of [url, resolveMediaUrl(url)]) {
        expect(isClientCloudinaryImage(src)).toBe(true);
        const delivered = cloudinaryImageLoader({ src, width: 640, quality: 75 });
        expect(delivered).toBe(url.replace("/upload/", "/upload/f_auto,c_limit,w_640,q_75/"));
      }
    }
  });

  it("keeps signed URLs, custom transformations, other accounts and local images on the default path", () => {
    for (const src of [
      "/images/tevan-founder.jpg",
      "/api/v1/media/photo-id",
      "https://cdn.example.com/photo.jpg",
      "https://res.cloudinary.com/another-account/image/upload/v123/photo.jpg",
      "https://res.cloudinary.com/ps4gvvqu/image/upload/s--signature--/v123/photo.jpg",
      "https://res.cloudinary.com/ps4gvvqu/image/upload/c_crop,w_100/v123/photo.jpg",
      `${clientPhotos.sankaber.url}?token=example`,
    ]) expect(isClientCloudinaryImage(src)).toBe(false);
  });

  it("renders responsive CDN sources without a localhost optimizer request", () => {
    const markup = renderToStaticMarkup(
      <Image src={resolveMediaUrl(clientPhotos.sankaber.url)} alt="Simien landscape" fill sizes="100vw" />,
    );
    expect(markup).toContain("srcSet=\"https://res.cloudinary.com/");
    expect(markup).toContain("f_auto,c_limit,w_640,q_auto/");
    expect(markup).toContain(" 640w");
    expect(markup).not.toContain("/_next/image");
    expect(markup).not.toContain("c_limit,w_2048/q_auto/");
    expect(markup).toContain('loading="lazy"');
  });

  it("preserves optimized local images and explicit loaders", () => {
    const local = renderToStaticMarkup(<Image src="/images/tevan-founder.jpg" alt="Founder" width={320} height={400} />);
    expect(local).toContain("/_next/image?url=%2Fimages%2Ftevan-founder.jpg");
    const custom = renderToStaticMarkup(
      <Image src={clientPhotos.sankaber.url} alt="Landscape" width={320} height={200} loader={({ width }) => `/custom-image?w=${width}`} />,
    );
    expect(custom).toContain("/custom-image?w=");
    expect(custom).not.toContain("res.cloudinary.com");
  });
});
