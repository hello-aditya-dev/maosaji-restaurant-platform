/**
 * MemoryDataProvider — zero-dependency in-memory fallback for DEMO_MODE.
 * ─────────────────────────────────────────────────────────────────────
 * Active when no database is available, e.g. a zero-config Vercel deploy:
 * the filesystem there is read-only, so SQLite persistence cannot work and
 * the platform degrades gracefully instead of erroring. Every page renders
 * and every flow (forms, admin demo, analytics) works; data is scoped to
 * the serverless instance and resets on cold starts.
 *
 * Uses the exact same seed constants as the SQLite provider, so both modes
 * demonstrate identically. Swap to Supabase later via ./index.ts — the UI
 * only ever talks to the DataProvider interface.
 */
import { restaurant } from "@/config/restaurant";
import {
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  DEFAULT_SETTINGS,
  buildDemoEnquiries,
  buildDemoOffer,
} from "@/lib/seed-constants";
import {
  type DataProvider,
  type CreateEnquiryInput,
  type EnquiryDTO,
  type EnquiryStatus,
  type LocationDTO,
  type MenuItemDTO,
  type OfferDTO,
  makeReferenceNumber,
} from "./types";

type MemoryEvent = { name: string; payload?: Record<string, unknown>; at: number };

type MemoryStore = {
  categories: { slug: string; name: string; displayOrder: number }[];
  items: MenuItemDTO[];
  locations: LocationDTO[];
  offers: OfferDTO[];
  settings: Record<string, unknown>;
  enquiries: EnquiryDTO[];
  events: MemoryEvent[];
};

/** Build the seed state (identical to what ensureSeeded writes to SQLite). */
function buildSeedState(): MemoryStore {
  const now = new Date();

  const items: MenuItemDTO[] = SEED_MENU_ITEMS.map((item, i) => ({
    id: `seed-item-${item.slug}`,
    slug: item.slug,
    name: item.name,
    description: item.description,
    categorySlug: item.categorySlug,
    priceCents: item.priceCents,
    isVegetarian: item.isVegetarian,
    isAvailable: true,
    isFeatured: item.isFeatured,
    locationSlugs: item.locationSlugs,
    imageUrl: item.imageUrl,
    displayOrder: i,
  }));

  const locations: LocationDTO[] = restaurant.locations.map((loc, i) => ({
    id: `seed-loc-${loc.slug}`,
    slug: loc.slug,
    name: loc.name,
    address: loc.address,
    phone: loc.phoneReferenceOnly,
    hoursNote: null,
    ordering: { ...loc.ordering },
    gallery: [loc.image],
    active: true,
    displayOrder: i,
  }));

  const offer = buildDemoOffer(now);
  const offers: OfferDTO[] = [
    {
      id: "seed-offer-demo-festive",
      title: offer.title,
      headline: offer.headline,
      description: offer.description,
      ctaLabel: offer.ctaLabel,
      ctaHref: offer.ctaHref,
      imageSlug: offer.imageSlug,
      startsAt: offer.startsAt.toISOString(),
      endsAt: offer.endsAt.toISOString(),
      active: true,
    },
  ];

  const enquiries: EnquiryDTO[] = buildDemoEnquiries(now).map((e, i) => ({
    id: `seed-enquiry-${i + 1}`,
    referenceNumber: e.referenceNumber,
    type: e.type,
    contactName: e.contactName,
    phone: e.phone,
    email: null,
    organization: e.organization ?? null,
    locationSlug: e.locationSlug ?? null,
    eventDate: e.eventDate,
    guestCount: e.guestCount ?? null,
    quantity: e.quantity ?? null,
    budgetRange: e.budgetRange ?? null,
    requirements: e.requirements ?? [],
    cakeType: e.cakeType ?? null,
    cakeWeight: e.cakeWeight ?? null,
    cakeMessage: e.cakeMessage ?? null,
    message: e.message,
    status: e.status,
    source: "website",
    isDemoData: true,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.createdAt.toISOString(),
  }));

  return {
    categories: [...SEED_CATEGORIES],
    items,
    locations,
    offers,
    settings: { ...DEFAULT_SETTINGS },
    enquiries,
    events: [],
  };
}

// Survive dev-server module reloads so the demo state is not lost per request.
const globalForMemory = globalThis as unknown as { __maosajiMemoryStore?: MemoryStore };

function store(): MemoryStore {
  globalForMemory.__maosajiMemoryStore ??= buildSeedState();
  return globalForMemory.__maosajiMemoryStore;
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const memoryProvider: DataProvider = {
  mode: "DEMO_MODE_MEMORY",

  async getCategories() {
    return [...store().categories].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getMenuItems() {
    return [...store().items].sort(
      (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name)
    );
  },

  async getLocations() {
    return [...store().locations].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getActiveOffers() {
    const now = Date.now();
    return store()
      .offers.filter(
        (o) =>
          o.active &&
          new Date(o.startsAt).getTime() <= now &&
          new Date(o.endsAt).getTime() >= now
      )
      .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
  },

  async getSettings() {
    return { ...store().settings };
  },

  async createEnquiry(input: CreateEnquiryInput) {
    const s = store();
    const referenceNumber = makeReferenceNumber(input.type, s.enquiries.length + 1);
    const nowIso = new Date().toISOString();
    const enquiry: EnquiryDTO = {
      id: uid("enquiry"),
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
      requirements: input.requirements ?? [],
      cakeType: input.cakeType ?? null,
      cakeWeight: input.cakeWeight ?? null,
      cakeMessage: input.cakeMessage ?? null,
      message: input.message ?? null,
      status: "NEW",
      source: "website",
      isDemoData: false, // genuinely submitted through the demo form
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    s.enquiries.push(enquiry);
    return { ...enquiry };
  },

  async listEnquiries() {
    return [...store().enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async updateEnquiryStatus(id: string, status: EnquiryStatus) {
    const enquiry = store().enquiries.find((e) => e.id === id);
    if (!enquiry) throw new Error(`Enquiry ${id} not found`);
    enquiry.status = status;
    enquiry.updatedAt = new Date().toISOString();
    return { ...enquiry };
  },

  async createMenuItem(input) {
    const s = store();
    const item: MenuItemDTO = {
      id: uid("item"),
      slug: input.slug,
      name: input.name,
      description: input.description ?? null,
      categorySlug: input.categorySlug,
      priceCents: input.priceCents ?? null,
      isVegetarian: input.isVegetarian ?? true,
      isAvailable: input.isAvailable ?? true,
      isFeatured: input.isFeatured ?? false,
      locationSlugs: input.locationSlugs ?? [],
      imageUrl: input.imageUrl ?? null,
      displayOrder: input.displayOrder ?? s.items.length,
    };
    s.items.push(item);
    return { ...item };
  },

  async updateMenuItem(id: string, patch: Partial<MenuItemDTO>) {
    const item = store().items.find((i) => i.id === id);
    if (!item) throw new Error(`Menu item ${id} not found`);
    Object.assign(item, patch);
    return { ...item };
  },

  async upsertSetting(key: string, value: unknown) {
    store().settings[key] = value;
  },

  async trackEvent(name: string, payload?: Record<string, unknown>) {
    store().events.push({ name, payload, at: Date.now() });
  },

  async listEvents() {
    const counts = new Map<string, number>();
    for (const e of store().events) {
      counts.set(e.name, (counts.get(e.name) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },
};
