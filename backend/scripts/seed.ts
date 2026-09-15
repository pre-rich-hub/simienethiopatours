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
import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { approvedTourContents } from "@/lib/tour-content";
import type { TourContent } from "../src/modules/catalog/tour-content.js";
import { simienPlaces } from "@/lib/simien-destinations";
import { gondarPlaces } from "@/lib/gondar-destinations";
import { travelerReviews } from "@/lib/reviews";
import { fieldNotes } from "@/lib/field-notes";
import { experienceLinks, gondarExperiences } from "@/lib/experiences";
import { photographs } from "@/lib/gallery-data";
import { journeys } from "@/lib/site";
import { journeysThroughPlace } from "@/lib/destination-routes";

const prisma = new PrismaClient();
const supportedLocales = ["en", "es", "de", "fr"] as const;
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const mimeFor = (value: string) => value.endsWith(".png") ? "image/png" : value.endsWith(".webp") ? "image/webp" : "image/jpeg";

async function upsertEditorialMedia(sourceUrl: string, altText: string | null) {
  return prisma.mediaAsset.upsert({
    where: { sourceUrl },
    update: { altText, originalName: sourceUrl.split("/").pop() ?? sourceUrl },
    create: { sourceUrl, altText, originalName: sourceUrl.split("/").pop() ?? sourceUrl, mimeType: mimeFor(sourceUrl), size: 0 },
  });
}

async function upsertTranslations(entityType: "tour" | "destination", entitySlug: string, content: unknown) {
  const source = JSON.stringify(content);
  for (const locale of supportedLocales) {
    const english = locale === "en";
    await prisma.contentTranslation.upsert({
      where: { entityType_entitySlug_locale: { entityType, entitySlug, locale } },
      update: english ? { content: source, status: "published", sourceHash: sha(source), publishedAt: new Date() } : {},
      create: {
        entityType, entitySlug, locale, content: english ? source : "{}",
        status: english ? "published" : "missing", sourceHash: english ? sha(source) : null,
        publishedAt: english ? new Date() : null,
      },
    });
  }
}

// The same canonical objects feed the seed, public serializer and CMS adapter.
function mapJourneyTour(tour: TourContent) {
  const card = (journeys as Array<{ slug: string; style?: string; fit?: string }>).find((item) => item.slug === tour.slug);
  return {
    slug: tour.slug, tourName: tour.tourName,
    summary: tour.summary, overview: tour.overview,
    heroTitle: tour.heroTitle, heroAccent: tour.heroAccent,
    image: tour.image, imageAlt: tour.imageAlt,
    duration: tour.duration, difficulty: tour.difficulty,
    journeyType: tour.journeyType,
    style: card?.style ?? tour.style, fit: card?.fit ?? tour.fit,
    inquiry: tour.inquiry, notice: tour.notice,
    itineraryIntro: tour.itineraryIntro,
    itineraryNotes: JSON.stringify(tour.itineraryNotes),
    route: JSON.stringify(tour.route), facts: JSON.stringify(tour.facts),
    introduction: JSON.stringify(tour.introduction),
    highlights: JSON.stringify(tour.highlights), preparation: JSON.stringify(tour.preparation),
    related: JSON.stringify(tour.related), included: JSON.stringify(tour.included),
    excluded: JSON.stringify(tour.excluded), itinerary: JSON.stringify(tour.itinerary),
    isPublished: tour.isPublished, editorialStatus: "published", editorialSourceNotes: null,
    sortOrder: tour.sortOrder, isFeatured: tour.isFeatured,
  };
}
type DestinationSeed = {
  slug: string; destinationName: string; description: string | null;
  area: string; type: string; location: string | null; alsoKnownAs: string;
  heroTitle: string | null; heroAccent: string | null; overview: string;
  highlights: string; thingsToDo: string; imageUrl: string | null;
  imageAlt: string | null; sourceReferences: string; isPublished: boolean; sortOrder: number;
  editorialStatus: string; editorialSourceNotes: string | null;
  tourIds: number[];
};

