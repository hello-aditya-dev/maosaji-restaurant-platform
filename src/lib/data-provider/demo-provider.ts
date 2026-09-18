/**
 * DemoDataProvider — Prisma/SQLite-backed implementation used in DEMO_MODE.
 * Server-side persistence: enquiries and admin edits survive refresh and are
 * visible from ANY browser on this machine (stronger than the localStorage
 * minimum required by the build pack).
 */
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed-data";
import {
  type DataProvider,
  type EnquiryDTO,
  type EnquiryStatus,
  type MenuItemDTO,
  type OfferDTO,
  type CreateEnquiryInput,
  makeReferenceNumber,
} from "./types";

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function toItemDTO(row: {
  id: string; slug: string; name: string; description: string | null; categorySlug: string;
  priceCents: number | null; isVegetarian: boolean; isAvailable: boolean; isFeatured: boolean;
  locationSlugs: string; imageUrl: string | null; displayOrder: number;
}): MenuItemDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    categorySlug: row.categorySlug,
    priceCents: row.priceCents,
    isVegetarian: row.isVegetarian,
    isAvailable: row.isAvailable,
    isFeatured: row.isFeatured,
    locationSlugs: parseJsonArray(row.locationSlugs),
    imageUrl: row.imageUrl,
    displayOrder: row.displayOrder,
  };
}

function toEnquiryDTO(row: any): EnquiryDTO {
  return {
    id: row.id,
    referenceNumber: row.referenceNumber,
    type: row.type,
    contactName: row.contactName,
    phone: row.phone,
    email: row.email,
    organization: row.organization,
    locationSlug: row.locationSlug,
    eventDate: row.eventDate,
    guestCount: row.guestCount,
    quantity: row.quantity,
    budgetRange: row.budgetRange,
    requirements: parseJsonArray(row.requirementsJson),
    cakeType: row.cakeType,
    cakeWeight: row.cakeWeight,
    cakeMessage: row.cakeMessage,
    message: row.message,
    status: row.status as EnquiryStatus,
    source: row.source,
    isDemoData: row.isDemoData,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt),
  };
}

