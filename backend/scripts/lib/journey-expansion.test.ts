import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { publicCatalogueSchema } from '../../src/modules/catalog/public-catalogue.schema.js';
import { buildJourneyExpansionPreview, journeyExpansionSlugs, loadJourneyExpansion, timkatImage, timkatImageAlt } from './journey-expansion.js';

let content: Awaited<ReturnType<typeof loadJourneyExpansion>>;
let source: ReturnType<typeof publicCatalogueSchema.parse>;
beforeAll(async () => {
  content = await loadJourneyExpansion();
  const snapshot = JSON.parse(await readFile(new URL('../../../frontend/lib/generated/catalogue.json', import.meta.url), 'utf8'));
  source = publicCatalogueSchema.parse(snapshot.catalogue);
});

describe('signature journey expansion', () => {
  it('loads all six published journey records with complete itineraries', () => {
    expect(content).toHaveLength(6);
    expect(content.map(row => row.slug)).toEqual([...journeyExpansionSlugs]);
    for (const row of content) {
      expect(row.isPublished).toBe(true);
      expect(row.itinerary.length).toBeGreaterThan(0);
      expect(row.highlights.length).toBeGreaterThan(0);
      expect(row.included.length).toBeGreaterThan(0);
      expect(row.excluded.length).toBeGreaterThan(0);
    }
  });
  it('adds six tours without changing existing catalogue tours', () => {
    const result = buildJourneyExpansionPreview(source, content);
    expect(result.tours).toHaveLength(source.tours.length + 6);
    for (const row of source.tours) {
      const preview = result.tours.find(tour => tour.slug === row.slug && tour.locale === row.locale)!;
      if (row.slug === 'timkat-simien' || row.slug === 'timkat-ras-dashen') {
        expect(preview).toMatchObject({ image: timkatImage, imageAlt: timkatImageAlt });
      } else {
        expect(preview).toEqual(row);
      }
    }
    for (const slug of journeyExpansionSlugs) {
      const row = result.tours.find(tour => tour.slug === slug)!;
      expect(row.path).toBe(`/treks/${slug}`);
      expect(row.availableLocales).toEqual(['en']);
    }
    expect(result.tours.find(tour => tour.slug === 'southern-ethiopia-journey')?.image).toBe('https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465911/outhern-Ethiopia-Journey.jpg');
    expect(result.tours.find(tour => tour.slug === 'bale-mountains-extension')?.image).toBe('https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386863/bale-mountains-national-park.jpg');
    expect(result.tours.find(tour => tour.slug === 'northern-ethiopia-long-way-north')?.image).toBe('https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465910/Northern-Ethiopia.jpg');
    expect(result.tours.find(tour => tour.slug === 'gheralta-tigray-extension')?.image).toBe('https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465909/Gheralta.jpg');
    expect(result.tours.find(tour => tour.slug === 'ras-dashen-add-on')?.image).toBe('https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465918/Ras-Dashen-Add-on.png');
    expect(result.tours.find(tour => tour.slug === 'run-the-simien-7-days')?.image).toBe('https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465910/run-simien.jpg');
  });
  it('is repeatable', () => {
    expect(buildJourneyExpansionPreview(buildJourneyExpansionPreview(source, content), content)).toEqual(buildJourneyExpansionPreview(source, content));
  });
});
