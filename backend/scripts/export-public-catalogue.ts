import "dotenv/config";
import { createHash } from "node:crypto";
import { writeFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { buildPublicCatalogue } from "../src/modules/catalog/public-catalogue.js";
import { prisma } from "../src/config/database.js";
import { publicCatalogueSchema } from "../src/modules/catalog/public-catalogue.schema.js";

// Read-only DB export. Publication is the approval boundary; never export admin/operational rows.
try {
  const catalogue = publicCatalogueSchema.parse(await buildPublicCatalogue());
  const canonical = JSON.stringify(catalogue);
  const version = createHash("sha256").update(canonical).digest("hex");
  const output = resolve(process.argv[2] ?? "../frontend/lib/generated/catalogue.json");
  const text = JSON.stringify({ version, provenance: "cms-export", catalogue }, null, 2) + "\n";
  await writeFile(`${output}.tmp`, text);
  await rename(`${output}.tmp`, output);
  console.log(JSON.stringify({ version, tours: catalogue.tours.length, destinations: catalogue.destinations.length, posts: catalogue.posts.length }));
} finally { await prisma.$disconnect(); }
