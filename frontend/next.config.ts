import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

function apiImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const url = new URL(raw);
    return [{
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/assets/**",
    }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./i18n/request.ts",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Cap retina srcset so 100vw heroes do not request a 3840w derivative.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: apiImagePatterns(),
  },
  async redirects() {
    const legacy = [
      { source: "/beyond-the-trail", destination: "/gondar" },
      { source: "/festival-journeys", destination: "/gondar" },
      { source: "/gondar-running-experience", destination: "/gondar" },
      { source: "/simien-photography-tour", destination: "/gallery" },
      { source: "/where-to-stay-gondar-simien", destination: "/plan" },
      { source: "/ras-dashen", destination: "/treks/ras-dashen-challenge" },
      { source: "/whats-included", destination: "/treks" },
      { source: "/reviews", destination: "/" },
      { source: "/photo-credits", destination: "/gallery" },
      { source: "/travel-guide", destination: "/plan" },
    ] as const;

    return [
      ...legacy.map((redirect) => ({
        source: redirect.source,
        destination: redirect.destination === "/" ? "/en" : `/en${redirect.destination}`,
        permanent: true,
      })),
      ...legacy.map((redirect) => ({
        source: `/:locale(en|es|de|fr)${redirect.source}`,
        destination: redirect.destination === "/" ? "/:locale" : `/:locale${redirect.destination}`,
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
