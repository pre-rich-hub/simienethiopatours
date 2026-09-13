# QA checklist

Launch rehearsal for **Gondar Simien Tours**. Run the same list on **local**, then **staging**, then **production**. Do not invent prices, review counts, wildlife guarantees, or unverified trail metrics while checking copy.

Public routes use `/{locale}/…` (`localePrefix: "always"`). `/` must land on `/en`. Admin stays English at `/admin` with no locale prefix.

Phase 0 route, screenshot, Lighthouse, API-down, and staging-blocker evidence is
recorded in [`p0-t3-baseline.md`](p0-t3-baseline.md).

## Lighthouse / performance baseline (recorded)

Lab Lighthouse on local production build (`http://127.0.0.1:3100/en`, 2026-09-12) is recorded in [`p0-t3-baseline.md`](p0-t3-baseline.md) (mobile Performance 40 / a11y 94; desktop Performance 80 / a11y 89). Agreed CWV and image budgets live in [`performance.md`](performance.md). Optimization is continuous against those budgets; field CrUX after cutover remains the long-term gate.

Staging and production hosts come from ops — use the origins in [`environments.md`](environments.md). Do not invent them.

## Viewports

| Pass | Width | What to exercise |
| --- | --- | --- |
| Desktop | ≥ 1101px | Mega menus, header language switcher, full planner grid |
| Mobile | ≤ 720px | Hamburger menu, stacked planner, chat sheet, safe areas |

## Verified public contact links (P1-T4)

Checked against `lib/site.ts` (2026-09-13):

| Link | Status |
| --- | --- |
| Phone `tel:+251956616969` | Verified constant |
| Email `mailto:info@simienethiotours.com` | Verified constant |
| WhatsApp `https://wa.me/251956616969` | Verified constant |
| TripAdvisor | Verified Attraction_Review URL |
| Operator site `https://simienethiotours.com/` | Verified constant |
| Social Instagram | Verified `https://www.instagram.com/tesemaethiopiatour/` |
| Social Facebook | Verified `https://www.facebook.com/tesema.travels.Ethiopia/` |
| Social X / TikTok / YouTube | Empty — footer hides unverified networks |

## Launch decisions (locked)

| Decision | Choice |
| --- | --- |
| Booking model | Inquiry-only via `/plan` (no public booking create; unused BookingCard removed) |
| `/contact` | Permanent redirect to `/plan`; ContactPage JSON-LD emitted on `/plan` |
| Newsletter | Enabled in footer with consent + privacy path; unsubscribe via privacy email deletion |
| AI assistant | `ASSISTANT_ENABLED=false` by default; enable with one env flip after eval passes |
| Video | Explicitly deferred — no production video asset |
| CSP | Draft headers in `next.config.ts` (API origin allowlisted); tighten before production |

## Quality gates (local)

```bash
npm run typecheck && npm run lint && npm test && npm run qa:content && npm run content:locale-audit
```

Backend: `cd ../backend && npm test` (assistant context, eval-set structure, conversation).

## Public — home

Canonical path: `/en` (also `/es`, `/de`, `/fr`).

- [ ] Hero, trust rail, and journey cards render. No invented prices or review counts.
- [ ] Skip link is first in tab order and moves focus into `#main-content`.
- [ ] Desktop: Simien / Journeys / Gondar chevrons open the mega menu; Escape returns focus to the chevron.
- [ ] Mobile: hamburger opens the dialog; Escape / close returns focus to the button.
- [ ] Card and CTA links reach real journeys or `/plan` (not a 404).
- [ ] Footer newsletter has an accessible email field. API down is allowed; the form must not crash the page.

## Public — trek detail

Canonical path: `/en/treks/4-day-simien-classic` (also `3-day-simien-trek`, `ras-dashen-challenge`).

- [ ] Title, itinerary, included / excluded, and a plan CTA render.
- [ ] Day rows open and close from keyboard (Enter / Space on the summary).
- [ ] If the CMS API is down, bundled copy still renders. Do not treat a missing live price as a failure.
- [ ] “Plan” / inquiry handoff lands on `/[locale]/plan` with the page still usable.

## Public — plan submit

Canonical path: `/en/plan`.

- [ ] Required name + email; labels stay associated with their fields.
- [ ] Submit does not 500 when the API is down.
- [ ] Delivery order (see [`app/api/inquiry/route.ts`](../app/api/inquiry/route.ts)): contacts API → `CONTACT_WEBHOOK_URL` → mailto fallback.
- [ ] Contacts or webhook success shows the in-form confirmation.
- [ ] Mailto fallback opens a draft to the operator address and shows the email-opened status.
- [ ] WhatsApp / phone / email in the sidebar match [`lib/site.ts`](../lib/site.ts).

## Locale switch (P4)

