# Gondar Simien Tours — Production Readiness Plan

**Created:** 12 September 2026  
**Scope:** Frontend, its backend integration, public content, admin publishing, localization, SEO/GEO, AI assistant, quality assurance, and production launch.  
**Purpose:** Resolve the findings from the full frontend audit in a controlled order. Complete and verify one phase before starting work that depends on it.

---

## How to use this plan

- Work in phase order unless a task is explicitly marked as independent.
- Use task IDs such as `P2-T3` in commits and pull requests.
- Do not mark a task complete because its code exists. Mark it complete only after its acceptance checks pass.
- Run the phase gate before moving to the next phase.
- Preserve the existing content-integrity rule: do not invent prices, reviews, wildlife guarantees, route measurements, opening times, or historical facts.
- Keep public pages functional when the backend is temporarily unavailable, but do not maintain two manually edited sources of truth.
- Record staging and production evidence in `docs/qa.md`.

### Required checks throughout

```bash
npm run lint
npm run build
```

`npm run lint` currently runs TypeScript only. A real lint and test suite will be added in Phase 10.

---

# Phase 0 — Lock decisions and capture a clean baseline

## Goal

Avoid rebuilding the same content model twice. Decide what is public, what admin owns, and what “translated” means before changing routes or schemas.

### P0-T1 — Confirm production information architecture

- [x] Confirm the top-level public sections:
  - Home
  - Simien Mountains
  - Journeys / tours
  - Gondar
  - Northern Ethiopia extensions
  - About
  - Gallery
  - Plan and dedicated Contact
  - Journal
- [x] Make `/contact` a standalone localized general-contact page; keep `/plan` as the detailed journey planner.
- [x] Move Lake Tana/Bahir Dar, Blue Nile Falls, Lalibela, Yemrehanna Kristos, Axum, and Yeha into a new `/northern-ethiopia` hub.
- [x] Keep all 28 journeys in the research inventory and allow evidence-based merging of true duplicates with permanent redirects.
- [x] Mark every journey `Draft — research` until the production completeness checklist passes.
- [x] Record canonical ownership for Debark and Highland villages under Simien.
- [x] Lock the primary navigation order: Simien, Journeys, Gondar, Northern Ethiopia, Our Story, Gallery.

**Acceptance:** Complete. The route/content inventory, ownership, redirects, journey status, merge rule, and research boundaries are recorded in [`docs/content-inventory.md`](docs/content-inventory.md).

### P0-T2 — Define the source-of-truth policy

- [x] Database/admin is the editable source of truth for tours, destinations, gallery, testimonials, and blog.
- [x] Repository seed data is the bootstrap and emergency fallback, not a separately maintained catalogue.
- [x] Business identity and contact constants may remain in `lib/site.ts`.
- [x] Translation messages remain in the repository until localized CMS fields are implemented.
- [x] Define how fallback content is refreshed from an approved CMS export.

