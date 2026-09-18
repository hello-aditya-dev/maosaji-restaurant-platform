# LOW_BANDWIDTH_QA.md — Maosaji Low-Bandwidth / Throttled-Mobile QA

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata
**Test environment:** `agent-browser @390px` through the `localhost:81` Caddy gateway to the Next.js dev server.

---

## 1. Important honesty note about throttled-Lighthouse

**Chrome DevTools network throttling (Fast 3G / Slow 4G) and Lighthouse were NOT measured in this pass.** The `agent-browser` headless browser available in this environment does not expose DevTools network-condition emulation or a Lighthouse runner. As a result, no Lighthouse Performance / Accessibility / Best-Practices / SEO scores were captured.

**Recommendation to the owner / demo operator:** before the live owner demo, run a throttled rehearsal using Chrome DevTools (Lighthouse → Mobile → Simulated Fast 3G) against both `localhost:81` and the Vercel preview URL. Record LCP / CLS / INP and re-confirm the architectural claims below. Mark any item that fails the rehearsal as a release blocker.

The rest of this document describes the **architectural resilience measures** that make the site usable on slow connections, and marks each release-gate item honestly as **PASS-by-architecture** or **NOT-MEASURED**.

---

## 2. Architectural resilience measures (engineered for slow links)

| # | Measure | Implementation | Why it helps on slow links |
|---|---|---|---|
| 1 | **Server-rendered React Server Components** | Homepage and menu are RSC; the browser receives ready HTML, not a client-side bundle that must execute before content appears. | First paint is the server HTML; no white-screen-then-app-boot pattern. |
| 2 | **Cached seed (Prisma/SQLite + `seededSuccessfully` short-circuit)** | `ensureSeeded()` in `src/lib/seed-data.ts` was rewritten with a module-level `Promise` chain serialising concurrent callers + a `seededSuccessfully` short-circuit so repeat visits skip all `count` queries. | The server's first action is no longer "do N count queries then seed then serve" — it's "serve from the already-seeded DB". |
| 3 | **Menu API is `force-dynamic` but reads from cached seed** | `export const dynamic = "force-dynamic"` on `/menu` ensures admin availability changes reflect immediately, but the underlying read is a single Prisma query against the seeded DB. | The menu page never re-queries per keystroke; search/filter is client-side after the initial load. |
| 4 | **Client-side menu search after initial load** | `MenuExperience` filters items in-memory after the server sends them; `?q=` is a deep-link from the homepage but the search itself is local. | No per-keystroke network round-trips; the user can type fast on a slow link without waiting. |
| 5 | **Connection-aware FilmFrames (hero)** | `src/components/site/cinema/film-frames.tsx` checks `navigator.connection.saveData === true` or `effectiveType` is `slow-2g`/`2g`, and `prefers-reduced-motion`. On any of those, it renders only the first (priority) frame as a static poster — skipping the crossfade. | On a slow link, the hero never tries to crossfade to a not-yet-loaded frame; no mid-crossfade gap appears. The hero rotation the owner likes remains on fast connections. |
| 6 | **`next/image` responsive delivery** | Hero first frame is `priority` (poster-equivalent LCP). Below-fold images are `loading="lazy"`. `sizes` hints per layout. | The browser fetches only the resolution it actually needs; no 3000px desktop images sent to phones. |
| 7 | **`IntersectionObserver` pause offscreen** | FilmFrames pauses when the hero scrolls substantially out of view. | The crossfade engine doesn't keep doing work (and the browser doesn't keep the unused frames hot) once the user has scrolled past. |
| 8 | **`visibilitychange` pause when tab hidden** | FilmFrames pauses crossfading when the tab is hidden. | Background tabs don't continue consuming bandwidth or CPU. |
| 9 | **Form-value preservation on network failure** | `EnquiryFormShell` does NOT call `form.reset()` in the `catch` block. All field values are retained. | A user who fills out a long bulk-order enquiry and hits a flaky link doesn't lose their input. |
| 10 | **Network-failure error wording aligned to the prompt** | Error message surfaces exactly: `We couldn't send this yet. Check your connection and try again.` | Honest, calm, retry-friendly wording; the submit button is re-enabled for retry. |
| 11 | **No video bytes shipped** | The hero "video" is built from 9 graded stills (6 landscape + 3 portrait derivatives) with a crossfade + Ken Burns engine. Zero video bytes. | A real `<video>` would be megabytes; this is ~1.2MB total for all 9 hero stills (see `PERFORMANCE_REPORT.md`). |
| 12 | **Image graceful degradation** | Cards without a matching item image degrade to a cream background + alt text. | A missing or broken image doesn't break the card layout or produce a broken-image icon. |

