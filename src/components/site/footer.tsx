import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { restaurant } from "@/config/restaurant";

/**
 * Editorial footer — a quiet sign-off under the cinematic page. Big wordmark,
 * hairline columns, verified data only, private-concept disclaimer prominent.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-parchment/10 bg-espresso text-parchment">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Wordmark + disclaimer */}
          <div className="md:col-span-5">
            <p className="font-serif text-5xl font-medium leading-none tracking-tight text-parchment sm:text-6xl">
              {restaurant.displayName}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-parchment/60">
              {restaurant.tagline} Restaurant, sweets, bakery and namkeen —
              served across Bilaspur.
            </p>
            <p className="mt-7 max-w-sm rounded-xl border border-parchment/15 bg-parchment/[0.04] px-4 py-3.5 text-xs leading-relaxed text-parchment/65">
              <span className="font-semibold text-brass-soft">Private concept.</span>{" "}
              {restaurant.demoDisclaimer} No relationship to third-party platforms
              is implied.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-parchment/45">Explore</p>
            <ul className="mt-5 space-y-3 text-sm">
              {restaurant.nav.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-parchment/80 transition-colors hover:text-brass-soft">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gallery" className="text-parchment/80 transition-colors hover:text-brass-soft">Gallery</Link>
              </li>
              <li>
                <Link href="/contact" className="text-parchment/80 transition-colors hover:text-brass-soft">Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Locations */}
          <div className="md:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-parchment/45">Locations</p>
            <ul className="mt-5 space-y-6 text-sm">
              {restaurant.locations.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="font-serif text-base font-medium text-parchment/90 transition-colors hover:text-brass-soft"
                  >
                    {loc.name}
                  </Link>
                  <p className="mt-1.5 flex items-start gap-2 text-[13px] leading-relaxed text-parchment/60">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-brass" aria-hidden="true" />
                    <span>{loc.address}</span>
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[13px] text-parchment/60">
                    <Phone className="h-3 w-3 shrink-0 text-brass" aria-hidden="true" />
                    <span>
                      {loc.phoneReferenceOnly} <span className="text-parchment/40">(as listed publicly)</span>
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-parchment/10 pt-6 text-xs text-parchment/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Restaurant Platform v1 — private concept for {restaurant.displayName}. Not the official website.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-brass-soft">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-brass-soft">Terms</Link>
            <span aria-hidden="true">·</span>
            <span>noindex · nofollow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
