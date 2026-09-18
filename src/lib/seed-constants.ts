/**
 * PURE seed constants — no database imports.
 * ─────────────────────────────────────────
 * Shared by the SQLite demo provider (via ensureSeeded) and the in-memory
 * provider (serverless/zero-config deploys), so both modes seed identically.
 *
 * DEMO_MODE seed data — derived from build-pack/04_SEED_DATA.json.
 * - Item names follow the publicly verified menu breadth (02_VERIFIED_FACTS.json → public_menu_breadth)
 * - Prices are intentionally null → UI shows "Price available on ordering partner"
 * - Descriptions are neutral/generic (no invented claims)
 * - Seed enquiries are labelled isDemoData
 */

export const SEED_CATEGORIES = [
  { slug: "popular", name: "Popular", displayOrder: 0 },
  { slug: "thali", name: "Thali", displayOrder: 1 },
  { slug: "north-indian", name: "North Indian", displayOrder: 2 },
  { slug: "south-indian", name: "South Indian", displayOrder: 3 },
  { slug: "chinese", name: "Chinese", displayOrder: 4 },
  { slug: "chaat-snacks", name: "Chaat & Snacks", displayOrder: 5 },
  { slug: "sweets", name: "Sweets", displayOrder: 6 },
  { slug: "bakery-cakes", name: "Bakery & Cakes", displayOrder: 7 },
  { slug: "namkeen", name: "Namkeen", displayOrder: 8 },
  { slug: "beverages", name: "Beverages", displayOrder: 9 },
];

export type SeedItem = {
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  priceCents: number | null;
  isVegetarian: boolean;
  isFeatured: boolean;
  imageUrl: string | null;
  locationSlugs: string[]; // [] => available at every location
};

export const SEED_MENU_ITEMS: SeedItem[] = [
  // Thali
  { slug: "maosaji-thali", name: "Maosaji Thali", categorySlug: "thali", description: "A generous vegetarian thali served with seasonal preparations.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/maosaji-thali.jpg", locationSlugs: [] },
  // South Indian
  { slug: "masala-dosa", name: "Masala Dosa", categorySlug: "south-indian", description: "Crisp dosa served with a spiced potato filling, sambar and chutneys.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/masala-dosa.jpg", locationSlugs: [] },
  { slug: "maosaji-special-dosa", name: "Maosaji Special Dosa", categorySlug: "south-indian", description: "The house special dosa with a rich, indulgent filling.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/maosaji-special-dosa.jpg", locationSlugs: [] },
  { slug: "plain-dosa", name: "Plain Dosa", categorySlug: "south-indian", description: "Golden, crisp and simple — served with sambar and chutneys.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/plain-dosa.jpg", locationSlugs: [] },
  { slug: "idli-sambar", name: "Idli Sambar", categorySlug: "south-indian", description: "Soft steamed idlis served with hot sambar and coconut chutney.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/idli-sambar.jpg", locationSlugs: [] },
  // Chaat & Snacks
  { slug: "chole-bhature", name: "Chole Bhature", categorySlug: "chaat-snacks", description: "Fluffy bhature with slow-cooked chole, onion salad and pickle.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/chole-bhature.jpg", locationSlugs: [] },
  { slug: "pav-bhaji", name: "Pav Bhaji", categorySlug: "chaat-snacks", description: "Buttery bhaji with toasted pav, chopped onions and lemon.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/pav-bhaji.jpg", locationSlugs: [] },
  { slug: "kachori-chaat", name: "Kachori Chaat", categorySlug: "chaat-snacks", description: "Crisp kachori topped with curd, chutneys and fine sev.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/kachori-chaat.jpg", locationSlugs: [] },
  { slug: "samosa", name: "Samosa", categorySlug: "chaat-snacks", description: "Classic crisp samosas with tamarind and mint chutney.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/samosa.jpg", locationSlugs: [] },
  { slug: "veg-spring-rolls", name: "Veg Spring Rolls", categorySlug: "chaat-snacks", description: "Golden vegetable spring rolls with a sweet chilli dip.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/veg-spring-rolls.jpg", locationSlugs: [] },
  // North Indian
  { slug: "paneer-butter-masala", name: "Paneer Butter Masala", categorySlug: "north-indian", description: "Paneer simmered in a rich, creamy tomato gravy.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/paneer-butter-masala.jpg", locationSlugs: [] },
  { slug: "dal-tadka", name: "Dal Tadka", categorySlug: "north-indian", description: "Tempered dal finished with ghee and whole spices.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/dal-tadka.jpg", locationSlugs: [] },
  // Chinese
  { slug: "veg-manchurian", name: "Veg Manchurian", categorySlug: "chinese", description: "Vegetable dumplings tossed in a glossy Indo-Chinese sauce.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/veg-manchurian.jpg", locationSlugs: [] },
  { slug: "hakka-noodles", name: "Veg Hakka Noodles", categorySlug: "chinese", description: "Noodles tossed with julienned vegetables, wok-fried.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/hakka-noodles.jpg", locationSlugs: [] },
  // Sweets
  { slug: "nariyal-barfi", name: "Nariyal Barfi", categorySlug: "sweets", description: "Coconut barfi finished with almond slivers.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/nariyal-barfi.jpg", locationSlugs: [] },
  { slug: "rasgulla", name: "Rasgulla", categorySlug: "sweets", description: "Soft rasgullas in a light sugar syrup.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/rasgulla.jpg", locationSlugs: [] },
  { slug: "gulab-jamun", name: "Gulab Jamun", categorySlug: "sweets", description: "Gulab jamuns soaked in saffron syrup.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/gulab-jamun.jpg", locationSlugs: [] },
  { slug: "kaju-katli", name: "Kaju Katli", categorySlug: "sweets", description: "Cashew katli with a delicate silver finish.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/kaju-katli.jpg", locationSlugs: [] },
  { slug: "motichoor-laddoo", name: "Motichoor Laddoo", categorySlug: "sweets", description: "Fine boondi laddoos, a festive classic.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/motichoor-laddoo.jpg", locationSlugs: [] },
  // Bakery & Cakes
  { slug: "black-forest-pastry", name: "Black Forest Pastry", categorySlug: "bakery-cakes", description: "Chocolate sponge, cream and cherry in a classic pairing.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/black-forest-pastry.jpg", locationSlugs: [] },
  { slug: "chocolate-truffle-cake", name: "Chocolate Truffle Cake", categorySlug: "bakery-cakes", description: "A glossy truffle-finished celebration cake.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/chocolate-truffle-cake.jpg", locationSlugs: [] },
  { slug: "pineapple-pastry", name: "Pineapple Pastry", categorySlug: "bakery-cakes", description: "Light sponge with cream and pineapple.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/pineapple-pastry.jpg", locationSlugs: [] },
  { slug: "chocolate-chip-cookies", name: "Chocolate Chip Cookies", categorySlug: "bakery-cakes", description: "Bakery-fresh cookies, crisp outside and soft inside.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/chocolate-chip-cookies.jpg", locationSlugs: [] },
  // Namkeen
  { slug: "navratan-mixture", name: "Navratan Mixture", categorySlug: "namkeen", description: "A crunchy mix of nuts, sev and spices.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/navratan-mixture.jpg", locationSlugs: [] },
  { slug: "aloo-bhujia", name: "Aloo Bhujia", categorySlug: "namkeen", description: "Fine, crisp potato sev — an everyday favourite.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/aloo-bhujia.jpg", locationSlugs: [] },
  // Beverages
  { slug: "masala-chai", name: "Masala Chai", categorySlug: "beverages", description: "Spiced chai, brewed fresh.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/masala-chai.jpg", locationSlugs: [] },
  { slug: "cold-coffee", name: "Cold Coffee", categorySlug: "beverages", description: "Thick, chilled and generously creamy.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/cold-coffee.jpg", locationSlugs: [] },
  { slug: "fresh-lime-soda", name: "Fresh Lime Soda", categorySlug: "beverages", description: "Sparkling, fresh and light.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/fresh-lime-soda.jpg", locationSlugs: [] },
];

