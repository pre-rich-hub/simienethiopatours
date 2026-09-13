#!/usr/bin/env node
/**
 * Media budget gate for public/images.
 * - Every JPG/PNG under public/images must be < 6 MB
 * - Every photo-credits entry must be verified with non-empty dimensions
 * - Every credited scenic/operator photo file must exist on disk
 *
 * Brand logo PNGs are size-checked but are not required in photo-credits.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const imagesDir = join(root, "public", "images");
const MAX_BYTES = 6 * 1024 * 1024;

const creditsSource = readFileSync(join(root, "lib", "photo-credits.ts"), "utf8");
const creditBlocks = [...creditsSource.matchAll(/\{\s*file:\s*"([^"]+)"[\s\S]*?status:\s*"(verified|verification-required)"/g)];

const credits = creditBlocks.map((match) => {
  const block = match[0];
  const file = match[1];
  const status = match[2];
  const dimensions = block.match(/dimensions:\s*"([^"]*)"/)?.[1] ?? "";
  return { file, status, dimensions };
});

const errors = [];

if (credits.length === 0) {
  errors.push("No photo-credits entries parsed from lib/photo-credits.ts");
}

for (const credit of credits) {
  if (credit.status !== "verified") {
    errors.push(`${credit.file}: status is ${credit.status}, expected verified`);
  }
  if (!credit.dimensions.trim() || !/\d/.test(credit.dimensions)) {
    errors.push(`${credit.file}: dimensions missing or empty in photo-credits`);
  }
  const onDisk = join(imagesDir, credit.file);
  try {
    statSync(onDisk);
  } catch {
    errors.push(`${credit.file}: listed in photo-credits but missing under public/images`);
  }
}

const files = readdirSync(imagesDir).filter((name) => /\.(jpe?g|png)$/i.test(name));
for (const name of files) {
  const size = statSync(join(imagesDir, name)).size;
  if (size >= MAX_BYTES) {
    errors.push(`${name}: ${(size / (1024 * 1024)).toFixed(2)} MB exceeds 6 MB budget`);
  }
}

if (errors.length) {
  console.error("media-budget failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(
  `media-budget ok: ${files.length} JPG/PNG under 6 MB; ${credits.length} photo-credits verified with dimensions`,
);