---

## 3. Release-gate items (low-bandwidth lens)

| # | Release-gate item | Status | Evidence |
|---|---|---|---|
| 1 | Homepage visible on slow link | **PASS-by-architecture** | RSC + cached seed + `seededSuccessfully` short-circuit (Finding 1 fix). First-paint is the server HTML. |
| 2 | Nav works on slow link | **PASS-by-architecture** | Mobile hamburger is pure client interaction; no network calls to open/close. |
| 3 | Hero poster appears (no blank/black box) | **PASS-by-architecture** | FilmFrames `staticMode` on `saveData` / `2g` / reduced-motion renders the first priority frame; never a blank box. |
| 4 | Menu reachable on slow link | **PASS-by-architecture** | Menu page is a single server render + single DB read; subsequent search is client-side. |
| 5 | Search works on slow link | **PASS-by-architecture** | Client-side filtering — no per-keystroke server requests. |
| 6 | Location switching works on slow link | **PASS-by-architecture** | Outlet filter is client-side on the already-loaded item list. |
| 7 | Order links work on slow link | **PASS-by-architecture** | Order Online CTA links to verified Zomato / Swiggy URLs (external — bandwidth is on those platforms). |
| 8 | Forms usable on slow link | **PASS-by-architecture** | Values preserved on failure; retry wording aligned; submit re-enabled. |
| 9 | No white screen | **PASS-by-architecture** | RSC server-rendered HTML on first paint. |
| 10 | No stuck spinner | **PASS-by-architecture** | No loading spinners anywhere on the homepage; queries resolve from cached seed. |
| 11 | No massive layout shift | **PASS-by-architecture** | Hero has a fixed aspect (92svh); below-fold images use explicit aspect ratios; AnimatePresence opacity transitions (not layout shifts). |

---

## 4. Honest measurement gap

| Item | Status |
|---|---|
| Lighthouse Performance score (Mobile, Simulated Fast 3G) | **NOT-MEASURED** — no Lighthouse runner available via `agent-browser` in this environment |
| Lighthouse Accessibility score | NOT-MEASURED (a11y verified functionally, not scored) |
| Lighthouse Best-Practices score | NOT-MEASURED |
| Lighthouse SEO score | NOT-MEASURED |
| LCP (Largest Contentful Paint) numeric value | NOT-MEASURED — first hero frame is `priority` (poster-equivalent LCP target); actual numeric LCP not captured |
| CLS (Cumulative Layout Shift) numeric value | NOT-MEASURED — architectural layout-shift prevention in place (explicit aspect ratios, no late-loading layout drivers); numeric CLS not captured |
| INP (Interaction to Next Paint) numeric value | NOT-MEASURED — client-side menu search/filter, focus trap, and Escape handler are all synchronous and small; numeric INP not captured |

---

## 5. Recommendation

1. **Owner demo rehearsal:** before the live owner demo, run Chrome DevTools → Lighthouse → Mobile → Simulated Fast 3G against `localhost:81` and the Vercel preview URL. Record the four Lighthouse scores and LCP/CLS/INP.
2. **If a throttled item fails the rehearsal:** treat as a release blocker; fix before live demo.
3. **If the throttled rehearsal passes:** upgrade the corresponding items from `PASS-by-architecture` to `PASS-measured` in `FINAL_DEMO_QA.md`.