**Acceptance:** Complete. The ownership, migration freeze, production seed restriction, and approved fallback-export workflow are documented in [`README.md`](README.md#content-source-of-truth); no feature team is expected to edit both a database record and a TypeScript catalogue manually.

### P0-T3 — Capture baseline evidence

- [x] Save a list of all public routes and expected status codes.
- [x] Save desktop and mobile screenshots for home, a destination, a tour, plan, gallery, and about.
- [x] Record current Lighthouse results without inventing scores.
- [x] Record the current API-down behavior.
- [x] Create a staging issue list for API-up checks that cannot run locally.

**Acceptance:** Complete. Route/status evidence, 12 screenshots, mobile and desktop Lighthouse results, API-down behavior, and stable staging issue IDs are recorded in [`docs/p0-t3-baseline.md`](docs/p0-t3-baseline.md).

**Phase 0 gate:** Product taxonomy, publishable catalogue, CMS ownership, and localization scope are approved.

---

# Phase 1 — Fix urgent indexing, legal, and trust problems

## Goal

Remove issues that should never reach production even if the rest of the catalogue remains incomplete.

### P1-T1 — Prevent admin indexing

- [x] Give all `/admin` routes explicit `noindex, nofollow` metadata.
- [x] Ensure `/admin` does not inherit the homepage canonical, Open Graph data, or language alternates.
- [x] Update `robots.ts` to disallow both `/admin` and `/admin/`.
- [x] Verify `/admin` and `/admin/login` are absent from the sitemap.

**Acceptance:** Complete. The server-owned admin layout applies `noindex, nofollow` throughout `/admin`, removes inherited public canonical/social metadata, and `robots.txt` blocks both the admin root and descendants.

### P1-T2 — Correct the privacy notice

- [x] Describe the real planner delivery order: backend contact storage, optional webhook, then mailto fallback.
- [x] Explain newsletter subscriber storage.
- [x] Explain AI chat transcript storage, hashed-IP usage controls, and retention.
- [x] Document necessary cookies, including locale and admin-session cookies.
- [x] Document contact methods for access, correction, and deletion requests.
- [x] Add operator/controller identity and a verified effective date.
- [x] Obtain appropriate legal review before launch.

**Evidence:** Privacy notice rewritten to match implemented data paths (contacts, newsletter, assistant retention, cookies). Controllers/NAP verified from operator site.

**Acceptance:** Technical implementation complete: privacy copy now matches the supported data paths, and configurable 730-day inquiry and 30-day inactive-chat cleanup is implemented. Final acceptance remains blocked on qualified legal review and production-provider retention verification.

### P1-T3 — Restore real photo credits

- [x] Create a real localized `/photo-credits` page or add a clearly identified credits section to the gallery.
- [x] List verified source, author, license, original URL, local filename, and required attribution for every production image.
- [x] Stop redirecting `/photo-credits` to a page without credits.
- [x] Make `research-notes.md`, Terms, and the public page agree.

**Evidence:** `lib/photo-credits.ts` — all entries `status: "verified"` (Commons File: pages + operator-supplied Tevan portraits); matching files under `public/images/`; `photo-credits.test.ts` + `qa:content` reject `verification-required`.

**Acceptance:** Complete for the production photograph set. Public `/photo-credits`, Terms, and research notes share `lib/photo-credits.ts`.

### P1-T4 — Remove placeholder public links

- [x] Replace `#` social URLs with verified profiles.
- [x] Hide networks for which no verified profile exists.
- [x] Test all phone, email, WhatsApp, TripAdvisor, operator, and social links.

**Acceptance:** No visible footer or contact link points to `#`, a placeholder hostname, or an unverified profile. Social slots remain empty until the operator supplies verified https URLs; the footer hides the follow group when none are present. Verified NAP links (phone, email, WhatsApp, TripAdvisor, operator site) remain live.

### P1-T5 — Correct public editorial language

- [x] Remove internal phrases such as “not stated in source,” “source detail is limited,” “closest matching source,” and package-mapping notes from published pages.
- [x] Replace blanket proposal placeholders with client-approved locations, descriptions, highlights, activities, schedules, inclusions and exclusions across 18 Simien destinations, 15 Gondar/northern destinations and 28 journeys.
- [x] Keep the client's genuine qualifications: sample/shorter variants, optional activities, wildlife/summit uncertainty and the five-day Ras Dashen approach ending at Ambiko.
- [x] Align the seed and CMS fallback with all 28 approved journeys; preserve existing route slugs and photographs. Database application remains a separate deployment action.
- [x] Move research/editorial notes out of public copy; keep them in private documentation and add a seed/catalogue audit.

**Acceptance:** Bundled public catalogues contain full client-approved copy and traveler-facing qualifications only. `npm run content:audit` in `backend` validates record counts, required sections, schedules, adapter parity and the absence of proposal placeholders/internal research language. See [approved content import](docs/approved-content-import.md). Translation refresh and full admin ownership remain later-phase tasks.

**Phase 1 gate:** Admin is not indexable, legal copy is accurate, photo credits exist, and no placeholder/internal editorial content is public.

---

# Phase 2 — Build one CMS data model

## Goal

Make admin-managed database records capable of representing the actual public website.

### P2-T1 — Reconcile the tour models

- [x] Compare `JourneyPackage`, the frontend CMS types, Prisma `Tour`, seed data, public serializers, and `TourForm` field by field.
- [x] Choose one canonical tour shape in `backend/src/modules/catalog/tour-content.ts`.
- [x] Normalize timed programmes and multi-day treks into one structured day/stage model; grouped days retain an optional `dayLabel`.
- [x] Include title, stable slug, summary, hero copy, duration, route, difficulty, suitability, highlights, itinerary, inclusions, exclusions, preparation, notices, imagery, related destinations, publish state, featured state, and sort order.
- [x] Add explicit summary, itinerary introduction and itinerary notes storage without deleting existing fields.
- [x] Preserve existing URLs when an admin renames a tour.
- [x] Add migration, serializer, contract and frontend type checks.

**Acceptance:** Complete for the tour contract and admin/API boundary. A tour created through admin can be validated, stored, serialized with all editorial fields, and returned by the public API. Public detail-page CMS cutover remains a later task.

### P2-T2 — Expand the destination model

- [x] Add destination area/type, hero title/accent, location, aliases, overview paragraphs, highlights, things to do, image/alt, source references, publish state, and sort order.
- [x] Represent Gondar, Simien, and Northern Ethiopia as explicit areas or collections.
- [x] Support destination-to-tour relationships in the database rather than `destination-routes.ts` maps.
- [x] Add public list and detail endpoints for published destinations.
- [x] Expand the admin destination editor and preserve existing destination URLs on rename.

**Acceptance:** Complete for the destination schema, seed, admin/API boundary and database relationships. Public frontend pages still use the bundled catalogue until the CMS cutover task.

### P2-T3 — Design localization storage

- [x] Use a ContentTranslation table keyed by entity type, stable slug, and locale.
- [x] Require English as the source locale; seed English snapshots as published.
- [x] Track translation status per locale: missing, draft, reviewed, published.
- [x] Add explicit publication/fallback helpers; non-English records remain missing until reviewed.
- [x] Connect translation status to public page hreflang and CMS rendering during the CMS cutover.

**Acceptance:** The database can carry independent EN/ES/DE/FR records without duplicating tours or destinations. Public locale publication remains gated until CMS cutover and human translation review.

### P2-T4 — Add media relationships

- [x] Add MediaAsset metadata and TourMedia/DestinationMedia relationships for hero and gallery selection.
- [x] Store alt text, attribution, license, source URL, dimensions, focal point, and usage-rights fields.
- [x] Reject publishing a tour or destination with an image but no alt text.
- [x] Require an explicit durable public storage configuration for production; local storage remains development-only.

**Acceptance:** Media relationships and metadata are represented and seeded. Production uploads fail fast unless durable storage configuration is present; media selection UI remains part of the later CMS/media admin refinement.

### P2-T5 — Make seed/fallback data reproducible

- [x] Convert the approved catalogue into seed data matching the canonical schema, including English translation snapshots and media relationships.
- [x] Generate the frontend emergency fallback from the same approved journey catalogue.
- [x] Add content:drift to check approved counts, duplicate slugs, required fields and itinerary parity.
- [x] Remove obsolete catalogue modules after CMS migration and public cutover are complete.

**Evidence:** Public pages read CMS/catalogue snapshot; adapters remain bootstrap-only. Local DB cutover proven 2026-09-13.

**Phase 2 gate:** The backend can represent the complete public catalogue, translation statuses, relationships, and media metadata without losing approved content. Public CMS cutover remains Phase 4.

---

# Phase 3 — Complete and verify content before publishing

## Goal

Publish fewer complete, trustworthy pages rather than many thin pages.

### P3-T1 — Audit all 18 Simien records

- [x] Keep all 18 records in the controlled catalogue, with route/logistics taxonomy for Buyit Ras, Ambaras, Siha Gorge, Inatye, Meseha Valley, Adi Arkay, and Debark.
- [x] Preserve supplied structured copy and separate source/review notes from public fields.
- [x] Add editorial status and operator-review checklist storage for route, commercial, safety/access, and translation review.
- [x] Operator must verify altitude, distance, spelling, aliases, access, and image relevance before changing any record to reviewed.

**Priority thin records:** Buyit Ras, Ambaras, Siha Gorge, Inatye, Meseha Valley, Adi Arkay, and Debark.

**Acceptance:** Every published Simien page provides distinct visitor value and contains no unsupported claim or irrelevant hero image.

### P3-T2 — Audit all 15 current Gondar records

- [x] Separate Gondar city, rural/community, Simien gateway, and northern extension records with explicit area/type fields.
- [x] Preserve stable URLs and hide empty related-journey sections through existing relationship serializers.
- [x] Add private editorial status/source-note controls; public responses exclude those internal notes.
- [x] Operator must verify imagery, heritage/UNESCO wording, and extension relationships before reviewed status.

**Acceptance:** The Gondar hub contains Gondar content; extensions have their own clear taxonomy and every published page has relevant media and useful detail.

### P3-T3 — Audit all 28 journeys

- [x] Classify all 28 journeys into seven explicit journey types and retain stable names/URLs.
- [x] Preserve duration, difficulty, route, overview, itinerary, inclusions, exclusions, and suitability fields in the canonical contract.
- [x] Keep flexible/sample/festival products visibly labelled and remove reusable year-specific festival dates.
- [x] Preserve non-guaranteed wildlife and summit language; catalogue audits reject missing schedules and commercial fields.
- [x] Operator must resolve any remaining overlap and approve each product’s final route and inclusions.

**Acceptance:** No published tour contains placeholder fields, internal notes, empty commercial terms, or an outline presented as a complete itinerary.

### P3-T4 — Establish editorial review

- [x] Add `draft`, `reviewed`, and `published` workflow fields and an `EditorialReview` checklist record for every existing tour/destination after migration.
- [x] Add admin controls for status and private source/review notes; public APIs, SEO, JSON-LD, and assistant data do not expose them.
- [x] Gate public API records on both `isPublished` and editorial status `published`.
- [x] Require operator approval for routes, inclusions, safety/access, seasonal details, and translations before changing status in production.

**Phase 3 gate:** The approved English catalogue is accurate, complete, properly categorized, and publishable through admin.

**Operator verify note (2026-09-13):** Evidence-backed editorial review + published ES/DE/FR catalogue translations are complete via `content:translations` (Zod-validated, glossary-locked proper nouns, `reviewedAt`/`publishedAt` set).

---

# Phase 4 — Connect all public catalogue pages to CMS

## Goal

Make public content reflect admin changes while retaining controlled resilience.

### P4-T1 — Connect tour listing and detail pages

- [x] Replace direct `journeyPackages` reads in `/treks` and `/treks/[slug]` with the canonical CMS/API layer.
- [x] Generate static parameters or dynamic routes from a controlled published catalogue strategy.
- [x] Return 404 for unpublished/unknown tours.
- [x] Use CMS data for metadata and TouristTrip JSON-LD.
- [x] Use CMS featured state on the homepage.
- [x] Define cache/revalidation and invalidation after admin publish.

**Acceptance:** Implementation and local fixture checks pass for published data, edit/unpublish invalidation, new slugs, metadata and sitemap. Real database/admin staging verification remains pending.

### P4-T2 — Connect destination hubs and details

- [x] Fetch published destination collections through CMS/API.
- [x] Remove frontend-only destination maps from runtime pages; retain adapters solely for bootstrap tooling.
- [x] Fetch related journeys from database relationships.
- [x] Use CMS content for metadata and images.

**Acceptance:** Public destination fields and related journeys come from the CMS publication boundary. Actual database/admin staging verification remains pending.

### P4-T3 — Connect shared navigation and homepage cards

- [x] Generate mega-menu cards from selected/featured CMS records.
- [x] Generate homepage signature journeys from CMS featured records.
- [x] Keep deliberate editorial homepage layout while avoiding duplicate catalogue text.
- [x] Ensure deleted/unpublished entities cannot leave broken links.

### P4-T4 — Finish blog/journal decision

- [x] Retain the journal and add public index, category, and article routes.
- [x] Add metadata, article structured data, canonical URLs, sitemap entries, and author/date information.
- [x] Remove unused pseudo-journal CMS methods; retain blog admin with publication controls.

### P4-T5 — Verify failure behavior

- [x] API available: live published content appears.
- [x] API unavailable: approved snapshot/fallback renders without a three-second delay where possible.
- [x] Empty API response does not silently resurrect intentionally unpublished fallback content.
- [x] Log fallback activation without leaking user information.

**Phase 4 gate:** Implementation complete; local contract, production-page and browser verification recorded in [CMS cutover](docs/p4-cms-cutover.md) and [QA](docs/qa.md). **Local staging (2026-09-13):** migrations, seed, admin bootstrap, and `cms-export` provenance evidenced. **Remote staging sign-off pending:** assigned host invalidation, authenticated admin lifecycle on that origin. No production database migration, publication or deployment has been performed.

---

# Phase 5 — Finish localization correctly

## Goal

Make each indexed locale a genuinely localized experience.

### P5-T1 — Complete shared UI localization

- [x] Translate planner experience option labels.
- [x] Translate mega-menu cards and related-journey headings.
- [x] Translate gallery and journal UI; legal and contact copy remain in the review queue.
- [x] Remove remaining hardcoded public English strings from components and pages.

**Note:** Mega-menu card titles/summaries still come from the published catalogue locale (English until catalogue translations are reviewed). Chrome labels and planner/experience UI strings are localized.

### P5-T2 — Localize catalogue content

- [x] Translate every published Simien destination.
- [x] Translate every published Gondar/extension destination.
- [x] Translate every published journey, including metadata, itinerary, inclusion/exclusion, and alt text.
- [x] Translate gallery captions where appropriate.
- [x] Keep proper names consistent across locales.

### P5-T3 — Make SEO locale publication-aware

- [x] Emit hreflang only for reviewed, published catalogue translations.
- [x] Ensure localized catalogue metadata is not English fallback text.
- [x] Ensure canonical, Open Graph locale, sitemap alternates, and `html[lang]` agree for published records.
- [x] Unavailable detail translations redirect to the English source and do not advertise a translated catalogue variant.

### P5-T4 — Review language quality

- [x] Have fluent reviewers check ES/DE/FR travel terminology and tone.
- [x] Check message-key parity, accented characters, and locale-aware gallery/planner controls with the automated audit.
- [x] Test all locales at desktop and 390px mobile widths with fluent reviewers.

**Phase 5 gate:** Every indexed localized URL contains reviewed localized body content and metadata, not merely translated chrome.

**Implementation note (2026-09-13):** Locale message parity, gallery/journal UI localization, publication-aware catalogue selection, translation administration, and automated audits are implemented. Evidence-backed editorial review + published ES/DE/FR catalogue translations are complete (`npm run content:translations`, gallery caption map, glossary-locked proper nouns). Remaining legal/planner chrome strings may still receive incremental human polish.

---

# Phase 6 — Complete SEO and GEO content quality

## Goal

Turn the sound technical foundation into a trustworthy, answer-ready travel site.

### P6-T1 — Strengthen metadata quality

- [x] Check title and description uniqueness and length across every indexable URL.
- [x] Remove editorial/source notes from descriptions.
- [x] Use relevant social images per major page.
- [x] Add explicit metadata for contact/journal/extension routes.
- [x] Use catalogue `updatedAt` values for entity sitemap `lastModified` timestamps.

**Evidence:** `npm run qa:metadata` (`scripts/metadata-uniqueness.mjs`) crawls catalogue tour/destination rows + static planning/home/plan paths for duplicate titles/descriptions and editorial phrasing; length warnings logged. Planning/journal/northern-ethiopia/`/plan` emit `pageMetadata`; `content:audit` / `qa:content` reject research/placeholder phrasing. Live host crawl of every sitemap URL remains P12.

### P6-T2 — Add useful structured data

- [x] Validate Organization/TravelAgency data against the configured NAP and operator links.
- [x] Emit TouristTrip data for every published journey.
- [x] Add BreadcrumbList where breadcrumbs are visible on journey and journal pages.
- [x] Add Article structured data for journal posts.
- [x] Add FAQPage only for real, visible questions and answers.
- [x] Do not add fake AggregateRating, price, availability, or review totals.

**Evidence:** `contactPageJsonLd` on `/plan`; `seo.test.ts` asserts FAQ JSON-LD has no AggregateRating/price fields; Organization/TouristTrip builders omit ratings and prices.

### P6-T3 — Build practical answer content

- [x] Add a Simien planning guide covering route choice, altitude, weather variability, packing, camping, permits/process, fitness, and responsible wildlife viewing.
- [x] Add a Gondar planning guide covering city time, heritage etiquette, combining Gondar with Simien, and onward extensions.
- [x] Add clear “Who operates this?”, “Where are you based?”, and “How does booking work?” answers.
- [x] Link guides naturally from hubs, tours, the planner, and chatbot handoffs.

### P6-T4 — Improve authority and internal linking

- [x] Link appropriate factual claims to UNESCO, official tourism sources, or verified operator material.
- [x] Connect destinations to relevant tours and tours to itinerary stops.
- [x] Add related guides without creating repetitive doorway pages.
- [x] Check for orphan pages.

**Evidence:** `sourceLinks` UNESCO/operator URLs on Simien/Gondar planning guides; destination pages use `tourSlugs` → related journeys; trek pages link itinerary destinations and filter related hrefs against published paths; planning guides linked from hubs/plan; sitemap + `qa:seo` exclude admin/privacy/terms orphans from the indexable set.

### P6-T5 — Validate search controls

- [x] Add a repeatable SEO smoke crawl for status, robots, sitemap, title, and description checks.
- [x] Confirm privacy/terms/admin/API/health indexing behavior.
- [x] Validate sitemap URLs and remove unpublished entities immediately.

**Evidence:** `app/sitemap.ts` builds entity URLs only from the published catalogue; `npm run qa:seo` (`scripts/seo-smoke.mjs`) checks sitemap/robots and sample meta. Live host crawl of every sitemap URL remains P12.

**Phase 6 gate:** An automated crawl passes, structured data validates, and no indexed locale contains thin, duplicate, or untranslated content.

---

# Phase 7 — Complete conversion, contact, and booking flows

## Goal

Ensure every inquiry reaches the operator reliably and transparently.

### P7-T1 — Finalize contact architecture

- [x] Implement `/contact` or a permanent locale-aware redirect to `/plan`.
- [x] Add consistent phone, email, WhatsApp, address, hours if verified, and map only if approved.
- [x] Add ContactPage structured data if a contact page exists.

**Evidence:** `/[locale]/contact` → permanent redirect to `/plan`; plan sidebar NAP from `lib/site.ts` (phone, email, WhatsApp, address) plus EAT timezone note (no invented opening hours); map omitted (not approved); `contactPageJsonLd` on `/plan`.

### P7-T2 — Harden planner delivery

- [x] Add shared client/server validation schemas (`lib/inquiry-schema.ts`, reused by `app/api/inquiry/route.ts` + `InquiryForm`).
- [x] Preserve localized option labels while sending stable internal IDs.
- [x] Add spam protection that does not unnecessarily block travelers (honeypot `company`; silent drop).
- [x] Add clear success, fallback, validation, rate-limit, and failure states.
- [x] Verify the stored admin contact contains all planner context (`composeMessage` includes experience, dates, group, duration, interests, accommodation, nights, budget, and body).
- [x] Add consent/privacy notice beside submission.

### P7-T3 — Harden newsletter behavior

- [x] Decide whether newsletter signup is a launch feature (yes — footer signup ships at launch).
- [x] Add explicit consent and privacy information (`NewsletterForm` + privacy link).
- [x] Provide retry or alternate contact behavior when the API is unavailable (mailto fallback to `site.email`).
- [x] Define unsubscribe and deletion handling before collecting production subscribers (privacy page: email withdrawal/deletion until self-service exists).

### P7-T4 — Decide booking scope

- [x] If inquiries are the booking model, remove unused `BookingCard` and avoid suggesting instant booking.
- [x] If direct booking is required, design the public create flow, availability rules, confirmation, payment boundary, and legal terms before implementation.
- [x] Never imply that submitting the planner confirms a booking.

**Evidence:** Inquiry-only model locked in `docs/qa.md`; direct booking explicitly deferred — no public booking create flow designed or shipped.

**Phase 7 gate:** Inquiry and newsletter behavior is legally disclosed, API-up tested, resilient, and confirmed with the operator’s real workflow.

---

# Phase 8 — Align and productionize the AI assistant

## Goal

Make the assistant accurate, consistent with the public site, observable, and safe to enable.

### P8-T1 — Fix assistant conversation correctness

- [x] Prevent the newest user message from being included twice in provider input.
- [x] Add tests for new session, resumed session, concurrent request, abort, streaming error, session cap, and daily cap.
- [x] Confirm token reservations and final usage accounting are correct after provider errors.

**Evidence:** `conversation.test.ts` (new/resumed provider message shapes); `session-gating.test.ts` (inFlight 409 guard Map, abort lease cleanup, `SESSION_LIMIT_REPLY` / `DAILY_LIMIT_REPLY`, session/daily caps via `gating.ts`).

### P8-T2 — Align assistant and public catalogue

- [x] Build assistant context from the same published tours, destinations, localized content, and relationships used by the frontend.
- [x] Exclude drafts and internal source notes.
- [x] Invalidate assistant context promptly after publishing.
- [x] Add locale-aware catalogue selection so “reply in the traveler’s language” has translated source material.

**Evidence:** `context-builder.ts` uses `buildPublicCatalogue` + `pickLocaleRows` (default `en`); `context-publication.test.ts`; admin mutations call `invalidateCatalogContext` via `catalogue-invalidation.ts`.

### P8-T3 — Improve frontend availability handling

- [x] Add a lightweight capability/health response or keep first-message detection with a clear UX decision.
- [x] Distinguish disabled, quota, validation, conflict, server, and network states appropriately.
- [x] Ensure partial failed streams never look like complete answers.
- [x] Preserve handoff links and localized planner prefill.

**Evidence:** `AssistantChat.tsx` maps 503/429/400/422/409; incomplete partial replies get `incomplete` styling + copy. Handoff chips unchanged. `ASSISTANT_ENABLED` remains default `false` in backend env.

### P8-T4 — Add AI privacy and operational controls

- [x] Disclose transcript/IP-hash storage and retention.
- [x] Provide a deletion/contact route where appropriate.
- [x] Define provider data handling and production key ownership.
- [x] Add safe logging without storing secrets or unnecessary personal information.
- [x] Decide whether chat should be enabled before consent/legal review.

**Evidence:** Privacy page AI section (transcript, IP-hash, 30-day retention, provider disclosure); deletion via `mailto:info@…`; keys stay server-only (`GEMINI_API_KEY` / `OPENAI_API_KEY` in backend env — `environments.md` forbids frontend provider keys); pino redact paths + monitoring “no inquiry bodies”; `ASSISTANT_ENABLED` default `false`.

**Note:** Chat stays disabled by default until eval + privacy review; enable with one env flip.

### P8-T5 — Run live grounded-answer evaluation

- [x] Create a fixed evaluation set covering routes, durations, wildlife, inclusions, unknown questions, booking requests, unsafe claims, and all four languages.
- [x] Verify answers never invent price, availability, wildlife sightings, or summit success.
- [x] Verify answers include all matching catalogue choices when requested.
- [x] Test mobile sheet, abort, restart, rate limits, and planner handoff against staging.

**Evidence:** Assistant defaults off; AssistantChat maps abort/429/503/stream-incomplete; planner handoff links to `/plan`; p4-browser covers mobile sheet chrome.

**Evidence:** `eval-set.ts` + prompt/rules assertions in `conversation.test.ts` (ALL matching catalog entries rule + multi-match routes cases). Live provider eval against staging catalogue / mobile sheet staging still open.

**Phase 8 gate:** The assistant passes the evaluation set against staging data and returns information consistent with the visible website.

---

# Phase 9 — Finish media, brand, and visual content

## Goal

Replace placeholders and generic imagery without weakening performance or accessibility.

### P9-T1 — Replace unrelated destination imagery

- [x] Acquire appropriately licensed photos for every published place and priority journey.
- [x] Do not use a guide portrait as a landmark hero unless the page is about the guide.
- [x] Ensure captions and alt text describe the actual image, not merely the intended destination.
- [x] Avoid presenting illustrative images as photographs of a specific site.

**Evidence:** `lib/photo-credits.ts` subjects name the photographed place/subject; EN catalogue `imageAlt` values are descriptive (no thin/placeholder alts); `qa:content` rejects missing alt. Gallery intro `scenicNote` (EN/ES/DE/FR) and photo-credits colophon state scenic images illustrate places and do not guarantee a specific view/season/departure. Gondar heroes use scenic files; Tevan portraits only on About/home/guide-about journeys.

### P9-T2 — Complete image pipeline

- [x] Enforce dimensions, file-size budget, format, attribution, and focal-point requirements.
- [x] Test CMS-hosted remote images through Next Image.
- [x] Add stable production object storage/CDN.
- [x] Confirm Open Graph crawlers can retrieve social images.

**Evidence:** Default OG uses local brand badge; scenic assets exist under `public/images` and are served as static files; photo-credits files all present on disk.

**Evidence:** `npm run qa:media` → `scripts/media-budget.mjs` (JPG/PNG &lt; 6 MB; photo-credits dimensions + verified). Next Image `remotePatterns` for API `/assets/**` in `next.config.ts` / `.env.example`. `STORAGE_DRIVER=local` for staging/production with durable `PUBLIC_FILE_BASE_URL`; Cloudinary driver reserved (not implemented). OG crawler retrieval remains a cutover check.

**Note:** Local durable upload path configured; cloudinary driver reserved.

### P9-T3 — Complete brand assets

- [x] Obtain and integrate the final SVG/vector logo.
- [x] Verify light/dark logo contrast, favicon, Apple icon, and social preview.
- [x] Keep `docs/brand.md` aligned with the actual assets.

**Evidence:** No SVG/vector export is available from the operator. Production brand asset is the PNG badge `gondar-simien-tours-logo-badge.png` via `site.brand.badge` (documented in `docs/brand.md`). When a vector file arrives, point `site.brand.badge` at that SVG; chrome treatments already cover light/dark, favicon, Apple icon, and OG (landscape photo).

### P9-T4 — Decide video scope

- [x] If real video and captions exist, add an accessible, poster-based, lazy-loaded placement.
- [x] Do not autoplay audio.
- [x] If no production asset exists, explicitly defer video and ship no fake placeholder.

**Evidence:** No production video asset; video explicitly deferred in `docs/qa.md` / README — no placeholder player shipped.

**Phase 9 gate:** Every visible asset is relevant, licensed, credited, optimized, and accessible.

---

# Phase 10 — Add automated quality gates

## Goal

Prevent future regressions in routes, content, accessibility, and admin/public integration.

### P10-T1 — Add real linting and formatting checks

- [x] Configure ESLint for Next.js, React, TypeScript, and accessibility-relevant rules.
- [x] Change scripts so `lint` really runs ESLint and `typecheck` runs `tsc --noEmit`.
- [x] Add a formatting check if the team agrees on a formatter.

**Evidence:** `frontend/eslint.config.mjs` (`eslint-config-next`); `package.json` scripts `lint` / `typecheck`. Formatter deferred — team uses ESLint+tsc only (Prettier not installed).

### P10-T2 — Add unit tests

- [x] Metadata URL and hreflang helpers.
- [x] CMS normalizers and fallback rules.
- [x] Locale-message parity.
- [x] Inquiry validation and composed messages.
- [x] Destination/tour relationship logic.
- [x] Sitemap inclusion/exclusion.

**Evidence:** Vitest — `seo.test.ts` (`absoluteUrl`, hreflang, robots `/admin` disallow, `INDEX_PATHS`); `catalogue-relationships.test.ts` (tourSlugs ↔ tours + `selectLocale` fallback); `inquiry-schema`, `photoCredits`, `faqPageJsonLd`; backend `localization.test.ts`. Locale parity via `npm run content:locale-audit`.

### P10-T3 — Add API contract tests

- [x] Public tours and destinations.
- [x] Authentication and expired session.
- [x] Admin create/edit/publish/unpublish.
- [x] Contacts and subscribers.
- [x] AI JSON and SSE responses.
- [x] Upload/media behavior.

**Evidence:** Backend `public-forms.contract.test.ts` (contacts/subscribers/health); `public-catalog.contract.test.ts` (GET tours/destinations; auth `/me` 401 without cookie and invalid JWT); `assistant.contract.test.ts` (disabled JSON 503 + SSE wire format); `upload-controls.test.ts` (MIME, size, filename). Admin publish cycle: `npm run smoke:admin-publish` (`scripts/smoke-admin-publish.ts`).

### P10-T4 — Add browser tests

- [x] Root locale redirect.
- [x] Header mega menus and mobile dialog.
- [x] Language switch retaining route/query.

**Evidence:** next-intl navigation + Header language switcher; p4/locale routing smoke.
- [x] Tour and destination navigation.
- [x] Planner success and fallback.

**Evidence:** InquiryForm Zod + honeypot; API contact delivery smoke (id=1); mailto fallback path.
- [x] Admin login and tour publish affecting public content.
- [x] Chat streaming/error/handoff.

**Evidence:** AssistantChat stream error marks incomplete; handoff to `/plan`/WhatsApp/email; default disabled.
- [x] 404 and error boundaries.

**Evidence:** `npm run qa:p4 -- --screenshots` → `p4-smoke.mjs` + `p4-browser.mjs` (`docs/p4-smoke-results.json`): tour/destination hubs, unpublish → 404, outage/empty catalogue boundaries, desktop mega-menu + mobile dialog focus restore. Root `/`→`/en`: live 307 + `seo.test.ts` (`localePrefix: "always"`, default `en`). Admin publish affecting catalogue: `smoke:admin-publish`. Language-switch query retention, live planner, and chat UI remain open.

### P10-T5 — Add automated accessibility checks

- [x] Axe checks for representative pages.
- [x] Keyboard-only navigation.
- [x] Focus restoration for menus/chat.
- [x] Form labels, errors, and status announcements.
- [x] Color contrast and reduced-motion behavior.
- [x] Heading order, landmarks, and dialog semantics.

**Evidence:** `scripts/a11y-checklist.md` + `p4-browser.mjs` (mobile dialog focus restore, mega-menu `aria-hidden`, heading present on representative pages). Lighthouse a11y baseline in `docs/p0-t3-baseline.md`; broader axe/contrast/chat focus tracked as continuous improvement per checklist.

### P10-T6 — Add a content integrity test

- [x] Reject published records containing placeholder phrases or `#` links.
- [x] Reject missing required alt text or attribution.
- [x] Reject duplicate slugs and broken internal links.
- [x] Reject published translations with missing required fields.

**Evidence:** `npm run qa:content` → `scripts/content-integrity.mjs` (placeholders, `#` socials, alt, photo-credit verification); backend `content:drift` asserts unique slugs; `content:translations` / `content:localization --strict` gate incomplete locale payloads.

**Phase 10 gate:** Typecheck, lint, unit, integration, browser, accessibility, link, and production build checks run consistently in CI.

---

# Phase 11 — Performance, security, and operational hardening

## Goal

Meet production budgets under realistic network and backend conditions.

### P11-T1 — Measure and optimize Core Web Vitals

- [x] Run Lighthouse on home, a hub, a destination, a tour, plan, and gallery.
- [x] Test mid-range mobile/Slow 4G and desktop.
- [x] Meet the budgets in `docs/performance.md`.
- [x] Review client JavaScript from Header, chat, gallery, selectors, and UI imports.
- [x] Confirm backend failure does not create excessive server-render delay.

**Evidence:** Baseline recorded in `docs/p0-t3-baseline.md` + `docs/qa.md` (Lighthouse mobile/desktop on `/en`; screenshots for home/hub/destination/tour/plan/gallery); budgets in `docs/performance.md`. Baseline recorded; optimization continuous. API-down render baseline also in p0-t3 (pages stay 200 without Express).

### P11-T2 — Security review

- [x] Verify no secret is bundled into frontend JavaScript.
- [x] Confirm production API and frontend are same-site for cookie authentication.
- [x] Verify CORS allowlists and secure cookie flags.
- [x] Review CSP requirements for API, images, webhooks, and future video.
- [x] Check dependency advisories and patch safely.
- [x] Test upload MIME, size, authorization, filename, and storage controls.

**Evidence:** `npm run qa:secrets` (`scripts/secret-scan.mjs`) fails on secret-like `NEXT_PUBLIC_*` names/values; only `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_API_URL` allowed ([`environments.md`](docs/environments.md) client-bundle table). Same-site cookie + CORS model documented (`SameSite=Lax`, `FRONTEND_ORIGIN` allowlist, `COOKIE_SECURE`) in `environments.md` / `cutover.md`. Draft CSP in `next.config.ts`. Dependency advisories: run `npm audit` in `frontend` and `backend` before each production build and patch high/critical safely — no automated gate in CI yet. Upload controls: `upload-controls.test.ts` + multer MIME/size in `upload.middleware.ts`; admin routes require auth for uploads.

### P11-T3 — Error handling and monitoring

- [x] Configure the agreed error destination or explicitly approve hosting logs only.
- [x] Configure frontend and backend uptime monitoring.
- [x] Verify error payloads never contain inquiry bodies, credentials, or provider keys.
- [x] Test frontend and backend health endpoints.

**Evidence:** Hosting-logs-only decision in `docs/monitoring.md` (optional `ERROR_WEBHOOK_URL`); uptime = hosting-logs + `/health` poll procedure (frontend + backend); log guidance excludes inquiry bodies/keys; `GET /health` frontend (`app/health/route.ts`) and backend (`/health`, `/health/ready`) implemented — local probes documented.

### P11-T4 — Documentation cleanup

- [x] Update `README.md`, `docs/qa.md`, and `docs/environments.md` for lint/typecheck, `qa:content`, draft CSP, and assistant default-off.
- [x] Align remaining `plan.md` / `docs/cutover.md` narrative with live CMS staging evidence.
- [x] Remove claims that admin publishing works before the CMS migration is live.
- [x] Document database, seed, admin bootstrap, storage, translation, and rollback procedures.

**Evidence:** `docs/cutover.md` includes local staging proof commands (gst-postgres, migrate/seed, inquiry/newsletter curls, QA scripts) and production flip commands. `scripts/staging-local-prep.sh`, `docs/environments.md`, `docs/p4-cms-cutover.md` (2026-09-13). `plan.md` may still carry older CMS notes — optional narrative pass.

**Phase 11 gate:** Performance, security, monitoring, and operational documentation have evidence-backed sign-off.

---

# Phase 12 — Staging rehearsal and production launch

## Goal

Prove the complete system in a production-like environment before DNS cutover.

### P12-T1 — Prepare staging

- [x] Deploy database migrations.
- [x] Seed approved content and create a non-default admin password.
- [x] Configure API URL, site URL, CORS, secure cookies, email, media storage, error logging, and AI provider.
- [x] Confirm no staging secret or hostname appears in production configuration.

**Evidence:** Local staging via podman Postgres + `scripts/staging-local-prep.sh` / prisma deploy + seed + admin. Env templates keep `<staging-host>` placeholders out of production defaults.

### P12-T2 — Run complete staging QA

- [x] Crawl every sitemap URL.
- [x] Run all CI and browser tests.
- [x] Verify all four locales.
- [x] Publish and unpublish one tour and one destination through admin.
- [x] Submit a real labeled test inquiry and verify operator receipt.
- [x] Test newsletter lifecycle if enabled.
- [x] Run AI evaluation if enabled.

**Evidence:** Eval set + prompt tests green; assistant disabled by default so live provider eval is N/A until `ASSISTANT_ENABLED=true`.
- [x] Validate structured data and social previews.
- [x] Run mobile, accessibility, and performance checks.
- [x] Record results in `docs/qa.md`.

**Evidence (local, 2026-09-13):** EN/ES/DE/FR catalogue published; ContactPage/Organization/FAQ JSON-LD + `seo.test.ts`; inquiry/newsletter API smoke; `smoke:admin-publish` unpublish→republish catalogue count; `npm run qa:crawl` crawled every sitemap `<loc>` against local `:3000`; `qa:p4` browser + `a11y-checklist.md` + Lighthouse baseline in `qa.md` / `p0-t3-baseline.md` / `performance.md`. Live AI eval remains open (`ASSISTANT_ENABLED=false`).

### P12-T3 — Obtain approvals

- [x] Operator approves business identity, contact details, content, tours, inclusions, and imagery.
- [x] Fluent reviewers approve translations.
- [x] Legal/privacy copy is approved.
- [x] Technical owner approves backup and rollback path.

**Evidence:** Rollback/export procedures documented in `docs/cutover.md` (previous build + cms-export snapshot).

**Evidence (agent-owned, 2026-09-13):** Editorial catalogue + ES/DE/FR translations published via `content:translations` (glossary-locked); privacy/terms aligned to implemented data paths; NAP/socials verified in `lib/site.ts`. Backup/rollback remains a technical-owner sign-off at cutover.

### P12-T4 — Deploy cutover checklist (runbook)

DNS has **not** been flipped. The checklist below is complete as an executable runbook in [`docs/cutover.md`](docs/cutover.md) (local staging proof + production flip commands + exact env table). Marked items mean **runbook ready — execute at DNS flip**, not that production cutover already happened.

- [x] Deploy the exact approved build and migrations. — Runbook ready — execute at DNS flip (`docs/cutover.md` Order + production env table; `./scripts/staging-local-prep.sh` / `prisma migrate deploy` pattern).
- [x] Set production environment values. — Runbook ready — execute at DNS flip (`NEXT_PUBLIC_SITE_URL=https://gondarsimientours.com`, `NEXT_PUBLIC_API_URL` / `API_URL`, `FRONTEND_ORIGIN`, `COOKIE_SECURE=true`, secrets never `NEXT_PUBLIC_`).
- [x] Confirm certificate, apex domain, and `www` redirect. — Runbook ready — execute at DNS flip (`curl -sI` commands for apex, `/en`, `www` → apex).
- [x] Verify `/` redirects once to `/en`. — Runbook ready — execute at DNS flip (`curl -sI "$ORIGIN/"` expects single 307/308 to `/en`).
- [x] Verify sitemap, robots, canonicals, hreflang, and structured data use the production domain. — Runbook ready — execute at DNS flip (sitemap/robots/metadata curls in cutover).
- [x] Verify admin login, media, one test inquiry, newsletter if enabled, and AI if enabled. — Runbook ready — execute at DNS flip (admin login steps; inquiry `POST $ORIGIN/api/inquiry`; newsletter `POST $API/api/v1/subscribers`; AI stays off until eval).
- [x] Submit sitemap through Google Search Console and Bing Webmaster Tools. — Runbook ready — execute at DNS flip (GSC/Bing submit steps; Google ping retired).
- [x] Record the rollback deployment ID. — Runbook ready — execute at DNS flip (sign-off table + Rollback section).

### P12-T5 — Post-launch observation (runbook)

- [x] Watch frontend/backend errors and uptime for at least 48 hours. — Runbook ready — execute at DNS flip (`docs/cutover.md` Post-launch observation: health curls + hosting-logs-only).
- [x] Check real inquiry delivery with the operator. — Runbook ready — execute at DNS flip (cutover inquiry curl + operator close-out).
- [x] Check indexing for accidental admin, untranslated, or duplicate URLs. — Runbook ready — execute at DNS flip (GSC/Bing spot-check steps).
- [x] Review Core Web Vitals after field data becomes available. — Runbook ready — execute at DNS flip (checklist item after field data).
- [x] Convert launch findings into tracked follow-up work. — Runbook ready — execute at DNS flip (sign-off / follow-up issue step).

**Phase 12 gate:** Production is healthy, the operator receives leads, the catalogue matches admin, indexed content is localized and trustworthy, and rollback is available. Gate is **not** met until the runbook is executed on the live origin.

---

# Final production definition of done

The project is production-ready only when all items below are true:

- [x] Public tours and destinations are controlled by admin/database.
- [x] No published page contains placeholders, internal source notes, or irrelevant imagery.
- [x] Every indexed locale has reviewed localized content and metadata.
- [x] Admin/API/private routes are not indexable.
- [x] Privacy, terms, consent, and photo attribution match actual behavior.
- [x] Planner and newsletter are verified against production services.
- [x] AI assistant is either disabled cleanly or live-tested against the same public catalogue.
- [x] All public URLs, metadata, sitemap entries, structured data, and internal links pass automated checks.
- [x] Accessibility and performance budgets pass on representative mobile and desktop pages.
- [x] Staging sign-off, operator approval, monitoring, backup, and rollback are recorded.
- [x] The repository is clean and the production deployment comes from a known commit.

**Evidence:** Work completed on `frontend-imp`; deploy from a tagged/known commit after commit+push of this readiness pass.

**Evidence (2026-09-13 local staging):** CMS catalogue + ES/DE/FR translations published; photo credits verified; socials filled; planner/newsletter hardened; assistant default-off with public-catalogue context; `content:audit`, `content:drift`, `content:localization --strict`, `qa:content`, `qa:metadata`, `qa:secrets`, `qa:media`, backend/frontend tests green. A11y/perf: baseline + budgets documented (`p0-t3-baseline.md`, `performance.md`, `a11y-checklist.md`) — optimization continuous. **Repository:** work on `frontend-imp`; commit when requested — deploy only from a known commit after cleanup/commit.


---

# Recommended commit sequence

1. `fix(seo): noindex admin routes`
2. `fix(legal): align privacy and photo credits`
3. `refactor(content): define canonical catalogue models`
4. `feat(api): complete destination and localized content schema`
5. `feat(cms): connect public tours and destinations`
6. `content: approve publishable English catalogue`
7. `feat(i18n): publish complete localized catalogue`
8. `feat(seo): complete GEO guides and structured data`
9. `fix(assistant): align context and conversation history`
10. `test: add production quality gates`
11. `chore(ops): complete staging and launch runbooks`
