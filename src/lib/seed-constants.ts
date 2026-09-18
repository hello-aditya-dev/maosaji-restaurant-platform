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
  // ── THALIS — SVM-emphasised (SVM: Mini/Deluxe/Supreme; Maosaji Thali at both) ──
  { slug: "maosaji-thali", name: "Maosaji Thali", categorySlug: "thali", description: "A generous vegetarian thali served with seasonal preparations.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/maosaji-thali.jpg", locationSlugs: [] },
  { slug: "mini-thali", name: "Mini Thali", categorySlug: "thali", description: "A lighter vegetarian thali with the everyday essentials.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "deluxe-thali", name: "Deluxe Thali", categorySlug: "thali", description: "An upgraded thali with extra sides and a sweet.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "supreme-thali", name: "Supreme Thali", categorySlug: "thali", description: "The most generous thali on the menu, with a full range of preparations.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: null, locationSlugs: ["svm"] },

  // ── SOUTH INDIAN — both outlets carry the classics; SVM carries the wider range ──
  { slug: "masala-dosa", name: "Masala Dosa", categorySlug: "south-indian", description: "Crisp dosa served with a spiced potato filling, sambar and chutneys.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/masala-dosa.jpg", locationSlugs: [] },
  { slug: "maosaji-special-dosa", name: "Maosaji Special Dosa", categorySlug: "south-indian", description: "The house special dosa with a rich, indulgent filling.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/maosaji-special-dosa.jpg", locationSlugs: [] },
  { slug: "plain-dosa", name: "Plain Dosa", categorySlug: "south-indian", description: "Golden, crisp and simple — served with sambar and chutneys.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/plain-dosa.jpg", locationSlugs: [] },
  { slug: "cheese-masala-dosa", name: "Cheese Masala Dosa", categorySlug: "south-indian", description: "Masala dosa finished with a layer of melted cheese.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "jini-dosa", name: "Jini Dosa", categorySlug: "south-indian", description: "A finely chopped, masala-loaded dosa with a tangy finish.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "mysore-masala-dosa", name: "Mysore Masala Dosa", categorySlug: "south-indian", description: "Dosa with a spiced red chutney, in the Mysore style.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: [] },
  { slug: "mix-veg-uttapam", name: "Mix Veg Uttapam", categorySlug: "south-indian", description: "Thick pancake dosa topped with mixed vegetables.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "onion-uttapam", name: "Onion Uttapam", categorySlug: "south-indian", description: "Thick dosa topped with onions and coriander.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: [] },
  { slug: "idli-sambar", name: "Idli Sambar", categorySlug: "south-indian", description: "Soft steamed idlis served with hot sambar and coconut chutney.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/idli-sambar.jpg", locationSlugs: [] },
  { slug: "masala-idli", name: "Masala Idli", categorySlug: "south-indian", description: "Idlis tossed with spices and curry leaves.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "medu-vada", name: "Medu Vada", categorySlug: "south-indian", description: "Crisp lentil doughnut vada with sambar and chutney.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },

  // ── NORTH INDIAN / MAIN COURSE — SVM-emphasised ──
  { slug: "paneer-butter-masala", name: "Paneer Butter Masala", categorySlug: "north-indian", description: "Paneer simmered in a rich, creamy tomato gravy.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/paneer-butter-masala.jpg", locationSlugs: ["svm"] },
  { slug: "paneer-lababdar", name: "Paneer Lababdar", categorySlug: "north-indian", description: "Paneer in a mildly sweet, onion-tomato lababdar gravy.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "dal-makhni", name: "Dal Makhni", categorySlug: "north-indian", description: "Slow-cooked black lentils finished with cream and butter.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "dal-tadka", name: "Dal Tadka", categorySlug: "north-indian", description: "Tempered dal finished with ghee and whole spices.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/dal-tadka.jpg", locationSlugs: ["svm"] },
  { slug: "shahi-paneer", name: "Shahi Paneer", categorySlug: "north-indian", description: "Paneer in a mildly sweet royal gravy.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "veg-kofta", name: "Veg Kofta", categorySlug: "north-indian", description: "Vegetable dumplings in a rich gravy.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "mattar-paneer", name: "Mattar Paneer", categorySlug: "north-indian", description: "Paneer and peas in a onion-tomato gravy.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "aloo-gobi", name: "Aloo Gobi", categorySlug: "north-indian", description: "Potato and cauliflower, dry preparation.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "chole", name: "Chole", categorySlug: "north-indian", description: "Slow-cooked chickpeas with whole spices.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },

  // ── CHINESE — both outlets ──
  { slug: "veg-manchurian", name: "Veg Manchurian", categorySlug: "chinese", description: "Vegetable dumplings tossed in a glossy Indo-Chinese sauce.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/veg-manchurian.jpg", locationSlugs: [] },
  { slug: "hakka-noodles", name: "Veg Hakka Noodles", categorySlug: "chinese", description: "Noodles tossed with julienned vegetables, wok-fried.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/hakka-noodles.jpg", locationSlugs: [] },
  { slug: "schezwan-noodles", name: "Schezwan Veg Noodles", categorySlug: "chinese", description: "Noodles in a spicy schezwan sauce.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: [] },
  { slug: "chilli-paneer", name: "Chilli Paneer", categorySlug: "chinese", description: "Paneer tossed with peppers in a spicy Indo-Chinese sauce.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: [] },
  { slug: "veg-fried-rice", name: "Veg Fried Rice", categorySlug: "chinese", description: "Wok-tossed rice with vegetables and soy.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: [] },
  { slug: "paneer-fried-rice", name: "Paneer Fried Rice", categorySlug: "chinese", description: "Fried rice with paneer and vegetables.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },

  // ── CHAAT & SNACKS — both outlets carry the classics ──
  { slug: "chole-bhature", name: "Chole Bhature", categorySlug: "chaat-snacks", description: "Fluffy bhature with slow-cooked chole, onion salad and pickle.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/chole-bhature.jpg", locationSlugs: [] },
  { slug: "pav-bhaji", name: "Pav Bhaji", categorySlug: "chaat-snacks", description: "Buttery bhaji with toasted pav, chopped onions and lemon.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/pav-bhaji.jpg", locationSlugs: [] },
  { slug: "cheese-pav-bhaji", name: "Cheese Pav Bhaji", categorySlug: "chaat-snacks", description: "Pav bhaji finished with a layer of grated cheese.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "kachori-chaat", name: "Kachori Chaat", categorySlug: "chaat-snacks", description: "Crisp kachori topped with curd, chutneys and fine sev.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/kachori-chaat.jpg", locationSlugs: ["mangla"] },
  { slug: "dahi-samosa", name: "Dahi Samosa", categorySlug: "chaat-snacks", description: "Samosa topped with curd, chutneys and sev.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "samosa", name: "Samosa", categorySlug: "chaat-snacks", description: "Classic crisp samosas with tamarind and mint chutney.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/samosa.jpg", locationSlugs: [] },
  { slug: "aloo-tikki", name: "Aloo Tikki", categorySlug: "chaat-snacks", description: "Crisp potato tikkis with curd, chutneys and sev.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "dahi-puri", name: "Dahi Puri", categorySlug: "chaat-snacks", description: "Puri shells with curd, chutneys and fine sev.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "sev-puri", name: "Sev Puri", categorySlug: "chaat-snacks", description: "Crisp puri with chutneys, onion and sev.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "veg-spring-rolls", name: "Veg Spring Rolls", categorySlug: "chaat-snacks", description: "Golden vegetable spring rolls with a sweet chilli dip.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/veg-spring-rolls.jpg", locationSlugs: ["svm"] },

  // ── SWEETS — Mangla-emphasised (the core of the Mangla range) ──
  { slug: "nariyal-barfi", name: "Nariyal Barfi", categorySlug: "sweets", description: "Coconut barfi finished with almond slivers.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/nariyal-barfi.jpg", locationSlugs: ["mangla"] },
  { slug: "kaju-katli", name: "Kaju Katli", categorySlug: "sweets", description: "Cashew katli with a delicate silver finish.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/kaju-katli.jpg", locationSlugs: ["mangla"] },
  { slug: "milk-cake", name: "Milk Cake", categorySlug: "sweets", description: "Granular milk sweet with a caramelised base.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "kesariya-jalebi", name: "Kesariya Jalebi", categorySlug: "sweets", description: "Saffron jalebi, crisp and syrup-soaked.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "rasgulla", name: "Rasgulla", categorySlug: "sweets", description: "Soft rasgullas in a light sugar syrup.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/rasgulla.jpg", locationSlugs: ["mangla"] },
  { slug: "ghee-boondi-laddu", name: "Ghee Boondi Laddu", categorySlug: "sweets", description: "Boondi laddoos bound in ghee, a festive classic.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "motichoor-laddoo", name: "Motichoor Laddoo", categorySlug: "sweets", description: "Fine boondi laddoos, a festive classic.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/motichoor-laddoo.jpg", locationSlugs: ["mangla"] },
  { slug: "gulab-jamun", name: "Gulab Jamun", categorySlug: "sweets", description: "Gulab jamuns soaked in saffron syrup.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/gulab-jamun.jpg", locationSlugs: [] },
  { slug: "besan-laddoo", name: "Besan Laddoo", categorySlug: "sweets", description: "Roasted gram-flour laddoos with ghee.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "petha", name: "Petha", categorySlug: "sweets", description: "Soft, sweet ash gourd sweet.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "sohan-halwa", name: "Sohan Halwa", categorySlug: "sweets", description: "A rich ghee halwa with dry fruits.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "festive-sweets-box", name: "Festive Sweets Box", categorySlug: "sweets", description: "A curated assortment of festive sweets, gift-packed.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/festive-sweets-box.jpg", locationSlugs: ["mangla"] },

  // ── BAKERY & CAKES — Mangla-emphasised ──
  { slug: "black-forest-pastry", name: "Black Forest Pastry", categorySlug: "bakery-cakes", description: "Chocolate sponge, cream and cherry in a classic pairing.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/black-forest-pastry.jpg", locationSlugs: ["mangla"] },
  { slug: "chocolate-pastry", name: "Chocolate Pastry", categorySlug: "bakery-cakes", description: "A chocolate sponge pastry with a fudge finish.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "pineapple-pastry", name: "Pineapple Pastry", categorySlug: "bakery-cakes", description: "Light sponge with cream and pineapple.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/pineapple-pastry.jpg", locationSlugs: ["mangla"] },
  { slug: "butterscotch-pastry", name: "Butterscotch Pastry", categorySlug: "bakery-cakes", description: "Butterscotch sponge with cream and praline.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "vanilla-pastry", name: "Vanilla Pastry", categorySlug: "bakery-cakes", description: "Classic vanilla sponge with cream.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "chocolate-truffle-cake", name: "Chocolate Truffle Cake", categorySlug: "bakery-cakes", description: "A glossy truffle-finished celebration cake.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/chocolate-truffle-cake.jpg", locationSlugs: ["mangla"] },
  { slug: "black-forest-cake", name: "Black Forest Cake", categorySlug: "bakery-cakes", description: "Chocolate sponge layered with cream and cherry.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "chocolate-cake", name: "Chocolate Cake", categorySlug: "bakery-cakes", description: "A moist chocolate sponge celebration cake.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "butterscotch-cake", name: "Butterscotch Cake", categorySlug: "bakery-cakes", description: "Butterscotch cream cake with praline.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "pineapple-cake", name: "Pineapple Cake", categorySlug: "bakery-cakes", description: "Vanilla sponge with pineapple and cream.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "birthday-cake", name: "Birthday Cake", categorySlug: "bakery-cakes", description: "A celebration cake for birthdays — message on request.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/birthday-cake.jpg", locationSlugs: ["mangla"] },
  { slug: "chocolate-chip-cookies", name: "Chocolate Chip Cookies", categorySlug: "bakery-cakes", description: "Bakery-fresh cookies, crisp outside and soft inside.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/chocolate-chip-cookies.jpg", locationSlugs: [] },
  { slug: "butter-cookies", name: "Butter Cookies", categorySlug: "bakery-cakes", description: "Melt-in-the-mouth butter cookies.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "khari", name: "Khari", categorySlug: "bakery-cakes", description: "Flaky, crisp savoury biscuits, best with chai.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: [] },
  { slug: "rusk", name: "Rusk", categorySlug: "bakery-cakes", description: "Twice-baked crisp rusk for chai.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: [] },

  // ── NAMKEEN — SVM carries the wider namkeen range ──
  { slug: "navratan-mixture", name: "Navratan Mixture", categorySlug: "namkeen", description: "A crunchy mix of nuts, sev and spices.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/navratan-mixture.jpg", locationSlugs: [] },
  { slug: "aloo-bhujia", name: "Aloo Bhujia", categorySlug: "namkeen", description: "Fine, crisp potato sev — an everyday favourite.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/aloo-bhujia.jpg", locationSlugs: [] },
  { slug: "moong-dal-namkeen", name: "Moong Dal Namkeen", categorySlug: "namkeen", description: "Fried, salted moong dal — crunchy and light.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "masala-peanuts", name: "Masala Peanuts", categorySlug: "namkeen", description: "Spiced, fried peanuts — a tea-time snack.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "sev-bhujia", name: "Sev Bhujia", categorySlug: "namkeen", description: "Fine spiced sev for topping and snacking.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: [] },

  // ── DRY FRUITS — SVM ──
  { slug: "dry-fruit-box", name: "Dry Fruit Box", categorySlug: "namkeen", description: "A gift assortment of dry fruits.", priceCents: null, isVegetarian: true, isFeatured: true, imageUrl: "/images/items/dry-fruit-box.jpg", locationSlugs: ["svm"] },
  { slug: "roasted-cashews", name: "Roasted Cashews", categorySlug: "namkeen", description: "Lightly salted roasted cashews.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "roasted-almonds", name: "Roasted Almonds", categorySlug: "namkeen", description: "Roasted, salted almonds.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },

  // ── BEVERAGES — Mangla emphasises coffee/shakes; SVM emphasises chai/lassi ──
  { slug: "masala-chai", name: "Masala Chai", categorySlug: "beverages", description: "Spiced chai, brewed fresh.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/masala-chai.jpg", locationSlugs: [] },
  { slug: "filter-coffee", name: "Filter Coffee", categorySlug: "beverages", description: "South-Indian filter coffee, frothy and strong.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "cold-coffee", name: "Cold Coffee", categorySlug: "beverages", description: "Thick, chilled and generously creamy.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/cold-coffee.jpg", locationSlugs: ["mangla"] },
  { slug: "chocolate-shake", name: "Chocolate Shake", categorySlug: "beverages", description: "Thick chocolate shake topped with cream.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "strawberry-shake", name: "Strawberry Shake", categorySlug: "beverages", description: "Creamy strawberry shake.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "vanilla-shake", name: "Vanilla Shake", categorySlug: "beverages", description: "Classic vanilla shake.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "mango-shake", name: "Mango Shake", categorySlug: "beverages", description: "Seasonal mango shake, thick and cold.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
  { slug: "sweet-lassi", name: "Sweet Lassi", categorySlug: "beverages", description: "Thick sweet yogurt drink.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "salted-lassi", name: "Salted Lassi", categorySlug: "beverages", description: "Tangy salted yogurt drink.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["svm"] },
  { slug: "fresh-lime-soda", name: "Fresh Lime Soda", categorySlug: "beverages", description: "Sparkling, fresh and light.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: "/images/items/fresh-lime-soda.jpg", locationSlugs: [] },
  { slug: "rose-milk", name: "Rose Milk", categorySlug: "beverages", description: "Chilled rose-flavoured milk.", priceCents: null, isVegetarian: true, isFeatured: false, imageUrl: null, locationSlugs: ["mangla"] },
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
