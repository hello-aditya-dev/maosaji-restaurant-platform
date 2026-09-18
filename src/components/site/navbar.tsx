"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
 *
 * MOBILE NAV (P0) — reliability contract:
 *  • hamburger is a 44×44 touch target, aria-expanded + aria-controls, labelled
 *  • drawer opens above hero (z-40, header is z-50 so the X stays clickable)
 *  • body scroll locked while open; restored on close
 *  • closes via: X button, nav link (route change), Escape key, route change
 *  • Escape handled via a window keydown listener mounted only while open
 *  • focus moves to the drawer on open and returns to the hamburger on close
 *  • Tab is trapped inside the drawer while open (focus stays in the menu)
 *  • no pointer-blocking elements left behind after the exit animation —
 *    AnimatePresence unmounts the drawer; the keydown/scroll effects are
 *    guarded by `open` so they clean up when closed
 */
const DARK_TOP_ROUTES = ["/", "/our-story", "/locations/svm", "/locations/mangla", "/sweets", "/bakery", "/celebrations", "/bulk-orders"];

const DRAWER_ID = "mobile-nav-drawer";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerPanelRef = useRef<HTMLDivElement>(null);
  // Focus-return target captured at open time so we always return to the
  // button that launched the menu, even after the DOM shifts.
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const darkTop = DARK_TOP_ROUTES.some(
    (r) => pathname === r || (r !== "/" && pathname.startsWith(r)),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route change always closes the drawer (covers nav link + back/forward).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close drawer on route change (no event to hook)
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes the drawer. Listener is mounted ONLY while open so it
  // never interferes with page-level Escape behaviour elsewhere.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus management: on open, move focus into the drawer (first link).
  // On close (any path — Escape, X, link, route change), return focus to the
  // hamburger button so keyboard users land back where they started. The
  // button is always mounted (outside AnimatePresence) so this is safe even
  // while the exit animation unmounts the dialog.
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => {
        const firstLink = drawerPanelRef.current?.querySelector<HTMLAnchorElement>("a, button");
        firstLink?.focus();
      }, 60); // 60ms: after the 220ms enter animation begins so focus isn't stolen by motion
      return () => window.clearTimeout(t);
    }
    // open === false: return focus to the opener (hamburger) on close.
    // Runs on every close transition. Guarded by openerRef so first mount (false→false) is a no-op.
    if (openerRef.current) {
      const t = window.setTimeout(() => openerRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const toggle = useCallback(() => {
    setOpen((v) => {
      if (!v) openerRef.current = hamburgerRef.current;
      return !v;
    });
  }, []);

  // Close + restore focus when a nav link is activated (covers link-tap close).
  const handleNavClick = useCallback(() => {
    setOpen(false);
    // Defer to allow route-change effect to settle; focus returns to the button.
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }, []);

  // Trap Tab inside the drawer so keyboard users don't tab out into the page
  // behind the (scroll-locked) overlay.
  const onKeyDownInDrawer = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab") return;
      const panel = drawerPanelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [],
  );

  const solid = scrolled || open || !darkTop;

  const mobileNavItems = [
    ...restaurant.nav,
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

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
              const href: string = item.href;
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
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
              ref={hamburgerRef}
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={DRAWER_ID}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass",
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
            id={DRAWER_ID}
            ref={drawerPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            tabIndex={-1}
            onKeyDown={onKeyDownInDrawer}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ivory grain lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col px-6 py-6">
              {mobileNavItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.035 * i, duration: 0.28 }}
                >
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className="flex items-center justify-between border-b border-border py-4 font-serif text-xl font-medium text-ink active:text-brand"
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-brass">→</span>
                  </Link>
                </motion.div>
              ))}
              <p className="mt-10 text-xs leading-relaxed text-ink-soft/80">{restaurant.demoDisclaimer}</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
