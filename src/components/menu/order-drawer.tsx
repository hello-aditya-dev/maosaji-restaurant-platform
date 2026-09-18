"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, Copy, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSiteStore } from "@/lib/store";
import { restaurant, locationLabel } from "@/config/restaurant";
import { track } from "@/lib/analytics";
import { VegBadge } from "@/components/shared/veg-badge";

function outletOrdering(slug: string | null) {
  const loc = restaurant.locations.find((l) => l.slug === slug) ?? restaurant.locations[0];
  return { loc, ordering: loc.ordering };
}

export function OrderDrawer() {
  const { orderList, outlet, setOutlet, setQty, removeItem, clearOrder } = useSiteStore();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const count = orderList.reduce((sum, l) => sum + l.qty, 0);
  const { loc, ordering } = outletOrdering(outlet);

  if (count === 0) return null;

  const whatsappText = [
    `Hello ${restaurant.displayName},`,
    "",
    "I'd like to enquire about:",
    "",
    ...orderList.map((l) => `${l.qty} × ${l.name}`),
    "",
    `Preferred outlet: ${locationLabel(loc)}`,
  ].join("\n");

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappText);
      setCopied(true);
      track("whatsapp_click", { action: "copy" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-[64px] z-40 px-4 md:bottom-6" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-brand-deep bg-brand px-5 py-3.5 text-parchment shadow-lg shadow-brand/25 transition-all duration-150 hover:bg-brand-deep active:scale-[0.98]"
          >
            <span className="flex items-center gap-2.5 text-sm font-medium">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {count} {count === 1 ? "item" : "items"} selected
            </span>
            <span className="text-sm font-medium underline underline-offset-2">View order</span>
          </button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="mx-auto max-h-[85vh] w-full max-w-lg rounded-t-2xl bg-ivory p-0"
        >
          <div className="pretty-scroll max-h-[80vh] overflow-y-auto px-6 pb-8 pt-6">
            <SheetHeader className="px-0">
              <SheetTitle className="font-serif text-2xl text-ink">Your order list</SheetTitle>
              <SheetDescription className="text-sm text-ink-soft">
                Select how you&apos;d like to continue — items are handed to your chosen ordering partner or enquiry message.
              </SheetDescription>
            </SheetHeader>

            {/* Outlet selector */}
            <fieldset className="mt-5">
              <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Ordering for
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {restaurant.locations.map((l) => (
                  <button
                    key={l.slug}
                    type="button"
                    onClick={() => {
                      setOutlet(l.slug);
                      track("location_selected", { from: "order-drawer", location: l.slug });
                    }}
                    aria-pressed={outlet === l.slug || (!outlet && l === restaurant.locations[0])}
                    className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-150 active:scale-[0.98] ${
                      outlet === l.slug || (!outlet && l === restaurant.locations[0])
                        ? "border-brand bg-brand/10 font-medium text-brand"
                        : "border-border bg-white text-ink-soft hover:border-brass"
                    }`}
                  >
                    {locationLabel(l)}
                    <span className="block text-[11px] font-normal text-ink-soft">{l.name}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Items */}
            <ul className="mt-5 divide-y divide-border">
              {orderList.map((line) => (
                <li key={line.itemSlug} className="flex items-center gap-3 py-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-cream">
                    {line.imageUrl && (
                      <Image
                        src={line.imageUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-ink">
                      <VegBadge size={11} /> {line.name}
                    </p>
                    <p className="text-xs text-ink-soft">Price available on ordering partner</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Decrease ${line.name}`}
                      onClick={() => setQty(line.itemSlug, line.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-soft transition-colors hover:bg-cream"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium" aria-live="polite">{line.qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${line.name}`}
                      onClick={() => setQty(line.itemSlug, line.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-soft transition-colors hover:bg-cream"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${line.name}`}
                      onClick={() => removeItem(line.itemSlug)}
                      className="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream hover:text-[#b3261e]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={clearOrder}
              className="mt-2 text-xs text-ink-soft underline underline-offset-2 transition-colors hover:text-[#b3261e]"
            >
              Clear list
            </button>

            {/* Continue */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Continue with</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ordering.zomato && (
                  <a
                    href={ordering.zomato}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("zomato_click", { from: "order-drawer", location: loc.slug })}
                    className="flex items-center justify-center rounded-lg border border-[#e23744]/30 bg-white px-4 py-3 text-sm font-medium text-[#c0392b] transition-all duration-150 hover:border-[#e23744]/60 hover:shadow-sm active:scale-[0.98]"
                  >
                    Continue with Zomato ↗
                  </a>
                )}
                {ordering.swiggy && (
                  <a
                    href={ordering.swiggy}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("swiggy_click", { from: "order-drawer", location: loc.slug })}
                    className="flex items-center justify-center rounded-lg border border-[#fc8019]/40 bg-white px-4 py-3 text-sm font-medium text-[#b96414] transition-all duration-150 hover:border-[#fc8019]/70 hover:shadow-sm active:scale-[0.98]"
                  >
                    Continue with Swiggy ↗
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={copyMessage}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#25d366]/40 bg-white px-4 py-3 text-sm font-medium text-[#128c4b] transition-all duration-150 hover:border-[#25d366]/70 hover:shadow-sm active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" /> Message copied to clipboard
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" /> Prepare WhatsApp enquiry (copy text)
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-soft/80">
                Private demo: the message is copied for you to send yourself — nothing is sent to {restaurant.displayName} from this website.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
