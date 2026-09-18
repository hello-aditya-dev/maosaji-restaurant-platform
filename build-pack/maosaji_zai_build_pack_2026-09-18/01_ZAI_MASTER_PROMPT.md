# MASTER EXECUTION PROMPT — MAOSAJI RESTAURANT PLATFORM v1

You are the primary engineering + product + design agent responsible for delivering a finished private sales-demo website/platform for Maosaji in Bilaspur.

This is an execution task, not a brainstorming task.

You must inspect the provided build pack and then build, test, repair, and verify the application end-to-end. Do not stop at scaffolding, mock UI, screenshots, or a partial frontend.

---

## 0. SOURCE OF TRUTH

The user has provided a folder/ZIP called `maosaji_zai_build_pack_2026-09-18`.

Before writing code, read ALL of these:
- `00_README.md`
- `02_VERIFIED_FACTS.json`
- `03_CONTENT_AND_DATA_RULES.md`
- `04_SEED_DATA.json`
- `05_ACCEPTANCE_TESTS.md`
- `SOURCE_CONTEXT_FULL.md`

After implementation, you MUST also execute:
- `06_FINAL_AUDIT_PROMPT.md`

The source material contains the detailed product vision. Preserve it.

If a requirement conflicts with safe/private-demo behavior, the private-demo rule wins.

---

## 1. PRIMARY OUTCOME

Build a private Maosaji implementation of a reusable premium restaurant platform.

This is NOT:
- a generic restaurant template
- a Figma mockup
- a fake official website
- a static collection of pretty pages
- a clone of Zomato or Swiggy
- a direct delivery/checkout platform in phase one

It SHOULD feel like:
> "This is the digital platform a serious established local food brand should already have."

The user plans to show it in person to Maosaji. The first 5 seconds on a 390px phone must be excellent.

The most impressive moment is NOT animation. It is:
1. beautiful official-looking-but-clearly-private customer experience
2. fast searchable menu
3. correct location/order routing
4. high-value bulk/celebration enquiry
5. enquiry appears in admin
6. menu availability edited in admin and reflected on public site
7. clear domain/data ownership story

---

## 2. REUSABLE PRODUCT ARCHITECTURE

Internally structure this as `Restaurant Platform v1`, with Maosaji as data/config.

Do NOT create architecture that makes Maosaji impossible to remove.

Centralize:
- restaurant identity
- theme
- feature flags
- navigation
- locations
- menu
- ordering links
- forms
- social links
- SEO
- content

No database table names such as `maosaji_menu`.

A later rebrand to another restaurant should be mostly config/data/images.

Use a structure conceptually like:

Customer Website
→ Next.js App
→ Data Provider
   → Supabase in real mode
   → Demo data provider in private-demo fallback
→ Admin Dashboard

---

## 3. TECHNOLOGY

Preferred:
- Next.js current stable App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Zod
- Supabase Postgres/Auth/Storage when credentials are available
- Vercel deployment-compatible architecture
- `next/image`
- Playwright for critical E2E if available
- Vitest/Jest where useful

Do not add dependencies without a reason.
Do not use a heavy CMS.

---

## 4. BACKEND / DEMO MODE — CRITICAL

First inspect environment variables and available connected infrastructure.

### If valid Supabase credentials already exist
Use Supabase for:
- menu
- locations
- offers
- enquiries
- settings
- media metadata
- admin auth
- audit logs as feasible

Create migrations/schema and RLS.

### If valid Supabase credentials do NOT exist
DO NOT block the build and DO NOT leave forms fake.

Implement a clean `DataProvider` abstraction and an explicit `DEMO_MODE`.

In DEMO_MODE:
- seed from `04_SEED_DATA.json`
- form submissions persist locally in a deterministic browser-safe store
- the same browser/device can submit an enquiry and immediately see it in `/admin`
- menu availability/settings edits persist across refresh
- clearly label admin metrics/data as `Demo data`
- no real external notification is sent
- code remains ready to swap to Supabase without changing the UI contracts

State the active backend mode in the final report.

Never commit secrets.
Never expose service-role credentials client-side.

---

## 5. PRIVATE-DEMO SAFETY

