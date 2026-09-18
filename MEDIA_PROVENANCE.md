# MEDIA_PROVENANCE.md — Maosaji Media Inventory & Provenance

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata

---

## 1. Top-line provenance statement

**Every image used in this private Maosaji sales demo is a CONCEPT IMAGE — generated for the private demo.** None of the imagery is owner-supplied photography. None of it is claimed to depict the real Maosaji premises, staff, products, or events.

This is enforced in three places:

1. **`MEDIA_PLAN.md` §3** — every asset is tagged `GENERATED CONCEPT ASSET` (with a small subset tagged `VERIFIED MAOSAJI PUBLIC REFERENCE` for the textual address/phone/link facts only — those are not images).
2. **Alt text** — the hero film frames use alt text following the pattern `"<subject> (concept imagery)"`; gallery alts use the pattern `"<subject> (generic placeholder photography)"`; item alts use the dish name with no Maosaji-supplied provenance claim.
3. **Visual copy** — gallery footer says `Placeholder photography for the private concept — production would use owner-approved originals.`; the footer disclaimer `Private concept prepared for Maosaji. Not the official Maosaji website.` applies site-wide.

---

## 2. Media families

| # | Family | Path | Count | Provenance tag | Production action |
|---|---|---|---:|---|---|
| 1 | Hero film frames (landscape) | `public/images/film/film-{1,2,3,4,5,6}-*.jpg` | 6 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner-supplied brand film stills |
| 2 | Hero film frames (portrait derivatives, mobile) | `public/images/film/film-{1,2,3}-*-p.jpg` | 3 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner-supplied portrait brand film stills |
| 3 | Chapter media — EAT | `public/images/eat/eat-wide.jpg`, `eat/sticky-{dosa,curry,thali,chaat}.jpg` | 5 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner dish shoot |
| 4 | Chapter media — SWEET | `public/images/sweet/sweet-{wide,tall}.jpg`, `sweet/rail-{katli,laddoo,barfi,jamun}.jpg` | 6 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner mithai shoot |
| 5 | Chapter media — BAKERY | `public/images/bakery/bakery-{wide,tall}.jpg` | 2 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner bakery shoot |
| 6 | Chapter media — CELEBRATE | `public/images/celebrate/celebrate-{wide,tall}.jpg` | 2 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner event/packing shoot (no real events implied) |
| 7 | Chapter media — STORY / Our Story | `public/images/hero-story.jpg` | 1 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner interiors shoot |
| 8 | Chapter media — Final CTA | `public/images/final/final-wide.jpg` | 1 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner brand film still (chai pour) |
| 9 | Brand cutouts (brand statement section) | `public/images/brand/{thali-arch,dosa-roll,laddoo-stack,cake-slice,chaat-bowl}.jpg` | 5 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner studio cutouts |
| 10 | Item images (menu / sweets / bakery / discovery) | `public/images/items/*.jpg` | 31 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner food photography |
| 11 | Category thumbnails | `public/images/cat-*.jpg` | 10 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner category photography |
| 12 | Other chapter heroes | `public/images/hero-{main,sweets,bakery,celebrations,bulk}.jpg` | 5 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner chapter hero photography |
| 13 | Location gallery (per outlet) | `public/images/locations/{svm,mangla}.jpg` | 2 | **CONCEPT IMAGE — generated for the private demo** (storefront mood; not a photo of the real storefront) | **Must** be replaced with real, owner-approved storefront photography |
| 14 | Site gallery (editorial masonry) | `public/images/gallery/{kitchen,food-detail,dining,celebration-table,sweets-counter}.jpg` | 5 | **CONCEPT IMAGE — generated for the private demo** | Replace with owner shoot |

---

## 3. Alt-text patterns

| Family | Alt-text pattern | Example |
|---|---|---|
| Hero film frames | `<subject> (concept imagery)` | `Veg thali, hand placing roti, steam (concept imagery)` |
| Site gallery | `<subject> (generic placeholder photography)` | `Kitchen scene (generic placeholder photography)` |
| Item images | `<dish name>` (no Maosaji-supplied provenance claim) | `Masala Dosa` |
| Brand cutouts | `<subject> (concept imagery)` | `Thali arch (concept imagery)` |
| Location images | `<outlet> storefront (concept imagery — not the real storefront)` | `SVM storefront (concept imagery — not the real storefront)` |

---

## 4. Art-direction rules followed by all concept imagery

Verified in `MEDIA_PLAN.md` §3 Notes:

- No low-resolution public images were enlarged into full-screen use.
- No JF Vegan Cafe assets, copy, typography files, or layout clones are used.
- All food imagery adheres to pure-vegetarian art direction; no meat/egg imagery.
- People appear only as hands/forearms; no fake smiling stock families; no faces.

---

## 5. Production swap checklist

Before any public launch, the owner must supply or approve replacements for **every** image in §2. The detailed checklist lives in **`MEDIA_PLAN.md` §6 Production swap checklist** (present at `/home/z/my-project/MEDIA_PLAN.md`). Summary:

1. Replace all `CONCEPT IMAGE — generated for the private demo` media with owner-approved photography / film.
2. Shoot real storefronts for both SVM and Mangla outlets; confirm phone numbers and hours at the same shoot.
3. Record the founder story with the owner; replace the story placeholder architecture (currently the "Our Story" page is intentionally a future-story scaffold — no invented history).
4. Owner legal review of the disclaimer, privacy, and terms pages before any public launch.
5. Remove `noindex` / `X-Robots-Tag` only at the authorised launch (see build-pack `09_PRODUCTION_HANDOFF_CHECKLIST.md`).

---

## 6. Important honesty flags

- The hero film frames depict real Indian dishes (thali, dosa, mithai, garnish, bakery, gift box) but are **not** photographs of dishes prepared at Maosaji.
- The location images for SVM and Mangla are storefront-mood concept images — **they are not the real storefronts**. The real Zomato/Swiggy storefront photos were not used (licensing and accuracy reasons).
- The brand cutouts (thali arch, dosa roll, laddoo stack, cake slice, chaat bowl) are studio-style concept stills — they do not depict Maosaji products.
- All item images are generic food photography labelled with the dish name — they are not photos of dishes prepared at Maosaji.

For the verified textual facts (addresses, public phones, Zomato/Swiggy URLs, public menu breadth categories, `maosajisvm.com` domain status), see `RESEARCH_PROVENANCE.md` — those are not images and are tagged `VERIFIED MAOSAJI PUBLIC REFERENCE`.
