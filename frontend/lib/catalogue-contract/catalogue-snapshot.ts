import { z } from "zod";
import { publicCatalogueSchema, type PublicCatalogue } from "./public-catalogue.schema.ts";
export const catalogueSnapshotSchema = z.object({
  version: z.string().regex(/^[a-f0-9]{64}$/),
  provenance: z.enum(["bootstrap", "cms-export"]),
  catalogue: publicCatalogueSchema,
});
export function catalogueFromSnapshot(input: unknown, production: boolean): PublicCatalogue {
  const snapshot = catalogueSnapshotSchema.parse(input);
  if (production && snapshot.provenance !== "cms-export") return { schemaVersion: 1, tours: [], destinations: [], posts: [] };
  return snapshot.catalogue;
}
