# Mandatory Final Audit Prompt for Zai

Run this ONLY after you believe the website is complete.

You are now the independent QA engineer for the Restaurant Platform you just built. Do not assume your implementation is correct because you wrote it.

## Phase 1 — Re-read source of truth
Re-read:
- the master prompt
- `02_VERIFIED_FACTS.json`
- `03_CONTENT_AND_DATA_RULES.md`
- `05_ACCEPTANCE_TESTS.md`
- the current repository

Create a requirement-to-implementation matrix. Every major requirement must map to an actual route/component/data flow/test or be marked incomplete.

## Phase 2 — Run the application
Start the real application in the same way a user will run it.
Use browser automation if available.

Test at minimum:
- 390px mobile
- 768px tablet
- 1440px desktop

Visit every public and admin route.

Check:
- console errors
- request failures
- broken images
- broken buttons
- dead links
- layout overflow
- unreadable typography
- missing states
- inconsistent colors/spacing/radii
- pixelated images
- accidental dummy/lorem text
- accidental fake factual claims
- unwanted indexing
- accidental live notifications

## Phase 3 — Execute the sales-demo flow exactly
1. Open homepage.
2. Open Menu.
3. Search `dosa`.
4. Add/select a menu item.
5. Select SVM/Mangla.
6. Open Bulk Orders.
7. Submit a DEMO corporate gifting enquiry for 200 boxes.
8. Open admin.
9. Verify the new enquiry is actually visible.
10. Open menu manager.
11. Set one demo item unavailable.
12. Return to public menu and verify the change is reflected.
13. Restore the item.
14. Check the footer private-concept disclaimer.
15. Check noindex headers/meta.

If any step fails, fix it and re-run the entire sequence.

## Phase 4 — Data audit
Search the entire repository for:
- `1917`
- `official`
- `best in Bilaspur`
- invented review names
- hard-coded unverified opening hours
- hard-coded unverified prices
- production-looking analytics numbers
- Maosaji email/phone notifications
- TODO
- FIXME
- lorem
- placeholder
- `example.com`
- broken image paths

Explain every remaining occurrence.

## Phase 5 — Security/config audit
Verify:
- no secret committed
- no service role secret client-side
- RLS is present if Supabase is active
- public forms have server-side validation or equivalent demo-safe validation
- admin mutation path is protected in production architecture
- file uploads have limits if present
- demo notifications cannot reach Maosaji

## Phase 6 — Performance/accessibility
Run available automated checks.
Manually check:
- keyboard navigation
- focus visibility
- reduced motion
- alt text
- form labels
- image sizing
- mobile tap targets

## Phase 7 — Final report
Write `QA_REPORT.md` with:
1. PASS/FAIL summary
2. exact backend mode
3. routes tested
4. demo flow test result
5. browser sizes tested
6. console/network status
7. performance results
8. accessibility issues
9. data-provenance issues
10. known limitations
11. what is safe to demo tomorrow
12. what must wait for owner confirmation
13. remaining production work

Do NOT mark the project done if a core demo flow fails.

The final chat response to Aditya must be concise and contain:
- deployment/local URL
- admin URL
- backend mode
- demo login method
- exact demo sequence
- PASS/FAIL
- unresolved issues
