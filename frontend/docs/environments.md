# Environments

Frontend env for **local**, **staging**, and **production**. Host and API hostnames for staging/production are set by ops — do not invent them here.

`NEXT_PUBLIC_*` values are inlined at **build** time. Rebuild (or redeploy) after changing them.

## Local API-up pairing (before real staging hosts exist)

Use the repo-root `docker-compose.yml` when the Compose plugin is available, or run `./scripts/staging-local-prep.sh`, which starts Postgres with plain `docker run` (Compose plugin not required).

```bash
# from repository root
./scripts/staging-local-prep.sh
# then run backend + frontend `npm run dev` in separate terminals
```

Defaults: `postgresql://gst:gst@127.0.0.1:5432/gondar_simien_tours` in container `gst-postgres`. After migrate/seed/admin bootstrap, rehearse publish → public page → invalidation → `npm run content:export`. Record results in [`qa.md`](qa.md). Replace `<staging-host>` / `<staging-api-host>` only when ops assigns them.

## Frontend matrix

| Variable | Local | Staging | Production | Notes |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://<staging-host>` (no trailing slash) | `https://gondarsimientours.com` | Canonical, sitemap, Open Graph, JSON-LD, hreflang. Must match the origin visitors use. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | `https://<staging-api-host>` | `https://<production-api-host>` | Express origin only (no `/api` suffix). Used by admin, CMS, chat, newsletter, inquiry, and `next.config` image `remotePatterns` for `/assets/**`. |
| `API_URL` | unset (falls back to `NEXT_PUBLIC_API_URL`) | optional | optional | Server-only override for SSR/`lib/cms.ts` / `lib/api/client.ts` if the app server should reach the API on an internal URL. |
| `CONTACT_WEBHOOK_URL` | unset | optional | optional | Server-only. Inquiry route POSTs JSON here **only if** `POST {API}/api/v1/contacts` fails. Never prefix `NEXT_PUBLIC_`. |
| `ERROR_WEBHOOK_URL` | unset | optional | optional | Server-only. `logError` POSTs a small JSON line here (error boundaries, failed inquiry webhook). Never prefix `NEXT_PUBLIC_`. See [`monitoring.md`](monitoring.md). |

Inquiry delivery order in [`app/api/inquiry/route.ts`](../app/api/inquiry/route.ts): backend contact → webhook (if set) → mailto fallback. Public pages still render if the API is down.

## Copy-paste

### Local (`.env.local`)

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
# CONTACT_WEBHOOK_URL=
# ERROR_WEBHOOK_URL=
# API_URL=
```

### Staging (host dashboard)

```bash
NEXT_PUBLIC_SITE_URL=https://<staging-host>
NEXT_PUBLIC_API_URL=https://<staging-api-host>
# CONTACT_WEBHOOK_URL=
# ERROR_WEBHOOK_URL=
```

### Production (host dashboard)

```bash
NEXT_PUBLIC_SITE_URL=https://gondarsimientours.com
NEXT_PUBLIC_API_URL=https://<production-api-host>
# CONTACT_WEBHOOK_URL=
# ERROR_WEBHOOK_URL=
```

Do not point production `NEXT_PUBLIC_SITE_URL` at staging, and do not leave it unset in a production build — the code default is the live domain, which would mint production canonicals from the wrong host if you only change DNS later.

## Backend pair (owner: `../backend`)

Each frontend origin needs a matching backend env. See [`backend/.env.example`](../../backend/.env.example).

| Backend variable | Local | Staging / production |
| --- | --- | --- |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | Same origin as `NEXT_PUBLIC_SITE_URL` (scheme + host, no path) |
| `COOKIE_SECURE` | `false` | `true` (HTTPS) |
| `AUTH_COOKIE_NAME` | `admin_session` | keep in sync with frontend expectations |
| `ASSISTANT_ENABLED` | `false` (default) | keep `false` until grounded eval passes; one-env flip to enable |
| `CONTACT_RETENTION_DAYS` | `730` | `730` unless an approved policy changes it |
| `ASSISTANT_RETENTION_DAYS` | `30` | `30` unless an approved policy changes it |

The backend must run `pnpm data:purge` daily in staging and production. A
long-running backend also runs cleanup at startup and every 24 hours; public
form and assistant requests provide a throttled fallback for serverless
instances. The independent daily job remains required for predictable cleanup.

## Cookie auth (designed model)

Admin session is an **httpOnly** cookie (`admin_session` by default) set by the Express API on login. The frontend never reads the token. Browser `fetch` calls use `credentials: "include"` ([`lib/admin/client.ts`](../lib/admin/client.ts), login, logout).

Backend cookie flags ([`backend/src/middleware/auth.middleware.ts`](../../backend/src/middleware/auth.middleware.ts)):

| Flag | Value | Why |
| --- | --- | --- |
| `httpOnly` | `true` | JS cannot read the JWT |
| `sameSite` | `lax` | Sent on same-site XHR; not sent on cross-site `fetch` |
| `secure` | `COOKIE_SECURE` or production | Required on HTTPS |
| `path` | `/` | Whole API origin |

**Same-site, different origin is supported.** `http://localhost:3000` → `http://localhost:5000` works (same host, different ports). `https://gondarsimientours.com` → `https://api.gondarsimientours.com` works (same eTLD+1). CORS `credentials: true` plus `FRONTEND_ORIGIN` (comma-separated allowlist) lets that credentialed `fetch` through.

