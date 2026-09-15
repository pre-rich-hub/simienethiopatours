# Production content and route inventory

**Decision record:** P0-T1  
**Approved direction:** 12 September 2026  
**Applies to:** public information architecture, route ownership, catalogue review, redirects, navigation, and launch scope

This document is the canonical information-architecture decision for the production-readiness programme. It records what exists now and what the production structure must become. It does not mean that the routes or content described as planned have already been implemented.

## Status and ownership legend

| Value | Meaning |
| --- | --- |
| `Public now` | The current application exposes the route to visitors. |
| `Planned` | The route is approved but does not exist yet. |
| `Draft — research` | Keep the record, but do not treat it as production-ready until its content checklist passes. |
| `Merge review` | Keep both current slugs during research; merge only if the comparison rule below proves they are the same offer. |
| `Move` | Create the new canonical route, then permanently redirect the old route. |
| `EN only` | English catalogue copy exists; ES/DE/FR body content is missing. |
| `UI translated` | Shared UI is translated, but catalogue or page-specific body copy is not necessarily translated. |
| `Human review required` | Locale copy exists in code but has not been recorded as approved by a fluent reviewer. |

Content owners used below are functional owners, not storage decisions:

- **Business identity:** operator name, NAP, credentials, contact details, social profiles.
- **Catalogue:** destinations, journeys, route relationships, inclusions, exclusions, and preparation.
- **Editorial:** home, about, gallery narrative, journal, and cross-linking.
- **Legal/operations:** privacy, terms, consent, booking language, and photo rights.

The editable system of record is decided separately in P0-T2. The `Current source` column records the repository as it exists today.

---

## Canonical production route map

All public content uses an explicit locale prefix: `en`, `es`, `de`, or `fr`.

| Route pattern | Purpose | Owner | Current state | Production decision |
| --- | --- | --- | --- | --- |
| `/{locale}` | Home | Editorial | Public now | Keep |
| `/{locale}/simien-mountains` | Simien hub | Catalogue | Public now | Keep |
| `/{locale}/simien-mountains/{slug}` | Simien destination detail | Catalogue | Public now | Keep and expand |
| `/{locale}/treks` | Journey catalogue | Catalogue | Public now | Keep URL; public label remains “Journeys” |
| `/{locale}/treks/{slug}` | Journey detail | Catalogue | Public now | Keep; incomplete records remain draft during production work |
| `/{locale}/gondar` | Gondar and nearby countryside hub | Catalogue | Public now | Keep and narrow taxonomy |
| `/{locale}/gondar/{slug}` | Gondar destination detail | Catalogue | Public now | Keep only Gondar-area entities |
| `/{locale}/explore-ethiopia` | Explore Ethiopia destination hub | Catalogue | Implemented | Publish after CMS expansion import |
| `/{locale}/explore-ethiopia/{slug}` | Explore Ethiopia destination detail | Catalogue | Implemented | Publish after CMS expansion import |
| `/{locale}/southern-ethiopia` | Southern Ethiopia destination hub | Catalogue | Implemented | Publish after CMS expansion import |
| `/{locale}/southern-ethiopia/{slug}` | Southern Ethiopia destination detail | Catalogue | Implemented | Publish after CMS expansion import |
| `/{locale}/journal` | Journal index | Editorial | Planned | Add for launch |
| `/{locale}/journal/{slug}` | Journal article | Editorial | Planned | Add for launch |
| `/{locale}/about` | Founder and operator story | Business identity | Public now | Keep |
| `/{locale}/gallery` | Photography gallery | Editorial | Public now | Keep |
| `/{locale}/plan` | Detailed journey planner | Catalogue/operations | Public now | Keep as primary conversion route |
| `/{locale}/contact` | General contact information and short inquiry | Business identity/operations | Planned | Add for launch; use the existing contact delivery pipeline |
| `/{locale}/photo-credits` | Public image attribution | Legal/operations | Public manifest; exact rights verification pending | Match every file to an exact source, author, license and permission record before launch |
| `/{locale}/privacy` | Privacy notice | Legal/operations | Public now | Keep and correct in P1 |
| `/{locale}/terms` | Website and planning terms | Legal/operations | Public now | Keep and correct in P1 |

