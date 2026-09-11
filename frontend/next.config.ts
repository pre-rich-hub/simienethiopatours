import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
