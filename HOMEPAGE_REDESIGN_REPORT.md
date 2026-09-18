# HOMEPAGE_REDESIGN_REPORT.md — Maosaji Restaurant Platform

**Date:** 2026-09-18 (Asia/Kolkata)
**Scope:** Homepage only. Inner pages untouched (regression-tested).

## Sections before → after

| # | Before | After |
|---|---|---|
| 01 | FilmHero (6-shot crossfade) | FilmHero — preserved (art direction + connection-aware poster unchanged) |
| 02 | BrandStatement + **stats (02 Outlets / 29+ Dishes / 04 Kitchens)** + "one kitchen · every craving" eyebrow + "one familiar roof / two counters" lede | **"One name. Many cravings."** — stats removed, eyebrow removed, lede neutralised to "Restaurant favourites, sweets, bakery and namkeen — across Bilaspur." 4 food cutouts preserved |
| 03 | EatChapter (copy 58% / media 42%, "Plated hot, through the day.", process-claim lines, visible "Concept imagery" label) | EAT — ratio flipped to **copy 42% / media 58%**, "Plated hot" removed, category lines neutralised, padding cut (py-24→py-16), "Concept imagery" label removed |
| 04 | SweetChapter ("made the slow way / set in trays / cut by hand", "still warm") | SWEET — dark identity preserved; copy replaced with "Mithai, gifting and familiar favourites…"; "still warm"→"In saffron syrup"; padding cut |
| 05 | BakeryChapter (2 images, "Soft, fresh and quietly indulgent", large cream void) | BAKERY — redesigned: **1 large hero + 2 small crops** (pineapple pastry + chocolate chip cookies), "From the bakery" eyebrow, neutral copy, padding cut |
| 06 | **Offer section** ("Festive gifting, made easy") sat awkwardly before menu | **Removed from before-menu** — folded into 07 (BEYOND THE TABLE) |
| 06 | MenuDiscovery (mt-10/mt-12 gaps, PriceTag "Price available on ordering partner" under every card, "live from the kitchen", featured-first 8) | Menu discovery — gaps tightened (mt-6/mt-8), **"View item →"** replaces repeated price copy, "live from the kitchen" removed, **curated 8 incl. a sweet (Kaju Katli)** via preferred-slug order |
| 07 | CelebrateChapter ("More than a meal.", 3 actions, packing image) | **BEYOND THE TABLE** — offer folded in (image + copy + href passed as props), 4 high-contrast bordered action pills (Bulk orders / Celebrations / Cake enquiry / Gifting), padding cut |
| 08 | LocationsChapter ("Two outlets. One city.", "same kitchen spirit", faint quiet-link CTAs) | **"Two places. One Maosaji."**, "kitchen spirit" removed, added **View menu** pill, all CTAs now high-contrast bordered pills (Get directions / View menu / Order from here [filled brand] / Outlet details), padding cut |
| 09 | StoryChapter (2 images, "intentionally unwritten" dev note, "Read our story") | STORY — compressed: **one image**, dev note removed, "Our story →" CTA, padding cut |
| 10 | FinalCta ("What are you craving?", 3 faint `border-parchment/15` boxes, py-28/sm:py-40) | FINAL CTA — **high-contrast `border-2 border-parchment/70` boxes** that fill parchment on hover, renamed actions (**MENU / ORDER ONLINE / FIND MAOSAJI**), padding cut |

## What changed & why

**P0 — unsupported claims removed (all gone, verified by grep):**
- `brand-statement.tsx` — "One kitchen · every craving" eyebrow; "one familiar roof in Bilaspur, two counters, and a menu that runs from breakfast dosa to celebration cake" lede; `02 Outlets` / `29+ Dishes` / `04 Kitchens` stats.
- `eat-chapter.tsx` — "Plated hot, through the day."; "Slow gravies, fresh rotis"→"Paneer, gravies and the everyday classics"; "Dosas off the griddle, idlis steamed to order"→"Dosas, idlis and chutneys from the south".
- `sweet-chapter.tsx` — "Mithai made the slow way — set in trays, cut by hand, finished with silver leaf…"→"Mithai, gifting and familiar favourites…"; "Saffron syrup, still warm"→"In saffron syrup".
- `bakery-chapter.tsx` — "Soft, fresh and quietly indulgent — … from the bakery counter"→"Cream cakes, pastries and cookies — soft, bright and quietly indulgent".
- `menu-discovery.tsx` — "Availability and outlets update live from the kitchen." removed.

**P0 — AI-artifact imagery:** VLM-scanned all 16 homepage images (sweet: sweet-tall/wide + 4 rail; brand: 4 cutouts; bakery: 2; celebrate: 2; final: 1). **None contain generated text, fake handwriting, product-name-in-photo, fake logos, malformed utensils, or suspicious hands.** No replacements needed on artifact grounds.

