"use client";

import { useCallback, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Gallery — premium editorial masonry (CSS columns) + lightbox.
   All imagery is GENERIC PLACEHOLDER PHOTOGRAPHY; alts and the
   in-dialog labels say so and never claim Maosaji premises.
   ───────────────────────────────────────────────────────────── */

const FILTERS = ["All", "Food", "Sweets", "Bakery", "Restaurant", "Celebrations"] as const;
type Filter = (typeof FILTERS)[number];
type Category = Exclude<Filter, "All">;

interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  category: Category;
  /** Tailwind aspect class — varied ratios give the masonry its rhythm. */
  aspect: string;
}

/** Master order is interleaved by category for the "All" editorial view. */
const ITEMS: GalleryItem[] = [
  // 1
  {
    src: "/images/items/pav-bhaji.jpg",
    alt: "Pav bhaji curry with buttered bread rolls on a plate (generic placeholder photography)",
    caption: "Pav bhaji with buttered pav",
    category: "Food",
    aspect: "aspect-[4/5]",
  },
  // 2
  {
    src: "/images/items/kaju-katli.jpg",
    alt: "Diamond-shaped kaju katli sweets arranged on a tray (generic placeholder photography)",
    caption: "Kaju katli",
    category: "Sweets",
    aspect: "aspect-square",
  },
  // 3
  {
    src: "/images/hero-bakery.jpg",
    alt: "Bakery counter with cakes, pastries and baked goods (generic placeholder photography)",
    caption: "The bakery counter",
    category: "Bakery",
    aspect: "aspect-[3/2]",
  },
  // 4
  {
    src: "/images/hero-story.jpg",
    alt: "Warmly lit restaurant dining room with wooden tables (generic placeholder photography)",
    caption: "The dining room",
    category: "Restaurant",
    aspect: "aspect-[3/4]",
  },
  // 5
  {
    src: "/images/hero-celebrations.jpg",
    alt: "Festive table set with sweets and flowers for a celebration (generic placeholder photography)",
    caption: "A celebration spread",
    category: "Celebrations",
    aspect: "aspect-[4/3]",
  },
  // 6
  {
    src: "/images/items/paneer-butter-masala.jpg",
    alt: "Paneer butter masala curry garnished with cream (generic placeholder photography)",
    caption: "Paneer butter masala",
    category: "Food",
    aspect: "aspect-square",
  },
  // 7
  {
    src: "/images/items/motichoor-laddoo.jpg",
    alt: "Round orange motichoor laddoos stacked together (generic placeholder photography)",
    caption: "Motichoor laddoo",
    category: "Sweets",
    aspect: "aspect-[3/4]",
  },
  // 8
  {
    src: "/images/items/birthday-cake.jpg",
    alt: "Decorated birthday cake with candles (generic placeholder photography)",
    caption: "A birthday cake",
    category: "Bakery",
    aspect: "aspect-[4/5]",
  },
  // 9
  {
    src: "/images/gallery/dining.jpg",
    alt: "Laid table with plates and glasses ready for service (generic placeholder photography)",
    caption: "Table set for service",
    category: "Restaurant",
    aspect: "aspect-[4/5]",
  },
  // 10
  {
    src: "/images/gallery/celebration-table.jpg",
    alt: "Dessert table arranged with Indian sweets for an event (generic placeholder photography)",
    caption: "Sweets for a celebration",
    category: "Celebrations",
    aspect: "aspect-square",
  },
  // 11
  {
    src: "/images/items/chole-bhature.jpg",
    alt: "Spiced chickpeas served with fried bhature bread (generic placeholder photography)",
    caption: "Chole bhature",
    category: "Food",
    aspect: "aspect-[3/4]",
  },
  // 12
  {
    src: "/images/items/gulab-jamun.jpg",
    alt: "Gulab jamun soaked in syrup in a bowl (generic placeholder photography)",
    caption: "Gulab jamun",
    category: "Sweets",
    aspect: "aspect-[4/5]",
  },
  // 13
  {
    src: "/images/items/black-forest-pastry.jpg",
    alt: "Slice of black forest pastry on a plate (generic placeholder photography)",
    caption: "Black forest pastry",
    category: "Bakery",
    aspect: "aspect-square",
  },
  // 14
  {
    src: "/images/gallery/sweets-counter.jpg",
    alt: "Glass sweets counter filled with assorted Indian sweets (generic placeholder photography)",
    caption: "The sweets display",
    category: "Restaurant",
    aspect: "aspect-square",
  },
  // 15
  {
    src: "/images/hero-bulk.jpg",
    alt: "Stacked boxes of sweets prepared in bulk (generic placeholder photography)",
    caption: "Boxes ready for bulk orders",
    category: "Celebrations",
    aspect: "aspect-[4/3]",
  },
  // 16
  {
    src: "/images/gallery/food-detail.jpg",
    alt: "Close-up of a curry being finished with fresh coriander (generic placeholder photography)",
    caption: "Fresh from the kitchen",
    category: "Food",
    aspect: "aspect-[4/3]",
  },
  // 17
  {
    src: "/images/hero-sweets.jpg",
    alt: "Assorted Indian sweets display in trays (generic placeholder photography)",
    caption: "Assorted sweets",
    category: "Sweets",
    aspect: "aspect-[4/3]",
  },
  // 18
  {
    src: "/images/gallery/kitchen.jpg",
    alt: "Chefs working at a stainless steel kitchen station (generic placeholder photography)",
    caption: "The kitchen at work",
    category: "Restaurant",
    aspect: "aspect-[3/4]",
  },
  // 19
  {
    src: "/images/items/masala-dosa.jpg",
    alt: "Crisp masala dosa served with chutney and sambar (generic placeholder photography)",
    caption: "Masala dosa with chutneys",
    category: "Food",
    aspect: "aspect-[4/5]",
  },
  // 20
  {
    src: "/images/locations/svm.jpg",
    alt: "Restaurant storefront on a city street in the evening (generic placeholder photography)",
    caption: "Street-side storefront",
    category: "Restaurant",
    aspect: "aspect-[3/4]",
  },
];

