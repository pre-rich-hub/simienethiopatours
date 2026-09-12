/**
 * Seed catalog and content data (tours, destinations, testimonials, blog
 * posts, gallery) from the frontend content files.
 *
 * Idempotent: every row is upserted by its unique key — slug for tours,
 * destinations and blog posts, imageUrl for gallery, reviewerName + message
 * for testimonials — so running this multiple times converges on the same rows.
 *
 * Since the P1 content pipeline, rich tour content is stored as JSON text:
 * itinerary holds the full ItineraryDay[] shape, route/facts/introduction/
 * highlights/preparation/related hold their structured arrays, and
 * included/excluded hold string arrays. The public API and the assistant
 * context builder parse these back into arrays.
 *
 * isFeatured: on the update branch, the flag is only written when the tour
 * is in the featuredSlugs set (its isFeatured is true). This means manual
 * toggles on other tours survive reseeds. Every other column is written on
 * both branches so existing rows converge after the schema migration.
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
import { photographs } from "@/lib/gallery-data";
import { journeys } from "@/lib/site";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Structural shapes used by the seed. The day shape mirrors the ItineraryDay
// the frontend renders (frontend/components/Editorial.tsx), including the
// richer overnight/notes/stages fields.
// ---------------------------------------------------------------------------

type SeedDay = {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  overnight?: string;
  notes?: string[];
  stages?: { label: string; body: string }[];
};

type SeedJourney = {
  slug: string;
  inquiry?: string;
  title: string;
  description?: string;
  heroTitle?: string;
  heroAccent?: string;
  image?: string;
  imageAlt?: string;
  duration?: string;
  notice?: string;
  route?: string[];
  facts?: { label: string; value: string }[];
  introduction?: string[];
  days: SeedDay[];
  highlights?: { title: string; body: string }[];
  preparation?: string[];
  related?: { title: string; body: string; href?: string }[];
  inclusions: string[];
  exclusions?: string[];
};

type TourSeed = {
  slug: string;
  tourName: string;
  heroTitle: string | null;
  heroAccent: string | null;
  image: string | null;
  imageAlt: string | null;
  duration: string | null;
  style: string | null;
  difficulty: string | null;
  fit: string | null;
  inquiry: string | null;
  notice: string | null;
  route: string | null;
  facts: string | null;
  introduction: string | null;
  highlights: string | null;
  preparation: string | null;
  related: string | null;
  overview: string | null;
  included: string | null;
  excluded: string | null;
  itinerary: string | null;
  isPublished: boolean;
  sortOrder: number;
  isFeatured: boolean;
};

type DestinationSeed = {
  slug: string;
  destinationName: string;
  description: string | null;
};

// ---------------------------------------------------------------------------
// Editorial publishing rules
// ---------------------------------------------------------------------------

// sortOrder doubles as the editorial ordering on the site. timkat-simien is
// not published (isPublished=false, sortOrder 0).
const publishedOrder: Record<string, number> = {
  "simien-day-trip": 1,
  "3-day-simien-trek": 2,
  "4-day-simien-classic": 3,
  "ras-dashen-challenge": 4,
  "10-day-simien-ras-dashen": 5,
  "5-day-gondar-simien": 6,
  "gondar-heritage-simien": 7,
};

const featuredSlugs = new Set([
  "3-day-simien-trek",
  "4-day-simien-classic",
  "ras-dashen-challenge",
]);

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function jsonList(items: string[] | undefined | null): string | null {
  if (!items || items.length === 0) return null;
  return JSON.stringify(items);
}

function jsonArray(items: unknown[] | undefined | null): string | null {
  if (!items || items.length === 0) return null;
  return JSON.stringify(items);
}

function jsonObjects(
  items: Record<string, unknown>[] | undefined | null,
): string | null {
  if (!items || items.length === 0) return null;
  return JSON.stringify(items);
}

// style/difficulty/fit only exist in frontend/lib/site.ts journeys. The
// journey's inquiry value matches journeys[].slug there; entries without a
// match (5-day-gondar-simien, gondar-heritage-simien, timkat) keep null.
function styleFromJourneys(journey: SeedJourney): {
  style: string | null;
  difficulty: string | null;
  fit: string | null;
} {
  const match = (journeys as readonly { slug: string; style?: string; difficulty?: string; fit?: string }[]).find(
    (entry) => entry.slug === journey.inquiry,
  );
  return {
    style: match?.style ?? null,
    difficulty: match?.difficulty ?? null,
    fit: match?.fit ?? null,
  };
}

function mapJourneyTour(journey: SeedJourney): TourSeed {
  const overview = journey.description
    ? [journey.description, ...(journey.introduction ?? [])].join("\n\n")
    : (journey.introduction ?? []).join("\n\n");

  const style = styleFromJourneys(journey);

  return {
    slug: journey.slug,
    tourName: journey.title,
    heroTitle: journey.heroTitle ?? null,
    heroAccent: journey.heroAccent ?? null,
    image: journey.image ?? null,
    imageAlt: journey.imageAlt ?? null,
    duration: journey.duration ?? null,
    style: style.style,
    difficulty: style.difficulty,
    fit: style.fit,
    inquiry: journey.inquiry ?? null,
    notice: journey.notice ?? null,
    route: jsonList(journey.route),
    facts: jsonObjects(journey.facts),
    introduction: jsonList(journey.introduction),
    highlights: jsonObjects(journey.highlights),
    preparation: jsonList(journey.preparation),
    related: jsonObjects(journey.related),
    overview,
    included: jsonList(journey.inclusions),
    excluded: jsonList(journey.exclusions),
    itinerary: jsonArray(journey.days),
    isPublished: journey.slug in publishedOrder,
    sortOrder: publishedOrder[journey.slug] ?? 0,
    isFeatured: featuredSlugs.has(journey.slug),
  };
}

const timkatTour: TourSeed = {
  slug: "timkat-simien",
  tourName: "Timkat & Simien — 6 days",
  heroTitle: null,
  heroAccent: null,
  image: null,
  imageAlt: null,
  duration: null,
  style: null,
  difficulty: null,
  fit: null,
  inquiry: null,
  notice: null,
  route: null,
  facts: null,
  introduction: null,
  highlights: null,
  preparation: null,
  related: null,
  overview:
    "Experience the Timkat festival in Gondar with local interpretation, then continue into the Simien Mountains.",
  included: null,
  excluded: null,
  itinerary: jsonArray(timkatDays),
  isPublished: false,
  sortOrder: 0,
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
    ...(detailedJourneys as any[]).map(mapJourneyTour),
    timkatTour,
  ];

  let tourCount = 0;
  for (const data of tourSeeds) {
    // isFeatured is protected on update — except for the tours the editorial
    // pipeline explicitly features. Their flag must converge to true on
    // reseeds (old rows created by the pre-P1 seed carry false). Rows outside
    // featuredSlugs never get their flag reset here, so manual toggles survive
    // reseeds. Every other column is written on both branches.
    const { isFeatured, ...update } = data;
    const updateWithFeature = isFeatured
      ? { ...update, isFeatured: true }
      : update;
    await prisma.tour.upsert({
      where: { slug: data.slug },
      update: updateWithFeature,
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

  // Testimonials. translatedFrom records the original review language when
  // the source review was translated (e.g. "Italian", "Chinese", "Slovak").
  let testimonialCount = 0;
  for (const review of travelerReviews) {
    const message = review.text;
    const data = {
      source: review.source,
      title: review.title ?? null,
      date: review.date,
      avatarTone: review.avatarTone,
      translatedFrom: review.translatedFrom ?? null,
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
      href: null,
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
      href: link.href,
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
      href: (experience as { href?: string }).href ?? null,
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

  // Gallery: 8 editorial photographs, keyed by image URL. All rows keep
  // tourId null — photos are collection-wide, not tour-bound.
  let galleryCount = 0;
  for (const photo of photographs) {
    const data = {
      title: photo.title,
      location: photo.location,
      category: photo.category,
      alt: photo.alt,
      story: photo.story,
      href: photo.href,
      link: photo.link,
      tourId: null,
    };
    await prisma.gallery.upsert({
      where: { imageUrl: photo.src },
      update: data,
      create: { imageUrl: photo.src, ...data },
    });
    galleryCount += 1;
  }

  const publishedCount = tourSeeds.filter((tour) => tour.isPublished).length;

  console.log(
    `Seed complete: ${tourCount} tours upserted (${publishedCount} published), ` +
      `${destinationCount} destinations upserted, ${testimonialCount} testimonials upserted, ` +
      `${blogCount} blog posts upserted (${fieldNoteCount} field notes, ${experienceCount} experiences), ` +
      `${categoryCount} categories upserted, ${galleryCount} gallery images upserted.`,
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