- [ ] `/` → `/en` (single hop; no redirect loop).
- [ ] Header (desktop) or mobile menu language control lists English, Español, Deutsch, Français.
- [ ] Switching language keeps the same path and query (`/en/plan` → `/es/plan`).
- [ ] Nav, CTAs, planner labels, and footer chrome change language. Admin does not.
- [ ] `html[lang]` matches the URL locale.
- [ ] hreflang / canonical still point at the current origin (`NEXT_PUBLIC_SITE_URL`).

## Assistant (P5)

FAB on public pages only (not `/admin`).

- [ ] Toggle opens the sheet; `aria-expanded` updates; Escape closes and returns focus to the toggle.
- [ ] **API down or `ASSISTANT_ENABLED` off:** grounded unavailable / disabled copy, input disabled, WhatsApp + email + `/plan` still offered. No invented itinerary or price.
- [ ] **API on:** greeting and suggestion chips; a short question streams or returns a reply; Start over clears the thread.
- [ ] Mobile: sheet stays on-screen with the software keyboard; it does not cover the close control.
- [ ] Staging rehearsal (when a host exists): repeat the “API on” path against that origin. Video is not part of this check.

## Admin — login + tour publish

Admin is English-only. Cookie model: [`environments.md`](environments.md#cookie-auth-designed-model).

- [ ] `/admin/login`: Email and Password are labelled; skip link targets `#admin-main`.
- [ ] API unreachable: “Could not connect to the server”, not a blank page.
- [ ] Wrong password (API up): inline error; stay on login.
- [ ] Valid login sets `admin_session` and lands on `/admin`.
- [ ] Tours: `/admin/tours` lists rows. Open a tour (or **New tour**).
- [ ] **Published** toggle + save. Hint copy: published tours appear on the public site only when the API is healthy; drafts stay in admin.
- [ ] After publish, the public trek / listing path does not 404. Unpublish returns the row to Draft.
- [ ] Logout clears the session; `/admin` redirects back to login.

Do not publish invented prices onto a live production tour.

## Sign-off

| Environment | Date | Result | Blockers |
| --- | --- | --- | --- |
| Local | 2026-09-12 | Partial pass — API-down fallbacks OK; API-up pairing blocked — see [Local rehearsal](#local-rehearsal-2026-09-12) and [API-up pairing](#api-up-pairing-2026-09-12) | No `backend/.env`, no `DATABASE_URL`, nothing on `:5000` or `:5432` |
| Local staging | 2026-09-13 | Pass for migrate/seed/admin/export + locales — see [Local staging](#local-staging-2026-09-13) | No assigned remote staging host; admin publish cycle and live inquiry receipt still open |
| Staging | | | Host not assigned |
| Production | | | Not this pass |

Staging sign-off is the P6 acceptance gate. Production still needs a separate pass after cutover — runbook: [`cutover.md`](cutover.md).

## Local staging (2026-09-13)

Local API-up rehearsal via `./scripts/staging-local-prep.sh` (Postgres container + migrate/seed/admin). Evidence also recorded in [`p4-cms-cutover.md`](p4-cms-cutover.md).

| Check | Result |
| --- | --- |
| Migrations | Applied through `20260913090000_public_catalogue_journal` |
| Seed | Approved catalogue loaded |
| Admin bootstrap | Non-default admin created |
| Catalogue locales | EN + published ES/DE/FR in public catalogue |
| `npm run content:export` | `frontend/lib/generated/catalogue.json` with `"provenance": "cms-export"` |
| Photo credits | All `lib/photo-credits.ts` entries verified; Commons files present |
| Structured data | ContactPage JSON-LD on `/plan`; FAQ/Organization builders omit AggregateRating/prices (`seo.test.ts`) |
| Assistant | Default-off; privacy discloses transcript/IP-hash; deletion via operator email |
| Gates | `content:audit`, `content:drift`, `content:localization --strict`, `qa:content`, frontend/backend unit tests green locally |

**Still open for remote staging / production:** assigned host DNS/certs, crawl of every sitemap URL, authenticated admin publish/unpublish on staging, live inquiry/newsletter receipt, GSC/Bing submit, production CDN/object storage, 48h post-launch watch.

## Local rehearsal (2026-09-12)

Ran against `http://127.0.0.1:3000`. Express API on `:5000` was not up. Mobile pass used a 390×844 viewport.

| Check | Desktop | Mobile | Notes |
| --- | --- | --- | --- |
| Home `/en` | Pass | Pass | Skip link, hero, trust rail, journey cards. Hamburger replaces mega menu at 390px. Wildlife copy does not guarantee sightings. |
| Trek `/en/treks/4-day-simien-classic` | Pass | Pass | Bundled itinerary, included/excluded, plan CTA. Day rows are real `<details>` (Day 02 opened). |
| Plan submit | Pass (API) | Chrome pass | `POST /api/inquiry` returns `{ "delivery": "email" }` when the contacts API is down. Labels work on `/fr/plan`. |
| Locale switch | Pass | — | `/` → `/en` (one 307). `/es/…`, `/de`, `/fr/plan` translate chrome + `html[lang]`. Trek body and review quotes stay English (bundled/CMS). Experience `<option>` values stay English. |
| Assistant FAB | Present | Present | Toggle is on public pages. Live reply not exercised (API down). Staging “API on” path still open. |
| Admin login `/admin/login` | Pass (form) | — | Labels + skip link. Login blocked by API. |
| Tour publish | Blocked | Blocked | Needs API + credentials |

**Fixed during this pass:** admin login and the inquiry form now use `method="post"`. Without it, a no-JS or failed-handler submit put email/password in the query string.

**Still blocked for staging sign-off:** live assistant, admin session, tour publish, and the same list on a real staging origin.

## API-up pairing (2026-09-12)

Attempted to start Express (`pnpm dev` in `../backend`) and hit it from the Next app on `:3000`. **Did not boot.** Do not invent a database URL.

| Need | Found |
| --- | --- |
| `backend/.env` with `DATABASE_URL` + `JWT_SECRET` | File missing (only [`.env.example`](../../backend/.env.example)) |
| Postgres | Nothing listening on `:5432`; no Docker Compose in the repo |
| `FRONTEND_ORIGIN` / `NEXT_PUBLIC_API_URL` | Documented pair is `http://localhost:3000` ↔ `http://localhost:5000`. No live `.env.local` either — frontend uses those code defaults |

### Probes (API down)

| Check | Result |
| --- | --- |
| `GET http://127.0.0.1:5000/health` | Connection refused |
| `GET /api/v1/tours`, `/testimonials`, `/gallery` | Connection refused |
| Login cookie / `GET /api/v1/auth/me` / admin tours | Not run — no process |
| `POST /api/v1/contacts`, `/subscribers`, `/assistant` | Not run — no process |
| Frontend `GET /health` | 200 `{ "ok": true, "service": "frontend" }` |
| Frontend `POST /api/inquiry` | 200 `{ "delivery": "email" }` (mailto fallback, expected) |

### Browser with API down (still works)

| Surface | Result |
| --- | --- |
| Home `/en` | 200; reviews + journey cards from bundled data |
| Gallery `/en/gallery` | 200; 8 bundled photographs |
| Trek `/en/treks/4-day-simien-classic` | 200; bundled itinerary (CMS not wired on this page even when API is up) |
| Plan `/en/plan` | Form renders; inquiry would be email delivery |
| Newsletter | Browser `fetch` to `:5000/api/v1/subscribers` → `Failed to fetch` (no mailto fallback) |
| Assistant FAB | Present on public pages; live reply not possible |
| Admin `/admin/login` | Form + labels. Session not possible |

### Code contract (not live-verified)

These match on paper. Confirm after someone adds `backend/.env` and starts Postgres:

- Login `{ email, password }` + `admin_session` + `credentials: "include"`
- Inquiry Next route → `{ name, email, message }`
- Newsletter `{ email }`
- Admin client reads `{ status, data }`
- Assistant `{ message, sessionId }`; 503 if `ASSISTANT_ENABLED=false`

### Gaps (not crashes)

- Only home testimonials and gallery call `cms.ts`. Treks / Gondar / journey cards stay bundled when the API is up.
- No public booking create API.
- Assistant defaults to off.
- Rate-limit skip checks `req.path === "/ready"` but readiness is `GET /health/ready`.

**To finish this pairing:** copy `backend/.env.example` → `.env`, set a real `DATABASE_URL` / `JWT_SECRET`, `pnpm install && pnpm prisma:deploy && pnpm db:admin && pnpm dev`, then rerun the API-up rows above.

## Local staging evidence (2026-09-13)

| Check | Result |
| --- | --- |
| Postgres | podman `gst-postgres` on `:5432` |
| Migrations | `prisma migrate deploy` — all applied through `20260913090000_public_catalogue_journal` |
| Seed | 28 tours published, 32 destinations, gallery, blog drafts |
| Admin | `npm run db:admin` created local admin |
| Catalogue API | `GET /api/v1/catalogue` → 112 tours / 128 destinations (EN+ES+DE+FR) |
| Health | `GET /health` → 200 |
| Translations | `content:translations` + `content:localization --strict` → 0 missing |
| Export | `content:export` provenance `cms-export` |
| Audits | `content:audit`, `content:drift`, frontend `qa:content`, locale-audit green |
| Tests | backend 40, frontend 7 vitest |
| Photo credits | 10/10 verified (Commons + operator) |
| Socials | Instagram + Facebook from operator site |
| Assistant | Default `ASSISTANT_ENABLED=false`; context from public catalogue |
| Booking | Inquiry-only; `/contact` → `/plan` with ContactPage JSON-LD |

Production DNS, TLS, GSC/Bing, and 48-hour observation are deploy-time steps in [`cutover.md`](cutover.md).
