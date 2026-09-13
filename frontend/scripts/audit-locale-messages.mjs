import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname, "messages");
const locales = ["en", "es", "de", "fr"];
const flatten = (value, prefix = "", output = {}) => {
  for (const [key, child] of Object.entries(value)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) flatten(child, next, output);
    else output[next] = child;
  }
  return output;
};
const maps = Object.fromEntries(locales.map((locale) => [locale, flatten(JSON.parse(fs.readFileSync(path.join(root, `${locale}.json`), "utf8")))]));
const sourceKeys = new Set(Object.keys(maps.en));
let failed = false;
for (const locale of locales.slice(1)) {
  const missing = [...sourceKeys].filter((key) => !(key in maps[locale]));
  const extra = Object.keys(maps[locale]).filter((key) => !sourceKeys.has(key));
  console.log(`${locale}: ${Object.keys(maps[locale]).length} keys, missing=${missing.length}, extra=${extra.length}`);
  if (missing.length || extra.length) {
    if (missing.length) console.log(`  missing: ${missing.join(", ")}`);
    if (extra.length) console.log(`  extra: ${extra.join(", ")}`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
