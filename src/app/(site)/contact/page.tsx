import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CakeSlice, Gift, MapPin, Sparkles, Store } from "lucide-react";
import { getProvider } from "@/lib/data-provider";
import { restaurant } from "@/config/restaurant";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { ContactForm } from "@/components/forms/contact-form";
import type { LocationCardData } from "@/components/site/location-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${restaurant.displayName} team — general messages, feedback, and quick pointers to the right enquiry form.`,
};

/** Outlets come from the provider (DB) with a verified-config fallback. */
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

/** Quick routes so general messages stay genuinely general. */
const directory = [
  {
    href: "/locations",
    icon: MapPin,
    title: "Outlet details",
    copy: "Addresses, directions and phone numbers for both Bilaspur outlets.",
  },
  {
    href: "/order",
    icon: Store,
    title: "Everyday orders",
    copy: "Continue through Zomato or Swiggy — no payment is taken on this site.",
  },
  {
    href: "/celebrations",
    icon: Sparkles,
    title: "Celebrations & events",
    copy: "Weddings, birthdays and family functions — a structured enquiry form.",
  },
  {
    href: "/bulk-orders",
    icon: Gift,
    title: "Bulk & corporate",
    copy: "Festival boxes, gifting and large food orders, quoted properly.",
  },
  {
    href: "/bakery",
    icon: CakeSlice,
    title: "Custom cakes",
    copy: "Bespoke cake enquiries go straight to the bakery team.",
  },
] as const;

export default async function ContactPage() {
  const locations = await loadLocations();

  return (
    <div className="pb-6">
      {/* Page header */}
      <header className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Contact</p>
        <h1
          className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink text-balance sm:text-5xl"
          style={{ fontVariationSettings: '"SOFT" 60' }}
        >
          Get in touch
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          The fastest reply depends on what you need: outlet details live on the Locations page, everyday
          orders go through the Order page, and celebrations, bulk and cake enquiries each have their own
          form. For everything else, send a general message below.
        </p>
      </header>

      {/* Directory + form */}
      <section
        aria-labelledby="contact-directory-heading"
        className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8"
      >
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
          {/* Directory */}
          <Reveal className="h-full lg:col-span-2">
            <div className="h-full rounded-xl border border-border bg-card p-6 sm:p-8">
              <h2
                id="contact-directory-heading"
                className="font-serif text-xl font-semibold text-ink"
              >
                Where should your message go?
              </h2>
              <ul className="mt-5 space-y-1">
                {directory.map((d) => (
                  <li key={d.href}>
                    <Link
                      href={d.href}
                      className="group -mx-2 flex min-h-[44px] items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-cream"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream text-brand transition-colors group-hover:bg-white">
                        <d.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                          {d.title}
                          <ArrowRight
                            className="h-3.5 w-3.5 text-brass transition-transform duration-150 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">
                          {d.copy}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-ink-soft/70">
                Not sure which one fits? The general message form on the right covers everything else.
              </p>
            </div>
          </Reveal>

          {/* General message form */}
          <Reveal delay={0.06} className="h-full lg:col-span-3">
            <div id="message" className="h-full scroll-mt-28 rounded-xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-serif text-xl font-semibold text-ink">Send a general message</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                A quick note works best — feedback, a question, or anything the forms above don&apos;t cover.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Outlets mini-section */}
      <section
        aria-labelledby="contact-outlets-heading"
        className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8"
      >
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Our outlets"
              title="Prefer to drop by?"
              description="Both Bilaspur outlets — details, directions and phone numbers."
            />
            <Link
              href="/locations"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
            >
              All locations <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {locations.map((loc, i) => (
            <Reveal key={loc.slug} delay={i * 0.05} className="h-full">
              <Link
                href={`/locations/${loc.slug}`}
                className="group flex h-full items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)]"
              >
                <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-cream sm:h-24 sm:w-24">
                  {loc.image ? (
                    <Image
                      src={loc.image}
                      alt={`${loc.name} outlet — generic placeholder photograph`}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span className="motif-bg absolute inset-0" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-serif text-lg font-semibold text-ink">
                    {loc.name}
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-brass transition-transform duration-150 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-ink-soft">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-brass" aria-hidden="true" />
                    <span>{loc.address}</span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
