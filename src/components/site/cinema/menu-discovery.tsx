"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { MaskedLines } from "./masked-lines";
import { Reveal } from "@/components/shared/reveal";
import { VegBadge } from "@/components/shared/veg-badge";
import { PriceTag } from "@/components/shared/price-tag";
import { AddToOrderButton } from "@/components/menu/add-to-order-button";
import { track } from "@/lib/analytics";

export type DiscoveryItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  categorySlug: string;
  priceCents: number | null;
  imageUrl: string | null;
  isVegetarian: boolean;
  isFeatured: boolean;
};

/**
 * 06 — INTERACTIVE MENU DISCOVERY
 * The deliberate turn from brand mode to utility mode. Appetite has been
 * built; now the customer gets speed. Search "dosa" — or anything on the
 * full menu — and results are instant.
 */
export function MenuDiscovery({ items }: { items: DiscoveryItem[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmed = query.trim().toLowerCase();

  const featured = useMemo(
    () => items.filter((i) => i.isFeatured).slice(0, 8),
    [items],
  );

  const results = useMemo(() => {
    if (trimmed.length < 2) return featured;
    return items.filter((item) =>
      [item.name, item.description ?? "", item.categorySlug.replace(/-/g, " ")]
        .join(" ")
        .toLowerCase()
        .includes(trimmed),
    );
  }, [items, featured, trimmed]);

  const totalMatches = useMemo(() => {
    if (trimmed.length < 2) return 0;
    return items.filter((item) =>
      [item.name, item.description ?? "", item.categorySlug.replace(/-/g, " ")]
        .join(" ")
        .toLowerCase()
        .includes(trimmed),
    ).length;
  }, [items, trimmed]);

  const searching = trimmed.length >= 2;

  return (
    <section aria-labelledby="craving-heading" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow">The full menu</p>
          </Reveal>
          <MaskedLines
            as="h2"
            id="craving-heading"
            className="display-md mt-4 font-serif font-medium text-ink"
            lines={["What are you craving?"]}
          />
        </div>

        {/* Search — utility mode begins here */}
        <Reveal delay={0.2} className="mt-10 max-w-xl">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (trimmed.length >= 2) {
                track("menu_search", { from: "homepage", query: query.trim() });
                window.location.href = `/menu?q=${encodeURIComponent(query.trim())}`;
              }
            }}
          >
            <label htmlFor="home-search" className="sr-only">
              Search the menu
            </label>
            <div className="flex h-14 items-center gap-3 rounded-full border border-border bg-card px-5 shadow-[0_1px_0_rgba(34,28,20,0.03)] transition-colors focus-within:border-brass">
              <Search className="h-4.5 w-4.5 shrink-0 text-ink-soft" aria-hidden="true" />
              <input
                ref={inputRef}
                id="home-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dosa, thali, sweets…"
                autoComplete="off"
                enterKeyHint="search"
                aria-describedby="home-search-status"
                className="h-full w-full bg-transparent text-[15px] text-ink placeholder:text-ink-soft/60 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <p aria-live="polite" id="home-search-status" className="mt-2.5 pl-2 text-xs text-ink-soft">
              {searching
                ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query.trim()}”`
                : "Start typing to search the menu — or browse the favourites below."}
            </p>
          </form>
        </Reveal>

        {/* Results / featured grid */}
        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
          {results.slice(0, 8).map((item, i) => (
            <Reveal as="li" variant="fade" delay={(i % 4) * 0.06} key={item.id}>
              <article className="group">
                <Link href={`/menu?q=${encodeURIComponent(item.name.split(" ").slice(0, 2).join(" "))}`} className="block" tabIndex={-1} aria-hidden="true">
                  <figure className="soft-mask relative aspect-[4/3] bg-cream">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                      />
                    )}
                  </figure>
                </Link>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 font-serif text-[17px] font-medium leading-tight text-ink">
                      <VegBadge size={11} /> {item.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-ink-soft/70">
                      {item.categorySlug.replace(/-/g, " ")}
                    </p>
                    <PriceTag priceCents={item.priceCents} className="mt-2 text-xs" />
                  </div>
                  <AddToOrderButton
                    item={{ slug: item.slug, name: item.name, categorySlug: item.categorySlug, imageUrl: item.imageUrl }}
                    compact
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        {results.length === 0 && searching && (
          <Reveal>
            <div className="mt-6 rounded-2xl border border-dashed border-brass/50 bg-card px-6 py-10 text-center">
              <p className="font-serif text-xl text-ink">Nothing on the menu for “{query.trim()}”.</p>
              <p className="mt-2 text-sm text-ink-soft">
                Try “dosa”, “thali”, “cake” or “namkeen” — or browse the full menu.
              </p>
            </div>
          </Reveal>
        )}

        {searching && results.length > 0 && totalMatches > 8 && (
          <Reveal className="mt-8">
            <Link
              href={`/menu?q=${encodeURIComponent(query.trim())}`}
              className="quiet-link text-[11px] font-semibold uppercase tracking-[0.22em] text-brand"
            >
              See all {totalMatches} results in the full menu →
            </Link>
          </Reveal>
        )}

        <Reveal className="mt-14 border-t border-border pt-10">
          <Link
            href={searching ? `/menu?q=${encodeURIComponent(query.trim())}` : "/menu"}
            className="group inline-flex items-center gap-4 font-serif text-2xl font-medium text-ink transition-colors hover:text-brand sm:text-3xl"
          >
            View the full menu
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-parchment">
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>
          <p className="mt-3 text-xs text-ink-soft/70">
            Availability and outlets update live from the kitchen.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