export function GalleryGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  /** Index within the currently filtered list, or null when closed. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === "All" ? ITEMS : ITEMS.filter((i) => i.category === filter)),
    [filter]
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of ITEMS) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, []);

  const open = openIndex !== null && openIndex < visible.length;
  const current = open ? visible[openIndex] : null;

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((i) => {
        if (i === null || visible.length === 0) return i;
        return (i + dir + visible.length) % visible.length;
      });
    },
    [visible.length]
  );

  /** Esc is handled natively by Radix; arrows navigate the set. */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const selectFilter = (f: Filter) => {
    setFilter(f);
    setOpenIndex(null);
  };

  return (
    <div>
      {/* Filter chips */}
      <div role="group" aria-label="Filter gallery by category" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f;
          const count = f === "All" ? ITEMS.length : (counts.get(f) ?? 0);
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(f)}
              className={cn(
                "inline-flex h-11 items-center gap-1.5 rounded-full border px-5 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "border-brand bg-brand text-parchment"
                  : "border-border bg-card text-ink-soft hover:-translate-y-0.5 hover:border-brass/60 hover:text-brand"
              )}
            >
              {f}
              <span
                className={cn(
                  "text-xs tabular-nums",
                  active ? "text-parchment/70" : "text-ink-soft/60"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Masonry — CSS columns; key remount gives the fade on filter change */}
      <ul
        key={filter}
        aria-label={`${filter === "All" ? "All photos" : `${filter} photos`}`}
        className="mt-8 animate-in fade-in-0 duration-300 columns-2 gap-4 sm:columns-3 lg:columns-4"
      >
        {visible.map((item, i) => (
          <li key={item.src} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View larger — ${item.caption} (${item.category})`}
              className={cn(
                "group relative block w-full overflow-hidden rounded-xl border border-border bg-card text-left",
                "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(38,33,27,0.25)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <span className={cn("relative block w-full", item.aspect)}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </span>
              {/* Hover / focus caption */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="text-xs font-medium text-parchment">{item.caption}</span>
                <span className="shrink-0 rounded-full border border-parchment/25 bg-ink/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cream backdrop-blur-sm">
                  {item.category}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) setOpenIndex(null);
        }}
      >
        <DialogContent
          onKeyDown={handleKeyDown}
          className="gap-0 overflow-hidden rounded-xl border-[#3a322a] bg-ink p-0 text-cream sm:max-w-3xl"
        >
          {/* Image stage — fixed ratio, object-contain, letterboxed on the dark panel */}
          <div className="relative aspect-[4/3] w-full bg-espresso sm:aspect-[16/10]">
            {current && (
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="animate-in fade-in-0 duration-200 object-contain"
              />
            )}
            {visible.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-parchment/20 bg-ink/50 text-parchment backdrop-blur-sm transition-all duration-200 hover:bg-ink/75 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-soft focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-parchment/20 bg-ink/50 text-parchment backdrop-blur-sm transition-all duration-200 hover:bg-ink/75 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-soft focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          {/* Caption bar */}
          <div className="flex flex-col gap-4 border-t border-[#3a322a] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass-soft">
                {current?.category}
              </p>
              <DialogTitle className="mt-1 text-left text-base font-medium leading-snug text-cream">
                {current?.caption}
              </DialogTitle>
              <DialogDescription className="mt-1 text-left text-xs text-[#b8ac99]">
                {openIndex !== null && current
                  ? `${openIndex + 1} of ${visible.length} · generic placeholder photography`
                  : null}
              </DialogDescription>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                className="inline-flex h-11 items-center gap-1 rounded-md border border-[#3a322a] px-4 text-sm font-medium text-cream transition-colors duration-200 hover:bg-[#322b22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="inline-flex h-11 items-center gap-1 rounded-md border border-transparent bg-brand px-4 text-sm font-semibold text-parchment transition-all duration-200 hover:bg-brand-deep active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Screen-reader announcement when navigating */}
          <p aria-live="polite" className="sr-only">
            {current ? `${current.caption}, ${current.category}` : ""}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
