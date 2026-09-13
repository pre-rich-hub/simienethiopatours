#!/usr/bin/env node
/**
 * Content integrity gate for the published catalogue snapshot and site constants.
 * Rejects placeholders, `#` socials, and media rows missing required alt text.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PLACEHOLDER =
  /\blorem ipsum\b|\bplaceholder\b|\bTODO:\b|\bFIXME\b|\bTBD\b|coming soon|exact details are confirmed in your written proposal/i;

function collectStrings(value, pathLabel, output) {
  if (typeof value === "string") {
    output.push({ path: pathLabel, value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${pathLabel}[${index}]`, output));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      collectStrings(child, `${pathLabel}.${key}`, output);
    }
  }
}

const snapshotPath = path.join(root, "lib/generated/catalogue.json");
assert.ok(fs.existsSync(snapshotPath), `Missing snapshot: ${snapshotPath}`);
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
assert.ok(snapshot.catalogue, "Snapshot missing catalogue");

const { tours = [], destinations = [], posts = [] } = snapshot.catalogue;
const failures = [];

const strings = [];
collectStrings(snapshot.catalogue, "catalogue", strings);
for (const entry of strings) {
  if (PLACEHOLDER.test(entry.value)) {
    failures.push(`Placeholder phrase at ${entry.path}: ${entry.value.slice(0, 120)}`);
  }
  if (entry.value.trim() === "#" || /^https?:\/\/#/i.test(entry.value)) {
    failures.push(`Hash/placeholder URL at ${entry.path}`);
  }
}

for (const tour of tours) {
  if (tour.image && !String(tour.imageAlt || "").trim()) {
    failures.push(`Tour ${tour.slug} (${tour.locale}) has image but missing imageAlt`);
  }
}
for (const destination of destinations) {
  if (destination.imageUrl && !String(destination.imageAlt || "").trim()) {
    failures.push(`Destination ${destination.slug} (${destination.locale}) has imageUrl but missing imageAlt`);
  }
}
for (const post of posts) {
  if (post.imageUrl && !String(post.imageAlt || "").trim()) {
    failures.push(`Post ${post.slug} (${post.locale}) has imageUrl but missing imageAlt`);
  }
}

const siteSource = fs.readFileSync(path.join(root, "lib/site.ts"), "utf8");
const socialBlock = siteSource.match(/social:\s*\{([\s\S]*?)\},/);
assert.ok(socialBlock, "Could not find site.social in lib/site.ts");
for (const match of socialBlock[1].matchAll(/:\s*"([^"]*)"/g)) {
  const href = match[1];
  if (href === "#" || href.startsWith("#")) {
    failures.push(`site.social contains placeholder href "${href}"`);
  }
}

const creditsSource = fs.readFileSync(path.join(root, "lib/photo-credits.ts"), "utf8");
if (/status:\s*"verification-required"/.test(creditsSource)) {
  failures.push("photo-credits still contains verification-required entries");
}

if (failures.length > 0) {
  console.error("Content integrity failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Content integrity passed (${tours.length} tours, ${destinations.length} destinations, ${posts.length} posts).`,
  );
}
