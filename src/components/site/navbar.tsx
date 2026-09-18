"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

/**
 * Editorial navigation — quiet chrome that disappears over the film hero.
 * Pages with dark opening imagery get transparent/ivory treatment at rest;
 * utility pages start solid. Scrolling always settles to solid ivory.
 */
const DARK_TOP_ROUTES = ["/", "/our-story", "/locations/svm", "/locations/mangla", "/sweets", "/bakery", "/celebrations", "/bulk-orders"];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const darkTop = DARK_TOP_ROUTES.some(
    (r) => pathname === r || (r !== "/" && pathname.startsWith(r)),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close drawer on route change (no event to hook)
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open || !darkTop;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-border bg-ivory/92 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-espresso/45 to-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500",
            solid ? "h-16 sm:h-[4.5rem]" : "h-20 sm:h-24",
          )}
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex items-baseline gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
            aria-label={`${restaurant.displayName} home`}
          >
            <span
              className={cn(
                "font-serif text-[1.45rem] font-medium leading-none tracking-tight transition-colors duration-500 sm:text-[1.65rem]",
                solid ? "text-brand" : "text-parchment",
              )}
            >
              {restaurant.displayName}
            </span>
            <span
              className={cn(
                "hidden pb-0.5 text-[9px] uppercase tracking-[0.3em] transition-colors duration-500 sm:inline",
                solid ? "text-ink-soft/60" : "text-parchment/55",
              )}
            >
              Bilaspur
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {restaurant.nav.slice(0, 5).map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-2 text-[13px] font-medium tracking-wide transition-colors duration-300",
                    solid
                      ? active
                        ? "text-brand"
                        : "text-ink/80 hover:text-brand"
                      : active
                        ? "text-parchment"
                        : "text-parchment/75 hover:text-parchment",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300",
                      active ? "scale-x-100" : "group-hover:scale-x-100",
                      solid ? "bg-brand" : "bg-parchment",
                    )}
                  />
                </Link>
              );
            })}
            <Link
              href="/order"
              onClick={() => track("order_click", { from: "navbar" })}
              className={cn(
                "ml-2 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-semibold tracking-wide transition-all duration-300 active:scale-[0.98]",
                solid
                  ? "border-brand bg-brand text-parchment hover:bg-brand-deep"
                  : "border-parchment/45 text-parchment hover:border-parchment hover:bg-parchment/10",
              )}
            >
              Order Online
              <span aria-hidden="true">→</span>
            </Link>
          </nav>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/order"
              onClick={() => track("order_click", { from: "navbar-mobile" })}
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-300 active:scale-[0.98]",
                solid
                  ? "border-brand bg-brand text-parchment"
                  : "border-parchment/45 text-parchment",
              )}
            >
              Order
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                solid ? "text-ink hover:bg-cream" : "text-parchment hover:bg-parchment/10",
              )}
            >
              {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ivory grain lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col px-6 py-6">
              {[...restaurant.nav, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" }].map(
                (item, i) => (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.035 * i, duration: 0.28 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between border-b border-border py-4 font-serif text-xl font-medium text-ink active:text-brand"
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-brass">→</span>
                    </Link>
                  </motion.div>
                ),
              )}
              <p className="mt-10 text-xs leading-relaxed text-ink-soft/80">{restaurant.demoDisclaimer}</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
