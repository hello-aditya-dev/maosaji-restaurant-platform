# PRE_CHANGE_AUDIT.md — Maosaji Private Concept

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata
**Audit scope:** State of `/home/z/my-project` immediately before the QA pass that produced Tasks 7's documentation. The audit was performed live via `agent-browser @390px` through the `localhost:81` Caddy gateway to the Next.js dev server, plus source-code inspection of the cloned Maosaji repo.

---

## 1. Project context (verified before the audit)

- **Source repo:** `github.com/hello-aditya-dev/maosaji-restaurant-platform` (private). Merged into `/home/z/my-project` over the base Next.js 16 template.
- **Existing live deployment:** `https://maosaji-restaurant-platform.vercel.app/`.
- **Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4 + shadcn/ui, Framer Motion, Zod, Prisma/SQLite, `next/image`.
- **Backend mode:** `DEMO_MODE` with Prisma + SQLite persistence (server-side, survives refresh AND across browsers). A `DataProvider` abstraction in `src/lib/data-provider/` can be swapped to Supabase without UI changes.
- **Private-demo safety (verified present):**
  - `noindex,nofollow` meta tag in root layout.
  - `X-Robots-Tag` header applied via `src/proxy.ts` (Next 16 convention; renamed from `middleware.ts`).
  - `public/robots.txt` with `Disallow: /`.
  - Footer disclaimer: `Private concept prepared for Maosaji. Not the official Maosaji website.`
  - No email / WhatsApp / SMS integration wired — no notifications ever sent to the restaurant.

- **Two verified outlets (from `02_VERIFIED_FACTS.json`):**
  - **SVM** — Srikant Verma Marg, Near Rama Magneto Mall, Telipara, Bilaspur. Public phone (as listed on Zomato): `+91 91525 49189`. Verified Zomato + Swiggy ordering URLs.
  - **Mangla** — Mangla Chowk, Mungeli Road, Bilaspur. Public phone (as listed on Zomato): `+91 91119 74447`. Verified Zomato + Swiggy ordering URLs.
- **Hours:** UNCONFIRMED — UI shows `Hours to be confirmed for production`.
- **Prices:** UNVERIFIED — UI shows `Price available on ordering partner`.

---

## 2. Pre-change audit findings (5 reliability/quality blockers found before fixes)

### Finding 1 — Homepage HTTP 500 on first load (concurrent-seed race)

- **Severity:** Reliability blocker — would fail the throttled-mobile release gate.
- **Root cause:** `src/lib/seed-data.ts` `ensureSeeded()` is invoked by multiple `data-provider` methods on a single homepage render (`getActiveOffers` + `getMenuItems`). Both observed `count === 0` and both fired `createMany` → Prisma `P2002` unique-constraint crash.
- **Symptom:** First-load `GET /` returned HTTP 500. Subsequent reloads (after a partial seed committed) sometimes succeeded — masking the bug.
- **Status before fix:** Open.

### Finding 2 — Dev server died on `next.config.ts` edit

- **Severity:** Developer-experience blocker — interrupted live QA mid-pass.
- **Root cause:** `package.json` `dev` script was `next dev -p 3000 2>&1 | tee dev.log`. When Next hot-restarted on `next.config.ts` edit, Next's hot-restart `SIGTERM` cascade-killed the `tee`-piped process tree. No restart loop; the dev server was simply dead until manually re-run.
- **Status before fix:** Open (dev server had to be restarted by hand after every config edit).

### Finding 3 — Mobile hamburger: accessibility gaps (functionality worked)

- **Severity:** Accessibility blocker (functional behaviour already worked — tap-to-toggle, body-scroll-lock, route-change-close, AnimatePresence unmount all confirmed working pre-fix).
- **Gaps found in `src/components/site/navbar.tsx`:**
  - (a) **No Escape key handler** — Escape did nothing; `aria-expanded` stayed `true` after pressing Escape while the drawer was open.
  - (b) **No `aria-controls`** linking the hamburger button to the drawer element.
  - (c) **No focus management** — focus fell to `<body>` on close; the user's tab position was lost.
  - (d) **No focus trap** — Tab key from inside the drawer escaped into the page background.
  - (e) **`Switch` had no `aria-label`** in `admin/menu/page.tsx` — the availability toggle was nameless on mobile (label hidden `sm:block`).
- **Status before fix:** Open.

### Finding 4 — All 27 seed menu items had `locationSlugs: []` (available at all outlets)

- **Severity:** Reality-pass blocker — outlet switching was cosmetic. The UI rendered different "filters" for SVM vs Mangla, but the underlying data showed the same items at both outlets, violating the data-honesty requirement that outlet-specific product range be reflected in the seed.
- **Status before fix:** Open.

### Finding 5 — FilmFrames had no connection-aware behaviour

- **Severity:** Low-bandwidth UX blocker — on a slow link the hero "video" (the crossfade engine built from graded stills; no actual video bytes shipped) would still attempt to crossfade to not-yet-loaded frames, producing a mid-crossfade gap.
- **Status before fix:** Open.

---

## 3. Items NOT in scope of this audit (already verified in prior passes)

- Lint (`bun run lint`) — verified exit 0 in a prior pass; not re-audited here.
- Production build (`next build`) — verified exit 0, 37 routes, in a prior pass; not re-run in this pass to avoid killing the dev server.
- Vercel zero-config deployability — verified in a prior pass under simulated Vercel conditions (no `.env`, `VERCEL=1`, type-check ON).
- Supabase provider implementation — out of scope (DEMO_MODE remains active; no Supabase credentials exist in this environment).

---

## 4. Follow-up

The five findings above are each addressed in the same QA pass that produced this document. Fixes and live-verified results are recorded in:

- `MOBILE_NAV_QA.md` (Finding 3 fixes + verification)
- `LOW_BANDWIDTH_QA.md` (Finding 5 fix + architectural resilience)
- `PERFORMANCE_REPORT.md` (asset sizes, no-video strategy)
- `REALITY_PASS_REPORT.md` (Finding 4 fix + outlet-specific results)
- `FINAL_DEMO_QA.md` (Finding 1 + 2 fixes summarised; final pass/fail table)