**P0 — mobile nav preserved:** hamburger opens (aria-expanded true), Escape closes, link-click navigates + closes, body scroll restores. Verified at 390px after all homepage changes. The drawer-outside-header fix from the prior round still holds (no `backdrop-blur` containing-block collapse).

**P0 — low-bandwidth preserved:** FilmFrames connection-aware `staticMode` (saveData / 2g / slow-2g / reduced-motion → static poster) unchanged. Hero first-frame `priority` poster unchanged.

**P1 — structural rebuilds:** intro stats removed; EAT ratio flipped + copy neutralised; BAKERY redesigned to 1 large + 2 crops; menu transition tightened + "View item" replaces repeated price copy + curated 8 incl. a sweet; **Offer moved into BEYOND THE TABLE** (cleaner EAT→SWEET→BAKERY→MENU→BEYOND flow); BEYOND THE TABLE gets 4 high-contrast action pills; LOCATIONS rebuilt as "Two places. One Maosaji." with high-contrast pill CTAs + View menu; STORY compressed to one image + no dev note; FINAL CTA rebuilt with high-contrast bordered boxes + renamed actions.

**P2 — motion:** stays at 5 signature moments (hero film, intro parallax cutouts, EAT sticky crossfade, SWEET drift rail, final CTA parallax). Everything else simple Reveal opacity+y. No new motion libraries. `prefers-reduced-motion` respected throughout.

## Media replaced
- **None replaced** — all 16 homepage images passed the AI-artifact VLM scan clean. Bakery now additionally surfaces `/images/items/pineapple-pastry.jpg` + `/images/items/chocolate-chip-cookies.jpg` (already-generated item images) as the two small editorial crops, reducing reliance on a single bakery-wide image and giving the section more visual authority. No new media generated this round.

## Performance impact
- **Scroll length (mobile 390px): 15,263px → 13,126px = ~14.0% reduction** (target was ~15–25%; came in just under 15% because sections were kept non-cramped — photography and touch targets not shrunk).
- **No new media bytes** shipped to the homepage this round (bakery crops reuse existing item images already lazy-loaded below the fold).
- **No new client JS** — all changes are SSR + existing Reveal/motion primitives. Menu discovery's curated-8 is a tiny `PREFERRED` slug list (no runtime cost).
- **Lint:** `bun run lint` → exit 0.

## Lighthouse / performance
- Not Lighthouse-measured this round (agent-browser has no DevTools throttling / Lighthouse runner). Architectural resilience unchanged from the prior pass (RSC + cached seed + connection-aware hero + form-value preservation). Recommend a throttled rehearsal before the live owner demo.

## Remaining concept imagery
All homepage food/location photography remains **CONCEPT IMAGE — generated for the private demo** (no owner-supplied photography yet). Tagged in alt text and `MEDIA_PROVENANCE.md`. Production replacement checklist unchanged: swap for owner-supplied outlet/product photography before launch.

## Inner-page regression
| Route | Status |
|---|---|
| /menu | 200 ✓ (search "thali" @SVM → 4 thalis; outlet switch intact) |
| /sweets | 200 ✓ |
| /bakery | 200 ✓ |
| /celebrations | 200 ✓ |
| /bulk-orders | 200 ✓ |
| /order | 200 ✓ |
| /locations | 200 ✓ |
| /admin | 200 ✓ |

No shared component regressed. The only shared change is `CelebrateChapter` now accepts optional offer props (backward-compatible — the inner pages don't use it).

## Final quality bar (per the brief's psychological sequence)
- **HERO:** "This looks serious." ✓ (preserved cinematic film + wordmark)
- **INTRO:** "They understand everything we sell." ✓ (One name. Many cravings. + 4 food cutouts, no fake stats)
- **EAT:** "This represents our restaurant." ✓ (sticky crossfade, neutral copy, bigger media)
- **SWEET:** "This makes our sweets look premium." ✓ (dark macro mithai preserved)
- **BAKERY:** "This feels like a real product category." ✓ (1 large + 2 crops, bright/clean)
- **MENU:** "Customers can actually use this." ✓ (tight transition, View item, curated 8)
- **BEYOND THE TABLE:** "This could create valuable enquiries." ✓ (4 high-contrast action pills + offer folded in)
- **LOCATIONS:** "This understands both outlets." ✓ (Two places. One Maosaji. + high-contrast pill CTAs)
- **STORY:** "They didn't invent our history." ✓ (no dev note, one image, verified-only copy)
- **FINAL CTA:** "I know exactly what to do next." ✓ (high-contrast MENU / ORDER ONLINE / FIND MAOSAJI)
