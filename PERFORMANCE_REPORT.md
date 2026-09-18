# PERFORMANCE_REPORT.md — Maosaji Performance & Media Budget

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata
**Test environment:** `agent-browser @390px` through the `localhost:81` Caddy gateway to the Next.js dev server. **Lighthouse was not run in this pass.**

---

## 1. Honesty note

**No Lighthouse run was performed in this pass.** The `agent-browser` headless browser available in this environment does not expose a Lighthouse runner or DevTools network throttling.

The numbers below are **measured asset sizes on disk** (real file sizes in `public/images/`) plus **architectural facts** (no video bytes, `next/image` responsive delivery, etc.). They are not Lighthouse scores. LCP / CLS / INP are stated as **targets**, not measured values.

For the recommended throttled rehearsal, see `LOW_BANDWIDTH_QA.md` §5.

---

## 2. Hero film images — measured sizes on disk

All hero film stills live in `public/images/film/`. The "film" engine is `src/components/site/cinema/film-frames.tsx` — a crossfade + Ken Burns treatment of graded stills. **Zero video bytes shipped.**

| File | Size (bytes) | Used on |
|---|---:|---|
| `film-1-thali.jpg` | 158 KB | Landscape hero frame 1 (priority first frame / poster) |
| `film-1-thali-p.jpg` | 201 KB | Portrait derivative for mobile |
| `film-2-dosa.jpg` | 93 KB | Landscape hero frame 2 |
| `film-2-dosa-p.jpg` | 154 KB | Portrait derivative for mobile |
| `film-3-mithai.jpg` | 138 KB | Landscape hero frame 3 |
| `film-3-mithai-p.jpg` | 140 KB | Portrait derivative for mobile |
| `film-4-garnish.jpg` | 120 KB | Landscape hero frame 4 (desktop only) |
| `film-5-bakery.jpg` | 100 KB | Landscape hero frame 5 (desktop only) |
| `film-6-box.jpg` | 106 KB | Landscape hero frame 6 (desktop only) |
| **Total (all 9)** | **≈ 1.2 MB** | — |

**Per-image range:** ~93 KB to ~201 KB — practical web budget.

**Portrait derivatives:** only 3 portrait frames exist (for hero frames 1–3 — the most prominent mobile views). Frames 4–6 are landscape-only on desktop; mobile never receives a squashed desktop crop because the `film-frames.tsx` engine chooses the appropriate derivative via `next/image` `media` breakpoints and below-`sm` portrait logic.

---

## 3. Item images — measured count and per-image budget

| Family | Path | Count | Per-image size | Notes |
|---|---|---:|---|---|
| Item photography | `public/images/items/*.jpg` | **31** | ~50–150 KB each | Used on `/menu`, `/sweets`, `/bakery`, and the homepage menu-discovery section. |

Cards without a matching item image degrade gracefully to a cream background + alt text (no broken-image icon).

**`next/image` responsive delivery:** all item images use `fill` + responsive `sizes` hints. The browser fetches only the resolution the layout actually needs. **No 3000px desktop image is sent to a phone.**

---

## 4. No-video strategy

The hero is **not** a `<video>`. It is `FilmFrames` (`src/components/site/cinema/film-frames.tsx`) — a crossfade engine over 9 graded stills (6 landscape + 3 portrait derivatives).

| Property | Value |
|---|---|
| Video bytes shipped | **0 bytes** |
| Total hero media weight (all 9 stills) | ≈ 1.2 MB |
| LCP element | First hero film frame (next/image `priority` = poster-equivalent) |
| Crossfade behaviour (fast link) | Crossfade + Ken Burns — the rotation the owner likes |
| Crossfade behaviour (slow link) | `staticMode`: renders only the first priority frame; no mid-crossfade gap |
| `staticMode` triggers | `prefers-reduced-motion` OR `navigator.connection.saveData === true` OR `navigator.connection.effectiveType` is `slow-2g`/`2g` |
| Offscreen behaviour | `IntersectionObserver` pauses the crossfade when the hero scrolls substantially out of view |
| Tab-hidden behaviour | `visibilitychange` listener pauses the crossfade |
| Mobile aspect handling | Portrait derivatives below `sm`; never a squashed desktop crop |

---

## 5. Data-layer performance (DEMO_MODE)

| Mechanism | Implementation | Effect |
|---|---|---|
| `seededSuccessfully` short-circuit | `src/lib/seed-data.ts` rewritten with a module-level `Promise` chain serialising concurrent callers + a `seededSuccessfully` flag that short-circuits all `count` queries on repeat visits | After the first request, no count queries run on subsequent requests; the DB is already seeded. |
| Per-table `P2002` swallow | Each seed table's `createMany` is wrapped in a `try/catch` that silently swallows the `P2002` (unique-constraint) error. | Residual concurrent-seed races no longer crash the homepage. |
| `force-dynamic` menu route | `/menu` page exports `dynamic = "force-dynamic"`. | Admin availability changes reflect immediately on the public menu. |
| Reads from cached seed | The menu route calls `getProvider().getMenuItems()` which queries the seeded SQLite DB. | A single Prisma read; no per-keystroke server requests. |
| Client-side search | `MenuExperience` filters items in-memory after the server sends them. | No network round-trips while the user types. |

---

## 6. Lighthouse / Core Web Vitals — targets (NOT measured)

| Metric | Target | Status this pass |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s on Fast 3G mobile (target; first hero frame is `priority`) | NOT-MEASURED |
| CLS (Cumulative Layout Shift) | ≤ 0.1 (target; explicit aspect ratios + AnimatePresence opacity transitions) | NOT-MEASURED |
| INP (Interaction to Next Paint) | ≤ 200ms (target; client-side search, focus trap, Escape handler are all small synchronous operations) | NOT-MEASURED |
| Lighthouse Performance | Target ≥ 90 (Mobile) | NOT-MEASURED |
| Lighthouse Accessibility | Target ≥ 95 (functional a11y verified — see `MOBILE_NAV_QA.md`) | NOT-MEASURED |
| Lighthouse Best-Practices | Target ≥ 95 | NOT-MEASURED |
| Lighthouse SEO | Target ≥ 90 (noindex present by design — scores will reflect the noindex deliberately) | NOT-MEASURED |

---

## 7. Lint and build status (verified)

| Check | Command | Result | Notes |
|---|---|---|---|
| Lint | `bun run lint` | **exit 0** | Zero problems. Verified this pass. |
| Production build | `next build` | **exit 0** (37 routes) | Verified in a prior pass under simulated Vercel conditions. Not re-run this pass to avoid killing the dev server. |

---

## 8. Summary

- **Asset sizes are real** (1.2 MB total hero / 9 stills each ~100–200 KB; 31 item images each ~50–150 KB).
- **The no-video strategy** eliminates the largest possible source of mobile bandwidth waste.
- **The data layer** is cached server-side via Prisma + the `seededSuccessfully` short-circuit; the menu route is force-dynamic but reads from the cached seed.
- **The form** preserves all field values on network failure and re-enables the submit button with the exact prompt wording `We couldn't send this yet. Check your connection and try again.`.
- **Lighthouse / LCP / CLS / INP were NOT measured in this pass.** The values in §6 are targets. A throttled rehearsal is recommended before the live owner demo (see `LOW_BANDWIDTH_QA.md` §5).
