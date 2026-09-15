import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { loadExpansion, buildExpansionPreview, assertImportCompatible, expansionLocales, type ExpansionContent } from './ethiopia-expansion.js';
import { publicCatalogueSchema } from '../../src/modules/catalog/public-catalogue.schema.js';
let content: ExpansionContent;
let source: ReturnType<typeof publicCatalogueSchema.parse>;
beforeAll(async()=>{
 content=await loadExpansion();
 const snapshot=JSON.parse(await readFile(new URL('../../../frontend/lib/generated/catalogue.json',import.meta.url),'utf8').catch(()=>readFile(new URL('../../../../frontend/lib/generated/catalogue.json',import.meta.url),'utf8')));
 source=publicCatalogueSchema.parse(snapshot.catalogue);
});
describe('Ethiopia expansion import and catalogue',()=>{
 it('adds 26 destinations in all four languages and preserves tours and Simien/Gondar records',()=>{
  const result=buildExpansionPreview(source,content);
  expect(result.destinations).toHaveLength(58*4);
  expect(result.tours).toEqual(source.tours);
  for(const locale of expansionLocales){
   const rows=result.destinations.filter(r=>r.locale===locale);
   expect(new Set(rows.map(r=>r.slug)).size).toBe(58);
   expect(rows.filter(r=>r.area==='explore')).toHaveLength(11);
   expect(rows.filter(r=>r.area==='southern')).toHaveLength(21);
  }
  for(const row of source.destinations.filter(r=>r.area==='simien'||r.area==='gondar')) expect(result.destinations.find(r=>r.slug===row.slug&&r.locale===row.locale)).toEqual(row);
 });
 it('preserves existing media and links while assigning new images only to Addis Ababa and Bahir Dar',()=>{
  const result=buildExpansionPreview(source,content);
   for(const row of result.destinations){
   const original=source.destinations.find(r=>r.slug===row.slug&&r.locale===row.locale);
   if(original) expect(row.tourSlugs).toEqual(original.tourSlugs);
   if(original) expect(row.imageUrl).toBe(original.imageUrl);
   else if(row.slug==='addis-ababa'){expect(row.imageUrl).toContain('addis-abebe.jpg');expect(row.imageAlt.length).toBeGreaterThan(20);expect(row.tourSlugs).toEqual([]);}
   else if(row.slug==='bahir-dar'){expect(row.imageUrl).toContain('bahirdar.jpg');expect(row.imageAlt.length).toBeGreaterThan(20);expect(row.tourSlugs).toEqual([]);}
   else {expect(row.imageUrl).toBe('');if(!original) expect(row.tourSlugs).toEqual([]);}
  }
 });
 it('has complete localized content without changed identities or lost conditions',()=>{
  for(const locale of expansionLocales) for(const row of content[locale]){
   const en=content.en.find(r=>r.slug===row.slug)!;
   expect(row.area).toBe(en.area);expect(row.type).toBe(en.type);
   expect(row.overview.length).toBe(en.overview.length);expect(row.highlights.length).toBe(en.highlights.length);expect(row.thingsToDo.length).toBe(en.thingsToDo.length);
   expect(row.overview.every(p=>p.length>40)).toBe(true);
   expect(JSON.stringify(row)).not.toMatch(/⟦|⟧/);
   if(locale!=='en') expect(row.overview).not.toEqual(en.overview);
  }
 });
 it('is repeatable and rejects collisions or intervening editorial changes',()=>{
  const desired=content.en[0];
  expect(()=>assertImportCompatible(null,desired)).not.toThrow();
  expect(()=>assertImportCompatible(desired,desired)).not.toThrow();
  const original={...desired,overview:['Previously approved text'],area:'northern' as const};
  expect(()=>assertImportCompatible(original,desired,original)).not.toThrow();
  expect(()=>assertImportCompatible({...desired,overview:['New editor work']},desired,original)).toThrow(/changed/);
  expect(()=>assertImportCompatible({...desired,area:'gondar'},desired,original)).toThrow(/area changed/);
  expect(()=>assertImportCompatible(original,desired)).toThrow(/changed/);
  expect(()=>assertImportCompatible(null,desired,original)).toThrow(/missing/);
  expect(buildExpansionPreview(buildExpansionPreview(source,content),content)).toEqual(buildExpansionPreview(source,content));
 });
});
