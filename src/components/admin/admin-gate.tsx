"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgePercent,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPin,
  Settings,
  UtensilsCrossed,
} from "lucide-react";
import { restaurant } from "@/config/restaurant";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * AdminGate — client auth wrapper for the whole /admin subtree.
 * ────────────────────────────────────────────────────────────
 * The server layout passes `initialAuthenticated` (from the session cookie) so
 * an authenticated first paint never flashes a skeleton. The gate re-validates
 * against /api/admin/session whenever the route changes (covers login →
 * dashboard transitions and browser-back after logout) and redirects
 * unauthenticated visitors to /admin/login. The login route renders bare.
 */

type SessionState = "checking" | "authenticated" | "unauthenticated";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
  { label: "Menu Manager", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Locations", href: "/admin/locations", icon: MapPin },
  { label: "Offers", href: "/admin/offers", icon: BadgePercent },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DemoModeBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand"
      title="This console runs on demo data — nothing here affects the real restaurant."
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
      </span>
      Demo mode
    </span>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-md bg-brand font-serif text-base font-semibold text-parchment"
        aria-hidden="true"
      >
        {restaurant.displayName.charAt(0)}
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={cn("font-serif font-semibold text-ink", compact ? "text-base" : "text-lg")}>
          {restaurant.displayName}
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-brass">
          Operations
        </span>
      </span>
    </span>
  );
}

function NavLinks({ pathname, onNavigate, layout }: { pathname: string; onNavigate?: () => void; layout: "sidebar" | "topbar" }) {
  return (
    <>
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 text-sm transition-colors",
              layout === "sidebar"
                ? cn(
                    "rounded-md border border-transparent px-3 py-2 font-medium",
                    active
                      ? "border-brand/20 bg-brand/[0.07] text-brand"
                      : "text-ink-soft hover:bg-cream hover:text-ink"
                  )
                : cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 font-medium",
                    active
                      ? "border-brand/25 bg-brand/[0.07] text-brand"
                      : "border-border bg-card text-ink-soft hover:text-ink"
                  )
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function AdminShell({ children, mode }: { children: ReactNode; mode: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // proceed to login regardless — the cookie is cleared server-side
    }
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-parchment"
      >
        Skip to content
      </a>

      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/admin" className="min-w-0" aria-label="Admin home">
            <BrandMark compact />
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-ink-soft/70 md:inline">
              {mode === "SUPABASE" ? "Supabase mode" : "Demo backend · SQLite"}
            </span>
            <DemoModeBadge />
            <Button variant="ghost" size="sm" className="hidden text-ink-soft hover:text-ink sm:inline-flex" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                View site
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void logout()}
              disabled={loggingOut}
              className="border-border text-ink-soft hover:text-brand"
            >
              {loggingOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{loggingOut ? "Signing out…" : "Sign out"}</span>
              <span className="sr-only sm:hidden">Sign out</span>
            </Button>
          </div>
        </div>
        {/* Mobile nav — the sidebar collapses to this scrollable top nav */}
        <nav
          aria-label="Admin sections"
          className="no-scrollbar flex items-center gap-2 overflow-x-auto border-t border-border px-4 py-2.5 lg:hidden"
        >
          <NavLinks pathname={pathname} layout="topbar" />
        </nav>
      </header>

      <div className="flex flex-1 items-stretch">
        {/* Sidebar (desktop) */}
        <aside className="pretty-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border bg-card lg:block">
          <nav aria-label="Admin sections" className="flex flex-col gap-1 p-3">
            <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
              Console
            </p>
            <NavLinks pathname={pathname} layout="sidebar" />
          </nav>
          <div className="mx-3 mb-4 mt-2 rounded-lg border border-dashed border-border bg-ivory p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brass">
              Private demo
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-soft">
              {restaurant.demoDisclaimer}
            </p>
          </div>
        </aside>

        <main id="admin-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function GateSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background" aria-busy="true" aria-live="polite">
      <div className="h-14 border-b border-border bg-card" />
      <div className="flex flex-1">
        <div className="hidden w-60 border-r border-border bg-card lg:block" />
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-44" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function AdminGate({
  children,
  initialAuthenticated,
}: {
  children: ReactNode;
  initialAuthenticated: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === "/admin/login";
  const [state, setState] = useState<SessionState>(initialAuthenticated ? "authenticated" : "checking");
  const [mode, setMode] = useState<string>("DEMO_MODE");

  // Leaving the login route must invalidate whatever we concluded about the
  // session earlier. Without this, the sequence "visit /admin unauthenticated
  // → redirected to login → sign in → router.push('/admin')" races: the
  // redirect effect below still sees the stale "unauthenticated" from before
  // the login and bounces the fresh session straight back to the login page
  // (the new /api/admin/session request resolves a beat too late). Resetting
  // during render — before any effect runs — guarantees the redirect effect
  // only ever acts on a verdict obtained for the current visit.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    const leftLoginRoute = prevPathname === "/admin/login";
    setPrevPathname(pathname);
    if (leftLoginRoute && state !== "checking") {
      setState("checking");
    }
  }

  // Re-validate the session whenever the admin route changes. This covers
  // client-side navigations after login/logout that the server-rendered
  // initial value cannot know about.
  useEffect(() => {
    if (isLoginRoute) return;
    let cancelled = false;
    const validate = async () => {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const data = (await res.json()) as { authenticated: boolean; mode: string };
          if (typeof data.mode === "string") setMode(data.mode);
          setState(data.authenticated ? "authenticated" : "unauthenticated");
        } else {
          setState("unauthenticated");
        }
      } catch {
        if (!cancelled) setState("unauthenticated");
      }
    };
    void validate();
    return () => {
      cancelled = true;
    };
  }, [isLoginRoute, pathname]);

  // Unauthenticated visitors (on anything other than the login route) are
  // redirected — the skeleton renders while the redirect is in flight.
  useEffect(() => {
    if (!isLoginRoute && state === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [state, isLoginRoute, router]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (state !== "authenticated") {
    return <GateSkeleton />;
  }

  return <AdminShell mode={mode}>{children}</AdminShell>;
}
