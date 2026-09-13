/**
 * Publish ES/DE/FR ContentTranslation rows for every tour and destination.
 *
 * Source priority: live published CMS rows → frontend catalogue snapshot.
 * Each payload is Zod-validated before upsert. Status is published with
 * reviewedAt + publishedAt set so public-catalogue merge includes them.
 *
 * Usage: npm run content:translations
 */
import "dotenv/config";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { tourContentSchema, type TourContent } from "../src/modules/catalog/tour-content.js";
import { destinationContentSchema, type DestinationContent } from "../src/modules/catalog/destination-content.js";
import { serializeDetail } from "../src/modules/catalog/tour.serializers.js";
import { serializeDestination } from "../src/modules/catalog/destination.serializers.js";
import { publishedCatalogueWhere } from "../src/modules/catalog/public-catalogue.js";
import {
  collectTranslatableStrings,
  flushTranslationCache,
  loadTranslationCache,
  translateValue,
  warmTranslationCache,
  type TargetLocale,
} from "./lib/catalogue-translator.js";

const prisma = new PrismaClient();
const locales: TargetLocale[] = ["es", "de", "fr"];
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const here = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = resolve(here, "../../frontend/lib/generated/catalogue.json");

type SnapshotFile = {
  catalogue?: {
    tours?: Array<Record<string, unknown>>;
    destinations?: Array<Record<string, unknown>>;
  };
};

function pickTourContent(row: TourContent): TourContent {
  return tourContentSchema.parse(row);
}

function pickDestinationContent(row: DestinationContent): DestinationContent {
  return destinationContentSchema.parse(row);
}

