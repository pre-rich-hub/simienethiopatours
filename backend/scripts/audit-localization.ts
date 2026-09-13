import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { publicCatalogueSchema } from "../src/modules/catalog/public-catalogue.schema.js";

const locales = ["en", "es", "de", "fr"] as const;
const args = process.argv.slice(2).filter((arg) => arg !== "--");
const strict = args.includes("--strict");
const fileArg = args.find((arg) => !arg.startsWith("--"));
const file = resolve(fileArg ?? "../frontend/lib/generated/catalogue.json");
const snapshot = JSON.parse(await readFile(file, "utf8"));
const catalogue = publicCatalogueSchema.parse(snapshot.catalogue);
const rows = [...catalogue.tours, ...catalogue.destinations, ...catalogue.posts];
const report = Object.fromEntries(locales.map(locale => [locale, rows.filter(row => row.locale === locale).length]));
const missing = rows.filter(row => row.locale === "en" && row.availableLocales.length < locales.length).length;
console.log(JSON.stringify({ file, counts: report, entitiesWithMissingLocales: missing, mode: strict ? "strict" : "report" }));
if (strict && missing > 0) {
  console.error(`${missing} published English entities still need reviewed translations before all locales can be indexed.`);
  process.exitCode = 1;
}