const simienTypes: Record<string, string> = {
  "simien-mountains-national-park": "park", debark: "gateway", "buyit-ras": "gateway",
  sankaber: "camp", geech: "camp", "jinbar-waterfall": "waterfall", "imet-gogo": "viewpoint",
  inatye: "corridor", chenek: "camp", ambaras: "gateway", "siha-gorge": "viewpoint",
  "bwahit-pass": "viewpoint", ambiko: "camp", "ras-dashen": "viewpoint",
  "meseha-valley": "corridor", sona: "camp", mulit: "camp", "adi-arkay": "gateway",
};
const gondarTypes: Record<string, string> = {
  gondar: "heritage", "fasil-ghebbi": "heritage", "fasilides-bath": "heritage",
  "debre-berhan-selassie": "heritage", kuskuam: "heritage", woleka: "rural",
  "kosoye-mountains": "rural", debark: "gateway", "lake-tana": "lake",
  "blue-nile-falls": "waterfall", lalibela: "heritage", "yemrehanna-kristos": "heritage",
  axum: "heritage", yeha: "heritage", "highland-villages": "corridor",
};
// Destination storage preserves the legacy description while filling every
// structured field from the approved frontend records.
type ApprovedPlace = { slug: string; name: string; location: string; about: string[]; highlights: string[]; thingsToDo: string[] };
const destinationMap = new Map<string, DestinationSeed>();
for (const [index, place] of [...simienPlaces, ...gondarPlaces].entries() as Iterable<[number, ApprovedPlace]>) {
  const source = place as ApprovedPlace & { image?: string; imageAlt?: string; heroTitle?: string; heroAccent?: string; alsoKnownAs?: string[] };
  const area = simienTypes[place.slug] || place.slug === "highland-villages" ? "simien" : ["lalibela", "yemrehanna-kristos", "axum", "yeha", "blue-nile-falls", "lake-tana"].includes(place.slug) ? "explore" : "gondar";
  const description = [place.location, "About", ...place.about, "Highlights", ...place.highlights, "Things to Do", ...place.thingsToDo].join("\n\n");
  const existing = destinationMap.get(place.slug);
  destinationMap.set(place.slug, {
    slug: place.slug,
    destinationName: place.name,
    description: existing ? existing.description + "\n\nGondar approach context\n\n" + description : description,
    area, type: simienTypes[place.slug] ?? gondarTypes[place.slug] ?? "other",
    location: place.location, alsoKnownAs: JSON.stringify(source.alsoKnownAs ?? []),
    heroTitle: source.heroTitle ?? place.name, heroAccent: source.heroAccent ?? "",
    overview: JSON.stringify(place.about), highlights: JSON.stringify(place.highlights),
    thingsToDo: JSON.stringify(place.thingsToDo), imageUrl: source.image ?? null,
    imageAlt: source.imageAlt ?? null, sourceReferences: "[]", editorialStatus: "published", editorialSourceNotes: null, isPublished: true,
    sortOrder: index + 1, tourIds: [],
  });
}
const destinations = [...destinationMap.values()];

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
  const tourSeeds = (approvedTourContents as TourContent[]).map(mapJourneyTour);

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
    if (data.image) {
      const media = await upsertEditorialMedia(data.image, data.imageAlt);
      await prisma.tourMedia.upsert({
        where: { tourId_mediaAssetId_role: { tourId: (await prisma.tour.findUniqueOrThrow({ where: { slug: data.slug }, select: { id: true } })).id, mediaAssetId: media.id, role: "hero" } },
        update: { sortOrder: 0 },
        create: { tourId: (await prisma.tour.findUniqueOrThrow({ where: { slug: data.slug }, select: { id: true } })).id, mediaAssetId: media.id, role: "hero", sortOrder: 0 },
      });
    }
    await upsertTranslations("tour", data.slug, data);
    tourCount += 1;
  }

  let destinationCount = 0;
  for (const data of destinations) {
    const { tourIds: _tourIds, ...destinationData } = data;
    const destination = await prisma.destination.upsert({
      where: { slug: data.slug },
      update: destinationData,
      create: destinationData,
    });
    if (data.imageUrl) {
      const media = await upsertEditorialMedia(data.imageUrl, data.imageAlt);
      await prisma.destinationMedia.upsert({
        where: { destinationId_mediaAssetId_role: { destinationId: destination.id, mediaAssetId: media.id, role: "hero" } },
        update: { sortOrder: 0 },
        create: { destinationId: destination.id, mediaAssetId: media.id, role: "hero", sortOrder: 0 },
      });
    }
    await upsertTranslations("destination", data.slug, data);
    const area = data.area === "simien" ? "simien" : "gondar";
    const relatedSlugs = (journeysThroughPlace(area, data.slug) as Array<{ slug: string }>).map((journey) => journey.slug);
    const relatedTours = relatedSlugs.length
      ? await prisma.tour.findMany({ where: { slug: { in: relatedSlugs } }, select: { id: true } })
      : [];
    await prisma.tourDestinationJunction.deleteMany({ where: { destinationId: destination.id } });
    if (relatedTours.length) {
      await prisma.tourDestinationJunction.createMany({
        data: relatedTours.map((tour) => ({ destinationId: destination.id, tourId: tour.id })),
        skipDuplicates: true,
      });
    }
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

  // Gallery: the client-selected collection, keyed by image URL. All rows keep
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
