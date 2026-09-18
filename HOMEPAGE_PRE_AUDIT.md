# HOMEPAGE_PRE_AUDIT.md — Maosaji Restaurant Platform

**Date:** 2026-09-18 (Asia/Kolkata)
**Scope:** Homepage only (`src/app/(site)/page.tsx` + `src/components/site/cinema/*`). Inner pages intentionally out of scope.
**Live:** https://maosaji-restaurant-platform.vercel.app/ · local preview via the right-hand Preview Panel (gateway `localhost:81`).

## Current homepage structure (before)

```
01  FilmHero              — 6-shot film crossfade + Ken Burns, "Maosaji" wordmark
02  BrandStatement        — "One name. Many cravings." + 4 food cutouts + stats (02/29+/04)
03  EatChapter            — 4 categories, desktop sticky crossfade rail (copy 58% / media 42%)
04  SweetChapter           — dark espresso, macro mithai, drift rail
05  BakeryChapter         — cream, 2 images (wide+tall)
06  Offer section         — "Festive gifting, made easy" (DB-driven, sits awkwardly before menu)
07  MenuDiscovery         — "What are you craving?" search + 8 featured cards
08  CelebrateChapter      — "More than a meal." Beyond-the-table, packing image
09  LocationsChapter      — "Two outlets. One city." SVM + Mangla alternating
10  StoryChapter          — "A familiar name in Bilaspur." + 2 images + "intentionally unwritten" note
11  FinalCta              — "What are you craving?" + 3 faint bordered boxes over chai still
```

**Mobile (390px) scroll length:** ~15,263px ≈ 20 screens.

## Audit findings

### Excessive whitespace / weak hierarchy
- **02 BrandStatement**: the stats row (`02 Outlets / 29+ Dishes / 04 Kitchens`) is unsupported and adds vertical height without meaning.
- **03 EAT**: grid ratio is copy-58% / media-42% — the sticky visual is too small for the section's weight; large empty cream gaps beside the sticky rail. Per-category `lg:py-14` padding is generous.
- **05 BAKERY**: only 2 images, large cream void; feels weaker than EAT/SWEET.
- **06 MenuDiscovery**: `mt-10` heading→search gap and `mt-12` search→results gap feel loose; the transition from brand→utility isn't tight.
- **08 LOCATIONS**: `space-y-20 sm:space-y-28` between outlets + `py-24 sm:py-32` makes the section very tall.
- **09 STORY**: the "intentionally unwritten" developer note breaks immersion; the second small kitchen-overlap image adds height for little value.
- **10 FinalCta**: `py-28 sm:py-40` + faint low-contrast boxes → the ending feels weak, not appetising.

### Low contrast
- **08 LOCATIONS**: "Order from here" and "Outlet details" use `quiet-link` (faint small-caps) — barely look interactive.
- **10 FinalCta**: the 3 action boxes are `border-parchment/15 bg-espresso/40 backdrop-blur-sm` — "nearly invisible bordered boxes" per the brief.

### Unsupported claims (P0 copy)
- `brand-statement.tsx:23` — "One kitchen · every craving" eyebrow
- `brand-statement.tsx:39` — "one familiar roof in Bilaspur, two counters, and a menu that runs from breakfast dosa to celebration cake"
- `brand-statement.tsx:47` — `["29+", "Dishes on the menu"]` stat (also `02 Outlets`, `04 Kitchens` in the same dl)
- `sweet-chapter.tsx:82` — "Mithai made the slow way — set in trays, cut by hand, finished with silver leaf and crushed pistachio."
- `menu-discovery.tsx:201` — "Availability and outlets update live from the kitchen."
- `eat-chapter.tsx:93` — "Plated hot, through the day."
- `sweet-chapter.tsx:21` rail note — "still warm" (freshness claim)
- `eat-chapter.tsx:23` — "fresh rotis"; `:30` — "steamed to order" / "off the griddle" (process/timing claims)
- `bakery-chapter.tsx:29` — "Soft, fresh and quietly indulgent"

### AI image artifacts
- **VLM-scanned all 16 homepage images** (sweet: sweet-tall/wide + 4 rail; brand: 4 cutouts; bakery: 2; celebrate: 2; final: 1): **NO generated text, fake handwriting, product-name-in-photo, fake logos, malformed utensils, or suspicious hands found in any image.** No replacements needed on artifact grounds.

### Repetitive price copy
- `menu-discovery.tsx:156` — `<PriceTag>` under every card; since all prices are unverified (null), every card prints "Price available on ordering partner" — repetitive.

### Section-order / pacing
- The **Offer ("Festive gifting")** sits between BAKERY and the menu — breaks the EAT→SWEET→BAKERY→MENU flow. Should move into BEYOND THE TABLE.
- Final CTA heading repeats the menu-discovery heading ("What are you craving?") — intentional callback but the weak box execution undermines it.

### Mobile-first (390px)
- Hero portrait crops ✓. EAT/SWEET/BAKERY stack vertically ✓. No horizontal overflow observed.
- Hamburger + bottom nav working (regression-tested each round).
- The stats row, "intentionally unwritten" note, and faint CTAs all read worse on a small screen.

## Plan (executed in HOMEPAGE_REDESIGN_REPORT.md)
1. P0: remove all unsupported claims (listed above).
2. P0: no AI-artifact images to replace (verified clean).
3. P0: preserve mobile nav + low-bandwidth hero (connection-aware FilmFrames already shipped).
4. P1: rebuild intro (remove stats, tighten "One name. Many cravings.").
5. P1: EAT — flip ratio to copy-42%/media-58%, neutralise copy, cut padding, remove visible "Concept imagery" label.
6. P1: BAKERY — redesign to 1 large + 2 small crops, bright/clean, neutral copy.
7. P1: tighten menu-discovery (closer gaps, "View item" instead of repeated price copy, curated 8 incl. a sweet).
8. P1: move Offer into CelebrateChapter (BEYOND THE TABLE); add Gifting action; stronger heading.
9. P1: LOCATIONS — "Two places. One Maosaji.", add View menu, higher-contrast CTAs, less padding.
10. P1: STORY — compress, remove dev note, one image.
11. P1: FINAL CTA — high-contrast 3 actions (MENU / ORDER ONLINE / FIND MAOSAJI), less dead space.
12. P2: motion stays at 5 signature moments (hero, intro cutouts, EAT sticky, SWEET drift, final CTA parallax); everything else simple Reveal opacity+y.
13. Target: ~15–25% scroll-length reduction on mobile (≈11,500–13,000px from 15,263px).
