"use client";

/**
 * Reusable location card + tracked-link primitives for all location surfaces.
 * ─────────────────────────────────────────────────────────────────────────
 * Data honesty rules baked in (see 02_VERIFIED_FACTS.json / 03_CONTENT_AND_DATA_RULES.md):
 *  - phones are REFERENCE ONLY ("as listed publicly") and tel: clicks are tracked
 *  - opening hours are NEVER shown — only "Hours to be confirmed for production"
 *  - no map embeds: the Directions button hands the address to Google Maps search
 *
 * This is a client module (needs onClick analytics), so server pages import only
 * components/types from it — never plain functions.
 */

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Navigation, Phone } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Serializable location shape shared between server pages and client cards. */
export type LocationCardData = {
  slug: string;
  name: string;
  address: string;
  phone: string | null;
  image: string | null;
};

/** Google Maps search handoff (client-side use only). */
export function mapsDirectionsUrl(name: string, address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}`)}`;
}

/** tel: href from a display number like "+91 91525 49189" (client-side use only). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+0-9]/g, "")}`;
}

/**
 * Anchor that fires one analytics event on click.
 * Used for tel:, Google Maps and ordering-partner links (server pages can't set onClick).
 */
export function TrackedAnchor({
  href,
  eventName,
  payload,
  openInNewTab = false,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  eventName: string;
  payload?: Record<string, unknown>;
  openInNewTab?: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      onClick={() => track(eventName, payload)}
      className={className}
      aria-label={ariaLabel}
      {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

/** Fires an analytics event once on mount (client "page-view" style events, e.g. location_selected). */
export function TrackOnMount({
  eventName,
  payload,
}: {
  eventName: string;
  payload?: Record<string, unknown>;
}) {
  useEffect(() => {
    track(eventName, payload);
    // Fire once per mount — payload is intentionally not a dependency.
  }, [eventName]);
  return null;
}

/** Standard location card used on the locations index (and reusable elsewhere). */
export function LocationCard({ location, className }: { location: LocationCardData; className?: string }) {
  const mapsUrl = mapsDirectionsUrl(location.name, location.address);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)]",
        className
      )}
    >
      {/* Image → outlet detail page */}
      <Link
        href={`/locations/${location.slug}`}
        aria-label={`View the ${location.name} outlet`}
        className="relative block aspect-[16/10] overflow-hidden bg-cream"
      >
        {location.image ? (
          <Image
            src={location.image}
            alt={`${location.name} outlet — generic placeholder photograph`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="motif-bg absolute inset-0" aria-hidden="true" />
        )}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-parchment/30 bg-ink/45 px-3 py-1.5 text-[11px] font-medium text-parchment backdrop-blur-sm">
          View outlet <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-xl font-semibold text-ink">{location.name}</h3>

        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
          <span>{location.address}</span>
        </p>

        {location.phone && (
          <p className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
            <span>
              {location.phone}{" "}
              <span className="text-xs text-ink-soft/60">(as listed publicly)</span>
            </span>
          </p>
        )}

        {/* Unverified fact — never show hours, only this production note */}
        <p className="mt-2 flex items-center gap-2 text-xs text-ink-soft/70">
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Hours to be confirmed for production
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-5">
          <div className="grid grid-cols-2 gap-2.5">
            <TrackedAnchor
              href={mapsUrl}
              eventName="directions_click"
              payload={{ location: location.slug, from: "location-card" }}
              openInNewTab
              className={cn(
                "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md bg-brand px-3 text-sm font-semibold text-parchment transition-all duration-200 hover:bg-brand-deep active:scale-[0.98]",
                !location.phone && "col-span-2"
              )}
            >
              <Navigation className="h-4 w-4" aria-hidden="true" /> Directions
            </TrackedAnchor>
            {location.phone && (
              <TrackedAnchor
                href={telHref(location.phone)}
                eventName="call_click"
                payload={{ location: location.slug, from: "location-card" }}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-border bg-white px-3 text-sm font-medium text-ink transition-all duration-200 hover:border-brass/60 hover:shadow-sm active:scale-[0.98]"
              >
                <Phone className="h-4 w-4 text-brand" aria-hidden="true" /> Call
              </TrackedAnchor>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6">
            <Link
              href="/menu"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
            >
              View menu <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={`/order?outlet=${location.slug}`}
              onClick={() => track("order_click", { from: "location-card", location: location.slug })}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
            >
              Order from here <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
