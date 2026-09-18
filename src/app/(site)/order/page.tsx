import type { Metadata } from "next";
import { getProvider } from "@/lib/data-provider";
import { restaurant } from "@/config/restaurant";
import { OrderHub, type OrderOutlet } from "./order-hub";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Online",
  description: `Order ${restaurant.displayName} through Zomato or Swiggy — choose your outlet and continue with a partner you already use. No payment is taken on this site.`,
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Outlets come from the provider (DB) with a verified-config fallback. */
async function loadOutlets(): Promise<OrderOutlet[]> {
  const rows = (await getProvider().getLocations()).filter((l) => l.active);
  if (rows.length > 0) {
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      shortName: restaurant.locations.find((c) => c.slug === row.slug)?.shortName ?? null,
      address: row.address,
      phone: row.phone,
      image: row.gallery[0] ?? restaurant.locations.find((c) => c.slug === row.slug)?.image ?? null,
      ordering: row.ordering,
    }));
  }
  return restaurant.locations.map((c) => ({
    slug: c.slug,
    name: c.name,
    shortName: c.shortName,
    address: c.address,
    phone: c.phoneReferenceOnly,
    image: c.image,
    ordering: { zomato: c.ordering.zomato, swiggy: c.ordering.swiggy },
  }));
}

export default async function OrderPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const initialOutlet =
    typeof sp.outlet === "string" ? sp.outlet : Array.isArray(sp.outlet) ? (sp.outlet[0] ?? null) : null;

  const outlets = await loadOutlets();

  return <OrderHub outlets={outlets} initialOutlet={initialOutlet} />;
}
