/**
 * DEMO_MODE seeding for the Prisma/SQLite provider.
 * Pure seed constants live in ./seed-constants (no DB imports) so the
 * in-memory provider can seed identically without pulling in Prisma.
 *
 * RELIABILITY: ensureSeeded() is called by multiple data-provider methods
 * on a single page render (e.g. getActiveOffers + getMenuItems on the
 * homepage). Without serialization, the concurrent calls each observe
 * `count === 0` and both attempt createMany → P2002 unique-constraint
 * failures and a 500 on first paint. We serialize via a module-level
 * promise chain AND short-circuit after the first successful seed so
 * repeat visits are free. This is essential for the low-bandwidth /
 * throttled-mobile reliability pass.
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

// ─── Reliability: serialize + short-circuit seeding ──────────────────────
let seedChain: Promise<void> = Promise.resolve();
let seededSuccessfully = false;

/** Idempotent demo seeding — safe to call on every request; only inserts when empty. */
export async function ensureSeeded() {
  // Once we have seeded successfully in this process, skip the count queries
  // entirely — repeat visits should be extremely fast (reliability target).
  if (seededSuccessfully) return;

  // Serialize concurrent callers onto a single chain so two parallel page
  // renders never race on createMany.
  const run = seedChain.then(() => doSeed()).catch(() => {
    // Swallow: a later call will retry; never leave the chain rejected or
    // subsequent callers will short-circuit to failure.
    seededSuccessfully = false;
  });
  seedChain = run;
  await run;
}

async function doSeed() {
  if (seededSuccessfully) return;

  const [catCount, itemCount, locCount, enquiryCount, offerCount, settingCount] = await Promise.all([
    db.menuCategory.count(),
    db.menuItem.count(),
    db.location.count(),
    db.enquiry.count(),
    db.offer.count(),
    db.siteSetting.count(),
  ]);

  // If everything is already populated, mark seeded and exit fast.
  if (
    catCount > 0 &&
    itemCount > 0 &&
    locCount > 0 &&
    settingCount > 0
  ) {
    seededSuccessfully = true;
    return;
  }

  // Each createMany is individually guarded: a concurrent render or a stale
  // partial seed must not crash the page. skipDuplicates would be ideal but
  // SQLite + Prisma support varies; we catch P2002 instead and continue.
  try {
    if (catCount === 0) {
      await db.menuCategory.createMany({ data: SEED_CATEGORIES });
    }
  } catch (err) {
    if (!isUniqueViolation(err)) console.warn("[seed] categories:", (err as Error).message);
  }

  try {
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
  } catch (err) {
    if (!isUniqueViolation(err)) console.warn("[seed] items:", (err as Error).message);
  }

  try {
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
  } catch (err) {
    if (!isUniqueViolation(err)) console.warn("[seed] locations:", (err as Error).message);
  }

  try {
    if (enquiryCount === 0) {
      const enquiries = buildDemoEnquiries(new Date());
      await db.enquiry.createMany({
        data: enquiries.map(({ requirements: _req, ...e }) => ({
          ...e,
          requirementsJson: JSON.stringify(_req ?? []),
          isDemoData: true,
        })),
      });
    }
  } catch (err) {
    if (!isUniqueViolation(err)) console.warn("[seed] enquiries:", (err as Error).message);
  }

  try {
    if (offerCount === 0) {
      await db.offer.create({
        data: { ...buildDemoOffer(new Date()), active: true },
      });
    }
  } catch (err) {
    if (!isUniqueViolation(err)) console.warn("[seed] offer:", (err as Error).message);
  }

  try {
    if (settingCount === 0) {
      await db.siteSetting.createMany({
        data: Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
          key,
          valueJson: JSON.stringify(value),
        })),
      });
    }
  } catch (err) {
    if (!isUniqueViolation(err)) console.warn("[seed] settings:", (err as Error).message);
  }

  seededSuccessfully = true;
}

function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; message?: string };
  return e?.code === "P2002" || /unique constraint/i.test(e?.message ?? "");
}
