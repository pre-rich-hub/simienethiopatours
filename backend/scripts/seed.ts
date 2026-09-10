/**
 * Seed catalog and content data (tours, destinations, testimonials, blog
 * posts) from the frontend content files.
 *
 * Idempotent: every row is upserted by its unique key — slug for tours,
 * destinations and blog posts, reviewerName + message for testimonials —
 * so running this multiple times converges on the same rows.
 *
 * The frontend data modules are imported via the `@/*` path alias defined
 * in tsconfig.json. The ambient declarations in scripts/types.d.ts let
 * tsc resolve these specifiers without pulling in frontend source.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { detailedJourneys, timkatDays } from "@/lib/itineraries";
import { moreSimienPlaces } from "@/lib/simien-guide";
import { travelerReviews } from "@/lib/reviews";
import { fieldNotes } from "@/lib/field-notes";
import { experienceLinks, gondarExperiences } from "@/lib/experiences";

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

async function getOrCreateCategory(name: string, slug: string) {
  const category = await prisma.blogCategory.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
  categoryCount += 1;
  return category;
}

let categoryCount = 0;

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

  // Testimonials. translatedFrom is NOT a column in the schema, so the source
  // language note is dropped in the DB copy; the reviews carousel no longer
  // displays it for DB-rendered rows. message stores only the review text —
  // title lives in its own column and the carousel renders it as the card h3,
  // so prefixing it here would make the blockquote repeat the title.
  let testimonialCount = 0;
  for (const review of travelerReviews) {
    const message = review.text;
    const data = {
      source: review.source,
      title: review.title ?? null,
      date: review.date,
      avatarTone: review.avatarTone,
    };
    await prisma.testimonial.upsert({
      where: { reviewerName_message: { reviewerName: review.name, message } },
      update: data,
      create: { reviewerName: review.name, message, ...data },
    });
    testimonialCount += 1;
  }

  // Blog posts: field notes and experiences enrich the assistant context.
  // Blog.slug is unique, so every entry needs its own slug. The
  // "Gondar, Heritage & Simien" link and the "Gondar & Simien combination"
  // experience both derive the slug "gondar-heritage-simien"; the link keeps
  // it and the experience's slug is derived from its full href path
  // ("treks-gondar-heritage-simien") so both rows exist.
  const slugFromHref = (href: string): string => {
    const segments = href.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";
    return last.split("#")[0];
  };

  const fieldNotesCategory = await getOrCreateCategory("Field notes", "field-notes");
  const experiencesCategory = await getOrCreateCategory("Experiences", "experiences");

  let fieldNoteCount = 0;
  for (const note of fieldNotes) {
    const slug = note.tag.toLowerCase();
    const data = {
      blogTitle: note.title,
      description: note.body,
      content: note.body,
      imageUrl: null,
      categoryId: fieldNotesCategory.id,
    };
    await prisma.blog.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
    fieldNoteCount += 1;
  }

  let experienceCount = 0;
  for (const link of experienceLinks) {
    const slug = slugFromHref(link.href);
    const data = {
      blogTitle: link.title,
      description: link.body,
      content: link.body,
      imageUrl: null,
      categoryId: experiencesCategory.id,
    };
    await prisma.blog.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
    experienceCount += 1;
  }

  for (const experience of gondarExperiences) {
    const slug = experience.id === "gondar-heritage-simien"
      ? "treks-gondar-heritage-simien"
      : experience.id;
    const content = `${experience.body}\n\nSuitable for: ${experience.fit}`;
    const data = {
      blogTitle: experience.title,
      description: experience.body,
      content,
      imageUrl: null,
      categoryId: experiencesCategory.id,
    };
    await prisma.blog.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
    experienceCount += 1;
  }

  const blogCount = fieldNoteCount + experienceCount;

  console.log(
    `Seed complete: ${tourCount} tours upserted, ${destinationCount} destinations upserted, ` +
      `${testimonialCount} testimonials upserted, ${blogCount} blog posts upserted ` +
      `(${fieldNoteCount} field notes, ${experienceCount} experiences), ` +
      `${categoryCount} categories upserted.`,
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