**Unrelated hosts are not supported** with `SameSite=Lax` (for example a `*.vercel.app` site talking to a `*.railway.app` API). The browser will store the cookie on the API host and then omit it on `fetch`. Do not “fix” that on the frontend. Either put the API on a subdomain of the site, or the backend owner must change the cookie to `SameSite=None; Secure`.

`FRONTEND_ORIGIN` must be the exact frontend origin (scheme + host, no path), matching `NEXT_PUBLIC_SITE_URL`.

## Client bundle

Only `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` may appear in client code. They are public origins, not secrets.

| Variable | Bundle | Used by |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Client + server | Canonical / OG / JSON-LD |
| `NEXT_PUBLIC_API_URL` | Client + server | Admin, chat, newsletter, image hosts |
| `API_URL` | Server only | `lib/cms.ts`, `lib/api/client.ts` |
| `CONTACT_WEBHOOK_URL` | Server only | `app/api/inquiry/route.ts` |
| `ERROR_WEBHOOK_URL` | Server only | `lib/log.ts` |

Do not rename `CONTACT_WEBHOOK_URL`, `ERROR_WEBHOOK_URL`, or `API_URL` to `NEXT_PUBLIC_*`. Never put JWT, SMTP, or provider keys in the frontend env.

## Checks before a deploy

- [ ] `NEXT_PUBLIC_SITE_URL` has no trailing slash and matches the public origin
- [ ] `NEXT_PUBLIC_API_URL` is reachable from the browser (admin + chat) and from the Next server (CMS + inquiry)
- [ ] Image hosts for CMS uploads are covered (`{API}/assets/**` via `next.config.ts`)
- [ ] `CONTACT_WEBHOOK_URL` is empty or a real HTTPS endpoint — never a placeholder
- [ ] `ERROR_WEBHOOK_URL` is empty or a real HTTPS endpoint — never a placeholder
- [ ] Backend `FRONTEND_ORIGIN` includes that same site origin
- [ ] API host is same-site with the frontend (localhost ports, or a subdomain of `gondarsimientours.com`)
- [ ] `COOKIE_SECURE=true` on HTTPS staging and production
- [ ] No secrets in frontend env except unused empty optionals — never `NEXT_PUBLIC_` on webhooks or keys
- [ ] Draft CSP in `next.config.ts` still allows the API origin used by chat/CMS/admin; tighten before go-live

## Quality scripts (local)

```bash
npm run typecheck
npm run lint          # warnings OK on first pass; fix errors in touched files
npm test
npm run qa:content
npm run qa:metadata
npm run qa:secrets
npm run content:locale-audit
```

## Phase 4 catalogue invalidation

Set the same server-only `CATALOGUE_REVALIDATE_SECRET` in frontend and backend. Set backend `CATALOGUE_REVALIDATE_URL` to the deployed frontend `/api/revalidate` endpoint. Do not expose either secret through `NEXT_PUBLIC_`. Catalogue reads use `API_URL`; browser-facing `/assets/` images use `NEXT_PUBLIC_API_URL` when set. Install both frontend and backend dependencies when building the shared catalogue schema. See [CMS cutover](p4-cms-cutover.md).
