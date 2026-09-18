"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, MapPin, Minus, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { restaurant } from "@/config/restaurant";
import { useSiteStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { MenuItemDTO } from "@/lib/data-provider";
import { VegBadge } from "@/components/shared/veg-badge";
import { PriceTag } from "@/components/shared/price-tag";

/**
 * Menu item detail sheet — slides up from the bottom on mobile and opens as a
 * right-side panel on desktop (CSS override of the bottom placement at `sm:`).
 */
export type ItemSheetProps = {
  item: MenuItemDTO | null;
  categoryName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Short display name for an outlet slug ("svm" → "SVM"), config-driven. */
function outletShortName(slug: string): string {
  const loc = restaurant.locations.find((l) => l.slug === slug);
  if (loc) return loc.shortName ?? loc.name;
  return slug.replace(/-/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

export function ItemSheet({ item, categoryName, open, onOpenChange }: ItemSheetProps) {
  const outlet = useSiteStore((s) => s.outlet);
  const addItem = useSiteStore((s) => s.addItem);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<number | null>(null);

  // Reset the stepper and record a view each time the sheet opens.
   
  useEffect(() => {
    if (!open || !item) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset-on-open is param-driven UI state
    setQty(1);
    setAdded(false);
    track("menu_item_view", { item: item.slug });
  }, [open, item]);

  useEffect(() => {
    return () => {
      if (addedTimer.current !== null) window.clearTimeout(addedTimer.current);
    };
  }, []);

  if (!item) return null;

  // Ordering links come from the selected outlet (restaurant config).
  // "All outlets" / no selection falls back to the first outlet, like the order drawer.
  const selectedOutlet =
    restaurant.locations.find((l) => l.slug === outlet) ?? restaurant.locations[0];

  const availabilityLabel =
    item.locationSlugs.length === 0
      ? "Available at all outlets"
      : `Available at ${item.locationSlugs.map(outletShortName).join(" · ")}`;

  const onAdd = () => {
    addItem(
      { itemSlug: item.slug, name: item.name, categorySlug: item.categorySlug, imageUrl: item.imageUrl },
      qty
    );
    track("order_click", { action: "add-item", item: item.slug, from: "item-sheet", qty });
    setAdded(true);
    if (addedTimer.current !== null) window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => {
      setAdded(false);
      setQty(1);
    }, 1600);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "mx-auto flex h-auto max-h-[88vh] w-full max-w-lg flex-col gap-0 overflow-hidden rounded-t-2xl border-border bg-ivory p-0",
          // Desktop: convert the bottom sheet into a right-side panel via CSS.
          "sm:inset-y-0 sm:left-auto sm:right-0 sm:mx-0 sm:h-full sm:max-h-none sm:w-[28rem] sm:rounded-t-none sm:border-t-0 sm:border-l",
          // Neutralise the bottom slide and animate from the right on desktop.
          "sm:data-[state=closed]:slide-out-to-bottom-0! sm:data-[state=open]:slide-in-from-bottom-0!",
          "sm:data-[state=closed]:slide-out-to-right sm:data-[state=open]:slide-in-from-right"
        )}
      >
        <div className="pretty-scroll max-h-[86vh] overflow-y-auto pb-8 sm:h-full sm:max-h-none">
          {/* Image */}
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-cream">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 448px"
                className={cn("object-cover", !item.isAvailable && "grayscale")}
              />
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent"
            />
            {!item.isAvailable && (
              <span className="absolute right-3 top-3 rounded-full border border-border bg-ivory/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
                Unavailable
              </span>
            )}
          </div>

          <div className="px-5 sm:px-6">
            {/* Heading */}
            <div className="pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
                {categoryName}
              </p>
              <SheetTitle className="mt-2 flex items-center gap-2 font-serif text-2xl font-semibold text-ink">
                {item.isVegetarian && <VegBadge size={14} />}
                {item.name}
              </SheetTitle>
              {item.description ? (
                <SheetDescription className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </SheetDescription>
              ) : (
                <SheetDescription className="sr-only">Details for {item.name}.</SheetDescription>
              )}
            </div>

            {/* Price + outlet availability */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-y border-border py-3.5">
              <PriceTag priceCents={item.priceCents} />
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                <MapPin className="h-3.5 w-3.5 text-brass" aria-hidden="true" />
                {availabilityLabel}
              </span>
            </div>

            {/* Quantity + add to order list */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Add to order list
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <div
                  role="group"
                  aria-label="Quantity"
                  className="flex items-center gap-1 rounded-lg border border-border bg-white p-1"
                >
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={!item.isAvailable || qty <= 1}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-ink" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={!item.isAvailable}
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onAdd}
                  disabled={!item.isAvailable}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep disabled:pointer-events-none disabled:opacity-45",
                    added ? "bg-veg text-white" : "bg-brand text-parchment hover:bg-brand-deep"
                  )}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" /> Added to your list
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" aria-hidden="true" /> Add to order list
                    </>
                  )}
                </button>
              </div>
              {!item.isAvailable && (
                <p className="mt-2.5 text-xs leading-relaxed text-ink-soft">
                  This item is currently marked unavailable — it can&apos;t be added to the order list right now.
                </p>
              )}
            </div>

            {/* Order this item */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Order this item — {selectedOutlet.shortName ?? selectedOutlet.name}
              </p>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {selectedOutlet.ordering.zomato && (
                  <a
                    href={selectedOutlet.ordering.zomato}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("zomato_click", { from: "item-sheet", location: selectedOutlet.slug })}
                    className="flex items-center justify-center rounded-lg border border-[#e23744]/30 bg-white px-4 py-3 text-sm font-medium text-[#c0392b] transition-all duration-150 hover:border-[#e23744]/60 hover:shadow-sm active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c0392b]"
                  >
                    Continue with Zomato ↗
                  </a>
                )}
                {selectedOutlet.ordering.swiggy && (
                  <a
                    href={selectedOutlet.ordering.swiggy}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("swiggy_click", { from: "item-sheet", location: selectedOutlet.slug })}
                    className="flex items-center justify-center rounded-lg border border-[#fc8019]/40 bg-white px-4 py-3 text-sm font-medium text-[#b96414] transition-all duration-150 hover:border-[#fc8019]/70 hover:shadow-sm active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b96414]"
                  >
                    Continue with Swiggy ↗
                  </a>
                )}
              </div>
              <p className="mt-2.5 text-[11px] leading-relaxed text-ink-soft/80">
                Links open {selectedOutlet.name} on your ordering partner, where the current price is shown. You
                can switch outlets from the order list.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
