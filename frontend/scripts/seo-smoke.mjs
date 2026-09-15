const base = (process.env.SEO_BASE_URL || "http://127.0.0.1:3100").replace(/\/$/, "");

/** status, mustInclude (all), mustExclude (any match fails), optional title/description checks */
const routes = [
  { path: "/robots.txt", status: 200, mustInclude: ["Sitemap:", "Disallow: /admin", "User-agent: GPTBot", "User-agent: ClaudeBot"], mustExclude: [] },
  { path: "/llms.txt", status: 200, mustInclude: ["# Gondar Simien Tours", "## Main pages", "/en/plan"], mustExclude: [] },
  { path: "/sitemap.xml", status: 200, mustInclude: ["<urlset"], mustExclude: ["/admin"] },
  { path: "/en", status: 200, requireMeta: true },
  { path: "/en/treks", status: 200, requireMeta: true },
  { path: "/en/journal", status: 200, requireMeta: true },
  { path: "/en/privacy", status: 200, requireMeta: true, mustInclude: ['name="robots"', "noindex"] },
  { path: "/en/terms", status: 200, requireMeta: true, mustInclude: ['name="robots"', "noindex"] },
  { path: "/en/contact", status: 308, mustInclude: [] },
  { path: "/admin", status: 200, mustExclude: ['rel="canonical"'], softStatus: true },
];

let failed = false;

for (const route of routes) {
  const response = await fetch(`${base}${route.path}`, { redirect: "manual" });
  const body = await response.text();
  const okStatus = route.softStatus
    ? response.status < 500
    : response.status === route.status;
  console.log(`${response.status}\t${route.path}${okStatus ? "" : "\tSTATUS_FAIL"}`);
  if (!okStatus) failed = true;

  for (const needle of route.mustInclude || []) {
    if (!body.includes(needle)) {
      console.log(`  missing: ${needle}`);
      failed = true;
    }
  }
  for (const needle of route.mustExclude || []) {
    if (body.includes(needle)) {
      console.log(`  unexpected: ${needle}`);
      failed = true;
    }
  }
  if (route.requireMeta) {
    if (!body.match(/<title>[^<]+<\/title>/i) || !body.match(/<meta[^>]+name=["']description["']/i)) {
      console.log("  missing title/description");
      failed = true;
    }
  }
}

if (failed) process.exitCode = 1;
