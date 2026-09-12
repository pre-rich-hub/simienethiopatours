# Cutover

How to put **Gondar Simien Tours** on the live domain and prove it. Env values: [`environments.md`](environments.md). Full path list: [`qa.md`](qa.md). Performance gates: [`performance.md`](performance.md). Logs and uptime: [`monitoring.md`](monitoring.md).

Do not invent staging or API hostnames. Ops fills those in. Canonical production origin is **`https://gondarsimientours.com`** (no trailing slash, no `www`).

This file is the runbook. It is not a completed production deploy.

## Order

1. Backend owner: production API up, migrations applied, `FRONTEND_ORIGIN` includes the site origin, `COOKIE_SECURE=true`, email / assistant flags set.
2. Deploy the frontend to **staging** (or a Vercel Preview that uses the staging env). Run [`qa.md`](qa.md). Staging sign-off is the P6 gate.
3. Deploy the frontend to **production** with the production env. Do not flip DNS until that build is green.
4. Point DNS at the production host.
5. Run [Post-deploy](#post-deploy) on `https://gondarsimientours.com`.
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

API and site must be **same-site** for admin cookies (`SameSite=Lax`). `https://gondarsimientours.com` → `https://api.gondarsimientours.com` is the designed shape. A `*.vercel.app` frontend talking to an unrelated API host will not send the session cookie. Details: [`environments.md`](environments.md#cookie-auth-designed-model).

## DNS

Attach the domain in the host dashboard, then at the registrar:

| Name | Type | Target |
| --- | --- | --- |
| `@` (apex) | as the host instructs (A / ALIAS / ANAME / CNAME flattening) | Production frontend |
| `www` | CNAME | Apex, or the host’s `www` target |

Redirect **`www` → `https://gondarsimientours.com`** (301 or 308). Do not leave both as indexable duplicates.

API DNS is the backend owner’s. It should be a subdomain of `gondarsimientours.com` so cookies work.

Wait until the certificate is valid and `https://gondarsimientours.com/en` returns 200 before calling DNS done.

## Post-deploy

Run these on the **live origin** after DNS. Substitute the staging origin for a staging rehearsal.

### 1. Sitemap and robots

```bash
ORIGIN=https://gondarsimientours.com
curl -sI "$ORIGIN/sitemap.xml" | head
curl -sI "$ORIGIN/robots.txt" | head
curl -s "$ORIGIN/robots.txt"
```

Expect `200`. `robots.txt` must `Disallow: /admin/` and `/api/`, and `Sitemap:` must be `$ORIGIN/sitemap.xml` (not localhost, not a preview host).

`/sitemap.xml` lists locale URLs on that same origin (`/en`, `/es`, `/de`, `/fr` and their indexable children). Privacy, terms, and admin stay out.

**Index notice (the “sitemap ping”):** Google retired `google.com/ping?sitemap=`. After the live sitemap is correct:

1. Google Search Console → add `https://gondarsimientours.com` → Sitemaps → submit `https://gondarsimientours.com/sitemap.xml`
2. Bing Webmaster Tools → submit the same URL

Do not ping a staging sitemap as if it were production.

### 2. Metadata spot-check

Open `/en`, `/en/treks/4-day-simien-classic`, `/en/plan`. Confirm:

- `<link rel="canonical">` and `og:url` use `https://gondarsimientours.com/…`
- `og:image` is on that origin (default Imet Gogo)
- `html[lang]` matches the path (`en` / `es` / `de` / `fr`)
- JSON-LD Organization / trip data does not invent prices or review counts

```bash
ORIGIN=https://gondarsimientours.com
curl -sL "$ORIGIN/en" | tr '"' '\n' | grep -E 'canonical|og:url|og:image|gondarsimientours' | head
```

### 3. Admin login

`/admin/login` with a real operator account (not in this repo).

- Valid login sets `admin_session` and lands on `/admin`
- Tours list loads when the API is healthy
- Logout clears the session

If this fails, check same-site API host, `FRONTEND_ORIGIN`, and `COOKIE_SECURE` before changing frontend code.

### 4. One inquiry

Use the live `/en/plan` form. The operator should expect this message and close it in admin (or email) so it is not treated as a real booking.

Delivery order ([`app/api/inquiry/route.ts`](../app/api/inquiry/route.ts)): contacts API → `CONTACT_WEBHOOK_URL` → mailto fallback. A `200` with `{ "delivery": "contact" }` or `"webhook"` is success. `"email"` means the APIs were down — the form still works, but fix the API before calling cutover done.

Also hit `/en`, `/en/treks`, `/es`, `/de`, `/fr` once. Then run the performance rows in [`performance.md`](performance.md).

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
| Rollback target recorded (previous deploy id) | | |

## Local rehearsal — 2026-09-12

Commands run against `http://127.0.0.1:3000`. This does **not** replace a production pass. Express API on `:5000` was down.

| Check | Result |
| --- | --- |
| `GET /sitemap.xml` | 200; 272 unique locale URLs; no `/admin`, `/privacy`, `/terms` |
| `GET /robots.txt` | 200; disallows `/admin/` and `/api/`; `Sitemap: https://gondarsimientours.com/sitemap.xml` |
| `GET /en` metadata | 200; `html[lang]=en`. This local process minted production canonicals / `og:url` / `og:image` (`https://gondarsimientours.com/…`) — set `NEXT_PUBLIC_SITE_URL` to the real origin before a hosted build |
| `POST /api/inquiry` | 200 `{ "delivery": "email" }` (contacts API down — expected locally) |
| `/admin/login` | 200; form renders. Session not exercised (API down) |
| DNS / Search Console | Not this pass — no production host attached |
