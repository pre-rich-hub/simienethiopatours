/**
 * Seed catalog data (tours, destinations) from the frontend content files.
 *
 * Idempotent: every row is upserted by its unique slug, so running this
 * multiple times converges on the same rows. Blog posts are intentionally
 * not seeded.
 *
 * The frontend data modules are imported via the `@/*` path alias defined
 * in tsconfig.json. The ambient declarations in scripts/types.d.ts let
 * tsc resolve these specifiers without pulling in frontend source.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { detailedJourneys, timkatDays } from "@/lib/itineraries";
import { moreSimienPlaces } from "@/lib/simien-guide";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Minimal structural shapes used by the seed
// ---------------------------------------------------------------------------

type SeedDay = {
  title: string;
  subtitle?: string;
  paragraphs: string[];
};

type SeedJourney = {
  slug: string;
  title: string;
  description?: string;
  introduction: string[];
  days: SeedDay[];
  inclusions: string[];
  exclusions?: string[];
};

type TourSeed = {
  slug: string;
  tourName: string;
  overview: string | null;
  included: string | null;
  excluded: string | null;
  itinerary: string | null;
  isFeatured: boolean;
};

type DestinationSeed = {
  slug: string;
  destinationName: string;
  description: string | null;
};

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function mapItinerary(days: SeedDay[]): string {
  return days
    .map((day) => {
      const heading = day.subtitle
        ? `# ${day.title} — ${day.subtitle}`
        : `# ${day.title}`;
      return [heading, ...day.paragraphs].join("\n");
    })
    .join("\n\n");
}

function mapList(items: string[] | undefined): string | null {
  if (!items || items.length === 0) return null;
  return items
    .map((item) =>
      item.trim() === "" || item.startsWith("- ") ? item : `- ${item}`,
    )
    .join("\n");
}

function mapJourneyTour(journey: SeedJourney): TourSeed {
  const overview = journey.description
    ? [journey.description, ...journey.introduction].join("\n\n")
    : journey.introduction.join("\n\n");

  return {
    slug: journey.slug,
    tourName: journey.title,
    overview,
    included: mapList(journey.inclusions),
    excluded: mapList(journey.exclusions),
    itinerary: mapItinerary(journey.days),
    isFeatured: false,
  };
}

const timkatTour: TourSeed = {
  slug: "timkat-simien",
  tourName: "Timkat & Simien — 6 days",
  overview:
    "Experience the Timkat festival in Gondar with local interpretation, then continue into the Simien Mountains.",
  included: null,
  excluded: null,
  itinerary: mapItinerary(timkatDays),
  isFeatured: false,
};

// ---------------------------------------------------------------------------
// Destinations
// ---------------------------------------------------------------------------

const simienMountainsDescription =
  "A landscape of high plateaus, cliffs and deep valleys, with walking for every " +
  "level from a short introduction to consecutive days on the trail. Watch geladas, " +
  "look for Walia ibex in suitable habitat and notice highland birdlife; for prepared " +
  "walkers there are higher objectives such as Bwahit and Ras Dashen. Communities " +
  "farm and live around the mountains, and even a single day from Gondar can reach " +
  "selected viewpoints.";

const destinations: DestinationSeed[] = [
  ...moreSimienPlaces.map((place: any) => ({
    slug: place.id ?? place.title.toLowerCase().replace(/\s+/g, "-"),
    destinationName: place.title,
    description: place.body,
  })),
  {
    slug: "gondar",
    destinationName: "Gondar",
    description:
      "Gondar is the royal city on the gateway to the Simien Mountains. Its historic " +
      "center includes the Fasil Ghebbi royal compound and the Debre Berhan Selassie " +
      "church.",
  },
  {
    slug: "simien-mountains",
    destinationName: "Simien Mountains",
    description: simienMountainsDescription,
  },
  {
    slug: "woleka",
    destinationName: "Woleka",
    description:
      "Woleka is a village near Gondar associated with Ethiopia's Beta Israel heritage. " +
      "Guided visits offer historical context and respectful encounters with community " +
      "life.",
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const tourSeeds: TourSeed[] = [
    ...detailedJourneys.map(mapJourneyTour),
    timkatTour,
  ];

  let tourCount = 0;
  for (const data of tourSeeds) {
    // Do not touch isFeatured on update: manual feature flags would be wiped
    // by the seed's default false on every run. Only the create payload keeps it.
    const update = {
      slug: data.slug,
      tourName: data.tourName,
      overview: data.overview,
      included: data.included,
      excluded: data.excluded,
      itinerary: data.itinerary,
    };
    await prisma.tour.upsert({
      where: { slug: data.slug },
      update,
      create: data,
    });
    tourCount += 1;
  }

  let destinationCount = 0;
  for (const data of destinations) {
    await prisma.destination.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
    destinationCount += 1;
  }

  console.log(
    `Seed complete: ${tourCount} tours upserted, ${destinationCount} destinations upserted.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });