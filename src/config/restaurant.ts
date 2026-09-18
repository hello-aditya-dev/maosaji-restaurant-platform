/**
 * RESTAURANT PLATFORM v1 — Central brand configuration.
 * ─────────────────────────────────────────────────────
 * This file + seed data + images is ALL that identifies the site as "Maosaji".
 * To rebrand the platform for another restaurant, change this config, the seed
 * data and the imagery — no component rewrites are required.
 *
 * FACTS SOURCE: build-pack/02_VERIFIED_FACTS.json (as of 2026-09-18).
 * Do not add unverified facts (history, hours, prices, reviews) here.
 */

export const restaurant = {
  slug: "maosaji",
  displayName: "Maosaji",
  eyebrow: "RESTAURANT • SWEETS • BAKERY • NAMKEEN",
  tagline: "A Bilaspur favourite, served every day.",
  city: "Bilaspur",

  isOfficial: false,
  demoDisclaimer: "Private concept prepared for Maosaji. Not the official Maosaji website.",

  features: {
    sweets: true,
    bakery: true,
    bulkOrders: true,
    celebrations: true,
    multiLocation: true,
    gallery: true,
    ourStory: true,
    directCheckout: false, // phase one routes to ordering partners only
  },

  nav: [
    { label: "Menu", href: "/menu" },
    { label: "Sweets", href: "/sweets" },
    { label: "Bakery", href: "/bakery" },
    { label: "Celebrations", href: "/celebrations" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Our Story", href: "/our-story" },
    { label: "Locations", href: "/locations" },
  ],

  mobileBottomNav: [
    { label: "Menu", href: "/menu" },
    { label: "Order", href: "/order" },
    { label: "Locations", href: "/locations" },
  ],

  hero: {
    eyebrow: "RESTAURANT • SWEETS • BAKERY • NAMKEEN",
    title: "Maosaji",
    line: "A Bilaspur favourite, served every day.",
    primaryCta: { label: "Explore Menu", href: "/menu" },
    secondaryCta: { label: "Order Online", href: "/order" },
    tertiary: { label: "Find a Maosaji near you", href: "/locations" },
    image: "/images/hero-main.jpg",
    alt: "An overhead composition of an Indian vegetarian feast with thali, sweets and chai",
  },

  cravings: [
    { label: "Restaurant", href: "/menu?category=north-indian", image: "/images/cat-restaurant.jpg" },
    { label: "Sweets", href: "/menu?category=sweets", image: "/images/cat-sweets.jpg" },
    { label: "Cakes & Bakery", href: "/menu?category=bakery-cakes", image: "/images/cat-bakery.jpg" },
    { label: "Chaat & Snacks", href: "/menu?category=chaat-snacks", image: "/images/cat-chaat.jpg" },
    { label: "Namkeen", href: "/menu?category=namkeen", image: "/images/cat-namkeen.jpg" },
    { label: "Beverages", href: "/menu?category=beverages", image: "/images/cat-beverages.jpg" },
  ],

  // Verified public listings ONLY (02_VERIFIED_FACTS.json → svm/mangla records).
  locations: [
    {
      slug: "svm",
      name: "Srikant Verma Marg",
      shortName: "SVM",
      address: "Shrikant Verma Marg, Near Rama Magneto Mall, Telipara, Bilaspur",
      phoneReferenceOnly: "+91 91525 49189",
      phoneNote: "Number as listed publicly on Zomato; confirm with owner before production use.",
      hours: null,
      hoursStatus: "UNCONFIRMED_IN_PRODUCTION",
      ordering: {
        zomato: "https://www.zomato.com/bilaspur/maosaji-svm-telipara/order",
        swiggy: "https://www.swiggy.com/city/bilaspur/maosaji-shrikant-verma-marg-talapara-rest157837",
      },
      image: "/images/locations/svm.jpg",
    },
    {
      slug: "mangla",
      name: "Mangla Chowk",
      shortName: "Mangla",
      address: "Maosaji Mangla Chowk, Mungeli Road, Bilaspur, Chhattisgarh",
      phoneReferenceOnly: "+91 91119 74447",
      phoneNote: "Number as listed publicly on Zomato; confirm with owner before production use.",
      hours: null,
      hoursStatus: "UNCONFIRMED_IN_PRODUCTION",
      ordering: {
        zomato: "https://www.zomato.com/bilaspur/maosaji-narmada-nagar/order",
        swiggy: "https://www.swiggy.com/city/bilaspur/maosaji-mangla-chowk-narmada-nagar-rest259175",
      },
      image: "/images/locations/mangla.jpg",
    },
  ],

  theme: {
    // Centralized tokens — production colors require extraction from owner-approved brand assets.
    primary: "#8E1F2F", // deep brand red
    accent: "#B08D4A", // muted brass
    background: "#FAF6EF", // warm ivory
    surface: "#F3EDDF", // cream
    ink: "#26211B", // charcoal
    veg: "#2E7D4F", // restrained green — vegetarian indicator only
  },

  social: [] as { label: string; href: string }[], // owner confirmation required before production

  story: {
    heading: "A familiar name in Bilaspur.",
    body: "From restaurant favourites to sweets, bakery products and everyday snacks, Maosaji serves a wide range of food across its Bilaspur locations.",
    note: "Our Story is intentionally limited in this private concept. The verified history should be documented together with the owner — nothing on this page invents dates, founders or family history.",
  },

  reviews: {
    heading: "Loved around Bilaspur",
    note: "Review counts and ratings change often and belong to third-party platforms. This concept links to the platforms rather than quoting them.",
    links: [
      { label: "View on Zomato (SVM)", href: "https://www.zomato.com/bilaspur/maosaji-svm-telipara/order" },
      { label: "View on Swiggy (SVM)", href: "https://www.swiggy.com/city/bilaspur/maosaji-shrikant-verma-marg-talapara-rest157837" },
    ],
  },
} as const;

export type RestaurantConfig = typeof restaurant;
export type RestaurantLocation = (typeof restaurant.locations)[number];

/**
 * Display label for a location — shortName preferred, full name as fallback.
 * The cast keeps the `??` fallback rebrand-safe: with `as const` config both
 * locations have a shortName, but a rebranded location may omit it.
 */
export function locationLabel(loc: RestaurantLocation | null | undefined): string {
  return (loc?.shortName as string | undefined) ?? loc?.name ?? "";
}
