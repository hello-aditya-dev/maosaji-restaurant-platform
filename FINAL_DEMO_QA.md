# FINAL_DEMO_QA.md — Maosaji Private Concept — Final Demo QA Summary

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata
**Test environment:** `agent-browser @390px` through the `localhost:81` Caddy gateway to the Next.js dev server. Lighthouse was not run in this pass.

---

## 1. Final handoff

| Field | Value |
|---|---|
| **DEPLOYED URL** | https://maosaji-restaurant-platform.vercel.app/ (existing). Local preview via the right-hand Preview Panel / Open in New Tab on `localhost:81`. |
| **ADMIN URL** | `/admin` (passcode `demo2026`). Cookie session; 12h expiry. |
| **FINAL DEMO STATUS** | **READY** |

---

## 2. Final PASS/FAIL summary

| Item | Expected | Result | Evidence |
|---|---|---|---|
| MOBILE HAMBURGER | Tap-to-toggle + Escape + aria + focus management | **PASS** | `MOBILE_NAV_QA.md` — 20/20 PASS at 390px |
| 360px | Hamburger is 44×44 + `lg:hidden`; fluid utilities scale to 360px | **PASS (by architecture)** | Hamburger is `h-11 w-11`; verified live at 390px; 360px below the test env minimum, not separately measured |
| 390px | Live QA at 390px | **PASS** | All P0 items verified live at 390px |
| THROTTLED MOBILE | Server-rendered RSC + cached seed + connection-aware hero poster + form-value preservation | **PASS-by-architecture** | `LOW_BANDWIDTH_QA.md` — Lighthouse NOT measured in this pass; throttled rehearsal recommended before live demo |
| HERO FALLBACK | FilmFrames `staticMode` on `saveData` / `2g` / reduced-motion; first frame `priority` = poster; never a blank/black box | **PASS** | `PERFORMANCE_REPORT.md` §4; `VISUAL_QA_REPORT.md` §2 |
| SVM DATA | ~49 items, Thali/South Indian/North Indian/Chinese/Chaat/Namkeen/Dry Fruits emphasis | **PASS** | `REALITY_PASS_REPORT.md` §3.1 — 25 SVM-tagged + 24 both = 49 |
| MANGLA DATA | ~61 items, Sweets/Bakery/Cakes/Cookies/Drinks/Coffee/Shakes emphasis | **PASS** | `REALITY_PASS_REPORT.md` §3.1 — 37 Mangla-tagged + 24 both = 61 |
| OUTLET SWITCHING | SVM 4 thalis vs Mangla 1; Mangla 7 cakes; Mangla kaju→Kaju Katli | **PASS** | `REALITY_PASS_REPORT.md` §3.2–3.4 |
| MENU SEARCH | Client-side; no per-keystroke server requests; `?q=` deep-link from homepage | **PASS** | `LOW_BANDWIDTH_QA.md` §2 #4; `PERFORMANCE_REPORT.md` §5 |
| BULK → ADMIN | Bulk order enquiry appears in admin tagged LIVE | **PASS** | Submitted `BO-2026-0004` at `/bulk-orders` @390px; admin login `demo2026` → `/admin/enquiries` shows `BO-2026-0004` tagged `BULK LIVE`, status `NEW` |
| ADMIN → PUBLIC MENU | Admin availability toggle reflects on public `/menu` immediately | **PASS** | `/admin/menu` Masala Dosa switch `aria-checked=true` → toggle OFF `aria-checked=false` (label `Show Masala Dosa on the public menu`); public `/menu` Masala Dosa card → `Unavailable` badge + grayscale + opacity-60; toggled back ON; `/menu` restored |
| BUILD | Lint exit 0; prior pass `next build` exit 0, 37 routes | **PASS** | `bun run lint` exit 0 verified this pass; `next build` exit 0 / 37 routes verified in prior pass (not re-run this pass to avoid killing the dev server) |
| LIGHTHOUSE / PERFORMANCE | Actual asset sizes recorded; Lighthouse NOT measured in this pass | **PASS** (assets) / **NOT-MEASURED** (Lighthouse) | Hero film 1.2MB total / 9 images, each 100–200KB; 31 item images each 50–150KB; see `PERFORMANCE_REPORT.md` |
| REAL SVM ITEMS SEEDED | 49 (25 SVM-tagged + 24 both) | **PASS** | `REALITY_PASS_REPORT.md` §2 |
| REAL MANGLA ITEMS SEEDED | 61 (37 Mangla-tagged + 24 both) | **PASS** | `REALITY_PASS_REPORT.md` §2 |
| UNSUPPORTED CLAIMS REMOVED | None present | **PASS** | Prior passes already enforced data-honesty; this pass added outlet-specific real product names; all prices null; all descriptions neutral |
| OWNER CONFIRMATION REQUIRED | Hours, prices, master menu, official phones, domain ownership, brand history, founder, social accounts, catering/custom-cake capability | (Open items, not blockers for the demo) | `OWNER_CONFIRMATION_REQUIRED.md` |

---

## 3. Unresolved issues

1. **GitHub push of this pass's changes requires a fresh PAT.** The supplied token works for clone but may be auto-revoked for push by GitHub secret scanning. (Prior pass pushed successfully with a one-time inline token; a fresh token will be needed for any new push.)
2. **Lighthouse / throttled-mobile numbers NOT measured.** Recommend running Chrome DevTools → Lighthouse → Mobile → Simulated Fast 3G against `localhost:81` and the Vercel preview URL before the live owner demo.
3. **Production launch needs owner-supplied photography.** All imagery in the demo is concept imagery (see `MEDIA_PROVENANCE.md`); owner-supplied photography is required before any public launch.

---

## 4. Owner-confirmation open items (not blockers for the private demo)

See `OWNER_CONFIRMATION_REQUIRED.md` for the full list. Summary by group:

- **BRAND** — official spelling, logo files, colour palette, brand history, founder, tagline.
- **LOCATIONS** — full outlet list, "Link Road Cake & Bake" relationship (open question, NOT a third outlet without owner confirmation), official phones, verified hours, Google Maps Place IDs.
- **MENU** — master menu, prices, outlet availability, bestsellers, seasonal items, veg/Jain/allergen info, item photography.
- **SERVICES** — catering, wedding orders, corporate gifting, bulk orders, custom cakes, direct delivery, restaurant bookings.
- **DIGITAL** — domain ownership (`maosajisvm.com` / `maosajisweets.com`), registrar access, official social accounts, Google Business Profile, Zomato/Swiggy listing management.
- **OPERATIONS** — who handles menu changes, who handles enquiries, admin roles, POS/order systems, notification channels.
- **MEDIA** — original brand photography, outlet photography, logo files, photo/video shoot permission, brand film, founder/team interview.

Two top-line honesty flags remain until owner confirmation:

- ⚠️ All hours are UNCONFIRMED — UI shows `Hours to be confirmed for production`.
- ⚠️ All prices are UNVERIFIED — UI shows `Price available on ordering partner`.

---

## 5. Final demo status

**READY.**

Every P0 release-gate item passes. The throttled-mobile and Lighthouse items are **PASS-by-architecture** (not measured in this pass); they should be rehearsed before the live owner demo using Chrome DevTools Lighthouse (Mobile, Simulated Fast 3G) against both `localhost:81` and the Vercel preview URL.
