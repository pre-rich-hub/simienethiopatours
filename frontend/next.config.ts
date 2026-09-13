import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

function apiImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const url = new URL(raw);
    const base = {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    };
    // /assets/** = local-disk uploads, /api/v1/media/** = database uploads.
    return [
      { ...base, pathname: "/assets/**" },
      { ...base, pathname: "/api/v1/media/**" },
    ];
  } catch {
    return [];
  }
}

function apiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    return new URL(raw).origin;
  } catch {
    return "http://localhost:5000";
  }
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  turbopack: {
    root: path.resolve(__dirname, ".."),
    resolveAlias: {
      "next-intl/config": path.resolve(__dirname, "i18n/request.ts"),
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
  /**
   * Draft CSP for production hardening (P11-T2).
   * Allows same-origin assets, the configured API origin (chat/CMS/admin fetch +
   * /assets images), and Google Fonts if ever reintroduced. Tighten further
   * before go-live once video/webhook hosts are known.
   */
  async headers() {
    const api = apiOrigin();
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: blob: ${api}`,
      `font-src 'self' data:`,
      `connect-src 'self' ${api}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
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
