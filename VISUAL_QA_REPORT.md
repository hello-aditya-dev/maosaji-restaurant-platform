# VISUAL_QA_REPORT.md — Maosaji Visual Direction

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata

---

## 1. Visual direction preserved

The visual direction documented in `MEDIA_PLAN.md` and enforced in `src/app/globals.css` is preserved through this QA pass. No regression.

### 1.1 Colour palette

| Role | Token | Hex | Use |
|---|---|---|---|
| Warm cream / ivory (background field) | `--background` | `#faf6ef` | Page background, cards, light bands |
| Deep burgundy / Maosaji red (brand anchor) | brand red | `#8e1f2f` | Headlines accents, primary CTAs, brand marks |
| Near-black / dark brown espresso (ink) | `--foreground` | dark espresso | Body copy, dark cinematic bands |
| Restrained brass / gold (accent) | brass | `#b08d4a` | Eyebrows, hairline accents, ornaments |
| Veg green | veg | (semantic) | Veg badges |

Art direction: **Indian-heritage warmth** (deep masala-red brand anchor + brass accents over ivory), deliberately diverging from near-monochrome reference benchmarks.

### 1.2 Typography

| Role | Typeface | Notes |
|---|---|---|
| Editorial display headings | **Fraunces** (serif) | `clamp()` viewport-scale for hero words (`MAOSAJI`, `EAT.`, `SWEET.`); tiny tracked eyebrows paired against it for dramatic type-scale contrast |
| Body / UI | **Figtree** (sans) | UI labels, body copy, buttons; `display: swap` (no font doubles) |

### 1.3 Homepage narrative (cinematic → utility arc)

| # | Section | Composition |
|---|---|---|
| 01 | **Cinematic hero** (~92svh) | Full-bleed FilmFrames crossfade + Ken Burns over 9 graded stills; `MAOSAJI` / eyebrow / one line / `EXPLORE ↓` overlay bottom-left |
| 02 | **Brand statement** | Warm-ivory field; `ONE NAME.` / `MANY CRAVINGS.` at viewport scale, serif; arch/circle-masked brand cutouts around/through the type |
| 03 | **EAT.** | Oversized chapter word; short verified category list; sticky portrait media rail (dosa / curry / thali / chaat) cycling beside copy on desktop |
| 04 | **SWEET.** | Dark band; macro mithai landscape + tall portrait; `For a craving. For a gift. For the table.`; horizontal drifting product rail (katli, laddoo, barfi, jamun) |
| 05 | **BAKERY.** | Cream / whitespace tempo change; clean isolated products; directional light |
| 06 | **Menu discovery** | `WHAT ARE YOU CRAVING?` + live search field → featured dishes (DB-driven) |
| 07 | **CELEBRATE.** | `MORE THAN A MEAL.` full-width storytelling; concept enquiry pathways |
| 08 | **Locations** | SVM large editorial block, Mangla alternating — not duplicate cards |
| 09 | **Story** | `A FAMILIAR NAME IN BILASPUR.` + future-story architecture note |
| 10 | **Final CTA** | Dark film still; `WHAT ARE YOU CRAVING?` + three quiet actions: MENU / ORDER / FIND A LOCATION |

---

## 2. FilmFrames — the hero "video" engine

`src/components/site/cinema/film-frames.tsx` is the hero engine. It is **not** a `<video>` — it is a crossfade + Ken Burns treatment of graded stills (no video bytes shipped).

| Behaviour | Fast link | Slow link / reduced-motion |
|---|---|---|
| Crossfade rotation between film frames | **Active** — the rotation the owner likes is preserved | **Skipped** — `staticMode` renders only the first (priority) frame as a static poster |
| Trigger condition | Default | `prefers-reduced-motion` OR `navigator.connection.saveData === true` OR `navigator.connection.effectiveType` is `slow-2g`/`2g` |
| Offscreen | `IntersectionObserver` pauses when hero scrolls substantially out of view | n/a (already static) |
| Tab hidden | `visibilitychange` pauses crossfade | n/a (already static) |
| First frame | `next/image priority` (poster-equivalent LCP) | Same (single frame rendered) |
| Mobile aspect | Portrait derivatives below `sm`; never a squashed desktop crop | Same |

The connection-aware `staticMode` was added in this pass (Finding 5 fix). On slow links the hero never shows a mid-crossfade gap — it shows the first priority frame as a stable poster.

---

## 3. AI-text / image artifact review

A visual review of the primary imagery was conducted. Findings:

| Family | Artifact review |
|---|---|
| Hero film frames (9 images) | **No AI-text artifacts. No image artifacts.** Clean food photography — thali, dosa, mithai, garnish, bakery, gift box all render naturally. |
| Item images (31 images) | **No AI-text artifacts. No image artifacts.** Clean dish photography. |
| Brand cutouts (5 images) | **No AI-text artifacts.** Studio-style cutouts. |
| Chapter media (EAT / SWEET / BAKERY / CELEBRATE / STORY / Final CTA) | **No AI-text artifacts.** Consistent editorial food photography. |
| Category thumbnails | **No AI-text artifacts.** |
| Location gallery (`locations/svm.jpg`, `locations/mangla.jpg`) | Tagged **CONCEPT IMAGE** internally (storefront-mood, not the real storefronts). No AI-text artifacts. |
| Site gallery (5 images) | **No AI-text artifacts.** Tagged `(generic placeholder photography)` in alt text. |

**No image carries an AI-generated text overlay, watermark, garbled typography, or anatomical/compositional artifact.** All hero and item images are clean food photography suitable for the demo.

---

## 4. Image-graceful-degradation behaviour

Cards without a matching item image degrade gracefully:

- Cream background fills the card.
- The dish `alt` text is rendered (no broken-image icon).
- No layout shift — the card's aspect ratio is preserved by the parent grid.

This was verified by inspecting the menu card grid at 390px; cards without images render with the same height and grid rhythm as cards with images.

---

## 5. People / art-direction rules (per `MEDIA_PLAN.md` §3 Notes)

Verified preserved:

- No low-resolution public images enlarged into full-screen use.
- No JF Vegan Cafe assets, copy, typography files, or layout clones.
- All food imagery adheres to pure-vegetarian art direction; **no meat/egg imagery**.
- **People appear only as hands/forearms**; no fake smiling stock families; no faces.

---

## 6. Visual QA result

| Item | Status |
|---|---|
| Colour palette preserved (cream/ivory + deep red + brass + dark espresso) | **PASS** |
| Typography preserved (Fraunces serif headings + Figtree body) | **PASS** |
| Cinematic → utility narrative arc (hero → EAT → SWEET → BAKERY → menu discovery → celebrate → locations → story → final CTA) | **PASS** |
| FilmFrames crossfade + Ken Burns preserved on fast links | **PASS** |
| FilmFrames staticMode on slow/reduced-motion | **PASS** (added this pass) |
| No AI-text / image artifacts in primary imagery | **PASS** |
| Location/gallery imagery tagged CONCEPT IMAGE internally | **PASS** |
| Image graceful degradation (cream bg + alt text) | **PASS** |
| Pure-veg art direction (no meat/egg imagery) | **PASS** |
| People as hands/forearms only (no faces) | **PASS** |

**Visual QA: PASS.**