### Routes excluded from public information architecture

- `/admin` and all descendants are operational interfaces, not public content.
- `/api`, `/health`, Next.js assets, and uploaded asset URLs are not navigation or sitemap entries.
- Authentication, admin CRUD, booking administration, contacts, and subscribers remain English-only operational routes.

---

## Navigation decision

The desktop and mobile primary navigation will contain these six entries in this order:

1. Simien
2. Journeys
3. Gondar
4. Explore Ethiopia (including Southern Ethiopia groups)
5. Our Story
6. Gallery

The primary action remains **Plan with Tevan** and links to `/{locale}/plan`.

- Journal is linked from the homepage and footer, not added as a seventh primary-navigation item.
- Contact is linked from the footer and contact surfaces; the detailed planner remains the header action.
- Each destination entry may use a mega menu after the relevant content and images are ready.
- The six-entry desktop layout must be verified at 1101 px and in German, which is expected to produce the widest labels.

---

## Destination inventory

### Simien Mountains

Simien owns the national park, trekking corridor, camps, summit approach, gateway, and approach landscape. There will be 19 target records: the current 18 plus Highland villages moved from Gondar.

| Destination | Current route | Canonical route | Current source | Current content | Translation | Target state / next action |
| --- | --- | --- | --- | --- | --- | --- |
| Simien Mountains National Park | `/simien-mountains/simien-mountains-national-park` | Same | Repository | Substantial | EN only | Draft — research; verify biodiversity, access, and practical guide content |
| Debark | `/simien-mountains/debark` and duplicate `/gondar/debark` | `/simien-mountains/debark` | Repository | Basic gateway content | EN only | Draft — research; retire duplicate and redirect it |
| Buyit Ras | `/simien-mountains/buyit-ras` | Same | Repository | Thin | EN only | Draft — research; expand or merge into a route guide if it lacks standalone value |
| Sankaber | `/simien-mountains/sankaber` | Same | Repository | Useful baseline | EN only | Draft — research; verify access, camp context, and route links |
| Geech | `/simien-mountains/geech` | Same | Repository | Useful baseline | EN only | Draft — research; verify current camp/route status and viewpoint context |
| Jinbar Waterfall | `/simien-mountains/jinbar-waterfall` | Same | Repository | Basic | EN only | Draft — research; verify spelling, seasonality, and route context |
| Imet Gogo | `/simien-mountains/imet-gogo` | Same | Repository | Useful baseline | EN only | Draft — research; expand practical route context and sources |
| Inatye | `/simien-mountains/inatye` | Same | Repository | Thin waypoint | EN only | Draft — research; expand or merge into route content |
| Chenek | `/simien-mountains/chenek` | Same | Repository | Useful baseline | EN only | Draft — research; verify route/camp/wildlife details |
| Ambaras | `/simien-mountains/ambaras` | Same | Repository | Thin logistical point | EN only | Draft — research; expand or merge into route content |
| Siha Gorge | `/simien-mountains/siha-gorge` | Same | Repository | Thin waypoint | EN only | Draft — research; expand or merge into route content |
| Bwahit Pass | `/simien-mountains/bwahit-pass` | Same | Repository | Useful baseline | EN only | Draft — research; verify naming, elevation wording, and route details |
| Ambiko | `/simien-mountains/ambiko` | Same | Repository | Useful baseline | EN only | Draft — research; verify summit-base logistics |
| Ras Dashen | `/simien-mountains/ras-dashen` | Same | Repository | Useful baseline | EN only | Draft — research; reconcile elevation wording and summit safety copy |
| Meseha Valley | `/simien-mountains/meseha-valley` | Same | Repository | Thin waypoint | EN only | Draft — research; expand or merge into route content |
| Sona | `/simien-mountains/sona` | Same | Repository | Basic | EN only | Draft — research; verify lower-transect detail |
| Mulit | `/simien-mountains/mulit` | Same | Repository | Basic | EN only | Draft — research; verify lower-transect detail |
| Adi Arkay | `/simien-mountains/adi-arkay` | Same | Repository | Thin endpoint | EN only | Draft — research; expand gateway/onward context or merge into route guide |
| Highland villages of the Simien approach | `/gondar/highland-villages` | `/simien-mountains/highland-villages` | Repository | Useful contextual baseline | EN only | Move; distinguish road context from a staged visitor attraction |

