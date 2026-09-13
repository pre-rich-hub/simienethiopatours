/**
 * Local smoke: unpublish then republish one tour and one destination;
 * assert public catalogue EN counts change.
 *
 * Usage (from backend/, with DATABASE_URL and seeded DB):
 *   npx tsx scripts/smoke-admin-publish.ts
 *   npm run smoke:admin-publish
 */
import { prisma } from "../src/config/database.js";
import { buildPublicCatalogue } from "../src/modules/catalog/public-catalogue.js";

async function publishedCounts(): Promise<{ tours: number; destinations: number }> {
  const catalogue = await buildPublicCatalogue(prisma);
  return {
    tours: catalogue.tours.filter((t) => t.locale === "en").length,
    destinations: catalogue.destinations.filter((d) => d.locale === "en").length,
  };
}

async function cycleTour() {
  const tour = await prisma.tour.findFirst({
    where: { isPublished: true, editorialStatus: "published" },
    orderBy: { id: "asc" },
    select: { id: true, slug: true },
  });
  if (!tour) throw new Error("No published tour found — run seed first");

  const before = await publishedCounts();
  await prisma.tour.update({
    where: { id: tour.id },
    data: { isPublished: false },
  });
  const mid = await publishedCounts();
  if (mid.tours !== before.tours - 1) {
    throw new Error(`Tour unpublish: expected ${before.tours - 1}, got ${mid.tours}`);
  }
  await prisma.tour.update({
    where: { id: tour.id },
    data: { isPublished: true, editorialStatus: "published" },
  });
  const after = await publishedCounts();
  if (after.tours !== before.tours) {
    throw new Error(`Tour republish: expected ${before.tours}, got ${after.tours}`);
  }
  console.log(
    `tour ${tour.slug}: ${before.tours} → ${mid.tours} → ${after.tours}`,
  );
}

async function cycleDestination() {
  const destination = await prisma.destination.findFirst({
    where: { isPublished: true, editorialStatus: "published" },
    orderBy: { id: "asc" },
    select: { id: true, slug: true },
  });
  if (!destination) throw new Error("No published destination found — run seed first");

  const before = await publishedCounts();
  await prisma.destination.update({
    where: { id: destination.id },
    data: { isPublished: false },
  });
  const mid = await publishedCounts();
  if (mid.destinations !== before.destinations - 1) {
    throw new Error(
      `Destination unpublish: expected ${before.destinations - 1}, got ${mid.destinations}`,
    );
  }
  await prisma.destination.update({
    where: { id: destination.id },
    data: { isPublished: true, editorialStatus: "published" },
  });
  const after = await publishedCounts();
  if (after.destinations !== before.destinations) {
    throw new Error(
      `Destination republish: expected ${before.destinations}, got ${after.destinations}`,
    );
  }
  console.log(
    `destination ${destination.slug}: ${before.destinations} → ${mid.destinations} → ${after.destinations}`,
  );
}

async function main() {
  await cycleTour();
  await cycleDestination();
  console.log("smoke-admin-publish ok");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
