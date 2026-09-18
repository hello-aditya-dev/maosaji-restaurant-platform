# Production Handoff Checklist — Only After Maosaji Approves

Do NOT perform these operations for the private concept unless the owner explicitly authorizes them.

## Discovery with owner
Confirm:
- legal/brand name
- primary decision-maker
- official logo files
- brand color references
- approved photography
- verified business history
- correct outlet list
- address + phone for each outlet
- correct opening hours
- current menu and prices
- products available by outlet
- official social accounts
- official Zomato/Swiggy links
- bulk/catering processes
- which employees need admin access

## Domain/DNS
Confirm ownership and credentials for all current domains.
Before any DNS change, record:
- A
- AAAA
- CNAME
- MX
- TXT
- SPF
- DKIM
- DMARC
- subdomains

Never break email while migrating web hosting.

Choose one canonical domain only after owner approval.
Redirect secondary domains with appropriate 301 redirects after verifying ownership.

## Production backend
- real Supabase project
- migrations applied
- RLS tested
- admin users provisioned separately
- backups
- production notification destination
- rate limiting / abuse protection
- storage policies
- audit log

## SEO
- remove noindex only at authorized launch
- Search Console
- analytics
- sitemap
- canonical URLs
- LocalBusiness/Restaurant structured data based on verified information
- social previews

## Launch
- owner staging approval in writing
- second payment according to contract
- production deploy
- domain cutover
- smoke tests
- monitor
- 30-day defect warranty starts
