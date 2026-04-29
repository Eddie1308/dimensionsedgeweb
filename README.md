# Dimensions Edge — Corporate Website

A bilingual (EN/AR) corporate website for a 25-year-old Low Current (ELV) and ICT systems integrator based in Saudi Arabia.

**Status: Phases 1–7 complete (autonomous build).** Awaiting MySQL provisioning + visual QA before production deploy.

---

## Tech Stack

| Layer | Choice | Version | Notes |
|-------|--------|---------|-------|
| Framework | Next.js (App Router) | 16.2.4 | Turbopack default, React Compiler stable |
| UI runtime | React | 19.2.0 | |
| Styling | Tailwind CSS (v4 CSS-first) | 4.2.4 | `@theme` tokens in globals.css |
| Animation | Motion (formerly Framer Motion) | 12.38.0 | Imported from `motion/react` |
| ORM | Prisma (driver-adapter mode) | 7.4.2 | Lazy client; URL in `prisma.config.ts` |
| MySQL driver | @prisma/adapter-mariadb | 7.4.2 | Works for MySQL 8 + MariaDB |
| Database | MySQL | 8.x | |
| Auth | Custom JWT (jose) | — | Edge-safe; Phase 6 swaps to Prisma User table |
| i18n | next-intl | 4.10.1 | EN/AR with RTL |
| Validation | Zod | 3.24.x | |
| Image processing | Sharp | 0.33.x | WebP pipeline; EXIF stripped |
| Process manager | PM2 | — | See `ecosystem.config.cjs` |

---

## Project Structure

```
dimensionsedgeweb/
├── DEPLOYMENT.md              # aaPanel + Nginx + PM2 production guide
├── ecosystem.config.cjs       # PM2 cluster config
├── prisma/
│   ├── schema.prisma          # MySQL schema (bilingual, isVisible toggles)
│   └── seed.ts                # Admin user + 7 services + site settings
├── prisma.config.ts           # Prisma 7 config (datasource lives here, not in schema)
├── public/
│   └── uploads/               # User-uploaded images (gitignored content)
├── src/
│   ├── app/
│   │   ├── [locale]/          # Public pages (en, ar) — RTL flips automatically
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Home: hero + service preview
│   │   │   ├── about/page.tsx
│   │   │   ├── services/
│   │   │   │   ├── page.tsx          # Index of 7 disciplines
│   │   │   │   └── [slug]/page.tsx   # Detail per service (SSG, all 7×2)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # Gallery (mock data → DB on flip)
│   │   │   │   └── [slug]/page.tsx   # Detail with cover + image grid
│   │   │   ├── partners/page.tsx
│   │   │   ├── clients/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── admin/             # Admin app (English-only, route-grouped)
│   │   │   ├── layout.tsx     # Bare html/body
│   │   │   ├── login/         # Bypasses the AdminShell wrapper
│   │   │   └── (authed)/      # All authenticated admin pages
│   │   │       ├── layout.tsx        # Wraps with AdminShell + auth check
│   │   │       ├── page.tsx          # Dashboard
│   │   │       ├── projects/         # CRUD + image upload
│   │   │       ├── partners/
│   │   │       ├── clients/
│   │   │       ├── settings/
│   │   │       └── messages/
│   │   ├── api/
│   │   │   ├── contact/route.ts             # Public form submission (Phase 6: writes to DB)
│   │   │   └── admin/
│   │   │       ├── login|logout/route.ts
│   │   │       ├── upload/route.ts          # Sharp pipeline → /uploads/yyyy/mm/<hex>.webp
│   │   │       ├── projects[/[id]]/route.ts
│   │   │       ├── partners[/[id]]/route.ts
│   │   │       ├── clients[/[id]]/route.ts
│   │   │       ├── settings/route.ts
│   │   │       └── messages/[id]/route.ts
│   │   ├── globals.css        # Tailwind v4 entry + @theme tokens
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                # Container, Section, Button, Card, PageHeader, etc.
│   │   ├── layout/            # SiteHeader, SiteFooter, MobileNav, LocaleSwitcher, Logo
│   │   ├── motion/            # FadeIn, FadeUp, Reveal, Stagger (reduce-motion safe)
│   │   └── admin/             # DbNotice, AdminPageHeader, Field, VisibilityBadge
│   ├── data/                  # Static catalogue (services, projects, partners, clients)
│   ├── lib/
│   │   ├── prisma.ts          # Lazy Prisma client (Proxy-wrapped)
│   │   ├── auth/              # session.ts, credentials.ts, server.ts
│   │   ├── content/           # Content adapter — flip USE_DB after MySQL live
│   │   ├── upload/            # Sharp processImage pipeline
│   │   ├── validators/        # Zod schemas (contact + admin)
│   │   ├── admin/db-guard.ts  # Wraps Prisma calls so admin renders DbNotice on failure
│   │   └── utils.ts           # cn() helper
│   ├── i18n/                  # next-intl setup + en.json / ar.json
│   └── proxy.ts               # Composed: locale routing + admin auth guard
├── next.config.ts             # Standalone output, security headers, intl plugin
└── package.json
```

