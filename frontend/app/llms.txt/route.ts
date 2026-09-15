import { llmsTxtMarkdown } from "@/lib/llms-txt";

export const revalidate = 3600;

/** Public /llms.txt — curated site map for AI agents (not crawl access control). */
export function GET() {
  return new Response(llmsTxtMarkdown(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
