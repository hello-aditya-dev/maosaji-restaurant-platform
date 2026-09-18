# REALITY_PASS_REPORT.md — Maosaji Outlet-Specific Reality Pass

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata
**Test environment:** `agent-browser @390px` through the `localhost:81` Caddy gateway; menu API inspected via `GET /api/menu`.

---

## 1. Goal of the reality pass

The reality pass enforces that **outlet switching is not cosmetic** — SVM and Mangla must show genuinely different product ranges, drawn only from publicly-verified product names. Before this pass, all 27 seed menu items had `locationSlugs: []` (available at both outlets), which meant the SVM/Mangla toggle in the UI was decorative. This pass expands the seed to 86 outlet-differentiated items and verifies the difference live.

---

## 2. Seed summary (after the fix)

The seed constants live in `src/lib/seed-constants.ts` (`SEED_MENU_ITEMS`). Expansion: **27 → 86 items**.

| Slice | Count | `locationSlugs` value | Visible at SVM? | Visible at Mangla? |
|---|---:|---|---|---|
| SVM-only items | 25 | `["svm"]` | Yes | No |
| Mangla-only items | 37 | `["mangla"]` | No | Yes |
| Both-outlet items | 24 | `[]` (empty array) | Yes | Yes |
| **Total** | **86** | — | **~49 visible** | **~61 visible** |

### SVM emphasis (25 SVM-tagged items)
- **Thalis** — Mini Thali, Deluxe Thali, Supreme Thali (plus the both-outlet Maosaji Thali = 4 thalis total at SVM).
- **South Indian** — wider range (Masala Dosa, Plain Dosa, Maosaji Special Dosa, Idli Sambar, etc.).
- **North Indian main course** — Paneer Butter Masala, Dal Tadka, Chole Bhature, etc.
- **Namkeen + Dry Fruits** — Aloo Bhujia, Navratan Mixture, Dry Fruit Box.
- **Chai / Lassi** — Masala Chai, etc.

### Mangla emphasis (37 Mangla-tagged items)
- **Sweets** — Kaju Katli, Milk Cake, Kesariya Jalebi, Rasgulla, Ghee Boondi Laddu, Motichoor Laddoo, Nariyal Barfi, Gulab Jamun, etc.
- **Bakery & Cakes** — Black Forest Cake, Chocolate Truffle Cake, Chocolate Cake, Butterscotch Cake, Pineapple Cake, Birthday Cake, Black Forest Pastry, Pineapple Pastry.
- **Cookies** — Chocolate Chip Cookies, etc.
- **Coffee / Shakes / Drinks** — Cold Coffee, Fresh Lime Soda, etc.

### Both-outlet items (24)
Items that the public menu breadth data places at both outlets — e.g. the Maosaji Thali (the brand's signature thali), Samosa, Kachori Chaat, Veg Manchurian, Pav Bhaji, Veg Spring Rolls, Hakka Noodles, Festive Sweets Box, etc.

### Data-honesty rules enforced on every seed row

| Field | Rule | Verified |
|---|---|---|
| `name` | Real publicly-verified product name from the build-pack research lists. No invented names. | ✅ |
| `price` | `null` for every item. Prices UNVERIFIED — UI shows `Price available on ordering partner`. | ✅ |
| `description` | Neutral description. No invented claims (no "best in Bilaspur", no "since 1917", no health claims, no Jain/allergen claims). | ✅ |
| `locationSlugs` | `["svm"]`, `["mangla"]`, or `[]` (both) — never an invented third outlet. | ✅ |
| `isVegetarian` | Set per category convention (sweets, dosas, thalis, bakery = veg; no meat/egg imagery per art direction). | ✅ |

---

## 3. Outlet-switching live results (verified via `GET /api/menu` + `agent-browser`)

### 3.1 Menu API totals

| Metric | Value |
|---|---|
| Total items returned by menu API | **86** |
| SVM-tagged items (`locationSlugs: ["svm"]`) | 25 |
| Mangla-tagged items (`locationSlugs: ["mangla"]`) | 37 |
| Both-outlet items (`locationSlugs: []`) | 24 |
| Items visible at SVM (SVM-tagged + both) | **~49** |
| Items visible at Mangla (Mangla-tagged + both) | **~61** |

### 3.2 Thali differential (SVM has the thali range; Mangla has only the both-outlet Maosaji Thali)

| Test | Outlet | Query | Expected | Result |
|---|---|---|---|---|
| 3.2.1 | SVM | `?q=thali` | 4 thalis: Maosaji Thali, Mini Thali, Deluxe Thali, Supreme Thali | **PASS** |
| 3.2.2 | Mangla | `?q=thali` | ONLY Maosaji Thali (the SVM-specific Mini/Deluxe/Supreme are correctly hidden) | **PASS** |

This is the headline outlet-differentiation proof: SVM shows 4 thalis, Mangla shows 1 — the difference is data-driven, not cosmetic.

### 3.3 Bakery differential (Mangla has the cake range)

| Test | Outlet | Query | Expected | Result |
|---|---|---|---|---|
| 3.3.1 | Mangla | `?q=cake` | 7 bakery items: Milk Cake, Chocolate Truffle Cake, Black Forest Cake, Chocolate Cake, Butterscotch Cake, Pineapple Cake, Birthday Cake | **PASS** |

### 3.4 Sweet differential (single-item query proves the filter is per-item, not per-category)

| Test | Outlet | Query | Expected | Result |
|---|---|---|---|---|
| 3.4.1 | Mangla | `?q=kaju` | Kaju Katli (1 sweet) | **PASS** |

---

## 4. Data-honesty rules enforced (no invented facts)

The reality pass is not only about outlet differentiation — it is also about refusing to invent. The following rules are verified across the whole demo:

| Rule | Implementation | Verified |
|---|---|---|
| No invented prices | Every `price` is `null`; UI shows `Price available on ordering partner`. | ✅ |
| No invented hours | UI shows `Hours to be confirmed for production`. | ✅ |
| No invented history / founder / founding year | "Our Story" page is a future-story scaffold with a `To be completed with the owner` callout. | ✅ |
| No invented reviews / testimonials | No customer testimonials rendered; the homepage reviews-area links out to Zomato/Swiggy only. | ✅ |
| Phones labelled as publicly listed, not as official | SVM phone `+91 91525 49189` and Mangla phone `+91 91119 74447` shown with "as listed publicly" labelling. | ✅ |
| Hours labelled as to be confirmed | Same as above — `Hours to be confirmed for production`. | ✅ |
| No invented outlet (no third outlet) | Only SVM and Mangla are seeded. The similarly-branded "Link Road Cake & Bake" property is an OPEN QUESTION in `OWNER_CONFIRMATION_REQUIRED.md` §2.2 — NOT added as a third outlet without owner confirmation. | ✅ |
| All product names from the publicly-verified research lists | No invented dish names; the 86-item seed is built from the build-pack verified-facts `public_menu_breadth` list + the SVM/Mangla category emphasis. | ✅ |

---

## 5. Summary

- The 27-item seed (all-both-outlet) has been replaced with an 86-item outlet-differentiated seed: 25 SVM-only + 37 Mangla-only + 24 both.
- SVM sees ~49 items; Mangla sees ~61 items.
- The thali differential (SVM 4 vs Mangla 1) is the headline proof that outlet switching is data-driven.
- The cake differential (Mangla 7) and the single-item kaju→Kaju Katli query confirm the filter is per-item, not per-category.
- All product names are real and publicly verified; all prices are null; all descriptions are neutral.
- No invented history/hours/prices/reviews; the "Link Road" property is an open question, not a third outlet.
