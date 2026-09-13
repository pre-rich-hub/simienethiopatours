# Phase 4 CMS cutover

Implemented 13 September 2026. Local verification uses an isolated API fixture and mocked database boundaries; it does not imply remote staging or production approval.

## Local staging evidence (2026-09-13)

Recorded against local Postgres (podman/docker via `./scripts/staging-local-prep.sh`) plus the backend API — not a public staging hostname.

| Step | Result |
| --- | --- |
| Migrations | Applied through `20260913090000_public_catalogue_journal` (`prisma migrate deploy`) |
| Seed | Approved catalogue seeded into the local database |
| Admin bootstrap | Non-default admin created via seed/admin script |
| Catalogue locales | Published EN plus ES/DE/FR variants present in the public catalogue |
| Outage snapshot | `npm run content:export` wrote `frontend/lib/generated/catalogue.json` with `"provenance": "cms-export"` |

Remote hosting invalidation, authenticated admin publish/unpublish on an assigned staging origin, and production migration remain open.

## Public data and routes

`GET /api/v1/catalogue` returns a validated version-1 catalogue containing complete tours, destinations, journal articles, published locale variants, stable paths, relationships and modification dates. A repeatable-read database transaction keeps related records consistent while editors publish. Tours and destinations require both `isPublished` and `editorialStatus: published`. Journal articles require their publication flag and publication date. Public serializers exclude private review notes, operational records and legacy price/rating fields.

Tours, destination hubs/details, navigation cards, homepage catalogue cards, journal, sitemap and assistant context consume this publication boundary. New slugs work without a frontend rebuild. Destination area controls hub membership; existing alternative detail paths redirect to the canonical area path. The bootstrap's 33 research entries represent 32 unique destinations because Debark appears in both source inventories. Highland villages belong to Simien.

English renders current CMS fields, never an older English translation snapshot. ES/DE/FR variants require published status, a review timestamp and a complete canonical translation payload. Tour/destination payloads use the existing canonical content schemas; article translations use the public article schema. Identity, publication flags, image source URLs and relationships remain source-owned. Missing/incomplete translations redirect temporarily to English details. Hreflang, Open Graph alternates and entity sitemap entries include only available published variants. Hub UI remains localized and cards link directly to the available content locale. Full translation editing and language review remain Phase 5 work.

The journal ships at `/[locale]/journal`, `/[locale]/journal/category/[slug]` and `/[locale]/journal/[slug]`. Admin supports draft/published, author, image alt text and stable slugs. Existing legacy blog/field-note/experience rows migrate as drafts. Do not publish them as complete articles without review. Article content renders as escaped text paragraphs, not executable HTML. Author and dates are real CMS fields; category renames preserve category URLs.

## Cache and outage behavior

Successful validated catalogue reads are cached for 60 seconds, with request-level deduplication. Catalogue HTTP requests have a one-second deadline. A successful empty collection and an authoritative missing response never cause fallback. HTTP request rejection (including authorization/rate-limit failures) is surfaced, not treated as missing data. Network/server/invalid-response failures can use the approved release snapshot. Logs include only the failure category and snapshot version.

Configure matching server-only `CATALOGUE_REVALIDATE_SECRET` values in both services and `CATALOGUE_REVALIDATE_URL` on the backend, pointing to the frontend's `/api/revalidate`. Committed catalogue admin mutations expire the shared frontend catalogue tag and invalidate the assistant cache. The endpoint accepts authenticated POST only; byte-length checks protect constant-time comparison. A failed delivery does not lose the database edit: the admin sees a warning and logs record the affected resource category. Timed refresh recovers missed notifications. Assistant cache lifetime is capped at 60 seconds, including other backend processes.

An outage snapshot represents its approved release, not subsequent edits. During a complete outage, publication changes newer than that export cannot be known. Refresh the export with each content release. Next's successful cached data may also remain available during transient revalidation failures.

## Export and deployment

1. Install dependencies for both `backend` and `frontend`. The frontend shares the backend's pure schema modules; its Turbopack/tracing root includes the workspace. Backend compilation rewrites the shared `.ts` imports to `.js`.
2. Review and apply migration `20260913090000_public_catalogue_journal` after the preceding migrations. It adds destination modification dates and journal publication, author, image-alt and date fields. It does not publish legacy journal rows.
3. Review/publish eligible CMS content and configure the cache invalidation URL/secret. No production publication or database migration was performed by this implementation.
4. From `backend`, run `npm run content:export` against the approved database. An optional output pathname can be supplied after `--`. This reads the same public boundary and atomically writes a deterministic, SHA-256-versioned catalogue snapshot with `cms-export` provenance. Review and commit the generated artifact as part of the content release.
5. Build and deploy the exact reviewed frontend/backend changes. Keep the previous application build and snapshot for rollback; the schema additions are backward-compatible.

`npm run content:bootstrap` generates the development-only snapshot from existing approved research inventory adapters. The committed initial snapshot has `bootstrap` provenance. Production deliberately does not publish that bootstrap during an API outage: without an approved CMS export, catalogue collections stay empty. Do not change the provenance by hand. The legacy seed/adapters remain bootstrap tooling, not runtime catalogue sources or a production update workflow. The new export covers tours, destinations and journal; gallery/testimonial export consolidation remains separate work.

## Verification and outstanding staging checks

Run frontend `npm run lint`, `npm run build`, and `npm run qa:p4 -- --screenshots`; run backend `npm run typecheck`, `npm run build`, `npm test`, `npm run content:audit`, and `npm run content:drift`.

The QA command starts a local fixture API on 5105 and a production frontend on 3105, then shuts them down. It never connects to a database or sends inquiries. It verifies public content, relationships, journal escaping, unknown routes, translation redirects, metadata/sitemap, new slugs, edit/unpublish invalidation, empty results, outage/invalid-response/timeout handling and recovery. Chrome screenshots use explicitly labelled QA journal content. Browser checks exercise desktop/mobile layouts and menu focus. Evidence is in `p4-smoke-results.json` and `p4-screenshots/`.

Pending remote staging acceptance (local migrate/seed/admin/`cms-export` already evidenced above):

- Apply migrations to an ops-assigned staging database and verify the actual Prisma/public API path, including transaction isolation support.
- Create/edit/publish/unpublish/delete one tour, destination and article through authenticated admin on the staging origin; verify public pages, sitemap, relationships and assistant context.
- Confirm invalidation delivery across the real hosting topology and verify the admin warning/recovery path.
- Rehearse API-down rendering against the committed `cms-export` snapshot on the staging frontend origin.
- Confirm remote media access and production-plan gates that remain external (DNS/certs, Search Console, CDN account).

Phase 4's **remote** staging gate is not signed off until these checks have recorded evidence. Local cutover evidence is in the table above and [`qa.md`](qa.md).
