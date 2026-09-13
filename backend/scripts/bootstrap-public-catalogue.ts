import { writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { approvedTourContents } from "../../frontend/lib/tour-content.js";
import { simienPlaces } from "../../frontend/lib/simien-destinations.js";
import { gondarPlaces } from "../../frontend/lib/gondar-destinations.js";
import { journeysThroughPlace } from "../../frontend/lib/destination-routes.js";
import { publicCatalogueSchema } from "../src/modules/catalog/public-catalogue.schema.js";
const updatedAt = "2026-09-12T00:00:00.000Z";
const tours = approvedTourContents.map(t => ({ ...t, path: `/treks/${t.slug}`, locale: "en", availableLocales: ["en"], updatedAt }));
const simienSlugs = new Set(simienPlaces.map(p => p.slug));
const northern = new Set(["lake-tana", "blue-nile-falls", "lalibela", "yemrehanna-kristos", "axum", "yeha"]);
const places = [...new Map([...simienPlaces, ...gondarPlaces].map(p => [p.slug, p])).values()];
const destinations = places.map((p, i) => {
  const area = simienSlugs.has(p.slug) || p.slug === "highland-villages" ? "simien" : northern.has(p.slug) ? "northern" : "gondar";
  const tourSlugs = [...new Set([...journeysThroughPlace("simien", p.slug), ...journeysThroughPlace("gondar", p.slug)].map(t => t.slug))];
  return { ...p, area, type: "other", alsoKnownAs: "alsoKnownAs" in p ? p.alsoKnownAs : [],
    overview: p.about, imageUrl: p.image, tourSlugs, sortOrder: i + 1,
    path: `/${area === "simien" ? "simien-mountains" : area === "northern" ? "northern-ethiopia" : "gondar"}/${p.slug}`, locale: "en", availableLocales: ["en"], updatedAt };
});
const catalogue = publicCatalogueSchema.parse({ schemaVersion: 1, tours, destinations, posts: [] });
const version = createHash("sha256").update(JSON.stringify(catalogue)).digest("hex");
await writeFile("../frontend/lib/generated/catalogue.json", JSON.stringify({ version, provenance: "bootstrap", catalogue }, null, 2) + "\n");
console.log(`Development bootstrap: ${tours.length} tours, ${destinations.length} destinations`);
