import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/** Paths that must stay out of public and AI crawls. */
const DISALLOW = ["/admin", "/admin/", "/api/", "/health"] as const;

/**
 * AI search / assistant crawlers we explicitly allow (same policy as *).
 * Named so GEO engines that honour user-agent rules see a clear allow.
 * Training opt-outs are intentionally not applied — this site wants citation.
 */
const AI_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended",
  "PerplexityBot",
  "Applebot-Extended",
] as const;

export default function robots(): MetadataRoute.Robots {
  const publicRule = {
    allow: "/",
    disallow: [...DISALLOW],
  };

  return {
    rules: [
      { userAgent: "*", ...publicRule },
      { userAgent: [...AI_USER_AGENTS], ...publicRule },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
