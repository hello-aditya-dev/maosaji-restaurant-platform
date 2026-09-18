import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import { getProvider } from "@/lib/data-provider";
import { restaurant } from "@/config/restaurant";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { VegBadge } from "@/components/shared/veg-badge";
import { PriceTag } from "@/components/shared/price-tag";
import { TrackedAnchor, TrackOnMount } from "@/components/site/location-card";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

type OutletData = {
  slug: string;
  name: string;
  address: string;
  phone: string | null;
  ordering: { zomato?: string; swiggy?: string };
  gallery: string[];
  image: string | null;
};

/** Outlets come from the provider (DB) with a verified-config fallback. */
async function loadOutlets(): Promise<OutletData[]> {
  const rows = (await getProvider().getLocations()).filter((l) => l.active);
  if (rows.length > 0) {
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      address: row.address,
      phone: row.phone,
      ordering: row.ordering,
      gallery: row.gallery,
      image: row.gallery[0] ?? restaurant.locations.find((c) => c.slug === row.slug)?.image ?? null,
    }));
  }
  return restaurant.locations.map((c) => ({
    slug: c.slug,
    name: c.name,
    address: c.address,
    phone: c.phoneReferenceOnly,
    ordering: { zomato: c.ordering.zomato, swiggy: c.ordering.swiggy },
    gallery: [c.image],
    image: c.image,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const outlet = (await loadOutlets()).find((o) => o.slug === slug);
  if (!outlet) return { title: "Outlet not found" };
  return {
    title: outlet.name,
    description: `${outlet.name} — ${outlet.address}. Directions, phone and ordering links for this ${restaurant.displayName} outlet.`,
  };
}

export default async function OutletPage({ params }: PageProps) {
  const { slug } = await params;
  const [outlets, menuItems] = await Promise.all([loadOutlets(), getProvider().getMenuItems()]);

  const outlet = outlets.find((o) => o.slug === slug);
  if (!outlet) notFound();

  // Only items actually available here: outlet-agnostic (empty list) or explicitly listed.
  const availableHere = menuItems.filter(
    (item) => item.isAvailable && (item.locationSlugs.length === 0 || item.locationSlugs.includes(slug))
  );
  const preview = availableHere.slice(0, 8);
  const moreCount = Math.max(0, availableHere.length - preview.length);

  const others = outlets.filter((o) => o.slug !== slug);
  const other = others[0] ?? null;

  // Hero already shows gallery[0]; the gallery section shows only additional photos.
  const galleryExtras = outlet.gallery.slice(1).filter(Boolean);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${outlet.name}, ${outlet.address}`
  )}`;
  const telUrl = outlet.phone ? `tel:${outlet.phone.replace(/[^+0-9]/g, "")}` : null;

  return (
    <>
      {/* location_selected — fired once when this outlet page is viewed */}
      <TrackOnMount eventName="location_selected" payload={{ location: outlet.slug, from: "outlet-page" }} />

      {/* Outlet hero — smaller echo of the homepage treatment */}
      <section
        aria-labelledby="outlet-hero-heading"
        className="grain relative flex h-[40vh] min-h-[320px] flex-col justify-end overflow-hidden bg-ink"
      >
        {outlet.image ? (
          <Image
            src={outlet.image}
            alt={`${outlet.name} outlet — generic placeholder photograph`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="motif-bg absolute inset-0 opacity-40" aria-hidden="true" />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink/75"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brass-soft sm:text-xs">
            Find us · {restaurant.city}
          </p>
          <h1
            id="outlet-hero-heading"
            className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-parchment text-balance sm:text-5xl"
            style={{ fontVariationSettings: '"SOFT" 60' }}
          >
            {outlet.name}
          </h1>
          <p className="mt-3 flex max-w-xl items-start gap-2 text-sm leading-relaxed text-cream/85 sm:text-base">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass-soft" aria-hidden="true" />
            <span>{outlet.address}</span>
          </p>
        </div>
      </section>

      {/* Back to all locations */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/locations"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All locations
        </Link>
      </div>

      {/* Visit + order */}
      <section aria-labelledby="visit-heading" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Visit this outlet */}
          <Reveal className="h-full">
            <div className="h-full rounded-xl border border-border bg-card p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Visit</p>
              <h2
                id="visit-heading"
                className="mt-3 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                Plan your visit
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">Address</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{outlet.address}</p>
                  </div>
                </div>

                {outlet.phone && telUrl && (
                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        Phone{" "}
                        <span className="font-normal text-xs text-ink-soft/70">(as listed publicly)</span>
                      </p>
                      <TrackedAnchor
                        href={telUrl}
                        eventName="call_click"
                        payload={{ location: outlet.slug, from: "outlet-page" }}
                        className="mt-1 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-brand underline decoration-brass-soft/60 underline-offset-4 transition-colors hover:text-brand-deep"
                      >
                        {outlet.phone} — tap to call
                      </TrackedAnchor>
                    </div>
                  </div>
                )}

                {/* Unverified fact — hours are never displayed */}
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">Opening hours</p>
                    <p className="mt-1 text-sm text-ink-soft/70">Hours to be confirmed for production</p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <TrackedAnchor
                  href={mapsUrl}
                  eventName="directions_click"
                  payload={{ location: outlet.slug, from: "outlet-page" }}
                  openInNewTab
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-md bg-brand px-5 text-sm font-semibold text-parchment transition-all duration-200 hover:bg-brand-deep active:scale-[0.98]"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" /> Get directions
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </TrackedAnchor>
                {outlet.phone && telUrl && (
                  <TrackedAnchor
                    href={telUrl}
                    eventName="call_click"
                    payload={{ location: outlet.slug, from: "outlet-page-button" }}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-border bg-white px-5 text-sm font-medium text-ink transition-all duration-200 hover:border-brass/60 hover:shadow-sm active:scale-[0.98]"
                  >
                    <Phone className="h-4 w-4 text-brand" aria-hidden="true" /> Call outlet
                  </TrackedAnchor>
                )}
              </div>
            </div>
          </Reveal>

          {/* Order from this outlet */}
          <Reveal delay={0.06} className="h-full">
            <div className="h-full rounded-xl border border-border bg-card p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Ordering</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Order from this outlet
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Continue with a partner you already use — each button opens this outlet&apos;s verified public
                listing in a new tab.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {outlet.ordering.zomato && (
                  <TrackedAnchor
                    href={outlet.ordering.zomato}
                    eventName="zomato_click"
                    payload={{ location: outlet.slug, from: "outlet-page" }}
                    openInNewTab
                    className="group flex min-h-[44px] flex-col justify-center gap-1 rounded-lg border border-[#e23744]/30 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#e23744]/60 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)] active:scale-[0.98]"
                  >
                    <span className="text-lg font-bold tracking-tight text-[#c0392b]">Zomato</span>
                    <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                      Delivery &amp; pickup
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-[#c0392b] transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </TrackedAnchor>
                )}
                {outlet.ordering.swiggy && (
                  <TrackedAnchor
                    href={outlet.ordering.swiggy}
                    eventName="swiggy_click"
                    payload={{ location: outlet.slug, from: "outlet-page" }}
                    openInNewTab
                    className="group flex min-h-[44px] flex-col justify-center gap-1 rounded-lg border border-[#fc8019]/40 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fc8019]/70 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)] active:scale-[0.98]"
                  >
                    <span className="text-lg font-bold tracking-tight text-[#b96414]">Swiggy</span>
                    <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                      Delivery &amp; pickup
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-[#b96414] transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </TrackedAnchor>
                )}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-ink-soft/70">
                This concept routes you to existing ordering partners — no payment is taken on this site.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Menu availability at this outlet */}
      <section
        aria-labelledby="outlet-menu-heading"
        className="border-t border-border bg-cream py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader
                eyebrow="At this outlet"
                title="What's on the menu"
                description="A quick preview of items available at this outlet — the full menu has the complete range."
              />
              <Link
                href="/menu"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
              >
                View full menu <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          {preview.length === 0 ? (
            <Reveal delay={0.05}>
              <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-6 text-sm text-ink-soft">
                The item list for this outlet is being updated —{" "}
                <Link href="/menu" className="font-medium text-brand underline underline-offset-4">
                  browse the full menu
                </Link>{" "}
                in the meantime.
              </p>
            </Reveal>
          ) : (
            <>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {preview.map((item, i) => (
                  <Reveal as="li" key={item.id} delay={(i % 4) * 0.04}>
                    <div className="flex h-full items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3.5">
                      <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-ink">
                        <VegBadge size={12} />
                        <span className="truncate">{item.name}</span>
                      </span>
                      <PriceTag priceCents={item.priceCents} className="shrink-0 text-xs" />
                    </div>
                  </Reveal>
                ))}
              </ul>
              {moreCount > 0 && (
                <Reveal delay={0.08}>
                  <p className="mt-5 text-sm text-ink-soft">
                    +{moreCount} more items available here —{" "}
                    <Link
                      href="/menu"
                      className="font-medium text-brand underline decoration-brass-soft/60 underline-offset-4 transition-colors hover:text-brand-deep"
                    >
                      view the full menu
                    </Link>
                    .
                  </p>
                </Reveal>
              )}
            </>
          )}
        </div>
      </section>

      {/* Outlet gallery — only when there are photos beyond the hero image */}
      {galleryExtras.length > 0 && (
        <section aria-labelledby="outlet-gallery-heading" className="border-t border-border py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeader
                eyebrow="Gallery"
                title={`Inside ${outlet.name}`}
                description="Generic placeholder photography for the concept — real outlet photos are added with the owner."
              />
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryExtras.slice(0, 6).map((img, i) => (
                <Reveal key={img} delay={i * 0.05}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-cream">
                    <Image
                      src={img}
                      alt={`${outlet.name} — generic placeholder photograph`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other outlet */}
      {other && (
        <section
          aria-labelledby="other-outlet-heading"
          className="border-t border-border bg-cream py-12 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-6">
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg border border-border bg-cream sm:h-28 sm:w-44">
                  {other.image ? (
                    <Image
                      src={other.image}
                      alt={`${other.name} outlet — generic placeholder photograph`}
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="motif-bg absolute inset-0" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">
                    Also in {restaurant.city}
                  </p>
                  <h2
                    id="other-outlet-heading"
                    className="mt-2 font-serif text-xl font-semibold text-ink sm:text-2xl"
                  >
                    {other.name}
                  </h2>
                  <p className="mt-1.5 flex items-start gap-1.5 text-sm leading-relaxed text-ink-soft">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" aria-hidden="true" />
                    <span>{other.address}</span>
                  </p>
                </div>
                <Link
                  href={`/locations/${other.slug}`}
                  className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-white px-5 text-sm font-medium text-ink transition-all duration-200 hover:border-brass/60 hover:shadow-sm active:scale-[0.98]"
                >
                  View outlet <ArrowRight className="h-4 w-4 text-brand" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