### Gondar and nearby countryside

Gondar contains seven target records. It no longer contains Debark, the Simien approach, or distant northern-circuit destinations.

| Destination | Current route | Canonical route | Current source | Current content | Translation | Target state / next action |
| --- | --- | --- | --- | --- | --- | --- |
| Gondar | `/gondar/gondar` | Same | Repository | Useful baseline | EN only | Draft — research; expand practical city-planning detail |
| Fasil Ghebbi | `/gondar/fasil-ghebbi` | Same | Repository | Basic | EN only | Draft — research; add verified visitor and heritage context |
| Fasilides’ Bath | `/gondar/fasilides-bath` | Same | Repository | Basic | EN only | Draft — research; replace unrelated hero image and verify Timkat context |
| Debre Berhan Selassie | `/gondar/debre-berhan-selassie` | Same | Repository | Thin | EN only | Draft — research; expand verified history, etiquette, and visit context |
| Kuskuam | `/gondar/kuskuam` | Same | Repository | Thin | EN only | Draft — research; expand verified historical and visit context |
| Woleka | `/gondar/woleka` | Same | Repository | Basic | EN only | Draft — research; handle Beta Israel history sensitively and replace generic media |
| Kosoye Mountains | `/gondar/kosoye-mountains` | Same | Repository | Useful baseline | EN only | Draft — research; verify community, duration, and operating claims |

### Explore Ethiopia destinations

The expanded Explore Ethiopia collection includes the historic and gateway destinations, optional northern extensions, and retained Yeha/Yemrehanna Kristos records. The old Northern Ethiopia URLs remain permanent redirects.

| Destination | Current route | Canonical route | Current source | Current content | Translation | Target state / next action |
| --- | --- | --- | --- | --- | --- | --- |
| Lake Tana / Bahir Dar | `/gondar/lake-tana` | `/explore-ethiopia/lake-tana` | Client expansion | Expanded | EN/ES/DE/FR prepared | Move; preserve existing media and tour links |
| Blue Nile Falls | `/gondar/blue-nile-falls` | `/explore-ethiopia/blue-nile-falls` | Client expansion | Expanded | EN/ES/DE/FR prepared | Move; preserve existing media and tour links |
| Lalibela | `/gondar/lalibela` | `/explore-ethiopia/lalibela` | Client expansion | Expanded | EN/ES/DE/FR prepared | Move; preserve existing media and tour links |
| Yemrehanna Kristos | `/gondar/yemrehanna-kristos` | `/explore-ethiopia/yemrehanna-kristos` | Existing catalogue | Retained | Existing locale availability | Normalize area and preserve media and tour links |
| Axum / Aksum | `/gondar/axum` | `/explore-ethiopia/axum` | Client expansion | Expanded | EN/ES/DE/FR prepared | Move; preserve existing media and tour links |
| Yeha | `/gondar/yeha` | `/explore-ethiopia/yeha` | Existing catalogue | Retained | Existing locale availability | Normalize area and preserve media and tour links |

### Required destination redirects

Each mapping applies to all four locale prefixes.

