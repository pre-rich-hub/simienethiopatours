# Performance budget

Agreed Core Web Vitals-style targets for **Gondar Simien Tours** before go-live. Measure **home** (`/en`) and a trek detail (`/en/treks/4-day-simien-classic`) first. Do not invent Lighthouse scores — record what you ran.

Staging / production hosts come from ops. Use the origins in [`environments.md`](environments.md).

## Targets

| Metric | Target | How to read it |
| --- | --- | --- |
| LCP, home, mid-range phone on Slow 4G | ≤ 2.5 s | Chrome “Good” CWV |
| LCP, home, desktop broadband | ≤ 2.0 s | Local / staging rehearsal |
| LCP image (optimizer, ≤ 2048w) | ≤ 200 KB | Home hero and trek hero |
| Source photos in `public/images` | Long edge ≤ 2560; file ≤ 1.5 MB | Same filenames; do not invent new shots |
| CLS | ≤ 0.1 | Reserved image frames, no late font swap jumps |
| INP | ≤ 200 ms | Header menus, planner, chat sheet |

Fix regressions against these numbers before cutover. A field-data CrUX “Good” on production is the long-term check; lab numbers above are the gate.

## What we ship for this budget

- Next Image: AVIF / WebP, quality 75, `deviceSizes` capped at **2048** (no 3840w srcset). Heroes use `priority` + `fetchPriority="high"`.
- Oversized JPEGs recompressed in place (Imet Gogo, Fasil Ghebbi, Simien panorama, Chenek camp). Logos untouched.
- Fonts: Cormorant Garamond 400 / 500 / 400-italic and Manrope 400 / 500 / 600 / 700, **latin + latin-ext** only (covers en / es / de / fr). Unused Cormorant 600 dropped.

## Local rehearsal — 2026-09-12

Lab: `http://127.0.0.1:3000`, Next image optimizer, `Accept: image/avif`.

| Asset | Before | After |
| --- | --- | --- |
| `/images/imet-gogo.jpg` (home + OG source) | 5.83 MB · 3456×2592 | 0.80 MB · 2560×1920 |
| `/images/fasil-ghebbi.jpg` | 1.71 MB · 3840×2160 | 0.61 MB · 2560×1440 |
| `/images/simien-panorama.jpg` | 0.71 MB · 3525×1080 | 0.36 MB · 2560×784 |
| `/images/chenek-camp.jpg` | 1.24 MB · 1920×1321 | 1.04 MB · 1920×1321 |
| Hero optimizer `w=1920&q=75` | 160 KB AVIF | 160 KB AVIF (same derivative; source decode is now 0.80 MB) |
| Hero optimizer `w=2048&q=75` | 179 KB AVIF | 179 KB AVIF — new max srcset width |
| Hero optimizer `w=3840&q=75` | 404 KB AVIF (what `sizes="100vw"` requested) | **400** — width not in `deviceSizes` |

The raw 5.8 MB Imet Gogo file was also over typical hosted image-optimizer source limits. Social crawlers that hit the OG URL now get the smaller JPEG.

## How to re-measure

1. Home and trek detail in Chrome: Performance panel or Lighthouse (mobile, Slow 4G). Record LCP element and LCP time.
2. Confirm the LCP URL is `/_next/image?…&w=2048` or smaller, not a raw `/images/*.jpg`.
3. Staging: same two URLs on the staging origin. Production: same after cutover.
4. If a new CMS photo is the LCP, resize the source to the budget before publish.

Video stays parked — do not add autoplay hero video against this budget.

## Staging / production

| Check | Staging | Production |
| --- | --- | --- |
| Date | | |
| Home LCP (note device / throttling) | | |
| Trek LCP | | |
| LCP image bytes | | |
| Notes | | |
