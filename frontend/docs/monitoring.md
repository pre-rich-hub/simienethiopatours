# Monitoring

Basic error logging and uptime probes for **Gondar Simien Tours**. No vendor is wired in — hosting logs plus an optional server webhook. Do not invent a Sentry project or an uptime hostname here.

Env: [`environments.md`](environments.md). After a live deploy, also run [`cutover.md`](cutover.md).

## Error tracking

| Source | Where it goes |
| --- | --- |
| `console.error` / `console.warn` with a `[gst]` JSON line | Hosting function / container logs (Vercel Logs, etc.) |
| Public / admin / root error boundaries | `POST /api/log` → same `logError` path |
| Inquiry contacts API down | `warn` `inquiry-contacts` (expected locally; fallback continues) |
| Inquiry webhook set and failing | `error` `inquiry-webhook` |
| `ERROR_WEBHOOK_URL` (optional, server-only) | Same JSON as `logError`, fire-and-forget |

Never put `ERROR_WEBHOOK_URL` on `NEXT_PUBLIC_*`. Do not send emails, names, or inquiry bodies in log payloads.

To attach Slack / email / an agreed tool later: set `ERROR_WEBHOOK_URL` to that HTTPS endpoint and rebuild. Do not add a client SDK until ops names the tool.

## Uptime

**Procedure (hosting-logs + health poll):** until a third-party uptime product is named, treat hosting platform logs plus periodic `/health` polls as the uptime monitor. Ops (or a cron) should poll both health endpoints every 1–5 minutes and alert on two consecutive failures. Pair with the hosting-logs-only error path above.

Two independent checks. The public site is built to render if the CMS API is down — **do not** make the frontend probe call the backend.

| Check | URL | Expect |
| --- | --- | --- |
| Frontend (user-facing) | `https://gondarsimientours.com/` | 307 → `/en`, then 200 |
| Frontend (cheap) | `https://gondarsimientours.com/health` | 200 `{ "ok": true, "service": "frontend" }` |
| Backend | `{NEXT_PUBLIC_API_URL}/health` | 200 `{ "status": "ok" }` |

Staging uses the staging origins from ops. Local: `http://localhost:3000/health` and `http://localhost:5000/health`.

`/health` is `noindex` and listed in `robots.txt` `Disallow`. Point the monitor at it or at `/` — not at `/admin` or `/api/inquiry`.

Interval: 1–5 minutes is enough. Alert the operator if the frontend probe fails twice, or if the backend probe fails while they expect CMS / admin / chat to be live.

```bash
# Local / staging poll examples
curl -fsS "$FRONTEND_ORIGIN/health"
curl -fsS "$NEXT_PUBLIC_API_URL/health"
```

## Local rehearsal — 2026-09-12

| Check | Result |
| --- | --- |
| `GET /health` | 200 `{ "ok": true, "service": "frontend" }` |
| `GET /en` | 200 (unchanged) |
| `POST /api/log` valid scope | 200 `{ "ok": true }` |
| `POST /api/log` bad scope | 400 |
| Backend `GET http://localhost:5000/health` | Unreachable this pass (API down) — expected |
| Error UI | Boundaries added; not thrown in rehearsal |

## Sign-off

| Check | Staging | Production |
| --- | --- | --- |
| Hosting logs show `[gst]` lines | | |
| `ERROR_WEBHOOK_URL` set or explicitly left unset | | |
| Frontend `/` or `/health` monitor | | |
| Backend `/health` monitor | | |