| Old suffix | New suffix | Redirect |
| --- | --- | --- |
| `/gondar/debark` | `/simien-mountains/debark` | Permanent |
| `/gondar/highland-villages` | `/simien-mountains/highland-villages` | Permanent |
| `/gondar/lake-tana` | `/explore-ethiopia/lake-tana` | Permanent |
| `/gondar/blue-nile-falls` | `/explore-ethiopia/blue-nile-falls` | Permanent |
| `/gondar/lalibela` | `/explore-ethiopia/lalibela` | Permanent |
| `/gondar/yemrehanna-kristos` | `/explore-ethiopia/yemrehanna-kristos` | Permanent |
| `/gondar/axum` | `/explore-ethiopia/axum` | Permanent |
| `/gondar/yeha` | `/explore-ethiopia/yeha` | Permanent |

Do not remove an old route until its redirect and replacement canonical are deployed together. New canonicals, internal links, hreflang, and sitemap entries must use only the target route.

---

## Journey inventory

All 28 current records remain in the working inventory. Their target state is `Draft — research`; this prevents the current presence of a page from being mistaken for production approval. Research may recommend a merge using the rule below.

### Simien trekking and summit journeys

| Journey | Current/canonical route | Current shape | Translation | Review flags |
| --- | --- | --- | --- | --- |
| Simien Mountains Day Trip / Simien in a Day | `/treks/simien-day-trip` | Detailed segments | Full detail localized | Verify operational timings and naming |
| Gelada Country (1 Day) | `/treks/gelada-country` | Outline | EN only | Merge review with day trip only if route, duration, and offer are identical; preserve wildlife positioning if distinct |
| Simien Introduction (2 Days / 1 Night) | `/treks/simien-introduction` | Two brief days | EN only | Complete day detail and confirm camp/logistics |
| 3-Day Simien Mountains Trekking Adventure | `/treks/3-day-simien-trek` | Three days | EN only | Verify route, inclusions, measurements, and product name |
| 4-Day Simien Classic Trek | `/treks/4-day-simien-classic` | Four days | EN only | Verify route, optional Bwahit wording, and measurements |
| 5-Day Royal City & Mountain Adventure | `/treks/5-day-gondar-simien` | Five days | EN only | Merge review with Gondar Heritage & Simien |
| Gondar, Heritage & Simien (5 Days) | `/treks/gondar-heritage-simien` | Five days | EN only | Merge review with 5-Day Royal City & Mountain Adventure |
| Ras Dashen Challenge | `/treks/ras-dashen-challenge` | Five days | EN only | Verify feasible route, acclimatization, difficulty, and summit caveat |
| Ras Dashen Expedition (7 Days) | `/treks/ras-dashen-expedition` | Outline | EN only | Complete itinerary; distinguish from 8- and 10-day products |
| Simien & Ras Dashen (8 Days) | `/treks/simien-ras-dashen-8-day` | Outline | EN only | Complete itinerary; distinguish from 7- and 10-day products |
| 10-Day Simien Mountains & Ras Dashen Expedition | `/treks/10-day-simien-ras-dashen` | Ten days | EN only | Verify full crossing, logistics, inclusions, and route status |

### Wildlife and photography journeys

| Journey | Current/canonical route | Current shape | Translation | Review flags |
| --- | --- | --- | --- | --- |
| Simien Wildlife Journey (2–4 Days) | `/treks/simien-wildlife-journey` | Outline | EN only | Define duration variants without guaranteeing sightings |
| 1-Day Simien Photography Experience | `/treks/simien-photography-day` | Outline; commercial fields missing | EN only | Complete itinerary, difficulty, inclusions, and exclusions |
| 2–3 Day Wildlife & Landscape Photography | `/treks/wildlife-landscape-photography` | Outline | EN only | Define 2- and 3-day variants and distinction from wildlife journey |
| 4–5 Day Simien Photography Expedition | `/treks/simien-photography-expedition` | Outline | EN only | Define 4- and 5-day variants, logistics, and creative focus |

