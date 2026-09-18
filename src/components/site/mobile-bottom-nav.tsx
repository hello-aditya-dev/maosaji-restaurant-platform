"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, MapPin, ShoppingBag } from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { cn } from "@/lib/utils";
import { useSiteStore } from "@/lib/store";

const icons = {
  Menu: BookOpenText,
  Order: ShoppingBag,
  Locations: MapPin,
} as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const orderList = useSiteStore((s) => s.orderList);
  const count = orderList.reduce((sum, l) => sum + l.qty, 0);

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivory/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3">
        {restaurant.mobileBottomNav.map((item) => {
          const Icon = icons[item.label as keyof typeof icons];
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                active ? "text-brand" : "text-ink-soft"
              )}
            >
              <span className="relative">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label === "Order" && count > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-semibold text-parchment">
                    {count}
                  </span>
                )}
              </span>
              {item.label}
              {active && <span aria-hidden="true" className="absolute top-0 h-0.5 w-8 rounded-full bg-brand" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
