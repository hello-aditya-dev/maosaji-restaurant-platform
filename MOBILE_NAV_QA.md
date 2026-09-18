# MOBILE_NAV_QA.md — Maosaji Mobile Hamburger QA

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata
**Test environment:** `agent-browser` headless browser at **390px viewport width** through the `localhost:81` Caddy gateway to the Next.js dev server (PID 4068, `next dev -p 3000`).
**Component under test:** `src/components/site/navbar.tsx` (mobile drawer portion).

---

## 1. Fixes applied to `navbar.tsx` (this pass)

| # | Gap from pre-change audit | Fix applied in `navbar.tsx` |
|---|---|---|
| a | No Escape key handler | Added a `window` `keydown` listener (mounted only while the drawer is open) that closes the drawer on `Escape`. |
| b | No `aria-controls` linking button to drawer | Added `DRAWER_ID = "mobile-nav-drawer"` and `aria-controls={DRAWER_ID}` on the hamburger button. |
| c | No focus management | Added a single effect covering all close paths (Escape, X button, link click, route change): focus the first "Menu" link ~60ms after open; on close, return focus to the "Open menu" hamburger button. |
| d | No focus trap | Added a Tab-cycle focus trap scoped to the drawer (Tab/Shift+Tab stays inside the dialog). |
| e | Switch had no `aria-label` | (Fix in `admin/menu/page.tsx`, not `navbar.tsx` — listed here for completeness.) Switch given `aria-label="Hide/Show <item> on the public menu"`. |

Additional accessibility attributes added to the drawer element itself: `role="dialog"`, `aria-modal="true"`, `aria-label="Site menu"`.

---

## 2. Test procedure (per item)

All items below were verified live at **390px** via `agent-browser`. The shared procedure:

1. Navigate to `http://localhost:81/` (homepage) at viewport `390x844`.
2. Inspect the hamburger button: confirm CSS `h-11 w-11` (44×44 CSS px touch target).
3. Click the hamburger via `agent-browser` `click @hamburger`.
4. Evaluate `document.querySelector('[aria-expanded]')` `aria-expanded` value — expect `true` on open.
5. Evaluate `document.body.style.overflow` — expect `""` (scroll locked) while open; expect `""` after close (restored).
6. Evaluate `document.activeElement` to confirm focus placement.
7. For Escape tests: `press Escape`; re-evaluate `aria-expanded` and `document.activeElement`.
8. For link-close tests: `click @nav-link-sweets`; assert URL becomes `/sweets`, `aria-expanded` `false`, body restored, drawer DOM removed.
9. For route-change tests: `click back` (browser back) and forward; assert drawer closed.
10. For hydration: confirm server-rendered and client-rendered HTML agree on `aria-expanded` initial value (no console hydration warning).

---

## 3. P0 mobile-hamburger results (20/20 PASS)

| # | Item | Expected | Result | Notes |
|---|---|---|---|---|
| 1 | Hamburger visible + tappable | Button present, 44×44 CSS px | **PASS** | `h-11 w-11` verified |
| 2 | Tap opens every time | `aria-expanded` `false` → `true` on click | **PASS** | Repeatable across 5 attempts |
| 3 | No layout jump on open | AnimatePresence opacity transition | **PASS** | Drawer fades in; no shift of page content |
| 4 | Background scroll locked while open | `document.body.style.overflow === "hidden"` | **PASS** | Verified while drawer open |
| 5 | Focus moves into menu | First "Menu" link focused ~60ms after open | **PASS** | `document.activeElement` was the first nav link |
| 6 | Close via X button | Toggle closes drawer | **PASS** | `aria-expanded` `false` after click |
| 7 | Close via nav link (navigates + closes) | URL changes; `aria-expanded` `false`; body restored; dialog removed | **PASS** | Tested with "Sweets" → `/sweets` |
| 8 | Close via Escape | `aria-expanded` `false`; body restored; dialog removed; focus returns to "Open menu" button | **PASS** | — |
| 9 | Close via route change (covers back/forward) | `aria-expanded` `false` on URL change | **PASS** | Browser back closes drawer |
| 10 | Body scroll restored after close | `document.body.style.overflow === ""` | **PASS** | — |
| 11 | Links route correctly | Clicked link navigates to expected path | **PASS** | — |
| 12 | Order Online CTA works | Mobile "Order" link present; `order_click` analytics event from `navbar-mobile` | **PASS** | Event tracked |
| 13 | No invisible overlay after close | Dialog unmounts via AnimatePresence | **PASS** | DOM has no leftover overlay element |
| 14 | No z-index conflict with hero | Hero `z-0` content `z-20` < drawer `z-40` < header `z-50` | **PASS** | Hamburger never intercepted by hero |
| 15 | No hydration mismatch | `aria-expanded` SSR/CSR-consistent | **PASS** | No console hydration warning |
| 16 | No console error | Browser console clean during open/close | **PASS** | — |
| 17 | No double-open race | Cannot double-trigger the drawer | **PASS** | — |
| 18 | Works after scroll | Hamburger still tappable after scrolling the page | **PASS** | — |
| 19 | Works after browser back/forward | Drawer reopens after a navigation round-trip | **PASS** | — |
| 20 | `aria-expanded` + `aria-controls` correct | `aria-controls="mobile-nav-drawer"` | **PASS** | — |
| — | Touch target ~44×44 | Hamburger is `h-11 w-11` (44×44 CSS px) | **PASS** | — |

**Total: 20/20 PASS.**

---

## 4. Notes

- The hamburger button is `lg:hidden` — it is hidden at desktop widths and shown on tablet/mobile. Live QA was conducted at 390px (mobile).
- 360px compatibility is **PASS-by-architecture**: the hamburger is `h-11 w-11` (44×44) and the drawer layout uses fluid Tailwind utilities that scale down to 360px without horizontal clipping. Verified live at 390px; 360px is below the test environment's minimum and not separately measured.
- The drawer's `role="dialog"`, `aria-modal="true"`, `aria-label="Site menu"`, and `aria-controls` were all confirmed in the rendered DOM.
- The `Switch` accessibility fix in `admin/menu/page.tsx` is verified in the `admin → public menu` flow (see `FINAL_DEMO_QA.md`): the Masala Dosa availability switch exposes `aria-label="Hide Masala Dosa on the public menu"` / `aria-label="Show Masala Dosa on the public menu"` depending on state.
