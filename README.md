# Gondar Simien Tours

A production-ready Next.js website for a locally owned Gondar and Simien Mountains operator. The experience is built as a premium destination publication, trip-planning tool and direct local contact path.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed canonical domain.

## Inquiry delivery

The planner works without a third-party account: it validates the submission and opens a prepared email to `info@simienethiotours.com`. For silent server-side delivery, set `CONTACT_WEBHOOK_URL` to a secure endpoint that accepts JSON. When configured, successful submissions stay in-page.

Experience links preselect the inquiry subject. Accommodation inquiries also include preferred stay style, nights in Gondar and Simien, and budget in both delivery paths.

## Content integrity

- Brand, operator, founder and contact facts are centralized in `lib/site.ts`.
- No price, review count, wildlife guarantee or trail metric is invented.
- Travel facts link to UNESCO, official local tourism, or the operator source.
- Photo authors, licenses and original files are listed at `/photo-credits`.
- The research synthesis is in `research-notes.md`.
- The supplied draft mapping and editorial decisions are in `content-map.md`.

## Main routes

- `/` — narrative homepage
- `/simien-mountains` — destination guide
- `/treks` — five journey starting points
- `/treks/simien-day-trip` — day trip with a staged daily outline
- `/treks/3-day-simien-trek` — Sankaber, Geech and Imet Gogo
- `/treks/4-day-simien-classic` — classic camping route through Chenek
- `/treks/5-day-gondar-simien` — royal-city arrival plus three mountain camps
- `/treks/ras-dashen-challenge` — summit approach with explicit additional return planning
- `/treks/10-day-simien-ras-dashen` — ten-day expedition itinerary
- `/treks/gondar-heritage-simien` — five-day heritage and mountain itinerary
- `/gondar` — royal city and gateway
- `/beyond-the-trail` — experience directory and local services
- `/festival-journeys` — festival calendar and Timkat itinerary
- `/gondar-running-experience` — local running options
- `/simien-photography-tour` — photography trips and image journal
- `/where-to-stay-gondar-simien` — accommodation guidance
- `/about` — Tevan and Tevan Local
- `/travel-guide` — practical field notes
- `/plan` — inquiry planner

## Checks

```bash
npm run lint   # strict TypeScript check
npm run build  # production compilation and route generation
```