export const DEFAULT_SETTINGS: Record<string, unknown> = {
  homepage_announcement: null as string | null, // null => hidden (no invented promo)
  hero_title: "Maosaji",
  hero_line: "A Bilaspur favourite, served every day.",
  contact_note: "Ordering and outlet details are listed on the Locations page.",
};

/** Demo enquiries shown in the admin demo (labelled isDemoData). */
export type DemoEnquirySeed = {
  referenceNumber: string;
  type: "bulk_order" | "celebration" | "cake";
  contactName: string;
  phone: string;
  eventDate: string;
  message: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "QUOTED" | "WON" | "LOST";
  createdAt: Date;
  organization?: string;
  guestCount?: number;
  quantity?: string;
  locationSlug?: string;
  budgetRange?: string;
  requirements?: string[];
  cakeType?: string;
  cakeWeight?: string;
  cakeMessage?: string;
};

export function buildDemoEnquiries(now: Date): DemoEnquirySeed[] {
  return [
    {
      referenceNumber: "BO-2026-0001",
      type: "bulk_order" as const,
      organization: "Demo Company",
      contactName: "Demo Customer",
      phone: "0000000000",
      quantity: "200 gift boxes",
      eventDate: "2026-10-15",
      budgetRange: "₹25,000 – ₹50,000",
      requirements: ["Sweets", "Gift boxes"],
      message: "Demo record — corporate gifting enquiry used for the private demonstration.",
      status: "NEW" as const,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 26),
    },
    {
      referenceNumber: "CE-2026-0002",
      type: "celebration" as const,
      contactName: "Demo Family",
      phone: "0000000000",
      eventDate: "2026-11-08",
      guestCount: 120,
      locationSlug: "svm",
      budgetRange: "₹50,000+",
      requirements: ["Catering", "Sweets"],
      message: "Demo record — wedding sweets and catering enquiry.",
      status: "CONTACTED" as const,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 49),
    },
    {
      referenceNumber: "CK-2026-0003",
      type: "cake" as const,
      contactName: "Demo Parent",
      phone: "0000000000",
      eventDate: "2026-10-02",
      cakeType: "Birthday — chocolate truffle",
      cakeWeight: "1 kg",
      cakeMessage: "Happy Birthday Aarav",
      message: "Demo record — birthday cake enquiry.",
      status: "QUALIFIED" as const,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 72),
    },
  ];
}

/** A clearly-labelled demo offer with a live window so it displays on the site. */
export function buildDemoOffer(now: Date) {
  return {
    title: "Demo — Festive Gift Boxes",
    headline: "Festive gifting, made easy",
    description:
      "Demo offer record. Production offers would be created by the team in the Offers manager with real details, dates and imagery once confirmed with the owner.",
    ctaLabel: "Enquire for bulk gifting",
    ctaHref: "/bulk-orders",
    imageSlug: "/images/hero-bulk.jpg",
    startsAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    endsAt: new Date(now.getFullYear() + 1, 11, 31),
  };
}