Required on every build shown before owner approval:
- `noindex,nofollow`
- add X-Robots-Tag if practical
- clear footer: `Private concept prepared for Maosaji. Not the official Maosaji website.`
- metadata must not claim official status
- no emails/SMS/WhatsApp messages sent to Maosaji
- no Razorpay
- no payment capture
- no fake checkout
- no fake direct delivery
- no invented customer accounts

If deployed, prefer an obviously private concept hostname, e.g. `maosaji-concept...`, not a deceptive official-looking domain.

---

## 6. FACTUAL ACCURACY

Use `02_VERIFIED_FACTS.json`.

Do NOT invent:
- founding year
- founder/family
- domain ownership
- official domain
- testimonials
- current Google review counts unless independently reverified
- ROI/revenue
- current prices if not verified
- operating hours if not verified
- branch count beyond verified data
- dietary/allergen claims
- certifications

When data is missing, design around it elegantly.

Examples:
- show `Price available on ordering partner`
- display no opening-hours status rather than guessing
- make Our Story a polished but intentionally limited section and note that verified history should be added with the owner
- label sample admin data `Demo data`

Never write `Serving since 1917` unless owner later confirms it.

---

## 7. VISUAL DIRECTION

Design direction: MODERN INDIAN HERITAGE.

Avoid:
- generic dark steakhouse aesthetics
- cheap bright red/yellow fast-food styling
- excessive gold
- tacky Indian ornamentation
- over-rounded SaaS cards
- huge gradients
- template-looking layouts
- visual clutter
- giant entrance animations
- custom cursor gimmicks

Target:
- warm ivory / cream surfaces
- deep brand red
- restrained muted brass/gold accent
- charcoal typography
- restrained green for vegetarian state only
- editorial food photography
- subtle texture/grain
- occasional geometric/heritage motif at very low opacity
- generous whitespace
- sophisticated typography
- fine borders
- premium product photography treatment
- mobile-first layout

If exact brand colors cannot be reliably extracted from approved brand assets, keep them as centralized theme tokens and document that production colors require owner confirmation.

---

## 8. DESIGN SYSTEM

Create tokens for:
- colors
- typography
- spacing
- radii
- shadows
- motion
- breakpoints
- z-index

Do not sprinkle arbitrary hex values and radii across components.

Create reusable components for:
- buttons
- text links
- section header
- cards
- product cards
- location cards
- badges
- drawers/sheets
- form controls
- field validation
- empty/error/loading states
- modal/lightbox
- navbar
- mobile bottom nav
- footer

---

## 9. HOMEPAGE

The home route `/` should contain a coherent narrative, not a collage.

### Hero
Approx 85–90vh on desktop but excellent on 390px.

Content:
- eyebrow: `RESTAURANT • SWEETS • BAKERY • NAMKEEN`
- title: `Maosaji`
- line: `A Bilaspur favourite, served every day.`
- CTA: `Explore Menu`
- CTA: `Order Online`
- secondary: `Find a Maosaji near you`

Use a beautiful high-resolution food composition.

### Hero motion
- content reveal ~16px upward
- modest stagger
- image settle ~1.02 → 1.00
- subtle parallax only if it remains performant
- no loader
- no intro sequence
- reduced-motion support

### What are you craving?
Visual cards:
- Restaurant
- Sweets
- Cakes & Bakery
- Chaat & Snacks
- Namkeen
- Beverages

Mobile: horizontally swipeable rail.
Click routes to relevant filtered menu/category.

### Featured favourites
6–8 visually strong items from safe demo data/publicly verified item names.
Do not invent real Maosaji prices.

### Commercial pathways
Feature:
- celebrations
- bulk/corporate orders
- locations
- ordering partner integration
- brand story teaser

---

## 10. MENU EXPERIENCE

Route: `/menu`

This is a centerpiece.

Features:
- fast search
- sticky category rail
- active category tracks scroll position
- category click scrolls to content
- mobile category rail auto-scrolls active item into view
- filtering
- excellent empty state
- keyboard accessibility
- responsive cards

Categories should include:
- Popular
- Thali
- North Indian
- South Indian
- Chinese
- Chaat & Snacks
- Sweets
- Bakery & Cakes
- Namkeen
- Beverages

Only use unverified filters such as Jain/spicy/allergens if they are clearly demo-only OR omit them.

