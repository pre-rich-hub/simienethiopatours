# Client photo replacements — 14 September 2026

Thirty-six supplied photos cover all 32 destinations and all 28 tours. All 19 Simien, seven Gondar and six Northern Ethiopia destinations now have client photos. Matching homepage, Gondar, Simien and journey listing banners and Simien photo cards also use the client batch.

## Record mappings

| Type | Slug | Client file |
|---|---|---|
| destination | `simien-mountains-national-park` | `simien-mountains.jpg` |
| destination | `buyit-ras` | `buhit-ras.jpg` |
| destination | `sankaber` | `Sankaber.jpg` |
| destination | `geech` | `Guche-camp-simen.jpg` |
| destination | `jinbar-waterfall` | `Jinbar_Waterfall.jpg` |
| destination | `chenek` | `cheenk-camp.jpg` |
| destination | `gondar` | `irenelik-gondar-3388882.jpg` |
| destination | `fasil-ghebbi` | `fasil-ghebbi.jpg` |
| destination | `kuskuam` | `kuskuam-church.jpg` |
| destination | `kosoye-mountains` | `kosoye-mountain.jpg` |
| tour | `simien-day-trip` | `Sankaber.jpg` |
| tour | `simien-introduction` | `Sankaber.jpg` |
| tour | `3-day-simien-trek` | `imet-gogo.png` |
| tour | `4-day-simien-classic` | `imet-gogo.png` |
| tour | `5-day-gondar-simien` | `imet-gogo.png` |
| tour | `gondar-heritage-simien` | `woleka-beta-israel.png` |
| tour | `10-day-simien-ras-dashen` | `ras-dashen.png` |
| tour | `simien-photography-day` | `simien-mountains.jpg` |
| tour | `wildlife-landscape-photography` | `imet-gogo.png` |
| tour | `simien-photography-expedition` | `imet-gogo.png` |
| tour | `royal-gondar` | `fasilides_-bath-fasil_s-pool.jpg` |
| tour | `gondar-photography-walk` | `fasil-ghebbi.jpg` |
| tour | `gondar-history-culture` | `bebre-berhan-selassie.jpg` |
| tour | `gondar-kosoye` | `kosoye-mountain.jpg` |
| tour | `timkat-simien` | `fasil-ghebbi.jpg` |
| tour | `genna-simien` | `fasil-ghebbi.jpg` |
| tour | `meskel-simien` | `Guche-camp-simen.jpg` |
| tour | `mountains-sacred-stone` | `lalibela.jpg` |
| destination | `lake-tana` | `bahir-dar.jpg` |
| destination | `lalibela` | `lalibela.jpg` |
| destination | `yemrehanna-kristos` | `yemrehanna-kistos.png` |
| destination | `yeha` | `yeha.png` |
| destination | `axum` | `xum.png` |
| destination | `blue-nile-falls` | `blue-nile-falls.jpg` |
| destination | `fasilides-bath` | `fasilides_-bath-fasil_s-pool.jpg` |
| destination | `debre-berhan-selassie` | `bebre-berhan-selassie.jpg` |
| destination | `woleka` | `woleka-beta-israel.png` |
| tour | `gondar-through-local-eyes` | `irenelik-gondar-3388882.jpg` |
| destination | `adi-arkay` | `adi-arkay.png` |
| destination | `mulit` | `incya-river.png` |
| destination | `ras-dashen` | `ras-dashen.png` |
| destination | `meseha-valley` | `meseha-river.png` |
| destination | `highland-villages` | `highland-villages.png` |
| destination | `bwahit-pass` | `Bwahit.png` |
| destination | `debark` | `Debark.png` |
| destination | `sona` | `Sona.png` |
| destination | `ambiko` | `Ambiko.png` |
| destination | `siha-gorge` | `siha-gorge.png` |
| destination | `inatye` | `Inatye.png` |
| destination | `ambaras` | `Ambaras.png` |
| destination | `imet-gogo` | `imet-gogo.png` |
| tour | `ras-dashen-challenge` | `ras-dashen.png` |
| tour | `ras-dashen-expedition` | `ras-dashen.png` |
| tour | `simien-ras-dashen-8-day` | `Bwahit.png` |
| tour | `timkat-ras-dashen` | `ras-dashen.png` |
| tour | `simien-wildlife-journey` | `siha-gorge.png` |
| tour | `gondar-running` | `Gondar-Hidden-Running-Experience.png` |
| tour | `gelada-country` | `Gelada-Country.png` |
| tour | `gondar-market-local-life` | `Gondar-Market-Local-Life.png` |
| tour | `gondar-food-coffee` | `Gondar-Food-Coffee-Experience.png` |

## Matching decisions

- The client confirmed `xum.png` means Axum and the Bahir Dar photo belongs to Lake Tana / Bahir Dar. `yemrehanna-kistos.png` maps to `yemrehanna-kristos`.
- Mountains & Sacred Stone visits Lalibela and optionally Yemrehanna Kristos; it now uses Lalibela as its main image. Other journeys that do not visit these destinations retain their images.
- `Sankaber.jpg` is the wide landscape used for mountain banners. `simien-mountains.jpg` shows a waterfall. Alt text describes the actual photos in all four locales.
- Only Bale Mountains remains unused: no matching destination or tour exists. Its supplied watermarked URL is https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386863/bale-mountains-national-park.jpg
- No new content entries were created. Other photos await later client batches.

