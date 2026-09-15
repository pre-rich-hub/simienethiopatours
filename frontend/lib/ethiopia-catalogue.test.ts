import { describe, expect, it } from 'vitest';
import snapshot from './generated/catalogue.json';
import { publicCatalogueSchema } from './catalogue-contract/public-catalogue.schema';
import { pageMetadata } from './seo';
import { INDEX_PATHS } from '@/app/sitemap-paths';

describe('Ethiopia routes and image-free metadata',()=>{
 it('normalizes legacy northern records without losing content',()=>{
  const catalogue=publicCatalogueSchema.parse(snapshot.catalogue);
  const original=snapshot.catalogue.destinations.find(r=>r.area==='northern')!;
  const record=catalogue.destinations.find(r=>r.slug===original.slug&&r.locale===original.locale)!;
  expect(record.area).toBe('explore');expect(record.path).toBe(`/explore-ethiopia/${record.slug}`);
  expect(record.overview).toEqual(original.overview);
  expect(record.imageUrl).toBe(original.imageUrl);
 });
 it('accepts both new areas but rejects mismatched canonical paths',()=>{
  const data=publicCatalogueSchema.parse(snapshot.catalogue);
  const row=data.destinations[0];row.area='southern';row.path=`/southern-ethiopia/${row.slug}`;
  expect(publicCatalogueSchema.safeParse(data).success).toBe(true);
  row.path=`/gondar/${row.slug}`;
  expect(publicCatalogueSchema.safeParse(data).success).toBe(false);
 });
 it('omits unrelated social images when a destination has no photo',()=>{
  const meta=pageMetadata({title:'Addis Ababa',description:'Gateway',path:'/explore-ethiopia/addis-ababa',image:null});
  expect(meta.openGraph?.images).toEqual([]);expect(meta.twitter?.images).toEqual([]);
  expect(pageMetadata({title:'Home',description:'Home',path:'/'}).openGraph?.images).not.toEqual([]);
  expect(INDEX_PATHS).toContain('/explore-ethiopia');expect(INDEX_PATHS).toContain('/southern-ethiopia');expect(INDEX_PATHS).not.toContain('/northern-ethiopia');
 });
});