### Product card
- high-quality image
- name
- category
- veg indicator where public data clearly supports it
- short neutral description if safe
- price only when verified; otherwise omit or say available on ordering partner
- add/select control

### Search test
Searching `dosa` must return relevant demo items immediately without page reload.

---

## 11. ORDER LIST / LIGHT CART

This is not direct checkout.

Allow users to select menu items.
Show a bottom drawer such as `3 items selected`.

Order list:
- selected items
- quantity controls
- selected outlet
- `Continue with Zomato`
- `Continue with Swiggy`
- optional `Prepare WhatsApp enquiry`

Do not pretend selected items transfer into third-party carts unless such deep-link functionality is genuinely supported.

If WhatsApp generation is included:
- use a generated text message
- in private demo, do not default to messaging Maosaji unless the user explicitly clicks and number is verified
- safe option: copy message text

---

## 12. LOCATIONS

Route `/locations`.

Verified public location concepts:
- Srikant Verma Marg / SVM
- Mangla Chowk / Narmada Nagar

Data comes from config/store.

Each location card:
- name
- address
- directions
- call only if using verified public reference and clearly documented
- view menu
- order

Do NOT guess opening hours.

### Individual routes
- `/locations/svm`
- `/locations/mangla`

Include:
- location-specific hero
- address
- directions link
- order partner links
- outlet gallery
- outlet menu availability
- promotions if present
- contact
- map embed only if clean and reliable

Architecture must support a future `Add Location`.

---

## 13. SWEETS

Route `/sweets`.

This should feel more like premium retail than a generic menu.

Sections:
- Traditional Sweets
- Festive Boxes
- Dry Fruits
- Namkeen
- Gift Packs

Use safe demo catalog content.
Strong gifting CTA.

No direct ecommerce checkout in this phase.

---

## 14. BAKERY & CAKES

Route `/bakery`.

Show:
- cakes
- pastries
- cookies
- birthday/custom cake concept

CTA:
`Enquire About a Cake`

Form:
- name
- phone
- required date
- cake type
- approximate weight
- custom message
- notes
- optional reference image upload only if the data layer/storage supports it safely

On submit, it must enter the enquiry system.

---

## 15. CELEBRATIONS

Route `/celebrations`.

Position for:
- birthdays
- weddings
- family functions
- corporate events
- festivals
- large gatherings

Form:
- name
- mobile
- optional email
- event type
- event date
- expected guests
- preferred location
- requirement multi-select
- optional estimated budget
- message

Use validation.
Success state must show a generated demo reference number.

---

## 16. BULK / CORPORATE ORDERS

Route `/bulk-orders`.

Use cases:
- corporate gifting
- festival gifting
- wedding sweets
- employee celebrations
- bulk namkeen
- large food orders

Form:
- organisation
- contact
- phone
- email optional
- quantity
- occasion
- required date
- categories
- optional estimated budget
- message
- optional attachment if supported safely

This is a major sales-demo feature.

---

## 17. ENQUIRY SYSTEM

Use a unified enquiry model where practical.

Suggested fields:
- id
- reference_number
- type
- name/contact_name
- phone
- email
- organization
- location_id
- event_date
- guest_count
- quantity
- budget_range
- requirements
- message
- status
- source
- demo_data
- created_at
- updated_at

Statuses:
- NEW
- CONTACTED
- QUALIFIED
- QUOTED
- WON
- LOST

For the private demo, seed a small number of clearly-labelled demo records.

---

## 18. ADMIN

Route `/admin/login`.
Then `/admin`.

The admin should look like a real operations dashboard, not an afterthought.

### Dashboard
Cards can show DEMO DATA:
- enquiries
- bulk requests
- cake requests
- celebration requests

Recent enquiries list with status.

### Enquiry detail
- all submitted fields
- change status
- notes if implemented

### Menu manager
Required:
- add/edit item
- change name/description
- mark available/unavailable
- choose category
- mark featured
- choose locations
- image reference/upload where supported
- display order if feasible

Critical demo:
Change a menu item to unavailable → public site reflects it.

### Locations manager
- data-driven location records
- production-ready structure for future add/edit

