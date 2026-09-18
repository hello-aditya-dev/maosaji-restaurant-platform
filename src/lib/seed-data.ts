/**
 * DEMO_MODE seeding for the Prisma/SQLite provider.
 * Pure seed constants live in ./seed-constants (no DB imports) so the
 * in-memory provider can seed identically without pulling in Prisma.
 */
import { db } from "@/lib/db";
import {
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  DEFAULT_SETTINGS,
  buildDemoEnquiries,
  buildDemoOffer,
} from "@/lib/seed-constants";

// Re-export for existing importers.
export {
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  DEFAULT_SETTINGS,
  buildDemoEnquiries,
  buildDemoOffer,
};

/** Idempotent demo seeding — safe to call on every request; only inserts when empty. */
export async function ensureSeeded() {
  const [catCount, itemCount, locCount, enquiryCount, offerCount, settingCount] = await Promise.all([
    db.menuCategory.count(),
    db.menuItem.count(),
    db.location.count(),
    db.enquiry.count(),
    db.offer.count(),
    db.siteSetting.count(),
  ]);

  if (catCount === 0) {
    await db.menuCategory.createMany({ data: SEED_CATEGORIES });
  }

  if (itemCount === 0) {
    await db.menuItem.createMany({
      data: SEED_MENU_ITEMS.map((item, i) => ({
        slug: item.slug,
        name: item.name,
        description: item.description,
        categorySlug: item.categorySlug,
        priceCents: item.priceCents,
        isVegetarian: item.isVegetarian,
        isAvailable: true,
        isFeatured: item.isFeatured,
        locationSlugs: JSON.stringify(item.locationSlugs),
        imageUrl: item.imageUrl,
        displayOrder: i,
      })),
    });
  }

  if (locCount === 0) {
    // Locations come from the verified config; stored in DB so admin can manage them as data.
    const { restaurant } = await import("@/config/restaurant");
    await db.location.createMany({
      data: restaurant.locations.map((loc, i) => ({
        slug: loc.slug,
        name: loc.name,
        address: loc.address,
        phone: loc.phoneReferenceOnly,
        hoursNote: null,
        orderingJson: JSON.stringify(loc.ordering),
        galleryJson: JSON.stringify([loc.image]),
        active: true,
        displayOrder: i,
      })),
    });
  }

  if (enquiryCount === 0) {
    await db.enquiry.createMany({
      data: buildDemoEnquiries(new Date()).map((e) => ({
        ...e,
        requirementsJson: JSON.stringify(e.requirements),
        isDemoData: true,
      })),
    });
  }

  if (offerCount === 0) {
    await db.offer.create({
      data: { ...buildDemoOffer(new Date()), active: true },
    });
  }

  if (settingCount === 0) {
    await db.siteSetting.createMany({
      data: Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
        key,
        valueJson: JSON.stringify(value),
      })),
    });
  }
}
