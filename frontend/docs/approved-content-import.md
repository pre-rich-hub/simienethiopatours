# Client-approved catalogue import

The client-supplied destination and journey copy is the editorial source for this import. Existing slugs and photographs are retained; no independent factual verification or new travel guarantees are implied.

## Included

- 18 Simien destination pages and 15 Gondar/northern destination pages: location, complete About copy, highlights and Things to Do.
- 28 journey pages: overview, highlights, route/duration/difficulty, complete day or timed schedules, inclusions and exclusions.
- Sample itineraries and shorter variants stay labelled. Festival day ranges render as supplied. The five-day Ras Dashen Challenge explicitly ends at Ambiko; its return-day note remains visible.
- English day-trip messages match the approved catalogue. The English page uses the catalogue directly so translations cannot silently override updated copy.
- Legacy itinerary exports and CMS fallback derive from the same journey catalogue.
- Database seed prepares all 28 tours as published. Destinations retain all sections in the existing description field; Debark's two page contexts share one unique database slug (32 unique destinations).

## Deployment boundary

No database seed or migration is run by this import. Review/back up the target database, apply the new `20260912190000_tour_editorial_contract` migration, then explicitly run the seed: the migration adds nullable `summary`, `itinerary_intro` and `itinerary_notes` fields, while the seed overwrites seeded editorial fields and publishes the 28 packages. Existing unrelated records are not deleted; review any obsolete records separately. API/chatbot content in an existing database will not change until those deployment steps are performed.

Public detail pages remain bundled rather than fully admin-managed. This import is not completion of Phase 2 CMS ownership. Non-English editorial translations, media replacement/credits and other production-plan tasks remain separate.

## Checks

Run `npm run content:audit` and `npm run typecheck` in backend; run `npm run lint` and `npm run build -- --webpack` in frontend. The audit requires all 61 records, real schedules, non-empty sections, preserved adapter content and no blanket proposal placeholders.

With a local production frontend running on port 3100, run `node --import tsx scripts/smoke-approved-content.ts` from backend. This checks HTTP status and the actual rendered copy on every English destination and tour page (excluding serialized script data).
