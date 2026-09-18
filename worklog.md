# Worklog — Restaurant Platform v1 (Maosaji private concept)

## Project
Private Maosaji sales-demo implementation of a reusable **Restaurant Platform v1**.
Source of truth: `/home/z/my-project/build-pack/maosaji_zai_build_pack_2026-09-18/`

## Key decisions (read before working)
- **Backend mode: DEMO_MODE** — no Supabase credentials exist in this environment.
  - Persistence is server-side via Prisma + SQLite (`db/custom.db`), which exceeds the pack's localStorage requirement (survives refresh AND works across browsers).
  - A `DataProvider` abstraction exists at `src/lib/data-provider/` — same interface can be swapped for Supabase later without UI changes (documented in README + REBRAND_GUIDE).
- **Private-demo safety**: `noindex,nofollow` meta + `X-Robots-Tag` header + robots.txt disallow + footer disclaimer `Private concept prepared for Maosaji. Not the official Maosaji website.` No notifications are ever sent to Maosaji (no email/WhatsApp/SMS integration wired).
- **Facts**: only `02_VERIFIED_FACTS.json` facts used (2 locations w/ verified Zomato/Swiggy links + reference phones, public menu breadth). No invented history/prices/hours/reviews. Prices show `Price available on ordering partner`. Hours show nothing (unconfirmed).
- **Reusability**: restaurant identity centralized in `src/config/restaurant.ts`; DB tables are generic (`Location`, `MenuItem`, `Enquiry`, `Offer`, `SiteSetting`, `AnalyticsEvent`) — no `maosaji_*` names.
- **Admin demo login**: passcode-based cookie session (default passcode `demo2026`, shown as hint on login page since it is a private demo). Documented for swap to Supabase Auth.
- **Stack**: Next.js 16 App Router, TypeScript, Tailwind 4 + shadcn/ui, Framer Motion, Zod, Prisma/SQLite, next/image.
- **Images**: AI-generated generic placeholder food photography (warm editorial style), stored in `public/images/`, labelled as generic placeholders in DATA_PROVENANCE.md. Never claimed as Maosaji property.

## Status
- [x] Build pack fully read (all 12 files)
- [ ] Foundation in progress

---
Task ID: 0
Agent: main (Z.ai Code)
Task: Extract build pack, read all sources, plan

Work Log:
- Extracted ZIP to /home/z/my-project/build-pack/
- Read all 12 pack files in full
- Verified environment: Next 16 dev server on :3000, Tailwind 4, shadcn/ui complete, Prisma/SQLite ready
- Confirmed NO Supabase credentials → DEMO_MODE selected per master prompt §4

