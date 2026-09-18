import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";
import { TrackedAnchor } from "@/components/site/location-card";

/**
 * 08 — LOCATIONS. Real, not duplicated cards
 * SVM large with alternating composition for Mangla — two outlets presented as
 * the two places they are. All data from the verified config only.
 */
export function LocationsChapter() {
  return (
    <section aria-labelledby="locations-heading" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <p className="eyebrow">Find us</p>
            </Reveal>
            <MaskedLines
              as="h2"
              id="locations-heading"
              className="display-md mt-4 font-serif font-medium text-ink"
              lines={["Two outlets.", "One city."]}
            />
          </div>
          <Reveal delay={0.2} className="max-w-xs pb-2">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Srikant Verma Marg and Mangla Chowk — same kitchen spirit, same
              menu breadth.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 space-y-20 sm:mt-20 sm:space-y-28">
          {restaurant.locations.map((loc, i) => {
            const mirrored = i % 2 === 1;
            return (
              <div key={loc.slug}>
                <Reveal variant="fade">
                  <div className="flex items-center gap-5 border-t border-border pt-6">
                    <span className="font-serif text-sm italic text-brass">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="eyebrow-ink">
                      {loc.name}
                    </span>
                  </div>
                </Reveal>
                <div
                  className={`mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                    mirrored ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <Reveal variant="mask">
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="group block"
                      aria-label={`View the ${loc.shortName} outlet details`}
                    >
                      <figure className="soft-mask relative aspect-[16/11] bg-cream">
                        <Image
                          src={loc.image}
                          alt={`${loc.name} storefront (concept imagery — to be replaced with a real photograph)`}
                          fill
                          sizes="(max-width: 1024px) 92vw, 46vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </figure>
                    </Link>
                  </Reveal>
                  <div>
                    <Reveal variant="fade">
                      <h3 className="font-serif text-4xl font-medium text-ink sm:text-5xl">
                        {loc.shortName}
                      </h3>
                      <p className="mt-4 flex max-w-sm items-start gap-2.5 text-[15px] leading-relaxed text-ink-soft">
                        <MapPin className="mt-1 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
                        {loc.address}
                      </p>
                    </Reveal>
                    <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                      <TrackedAnchor
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Maosaji ${loc.name}, ${loc.address}`)}`}
                        eventName="directions_click"
                        payload={{ from: "homepage", location: loc.slug }}
                        className="group inline-flex items-center gap-3 font-serif text-lg font-medium text-ink transition-colors hover:text-brand"
                      >
                        Get directions
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-parchment">
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </TrackedAnchor>
                      <Link
                        href={`/order?outlet=${loc.slug}`}
                        className="quiet-link text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
                      >
                        Order from here
                      </Link>
                      <Link
                        href={`/locations/${loc.slug}`}
                        className="quiet-link text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
                      >
                        Outlet details
                      </Link>
                    </Reveal>
                    <Reveal delay={0.2}>
                      <p className="mt-6 text-xs text-ink-soft/60">
                        Phone {loc.phoneReferenceOnly} — as listed publicly; hours to be confirmed for production.
                      </p>
                    </Reveal>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
