# Cutover

How to put **Gondar Simien Tours** on the live domain and prove it. Env values: [`environments.md`](environments.md). Full path list: [`qa.md`](qa.md). Performance gates: [`performance.md`](performance.md). Logs and uptime: [`monitoring.md`](monitoring.md).

Do not invent staging or API hostnames. Ops fills those in. Canonical production origin is **`https://www.gondersimientours.com`** (no trailing slash; match the live visitor origin).

This file is the runbook. It is not a completed production deploy. DNS has **not** been flipped; items below marked “runbook ready” are executable at cutover time only.

## Order

1. Backend owner: production API up, migrations applied, `FRONTEND_ORIGIN` includes the site origin, `COOKIE_SECURE=true`, email / assistant flags set, and daily `pnpm data:purge` scheduled.
2. Deploy the frontend to **staging** (or a Vercel Preview that uses the staging env). Run [`qa.md`](qa.md). Staging sign-off is the P6 gate.
3. Deploy the frontend to **production** with the production env. Do not flip DNS until that build is green.
4. Point DNS at the production host.
5. Run [Post-deploy](#post-deploy) on `https://www.gondersimientours.com`.
6. Keep the previous production deployment available for [Rollback](#rollback).

Public routes are `/{locale}/…`. `/` must 307 once to `/en`. Admin stays at `/admin` with no locale prefix.

## Hosting

Default: **Vercel**, Next.js, Root Directory **`frontend`** (this folder). Connect the Git repo; do not deploy the monorepo root. Install is `npm ci` / `npm install` from `package-lock.json`. Build `npm run build`, output is Next’s default (no `output: "standalone"`).

Another Node host is fine if ops prefers it: Node 20+, same Root Directory, `npm run build` then `npm start`. Set `PORT` as that host requires.

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Production env | Copy-paste block in [`environments.md`](environments.md) |
| Preview / staging env | Staging `NEXT_PUBLIC_SITE_URL` + staging API — never leave `NEXT_PUBLIC_SITE_URL` unset (code default is the live domain) |
| Framework | Next.js 16 (auto-detected on Vercel) |

`NEXT_PUBLIC_*` are baked in at **build**. Change them, then rebuild / redeploy.

API and site must be **same-site** for admin cookies (`SameSite=Lax`). `https://www.gondersimientours.com` → `https://api.gondersimientours.com` is the designed shape. A `*.vercel.app` frontend talking to an unrelated API host will not send the session cookie. Details: [`environments.md`](environments.md#cookie-auth-designed-model).

## Local staging proof (2026-09-13)

Proven on this machine before any DNS flip. Postgres: podman/docker container **`gst-postgres`** on `:5432`. Backend on `:5000` (112 catalogue tour rows = 28 × EN/ES/DE/FR). Frontend on `:3000` when exercising UI.

```bash
# From repo root
./scripts/staging-local-prep.sh
# (starts/uses gst-postgres, points backend/.env at local DATABASE_URL,
#  prisma migrate deploy, db:seed, db:admin)

cd backend && npm run dev          # :5000
cd frontend && npm run dev         # :3000

# Catalogue + health
curl -s http://127.0.0.1:5000/health
curl -s http://127.0.0.1:5000/health/ready
curl -s http://127.0.0.1:5000/api/v1/catalogue | head -c 200

# Inquiry + newsletter API smoke (labeled QA — not a booking)
curl -s -X POST http://127.0.0.1:5000/api/v1/contacts \
  -H 'content-type: application/json' \
  -d '{"name":"QA Local","email":"qa@example.com","message":"Local staging smoke — discard."}'
curl -s -X POST http://127.0.0.1:5000/api/v1/subscribers \
  -H 'content-type: application/json' \
  -d '{"email":"qa-newsletter@example.com"}'

# Frontend quality gates
cd frontend
npm run typecheck
npm run qa:content
npm run qa:metadata
npm run qa:secrets
npm run content:locale-audit
npm run qa:p4 -- --screenshots   # fixture CMS cutover + browser menus

# Backend quality gates
cd backend
npm test
npm run content:localization -- --strict
```

Evidence is also recorded in [`qa.md`](qa.md#local-staging-evidence-2026-09-13) and [`p4-cms-cutover.md`](p4-cms-cutover.md). This does **not** replace the production post-deploy checks below.

## Production env (set before build)

Use exact production origins (no trailing slash). Build after setting `NEXT_PUBLIC_*`.

| Variable | Production value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.gondersimientours.com` |
| `NEXT_PUBLIC_API_URL` | `https://api.gondersimientours.com` (or the ops-assigned same-site API origin) |
| `API_URL` | Same as `NEXT_PUBLIC_API_URL` (server-side CMS/inquiry) |
| Backend `FRONTEND_ORIGIN` | `https://www.gondersimientours.com` |
| Backend `COOKIE_SECURE` | `true` |
| Backend `DATABASE_URL` | Production Postgres (ops) |
| Backend `JWT_SECRET` | Long random secret (ops; never `NEXT_PUBLIC_`) |
| `ASSISTANT_ENABLED` | `false` until grounded eval signed off |
| `CONTACT_WEBHOOK_URL` / `ERROR_WEBHOOK_URL` | Empty or real HTTPS; never `NEXT_PUBLIC_` |

Full matrix: [`environments.md`](environments.md).

## DNS

Attach the domain in the host dashboard, then at the registrar:

| Name | Type | Target |
| --- | --- | --- |
| `@` (apex) | as the host instructs (A / ALIAS / ANAME / CNAME flattening) | Production frontend |
| `www` | CNAME | Apex, or the host’s `www` target |

Redirect apex **`https://gondersimientours.com` → `https://www.gondersimientours.com`** (301 or 308). Do not leave both as indexable duplicates.

API DNS is the backend owner’s. It should be a subdomain of `gondersimientours.com` so cookies work.

Wait until the certificate is valid and `https://www.gondersimientours.com/en` returns 200 before calling DNS done.

## Production flip commands

Execute **after** the approved production build is deployed and DNS points at it. Substitute nothing invented — these use the canonical origin.

```bash
ORIGIN=https://www.gondersimientours.com
API=https://api.gondersimientours.com   # must match NEXT_PUBLIC_API_URL / same-site model

# 1. Certificate + locale redirect
curl -sI "$ORIGIN/" | head
# Expect: 307/308 Location: …/en  (single hop)
curl -sI "$ORIGIN/en" | head
# Expect: HTTP/2 200 and a valid certificate (no browser warning)

# 2. www → apex
curl -sI "https://gondersimientours.com/" | head
# Expect: 301/308 to https://www.gondersimientours.com/…

# 3. Sitemap and robots
curl -sI "$ORIGIN/sitemap.xml" | head
curl -s "$ORIGIN/robots.txt"
# Expect: 200; Disallow: /admin/ and /api/; Sitemap: $ORIGIN/sitemap.xml

# 4. Canonical / hreflang / structured data spot-check
curl -sL "$ORIGIN/en" | tr '"' '\n' | grep -E 'canonical|og:url|og:image|gondersimientours|TouristTrip|TravelAgency' | head

# 5. Health
curl -s "$ORIGIN/health"
curl -s "$API/health"
curl -s "$API/health/ready"

# 6. One labeled production inquiry (operator must expect + close it)
curl -s -X POST "$ORIGIN/api/inquiry" \
  -H 'content-type: application/json' \
  -d '{"name":"QA Cutover","email":"qa@example.com","message":"Production cutover test — discard.","experience":"simien-trek","company":""}'
# Expect delivery: "contact" or "webhook" (not only "email")

# 7. Newsletter if enabled
curl -s -X POST "$API/api/v1/subscribers" \
  -H 'content-type: application/json' \
  -d '{"email":"qa-cutover-newsletter@example.com"}'
```

**Index notice:** Google retired `google.com/ping?sitemap=`. After the live sitemap is correct:

1. Google Search Console → add `https://www.gondersimientours.com` → Sitemaps → submit `https://www.gondersimientours.com/sitemap.xml`
2. Bing Webmaster Tools → submit the same URL

Do not ping a staging sitemap as if it were production.

## Post-deploy

Run these on the **live origin** after DNS. Substitute the staging origin for a staging rehearsal.

### 1. Sitemap and robots

See [Production flip commands](#production-flip-commands) steps 3–4.

### 2. Metadata spot-check

Open `/en`, `/en/treks/4-day-simien-classic`, `/en/plan`. Confirm:

- `<link rel="canonical">` and `og:url` use `https://www.gondersimientours.com/…`
- `og:image` is on that origin (default Imet Gogo)
- `html[lang]` matches the path (`en` / `es` / `de` / `fr`)
- JSON-LD Organization / trip data does not invent prices or review counts

### 3. Admin login

`/admin/login` with a real operator account (not in this repo).

- Valid login sets `admin_session` and lands on `/admin`
- Tours list loads when the API is healthy
- Logout clears the session

If this fails, check same-site API host, `FRONTEND_ORIGIN`, and `COOKIE_SECURE` before changing frontend code.

### 4. One inquiry

Use the live `/en/plan` form **or** the curl in [Production flip commands](#production-flip-commands). The operator should expect this message and close it in admin (or email) so it is not treated as a real booking.

Delivery order ([`app/api/inquiry/route.ts`](../app/api/inquiry/route.ts)): contacts API → `CONTACT_WEBHOOK_URL` → mailto fallback. A `200` with `{ "delivery": "contact" }` or `"webhook"` is success. `"email"` means the APIs were down — the form still works, but fix the API before calling cutover done.

Also hit `/en`, `/en/treks`, `/es`, `/de`, `/fr` once. Then run the performance rows in [`performance.md`](performance.md).

## Post-launch observation (48h)

Start the clock after DNS is live and post-deploy checks pass.

```bash
# Repeat periodically for 48h (or wire hosting uptime to these URLs)
ORIGIN=https://www.gondersimientours.com
API=https://api.gondersimientours.com
curl -sI "$ORIGIN/en" | head -1
curl -s "$ORIGIN/health"
curl -s "$API/health"
# Review hosting logs only (see monitoring.md) — no inquiry bodies in log payloads
```

Checklist for the on-call owner:

1. Watch frontend/backend errors and uptime for at least 48 hours.
2. Confirm with the operator that a real inquiry arrived (and close the QA cutover inquiry).
3. Spot-check Search Console / Bing for accidental `/admin`, untranslated, or duplicate URLs.
4. Review Core Web Vitals when field data appears.
5. File launch findings as follow-up issues; record the rollback deployment ID used if anything was reverted.

## Rollback

Keep the last good production deployment until the new one is signed off.

| Host | How |
| --- | --- |
| Vercel | Deployments → previous **Production** → Promote / Instant Rollback. Does not revert DNS. |
| Other Node host | Redeploy the previous git SHA with the same production env. |
| DNS | Only revert registrar records if the new host was the problem. TTL may delay the old apex. |
| Env mistake | Fix `NEXT_PUBLIC_*`, **rebuild**, redeploy. Restarting the old build will not pick up new public env. |

After rollback, re-check `/en`, `/admin/login`, and one inquiry. Do not point `NEXT_PUBLIC_SITE_URL` at a preview URL to “undo” a bad production build.

## Sign-off

| Step | Staging | Production |
| --- | --- | --- |
| Date / deploy id | | |
| Host + Root Directory `frontend` | | |
| `NEXT_PUBLIC_SITE_URL` matches the visitor origin | | |
| DNS + cert (apex + www redirect) | n/a if preview URL | |
| Sitemap + robots on that origin | | |
| Search Console / Bing sitemap submitted | | |
| Metadata spot-check | | |
| Admin login | | |
| One inquiry (note delivery: contact / webhook / email) | | |
| Daily backend `pnpm data:purge` schedule and latest successful run | | |
| Rollback target recorded (previous deploy id) | | |
| 48h observation complete | | |

## Local rehearsal — 2026-09-12

Commands run against `http://127.0.0.1:3000`. This does **not** replace a production pass. Express API on `:5000` was down at that time.

| Check | Result |
| --- | --- |
| `GET /sitemap.xml` | 200; 272 unique locale URLs; no `/admin`, `/privacy`, `/terms` |
| `GET /robots.txt` | 200; disallows `/admin/` and `/api/`; `Sitemap: https://www.gondersimientours.com/sitemap.xml` |
| `GET /en` metadata | 200; `html[lang]=en`. This local process minted production canonicals / `og:url` / `og:image` (`https://www.gondersimientours.com/…`) — set `NEXT_PUBLIC_SITE_URL` to the real origin before a hosted build |
| `POST /api/inquiry` | 200 `{ "delivery": "email" }` (contacts API down — expected locally) |
| `/admin/login` | 200; form renders. Session not exercised (API down) |
| DNS / Search Console | Not this pass — no production host attached |

## Phase 4 deployment dependency

Apply the additive catalogue/journal migration before deploying the CMS cutover. Configure invalidation credentials, publish reviewed records and generate an approved `cms-export` fallback before launch. Existing journal rows remain drafts. The initial bootstrap snapshot is development-only. Follow [Phase 4 CMS cutover](p4-cms-cutover.md); local database/admin staging is evidenced (2026-09-13); assigned remote staging host checks remain ops-owned.
