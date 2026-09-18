# Acceptance Tests — Definition of Done

Zai must not declare the project complete until every applicable item below is checked.

## A. Product completeness
- [ ] `/` works
- [ ] `/menu` works
- [ ] menu search works without reload
- [ ] category filtering works
- [ ] menu item detail interaction works
- [ ] order list/cart-like selection works
- [ ] outlet selection works and persists
- [ ] `/sweets` works
- [ ] `/bakery` works
- [ ] `/celebrations` works
- [ ] celebration form validates and submits
- [ ] `/bulk-orders` works
- [ ] bulk enquiry validates and submits
- [ ] `/locations` works
- [ ] `/locations/svm` works
- [ ] `/locations/mangla` works
- [ ] `/our-story` works without fabricated history
- [ ] `/gallery` works
- [ ] `/order` works
- [ ] `/contact` works
- [ ] privacy/terms exist for demo context
- [ ] branded 404 exists

## B. Admin
- [ ] `/admin/login` works in the selected demo/auth mode
- [ ] `/admin` dashboard works
- [ ] enquiries appear after form submission
- [ ] enquiry status can be changed
- [ ] menu manager works
- [ ] availability change is reflected on customer-facing menu
- [ ] location manager renders data
- [ ] offers manager works
- [ ] site settings/content controls work where implemented
- [ ] every fake metric is visibly labelled DEMO DATA
- [ ] no real Maosaji contact receives demo notifications

## C. Data layer
Preferred:
- [ ] Supabase schema/migrations exist
- [ ] RLS policies exist
- [ ] service role secret is never exposed to browser
- [ ] admin writes require authorization

If Supabase credentials are NOT available:
- [ ] project automatically enters `DEMO_MODE`
- [ ] same-browser form -> admin flow works deterministically
- [ ] demo persistence survives refresh
- [ ] UI clearly labels demo data
- [ ] README explains how to switch to Supabase without rewriting UI

## D. Design
- [ ] modern Indian heritage visual language
- [ ] no generic restaurant-template feel
- [ ] typography hierarchy consistent
- [ ] spacing follows token system
- [ ] colour usage follows token system
- [ ] no arbitrary per-page radii/shadows/colors
- [ ] all imagery has intentional crop/focal point
- [ ] no visibly pixelated hero/product images
- [ ] all pages visually feel like one system

## E. Motion
- [ ] hero animation restrained
- [ ] standard reveal language is consistent
- [ ] hover scale never excessive
- [ ] drawers feel responsive
- [ ] `prefers-reduced-motion` respected
- [ ] animations never block navigation/content
- [ ] no gimmicky custom cursor
- [ ] no unnecessary loading intro

## F. Mobile
Test at widths: 360, 375, 390, 412, 768, 1024, 1440, 1920.
- [ ] no horizontal overflow
- [ ] no clipped text
- [ ] minimum practical tap targets
- [ ] bottom action bar works on mobile
- [ ] menu category rail works on mobile
- [ ] admin is usable at phone/tablet width
- [ ] hero composition looks deliberate on 390px
- [ ] forms are comfortable to complete on mobile

## G. Performance/quality
- [ ] zero uncaught console errors
- [ ] zero obvious network failures under normal flow
- [ ] no broken internal links
- [ ] no missing alt text on meaningful images
- [ ] images use `next/image` or equivalent responsive optimization
- [ ] below-fold images lazy load
- [ ] page does not depend on huge JS for basic content
- [ ] server/rendering strategy is sensible
- [ ] loading/skeleton/error/empty states are intentional
- [ ] aim for LCP <2.5s, CLS <0.1, INP <200ms where realistically testable
- [ ] Lighthouse should be strong; report actual results, do not fake a score

## H. Safety/private demo
- [ ] site has `noindex,nofollow`
- [ ] add `X-Robots-Tag: noindex, nofollow` where practical
- [ ] sitemap/robots behavior does not invite indexing
- [ ] visible footer disclaimer: `Private concept prepared for Maosaji. Not the official Maosaji website.`
- [ ] page title/metadata do not falsely imply official status
- [ ] demo forms cannot contact Maosaji
- [ ] no payment capture
- [ ] no real checkout
- [ ] no fake direct ordering

## I. Reusability
- [ ] no Maosaji-specific database table names
- [ ] restaurant branding is centralized in config/data
- [ ] feature toggles exist
- [ ] location data is data-driven
- [ ] menu data is data-driven
- [ ] copy/images are replaceable without component rewrites
- [ ] `REBRAND_GUIDE.md` is accurate
- [ ] another restaurant can be skinned without rewriting the platform

## J. Final evidence
Zai must produce:
- [ ] `BUILD_REPORT.md`
- [ ] `QA_REPORT.md`
- [ ] `DATA_PROVENANCE.md`
- [ ] `REBRAND_GUIDE.md`
- [ ] `PRODUCTION_HANDOFF.md`
- [ ] list of routes tested
- [ ] list of known limitations
- [ ] exact backend mode used: Supabase or Demo Mode
- [ ] screenshots or browser verification notes for mobile + desktop if its environment supports it
