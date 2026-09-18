# Maosaji — Restaurant Platform v1 (Private Concept)

A **private, non-commercial concept website** prepared for **Maosaji** (Bilaspur, Chhattisgarh) — a full-stack restaurant platform that presents the brand cinematically while running real business software underneath: searchable menu, two-outlet location system, enquiry capture and a working admin panel.

> **This is not the official Maosaji website.** It is an unofficial private concept built as a sales demonstration. It is served with `noindex, nofollow` and never contacts the business. All facts (locations, ordering links, reference phone numbers) come from public listings as of **18 September 2026**. All photography is AI-generated **concept imagery**, clearly labelled in [`MEDIA_PLAN.md`](./MEDIA_PLAN.md) — production must replace it with owner-approved assets.

---

## What's inside

### Public customer site (cinematic, editorial)
- **Film hero** — a silent six-shot food "film" (crossfading graded stills with Ken Burns drift; portrait derivatives on mobile; static poster for `prefers-reduced-motion`)
- **Chapters** — `EAT. / SWEET. / BAKERY.` with sticky media rails, drifting product rails and arch/circle image masks
- **Menu discovery** — *"What are you craving?"* with instant search (try `dosa`), deep links from the homepage into `?q=` / `?category=` menu states
- **CELEBRATE** — concept enquiry pathways (occasions, bulk quotes, custom cakes)
- **Locations** — Srikant Verma Marg & Mangla Chowk with verified Zomato/Swiggy handoffs and directions
- **Order hub** — routes customers to existing ordering partners (no payments taken on-site)
- Full pages: `/menu`, `/sweets`, `/bakery`, `/celebrations`, `/bulk-orders`, `/locations`, `/our-story`, `/gallery`, `/order`, `/contact`, privacy & terms

### Business software (the demo moment)
- **Admin panel** (`/admin`, passcode demo login) with:
  - **Enquiry inbox** — every celebration/bulk/cake/contact submission, with status management
  - **Menu Manager** — availability & featured toggles that the public menu reflects **immediately**
  - Locations, offers and site-settings management, plus lightweight analytics
- **Structured enquiry API** — Zod-validated, honeypot-protected, persisted server-side
- **Reusable core** — generic Prisma models (`Location`, `MenuItem`, `Enquiry`, `Offer`, `SiteSetting`); the brand is isolated to [`src/config/restaurant.ts`](./src/config/restaurant.ts) + seed data, so the whole platform can be rebranded for any restaurant without touching components

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Motion | Framer Motion (masked reveals, parallax, film engine) |
| Typography | Fraunces (soft-serif display) + Figtree (UI/body) |
| Data | Prisma ORM + SQLite (DEMO_MODE) behind a swappable `DataProvider` |
| Validation | Zod |
| State | Zustand (client), server components + fetch (data) |

### Backend mode: DEMO_MODE
No Supabase credentials are present in this environment, so the platform runs in **DEMO_MODE**: persistence is server-side via Prisma/SQLite (`db/custom.db`, auto-seeded on first request). The [`src/lib/data-provider/`](./src/lib/data-provider) abstraction mirrors a Supabase implementation — swapping backends requires no UI changes.

---

## Quick start

```bash
bun install          # or npm install
bun run db:push      # create the SQLite schema (file:./db/custom.db)
bun run dev          # http://localhost:3000
```

The database seeds itself on first request (29 menu items, 2 outlets, demo enquiries, one demo offer).

**Admin:** open `/admin` and sign in with the demo passcode `demo2026` (shown as a hint on the login page — this is a private demo; replace with real auth for production).

### The two-minute sales demo
1. **Homepage** — let the film hero play, scroll through `EAT → SWEET → BAKERY`
2. **Menu** → search `dosa` → open a dish, switch outlet filter
3. **Bulk Orders** → submit a demo enquiry (e.g. *200 boxes, corporate gifting*)
4. **Admin → Enquiries** → the new enquiry is already there
5. **Admin → Menu Manager** → mark an item unavailable → check the public menu (grays out, add-button disabled) → restore it

---

## Project layout

```
src/
  app/
    (site)/          # customer-facing routes
    admin/           # application UI (deliberately not cinematic)
    api/             # REST endpoints (menu, enquiries, admin, analytics)
  components/
    site/cinema/     # homepage chapters + film engine + page heroes
    site/            # navbar, footer, gallery, location cards
    menu/ forms/ admin/ shared/ ui/
  config/            # restaurant.ts — THE brand identity file
  lib/
    data-provider/   # DEMO_MODE provider (Supabase-swappable)
    seed-data.ts     # demo menu (names follow public menu breadth; no invented prices)
prisma/              # generic schema
build-pack/          # original requirements pack (source of truth)
MEDIA_PLAN.md        # media inventory, provenance labels, storyboard
```

## Content & data rules

- Only facts from the verified-facts pack: two outlets with public Zomato/Swiggy links and reference phone numbers; public menu breadth. **No invented history, prices, hours, reviews or testimonials.**
- Prices render as *"Price available on ordering partner"*; hours are omitted pending owner confirmation.
- Every image is labelled concept imagery in alt text and [`MEDIA_PLAN.md`](./MEDIA_PLAN.md); nothing is claimed to depict the real Maosaji premises.
- `noindex,nofollow` meta + `X-Robots-Tag` header + `robots.txt` disallow; the private-concept disclaimer appears in the hero, footer and legal pages.

## Rebranding for another restaurant

1. Edit `src/config/restaurant.ts` (name, city, eyebrow, locations, ordering links, theme)
2. Edit `src/lib/seed-data.ts` (menu, demo content)
3. Replace `public/images/` with real photography
4. Run `bun run db:push` against a fresh database

No component rewrites are required — the DB schema and components are brand-agnostic.

## Production checklist (before any public launch)

- [ ] Replace all concept imagery with owner-approved photography/film
- [ ] Owner confirms phone numbers, hours, story and any claims
- [ ] Swap demo passcode for real auth; wire Supabase (or keep SQLite for single-operator use)
- [ ] Legal review of privacy/terms/disclaimer
- [ ] Remove `noindex`/`X-Robots-Tag` **only** at authorized launch

---

*Private concept prepared for Maosaji. Not the official Maosaji website. No affiliation with or endorsement by Maosaji is implied. Ordering partner names and links belong to their respective owners.*