export const demoProvider: DataProvider = {
  mode: "DEMO_MODE",

  async getCategories() {
    await ensureSeeded();
    const rows = await db.menuCategory.findMany({ orderBy: { displayOrder: "asc" } });
    return rows.map((r) => ({ slug: r.slug, name: r.name, displayOrder: r.displayOrder }));
  },

  async getMenuItems() {
    await ensureSeeded();
    const rows = await db.menuItem.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }] });
    return rows.map(toItemDTO);
  },

  async getLocations() {
    await ensureSeeded();
    const rows = await db.location.findMany({ orderBy: { displayOrder: "asc" } });
    return rows.map((r) => {
      let ordering: { zomato?: string; swiggy?: string } = {};
      try { ordering = JSON.parse(r.orderingJson); } catch { /* keep {} */ }
      return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        address: r.address,
        phone: r.phone,
        hoursNote: r.hoursNote,
        ordering,
        gallery: parseJsonArray(r.galleryJson),
        active: r.active,
        displayOrder: r.displayOrder,
      };
    });
  },

  async getActiveOffers() {
    await ensureSeeded();
    const now = new Date();
    const rows = await db.offer.findMany({
      where: { active: true, startsAt: { lte: now }, endsAt: { gte: now } },
      orderBy: { endsAt: "asc" },
    });
    return rows.map(
      (r): OfferDTO => ({
        id: r.id,
        title: r.title,
        headline: r.headline,
        description: r.description,
        ctaLabel: r.ctaLabel,
        ctaHref: r.ctaHref,
        imageSlug: r.imageSlug,
        startsAt: r.startsAt.toISOString(),
        endsAt: r.endsAt.toISOString(),
        active: r.active,
      })
    );
  },

  async getSettings() {
    await ensureSeeded();
    const rows = await db.siteSetting.findMany();
    const out: Record<string, unknown> = {};
    for (const r of rows) {
      try { out[r.key] = JSON.parse(r.valueJson); } catch { out[r.key] = r.valueJson; }
    }
    return out;
  },

  async createEnquiry(input: CreateEnquiryInput) {
    await ensureSeeded();
    const count = await db.enquiry.count();
    const referenceNumber = makeReferenceNumber(input.type, count + 1);
    const row = await db.enquiry.create({
      data: {
        referenceNumber,
        type: input.type,
        contactName: input.contactName,
        phone: input.phone,
        email: input.email ?? null,
        organization: input.organization ?? null,
        locationSlug: input.locationSlug ?? null,
        eventDate: input.eventDate ?? null,
        guestCount: input.guestCount ?? null,
        quantity: input.quantity ?? null,
        budgetRange: input.budgetRange ?? null,
        requirementsJson: JSON.stringify(input.requirements ?? []),
        cakeType: input.cakeType ?? null,
        cakeWeight: input.cakeWeight ?? null,
        cakeMessage: input.cakeMessage ?? null,
        message: input.message ?? null,
        status: "NEW",
        source: "website",
        isDemoData: false, // genuinely submitted through the demo form
      },
    });
    return toEnquiryDTO(row);
  },

  async listEnquiries() {
    await ensureSeeded();
    const rows = await db.enquiry.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(toEnquiryDTO);
  },

  async updateEnquiryStatus(id: string, status: EnquiryStatus) {
    const row = await db.enquiry.update({ where: { id }, data: { status } });
    return toEnquiryDTO(row);
  },

  async createMenuItem(input) {
    await ensureSeeded();
    const count = await db.menuItem.count();
    const row = await db.menuItem.create({
      data: {
        slug: input.slug,
        name: input.name,
        description: input.description ?? null,
        categorySlug: input.categorySlug,
        priceCents: input.priceCents ?? null,
        isVegetarian: input.isVegetarian ?? true,
        isAvailable: input.isAvailable ?? true,
        isFeatured: input.isFeatured ?? false,
        locationSlugs: JSON.stringify(input.locationSlugs ?? []),
        imageUrl: input.imageUrl ?? null,
        displayOrder: input.displayOrder ?? count,
      },
    });
    return toItemDTO(row);
  },

  async updateMenuItem(id: string, patch: Partial<MenuItemDTO>) {
    const data: Record<string, unknown> = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.description !== undefined) data.description = patch.description;
    if (patch.categorySlug !== undefined) data.categorySlug = patch.categorySlug;
    if (patch.priceCents !== undefined) data.priceCents = patch.priceCents;
    if (patch.isVegetarian !== undefined) data.isVegetarian = patch.isVegetarian;
    if (patch.isAvailable !== undefined) data.isAvailable = patch.isAvailable;
    if (patch.isFeatured !== undefined) data.isFeatured = patch.isFeatured;
    if (patch.locationSlugs !== undefined) data.locationSlugs = JSON.stringify(patch.locationSlugs);
    if (patch.imageUrl !== undefined) data.imageUrl = patch.imageUrl;
    if (patch.displayOrder !== undefined) data.displayOrder = patch.displayOrder;
    const row = await db.menuItem.update({ where: { id }, data });
    return toItemDTO(row);
  },

  async upsertSetting(key: string, value: unknown) {
    await ensureSeeded();
    await db.siteSetting.upsert({
      where: { key },
      update: { valueJson: JSON.stringify(value) },
      create: { key, valueJson: JSON.stringify(value) },
    });
  },

  async trackEvent(name: string, payload?: Record<string, unknown>) {
    await db.analyticsEvent.create({
      data: { name, payloadJson: payload ? JSON.stringify(payload) : null },
    });
  },

  async listEvents() {
    const rows = await db.analyticsEvent.groupBy({
      by: ["name"],
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
    });
    return rows.map((r) => ({ name: r.name, count: r._count.name }));
  },
};
