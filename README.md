# Dimensions Edge — Corporate Website

A bilingual (EN/AR) corporate website for a 25-year-old Low Current (ELV) and ICT systems integrator based in Saudi Arabia.

## Tech Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Framework | Next.js (App Router) | 16.2.4 |
| UI runtime | React | 19.2.0 |
| Styling | Tailwind CSS (v4 CSS-first) | 4.2.4 |
| Animation | Motion (formerly Framer Motion) | 12.38.0 |
| ORM | Prisma (driver-adapter mode) | 7.4.2 |
| MySQL driver | @prisma/adapter-mariadb | 7.4.2 |
| Database | MySQL | 8.x |
| Auth | Auth.js (next-auth v5) — added in Phase 5 | _deferred_ |
| i18n | next-intl | 4.10.1 |
| Validation | Zod | 3.24.x |
| Image processing | Sharp | 0.33.x |

Versions are pinned exactly for `next`, `prisma`, `@prisma/client`, `tailwindcss`, and `motion` to keep the project on a known-good baseline.

## Project Structure

```
dimensionsedgeweb/
├── prisma/
│   ├── schema.prisma         # MySQL schema with bilingual fields + isVisible toggles
│   └── seed.ts               # Admin user + 7 services + site settings
├── public/
│   └── uploads/              # User-uploaded images (gitignored content)
├── src/
│   ├── app/
│   │   ├── [locale]/         # Locale-routed public pages (en, ar)
│   │   │   ├── layout.tsx    # Root html/body, sets dir=ltr|rtl
│   │   │   └── page.tsx      # Home
│   │   ├── globals.css       # Tailwind v4 entry + @theme tokens
│   │   └── not-found.tsx     # Top-level fallback
│   ├── i18n/
│   │   ├── routing.ts        # locales, defaultLocale, direction map
│   │   ├── navigation.ts     # Locale-aware Link/router
│   │   ├── request.ts        # Server-side message loader
│   │   └── messages/         # en.json, ar.json
│   ├── lib/
│   │   └── prisma.ts         # Prisma client singleton (with mariadb adapter)
│   └── proxy.ts              # next-intl locale routing (Next 16 renamed middleware → proxy)
├── prisma.config.ts          # Prisma 7 config (datasource.url moved out of schema)
├── next.config.ts            # Standalone output, intl plugin wired
├── postcss.config.mjs        # Tailwind v4 PostCSS plugin
├── tsconfig.json             # Strict TS, @/* path alias
└── package.json
```

## Phase 1 Verification (run these to confirm the foundation works)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the env file (a `.env` already exists locally with placeholders for testing without a real DB):
   ```bash
   # Already done — edit .env when you wire up MySQL on aaPanel.
   # To generate a real AUTH_SECRET later:
   #   openssl rand -base64 32
   ```

3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

4. Start the dev server (works without a database for the static home page):
   ```bash
   npm run dev
   ```

5. **Phase 1 verification — confirmed passing as of 2026-04-28:**
   - [x] `http://localhost:3000/` → 307 redirect to `/en` (with `NEXT_LOCALE=en` cookie)
   - [x] `/en` returns HTTP 200, renders `<html lang="en" dir="ltr">`
   - [x] `/ar` returns HTTP 200, renders `<html lang="ar" dir="rtl">`
   - [x] `npm run typecheck` passes with zero errors

6. **Database verification — to be done once MySQL is provisioned (aaPanel):**
   - [ ] Create the database: `CREATE DATABASE dimensionsedge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
   - [ ] Update `DATABASE_URL` in `.env`
   - [ ] Run `npx prisma migrate dev --name init`
   - [ ] Run `npm run prisma:seed`
   - [ ] Confirm in Prisma Studio: 1 admin user, 7 services, 8 site settings

## Phase Plan

1. **Foundation** ← _current_
2. Design system & layout (Header, Footer, Motion primitives)
3. Public pages — static (Home, About, Services + sub-pages, Contact)
4. Public pages — dynamic (Projects, Partners, Clients, respecting `isVisible`)
5. Admin auth & shell (`/admin`, Auth.js credentials, route protection)
6. Admin CRUD & uploads (visibility toggles, Sharp pipeline, site settings)
7. Optimization & aaPanel deploy (standalone output, PM2 + Nginx notes)

Each phase ends with hands-on verification before the next begins.

## Deployment Target

aaPanel-hosted, behind Nginx reverse proxy, run with PM2.
`next.config.ts` already sets `output: "standalone"` so the build produces a self-contained `.next/standalone/` directory ready for production.
