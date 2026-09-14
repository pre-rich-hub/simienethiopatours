"use client";

import NextImage, { type ImageProps } from "next/image";
import { cloudinaryImageLoader, isClientCloudinaryImage } from "@/lib/cloudinary-image";

/** Keep responsive sizing while letting Cloudinary deliver client photos directly. */
export default function Image(props: ImageProps) {
  const loader = props.loader ?? (
    typeof props.src === "string" && isClientCloudinaryImage(props.src)
      ? cloudinaryImageLoader
      : undefined
  );
  return <NextImage {...props} loader={loader} />;
}
