"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@/components/Image";
import clientPhotos from "@/lib/client-photos.json";
import { resolveMediaUrl } from "@/lib/media-url";

const POSTER = clientPhotos["fasilides-bath"].url;
const VIDEO_ID = "v1789568392/homev";

/** Desktop keeps the wide master; mobile gets a 9:16 center crop so cover framing stays useful. */
function heroVideoSrc(mobile: boolean) {
  const transform = mobile
    ? "q_auto:eco,c_fill,g_center,w_720,h_1280,f_mp4,vc_auto"
    : "q_auto:eco,c_limit,w_1920,f_mp4,vc_auto";
  return `https://res.cloudinary.com/ps4gvvqu/video/upload/${transform}/${VIDEO_ID}.mp4`;
}

export function HomeHeroMedia({ alt }: { alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const slow =
      connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    if (motion.matches || slow) return;

    const mobile = window.matchMedia("(max-width: 720px)").matches;
    setVideoSrc(heroVideoSrc(mobile));
  }, []);

  useEffect(() => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    const fail = () => setVideoSrc(null);
    const tryPlay = () => {
      void video.play().catch(fail);
    };

    video.addEventListener("error", fail);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) tryPlay();
    else video.addEventListener("canplay", tryPlay, { once: true });

    return () => {
      video.removeEventListener("error", fail);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [videoSrc]);

  return (
    <div className="hero__media">
      <Image
        src={resolveMediaUrl(POSTER)}
        alt={alt}
        fill
        priority
        fetchPriority="high"
        loading="eager"
        sizes="100vw"
      />
      {videoSrc ? (
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={resolveMediaUrl(POSTER)}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}
      <div className="hero__veil" />
      <div className="hero__grain" />
    </div>
  );
}