Stage Summary:
- Ready to build. Route plan: /, /menu, /locations(+/svm,/mangla), /sweets, /bakery, /celebrations, /bulk-orders, /our-story, /gallery, /order, /contact, /privacy, /terms, /admin/* + /api/*.

---
Task ID: 1
Agent: main (Z.ai Code)
Task: Foundation — schema, config, tokens, provider, APIs, shell, homepage

Work Log:
- Prisma schema pushed (generic: Location, MenuCategory, MenuItem, Enquiry, Offer, SiteSetting, AnalyticsEvent)
- src/config/restaurant.ts — central brand config (verified facts only)
- src/lib/seed-data.ts — idempotent ensureSeeded() with 29 demo menu items (prices null), 2 locations, 3 demo enquiries, 1 demo offer, settings
- src/lib/data-provider/{types,demo-provider,index}.ts — DataProvider abstraction; DEMO_MODE active (no Supabase creds)
- src/lib/{store,analytics,analytics-api,admin-auth}.ts — zustand order/outlet store, event layer, passcode session (default demo2026)
- globals.css — Modern Indian Heritage tokens (ivory #faf6ef, deep red #8e1f2f, brass #b08d4a, charcoal, veg green) + grain/motif utilities + reduced-motion
- Root layout: Fraunces + Public Sans, noindex,nofollow metadata; middleware adds X-Robots-Tag; robots.txt disallows all
- API routes: GET /api/menu|offers|locations|settings, POST /api/enquiries (Zod+honeypot), POST /api/analytics, admin/{login,logout,session,enquiries,enquiries/[id],menu,menu/[id],settings,analytics}
- Site shell: Navbar (scroll-state, mobile drawer), Footer (private disclaimer), MobileBottomNav (Menu|Order|Locations), OrderDrawer (order list w/ outlet switch, Zomato/Swiggy, WhatsApp copy)
- Shared: Reveal, SectionHeader, VegBadge, PriceTag, AddToOrderButton, EnquiryFormShell+Field
- Homepage: hero (92svh, motion), cravings rail, featured favourites (DB-driven), demo offer, pathways, story teaser, reviews links, bakery/bulk teasers
- Images: patient background generator running (~55s/image, 49 left). Paths are fixed — components already reference them.

Stage Summary:
- Foundation complete. Pages delegated next. Design language: see worklog top + (site)/page.tsx as reference.
- IMPORTANT for all agents: prices→PriceTag(null), hours→omit, no invented facts, no blue/indigo, use Reveal for motion, border-border hairlines, font-serif headings.

---
Task ID: 2-e
Agent: main (Z.ai Code)
Task: Gallery, Our Story, Privacy, Terms, root 404

Work Log:
- src/components/site/gallery-grid.tsx — client component: 20-image editorial masonry (CSS `columns-2 sm:columns-3 lg:columns-4 gap-4`, `break-inside-avoid`, varied aspect classes), filter chips (All/Food/Sweets/Bakery/Restaurant/Celebrations, aria-pressed + counts), key-remount `animate-in fade-in-0` on filter change, hover/focus caption overlay, shadcn Dialog lightbox (dark charcoal panel, object-contain stage, caption + category + "n of N · generic placeholder photography", prev/next as 44px overlay circles AND footer buttons, Esc native via Radix, ArrowLeft/ArrowRight navigate, aria-live announcement). All 20 exact image paths referenced; alts always say "(generic placeholder photography)" and never claim Maosaji premises.
- src/app/(site)/gallery/page.tsx — static server page: sr-only h1 + SectionHeader (eyebrow "Gallery", title "A look inside"), Reveal, footnote "Placeholder photography for the private concept — production would use owner-approved originals." with Camera icon. Title metadata "Gallery".
- src/app/(site)/our-story/page.tsx — static: h-[38vh] hero band (hero-story.jpg, top+bottom charcoal scrims, grain, eyebrow "Our story", h1 = config story.heading); story.body verbatim as lead + 3 factual-only paragraphs (offering breadth, SVM + Mangla names only, Zomato/Swiggy listing — no dates/founders/history); provenance callout = config story.note verbatim in bordered card with inset brass left bar + "To be completed with the owner" label; values strip (Leaf/Sun/Users/Heart, generic non-factual copy, cream band); link cards to /menu and /locations in homepage pathway style. Title metadata "Our Story".
- src/app/(site)/privacy/page.tsx — static prose (max-w-2xl, space-y-4, text-sm sm:text-base leading-relaxed): what the demo collects (enquiry fields → local demo backend; local analytics events → demo admin), no third-party trackers, cookies section (outlet + order list in local storage; single httpOnly admin session cookie, 12h — matches admin-auth.ts), contact expectations (enquiries are demos, order via partners), unofficial/not-affiliated statement, name-and-marks. Last updated 18 September 2026.
- src/app/(site)/terms/page.tsx — same prose pattern: unofficial/private concept, no orders/payments (ordering on partner platforms, their terms apply after link-out), enquiries are demonstrations, no warranty of accuracy (demo data), imagery is generic placeholder photography, trademark belongs to owner, changes clause. Last updated 18 September 2026.
- src/app/not-found.tsx — root 404 outside (site) group, self-contained shell: minimal header (config displayName wordmark + "Back to home", both Link /), centered min-h-screen ivory, motif-bg corner accents at opacity-[0.05], brass diamond ornament, "404 · Not found" eyebrow, serif "Looks like this table is empty." + "The page you're after isn't on the menu.", 48px buttons "Return home" (deep red) and "Explore the menu" (outline, Link /menu), "Private concept — not the official Maosaji website." line.
- Verification (per instructions no dev/build/lint run by me — used the already-running dev server): curl /gallery /our-story /privacy /terms → all 200; unknown route → 404 rendering the branded page (heading/buttons verified in HTML); key content strings (config copy, callout label, last-updated date, footnote) verified in rendered HTML; dev.log clean for all five routes.

Stage Summary:
- All five deliverables complete and rendering. Design language followed (ivory/deep red/brass/charcoal, font-serif headings, hairlines, rounded-xl, hover lift, Reveal, no blue/indigo, 44px+ touch targets, focus-visible rings, semantic HTML).

Deviations / notes for other agents:
1. not-found.tsx exports NO metadata deliberately — root layout default title ("Maosaji — Private Concept (Unofficial)") covers it; metadata support in the not-found file convention is not guaranteed across Next versions.
2. gallery/privacy/terms use SectionHeader (renders h2) per task, so each page adds an sr-only h1 for a proper document outline.
3. gallery/privacy/terms content starts at pt-24 sm:pt-28 to clear the fixed transparent navbar (h-16 sm:h-20); our-story hero sits under it intentionally with a top scrim for wordmark legibility.
4. Sections use aria-label (not aria-labelledby) because SectionHeader doesn't render element ids — avoids dangling label references (note: homepage currently has some dangling aria-labelledby refs, not mine to fix).
5. Lightbox prev/next exist twice (44px overlay circles over the image + labeled footer buttons) for touch + keyboard/mouse ergonomics; both call the same step().
6. Transient 500 on the very first /gallery request during parallel-agent compilation; every subsequent request is a clean 200 (dev.log).
---
Task ID: 2-a
Agent: main (Z.ai Code)
Task: Menu centerpiece — /menu route, MenuExperience, ItemSheet, EmptyMenuState

Work Log:
- Found the four owned files already present in substantial form (an earlier unlogged attempt — no Task 2-a entry existed). Reviewed every line against the acceptance bar, then completed the one missing requirement and verified the whole flow live.
- src/app/(site)/menu/page.tsx — server component: getProvider() → categories + items + locations passed to MenuExperience; `export const dynamic = "force-dynamic"` (admin availability changes reflect immediately); metadata title "Menu".
- src/components/menu/menu-experience.tsx — client experience:
  • Instant search (no reload) over name + description + category name; debounced `menu_search` track() at 400ms, only when trimmed query length ≥ 2.
  • Prominent search input (h-12, rounded-xl) — placeholder "Search dosa, thali, sweets…", custom clear (X) button, `type="search"`, aria-label, autoComplete off, enterKeyHint="search", aria-describedby → aria-live result count ("Showing N dishes for 'q'" / "…across M categories").
  • Sticky category rail BELOW the search: `sticky top-14 sm:top-16 z-30 border-b border-border bg-background/95 backdrop-blur` (navbar is fixed h-14 sm:h-16 when solid); chips = "All" + the 10 seeded categories driven from the categories prop (empty "popular" category still gets a chip; its section is skipped in the body).
  • Scroll-spy: IntersectionObserver on section elements (rootMargin "-120px 0px -55% 0px", topmost visible wins, sentinel keeps "All" at top); chip click → smooth scroll via `scroll-mt-32 sm:scroll-mt-36` sections; prefers-reduced-motion respected for all programmatic scrolling.
  • Mobile: rail horizontally scrollable (no-scrollbar); ACTIVE chip auto-scrolls into view (`scrollIntoView({ inline: "center" })`).
  • Category sections in `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`; searching swaps sections for a single flat "Results" grid.
  • UNAVAILABLE items stay visible: card `opacity-60`, image `grayscale`, "Unavailable" badge, disabled add button (aria-label "<name> is currently unavailable") — verified live by PATCHing masala-dosa via admin API then reverting.
  • Outlet chips "All outlets" / "SVM" / "Mangla" filter by locationSlugs (empty array = all), persisted through useSiteStore outlet ("" = all); `mounted` guard avoids hydration mismatch with the persisted store.
  • "Pure Veg" toggle (aria-pressed, veg-green styling) filters isVegetarian.
  • Item cards: square next/image (sizes 50vw/33vw/25vw, lazy), VegBadge + name, category label chip, line-clamp-2 description, PriceTag, AddToOrderButton (from ./add-to-order-button); card is focusable (tabIndex 0, role="button", Enter/Space opens sheet — keydown guarded so the inner add button stays independent), brass focus-visible rings, rounded-xl, hover:-translate-y-0.5 hover:shadow.
  • ADDED (was missing): `?category=sweets` deep-link support — MenuExperience now wraps MenuExperienceInner in a Suspense boundary (branded animate-pulse fallback) because the inner component reads useSearchParams; effect applies the param once per value (ref-guarded, StrictMode-safe): clears any search and pending-scrolls to that category section with the chip highlighted. Unknown slugs are ignored gracefully.
- src/components/menu/item-sheet.tsx — shadcn Sheet, side="bottom" on mobile converted to a right-side panel at sm: via CSS override (w-[28rem], right slide animations neutralized with `!` utilities — verified against tw-animate-css functional utilities): large 16/10 image, brass category eyebrow, SheetTitle serif name + VegBadge, description, PriceTag, "Available at" line from locationSlugs (empty = "Available at all outlets"), quantity stepper + "Add to order list" (addItem with qty, green Added confirmation, disabled when unavailable), "Order this item — <outlet>" Zomato/Swiggy links from the selected outlet (falls back to first outlet, mirroring the order drawer), `menu_item_view` tracked on every open.
- src/components/menu/empty-menu-state.tsx — "We couldn't find that." with contextual copy (query vs filters), suggested category chips, "Clear search"/"Clear filters" + "Explore full menu" (Link /menu) actions, dashed brass border card.
- Verification (no dev/build/lint run by me — used the already-running dev server): curl /menu, /menu?category=sweets, /menu?category=north-indian, /menu?category=unknown-slug → all 200; SSR HTML checks (search placeholder, sticky rail, All outlets/SVM/Mangla/Pure Veg chips, 28 cards, 9 non-empty sections, aria-live count, 28 × "Price available on ordering partner"); admin PATCH isAvailable=false → grayscale + opacity-60 + Unavailable badge + disabled button confirmed in HTML → reverted; POST /api/analytics menu_search + menu_item_view → 204 accepted; dev.log clean for /menu.

Stage Summary:
- Menu centerpiece complete and verified against every acceptance item. Design language matches (site)/page.tsx: font-serif headings, SectionHeader "Explore the Menu", Reveal, hairline borders, rounded-xl cards, hover lift, no blue/indigo, deep red #8e1f2f CTAs, brass #b08d4a accents. No invented facts (prices → PriceTag(null) copy everywhere).

Deviations / notes for other agents:
1. Files pre-existed from an unlogged earlier attempt; I reviewed them in full, added the missing ?category= deep-link (Suspense + useSearchParams) and left the rest as verified rather than rewriting.
2. Rail stickiness uses top-14 sm:top-16 per spec (matches the navbar's solid height). At the very top of /menu the navbar is still in its transparent h-16 sm:h-20 state until scrollY > 24 — momentary 8px overlap only before first scroll, imperceptible in practice.
3. "popular" seed category has no items, so 9 sections render while the rail shows all 10 chips + All — intentional (chips are prop-driven; empty sections are skipped).
4. IMAGES: only 4 of the 28 referenced item images exist in public/images/items/ (masala-dosa, motichoor-laddoo, dry-fruit-box, festive-sweets-box) — task 1's background generator appears to have stopped. Cards degrade gracefully (cream bg + alt), but someone should resume generation; paths are fixed in seed-data.ts.
5. ItemSheet "Order this item" links track zomato_click/swiggy_click with from: "item-sheet" so admin analytics can distinguish the source.

---
Task ID: 2-b
Agent: main (Z.ai Code)
Task: Locations index + outlet detail pages, Order hub, Contact page, contact form, location card

Work Log:
- NOTE: found all six deliverables already present on disk from an interrupted earlier 2-b run (no worklog entry existed). Reviewed every file line-by-line against the task spec, then verified + fixed. All six are mine per ownership list.
- src/components/site/location-card.tsx — client module ("use client"): LocationCardData serializable shape; LocationCard (image → /locations/[slug], name, address, phone "(as listed publicly)", "Hours to be confirmed for production" note, Directions (deep red, Google Maps search handoff `?api=1&query=name,address`, target _blank, track directions_click), Call (tel:, track call_click), View menu → /menu, "Order from here" → /order?outlet=slug (track order_click)); motif-bg fallback when no image. Also exports TrackedAnchor (anchor + onClick analytics for tel/maps/partner links from server components) and TrackOnMount (fires one event on mount) — used by [slug] page + order-hub.
- src/app/(site)/locations/page.tsx — server, force-dynamic; loads active locations via getProvider() with verified-config fallback; SectionHeader "Find us" / "Find Your Maosaji"; LocationCard grid md:grid-cols-2 with Reveal + hover lift; honest-data footnote (phones as publicly listed, hours unconfirmed, no map embeds); "Found your outlet?" next-steps cards (order / celebrations / bulk).
- src/app/(site)/locations/[slug]/page.tsx — server, force-dynamic, notFound() on unknown slug (404 verified); generateMetadata per outlet; h-[40vh] hero (gallery[0], gradient overlay, grain, name + address overlay, pt for fixed navbar); back link; Visit card (address, phone "(as listed publicly)" + tracked tel: link + "Call outlet" button, hours note, Get directions button); "Order from this outlet" Zomato (#c0392b) + Swiggy (#b96414) real verified URLs, target _blank, zomato_click/swiggy_click with location slug; "no payment is taken on this site" note; TrackOnMount location_selected from outlet-page. Menu availability: provider items filtered to isAvailable && (locationSlugs empty || includes slug), compact rows (VegBadge + name + PriceTag), 8 preview + "+N more", link to /menu; empty-state fallback. Gallery section only when gallery.length > 1 (hero consumes gallery[0], section shows the rest — single-image outlets omit gracefully). Cross-link card to the other outlet.
- src/app/(site)/order/page.tsx + order-hub.tsx — server page (force-dynamic, resolves ?outlet= param, loads outlets from provider w/ config fallback) + co-located client component. Step 1 "Where would you like to order from?": selection cards (image, shortName, address, aria-pressed selected state with check + deep-red ring, 44px+ targets), persists via useSiteStore.setOutlet, tracks location_selected; ?outlet=svm preselect seeds initial state (param wins over localStorage, applied once on mount — no SSR flash). Step 2 "How would you like to order?": big tappable Zomato / Swiggy / Call cards for the SELECTED outlet (default = first outlet), Zomato red #c0392b + Swiggy orange #b96414 partner-branding accents, tel: with "(as listed publicly)", zomato_click/swiggy_click/call_click tracked with location slug. NO direct-order button, NO fake checkout; "routes you to existing ordering partners — no payment is taken on this site" note in both header and step 2.
- src/app/(site)/contact/page.tsx — server, force-dynamic; "Get in touch" header explains routing (outlets → Locations, orders → Order, celebrations/bulk/cake → their forms, else general message); directory card with 5 quick routes; ContactForm in bordered card; "Prefer to drop by?" mini outlet cards (image, name, address) linking to each outlet page + "All locations" → /locations link.
- src/components/forms/contact-form.tsx — REWRITTEN this run (2 real bugs fixed, see deviations): EnquiryFormShell type="contact"; fields name*/phone*/email(optional)/subject(optional select General|Feedback|Bulk enquiry|Cake enquiry)/message* min 10 chars; buildPayload via new FormData(form); onStarted → track contact_form_started (once, ref-guarded). Fixes: (1) subject had no DB column and was silently dropped by the API → now folded into message ("Feedback — …") following the celebration-form eventType pattern ("General" stays silent); (2) the min-10 capture-phase submit guard attached only on first mount → after success + "Submit another" the shell mounts a NEW <form> and the guard never re-attached → now the textarea ref callback tracks the live form element in state and the effect re-registers on every form identity change.
- Verification (no dev/build/lint run by me — used the already-running dev server): curl /locations, /locations/svm, /locations/mangla, /order, /order?outlet=mangla, /contact → all 200; unknown slug → 404 with branded page; rendered HTML contains verified Zomato/Swiggy URLs, google.com/maps/search handoffs, tel: links, hours notes, "no payment…" copy; `bunx tsc --noEmit` → ZERO errors in all six of my files (pre-existing errors elsewhere, see notes). Browser-tested with agent-browser @390px + 1280px: short message blocked client-side with inline error and NO network request; valid submit → success panel + reference CO-2026-0008; "Submit another" → short message blocked again (remount fix proven); DB record shows folded subject "Feedback — This is a sufficiently long test message for the demo."; order hub: ?outlet=mangla preselect (aria-pressed), clicking SVM swaps partner links + persists {"outlet":"svm"} to localStorage; analytics events confirmed in DB (contact_form_started, contact_form_submitted, location_selected from order-hub). VLM visual QA on 6 screenshots: no broken images/overlap, ivory+deep-red+serif palette, no blue/indigo. dev.log clean for all my routes.

