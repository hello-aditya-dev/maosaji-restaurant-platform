"use client";

/**
 * Order hub (client) — outlet selection + ordering-partner handoff.
 * Phase one has NO direct checkout: users are routed to the outlet's verified
 * Zomato/Swiggy listing or its publicly listed phone. The selected outlet
 * persists in the site store (shared with the order drawer).
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin, Phone } from "lucide-react";
import { useSiteStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { restaurant } from "@/config/restaurant";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { telHref } from "@/components/site/location-card";

export type OrderOutlet = {
  slug: string;
  name: string;
  shortName: string | null;
  address: string;
  phone: string | null;
  image: string | null;
  ordering: { zomato?: string; swiggy?: string };
};

export function OrderHub({
  outlets,
  initialOutlet,
}: {
  outlets: OrderOutlet[];
  initialOutlet: string | null;
}) {
  const setOutlet = useSiteStore((s) => s.setOutlet);

  // An explicit ?outlet= param is known at render time (a serialized prop), so it
  // seeds the initial state — SSR and first client render agree, no flash. The
  // persisted store selection (localStorage, unknown during SSR) is applied on mount.
  const paramValid =
    initialOutlet && outlets.some((o) => o.slug === initialOutlet) ? initialOutlet : null;
  const [selected, setSelected] = useState<string | null>(paramValid ?? outlets[0]?.slug ?? null);

  useEffect(() => {
    if (paramValid) return; // explicit param wins over anything stored
    const stored = useSiteStore.getState().outlet;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- persisted store selection applied on mount (hydration guard)
    if (stored && outlets.some((o) => o.slug === stored)) setSelected(stored);
    // Resolve once on mount — outlets come from a one-time server render.
  }, []);

  const current = outlets.find((o) => o.slug === selected) ?? null;

  const select = (slug: string) => {
    setSelected(slug);
    setOutlet(slug); // persists for the order drawer
    track("location_selected", { from: "order-hub", location: slug });
  };

  return (
    <div className="pb-6">
      {/* Page header */}
      <header className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Order online</p>
        <h1
          className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink text-balance sm:text-5xl"
          style={{ fontVariationSettings: '"SOFT" 60' }}
        >
          Order from {restaurant.displayName}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          Pick your outlet, then continue with a partner you already use. This concept routes you to
          existing ordering partners — no payment is taken on this site.
        </p>
      </header>

      {/* Step one — outlet */}
      <section
        aria-labelledby="order-outlet-heading"
        className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8"
      >
        <Reveal>
          <SectionHeader
            eyebrow="Step one"
            title="Where would you like to order from?"
            description="Both Bilaspur outlets are listed on Zomato and Swiggy."
          />
        </Reveal>

        {outlets.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-6 text-sm leading-relaxed text-ink-soft">
            No outlets are listed yet — meanwhile the{" "}
            <Link href="/menu" className="font-medium text-brand underline underline-offset-4">
              full menu
            </Link>{" "}
            is ready to browse.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2" role="group" aria-label="Choose your outlet">
            {outlets.map((o) => {
              const active = selected === o.slug;
              return (
                <Reveal key={o.slug} className="h-full">
                  <button
                    type="button"
                    onClick={() => select(o.slug)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)] sm:p-5 ${
                      active
                        ? "border-brand bg-brand/10 shadow-[0_10px_30px_-12px_rgba(38,33,27,0.2)]"
                        : "border-border bg-card hover:border-brass/50"
                    }`}
                  >
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-cream sm:h-20 sm:w-20">
                      {o.image ? (
                        <Image src={o.image} alt="" fill sizes="80px" className="object-cover" />
                      ) : (
                        <span className="motif-bg absolute inset-0" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
                        {o.shortName ?? o.name}
                        {active && <Check className="h-4 w-4 text-brand" aria-hidden="true" />}
                      </span>
                      <span className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-ink-soft">
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-brass" aria-hidden="true" />
                        <span>{o.address}</span>
                      </span>
                    </span>
                    <span
                      className={`ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        active ? "border-brand bg-brand" : "border-border bg-white"
                      }`}
                      aria-hidden="true"
                    >
                      {active && <Check className="h-3 w-3 text-parchment" />}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* Step two — channel */}
      <section
        aria-labelledby="order-channel-heading"
        className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8"
      >
        <Reveal>
          <SectionHeader
            eyebrow="Step two"
            title="How would you like to order?"
            description={
              current
                ? `Continue with a partner for ${current.shortName ?? current.name} — each opens the outlet's verified public listing in a new tab.`
                : "Choose an outlet above to see your ordering options."
            }
          />
        </Reveal>

        {current ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {current.ordering.zomato && (
              <a
                href={current.ordering.zomato}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("zomato_click", { from: "order-hub", location: current.slug })}
                className="group flex min-h-[44px] flex-col justify-between gap-6 rounded-xl border border-[#e23744]/30 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#e23744]/60 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)] active:scale-[0.98] sm:min-h-[140px]"
              >
                <span className="text-2xl font-bold tracking-tight text-[#c0392b]">Zomato</span>
                <span className="flex items-center justify-between text-sm text-ink-soft">
                  Order on Zomato
                  <ArrowUpRight
                    className="h-4 w-4 text-[#c0392b] transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            )}

            {current.ordering.swiggy && (
              <a
                href={current.ordering.swiggy}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("swiggy_click", { from: "order-hub", location: current.slug })}
                className="group flex min-h-[44px] flex-col justify-between gap-6 rounded-xl border border-[#fc8019]/40 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fc8019]/70 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)] active:scale-[0.98] sm:min-h-[140px]"
              >
                <span className="text-2xl font-bold tracking-tight text-[#b96414]">Swiggy</span>
                <span className="flex items-center justify-between text-sm text-ink-soft">
                  Order on Swiggy
                  <ArrowUpRight
                    className="h-4 w-4 text-[#b96414] transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            )}

            {current.phone && (
              <a
                href={telHref(current.phone)}
                onClick={() => track("call_click", { from: "order-hub", location: current.slug })}
                className="group flex min-h-[44px] flex-col justify-between gap-6 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/60 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)] active:scale-[0.98] sm:min-h-[140px]"
              >
                <span className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-ink">
                  <Phone className="h-5 w-5 text-brand" aria-hidden="true" />
                  Call
                </span>
                <span className="text-sm leading-relaxed text-ink-soft">
                  {current.phone}{" "}
                  <span className="block text-xs text-ink-soft/60">(as listed publicly)</span>
                </span>
              </a>
            )}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-6 text-sm text-ink-soft">
            Select an outlet above to see the Zomato, Swiggy and call options for it.
          </p>
        )}

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink-soft/70">
          This concept routes you to existing ordering partners — no payment is taken on this site.
          Items you shortlist while browsing the menu travel with you: use the order bar at the bottom of
          the screen to copy your list across.
        </p>
      </section>
    </div>
  );
}
