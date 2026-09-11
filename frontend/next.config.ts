import type { NextConfig } from "next";

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
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: apiImagePatterns(),
  },
  async redirects() {
    return [
      { source: "/beyond-the-trail", destination: "/gondar", permanent: true },
      { source: "/festival-journeys", destination: "/gondar", permanent: true },
      { source: "/gondar-running-experience", destination: "/gondar", permanent: true },
      { source: "/simien-photography-tour", destination: "/gallery", permanent: true },
      { source: "/where-to-stay-gondar-simien", destination: "/plan", permanent: true },
      { source: "/ras-dashen", destination: "/treks/ras-dashen-challenge", permanent: true },
      { source: "/whats-included", destination: "/treks", permanent: true },
      { source: "/reviews", destination: "/", permanent: true },
      { source: "/photo-credits", destination: "/gallery", permanent: true },
      { source: "/travel-guide", destination: "/plan", permanent: true },
    ];
  },
};

export default nextConfig;
