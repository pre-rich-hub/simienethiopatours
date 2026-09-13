#!/usr/bin/env node
/**
 * Crawl every URL listed in /sitemap.xml.
 * Usage: node scripts/crawl-sitemap.mjs [origin]
 * Default origin: http://127.0.0.1:3000
 *
 * Loc entries may use localhost vs 127.0.0.1 — rewritten to the request origin host.
 */
const origin = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const originUrl = new URL(origin);

const res = await fetch(`${origin}/sitemap.xml`);
if (!res.ok) {
  console.error(`sitemap.xml HTTP ${res.status}`);
  process.exit(1);
}
const xml = await res.text();
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length === 0) {
  console.error("No <loc> entries in sitemap");
  process.exit(1);
}

const urls = locs.map((loc) => {
  const u = new URL(loc);
  u.protocol = originUrl.protocol;
  u.host = originUrl.host;
  return u.toString();
});

let failures = 0;
const concurrency = 8;
for (let i = 0; i < urls.length; i += concurrency) {
  const batch = urls.slice(i, i + concurrency);
  const results = await Promise.all(
    batch.map(async (url) => {
      try {
        const response = await fetch(url, { redirect: "follow" });
        return { url, status: response.status, ok: response.status === 200 };
      } catch (error) {
        return { url, status: 0, ok: false, error: error.message };
      }
    }),
  );
  for (const row of results) {
    if (!row.ok) {
      console.error(`FAIL ${row.status} ${row.url}${row.error ? ` (${row.error})` : ""}`);
      failures += 1;
    }
  }
}

if (failures) {
  console.error(`crawl-sitemap: ${failures}/${urls.length} failed`);
  process.exit(1);
}
console.log(`crawl-sitemap ok: ${urls.length} URLs from ${origin}`);
