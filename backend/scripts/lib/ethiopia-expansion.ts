import { readFile } from 'node:fs/promises';
import { destinationContentSchema, type DestinationContent } from '../../src/modules/catalog/destination-content.js';
import { publicCatalogueSchema } from '../../src/modules/catalog/public-catalogue.schema.js';

export const expansionLocales = ['en','es','de','fr'] as const;
export const retainedSlugs = ['yemrehanna-kristos','yeha'] as const;
export const revisedSlugs = ['lake-tana','blue-nile-falls','lalibela','axum'] as const;
export const destinationImages = {
 addisAbaba: 'https://res.cloudinary.com/ps4gvvqu/image/upload/v1789462243/addis-abebe.jpg',
 bahirDar: 'https://res.cloudinary.com/ps4gvvqu/image/upload/v1789462339/bahirdar.jpg',
} as const;
export const destinationImageAlt = {
 en: { 'addis-ababa': 'Addis Ababa highland cityscape in Ethiopia', 'bahir-dar': 'Bahir Dar on the southern shore of Lake Tana' },
 es: { 'addis-ababa': 'Paisaje urbano de las tierras altas de Addis Ababa en Etiopía', 'bahir-dar': 'Bahir Dar en la orilla sur del lago Tana' },
 de: { 'addis-ababa': 'Hochland-Stadtlandschaft von Addis Ababa in Äthiopien', 'bahir-dar': 'Bahir Dar am Südufer des Tana-Sees' },
 fr: { 'addis-ababa': 'Paysage urbain des hauts plateaux d’Addis Ababa en Éthiopie', 'bahir-dar': 'Bahir Dar sur la rive sud du lac Tana' },
} as const;
export type ExpansionLocale = typeof expansionLocales[number];
export type ExpansionContent = Record<ExpansionLocale, DestinationContent[]>;
export const editorialFields = ['destinationName','location','alsoKnownAs','heroTitle','heroAccent','overview','highlights','thingsToDo'] as const;
export function editorialContent(row: DestinationContent) {
 return Object.fromEntries(editorialFields.map(k=>[k,row[k]??'']));
}
export async function loadExpansion(): Promise<ExpansionContent> {
 const entries=await Promise.all(expansionLocales.map(async locale=>{
  const rows: DestinationContent[]=JSON.parse(await readFile(new URL(`../data/ethiopia-expansion/${locale}.json`,import.meta.url),'utf8')).map((row: unknown)=>destinationContentSchema.parse(row));
  if(rows.length!==30 || new Set(rows.map((r:DestinationContent)=>r.slug)).size!==30) throw Error(`Invalid ${locale} destination set`);
  for(const row of rows) {
   if(row.slug==='addis-ababa') {row.imageUrl=destinationImages.addisAbaba;row.imageAlt=destinationImageAlt[locale][row.slug];}
   if(row.slug==='bahir-dar') {row.imageUrl=destinationImages.bahirDar;row.imageAlt=destinationImageAlt[locale][row.slug];}
   if(row.slug!=='addis-ababa' && row.slug!=='bahir-dar') {row.imageUrl=null;row.imageAlt=null;}
  }
  return [locale,rows] as const;
 }));
 return Object.fromEntries(entries) as ExpansionContent;
}

/** Only named editorial fields change. Media and tour links remain owned by the CMS. */
export function assertImportCompatible(current: DestinationContent | null, desired: DestinationContent, baseline?: DestinationContent) {
 if(!current) {
  if(baseline) throw Error(`Expected existing destination missing: ${desired.slug}`);
  return;
 }
 const value=JSON.stringify(editorialContent(current));
 if(value!==JSON.stringify(editorialContent(desired)) && (!baseline || value!==JSON.stringify(editorialContent(baseline)))) throw Error(`Destination changed since preparation: ${desired.slug}`);
 const allowedAreas=[desired.area,...baseline?[baseline.area]:[]];
 if(!allowedAreas.includes(current.area)) throw Error(`Destination area changed: ${desired.slug}`);
}

/** Review fixture only: never written into the production CMS-export fallback. */
export function buildExpansionPreview(input: unknown, content: ExpansionContent) {
 const catalogue=publicCatalogueSchema.parse(input);
 const targets=new Set(content.en.map(row=>row.slug));
 const oldRows=catalogue.destinations;
 catalogue.destinations=oldRows.filter(row=>!targets.has(row.slug));
 for(const locale of expansionLocales) for(const row of content[locale]) {
  const previous=oldRows.find(p=>p.slug===row.slug&&p.locale===locale)??oldRows.find(p=>p.slug===row.slug&&p.locale==='en');
  catalogue.destinations.push({
   slug:row.slug,name:row.destinationName,area:row.area==='northern'?'explore':row.area,type:row.type,
   location:row.location??'',alsoKnownAs:row.alsoKnownAs,heroTitle:row.heroTitle??row.destinationName,heroAccent:row.heroAccent??'',
   overview:row.overview,highlights:row.highlights,thingsToDo:row.thingsToDo,
   imageUrl:previous?.imageUrl??row.imageUrl??'',imageAlt:previous?.imageAlt??row.imageAlt??'',
   sortOrder:row.sortOrder,tourSlugs:previous?.tourSlugs??[],
   path:`/${row.area==='southern'?'southern-ethiopia':'explore-ethiopia'}/${row.slug}`,
   locale,availableLocales:[...expansionLocales],updatedAt:'2026-09-15T00:00:00.000Z',
  });
 }
 for(const row of catalogue.destinations) if(retainedSlugs.includes(row.slug as typeof retainedSlugs[number])) row.sortOrder=row.slug==='yeha'?8:7;
 catalogue.destinations.sort((a,b)=>a.sortOrder-b.sortOrder);
 return publicCatalogueSchema.parse(catalogue);
}
