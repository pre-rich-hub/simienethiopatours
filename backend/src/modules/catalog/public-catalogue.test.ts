import { catalogueFromSnapshot } from "./catalogue-snapshot.js";
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { buildPublicCatalogue, publishedCatalogueWhere } from "./public-catalogue.js";
import { publicCatalogueSchema } from "./public-catalogue.schema.js";
import type { prisma } from "../../config/database.js";

const fixture = JSON.parse(readFileSync(new URL("../../../../frontend/lib/generated/catalogue.json", import.meta.url), "utf8")).catalogue;
// The generated fixture is at the workspace root, outside operational data.
function dbTour() {
  const source = fixture.tours[0];
  const row: Record<string, unknown> = { ...source, id: 1, destinationIds: [], destinations: [], editorialStatus: "published", editorialSourceNotes: "PRIVATE REVIEW", updatedAt: new Date(source.updatedAt), createdAt: new Date(source.updatedAt), adultPrice: null, childPrice: null, rating: null };
  for (const field of ["route", "facts", "introduction", "highlights", "preparation", "related", "included", "excluded", "itinerary", "itineraryNotes"]) row[field] = JSON.stringify(source[field]);
  return row;
}
function database(tours: Record<string, unknown>[] = [dbTour()], translations: unknown[] = []) {
  const db = {
    $transaction: async (read: (client: unknown) => Promise<unknown>) => read(db),
    tour: { findMany: vi.fn(async ({ where }: { where: typeof publishedCatalogueWhere }) => tours.filter(t => t.isPublished === where.isPublished && t.editorialStatus === where.editorialStatus)) },
    destination: { findMany: vi.fn(async () => []) },
    blog: { findMany: vi.fn(async () => []) },
    contentTranslation: { findMany: vi.fn(async () => translations) },
  };
  return db;
}
describe("public catalogue publication boundary", () => {
  it("serializes canonical itinerary arrays and excludes private and commercial legacy fields", async () => {
    const db = database();
    const result = await buildPublicCatalogue(db as unknown as typeof prisma);
    expect(result.tours[0].itinerary).toEqual(fixture.tours[0].itinerary);
    expect(result.tours[0].availableLocales).toEqual(["en"]);
    expect(JSON.stringify(result)).not.toContain("PRIVATE REVIEW");
    expect(result.tours[0]).not.toHaveProperty("adultPrice");
  });
  it("reflects edit, unpublish, editorial draft, and deletion without resurrecting records", async () => {
    const rows = [dbTour()]; const db = database(rows);
    rows[0].tourName = "Updated journey";
    expect((await buildPublicCatalogue(db as unknown as typeof prisma)).tours[0].tourName).toBe("Updated journey");
    rows[0].isPublished = false;
    expect((await buildPublicCatalogue(db as unknown as typeof prisma)).tours).toEqual([]);
    rows[0].isPublished = true; rows[0].editorialStatus = "draft";
    expect((await buildPublicCatalogue(db as unknown as typeof prisma)).tours).toEqual([]);
    rows.splice(0);
    expect((await buildPublicCatalogue(db as unknown as typeof prisma)).tours).toEqual([]);
  });
  it("accepts complete reviewed translations without allowing them to change identity or publication", async () => {
    const db = database([dbTour()], [{ entityType: "tour", entitySlug: fixture.tours[0].slug, locale: "es", updatedAt: new Date("2026-09-13T00:00:00Z"), content: JSON.stringify({ ...fixture.tours[0], destinationIds: [], tourName: "Viaje", slug: "changed", isPublished: false }) }]);
    const result = await buildPublicCatalogue(db as unknown as typeof prisma);
    expect(result.tours).toHaveLength(2);
    expect(result.tours[1]).toMatchObject({ slug: fixture.tours[0].slug, tourName: "Viaje", isPublished: true, locale: "es", availableLocales: ["en", "es"] });
    expect(db.contentTranslation.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ status: "published", reviewedAt: { not: null } }) }));
  });
  it("ignores incomplete translations and does not reuse stale English snapshots", async () => {
    const db = database([dbTour()], [{ entityType: "tour", entitySlug: fixture.tours[0].slug, locale: "es", content: '{"tourName":"Partial"}' }]);
    expect((await buildPublicCatalogue(db as unknown as typeof prisma)).tours).toHaveLength(1);
  });
  it("filters all entity kinds at the query boundary", async () => {
    const db = database(); await buildPublicCatalogue(db as unknown as typeof prisma);
    expect(db.destination.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: publishedCatalogueWhere }));
    expect(db.blog.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { isPublished: true, publishedAt: { not: null } } }));
  });
  it("rejects duplicate records, orphan relationships, misleading alternates and unsafe media", () => {
    expect(publicCatalogueSchema.safeParse({ ...fixture, tours: [...fixture.tours, fixture.tours[0]] }).success).toBe(false);
    expect(publicCatalogueSchema.safeParse({ ...fixture, destinations: [{ ...fixture.destinations[0], tourSlugs: ["missing-tour"] }] }).success).toBe(false);
    expect(publicCatalogueSchema.safeParse({ ...fixture, tours: [{ ...fixture.tours[0], availableLocales: ["en", "fr"] }] }).success).toBe(false);
    expect(publicCatalogueSchema.safeParse({ ...fixture, tours: [{ ...fixture.tours[0], image: "javascript:alert(1)" }] }).success).toBe(false);
  });
});

describe("approved emergency snapshot", () => {
  it("requires CMS provenance in production and preserves approved empty exports", () => {
    const enTourCount = fixture.tours.filter((tour: { locale: string }) => tour.locale === "en").length;
    const snapshot = { version: "a".repeat(64), provenance: "bootstrap", catalogue: fixture };
    expect(catalogueFromSnapshot(snapshot, true).tours).toEqual([]);
    expect(catalogueFromSnapshot(snapshot, false).tours).toHaveLength(fixture.tours.length);
    expect(catalogueFromSnapshot({ ...snapshot, provenance: "cms-export" }, true).tours).toHaveLength(fixture.tours.length);
    expect(enTourCount).toBe(28);
    expect(catalogueFromSnapshot({ ...snapshot, provenance: "cms-export", catalogue: { schemaVersion: 1, tours: [], destinations: [], posts: [] } }, true).tours).toEqual([]);
  });
  it("rejects invalid snapshot metadata", () => {
    expect(() => catalogueFromSnapshot({ version: "", catalogue: fixture }, true)).toThrow();
  });
});
