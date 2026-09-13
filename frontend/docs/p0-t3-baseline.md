# P0-T3 production baseline

Captured **12 September 2026, 17:32–17:52 EAT** from a successful production
build served at `http://127.0.0.1:3100`. The Express API was intentionally not
running. The origin is evidence-only and is not a staging or production host.

## Environment

| Item | Value |
| --- | --- |
| Frontend | Next.js 16.3.4 production build |
| Node / npm | Node 20.20.2 / npm 10.8.2 |
| Browser | Google Chrome 152.0.7977.64 |
| Lighthouse | 12.8.2, run through a temporary `npm exec` package; no dependency was added |
| Desktop viewport | 1440 × 1200 |
| Mobile viewport | 390 × 844 |
| Backend | Unavailable at `127.0.0.1:5000` |

`npm run build` passed, including TypeScript and generation of 301 app pages.
The existing development server on port 3000 was not used or stopped.

## Public route and status baseline

Every path below is available under all four locale prefixes: `en`, `es`,
`de`, and `fr`. The expected and observed status for each localized canonical
page is **200**. A complete sitemap probe checked **272 routes with zero
non-200 responses**. The eight noindex legal routes are intentionally absent
from the sitemap and were checked separately.

| Family | Count | Route suffixes |
| --- | ---: | --- |
| Primary pages | 28 | `/`, `/simien-mountains`, `/treks`, `/gondar`, `/about`, `/gallery`, `/plan` |
| Simien details | 72 | See the 18 slugs below |
| Gondar details | 60 | See the 15 slugs below |
| Journey details | 112 | See the 28 slugs below |
| Noindex legal pages | 8 | `/privacy`, `/terms` |
| **Localized public pages** | **280** | 70 route suffixes × 4 locales |

### Simien detail slugs

All use `/{locale}/simien-mountains/{slug}`:

`simien-mountains-national-park`, `debark`, `buyit-ras`, `sankaber`, `geech`,
`jinbar-waterfall`, `imet-gogo`, `inatye`, `chenek`, `ambaras`, `siha-gorge`,
`bwahit-pass`, `ambiko`, `ras-dashen`, `meseha-valley`, `sona`, `mulit`, and
`adi-arkay`.

### Gondar detail slugs

All currently use `/{locale}/gondar/{slug}`:

`gondar`, `fasil-ghebbi`, `fasilides-bath`, `debre-berhan-selassie`, `kuskuam`,
`woleka`, `kosoye-mountains`, `debark`, `lake-tana`, `blue-nile-falls`,
`lalibela`, `yemrehanna-kristos`, `axum`, `yeha`, and `highland-villages`.

The duplicate and northern-extension routes remain current baseline URLs only.
Their target ownership and future redirects are recorded in
[`content-inventory.md`](content-inventory.md).

### Journey detail slugs

All use `/{locale}/treks/{slug}`:

`simien-day-trip`, `gelada-country`, `simien-introduction`,
`3-day-simien-trek`, `4-day-simien-classic`, `5-day-gondar-simien`,
`gondar-heritage-simien`, `ras-dashen-challenge`, `ras-dashen-expedition`,
`simien-ras-dashen-8-day`, `10-day-simien-ras-dashen`,
`simien-wildlife-journey`, `simien-photography-day`,
`wildlife-landscape-photography`, `simien-photography-expedition`,
`royal-gondar`, `gondar-through-local-eyes`, `gondar-food-coffee`,
`gondar-photography-walk`, `gondar-history-culture`,
`gondar-market-local-life`, `gondar-kosoye`, `gondar-running`,
`timkat-simien`, `timkat-ras-dashen`, `genna-simien`, `meskel-simien`, and
`mountains-sacred-stone`.

### Redirects, missing routes, and service endpoints

| Request class | Expected | Observed |
| --- | --- | --- |
| `/` | 307 to `/en` | 307 to `/en` |
| Valid public suffix without a locale | 307 to its `/en` equivalent | 307 on representative hub, detail, journey, and legal paths |
| Ten configured legacy suffixes, with or without a supported locale | 308 to the configured canonical | All 50 combinations returned 308 |
| `/en/contact` | 404 until P7-T1 | 404 (`/contact` first locale-redirects there) |
| `/en/northern-ethiopia` | 404 until P4-T3 | 404 (`/northern-ethiopia` first locale-redirects there) |
| Unknown localized page | 404 | `/en/not-a-real-page` returned 404 |
| `/robots.txt`, `/sitemap.xml`, `/health` | 200 | 200 |

The ten baseline legacy suffixes are `/beyond-the-trail`,
`/festival-journeys`, `/gondar-running-experience`,
`/simien-photography-tour`, `/where-to-stay-gondar-simien`, `/ras-dashen`,
`/whats-included`, `/reviews`, `/photo-credits`, and `/travel-guide`.

## Screenshot baseline

These are first-viewport captures, not full-page visual-regression images.

