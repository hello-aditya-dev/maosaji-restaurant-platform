# MEDIA_PLAN.md — Maosaji Visual Experience (Private Concept)

**Addendum:** `VISUAL EXPERIENCE + MEDIA DIRECTION OVERRIDE — 18 September 2026`
**Status:** Implemented for the private sales demo. Production swaps are marked below.

---

## 1. Creative benchmark study — jfvegancafe.com (reference only)

Inspected live at desktop (1440px) and mobile (390px), plus its menu page.
No assets, code, copy, or layout were copied. Findings that inform our direction:

| Principle observed at JF | How Maosaji adapts it (not clones it) |
| --- | --- |
| Food IS the interface — color comes from photography, not UI chrome | Full-bleed film hero; chapters built from food imagery; UI stays ivory/ink/red |
| Extreme copy minimalism (2–6 words per section) | Chapter titles `EAT.` `SWEET.` + one supporting line each |
| Breath-pause-breath rhythm (full-bleed → whitespace → typographic anchor) | Alternating dark cinematic bands and warm ivory fields |
| Dramatic type-scale contrast (viewport-size serif vs 10–12px UI) | `MAOSAJI`, `EAT.`, `SWEET.` at clamp() viewport scale; tiny tracked eyebrows |
| Floating isolated "specimen" food imagery on vast whitespace | Brand-statement cutouts (thali, dosa, laddoo, cake, chaat) masked in arches/circles on ivory |
| Mobile: edge-to-edge crop, floating minimal header, large type | Portrait hero film frames, minimal nav chrome, bottom action bar retained for utility |
| Menu page is editorial first (photography as breaks, pill filters, thin rules) | "WHAT ARE YOU CRAVING?" transition → utility search + hairline section rules |

**Deliberate divergences:** Maosaji keeps a deep masala-red brand anchor and brass
accents (Indian heritage warmth) where JF is near-monochrome; Maosaji's platform
carries far more functionality (search, outlets, enquiries, admin) — utility is
embraced after the emotional chapters, not hidden.

---

## 2. Homepage storyboard (section-by-section)

| # | Section | Composition | Media | Motion |
| --- | --- | --- | --- | --- |
| 01 | **Cinematic hero** ~95svh | Full-bleed film, bottom-left overlay: `MAOSAJI` / eyebrow / one line / `EXPLORE ↓` | 6-frame film: thali → dosa → mithai → garnish → bakery → gift box (portrait derivatives on mobile) | Slow crossfade + Ken Burns; static poster for reduced-motion |
| 02 | **Brand statement** | Warm-ivory field. `ONE NAME.` then `MANY CRAVINGS.` at viewport scale, serif | Arch/circle-masked studio cutouts (thali, dosa, laddoo, cake, chaat) around/through type | Masked reveal, subtle parallax drift |
| 03 | **EAT.** | Oversized chapter word, short verified category list | Sticky portrait media rail (dosa / curry / thali / chaat) cycling beside copy on desktop; natural vertical flow on mobile | Sticky media swap on scroll progress |
| 04 | **SWEET.** | Dark band. Macro mithai landscape + tall portrait, `For a craving. For a gift. For the table.` | sweet-wide, sweet-tall + horizontal drifting product rail (katli, laddoo, barfi, jamun) | Slow horizontal drift, masked reveals |
| 05 | **BAKERY.** | Cream/whitespace tempo change — clean isolated products | bakery-wide + bakery-tall, directional light | Gentle reveal only |
| 06 | **Menu discovery** | `WHAT ARE YOU CRAVING?` + live search field → featured dishes (DB-driven) | Item photography grid (systematic, utility mode) | Instant client-side results |
| 07 | **CELEBRATE.** | `MORE THAN A MEAL.` full-width storytelling; concept enquiry pathways | celebrate-wide + celebrate-tall (packing, table detail) | Masked reveal, restrained |
| 08 | **LOCATIONS** | SVM large editorial block, Mangla alternating — not duplicate cards | Verified location imagery | Reveal |
| 09 | **STORY** | `A FAMILIAR NAME IN BILASPUR.` + future-story architecture note | hero-story (interior) | Reveal |
| 10 | **Final CTA** | Dark film still, `WHAT ARE YOU CRAVING?` + three quiet actions: MENU / ORDER / FIND A LOCATION | final-wide (chai pour) | Slow parallax |

---

## 3. Media inventory & provenance

All current imagery is **generated for this private concept**. Nothing is claimed
to be a photograph of the real Maosaji premises, staff, or products.

Legend —
`GENERATED CONCEPT ASSET` = AI-generated for this demo, replace before production ·
`VERIFIED MAOSAJI PUBLIC REFERENCE` = from public listing data ·
`OWNER-PROVIDED [future]` = to be shot/supplied by owner ·
`PLACEHOLDER — REPLACE BEFORE PRODUCTION`

