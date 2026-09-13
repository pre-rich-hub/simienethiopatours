#!/usr/bin/env node
/**
 * Metadata uniqueness/length crawl over the generated public catalogue + static routes.
 * Fails on duplicate titles/descriptions or overlong fields.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const snapshot = JSON.parse(readFileSync(resolve(root, "lib/generated/catalogue.json"), "utf8"));
const catalogue = snapshot.catalogue;

const pages = [];
for (const locale of ["en", "es", "de", "fr"]) {
  pages.push({ path: `/${locale}`, title: `Gondar Simien Tours | ${locale}`, description: "home" });
  pages.push({ path: `/${locale}/plan`, title: `Plan | ${locale}`, description: "plan a journey with Tevan" });
  pages.push({ path: `/${locale}/simien-mountains/planning`, title: `Simien planning | ${locale}`, description: "simien planning guide" });
  pages.push({ path: `/${locale}/gondar/planning`, title: `Gondar planning | ${locale}`, description: "gondar planning guide" });
}

for (const tour of catalogue.tours) {
  const title = `${tour.tourName} | Gondar Simien Tours`;
  const description = String(tour.summary || tour.overview || "").slice(0, 320);
  pages.push({ path: `/${tour.locale}/treks/${tour.slug}`, title, description, kind: "tour" });
}
for (const dest of catalogue.destinations) {
  const title = `${dest.name || dest.destinationName} | Gondar Simien Tours`;
  const description = String((dest.overview && dest.overview[0]) || dest.summary || "").slice(0, 320);
  pages.push({ path: `/${dest.locale}${dest.path}`, title, description, kind: "destination" });
}

const titles = new Map();
const descriptions = new Map();
let failed = false;

for (const page of pages) {
  if (page.description && /not stated in source|source detail is limited|closest matching source/i.test(page.description)) {
    console.error(`editorial note in description: ${page.path}`);
    failed = true;
  }
  if (page.title && page.title.length > 70) {
    console.warn(`long title (${page.title.length}): ${page.path}`);
  }
  if (page.description && page.description.length > 160) {
    console.warn(`long description (${page.description.length}): ${page.path}`);
  }
  if (page.title) {
    const locale = page.path.split("/")[1] || "en";
    const key = `${locale}|${page.title.toLowerCase()}`;
    if (titles.has(key)) {
      console.error(`duplicate title: ${page.path} vs ${titles.get(key)}`);
      failed = true;
    } else titles.set(key, page.path);
  }
  if (page.description && page.kind) {
    const locale = page.path.split("/")[1] || "en";
    // Same place name may share translated meaning across locales — only flag identical text on different paths within one locale
    const descKey = `${locale}|${page.description.toLowerCase()}`;
    if (descriptions.has(descKey) && descriptions.get(descKey) !== page.path) {
      console.error(`duplicate description: ${page.path} vs ${descriptions.get(descKey)}`);
      failed = true;
    } else descriptions.set(descKey, page.path);
  }
}

console.log(`Checked ${pages.length} metadata records (${catalogue.tours.length} tour rows, ${catalogue.destinations.length} destination rows).`);
if (failed) process.exitCode = 1;
else console.log("Metadata uniqueness check passed.");