Stage Summary:
- All six deliverables complete, type-clean, rendering and analytics-verified. Data honesty rules enforced throughout: no hours, reference-only phones, no map embeds, verified partner URLs only.

Deviations / notes for other agents:
1. /contact mini outlet cards link to /locations/[slug] (each outlet's detail page) rather than bare /locations — the section header carries an explicit "All locations" → /locations link. Interpretation: "linking to /locations" = linking into the locations section; per-outlet targets are strictly more useful. Flag if the letter of the spec is preferred.
2. contact-form subject folding: the enquiry schema has no subject column, so the API route (Task 1's file) validates then drops it. I fold non-"General" subjects into the message prefix, matching the established celebration/bulk pattern. If a subject column is ever added, remove the fold.
3. contact-form min-10-char guard: server Zod treats contact message as optional (only max 1500), so the minimum is enforced client-side with a capture-phase native submit listener on the form (stopPropagation prevents the shell's React onSubmit — verified React 19 dispatches bubble onSubmit from the root container). If the server schema ever enforces min length, the guard can be deleted.
4. /order page is page.tsx + co-located client component order-hub.tsx (the "small client component" pattern, mirroring locations). File count: 7 files total in my set.
5. location-card.tsx also exports TrackedAnchor + TrackOnMount primitives — server pages (locations/[slug]) import them from there; keep that module client-side.
6. Outlet detail page fires location_selected once on mount (from "outlet-page") — reasonable analytics interpretation of "find your outlet"; not in the literal spec.
7. Test residue left in demo DB (consistent with other agents): contact enquiry CO-2026-0008 ("Test Visitor", subject folded) + analytics events from my browser session. Safe to clear from admin demo.
8. PRE-EXISTING tsc ERRORS NOT MINE (for coordinator to delegate): src/app/api/enquiries/route.ts:94 `data.eventDate` fails on the contact branch of the discriminated union (TS2339); navbar.tsx:76 nav-vs-"/" comparison (TS2367); menu-experience/order-drawer/item-sheet 'never' narrowing errors; examples/ + skills/ script errors. None are in my files; dev server unaffected (SWC strips types).

---
Task ID: 3
Agent: main (Z.ai Code)
Task: Visual Experience + Media Direction Override — cinematic rebuild, GitHub repo prep

Work Log:
- Read addendum in full; studied jfvegancafe.com live at 1440px/390px + menu page via agent-browser; VLM design analysis captured (gallery mentality, breath-pause-breath rhythm, 2–6 word sections, specimen imagery, dramatic type scale)
- Created MEDIA_PLAN.md (design analysis, 10-section storyboard, full media inventory with provenance labels, crop strategy, performance budget, production swap checklist)
- New design system: retuned palette (ivory #f7f1e6 / masala red #7e1e2c / brass #ac8b4c / espresso #191410), Fraunces (SOFT 55, WONK off, italic) + Figtree via next/font, display-xl/lg/md/sm clamps, eyebrow/arch-mask/circle-mask/soft-mask/film-grade/quiet-link utilities, Ken Burns keyframes
- CRITICAL FIX: `font-display` utility never generated (self-referential theme token) → headings silently fell back to body sans; migrated everything to `font-serif` (mapped to --font-display), verified Fraunces renders (computed h1 184px Fraunces)
- Built src/components/site/cinema/: film-frames (crossfade+Ken Burns engine, portrait derivatives <sm, IntersectionObserver+visibility pause, reduced-motion static), film-hero (95svh, 6-shot film, restrained overlay, mobile bottom-bar clearance), brand-statement (ONE NAME/MANY CRAVINGS + arch/circle specimen cutouts + parallax + stats), eat-chapter (EAT. sticky media rail w/ scroll-spy, mobile inline), sweet-chapter (dark SWEET. + tall/wide macros + scroll-drift rail), bakery-chapter, menu-discovery (WHAT ARE YOU CRAVING? live search over FULL menu + featured default + see-all-results link), celebrate-chapter (MORE THAN A MEAL), locations-chapter (alternating SVM/Mangla editorial), story-chapter (kitchen-hands overlap image), final-cta (chai pour + 3 quiet doors); page-hero for commercial pages
- Rewrote navbar (adaptive dark-top routes/ivory-solid, editorial wordmark, quiet links), footer (espresso editorial, big wordmark), section-header (display voice); deleted dead hero.tsx
- Homepage page.tsx → 10-section cinematic narrative + DB-driven offer strip (preserved)
- menu-experience: added ?q= deep-link (homepage search handoff), header → "What are you craving?", sticky rail top fix
- Swept ~41 files of hardcoded old-palette hexes to design tokens (bg-brand/text-ink/bg-ivory/…)
- 56-image cinematic generation queue (generate-v2.ts): hero film frames (landscape+portrait), chapters, brand cutouts, all 17 missing item images, 3 category images, 5 gallery images — running detached
- React key warning fixed (JSX fragment in MaskedLines lines array needed key)
- Fixed all fill-image static-parent warnings (relative on masked figures)
- Lint: fixed all 12 problems (new react-hooks/set-state-in-effect rule) → eslint exit 0
- README.md written (overview, stack, quickstart, demo sequence, layout, data rules, rebrand guide, production checklist); .gitignore hardened (db, upload, scratch dirs)
- GitHub: token ghp_GuV… rejected by API (401 Bad credentials both `token` and `Bearer` formats — likely auto-revoked by secret scanning); repo prepared locally with author hello-aditya-dev <hi.dev.aditya@gmail.com>, push pending valid token

FUNCTIONAL QA (agent-browser, all PASS):
- /menu search "dosa" → 3 dishes; ?q=dosa deep link prefills; homepage search "laddoo" → 1 result (full-menu search)
- Item sheet: Masala Dosa → Zomato link + add-to-order present
- Bulk order: 200 boxes corporate gifting enquiry submitted → reference BO-2026-0013
- Admin login (demo2026) → Enquiries shows BO-2026-0013
- Menu Manager toggle → public menu opacity-60+grayscale+disabled → restored (all available)

Stage Summary:
- Cinematic override implemented without weakening any acceptance test; all demo flows verified live
- GitHub blocked ONLY by invalid token — everything else committed and ready
