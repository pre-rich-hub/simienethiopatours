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

## Content integrity

- Brand, operator, founder and contact facts are centralized in `lib/site.ts`.
- No price, review count, wildlife guarantee or trail metric is invented.
- Travel facts link to UNESCO, official local tourism, or the operator source.
- Photo authors, licenses and original files are listed at `/photo-credits`.
- The research synthesis is in `research-notes.md`.

## Main routes

- `/` — narrative homepage
- `/simien-mountains` — destination guide
- `/treks` — five journey starting points
- `/gondar` — royal city and gateway
- `/about` — Tevan and Tevan Local
- `/travel-guide` — practical field notes
- `/plan` — inquiry planner

## Checks

```bash
npm run lint   # strict TypeScript check
npm run build  # production compilation and route generation
```
