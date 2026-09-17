# Client Backend Template

Express + TypeScript + Prisma backend template for client projects. Includes a
complete AI assistant module with streaming, session management, and usage
limits.

## Stack

- Express 4
- TypeScript (tsx for dev)
- Prisma + PostgreSQL (Neon)
- Zod validation
- Pino logging
- AI providers: OpenAI, Gemini (add Anthropic/Grok by implementing
  `ChatProvider`)

## Quick Start

```bash
npm install
cp .env.example .env
# Fill in DATABASE_URL, DIRECT_URL, JWT_SECRET, GEMINI_API_KEY
npm run prisma:migrate
npm run dev
```

## What's Included

```
src/
  config/
    env.ts             # Zod-validated env vars with boot checks
    database.ts        # Prisma client
    pino.ts            # Logger with redaction
  middleware/
    auth.middleware.ts # JWT cookie auth for admin routes
    error.middleware.ts# Error → JSON response mapping
    rate-limit.middleware.ts
    logging.middleware.ts
  modules/
    assistant/         # The AI assistant (biggest value here)
      provider.client.ts   # OpenAI + Gemini helpers, createProvider()
      assistant.service.ts # runChat() orchestration
      context-builder.ts   # Pulls catalog data from DB into system prompt
      session-store.ts     # Session + usage tracking in Prisma
      gating.ts            # Token estimation, session/daily caps
      assistant.routes.ts  # POST /api/v1/assistant (SSE streaming)
      assistant.validation.ts
    health/
  services/
    email.service.ts   # SMTP + Resend transport
  utils/
    api-response.ts    # ok() / fail() consistent responses
  app.ts
  server.ts
  routes.ts
prisma/
  schema.prisma        # Tour/booking/admin/AI session models
```

## Customizing for a New Client

### 1. Prisma schema

The schema has travel-domain models (Tour, Destination, Booking) plus the
generic admin/contact/blog/assistant models. Update the catalog models to match
the client's business. Keep the `ChatSession`, `ChatMessage`, `ChatDailyUsage`
models — the assistant depends on them.

### 2. AI assistant context

Edit `src/modules/assistant/context-builder.ts`. This is the only file that
knows about your domain. Change the Prisma queries and field mappings to pull
whatever data grounds the assistant (tours, products, services, FAQs).

### 3. System prompt

Edit `buildSystemPrompt()` in `src/modules/assistant/assistant.service.ts`:
brand name, tone, what the assistant should/shouldn't do.

### 4. Routes

Register new routers in `src/routes.ts`.

## AI Assistant API

### POST /api/v1/assistant

```json
{
  "sessionId": "optional-uuid-for-continuing-conversation",
  "message": "user question"
}
```

Response is SSE stream:

```
event: meta
event: delta   (one per token chunk)
event: done    (final, includes usage)
```

### Limits

- Per-session message cap: `ASSISTANT_MAX_MESSAGES` (default 30)
- Daily token cap: `ASSISTANT_MAX_DAILY_TOKENS` (default 200k)
- Context window: `ASSISTANT_MAX_CONTEXT_CHARS` (default 40k)

All configurable in `.env`.

## Data retention

Public-form and assistant data use the privacy defaults below:

| Data                                        | Default                                    | Configuration              |
| ------------------------------------------- | ------------------------------------------ | -------------------------- |
| Contact inquiries                           | 730 days from submission                   | `CONTACT_RETENTION_DAYS`   |
| Assistant sessions, messages, and hashed IP | 30 days after the session was last updated | `ASSISTANT_RETENTION_DAYS` |
| Newsletter subscribers                      | Until withdrawal or admin deletion         | Not automatically purged   |

Long-running servers run retention cleanup at startup and every 24 hours. Public
contact, newsletter, and assistant requests also trigger a throttled cleanup
attempt for serverless deployments. Schedule `npm run data:purge` daily as an
independent production safeguard. The command logs deletion counts only and does
not print personal data.

## Public editorial audit

Run `npm run content:audit` before seeding or publishing catalog content. It
checks bundled tours and destination records for internal research language,
package-mapping notes, and other wording that must not appear in public HTML.

## AI Providers

Set `ASSISTANT_PROVIDER=gemini` or `openai`, plus the matching API key.

| Provider | SDK             | Free tier               |
| -------- | --------------- | ----------------------- |
| Gemini   | `@google/genai` | 15 RPM, 1M tokens/month |
| OpenAI   | `openai`        | $5 credit new accounts  |

To add a new provider, implement `ChatProvider` in `provider.client.ts` and add
a case in `createProvider()`.

## Conventions

- Files stay under 300 lines
- Type hints everywhere
- Boot checks fail fast on misconfigured env
- No secrets in code, ever
- Commit in small, atomic pieces

## Phase 4 public catalogue

`GET /api/v1/catalogue` is the shared, publication-filtered
tour/destination/journal contract. Admin mutations invalidate frontend/assistant
caches. Journal rows start as drafts and require author, description, content
and image alt text when publishing an image. Apply migration
`20260913090000_public_catalogue_journal`, configure `CATALOGUE_REVALIDATE_URL`
and `CATALOGUE_REVALIDATE_SECRET`, and export approved content with
`npm run content:export`. See
[the CMS cutover runbook](../frontend/docs/p4-cms-cutover.md). No production
seed, migration or publication is implied by local verification.
