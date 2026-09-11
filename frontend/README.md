# Gondar Simien Tours — Frontend

Marketing site and admin UI for **Gondar Simien Tours** (operator: **Simien Ethio Tours**), a locally owned company focused on Gondar and the Simien Mountains in Ethiopia.

This folder is the **frontend**. The Express + Prisma API lives in [`../backend`](../backend) and is owned separately. The public site can run with bundled content alone; when the backend is available, the frontend prefers live CMS data and falls back gracefully if the API is unreachable.

---

## Project scope

Client deliverables this frontend supports or will support:

| Area | Intent |
| --- | --- |
| Website development | Custom, responsive, fast, secure, SEO-ready site with an admin panel |
| SEO | On-page and technical SEO, keyword/content optimization, local SEO |
| GEO | Optimize for generative / AI search (ChatGPT, Gemini, Copilot, etc.) |
| AI travel assistant | Chatbot to answer visitor questions and support lead conversion |
| Video production | Surfaces for professional promotional video |
| Language integration | English, Spanish, German, French with proper localization |
| Logo / brand | Premium minimalist identity, guidelines, and scalable assets |

See [Planned / upcoming](#planned--upcoming-frontend) for what is not fully live yet.

---

## Current stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript |
| Validation | Zod |
| Icons | Lucide React |
| Fonts | Cormorant Garamond + Manrope (`@fontsource`) |
| Styles | Tailwind CSS v4 + shadcn/ui, with remaining marketing CSS in [`app/globals.css`](app/globals.css) |

---

## Repository structure (frontend)

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout, metadata
│   ├── globals.css         # Brand tokens, Tailwind/shadcn theme, marketing CSS
│   ├── api/inquiry/        # Inquiry API route (webhook / mailto path)
│   ├── admin/              # Admin panel pages (login, tours, CMS entities)
│   ├── treks/              # Trek listing + [slug] detail
│   ├── sitemap.ts          # Sitemap generation
│   ├── robots.ts           # robots.txt
│   └── …                   # Destination, plan, gallery, legal, etc.
├── components/             # Shared marketing UI
│   ├── admin/              # Admin form controls, TourForm, etc.
│   ├── AssistantChat.tsx   # AI chat widget (calls backend when enabled)
│   ├── Header.tsx / Footer.tsx
│   └── …
├── lib/                    # Data, CMS, helpers
│   ├── site.ts             # Brand, contact, journey cards
│   ├── itineraries.ts      # Trek detail content (bundled)
│   ├── cms.ts              # API-first fetch + bundled fallback
│   ├── api/client.ts       # Public API fetch helper
│   ├── admin/client.ts     # Authenticated admin requests
│   └── …                   # reviews, gallery, experiences, nav, etc.
├── public/images/          # Static photography and assets
├── .env.example            # Env template
├── content-map.md          # Editorial mapping of client drafts
└── research-notes.md       # Research and content integrity notes
```

---

## Backend integration

| Concern | How it works |
| --- | --- |
| API base URL | `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`) |
| Content | [`lib/cms.ts`](lib/cms.ts) tries the Express CMS APIs first; on any failure returns bundled data so pages never break |
| Admin | `/admin/*` talks to `/api/v1/admin/*` and `/api/v1/auth/*` with cookie auth |
| AI assistant | Widget in the UI; streaming chat against `POST /api/v1/assistant` when the backend has the assistant enabled |
| Inquiries | Planner validates in-app; optional `CONTACT_WEBHOOK_URL`, otherwise prepared mailto to the operator |

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — defaults work for local marketing-only use
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (production SEO / absolute links) |
| `NEXT_PUBLIC_API_URL` | Express backend origin (default `http://localhost:5000`) |
| `CONTACT_WEBHOOK_URL` | Optional JSON webhook for silent inquiry delivery |

### Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm start       # serve production build
npm run lint    # TypeScript check (`tsc --noEmit`)
```

For CMS, admin, and AI chat against live data, run the backend in [`../backend`](../backend) and point `NEXT_PUBLIC_API_URL` at it.

---

## Main routes

### Public

| Route | Purpose |
| --- | --- |
| `/` | Narrative homepage |
| `/simien-mountains` | Destination guide |
| `/treks` | Journey listing |
| `/treks/[slug]` | Trek / itinerary detail |
| `/gondar` | Royal city and gateway |
| `/about` | Operator and founder story |
| `/plan` | Inquiry planner |
| `/gallery` | Photo gallery |
| `/privacy`, `/terms` | Legal |

### Admin

| Route | Purpose |
| --- | --- |
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard |
| `/admin/tours` | Tour list / create / edit |
| `/admin/destinations` | Destinations |
| `/admin/gallery` | Gallery |
| `/admin/testimonials` | Testimonials |
| `/admin/blog` | Blog posts |
| `/admin/blog-categories` | Blog categories |
| `/admin/bookings` | Bookings |
| `/admin/contacts` | Contact messages |
| `/admin/subscribers` | Newsletter subscribers |

---

## Planned / upcoming (frontend)

These are in project scope but not fully implemented in this app yet:

- **Tailwind CSS** and **shadcn/ui** — admin + shared chrome migrated; remaining marketing section CSS is still in `globals.css`
- **Multi-language** — English, Spanish, German, French (a language switcher shell exists; full localization is not wired)
- **GEO** — structured / AI-search-oriented content and markup for generative engines
- **Video** — promotional video placement and playback UX
- **Brand / logo** — guidelines and scalable vector assets beyond the current mark
- **AI assistant** — chat UI is present; full 24/7 conversion behavior depends on backend config (`ASSISTANT_ENABLED` and provider keys)

SEO foundations already in place include App Router metadata patterns, `sitemap.ts`, `robots.ts`, and careful content sourcing. Deeper keyword / local SEO work continues as content evolves.

---

## Content integrity

- Brand, operator, founder, and contact facts live in [`lib/site.ts`](lib/site.ts).
- Do not invent prices, review counts, wildlife guarantees, or unverified trail metrics.
- Travel facts should link to UNESCO, official tourism sources, or the operator.
- Photo authors, licenses, and files are listed in [`research-notes.md`](research-notes.md).
- Editorial mapping: [`content-map.md`](content-map.md).
- Research synthesis: [`research-notes.md`](research-notes.md).