| Surface | Desktop | Mobile |
| --- | --- | --- |
| Home `/en` | [1440 × 1200](p0-t3-home-desktop.png) | [390 × 844](p0-t3-home-mobile.png) |
| Destination `/en/simien-mountains/imet-gogo` | [1440 × 1200](p0-t3-destination-desktop.png) | [390 × 844](p0-t3-destination-mobile.png) |
| Tour `/en/treks/4-day-simien-classic` | [1440 × 1200](p0-t3-tour-desktop.png) | [390 × 844](p0-t3-tour-mobile.png) |
| Plan `/en/plan` | [1440 × 1200](p0-t3-plan-desktop.png) | [390 × 844](p0-t3-plan-mobile.png) |
| Gallery `/en/gallery` | [1440 × 1200](p0-t3-gallery-desktop.png) | [390 × 844](p0-t3-gallery-mobile.png) |
| About `/en/about` | [1440 × 1200](p0-t3-about-desktop.png) | [390 × 844](p0-t3-about-mobile.png) |

All 12 files have the expected dimensions and contain rendered page content.

## Lighthouse baseline

Lighthouse ran against `/en` on the local production build. Scores are a
single lab snapshot, not production field data.

| Mode | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Speed index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 40 | 94 | 100 | 92 | 4.0 s | 6.5 s | 1,350 ms | 0 | 5.6 s |
| Desktop | 80 | 89 | 100 | 92 | 0.5 s | 1.3 s | 340 ms | 0.009 | 1.6 s |

The weighted failures recorded by Lighthouse were:

- Prohibited `aria-label` attributes on unroled review `<span>` elements.
- Desktop navigation trigger `<span>` elements using `aria-expanded` without
  a compatible role.
- Insufficient contrast on copper buttons and small copper text.
- Canonical validation against the local origin. The report explains that the
  canonical points to another hreflang location because the build used the
  production canonical default while the audit URL was `127.0.0.1`. Recheck
  this on staging with its real `NEXT_PUBLIC_SITE_URL` before treating it as a
  production SEO defect.

Reproduction commands:

```bash
npm exec --yes --package=lighthouse@12.8.2 -- lighthouse http://127.0.0.1:3100/en --quiet --chrome-path=/usr/bin/google-chrome --chrome-flags='--headless=new --no-sandbox --disable-dev-shm-usage' --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --output=json --output-path=/tmp/p0-t3-lighthouse-mobile.json
npm exec --yes --package=lighthouse@12.8.2 -- lighthouse http://127.0.0.1:3100/en --quiet --chrome-path=/usr/bin/google-chrome --chrome-flags='--headless=new --no-sandbox --disable-dev-shm-usage' --only-categories=performance,accessibility,best-practices,seo --preset=desktop --output=json --output-path=/tmp/p0-t3-lighthouse-desktop.json
```

## API-down behavior

Both `GET http://127.0.0.1:5000/health` and
`GET http://127.0.0.1:5000/api/v1/tours` failed to connect, confirming that
this pass did not accidentally use live CMS data.

| Surface | Observed behavior |
| --- | --- |
| Home | 200; bundled journey/review content rendered |
| Gallery | 200; bundled photographs rendered |
| Tour detail | 200; bundled itinerary rendered; this route is not yet CMS-connected |
| Plan | 200; `POST /api/inquiry` returned 200 with `delivery: "email"` |
| Newsletter | Page remains usable, but subscription cannot be stored while the API is down |
| Assistant | Widget remains present; live assistant response is unavailable |
| Admin login | 200; form renders, but authentication and CMS actions are unavailable |

This behavior is a resilience baseline, not evidence that API-backed features
work. API-up checks remain mandatory.

## Staging issue list

The following checks cannot be closed locally without a real database,
credentials, provider configuration, and staging origins:

| ID | Required staging evidence |
| --- | --- |
| P0-T3-STG-01 | Assign frontend/API origins and verify the complete environment-variable matrix, CORS, cookies, health, and readiness |
| P0-T3-STG-02 | Apply migrations, create a staging admin, and verify login, session persistence, logout, and unauthorized handling |
| P0-T3-STG-03 | Exercise tour/destination/media/testimonial/blog create, edit, publish, unpublish, ordering, and public API reads |
| P0-T3-STG-04 | Confirm published CMS changes reach public pages, metadata, sitemap, relationships, and fallbacks without resurrecting unpublished content |
| P0-T3-STG-05 | Enable the assistant with a real provider and verify streaming, catalogue grounding, limits, transcript handling, and human handoff |
| P0-T3-STG-06 | Verify contact storage, configured email/webhook delivery, newsletter storage, rate limits, validation, and failure states |
| P0-T3-STG-07 | Verify production-style media storage, remote image rendering, attribution, persistence across deploys, and broken-media handling |
| P0-T3-STG-08 | Repeat route probes, desktop/mobile screenshots, locale checks, and Lighthouse with the staging canonical origin |

These items should be copied into the staging tracker when a host is assigned;
their IDs should remain stable in QA evidence.
