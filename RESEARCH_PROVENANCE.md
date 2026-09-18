# RESEARCH_PROVENANCE.md — Maosaji Verified-Fact Provenance

**As-of date:** 2026-09-18
**Timezone:** Asia/Kolkata

This document lists every major fact about the Maosaji brand used by the private demo, with its source URL, the date the fact was checked, whether the fact is time-sensitive, and whether owner confirmation is required before production. **Every fact below is sourced from `build-pack/maosaji_zai_build_pack_2026-09-18/02_VERIFIED_FACTS.json`** — the canonical verified-facts file. No fact has been invented.

The `checked_at` date applies to the source lookup; the `02_VERIFIED_FACTS.json` `as_of` value is `2026-09-18`.

---

## 1. Brand facts

| Fact | Value | Outlet | Source URL | checked_at | time_sensitive | owner_confirmation_required |
|---|---|---|---|---|---|---|
| Brand name on Zomato listing | Maosaji (SVM) | SVM | https://www.zomato.com/bilaspur/maosaji-svm-telipara/order | 2026-09-18 | No | Yes (official spelling/logos) |
| Brand name on Zomato listing | Maosaji | Mangla | https://www.zomato.com/bilaspur/maosaji-narmada-nagar/order | 2026-09-18 | No | Yes (official spelling/logos) |

---

## 2. Outlet addresses

| Fact | Value | Outlet | Source URL | checked_at | time_sensitive | owner_confirmation_required |
|---|---|---|---|---|---|---|
| SVM address | Shrikant Verma Marg, Near Rama Magneto Mall, Telipara, Bilaspur | SVM | https://www.zomato.com/bilaspur/maosaji-svm-telipara/order | 2026-09-18 | No (street address stable) | Yes (full official address line) |
| Mangla address | Maosaji Mangla Chowk, Mungeli Road, Bilaspur, Chhattisgarh | Mangla | https://www.zomato.com/bilaspur/maosaji-narmada-nagar/order | 2026-09-18 | No (street address stable) | Yes (full official address line) |

---

## 3. Outlet public phones (as listed publicly on Zomato)

| Fact | Value | Outlet | Source URL | checked_at | time_sensitive | owner_confirmation_required |
|---|---|---|---|---|---|---|
| SVM public phone (as listed on Zomato) | +91 91525 49189 | SVM | https://www.zomato.com/bilaspur/maosaji-svm-telipara/order | 2026-09-18 | No (published listing) | **Yes** (do not assume this is the preferred official contact for production) |
| Mangla public phone (as listed on Zomato) | +91 91119 74447 | Mangla | https://www.zomato.com/bilaspur/maosaji-narmada-nagar/order | 2026-09-18 | No (published listing) | **Yes** (confirm with owner before production) |

Both phones are presented in the UI with the label "as listed publicly" (not "official Maosaji contact") — see the data-honesty rules in `REALITY_PASS_REPORT.md`.

---

## 4. Zomato ordering URLs

| Fact | Value | Outlet | Source URL | checked_at | time_sensitive | owner_confirmation_required |
|---|---|---|---|---|---|---|
| SVM Zomato ordering URL | https://www.zomato.com/bilaspur/maosaji-svm-telipara/order | SVM | (the URL itself; verified reachable) | 2026-09-18 | Yes (Zomato URL slugs may change) | Yes (re-verify before production) |
| Mangla Zomato ordering URL | https://www.zomato.com/bilaspur/maosaji-narmada-nagar/order | Mangla | (the URL itself; verified reachable) | 2026-09-18 | Yes (Zomato URL slugs may change) | Yes (re-verify before production) |

---

## 5. Swiggy ordering URLs

| Fact | Value | Outlet | Source URL | checked_at | time_sensitive | owner_confirmation_required |
|---|---|---|---|---|---|---|
| SVM Swiggy ordering URL | https://www.swiggy.com/city/bilaspur/maosaji-shrikant-verma-marg-talapara-rest157837 | SVM | (the URL itself; verified reachable) | 2026-09-18 | Yes (Swiggy URL slugs may change) | Yes (re-verify before production) |
| Mangla Swiggy ordering URL | https://www.swiggy.com/city/bilaspur/maosaji-mangla-chowk-narmada-nagar-rest259175 | Mangla | (the URL itself; verified reachable) | 2026-09-18 | Yes (Swiggy URL slugs may change) | Yes (re-verify before production) |

---

## 6. Public menu breadth categories

| Fact | Value | Outlet | Source URL | checked_at | time_sensitive | owner_confirmation_required |
|---|---|---|---|---|---|---|
| Public menu breadth (category list) | Thali, North Indian, South Indian, Chinese, Rice and Biryani, Pizza and Pasta, Burgers and Sandwiches, Snacks and Chaat, Mixture and Namkeen, Dry Fruits, Cookies, Desserts and Beverages, Cakes and Pastries, Sweets | SVM (source page; categories vary by outlet) | https://www.zomato.com/bilaspur/maosaji-svm-telipara/menu | 2026-09-18 | Yes (categories vary by outlet and over time) | Yes (master menu + outlet availability) |

Notes from source: "Categories vary by outlet and over time." This list drives the seed category structure but is not the master menu — see `OWNER_CONFIRMATION_REQUIRED.md` §MENU.

---

## 7. Domain status

| Fact | Value | Outlet | Source URL | checked_at | time_sensitive | owner_confirmation_required |
|---|---|---|---|---|---|---|
| `maosajisvm.com` domain status | Returned HTTP 502 Bad Gateway during the check | (brand-level, not outlet-specific) | https://maosajisvm.com | 2026-09-18 | Yes (transient) | **Yes** — proves only that the site failed during this check; do NOT claim the site is permanently down or infer who owns/manages the domain |

---

## 8. Facts NOT in scope of this document (intentionally absent)

The following are listed in `02_VERIFIED_FACTS.json` `explicitly_unverified_do_not_claim` and are **not used anywhere in the demo**. They are listed here only to make the boundary explicit:

- Founding year / "Since 1917" — **NOT used**.
- Founder or family history — **NOT used**.
- Ownership of `maosajisvm.com` — **NOT claimed** (only the 502 status is recorded, see §7).
- Ownership of `maosajisweets.com` — **NOT claimed**. (Note: this domain is mentioned in `02_VERIFIED_FACTS.json` only as an item in the "do not claim" list; no technical check was performed on it and no status is recorded.)
- Official primary domain — **NOT claimed**.
- Exact current opening hours for every outlet — **NOT used**; UI shows `Hours to be confirmed for production`.
- Any Google Maps review count — **NOT used**.
- Any customer testimonial — **NOT used**.
- Any revenue / order volume / conversion rate / ROI / commission savings / sales uplift — **NOT used**.
- Exact prices — **NOT used**; UI shows `Price available on ordering partner`.
- Jain availability, allergen claims, nutrition claims, FSSAI claims, or delivery radius — **NOT used**.

Time-sensitive verified facts that ARE in the source file (e.g. Zomato delivery rating counts, Swiggy rating counts, delivery ratings) are intentionally **not surfaced in the customer-facing UI**. They exist in the build pack for pitch/research use only and are not rendered on the public site.

---

## 9. Re-verification protocol for production

For every row above marked `owner_confirmation_required: Yes`, the protocol before any public launch is:

1. Owner confirms the value (e.g. correct phone number, correct address line, correct Zomato/Swiggy URL).
2. Re-check the source URL on the day of launch (Zomato/Swiggy slugs change).
3. Replace the "as listed publicly" labelling with the owner-confirmed labelling.
4. Repeat §1–3 for each outlet independently.
