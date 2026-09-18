import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CakeSlice, Gift, Store } from "lucide-react";
import { getProvider } from "@/lib/data-provider";
import { restaurant } from "@/config/restaurant";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { LocationCard, type LocationCardData } from "@/components/site/location-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Locations",
  description: `Find ${restaurant.displayName} in ${restaurant.city} — outlet addresses, directions and ordering links.`,
};

/** Locations come from the provider (DB) with a verified-config fallback. */
async function loadLocations(): Promise<LocationCardData[]> {
  const rows = (await getProvider().getLocations()).filter((l) => l.active);
  if (rows.length > 0) {
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      address: row.address,
      phone: row.phone,
      image: row.gallery[0] ?? restaurant.locations.find((c) => c.slug === row.slug)?.image ?? null,
    }));
  }
  return restaurant.locations.map((c) => ({
    slug: c.slug,
    name: c.name,
    address: c.address,
    phone: c.phoneReferenceOnly,
    image: c.image,
  }));
}

const nextSteps = [
  {
    href: "/order",
    icon: Store,
    title: "Order online",
    copy: "Pick an outlet, then continue with Zomato or Swiggy.",
  },
  {
    href: "/celebrations",
    icon: CakeSlice,
    title: "Celebrations",
    copy: "Events and family functions with a structured enquiry.",
  },
  {
    href: "/bulk-orders",
    icon: Gift,
    title: "Bulk & gifting",
    copy: "Festival boxes and large orders, quoted properly.",
  },
];

export default async function LocationsPage() {
  const locations = await loadLocations();

  return (
    <div className="pb-6">
      {/* Page header */}
      <header className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Find us"
            title="Find Your Maosaji"
            description={`Two outlets in ${restaurant.city} — Srikant Verma Marg near Rama Magneto Mall, and Mangla Chowk on Mungeli Road. Directions, menus and ordering for each, in one place.`}
          />
        </Reveal>
      </header>

      {/* Outlet grid */}
      <section aria-labelledby="outlets-heading" className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <h2 id="outlets-heading" className="sr-only">
          All outlets
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {locations.map((location, i) => (
            <Reveal key={location.slug} delay={i * 0.06} className="h-full">
              <LocationCard location={location} />
            </Reveal>
          ))}
        </div>

        {locations.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-ink-soft">
            No outlets are listed yet. This concept is prepared for {restaurant.displayName}&apos;s Bilaspur
            locations and will fill in as soon as the outlet records are added.
          </p>
        )}

        <Reveal delay={0.1}>
          <p className="mt-8 rounded-xl border border-border bg-cream px-5 py-4 text-xs leading-relaxed text-ink-soft">
            Everything on this page reflects publicly listed details — phone numbers are shown as listed
            publicly, and opening hours will be confirmed with the owner before production. No map pins are
            embedded; the Directions button simply hands the outlet address to Google Maps.
          </p>
        </Reveal>
      </section>

      {/* Where to next */}
      <section aria-labelledby="locations-next-heading" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Where to next"
            title="Found your outlet?"
            description="Keep going — order in, or tell us what you're planning."
          />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {nextSteps.map((step, i) => (
            <Reveal key={step.href} delay={i * 0.05} className="h-full">
              <Link
                href={step.href}
                className="group flex h-full gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="flex items-center gap-1.5 font-serif text-base font-semibold text-ink">
                    {step.title}
                    <ArrowRight
                      className="h-3.5 w-3.5 text-brass transition-transform duration-150 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-soft">{step.copy}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