### Offers manager
Fields:
- title
- start/end
- image
- headline
- description
- CTA
- destination
- active
Expired offers should not display.

### Content/settings
At minimum structure for:
- homepage announcement
- phone/contact
- social links
- hero content
- selected featured items

Do not build a giant generic CMS.

---

## 19. OUR STORY

Route `/our-story`.

Do not fabricate history.

Use a restrained narrative such as:
`A familiar name in Bilaspur.`

Communicate breadth of offering and local presence without invented dates/people.

Include an intentional note in code/content provenance that production story requires a short owner interview.

---

## 20. GALLERY

Route `/gallery`.

Premium editorial/masonry experience.
Filters:
- Food
- Sweets
- Bakery
- Restaurant
- Celebrations

Tasteful lightbox.
Swipe on mobile.

Do not use visibly pixelated imagery.

---

## 21. ORDER HUB

Route `/order`.

Flow:
1. choose location
2. choose ordering method
3. Zomato / Swiggy / Call as available

Do not include a fake `Direct order` button unless clearly marked internal future scope; preferably omit it from customer demo.

---

## 22. GLOBAL NAVIGATION

Desktop:
- logo/wordmark
- Menu
- Sweets & Bakery
- Celebrations
- Bulk Orders
- Our Story
- Locations
- strong `Order Online` CTA

Mobile:
- compact header
- full-height navigation drawer
- persistent bottom utility nav: `Menu | Order | Locations`

At top of page header can integrate with hero.
After scroll: solid/blurred cream state with compact sizing.
Keep motion ~200ms.

---

## 23. MICROINTERACTION LANGUAGE

One consistent system.

Standard reveal:
- opacity 0→1
- y 16→0
- ~500ms

Hover:
- 150–220ms
- image max ~1.03 scale
- small arrow movement
- small elevation only

Press:
- subtle scale ~0.98

Drawer:
- restrained spring

Forms:
- loading state
- inline validation
- success state
- errors readable and recoverable

No interaction should be dead.

Respect `prefers-reduced-motion`.

---

## 24. IMAGE QUALITY

Critical.

Hero source ideally 2400px+.
Food cards roughly 1200x1500 source quality where possible.
Product square images around 1200x1200.
Location/editorial images 1600px+.

Use:
- responsive sizing
- optimized formats
- correct `sizes`
- explicit dimensions/aspect ratios
- lazy loading below fold
- blur placeholder if practical
- intentional `object-position`
- no stretched thumbnails

Art direction:
- warm
- natural texture
- restrained saturation
- no excessive HDR
- no cheesy stock-family imagery
- editorial restaurant architecture
- premium sweets/product photography

If using generic placeholders, make them clearly generic—not falsely claimed as Maosaji property.

---

## 25. PERFORMANCE

Mobile-first and production-minded.

Target where realistically testable:
- LCP <2.5s
- CLS <0.1
- INP <200ms
- strong Lighthouse categories

Do not fake scores.
Report actual measured values if available.

Critical content should render meaningfully without waiting for massive client JS.

Use caching/revalidation sensibly.
Public restaurant data changes infrequently.
When admin changes menu/offer, invalidate relevant cache if using server caching.

---

## 26. RESPONSIVE QUALITY

Design 390px first.

Test:
- 360
- 375
- 390
- 412
- 768
- 1024
- 1440
- 1920

No horizontal overflow.
No clipped headlines.
No desktop-only compositions forced onto mobile.

---

## 27. ACCESSIBILITY

Required:
- semantic headings
- labels
- keyboard navigation
- visible focus
- sufficient contrast
- alt text
- touch targets
- reduced-motion
- usable dialogs/drawers
- screen-reader-friendly navigation

---

## 28. STATES

Every async/data-heavy area needs intentional:
- loading
- empty
- error
- success

Menu zero result example:
`We couldn't find that.`
Then suggested categories.

404:
Tastefully branded, e.g. `Looks like this table is empty.` with routes back.

---

## 29. ANALYTICS EVENT LAYER

Implement an abstraction for useful events:
- menu_search
- menu_item_view
- order_click
- zomato_click
- swiggy_click
- call_click
- directions_click
- whatsapp_click
- celebration_form_started
- celebration_form_submitted
- bulk_form_started
- bulk_form_submitted
- location_selected