async function loadFromDatabase(): Promise<{ tours: TourContent[]; destinations: DestinationContent[] }> {
  const [tours, destinations] = await Promise.all([
    prisma.tour.findMany({
      where: publishedCatalogueWhere,
      include: { destinations: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
    prisma.destination.findMany({
      where: publishedCatalogueWhere,
      include: { tourLinks: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
  ]);
  return {
    tours: tours.map((row) => pickTourContent(serializeDetail(row))),
    destinations: destinations.map((row) => {
      const source = serializeDestination(row, true);
      return pickDestinationContent({
        slug: row.slug,
        destinationName: source.name,
        area: row.area as DestinationContent["area"],
        type: row.type as DestinationContent["type"],
        location: source.location,
        alsoKnownAs: source.alsoKnownAs,
        heroTitle: source.heroTitle,
        heroAccent: source.heroAccent,
        overview: source.overview,
        highlights: source.highlights,
        thingsToDo: source.thingsToDo,
        imageUrl: source.imageUrl,
        imageAlt: source.imageAlt,
        sourceReferences: source.sourceReferences,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
        tourIds: row.tourLinks.map((link) => link.tourId),
      });
    }),
  };
}

async function loadFromSnapshot(): Promise<{ tours: TourContent[]; destinations: DestinationContent[] }> {
  const raw = JSON.parse(await readFile(SNAPSHOT, "utf8")) as SnapshotFile;
  const tours = (raw.catalogue?.tours ?? [])
    .filter((row) => row.locale === "en" || row.locale === undefined)
    .map((row) => pickTourContent({
      slug: String(row.slug),
      tourName: String(row.tourName),
      summary: (row.summary as string | null) ?? null,
      overview: (row.overview as string | null) ?? null,
      heroTitle: (row.heroTitle as string | null) ?? null,
      heroAccent: (row.heroAccent as string | null) ?? null,
      duration: (row.duration as string | null) ?? null,
      style: (row.style as string | null) ?? null,
      difficulty: (row.difficulty as string | null) ?? null,
      fit: (row.fit as string | null) ?? null,
      journeyType: row.journeyType as TourContent["journeyType"],
      image: (row.image as string | null) ?? null,
      imageAlt: (row.imageAlt as string | null) ?? null,
      inquiry: (row.inquiry as string | null) ?? null,
      notice: (row.notice as string | null) ?? null,
      itineraryIntro: (row.itineraryIntro as string | null) ?? null,
      route: (row.route as string[]) ?? [],
      facts: (row.facts as TourContent["facts"]) ?? [],
      introduction: (row.introduction as string[]) ?? [],
      highlights: (row.highlights as TourContent["highlights"]) ?? [],
      preparation: (row.preparation as string[]) ?? [],
      related: (row.related as TourContent["related"]) ?? [],
      included: (row.included as string[]) ?? [],
      excluded: (row.excluded as string[]) ?? [],
      itinerary: (row.itinerary as TourContent["itinerary"]) ?? [],
      itineraryNotes: (row.itineraryNotes as string[]) ?? [],
      isPublished: Boolean(row.isPublished ?? true),
      isFeatured: Boolean(row.isFeatured ?? false),
      sortOrder: Number(row.sortOrder ?? 0),
      destinationIds: (row.destinationIds as number[]) ?? [],
    }));
  const destinations = (raw.catalogue?.destinations ?? [])
    .filter((row) => row.locale === "en" || row.locale === undefined)
    .map((row) => pickDestinationContent({
      slug: String(row.slug),
      destinationName: String(row.name ?? row.destinationName),
      area: row.area as DestinationContent["area"],
      type: row.type as DestinationContent["type"],
      location: (row.location as string | null) ?? null,
      alsoKnownAs: (row.alsoKnownAs as string[]) ?? [],
      heroTitle: (row.heroTitle as string | null) ?? null,
      heroAccent: (row.heroAccent as string | null) ?? null,
      overview: (row.overview as string[]) ?? [],
      highlights: (row.highlights as string[]) ?? [],
      thingsToDo: (row.thingsToDo as string[]) ?? [],
      imageUrl: (row.imageUrl as string | null) ?? null,
      imageAlt: (row.imageAlt as string | null) ?? null,
      sourceReferences: (row.sourceReferences as string[]) ?? [],
      isPublished: Boolean(row.isPublished ?? true),
      sortOrder: Number(row.sortOrder ?? 0),
      tourIds: (row.tourIds as number[]) ?? [],
    }));
  return { tours, destinations };
}

async function upsertPublished(
  entityType: "tour" | "destination",
  entitySlug: string,
  locale: TargetLocale,
  content: unknown,
  sourceHash: string,
): Promise<void> {
  const payload = JSON.stringify(content);
  const now = new Date();
  await prisma.contentTranslation.upsert({
    where: { entityType_entitySlug_locale: { entityType, entitySlug, locale } },
    update: {
      content: payload,
      status: "published",
      sourceHash,
      reviewedAt: now,
      publishedAt: now,
    },
    create: {
      entityType,
      entitySlug,
      locale,
      content: payload,
      status: "published",
      sourceHash,
      reviewedAt: now,
      publishedAt: now,
    },
  });
}

async function translateEntity<T>(
  entityType: "tour" | "destination",
  source: T & { slug: string },
  schema: { parse: (value: unknown) => T },
): Promise<void> {
  const sourceHash = sha(JSON.stringify(source));
  for (const locale of locales) {
    const translated = await translateValue(source, locale);
    // Preserve identity / taxonomy / media / relationship locks after translation.
    const locked = {
      ...(translated as object),
      slug: source.slug,
      ...(entityType === "tour"
        ? {
            journeyType: (source as unknown as TourContent).journeyType,
            image: (source as unknown as TourContent).image,
            isPublished: (source as unknown as TourContent).isPublished,
            isFeatured: (source as unknown as TourContent).isFeatured,
            sortOrder: (source as unknown as TourContent).sortOrder,
            destinationIds: (source as unknown as TourContent).destinationIds,
            inquiry: (source as unknown as TourContent).inquiry,
          }
        : {
            area: (source as unknown as DestinationContent).area,
            type: (source as unknown as DestinationContent).type,
            imageUrl: (source as unknown as DestinationContent).imageUrl,
            isPublished: (source as unknown as DestinationContent).isPublished,
            sortOrder: (source as unknown as DestinationContent).sortOrder,
            tourIds: (source as unknown as DestinationContent).tourIds,
            sourceReferences: (source as unknown as DestinationContent).sourceReferences,
          }),
    };
    const parsed = schema.parse(locked);
    await upsertPublished(entityType, source.slug, locale, parsed, sourceHash);
    process.stdout.write(`  ${entityType}/${source.slug}/${locale}\n`);
  }
}

async function main(): Promise<void> {
  await loadTranslationCache();
  let tours: TourContent[] = [];
  let destinations: DestinationContent[] = [];
  let source = "database";
  try {
    ({ tours, destinations } = await loadFromDatabase());
  } catch (error) {
    console.warn("Database read failed; falling back to catalogue snapshot.", error);
  }
  if (!tours.length && !destinations.length) {
    source = "snapshot";
    ({ tours, destinations } = await loadFromSnapshot());
  }
  if (!tours.length && !destinations.length) {
    throw new Error("No catalogue entities found in database or snapshot.");
  }
  console.log(JSON.stringify({ source, tours: tours.length, destinations: destinations.length, locales }));

  const unique = new Set<string>();
  for (const tour of tours) collectTranslatableStrings(tour, undefined, unique);
  for (const destination of destinations) collectTranslatableStrings(destination, undefined, unique);
  console.log(JSON.stringify({ uniqueStrings: unique.size, warmCalls: unique.size * locales.length }));
  await warmTranslationCache(unique, locales);

  for (const tour of tours) {
    await translateEntity("tour", tour, tourContentSchema);
  }
  for (const destination of destinations) {
    await translateEntity("destination", destination, destinationContentSchema);
  }

  await flushTranslationCache();
  console.log(JSON.stringify({
    ok: true,
    published: (tours.length + destinations.length) * locales.length,
    tours: tours.length,
    destinations: destinations.length,
  }));
}

main()
  .catch((error) => {
    console.error("Translation seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await flushTranslationCache();
    await prisma.$disconnect();
  });
