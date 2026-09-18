# Rebrand Guide — Use the Same Platform for Another Restaurant

## Goal
If Maosaji declines, the platform must be reusable with minimal code changes.

## Must be centralized
- restaurant name
- logos
- colors
- type selections
- hero copy
- feature toggles
- locations
- menu categories/items
- ordering links
- public contact data
- social links
- imagery
- SEO metadata

## Example: ORO
Possible feature remapping:
- `Sweets` -> `Cocktails / Dining`
- `Bakery` -> `Experiences`
- `Bulk Orders` -> `Private Events`
- celebrations remain but copy becomes premium events
- Maosaji heritage palette -> ORO brand palette
- same enquiry engine
- same location engine
- same admin
- same media system
- same analytics event layer

## Rule
If rebranding requires editing dozens of JSX/TSX files, architecture has failed.
Aim for:
- config/data changes
- image replacement
- a few optional feature-component swaps
not a rewrite.
