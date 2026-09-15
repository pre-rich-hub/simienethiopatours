import { readFile } from 'node:fs/promises';
import { tourContentSchema, type TourContent } from '../../src/modules/catalog/tour-content.js';
import { publicCatalogueSchema } from '../../src/modules/catalog/public-catalogue.schema.js';

export const journeyExpansionSlugs = [
  'southern-ethiopia-journey',
  'bale-mountains-extension',
  'northern-ethiopia-long-way-north',
  'gheralta-tigray-extension',
  'ras-dashen-add-on',
  'run-the-simien-7-days',
] as const;
export type JourneyExpansion = readonly TourContent[];
export const timkatImage = 'https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465909/timket.jpg';
export const timkatImageAlt = 'Timkat celebration in Gondar';
export const timkatJourneySlugs = ['timkat-simien', 'timkat-ras-dashen'] as const;
export const destinationSlugs: Record<(typeof journeyExpansionSlugs)[number], readonly string[]> = {
  'southern-ethiopia-journey': ['arba-minch','lake-chamo','dorze-guge-mountains','konso','jinka','mago-national-park','mursi-area','key-afer','turmi','hamer-communities','karo','omo-river','omorate','dassanech','yirgalem','rift-valley-lakes','southern-coffee-country'],
  'bale-mountains-extension': ['bale-mountains-national-park','dinsho','sanetti-plateau','harenna-forest'],
  'northern-ethiopia-long-way-north': ['addis-ababa','bahir-dar','lake-tana','gondar','simien-mountains-national-park','lalibela','axum'],
  'gheralta-tigray-extension': ['gheralta'],
  'ras-dashen-add-on': ['simien-mountains-national-park','ras-dashen','bwahit-pass','chenek','ambiko'],
  'run-the-simien-7-days': ['gondar','simien-mountains-national-park','sankaber','geech','imet-gogo','chenek'],
};

export async function loadJourneyExpansion(): Promise<JourneyExpansion> {
  const rows: TourContent[] = JSON.parse(await readFile(new URL('../data/journey-expansion/en.json', import.meta.url), 'utf8'))
    .map((row: unknown) => tourContentSchema.parse(row));
  if (rows.length !== journeyExpansionSlugs.length || new Set(rows.map(row => row.slug)).size !== rows.length) throw Error('Invalid journey expansion set');
  for (const slug of journeyExpansionSlugs) if (!rows.some(row => row.slug === slug)) throw Error(`Missing journey expansion slug: ${slug}`);
  return rows;
}

export function buildJourneyExpansionPreview(input: unknown, content: JourneyExpansion) {
  const catalogue = publicCatalogueSchema.parse(input);
  const targets = new Set(content.map(row => row.slug));
  catalogue.tours = catalogue.tours
    .filter(row => !targets.has(row.slug))
    .map(row => timkatJourneySlugs.includes(row.slug as (typeof timkatJourneySlugs)[number])
      ? { ...row, image: timkatImage, imageAlt: timkatImageAlt }
      : row);
  for (const row of content) catalogue.tours.push({
    slug: row.slug,
    tourName: row.tourName,
    summary: row.summary,
    overview: row.overview,
    heroTitle: row.heroTitle,
    heroAccent: row.heroAccent,
    duration: row.duration,
    style: row.style,
    difficulty: row.difficulty,
    fit: row.fit,
    journeyType: row.journeyType,
    image: row.image,
    imageAlt: row.imageAlt,
    inquiry: row.inquiry,
    notice: row.notice,
    itineraryIntro: row.itineraryIntro,
    route: row.route,
    facts: row.facts,
    introduction: row.introduction,
    highlights: row.highlights,
    preparation: row.preparation,
    related: row.related,
    included: row.included,
    excluded: row.excluded,
    itinerary: row.itinerary,
    itineraryNotes: row.itineraryNotes,
    isPublished: row.isPublished,
    isFeatured: row.isFeatured,
    sortOrder: row.sortOrder,
    path: `/treks/${row.slug}`,
    locale: 'en' as const,
    availableLocales: ['en' as const],
    updatedAt: '2026-09-15T00:00:00.000Z',
  });
  catalogue.tours.sort((a, b) => a.sortOrder - b.sortOrder);
  return publicCatalogueSchema.parse(catalogue);
}
