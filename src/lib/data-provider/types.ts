/**
 * DataProvider interface — the platform's data contract.
 * ─────────────────────────────────────────────────────
 * DEMO_MODE uses a Prisma/SQLite-backed provider (server-persisted, survives
 * refresh, works across browsers — exceeds the pack's localStorage minimum).
 *
 * To switch to Supabase WITHOUT touching any UI:
 *   1. set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (+ provider impl)
 *   2. implement SupabaseProvider against this same interface
 *   3. change the factory in ./index.ts
 * UI components only ever talk to these functions.
 */

export type MenuItemDTO = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  categorySlug: string;
  priceCents: number | null;
  isVegetarian: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  locationSlugs: string[];
  imageUrl: string | null;
  displayOrder: number;
};

export type MenuCategoryDTO = {
  slug: string;
  name: string;
  displayOrder: number;
};

export type LocationDTO = {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string | null;
  hoursNote: string | null;
  ordering: { zomato?: string; swiggy?: string };
  gallery: string[];
  active: boolean;
  displayOrder: number;
};

export type EnquiryStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "QUOTED" | "WON" | "LOST";

export type EnquiryDTO = {
  id: string;
  referenceNumber: string;
  type: "celebration" | "bulk_order" | "cake" | "contact";
  contactName: string;
  phone: string;
  email: string | null;
  organization: string | null;
  locationSlug: string | null;
  eventDate: string | null;
  guestCount: number | null;
  quantity: string | null;
  budgetRange: string | null;
  requirements: string[];
  cakeType: string | null;
  cakeWeight: string | null;
  cakeMessage: string | null;
  message: string | null;
  status: EnquiryStatus;
  source: string;
  isDemoData: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OfferDTO = {
  id: string;
  title: string;
  headline: string | null;
  description: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  imageSlug: string | null;
  startsAt: string;
  endsAt: string;
  active: boolean;
};

export type CreateEnquiryInput = {
  type: EnquiryDTO["type"];
  contactName: string;
  phone: string;
  email?: string | null;
  organization?: string | null;
  locationSlug?: string | null;
  eventDate?: string | null;
  guestCount?: number | null;
  quantity?: string | null;
  budgetRange?: string | null;
  requirements?: string[];
  cakeType?: string | null;
  cakeWeight?: string | null;
  cakeMessage?: string | null;
  message?: string | null;
};

export interface DataProvider {
  /** Active mode label, e.g. "DEMO_MODE" | "SUPABASE" */
  readonly mode: string;

  getCategories(): Promise<MenuCategoryDTO[]>;
  getMenuItems(): Promise<MenuItemDTO[]>;
  getLocations(): Promise<LocationDTO[]>;
  getActiveOffers(): Promise<OfferDTO[]>;
  getSettings(): Promise<Record<string, unknown>>;

  createEnquiry(input: CreateEnquiryInput): Promise<EnquiryDTO>;
  listEnquiries(): Promise<EnquiryDTO[]>;
  updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<EnquiryDTO>;

  createMenuItem(input: Partial<MenuItemDTO> & { name: string; slug: string; categorySlug: string }): Promise<MenuItemDTO>;
  updateMenuItem(id: string, patch: Partial<MenuItemDTO>): Promise<MenuItemDTO>;

  upsertSetting(key: string, value: unknown): Promise<void>;

  trackEvent(name: string, payload?: Record<string, unknown>): Promise<void>;
  listEvents(): Promise<{ name: string; count: number }[]>;
}

export const ENQUIRY_STATUSES: EnquiryStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "QUOTED", "WON", "LOST"];

const REF_PREFIX: Record<EnquiryDTO["type"], string> = {
  celebration: "CE",
  bulk_order: "BO",
  cake: "CK",
  contact: "CO",
};

export function makeReferenceNumber(type: EnquiryDTO["type"], seq: number): string {
  return `${REF_PREFIX[type]}-2026-${String(seq).padStart(4, "0")}`;
}