### Gondar experiences

| Journey | Current/canonical route | Current shape | Translation | Review flags |
| --- | --- | --- | --- | --- |
| Royal Gondar Experience | `/treks/royal-gondar` | Outline | EN only | Merge review with History & Culture; define half/full-day variants |
| Gondar Through Local Eyes | `/treks/gondar-through-local-eyes` | Outline; duration/commercial fields missing | EN only | Merge review with Market & Local Life only if experience and stops are identical |
| Gondar Food & Coffee Experience | `/treks/gondar-food-coffee` | Outline | EN only | Complete duration, dietary handling, inclusions, and host/market claims |
| Gondar Photography Walk | `/treks/gondar-photography-walk` | Outline; duration/commercial fields missing | EN only | Complete route principles, permissions, timing, inclusions, and exclusions |
| Gondar History & Culture Tour | `/treks/gondar-history-culture` | Outline; duration incomplete | EN only | Merge review with Royal Gondar Experience |
| Gondar Market & Local Life | `/treks/gondar-market-local-life` | Outline; duration/commercial fields missing | EN only | Complete trading-day variability and merge comparison |
| Gondar & Kosoye Mountains | `/treks/gondar-kosoye` | Outline | EN only | Complete half/full-day variants and community arrangements |
| Gondar Hidden Running Experience | `/treks/gondar-running` | Outline; commercial fields missing | EN only | Complete distance/effort bands without publishing unsafe precision |

### Festival and multi-region journeys

| Journey | Current/canonical route | Current shape | Translation | Review flags |
| --- | --- | --- | --- | --- |
| Timkat & Simien Mountains | `/treks/timkat-simien` | Six days; commercial fields missing | EN only | Verify each season’s dates, access, itinerary, and inclusions |
| Timkat & Ras Dashen | `/treks/timkat-ras-dashen` | Outline; commercial fields missing | EN only | Complete and distinguish from Timkat & Simien plus summit add-on |
| Genna & Simien | `/treks/genna-simien` | Outline; commercial fields missing | EN only | Complete festival schedule rules, itinerary, and inclusions |
| Meskel & Simien | `/treks/meskel-simien` | Outline; duration/commercial fields missing | EN only | Complete duration, festival location, itinerary, and inclusions |
| Mountains & Sacred Stone — Gondar + Simien + Lalibela | `/treks/mountains-sacred-stone` | Nine-day version; shorter variants incomplete | EN only | Complete canonical duration/variants, transfers, and extension relationships |

### Journey merge rule

Research must compare candidate records in a matrix. Merge only if all of these are materially the same:

1. Duration or selectable duration variant
2. Route and overnight sequence
3. Target traveler and difficulty
4. Included operational service
5. Primary experience/positioning

If the difference is only marketing wording, keep one canonical product and redirect the retired slug permanently. If the route or traveler intent is meaningfully different, retain both and explain the difference on the listing. No slug is deleted before its redirect is recorded.

### Journey production completeness rule

A journey can move from `Draft — research` to publishable only when it has:

- A distinct name, summary, traveler fit, duration, route, and difficulty
- A complete itinerary or explicitly selectable complete variants
- Verified inclusions, exclusions, preparation, and change/confirmation notice
- Relevant destinations and internal links
- Accurate hero media, alt text, and attribution
- Source-led factual review with no internal editorial wording
- English approval and human-reviewed ES/DE/FR translations
- Search metadata and structured data derived from the same approved record

---

## Supporting-page inventory