| Asset | Section | Subject | Source status | Orientation / size | Desktop / Mobile | Production approval |
| --- | --- | --- | --- | --- | --- | --- |
| `film/film-1-thali.jpg` (+`-p`) | Hero film 01 | Veg thali, hand placing roti, steam | GENERATED CONCEPT ASSET | 1344×768 / 768×1344 | both | replace with brand film |
| `film/film-2-dosa.jpg` (+`-p`) | Hero film 02 | Dosa on black griddle | GENERATED CONCEPT ASSET | 1344×768 / 768×1344 | both | replace with brand film |
| `film/film-3-mithai.jpg` (+`-p`) | Hero film 03 | Mithai macro, silver leaf | GENERATED CONCEPT ASSET | 1344×768 / 768×1344 | both | replace with brand film |
| `film/film-4-garnish.jpg` | Hero film 04 | Pistachio falling on barfi | GENERATED CONCEPT ASSET | 1344×768 | desktop | replace with brand film |
| `film/film-5-bakery.jpg` | Hero film 05 | Cake slice detail | GENERATED CONCEPT ASSET | 1344×768 | desktop | replace with brand film |
| `film/film-6-box.jpg` | Hero film 06 | Gift box + ribbon, hands | GENERATED CONCEPT ASSET | 1344×768 | desktop | replace with brand film |
| `brand/thali-arch.jpg` `brand/dosa-roll.jpg` `brand/laddoo-stack.jpg` `brand/cake-slice.jpg` `brand/chaat-bowl.jpg` | Brand statement | Studio cutouts on ivory | GENERATED CONCEPT ASSET | 1024×1024 | both | owner product shoot |
| `eat/eat-wide.jpg` | EAT opener | Feast table scene | GENERATED CONCEPT ASSET | 1344×768 | both | owner shoot |
| `eat/sticky-{dosa,curry,thali,chaat}.jpg` | EAT sticky rail | Dish portraits | GENERATED CONCEPT ASSET | 864×1152 | desktop rail / mobile inline | owner shoot |
| `sweet/sweet-wide.jpg` `sweet/sweet-tall.jpg` `sweet/rail-*.jpg` | SWEET | Mithai macros | GENERATED CONCEPT ASSET | mixed | both | owner shoot |
| `bakery/bakery-{wide,tall}.jpg` | BAKERY | Clean bakery stills | GENERATED CONCEPT ASSET | 1344×768 / 768×1344 | both | owner shoot |
| `celebrate/celebrate-{wide,tall}.jpg` | CELEBRATE | Packing & table detail | GENERATED CONCEPT ASSET | 1344×768 / 768×1344 | both | owner shoot; no real events implied |
| `hero-story.jpg` | STORY / Our Story | Restaurant interior | GENERATED CONCEPT ASSET | 1344×768 | both | owner interiors shoot |
| `final/final-wide.jpg` | Final CTA | Chai pour | GENERATED CONCEPT ASSET | 1344×768 | both | brand film still |
| `cat-*.jpg`, `items/*.jpg` | Menu / categories | Dish photography | GENERATED CONCEPT ASSET | 1024×1024 | both | owner food shoot |
| `gallery/*.jpg` | Gallery | Scenes & details | GENERATED CONCEPT ASSET | 1024×1024 | both | owner shoot |
| `locations/svm.jpg`, `locations/mangla.jpg` | Locations | Storefront mood | GENERATED CONCEPT ASSET (concept only) | 1024×1024 | both | **must** be replaced with real, owner-approved storefront photography |
| Verified Zomato/Swiggy links, addresses, reference phones | Locations / order | — | VERIFIED MAOSAJI PUBLIC REFERENCE (as of 2026-09-18) | — | — | re-verify at production |
| Founder story, hours, prices | — | — | OWNER-PROVIDED [future] | — | — | intentionally absent |

### Notes
- No low-resolution public images were enlarged into full-screen use (addendum §13).
- No JF Vegan Cafe assets, copy, typography files, or layout clones are used (addendum §24).
- All food imagery adheres to pure-vegetarian art direction; no meat/egg imagery.
- People appear only as hands/forearms; no fake smiling stock families; no faces.

---

## 4. Crop strategy

- **Hero film:** dedicated landscape (1344×768) and portrait (768×1344) frames —
  mobile never squashes the desktop crop.
- **Sticky rail (EAT):** portrait 864×1152, `object-cover` with per-image focal points.
- **Cutouts:** square studio frames masked into arch/circle shapes via CSS
  (`border-radius` + `clip-path`), so no transparent PNGs are required.
- **Full-bleed bands:** landscape 1344×768 with center-weighted subjects so
  `object-position` survives extreme ratios.
- `next/image` `sizes` hints set per layout; below-fold media lazy by default;
  hero frames `priority` for the first frame only.

## 5. Performance budget

- Hero: first film frame is a priority `<Image>` (poster-equivalent); remaining
  frames load lazily; crossfade engine pauses when tab hidden or hero off-screen.
- Sectional "loops" (EAT/SWEET/CELEBRATE) are still-image Ken Burns treatments —
  zero video bytes shipped; visually cinematic without media weight.
- All below-fold images `loading="lazy"` + explicit aspect ratios (no layout shift).
- `prefers-reduced-motion`: film freezes on the poster frame; all reveals static.
- No webfont doubles: one display serif + one body sans, `display: swap`.

## 6. Production swap checklist

1. Replace all `GENERATED CONCEPT ASSET` media with owner-approved photography/film.
2. Shoot real storefronts for both outlets; confirm phone numbers and hours.
3. Record founder story with the owner; replace the story placeholder architecture.
4. Owner legal review of disclaimer, privacy, and terms before any public launch.
5. Remove `noindex`/`X-Robots-Tag` only at authorized launch (see handoff checklist).
