import "dotenv/config";
import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";

// Image-only update: do not run the full seed over existing client content.
// Preview: node scripts/apply-client-photos.mjs
// Apply:   node scripts/apply-client-photos.mjs --apply
const targets = JSON.parse(await readFile(new URL("./data/client-photo-targets.json", import.meta.url), "utf8"));
const photos = JSON.parse(await readFile(new URL("../../frontend/lib/client-photos.json", import.meta.url), "utf8"));
const apply = process.argv.includes("--apply");
const prisma = new PrismaClient();

try {
  const report = await prisma.$transaction(async (tx) => {
    const results = [];
    for (const target of targets) {
      const tour = target.entity === "tour";
      const model = tour ? tx.tour : tx.destination;
      const field = tour ? "image" : "imageUrl";
      const photo = photos[target.photo];
      const row = await model.findUnique({ where: { slug: target.slug } });
      if (!row) {
        results.push({ slug: target.slug, status: "missing; skipped" });
        continue;
      }
      if (![target.previousImage, ...(target.previousImages ?? []), photo.url].includes(row[field])) {
        // Preserve photos uploaded or replaced after the original catalogue export.
        throw new Error(`Image changed since this batch was prepared: ${target.entity}/${target.slug}. No changes committed.`);
      }
      results.push({ entity: target.entity, slug: target.slug, previousImage: row[field], image: photo.url });
      if (!apply) continue;

      if (row[field] !== photo.url || row.imageAlt !== photo.alt.en) {
        await model.update({ where: { id: row.id }, data: { [field]: photo.url, imageAlt: photo.alt.en } });
      }
      const mimeType = new URL(photo.url).pathname.endsWith(".png") ? "image/png" : "image/jpeg";
      const media = await tx.mediaAsset.upsert({
        where: { sourceUrl: photo.url },
        update: { altText: photo.alt.en, mimeType },
        create: { sourceUrl: photo.url, originalName: photo.url.split("/").pop(), mimeType, size: 0, altText: photo.alt.en },
      });
      const relation = tour ? tx.tourMedia : tx.destinationMedia;
      const parent = tour ? { tourId: row.id } : { destinationId: row.id };
      await relation.deleteMany({ where: { ...parent, role: "hero", mediaAssetId: { not: media.id } } });
      const existing = await relation.findFirst({ where: { ...parent, role: "hero", mediaAssetId: media.id } });
      if (!existing) await relation.create({ data: { ...parent, mediaAssetId: media.id, role: "hero", sortOrder: 0 } });

      const translations = await tx.contentTranslation.findMany({ where: { entityType: target.entity, entitySlug: target.slug } });
      for (const translation of translations) {
        const content = JSON.parse(translation.content);
        if (!content || typeof content !== "object" || Array.isArray(content) || !Object.keys(content).length) continue;
        const alt = photo.alt[translation.locale];
        if (!alt) continue;
        const next = JSON.stringify({ ...content, [field]: photo.url, imageAlt: alt });
        if (next !== translation.content) await tx.contentTranslation.update({ where: { id: translation.id }, data: { content: next } });
      }
    }
    return results;
  }, { isolationLevel: "Serializable", timeout: 60000 });
  console.log(JSON.stringify({ mode: apply ? "applied" : "preview", records: report }, null, 2));
  if (apply) {
    const url = process.env.CATALOGUE_REVALIDATE_URL;
    const secret = process.env.CATALOGUE_REVALIDATE_SECRET;
    if (url && secret) {
      try {
        const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error("refresh failed");
      } catch {
        console.warn("Images saved; public cache refresh could not be confirmed. Allow 60 seconds for refresh.");
      }
    } else console.warn("Images saved; allow 60 seconds for public catalogue cache refresh.");
    console.log("Run npm run content:export to refresh the saved catalogue from this database.");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