| Page | Current source/state | Translation state | Production action |
| --- | --- | --- | --- |
| Home | Repository plus CMS testimonials | EN/ES/DE/FR implemented; human review required | Keep structure; later connect featured catalogue content to the system of record |
| Simien hub | Repository | EN/ES/DE/FR UI implemented; destination cards remain English | Expand guide content and localize catalogue data |
| Journey hub | Repository | EN/ES/DE/FR UI implemented; cards remain English | Retain only researched publishable products and add comparison clarity |
| Gondar hub | Repository | English body in all locales | Narrow to seven Gondar-area records and fully localize |
| Explore Ethiopia hub | Implemented | EN/ES/DE/FR catalogue content prepared; human review required | Apply the CMS expansion import and export the approved catalogue |
| Southern Ethiopia hub | Implemented | EN/ES/DE/FR catalogue content prepared; human review required | Apply the CMS expansion import and export the approved catalogue |
| Journal | Admin/API exist; no public route | Missing | Add localized index and article routes for launch |
| About | Repository | EN/ES/DE/FR implemented; human review required | Verify credentials and translations |
| Gallery | CMS with repository fallback | English body in all locales | Localize UI and expose complete photo credits |
| Plan | Repository form plus backend/webhook/mailto delivery | UI translated; experience names remain English | Localize options and retain as detailed planning flow |
| Contact | Missing | Missing | Add localized general contact page and short form using contact delivery pipeline |
| Photo credits | Repository manifest and localized route | English body in all locales | Complete exact source/rights verification and translate UI |
| Privacy | Repository | English body in all locales | Correct data-processing disclosures and localize |
| Terms | Repository | English body in all locales | Correct photo-credit reference and localize |

---

## Research and publication policy

The chosen publication model allows complete packages to be constructed through research and an internal content-integrity review without a named operator-approval gate. Because these pages can create real customer expectations, the following restrictions are mandatory.

### Source hierarchy

1. First-party operator material and supplied client documents
2. UNESCO, government, official tourism, park, museum, or religious/cultural institutions
3. Primary geographic, conservation, or academic references
4. Reputable secondary travel references for context only

Competitor tour copy may be used to discover questions requiring verification, but must not be copied or treated as proof of this operator’s services.

### Claims research may establish

- Place identity, broad geography, established heritage, and conservation context
- Common route geography and named waypoints when corroborated
- General climate/season considerations with dated sources
- General difficulty and altitude context expressed as guidance, not medical advice
- Cultural etiquette and responsible wildlife principles

### Claims research must not invent

- Price, discount, availability, or booking confirmation
- Guaranteed pickup/arrival time, access, permit outcome, wildlife sighting, or summit success
- A service, meal, accommodation, guide, scout, porter, mule, vehicle, or equipment inclusion that is not supported by operator material
- Exact operating dates or festival access without a dated current source
- Safety or medical assurances

Missing operational facts must use traveler-facing conditional wording such as “confirmed in your written proposal”; internal phrases such as “not stated in source” must never be published.

### Source ledger fields

Every researched record must capture:

- Claim/topic
- Public or internal-only status
- Source title and organization
- Direct URL or supplied-document reference
- Publication/update date when available
- Date accessed
- Exact field(s) supported
- Confidence and time-sensitivity
- Next review date for seasonal/access claims

---

## P0-T1 completion checklist

- [x] Top-level public sections are confirmed.
- [x] `/contact` is a dedicated localized general-contact page.
- [x] Explore Ethiopia is the broader destination hub, with Southern Ethiopia as a linked subgroup.
- [x] The six former northern records are removed from the target Gondar taxonomy.
- [x] Debark has one canonical Simien record.
- [x] Highland villages moves to the Simien approach collection.
- [x] The primary navigation placement is confirmed.
- [x] Journal is retained and will receive public launch routes.
- [x] All 28 journeys have an owner group and `Draft — research` target status.
- [x] Candidate duplicates have an objective merge rule.
- [x] Research and publication boundaries are recorded.
- [x] Every current public route type has a production action.

P0-T1 is complete when this decision record and the matching `productionPlan.md` checklist are committed together. Route creation, redirects, CMS/schema work, research, and translations remain work for their assigned later phases.
