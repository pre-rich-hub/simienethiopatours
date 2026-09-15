import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { destinationContentSchema, type DestinationContent } from '../src/modules/catalog/destination-content.js';
import { serializeDestination } from '../src/modules/catalog/destination.serializers.js';
import { loadExpansion, expansionLocales, retainedSlugs, assertImportCompatible, editorialContent, type ExpansionLocale } from './lib/ethiopia-expansion.js';

const apply=process.argv.includes('--apply');
if(process.argv.some(a=>a.startsWith('--')&&a!=='--apply')) throw Error('Usage: apply-ethiopia-expansion.ts [--apply]');
const content=await loadExpansion();
const baseline: Record<string, Record<string, DestinationContent>>=JSON.parse(await readFile(new URL('./data/ethiopia-expansion/baseline.json',import.meta.url),'utf8'));
const prisma=new PrismaClient();
const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
try {
 const report=await prisma.$transaction(async tx=>{
  const report: Array<{slug:string;action:string}>=[];
  for(const desired of content.en) {
   const row=await tx.destination.findUnique({where:{slug:desired.slug},include:{tourLinks:true}});
   const current=row?destinationContentSchema.parse({...serializeDestination(row,true),destinationName:row.destinationName,tourIds:row.tourLinks.map(link=>link.tourId)}):null;
   const expected=baseline.en[desired.slug];
   assertImportCompatible(current,desired,expected);
   if(row && (!row.isPublished || row.editorialStatus!=='published')) throw Error(`Publication changed: ${desired.slug}`);
   const translations=await tx.contentTranslation.findMany({where:{entityType:'destination',entitySlug:desired.slug}});
   for(const tr of translations) {
    if(!['es','de','fr'].includes(tr.locale)) continue;
    const locale=tr.locale as ExpansionLocale;
    const next=content[locale].find(r=>r.slug===desired.slug)!;
    const old=destinationContentSchema.parse(JSON.parse(tr.content));
    assertImportCompatible(old,next,baseline[locale][desired.slug]);
    if(tr.status!=='published' || !tr.reviewedAt) throw Error(`Translation publication changed: ${desired.slug}/${locale}`);
   }
   report.push({slug:desired.slug,action:row?'update editorial content; preserve media and links':'create published destination'});
   if(!apply) continue;
   const fields={
    destinationName:desired.destinationName,area:desired.area,type:desired.type,location:desired.location,
    alsoKnownAs:JSON.stringify(desired.alsoKnownAs),heroTitle:desired.heroTitle,heroAccent:desired.heroAccent,
    overview:JSON.stringify(desired.overview),highlights:JSON.stringify(desired.highlights),thingsToDo:JSON.stringify(desired.thingsToDo),
    description:[desired.location,'About',...desired.overview,'Highlights',...desired.highlights,'Things to Do',...desired.thingsToDo].join('\n\n'),
    isPublished:true,editorialStatus:'published',sortOrder:desired.sortOrder,
    imageUrl:row ? row.imageUrl : desired.imageUrl,imageAlt:row ? row.imageAlt : desired.imageAlt,
    editorialSourceNotes:'Client-supplied Ethiopia expansion, 15 September 2026; machine-assisted ES/DE/FR translations with glossary and completeness checks. Kidis Yared alias/ranking corrected as agreed.',
   };
   const saved=await tx.destination.upsert({where:{slug:desired.slug},update:fields,create:{...fields,slug:desired.slug,imageUrl:desired.imageUrl,imageAlt:desired.imageAlt,sourceReferences:'[]'}});
   for(const locale of expansionLocales.filter(l=>l!=='en')) {
    const translated=content[locale].find(r=>r.slug===desired.slug)!;
    const existing=translations.find(t=>t.locale===locale);
    const existingContent=existing?JSON.parse(existing.content):null;
    const next={...translated,imageUrl:saved.imageUrl,imageAlt:row?(existingContent?.imageAlt??row.imageAlt):translated.imageAlt,sourceReferences:current?.sourceReferences??[],tourIds:current?.tourIds??[]};
    const data={content:JSON.stringify(next),sourceHash:hash(editorialContent(desired)),status:'published',reviewedAt:new Date(),publishedAt:new Date()};
    await tx.contentTranslation.upsert({where:{entityType_entitySlug_locale:{entityType:'destination',entitySlug:desired.slug,locale}},create:{entityType:'destination',entitySlug:desired.slug,locale,...data},update:data});
   }
   if(saved.imageUrl) {
    const media=await tx.mediaAsset.upsert({where:{sourceUrl:saved.imageUrl},update:{},create:{sourceUrl:saved.imageUrl,originalName:saved.imageUrl.split('/').pop(),mimeType:'image/jpeg',size:0,altText:saved.imageAlt}});
    await tx.destinationMedia.upsert({where:{destinationId_mediaAssetId_role:{destinationId:saved.id,mediaAssetId:media.id,role:'hero'}},update:{sortOrder:0},create:{destinationId:saved.id,mediaAssetId:media.id,role:'hero',sortOrder:0}});
   } else await tx.destinationMedia.deleteMany({where:{destinationId:saved.id}});
  }
  for(const slug of retainedSlugs) {
   const row=await tx.destination.findUnique({where:{slug}});
   if(!row || !['northern','explore'].includes(row.area)) throw Error(`Expected retained destination missing or moved: ${slug}`);
   report.push({slug,action:'normalize area and order; retain all editorial content, media and links'});
   if(apply) await tx.destination.update({where:{id:row.id},data:{area:'explore',sortOrder:slug==='yeha'?8:7}});
  }
  return report;
 },{isolationLevel:'Serializable',timeout:120000});
 console.log(JSON.stringify({mode:apply?'applied':'preview',records:report},null,2));
 if(apply) console.log('Run npm run content:export and deploy the resulting CMS-export fallback. Catalogue refreshes within 60 seconds.');
} finally {await prisma.$disconnect();}
