import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { restaurant } from "@/config/restaurant";

/**
 * Root 404 — renders inside the root layout only (outside the (site) group),
 * so it carries its own minimal shell: a header link home, centered content
 * and motif accents. No site navbar/footer by design.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ivory">
      {/* Subtle heritage-motif accents (brass lattice at 5% opacity) */}
      <div
        aria-hidden="true"
        className="motif-bg pointer-events-none absolute -left-16 -top-16 h-80 w-80 opacity-[0.05]"
      />
      <div
        aria-hidden="true"
        className="motif-bg pointer-events-none absolute -bottom-20 -right-20 h-[28rem] w-[28rem] opacity-[0.05]"
      />

      {/* Minimal header — own link back home */}
      <header className="relative z-10 border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-serif text-xl font-semibold tracking-tight text-brand transition-colors hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass rounded-sm"
            aria-label={`${restaurant.displayName} — return to home page`}
            style={{ fontVariationSettings: '"SOFT" 50' }}
          >
            {restaurant.displayName}
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-ink-soft transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Centered content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <span
            aria-hidden="true"
            className="mx-auto block h-2.5 w-2.5 rotate-45 bg-brass/70"
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-brass">
            404 · Not found
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Looks like this table is empty.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            The page you&rsquo;re after isn&rsquo;t on the menu.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-6 text-sm font-semibold text-parchment transition-all duration-200 hover:bg-brand-deep active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Return home
            </Link>
            <Link
              href="/menu"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-[#fffdf8] px-6 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/60 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              <UtensilsCrossed className="h-4 w-4 text-brass" aria-hidden="true" />
              Explore the menu
            </Link>
          </div>

          <p className="mt-12 text-xs leading-relaxed text-ink-soft/70">
            Private concept — not the official {restaurant.displayName} website.
          </p>
        </div>
      </main>
    </div>
  );
}