---

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Foundation | ✅ Code-verified | Configs, schema, i18n, app shell |
| 2. Design system & layout | ✅ Code-verified | Brand tokens, Header/Footer/MobileNav, Motion primitives |
| 3. Public pages — static | ✅ Code-verified | About, Services index + 7 detail pages, Contact + form |
| 4. Public pages — dynamic | ✅ Code-verified | Projects gallery + detail, Partners, Clients (mock-data adapter) |
| 5. Admin auth | ✅ End-to-end verified | Custom JWT (jose), 8/8 auth flow checks pass |
| 6. Admin CRUD + uploads | ✅ Code-verified | Full CRUD UI for Projects/Partners/Clients/Settings/Messages, Sharp pipeline |
| 7. Optimization & deploy | ✅ Documented | next.config security headers, PM2 ecosystem, full DEPLOYMENT.md |

**42 static HTML pages** prerendered. **24 dynamic routes** for admin + APIs. **Standalone build: 37 MB.**

---

## Quick start (local development)

```bash
npm install
cp .env.example .env       # Adjust DATABASE_URL when MySQL is provisioned
npx prisma generate
npm run dev                # http://localhost:3000
```

The site works **without MySQL** in Phase-state. Public pages serve mock data; admin pages render a friendly DbNotice for any DB-dependent operation. Once MySQL is live, follow the user-critical checklist below.

---

## User-critical checklist (do these before production)

1. **Provision MySQL on aaPanel** (see [DEPLOYMENT.md §1](./DEPLOYMENT.md))
2. **Update `DATABASE_URL`** in `.env` to the real connection string
3. **Run migrations + seed**:
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
4. **Flip three USE_DB flags** to `true`:
   - `src/lib/content/projects.ts`
   - `src/lib/content/partners.ts`
   - `src/lib/content/clients.ts`
5. **Swap auth to Prisma User lookup** in `src/lib/auth/credentials.ts` — uncomment the Phase 6 block, delete the env-mode block
6. **Change the seeded admin password** after first login
7. **Generate a fresh `AUTH_SECRET`** for production: `openssl rand -base64 32`
8. **Walk through visual QA** — see the in-app todo list for the per-phase checklist

---

## Architecture decisions worth knowing

- **Prisma 7 driver-adapter pattern**. URL lives in `prisma.config.ts`, not `schema.prisma`. The runtime client requires `@prisma/adapter-mariadb`.
- **Next 16 renamed `middleware.ts` → `proxy.ts`**. The proxy composes locale routing (next-intl) with admin auth guard (custom JWT cookie).
- **Custom auth (jose) instead of next-auth**. As of April 2026, `next-auth@5.x-beta` declares peer `next@^14 || ^15` — incompatible with Next 16 without `--legacy-peer-deps`. The project uses ~100 lines of custom JWT cookie auth on top of `jose`, which is Edge-safe and battle-tested.
- **Content adapter pattern**. Phase 4 ships with mock data so the public site works pre-DB. The adapter (`src/lib/content/*.ts`) has a single `USE_DB` flag per resource — flip to true once MySQL has data, no UI changes required.
- **Static services catalogue**. The 7 service detail pages are content-heavy and rarely change. They're sourced from `src/data/services.ts` (typed, version-controlled) rather than the DB. The admin doesn't manage service content; if you need to edit a service, edit the data file and redeploy.
- **isVisible toggle**. Project, Partner, and Client all default to `isVisible: false` so admins can stage content in the DB before exposing it. The public adapter filters; the admin shows everything.
- **Image pipeline**. All admin uploads go through Sharp: EXIF stripped, capped at 2400×2400, re-encoded to WebP at quality 82, saved under `/public/uploads/<yyyy>/<mm>/<random>.webp`. Filenames are content-addressed so caching works forever.

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** — covers aaPanel server setup, MySQL provisioning, environment file, `.next/standalone` deploy, PM2 ecosystem, Nginx reverse proxy with SSL, and a post-deploy checklist.
