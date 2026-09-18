"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CakeSlice,
  CircleDot,
  Inbox,
  Loader2,
  Package,
  RefreshCw,
  Send,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import type { EnquiryDTO } from "@/lib/data-provider/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/admin/stat-card";
import { DemoDataChip, EnquiryTypeChip, StatusChip } from "@/components/admin/status-chip";
import {
  eventLabel,
  formatDateTimeIst,
  formatLongDateIst,
  greetingForHour,
  istHour,
  toastAuto,
} from "@/components/admin/format";

type AnalyticsEvent = { name: string; count: number };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<EnquiryDTO[] | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState<{ text: string; date: string } | null>(null);

  // Greeting is computed after mount so SSR and client markup always agree.
  useEffect(() => {
    const now = new Date();
    setGreeting({ text: greetingForHour(istHour(now)), date: formatLongDateIst(now) });
  }, []);

  const load = useCallback(
    async (viaRefresh: boolean) => {
      if (viaRefresh) setRefreshing(true);
      setLoadError(false);
      try {
        const [enquiriesRes, analyticsRes] = await Promise.all([
          fetch("/api/admin/enquiries", { cache: "no-store" }),
          fetch("/api/admin/analytics", { cache: "no-store" }),
        ]);
        if (enquiriesRes.status === 401 || analyticsRes.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (!enquiriesRes.ok || !analyticsRes.ok) throw new Error("Request failed");
        const enquiriesData = (await enquiriesRes.json()) as { enquiries: EnquiryDTO[] };
        const analyticsData = (await analyticsRes.json()) as { events: AnalyticsEvent[] };
        setEnquiries(enquiriesData.enquiries);
        setEvents(analyticsData.events);
      } catch {
        setLoadError(true);
        toastAuto({
          title: "Could not load the dashboard",
          description: "Please try refreshing.",
          variant: "destructive",
        });
      } finally {
        if (viaRefresh) setRefreshing(false);
      }
    },
    [router]
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  const stats = enquiries
    ? {
        total: enquiries.length,
        bulk: enquiries.filter((e) => e.type === "bulk_order").length,
        cake: enquiries.filter((e) => e.type === "cake").length,
        celebration: enquiries.filter((e) => e.type === "celebration").length,
        fresh: enquiries.filter((e) => e.status === "NEW").length,
      }
    : null;

  const recent = enquiries?.slice(0, 6) ?? [];
  const maxEventCount = events && events.length > 0 ? Math.max(...events.map((e) => e.count)) : 0;

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Greeting */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
            Operations console
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {greeting ? greeting.text : "Welcome back."}
          </h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            {greeting ? greeting.date : "Loading today\u2019s date…"}
            <span className="mx-2 text-brass-soft" aria-hidden="true">
              ·
            </span>
            Asia/Kolkata
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void load(true)}
          disabled={refreshing}
          className="border-border text-ink-soft hover:text-brand"
        >
          {refreshing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Fetch fresh
        </Button>
      </header>

      {/* Stats */}
      <section aria-label="Enquiry statistics" className="mt-7">
        {loadError && enquiries === null ? (
          <Card className="border-border py-0 shadow-none">
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <p className="text-sm font-medium text-ink">The dashboard could not load.</p>
              <Button size="sm" variant="outline" onClick={() => void load(false)}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              <StatCard label="Total enquiries" value={stats.total} icon={Inbox} hint="All types, all time" />
              <StatCard label="Bulk requests" value={stats.bulk} icon={Package} hint="Corporate & gifting" />
              <StatCard label="Cake requests" value={stats.cake} icon={CakeSlice} hint="Custom cake enquiries" />
              <StatCard label="Celebration requests" value={stats.celebration} icon={Sparkles} hint="Events & catering" />
              <StatCard label="NEW status" value={stats.fresh} icon={CircleDot} hint="Awaiting first response" />
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-veg opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-veg" />
              </span>
              Counts update live as forms are submitted on the public site.
            </p>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        )}
      </section>

      {/* Recent + side column */}
      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        {/* Recent enquiries */}
        <Card className="gap-0 border-border py-0 shadow-none lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
            <div>
              <h2 className="font-serif text-lg font-semibold text-ink">Recent enquiries</h2>
              <p className="mt-0.5 text-xs text-ink-soft">Latest six, newest first</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-brand hover:text-brand-deep">
              <Link href="/admin/enquiries">
                View all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <CardContent className="p-0">
            {enquiries === null ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                <Inbox className="h-8 w-8 text-brass-soft" aria-hidden="true" />
                <p className="text-sm font-medium text-ink">No enquiries yet</p>
                <p className="max-w-xs text-xs leading-relaxed text-ink-soft">
                  Submit a form on the public site — bulk orders, celebrations, cakes or contact —
                  and it appears here instantly.
                </p>
              </div>
            ) : (
              <ul className="pretty-scroll max-h-[26rem] divide-y divide-border overflow-y-auto">
                {recent.map((enquiry) => (
                  <li key={enquiry.id}>
                    <Link
                      href={`/admin/enquiries?ref=${encodeURIComponent(enquiry.referenceNumber)}`}
                      className="group flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3 transition-colors hover:bg-ivory"
                    >
                      <span className="font-mono text-xs font-medium text-brand">
                        {enquiry.referenceNumber}
                      </span>
                      <EnquiryTypeChip type={enquiry.type} />
                      <DemoDataChip isDemo={enquiry.isDemoData} />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                        {enquiry.contactName}
                        {enquiry.organization && (
                          <span className="font-normal text-ink-soft"> · {enquiry.organization}</span>
                        )}
                      </span>
                      <span className="text-xs text-ink-soft">
                        {formatDateTimeIst(enquiry.createdAt)}
                      </span>
                      <StatusChip status={enquiry.status} />
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-brass-soft transition-transform group-hover:translate-x-0.5 group-hover:text-brass"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-5">
          {/* Analytics snapshot */}
          <Card className="gap-0 border-border py-0 shadow-none">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <h2 className="font-serif text-lg font-semibold text-ink">Analytics snapshot</h2>
              <p className="mt-0.5 text-xs text-ink-soft">Demo events recorded from the public site</p>
            </div>
            <CardContent className="p-4">
              {events === null ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 rounded-md" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <p className="py-6 text-center text-xs leading-relaxed text-ink-soft">
                  No events recorded yet. Browsing the public site writes demo events that appear
                  here.
                </p>
              ) : (
                <ul className="pretty-scroll max-h-72 space-y-2.5 overflow-y-auto pr-1" aria-label="Demo events">
                  {events.map((event) => (
                    <li key={event.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-xs font-medium text-ink">
                          {eventLabel(event.name)}
                        </span>
                        <span className="font-serif text-sm font-semibold tabular-nums text-brand">
                          {event.count.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-cream">
                        <div
                          className="h-full rounded-full bg-brass/70"
                          style={{ width: `${Math.max(6, Math.round((event.count / maxEventCount) * 100))}%` }}
                          aria-hidden="true"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 border-t border-border pt-3 text-[11px] leading-relaxed text-ink-soft/80">
                Events stay in the local demo database — nothing is sent to any external analytics
                service.
              </p>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="gap-0 border-border py-0 shadow-none">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <h2 className="font-serif text-lg font-semibold text-ink">Quick actions</h2>
              <p className="mt-0.5 text-xs text-ink-soft">For the live walkthrough</p>
            </div>
            <CardContent className="grid gap-3 p-4">
              <Link
                href="/admin/menu"
                className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition-all hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_10px_24px_-14px_rgba(38,33,27,0.3)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                  <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                    View menu manager
                    <ArrowRight
                      className="h-3.5 w-3.5 text-brass transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">
                    Toggle availability and featured items — the public menu follows instantly.
                  </span>
                </span>
              </Link>
              <Link
                href="/bulk-orders"
                className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition-all hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_10px_24px_-14px_rgba(38,33,27,0.3)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                  <Send className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                    Submit a test bulk enquiry
                    <ArrowRight
                      className="h-3.5 w-3.5 text-brass transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">
                    Opens the public bulk-order form — submit it and watch the enquiry land in this
                    console.
                  </span>
                </span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
