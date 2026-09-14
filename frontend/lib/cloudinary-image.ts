import type { ImageLoaderProps } from "next/image";

const clientUpload = "https://res.cloudinary.com/ps4gvvqu/image/upload/";
const displayPrefix = "c_limit,w_2048/q_auto/";

function clientAsset(src: string): string | null {
  if (!src.startsWith(clientUpload)) return null;
  let asset = src.slice(clientUpload.length);
  // Accept originals and the display URL produced by resolveMediaUrl. Preserve
  // signed URLs and any other intentional transformations via Next's loader.
  if (asset.startsWith(displayPrefix)) asset = asset.slice(displayPrefix.length);
  return /^v\d+\/[^?#]+$/.test(asset) ? asset : null;
}

export function isClientCloudinaryImage(src: string): boolean {
  return clientAsset(src) !== null;
}

export function cloudinaryImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const asset = clientAsset(src);
  if (!asset) return src;
  return `${clientUpload}f_auto,c_limit,w_${width},q_${quality ?? "auto"}/${asset}`;
}