Private demo can log/store demo events.
Do not fabricate real analytics.

---

## 30. DOMAIN / SEO ARCHITECTURE

Private demo:
- noindex/nofollow
- private disclaimer

Production-ready route shape:
- `/menu`
- `/menu/[category]` if implemented cleanly
- `/locations`
- `/locations/svm`
- `/locations/mangla`
- `/sweets`
- `/bakery`
- `/celebrations`
- `/bulk-orders`
- `/our-story`
- `/gallery`
- `/order`
- `/contact`

Structure code for:
- canonical URLs
- sitemap
- Restaurant/LocalBusiness schema
- OpenGraph
- Search Console
ONLY after verified production data.

Do not touch the real Maosaji domain or DNS.

---

## 31. SECURITY

If Supabase:
- RLS
- admin-only mutations
- server-side validation
- no service-role in browser
- safe storage policies
- auth roles as feasible

Public forms:
- validation
- sanitization
- basic abuse control / honeypot if practical
- upload limits if uploads exist

Admin architecture should support Owner / Manager / Content Editor roles even if the private demo uses a simplified login.

---

## 32. THINGS NOT TO BUILD IN THIS PHASE

Do NOT spend time on:
- Razorpay
- delivery driver system
- POS integration
- live order tracking
- loyalty points
- customer OTP accounts
- kitchen display
- inventory management

Those are separate future projects.

---

## 33. FILES YOU MUST CREATE IN THE REPOSITORY

Create/update:
- `README.md`
- `BUILD_REPORT.md`
- `QA_REPORT.md`
- `DATA_PROVENANCE.md`
- `REBRAND_GUIDE.md`
- `PRODUCTION_HANDOFF.md`
- `.env.example`
- database migration/schema files if applicable
- demo seed script/data
- critical E2E tests if tooling permits

`DATA_PROVENANCE.md` must distinguish:
- verified public fact
- demo data
- owner confirmation required
- generic placeholder imagery/content

---

## 34. IMPLEMENTATION ORDER

Follow this order unless repo constraints require adjustment:

1. inspect current repo/environment
2. initialize architecture + design tokens
3. build data/provider layer
4. seed verified/demo data
5. global shell/navigation/footer
6. homepage
7. menu + search/filter
8. location system
9. sweets/bakery
10. celebration/bulk forms
11. enquiry flow
12. admin
13. gallery/story/order/contact
14. motion + interaction polish
15. responsive pass
16. accessibility pass
17. image/performance pass
18. private-demo safeguards
19. tests
20. browser QA
21. mandatory final audit

Do not spend hours polishing a minor section while a critical demo flow is broken.

---

## 35. MANDATORY SALES-DEMO ACCEPTANCE FLOW

Before declaring done, execute:

1. open homepage
2. show craving/categories
3. open Menu
4. search `dosa`
5. select an item
6. select/change outlet
7. open Bulk Orders
8. submit DEMO `Corporate gifting — 200 boxes`
9. open admin
10. prove the submitted enquiry exists
11. open menu manager
12. mark a demo item unavailable
13. public menu reflects it
14. restore the item
15. verify footer disclaimer
16. verify noindex

If this fails, fix it and run again.

---

## 36. BROWSER QA

If a browser automation capability exists, USE IT.

Check desktop and mobile visually.
Check console.
Check network.
Check every route.
Check navigation.
Check forms.
Check admin.
Check image rendering.
Check layout at 390px.

Do not say “looks good” without opening the actual rendered application.

---

## 37. FINAL AUDIT

After you think you are finished, open and execute `06_FINAL_AUDIT_PROMPT.md` verbatim as your second pass.

Do not skip it.

Then update `QA_REPORT.md`.

---

## 38. FINAL RESPONSE TO ADITYA

Return only useful handoff information:
- what was built
- URL/local URL
- admin URL
- backend mode (`Supabase` or `DEMO_MODE`)
- demo login method
- whether mandatory demo flow PASS/FAIL
- test/build status
- any unresolved issue
- what still needs owner confirmation
- exact two-minute demo sequence

Do not claim completion if the mandatory demo sequence has not passed.

Start now. Do not ask broad clarification questions. Make reasonable private-demo-safe choices and document them.
