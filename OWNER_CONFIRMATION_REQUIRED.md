# OWNER_CONFIRMATION_REQUIRED.md — Maosaji Owner Confirmation Checklist

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata

This document lists every open question that requires owner confirmation before any public launch. Items here are the gaps between the **private sales demo** (which uses only verified public facts + concept imagery) and a **production site** (which requires owner-supplied facts + owner-approved media).

Two important top-line flags:

- ⚠️ **All hours are UNCONFIRMED.** The demo shows `Hours to be confirmed for production`. Owner must supply official hours per outlet.
- ⚠️ **All prices are UNVERIFIED.** The demo shows `Price available on ordering partner`. Owner must supply the master menu with prices.

A third important flag, called out separately because it requires a decision rather than a fact:

- ⚠️ **The similarly-branded "Link Road Cake & Bake" property is an OPEN QUESTION.** It is NOT added as a third outlet in the demo. The owner must confirm whether it is part of the Maosaji brand family (in which case it would become a third outlet) or an unrelated business that happens to share naming elements. Do not add it without owner confirmation.

---

## 1. BRAND

| # | Question | Why it matters | Current demo state |
|---|---|---|---|
| 1 | Official spelling of the brand | The Zomato listings show "Maosaji" for both outlets; some third-party references show "Maosaji Sweets" or "Maosaji SVM". The brand-correct spelling for production must come from the owner. | "Maosaji" used everywhere; "Maosaji (SVM)" / "Maosaji Mangla" used to disambiguate outlets. |
| 2 | Official logo files | The demo uses a typeset wordmark (`Fraunces` serif) as the logo — no logo file is used. Production needs the official logo (vector). | Wordmark only; `public/logo.svg` is a placeholder. |
| 3 | Official colour palette | The demo uses warm cream/ivory `#faf6ef` + deep burgundy/Maosaji red `#8e1f2f` + near-black/dark brown espresso + restrained brass/gold. Owner must confirm or supply the official palette. | Palette is a reasonable Indian-heritage interpretation, not owner-confirmed. |
| 4 | Brand history / founding year | The verified-facts file explicitly lists founding year and family history as "do not claim". The "Our Story" page is intentionally a future-story scaffold. | No history on the site. Owner must supply the founder story. |
| 5 | Founder name and role | Same as above. | Not used. |
| 6 | Brand tagline / brand voice | The demo uses editorial copy in the spirit of Indian-heritage warmth (e.g. `ONE NAME. MANY CRAVINGS.`). Owner must approve or supply the official tagline. | Editorial concept copy. |

---

## 2. LOCATIONS

| # | Question | Why it matters | Current demo state |
|---|---|---|---|
| 1 | Full outlet list (currently 2: SVM + Mangla) | The owner may operate additional outlets (e.g. Link Road). The demo must not invent or omit outlets. | 2 outlets seeded: SVM and Mangla. |
| 2 | ⚠️ "Link Road Cake & Bake" relationship | A similarly-branded property exists in public references. Owner must confirm whether it is part of the Maosaji brand family or unrelated. **Do NOT add as a third outlet without owner confirmation.** | NOT in the demo. Flagged as open. |
| 3 | Official phones per outlet | The Zomato-listed phones (`+91 91525 49189` for SVM, `+91 91119 74447` for Mangla) are used in the demo with the label "as listed publicly". Owner must confirm the preferred official contact numbers. | Phones shown with "as listed publicly" labelling. |
| 4 | Verified opening hours per outlet | The verified-facts file explicitly lists exact current opening hours as "do not claim". | `Hours to be confirmed for production` everywhere. |
| 5 | Outlet landmark / neighbourhood copy (for location cards) | The demo uses the verified street address; the owner may want a richer neighbourhood description (e.g. "opposite Rama Magneto Mall"). | Verified address only. |
| 6 | Google Maps place IDs | The "Get directions" CTA links to a Google Maps search for the verified address (works, but not as crisp as a verified Place ID). | Address-based map link. |

---

## 3. MENU

| # | Question | Why it matters | Current demo state |
|---|---|---|---|
| 1 | Master menu (full item list per outlet) | The demo seeds 86 items (25 SVM-tagged + 37 Mangla-tagged + 24 at both) using publicly-verified product names from the research lists. The owner must confirm the master menu. | 86-item seed; all real publicly-verified product names; all prices null; all descriptions neutral. |
| 2 | Prices | The verified-facts file explicitly lists exact prices as "do not claim" without owner confirmation. | `Price available on ordering partner` on every item. |
| 3 | Outlet availability per item | The demo seeds outlet-specific item ranges based on the publicly-verified SVM vs Mangla emphasis (SVM: Thalis/South Indian/North Indian/Namkeen/Dry Fruits/Chai-Lassi; Mangla: Sweets/Bakery/Cakes/Cookies/Coffee/Shakes/Drinks). Owner must confirm or correct the per-outlet availability. | Outlet-specific `locationSlugs: ["svm"]`, `["mangla"]`, or `[]` (both). |
| 4 | Bestsellers | The demo does not tag any item as a bestseller (would require owner input). | No bestseller tags. |
| 5 | Seasonal / festive items | The demo includes a "Festive Sweets Box" concept item but no seasonal rotation logic. | Static festive concept item only. |
| 6 | Veg/Jain/allergen information | The verified-facts file lists Jain availability, allergen claims, and nutrition claims as "do not claim" without owner confirmation. | Veg badges shown for items confirmed veg by category convention; no Jain/allergen/nutrition claims. |
| 7 | Item photography | The demo uses 31 concept item images. Owner must supply real food photography. | Concept images labelled "(concept imagery)" or by dish name. |

---

## 4. SERVICES

