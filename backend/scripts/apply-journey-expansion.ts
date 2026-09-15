import 'dotenv/config';
import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { tourContentSchema, type TourContent } from '../src/modules/catalog/tour-content.js';
import { serializeDetail } from '../src/modules/catalog/tour.serializers.js';
import { destinationSlugs, journeyExpansionSlugs, loadJourneyExpansion, timkatImage, timkatImageAlt, timkatJourneySlugs } from './lib/journey-expansion.js';

const apply = process.argv.includes('--apply');
if (process.argv.some(arg => arg.startsWith('--') && arg !== '--apply')) throw Error('Usage: apply-journey-expansion.ts [--apply]');
const content = await loadJourneyExpansion();
const prisma = new PrismaClient();
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const json = (value: unknown) => JSON.stringify(value);

function editorial(row: TourContent) {
  return {
    tourName: row.tourName, summary: row.summary, overview: row.overview, heroTitle: row.heroTitle,
    heroAccent: row.heroAccent, duration: row.duration, style: row.style, difficulty: row.difficulty,
    fit: row.fit, journeyType: row.journeyType, inquiry: row.inquiry, notice: row.notice,
    itineraryIntro: row.itineraryIntro, route: row.route, facts: row.facts, introduction: row.introduction,
    highlights: row.highlights, preparation: row.preparation, related: row.related, included: row.included,
    excluded: row.excluded, itinerary: row.itinerary, itineraryNotes: row.itineraryNotes,
  };
}

try {
  const report = await prisma.$transaction(async tx => {
    const rows = await tx.destination.findMany({ where: { slug: { in: [...new Set(Object.values(destinationSlugs).flat())] } }, select: { id: true, slug: true } });
    const destinationIds = new Map(rows.map(row => [row.slug, row.id]));
    for (const [tourSlug, slugs] of Object.entries(destinationSlugs)) for (const slug of slugs) if (!destinationIds.has(slug)) throw Error(`Missing destination for ${tourSlug}: ${slug}`);
    const report: Array<{ slug: string; action: string }> = [];
    for (const desired of content) {
      const existing = await tx.tour.findUnique({ where: { slug: desired.slug }, include: { destinations: true } });
      if (existing) {
        const current = tourContentSchema.parse({ ...serializeDetail(existing), destinationIds: existing.destinations.map(link => link.destinationId) });
        if (hash(editorial(current)) !== hash(editorial(desired))) throw Error(`Journey slug already exists with different editorial content: ${desired.slug}`);
        if (existing.image !== desired.image || existing.imageAlt !== desired.imageAlt) {
          report.push({ slug: desired.slug, action: 'update journey image' });
          if (apply) await tx.tour.update({ where: { id: existing.id }, data: { image: desired.image, imageAlt: desired.imageAlt } });
        } else {
          report.push({ slug: desired.slug, action: 'already present; preserved' });
        }
        continue;
      }
      report.push({ slug: desired.slug, action: 'create published journey' });
      if (!apply) continue;
      const linkedIds = destinationSlugs[desired.slug as typeof journeyExpansionSlugs[number]].map(slug => destinationIds.get(slug)!);
      const fields = {
        slug: desired.slug,
        tourName: desired.tourName, summary: desired.summary, overview: desired.overview,
        heroTitle: desired.heroTitle, heroAccent: desired.heroAccent, duration: desired.duration,
        style: desired.style, difficulty: desired.difficulty, fit: desired.fit, journeyType: desired.journeyType,
        image: desired.image, imageAlt: desired.imageAlt, inquiry: desired.inquiry, notice: desired.notice,
        itineraryIntro: desired.itineraryIntro, itineraryNotes: json(desired.itineraryNotes), route: json(desired.route),
        facts: json(desired.facts), introduction: json(desired.introduction), highlights: json(desired.highlights),
        preparation: json(desired.preparation), related: json(desired.related), included: json(desired.included),
        excluded: json(desired.excluded), itinerary: json(desired.itinerary),
        isPublished: true, editorialStatus: 'published', isFeatured: desired.isFeatured, sortOrder: desired.sortOrder,
        editorialSourceNotes: 'Client-supplied signature journey copy, 15 September 2026; published after catalogue contract validation.',
        destinationId: linkedIds[0] ?? null,
      };
      const saved = await tx.tour.create({ data: fields });
      if (linkedIds.length) await tx.tourDestinationJunction.createMany({ data: linkedIds.map(destinationId => ({ tourId: saved.id, destinationId })), skipDuplicates: true });
    }
    for (const slug of timkatJourneySlugs) {
      const existing = await tx.tour.findUnique({ where: { slug }, select: { id: true, image: true, imageAlt: true } });
      if (!existing) {
        report.push({ slug, action: 'Timkat journey not found; skipped image update' });
        continue;
      }
      if (existing.image === timkatImage && existing.imageAlt === timkatImageAlt) {
        report.push({ slug, action: 'Timkat image already present' });
        continue;
      }
      report.push({ slug, action: 'update Timkat image' });
      if (apply) await tx.tour.update({ where: { id: existing.id }, data: { image: timkatImage, imageAlt: timkatImageAlt } });
    }
    return report;
  }, { isolationLevel: 'Serializable', timeout: 120000 });
  console.log(JSON.stringify({ mode: apply ? 'applied' : 'preview', records: report }, null, 2));
  if (apply) console.log('Run npm run content:export and deploy the resulting CMS-export fallback.');
} finally { await prisma.$disconnect(); }