## Backend teammate handoff

The database is managed by the backend teammate. No database changes were applied in this workspace. Initial inventory, the image manifest and the saved catalogue are updated. The saved catalogue is an image-only revision of the existing CMS export: publication decisions and non-image fields remain unchanged, and its SHA-256 hash is recalculated.

From `backend`, connected to the intended database:

```sh
node scripts/apply-client-photos.mjs
node scripts/apply-client-photos.mjs --apply
npm run content:export
```

The first command previews changes. The second updates the listed records’ image URLs, alt text, translated image fields and hero media associations in one transaction. Missing records are skipped. It aborts if an image differs from its expected original, an explicitly accepted earlier batch URL, and its replacement. Mountains & Sacred Stone accepts the previous watermarked Fasil Ghebbi URL so this batch can follow the prior one. PNG assets receive the correct media type.

The update does not create content, change publication, delete image files or change upload storage. Do not run the full seed merely to replace photos. The export refreshes the frontend fallback from the actual database; include it in deployment.

## Image delivery and verification

Stored URLs remain the exact supplied URLs. The shared `components/Image.tsx` uses a Cloudinary loader for this client's unsigned, versioned photos. Next.js generates responsive `srcset` sizes up to 2048 pixels, and the browser downloads each selected size directly from Cloudinary with automatic format and quality. The loader accepts both original URLs and the older capped display URLs. Local images, backend uploads, signed URLs and custom transformations retain Next.js image delivery; local optimization uses WebP to reduce first-load encoding work. See [Cloudinary transformation reference](https://cloudinary.com/documentation/transformation_reference). The configured client account is allowed by the Next.js image configuration and CSP.

The original two-stage delivery was insufficient on localhost: an Imet Gogo image request returned HTTP 500 after 7.3 seconds, while downloading its 942 KB source took 12.3 seconds. The direct 1080-pixel replacement returned HTTP 200 in 4.3 seconds at 189 KB in a subsequent check. These are individual network measurements, not a guaranteed load time. The new delivery path avoids the localhost remote-image fetch timeout entirely for client photos.

Verification for the direct-delivery fix: ten targeted tests (including rendered responsive markup and all client photo URLs), TypeScript and production build passed. Headless Chrome confirmed client photos loaded directly from Cloudinary on the homepage at 390 and 1440 pixels, the Imet Gogo destination at 390 pixels and the 4-Day Simien Classic journey at 1440 pixels, with no uncaught browser errors or horizontal overflow. Targeted ESLint reported no errors and five existing warnings in the Northern Ethiopia page and navigation menu.

- Initial integration: production build, typecheck, targeted ESLint and rendered page checks passed. Next.js optimized delivery returned HTTP 200 for Fasil Ghebbi and resized Sankaber.
- Later batches: supplied URLs were reachable; all five Northern Ethiopia photos were visually inspected.
- Catalogue mapping checks cover all 60 changed entries across four locales (240 records), with snapshot hash verification and no duplicate database targets.
- Six media URL and catalogue relationship tests, public editorial audit, database script syntax validation and whitespace checks are used for this revision.
- Database application is for the backend teammate; these checks do not claim deployment or database execution.

## Gondar batch

The latest four photos are mapped as follows:

- Gondar → `irenelik-gondar-3388882.jpg`
- Debre Berhan Selassie → `bebre-berhan-selassie.jpg`
- Woleka → `woleka-beta-israel.png`
- Fasilides’ Bath → `fasilides_-bath-fasil_s-pool.jpg`

The related journey images were updated while preserving the existing slugs: Gondar through Local Eyes uses the Gondar photo, Gondar Heritage & Simien uses Woleka, Royal Gondar uses Fasilides’ Bath, and Gondar History & Culture uses Debre Berhan Selassie. The destination name remains exactly `Debre Berhan Selassie`; the supplied filename typo is not used as a route or content slug.

## Final Simien batch

All 13 supplied images were fetched and visually inspected. Incya River is used for Mulit because its existing description and the 10-day itinerary explicitly include the Incya River corridor. Meseha River maps to Meseha Valley, and Bwahit maps to Bwahit Pass. No new destination slugs were created.

This batch updates 13 destinations, 11 related journeys and matching Simien photo cards. The Siha Gorge photo depicts an ibex; its alt text describes that subject and the wildlife journey also uses it. The Ras Dashen photo shows route scenery, so its alt text does not label it as the summit.

Duplicate entries from the earlier Gondar handoff were consolidated into one final update per record, retaining the original and earlier batch URLs as accepted previous values. The handoff now contains 56 unique records, avoiding conflicting updates when rerun. Backend database application remains the teammate’s responsibility.

## Remaining four journeys

The final four supplied photos replace Gelada Country, Gondar Food & Coffee, Gondar Market & Local Life, and Gondar Hidden Running Experience. All four photos were fetched and visually inspected. The running photo depicts historic buildings and ruins, so its alt text describes those rather than runners. Existing Cloudinary resizing and Next.js image optimization apply to these URLs as well.

All 28 journey images now use Cloudinary in the inventory and four-language catalogue. The backend handoff contains 60 unique records (32 destinations and 28 tours); it is prepared for the teammate and has not been applied to their database.
