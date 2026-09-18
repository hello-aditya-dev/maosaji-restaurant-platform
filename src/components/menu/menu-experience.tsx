"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Plus, Search, X } from "lucide-react";
import { restaurant, locationLabel } from "@/config/restaurant";
import { useSiteStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { LocationDTO, MenuCategoryDTO, MenuItemDTO } from "@/lib/data-provider";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { VegBadge } from "@/components/shared/veg-badge";
import { PriceTag } from "@/components/shared/price-tag";
import { AddToOrderButton } from "./add-to-order-button";
import { EmptyMenuState } from "./empty-menu-state";
import { ItemSheet } from "./item-sheet";
import { ItemImage } from "./item-image";

/**
 * Menu Centerpiece — instant search, sticky scroll-spy category rail,
 * outlet + pure-veg filters and responsive item cards. Unavailable items
 * stay visible but dimmed with their add button disabled (admin demo flow).
 */

const CARD_GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";
const CARD_IMAGE_SIZES = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

type MenuExperienceProps = {
  categories: MenuCategoryDTO[];
  items: MenuItemDTO[];
  locations: LocationDTO[];
};

/** "chaat-snacks" / "chaat snacks" → "Chaat Snacks" */
function titleCase(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

/** Short display name for an outlet slug, from the verified restaurant config. */
function outletShortName(slug: string): string {
  const loc = restaurant.locations.find((l) => l.slug === slug);
  return loc ? locationLabel(loc) : titleCase(slug);
}

/** Respect prefers-reduced-motion for programmatic scrolling. */
function scrollBehavior(): ScrollBehavior {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "auto";
  }
  return "smooth";
}

/* ── Item card ─────────────────────────────────────────────── */

function MenuCard({
  item,
  categoryName,
  onOpen,
}: {
  item: MenuItemDTO;
  categoryName: string;
  onOpen: (item: MenuItemDTO) => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.name}`}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => {
        // Only open via keyboard when the card itself is focused,
        // so the inner add button keeps working independently.
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item);
        }
      }}
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card text-left",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass",
        !item.isAvailable && "opacity-60"
      )}
    >
      <div className="relative">
        <ItemImage
          src={item.imageUrl}
          alt={item.name}
          sizes={CARD_IMAGE_SIZES}
          unavailable={!item.isAvailable}
          className="group-hover:scale-[1.03] transition-transform duration-200"
        />
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full border border-border bg-ivory/90 px-2 py-0.5 text-[10px] font-medium text-ink-soft backdrop-blur-sm">
          {categoryName}
        </span>
        {!item.isAvailable && (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-full border border-border bg-ivory/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
            Unavailable
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          {item.isVegetarian && <VegBadge size={12} />} {item.name}
        </h3>
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">{item.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <PriceTag priceCents={item.priceCents} className="text-xs" />
          {item.isAvailable ? (
            <span
              onClick={(e) => e.stopPropagation()}
              className="shrink-0"
            >
              <AddToOrderButton
                item={{
                  slug: item.slug,
                  name: item.name,
                  categorySlug: item.categorySlug,
                  imageUrl: item.imageUrl,
                }}
                compact
              />
            </span>
          ) : (
            <button
              type="button"
              disabled
              aria-label={`${item.name} is currently unavailable`}
              className="inline-flex h-8 w-8 shrink-0 cursor-not-allowed items-center justify-center rounded-md border border-border bg-cream text-ink-soft/40"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Category rail chip ────────────────────────────────────── */

function CategoryChip({
  slug,
  label,
  active,
  onClick,
}: {
  slug: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-chip={slug}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass",
        active
          ? "border-brand bg-brand text-parchment shadow-sm"
          : "border-border bg-card text-ink-soft hover:border-brass hover:text-brand"
      )}
    >
      {label}
    </button>
  );
}

/* ── Menu experience ───────────────────────────────────────── */

/** Branded placeholder shown for the brief Suspense window (client transitions). */
function MenuExperienceFallback() {
  return (
    <section aria-label="Menu" className="bg-background pb-16 pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="sr-only">Menu</h1>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">The full menu</p>
        <p className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">Explore the Menu</p>
        <div className="mt-8 max-w-md space-y-3" aria-hidden="true">
          <div className="h-12 w-full animate-pulse rounded-xl bg-cream" />
          <div className="h-9 w-full animate-pulse rounded-full bg-cream" />
        </div>
      </div>
    </section>
  );
}

function MenuExperienceInner({ categories, items, locations }: MenuExperienceProps) {
  // ?category= deep links (homepage craving cards) + ?q= search handoff —
  // both read inside a Suspense boundary.
  const searchParams = useSearchParams();
  const deepLinkCategory = searchParams.get("category");
  const deepLinkQuery = searchParams.get("q");

  const outlet = useSiteStore((s) => s.outlet);
  const setOutlet = useSiteStore((s) => s.setOutlet);

  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const [sheetItem, setSheetItem] = useState<MenuItemDTO | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  // Persisted store values must not influence the first (hydration) render.
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const appliedDeepLinkRef = useRef<string | null>(null);
  const appliedQueryRef = useRef<string | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- canonical hydration guard for persisted store values
  useEffect(() => setMounted(true), []);

  /* Deep-linked query (?q=dosa) — homepage search hands off here. Applied once
     per value so it also works on client-side navigation back to /menu. */
   
  useEffect(() => {
    if (!deepLinkQuery || appliedQueryRef.current === deepLinkQuery) return;
    appliedQueryRef.current = deepLinkQuery;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- param-driven ?q= init, ref-guarded
    setQuery(deepLinkQuery);
  }, [deepLinkQuery]);

  const trimmed = query.trim();
  const isSearching = trimmed.length > 0;
  const outletFilter = mounted && outlet !== null && outlet !== "" ? outlet : null;

  /* Derived data */

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.displayOrder - b.displayOrder),
    [categories]
  );

  const categoryNameBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of sortedCategories) map.set(c.slug, titleCase(c.name));
    return map;
  }, [sortedCategories]);

  const categoryName = useCallback(
    (slug: string) => categoryNameBySlug.get(slug) ?? titleCase(slug),
    [categoryNameBySlug]
  );

  const filteredItems = useMemo(() => {
    const q = trimmed.toLowerCase();
    return items.filter((item) => {
      if (vegOnly && !item.isVegetarian) return false;
      if (outletFilter && item.locationSlugs.length > 0 && !item.locationSlugs.includes(outletFilter)) {
        return false;
      }
      if (q) {
        const haystack = `${item.name} ${item.description ?? ""} ${categoryName(item.categorySlug)}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, vegOnly, outletFilter, trimmed, categoryName]);

  const sections = useMemo(
    () =>
      sortedCategories
        .map((cat) => ({
          ...cat,
          name: titleCase(cat.name),
          items: filteredItems.filter((i) => i.categorySlug === cat.slug),
        }))
        .filter((s) => s.items.length > 0),
    [sortedCategories, filteredItems]
  );

  const activeLocations = useMemo(() => locations.filter((l) => l.active), [locations]);

  /* Analytics — debounced menu_search (only for meaningful queries) */

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const timer = window.setTimeout(() => track("menu_search", { query: q }), 400);
    return () => window.clearTimeout(timer);
  }, [query]);

  /* Scroll-spy — highlight the category whose section is in view */

  useEffect(() => {
    if (isSearching) return;
    const sentinel = document.getElementById("menu-sentinel");
    const sectionEls = [
      ...(sentinel ? [sentinel] : []),
      ...sections.map((s) => document.getElementById(`category-${s.slug}`)),
    ].filter((el): el is HTMLElement => el !== null);
    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((best, e) =>
          e.boundingClientRect.top < best.boundingClientRect.top ? e : best
        );
        const slug = topmost.target.getAttribute("data-category");
        setActiveCategory(slug && slug !== "all" ? slug : null);
      },
      // Band sits just below the sticky navbar + category rail.
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections, isSearching]);

  /* Pending scroll — lets a chip click land after a search clear re-render */

   
  useEffect(() => {
    if (pendingScroll === null) return;
    if (pendingScroll === "all") {
       
      document.getElementById("menu-sections")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- consumes one-shot scroll command
      setActiveCategory(null);
    } else {
      const el = document.getElementById(`category-${pendingScroll}`);
      if (el) {
        el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
        setActiveCategory(pendingScroll);
      }
    }
    setPendingScroll(null);
  }, [pendingScroll, sections, isSearching]);

  /* Deep-linked category (?category=sweets) — scroll to it once on entry. Re-applies
     if the param changes while already on /menu (client-side navigation). */

   
  useEffect(() => {
    if (!deepLinkCategory || appliedDeepLinkRef.current === deepLinkCategory) return;
     
    appliedDeepLinkRef.current = deepLinkCategory;
    if (!sortedCategories.some((c) => c.slug === deepLinkCategory)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- param-driven ?category= init, ref-guarded
    setQuery("");
    setPendingScroll(deepLinkCategory);
  }, [deepLinkCategory, sortedCategories]);

  /* Keep the active chip in view on the horizontally scrollable rail */

  useEffect(() => {
    if (activeCategory === null) return;
    const chip = railRef.current?.querySelector<HTMLElement>(`[data-chip="${activeCategory}"]`);
    chip?.scrollIntoView({ inline: "center", block: "nearest", behavior: scrollBehavior() });
  }, [activeCategory]);

  /* Actions */

  const goToCategory = useCallback(
    (slug: string | null) => {
      if (isSearching) setQuery("");
      setPendingScroll(slug ?? "all");
    },
    [isSearching]
  );

  const selectOutlet = useCallback(
    (slug: string | null) => {
      setOutlet(slug ?? ""); // "" = all outlets (persisted via the site store)
      track("location_selected", { from: "menu", location: slug ?? "all" });
    },
    [setOutlet]
  );

  const clearQuery = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setVegOnly(false);
    setOutlet("");
  }, [setOutlet]);

  const openSheet = useCallback((item: MenuItemDTO) => {
    setSheetItem(item);
    setSheetOpen(true);
  }, []);

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setSheetOpen(open);
  }, []);

  const activeChip = isSearching ? null : activeCategory ?? "all";
  const suggestionChips = useMemo(
    () => sortedCategories.map((c) => ({ slug: c.slug, name: titleCase(c.name) })),
    [sortedCategories]
  );

  return (
    <div>
      {/* ── Page header + search + filters ──────────────────── */}
      <section aria-label="Menu" className="bg-background pb-8 pt-24 sm:pb-10 sm:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="sr-only">Menu</h1>
          <Reveal>
            <SectionHeader
              eyebrow="The full menu"
              title="What are you craving?"
              description="Search across everything we serve — from dosa and thali to sweets and bakery — filter by outlet, and open any dish for details and ordering."
            />
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
              {/* Search */}
              <div role="search" aria-label="Search the menu" className="relative w-full lg:max-w-md">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dosa, thali, sweets…"
                  aria-label="Search the menu"
                  aria-describedby="menu-result-count"
                  autoComplete="off"
                  enterKeyHint="search"
                  className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-11 text-sm text-ink shadow-sm transition-all duration-150 placeholder:text-ink-soft/60 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30 [&::-webkit-search-cancel-button]:hidden"
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={clearQuery}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Outlet + Pure Veg filters */}
              <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 no-scrollbar lg:mx-0 lg:px-0">
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft/70">
                  Outlet
                </span>
                <button
                  type="button"
                  onClick={() => selectOutlet(null)}
                  aria-pressed={outletFilter === null}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass",
                    outletFilter === null
                      ? "border-brand bg-brand text-parchment shadow-sm"
                      : "border-border bg-card text-ink-soft hover:border-brass hover:text-brand"
                  )}
                >
                  All outlets
                </button>
                {activeLocations.map((loc) => (
                  <button
                    key={loc.slug}
                    type="button"
                    onClick={() => selectOutlet(loc.slug)}
                    aria-pressed={outletFilter === loc.slug}
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass",
                      outletFilter === loc.slug
                        ? "border-brand bg-brand text-parchment shadow-sm"
                        : "border-border bg-card text-ink-soft hover:border-brass hover:text-brand"
                    )}
                  >
                    {outletShortName(loc.slug)}
                  </button>
                ))}
                <span className="h-5 w-px shrink-0 bg-border" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setVegOnly((v) => !v)}
                  aria-pressed={vegOnly}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass",
                    vegOnly
                      ? "border-veg bg-veg/10 text-veg"
                      : "border-border bg-card text-ink-soft hover:border-brass"
                  )}
                >
                  <VegBadge size={11} /> Pure Veg
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Sticky category rail (under the fixed navbar) ───── */}
      <div className="sticky top-16 z-30 border-b border-border bg-ivory/95 backdrop-blur sm:top-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            ref={railRef}
            aria-label="Menu categories"
            className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar"
          >
            <CategoryChip slug="all" label="All" active={activeChip === "all"} onClick={() => goToCategory(null)} />
            {sortedCategories.map((cat) => (
              <CategoryChip
                key={cat.slug}
                slug={cat.slug}
                label={titleCase(cat.name)}
                active={activeChip === cat.slug}
                onClick={() => goToCategory(cat.slug)}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* ── Menu body ───────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div id="menu-sections" className="scroll-mt-32 sm:scroll-mt-36">
          {/* Sentinel keeps "All" active while the top of the list is in view */}
          <div id="menu-sentinel" data-category="all" aria-hidden="true" className="h-px" />

          <p
            id="menu-result-count"
            aria-live="polite"
            className="pt-6 text-xs text-ink-soft sm:pt-8"
          >
            {isSearching ? (
              <>
                Showing {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"} for
                &ldquo;{trimmed}&rdquo;
              </>
            ) : (
              <>
                Showing {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"} across{" "}
                {sections.length} {sections.length === 1 ? "category" : "categories"}
              </>
            )}
          </p>

          {isSearching ? (
            filteredItems.length > 0 ? (
              <section aria-label="Search results" className="pt-6">
                <div className="flex items-baseline gap-3 sm:gap-4">
                  <h2 className="font-serif text-2xl font-semibold text-ink">Results</h2>
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                </div>
                <ul className={cn(CARD_GRID, "mt-5")}>
                  {filteredItems.map((item) => (
                    <li key={item.id}>
                      <MenuCard item={item} categoryName={categoryName(item.categorySlug)} onOpen={openSheet} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <div className="pt-8 sm:pt-12">
                <Reveal>
                  <EmptyMenuState
                    query={trimmed}
                    onClearSearch={resetFilters}
                    suggestions={suggestionChips}
                    onSelectSuggestion={goToCategory}
                  />
                </Reveal>
              </div>
            )
          ) : sections.length > 0 ? (
            <div className="space-y-12 pt-6 sm:space-y-16">
              {sections.map((section) => (
                <section
                  key={section.slug}
                  id={`category-${section.slug}`}
                  data-category={section.slug}
                  aria-labelledby={`category-${section.slug}-heading`}
                  className="scroll-mt-32 sm:scroll-mt-36"
                >
                  <Reveal>
                    <div className="flex items-baseline gap-3 sm:gap-4">
                      <h2 className="font-serif text-2xl font-semibold text-ink">{section.name}</h2>
                      <span className="text-xs text-ink-soft/80">
                        {section.items.length} {section.items.length === 1 ? "dish" : "dishes"}
                      </span>
                      <span className="h-px flex-1 bg-border" aria-hidden="true" />
                    </div>
                  </Reveal>
                  <ul className={cn(CARD_GRID, "mt-5")}>
                    {section.items.map((item, i) => (
                      <Reveal as="li" key={item.id} delay={(i % 4) * 0.05}>
                        <MenuCard item={item} categoryName={section.name} onOpen={openSheet} />
                      </Reveal>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="pt-8 sm:pt-12">
              <Reveal>
                <EmptyMenuState
                  query=""
                  onClearSearch={resetFilters}
                  suggestions={suggestionChips}
                  onSelectSuggestion={goToCategory}
                />
              </Reveal>
            </div>
          )}
        </div>
      </div>

      <ItemSheet
        item={sheetItem}
        categoryName={sheetItem ? categoryName(sheetItem.categorySlug) : ""}
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
      />
    </div>
  );
}

/** Public entry point — wraps the experience in a Suspense boundary because it
 *  reads the ?category= query param via useSearchParams. */
export function MenuExperience(props: MenuExperienceProps) {
  return (
    <Suspense fallback={<MenuExperienceFallback />}>
      <MenuExperienceInner {...props} />
    </Suspense>
  );
}