| # | Question | Why it matters | Current demo state |
|---|---|---|---|
| 1 | Catering service availability + scope | The demo's Celebrations page mentions catering as a concept enquiry pathway; owner must confirm whether catering is offered and at what scope (event size, radius). | Concept pathway only; no claims. |
| 2 | Wedding orders | Same as above — the demo's Celebrations and Bulk-Orders pages accept enquiries but make no service-availability claim. | Concept enquiry forms only. |
| 3 | Corporate gifting | The demo's Bulk-Orders form accepts a corporate-gifting enquiry (verified live: `BO-2026-0004` submitted with `Occasion: Corporate gifting`). Owner must confirm the service is offered. | Form accepts the enquiry; fulfilment is owner-side. |
| 4 | Bulk orders | Same as above. | Bulk-Orders form verified working (see `FINAL_DEMO_QA.md`). |
| 5 | Custom cakes | The demo's Cake Enquiry form accepts custom-cake enquiries; owner must confirm capability (size range, design, lead time). | Form accepts the enquiry. |
| 6 | Direct delivery (vs partner-only) | The demo routes ordering to Zomato/Swiggy; owner must confirm whether direct delivery is offered. | Partner-only (Zomato/Swiggy) — matches verified facts. |
| 7 | Restaurant bookings / table reservations | The demo has no reservation flow. Owner must confirm whether to add one. | No reservation flow. |

---

## 5. DIGITAL

| # | Question | Why it matters | Current demo state |
|---|---|---|---|
| 1 | Domain ownership — `maosajisvm.com` | The verified-facts file records `maosajisvm.com` returning HTTP 502 during the check; ownership is explicitly "do not claim". Owner must confirm whether they own this domain and provide registrar access for production DNS. | No claim made; the 502 status is documented in `RESEARCH_PROVENANCE.md` §7. |
| 2 | Domain ownership — `maosajisweets.com` | Same — ownership is explicitly "do not claim". No technical check was performed in this pass. | Not claimed. |
| 3 | Official primary domain | Owner must confirm the official production domain. | Demo lives at the Vercel preview URL only. |
| 4 | Official social accounts (Instagram, Facebook, WhatsApp Business, YouTube) | Owner must confirm official handles. | No social links in the demo. |
| 5 | Google Business Profile ownership per outlet | Owner must confirm GBP ownership so reviews/hours/photos can be managed. | Not claimed. |
| 6 | Zomato listing management per outlet | Owner must confirm who manages the Zomato listing (so menu/Hours/photos stay synced). | Verified Zomato URLs are linked; management is owner-side. |
| 7 | Swiggy listing management per outlet | Same as above. | Verified Swiggy URLs are linked; management is owner-side. |

---

## 6. OPERATIONS

| # | Question | Why it matters | Current demo state |
|---|---|---|---|
| 1 | Who handles menu changes (add/remove items, price updates, availability toggles) | The demo's `/admin/menu` page lets a logged-in admin toggle item availability (verified live: Masala Dosa toggle). Owner must designate the human + process for production. | Admin passcode `demo2026` (private demo hint shown on login page). |
| 2 | Who handles enquiry follow-up (NEW → CONTACTED → RESOLVED) | The demo's `/admin/enquiries` page lets a logged-in admin change enquiry status (verified live: `BO-2026-0004` status combobox). Owner must designate the human + SLA. | Same admin passcode. |
| 3 | Admin roles / multi-user | The demo uses a single passcode-based cookie session. Production needs real auth (Supabase Auth documented as the swap path) and role separation. | Single passcode; documented for swap to Supabase Auth. |
| 4 | POS / order systems integration | Owner must confirm whether the demo should integrate with the in-store POS for live order sync. | No POS integration; DEMO_MODE only. |
| 5 | Notification channels (email / WhatsApp / SMS) | The demo sends no notifications to the restaurant. Owner must confirm which channels production should use and supply credentials. | None. |

---

## 7. MEDIA

| # | Question | Why it matters | Current demo state |
|---|---|---|---|
| 1 | Original brand photography | The demo uses 9 hero film stills, 5 brand cutouts, 31 item images, 10 chapter-media images, 2 location images, 5 gallery images — all concept imagery. | All imagery is concept; see `MEDIA_PROVENANCE.md`. |
| 2 | Outlet photography (real storefronts for SVM + Mangla) | The demo uses storefront-mood concept images that are explicitly NOT the real storefronts. | Concept imagery only; `locations/svm.jpg` and `locations/mangla.jpg` are placeholders. |
| 3 | Logo files (vector) | The demo uses a typeset wordmark. | No official logo file. |
| 4 | Permission for photo/video shoot at the outlets | Owner must authorise a shoot at SVM and Mangla for owner-supplied photography. | No shoot conducted. |
| 5 | Brand film (for the hero) | The demo's hero is built from graded stills. Owner may want a real brand film. | No real film; concept stills only. |
| 6 | Founder / team interview for the "Our Story" page | The "Our Story" page is intentionally a future-story scaffold. | No founder story on the site. |

---

## 8. Items that are intentionally NOT in this list

The following are **not** open questions for the owner because they are already settled for the demo (and need no production change):

- **noindex / X-Robots-Tag / robots.txt** — applied by design; will be removed only at authorised launch (see `09_PRODUCTION_HANDOFF_CHECKLIST.md` in the build pack).
- **Footer disclaimer `Private concept prepared for Maosaji. Not the official Maosaji website.`** — applied by design for the private demo; removed at authorised launch.
- **Admin passcode `demo2026`** — applied by design; production swaps to real auth.
- **DEMO_MODE backend (Prisma + SQLite)** — applied by design; production swaps to the Supabase provider (DataProvider abstraction already in place).
