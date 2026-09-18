"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Inbox, Search, Send, X } from "lucide-react";
import {
  ENQUIRY_STATUSES,
  type EnquiryDTO,
  type EnquiryStatus,
} from "@/lib/data-provider/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EnquiryDetail, type LocationOption } from "@/components/admin/enquiry-detail";
import { DemoDataChip, EnquiryTypeChip, StatusChip } from "@/components/admin/status-chip";
import { formatDateTimeIst, toastAuto } from "@/components/admin/format";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | EnquiryDTO["type"];
type StatusFilter = "all" | EnquiryStatus;

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "bulk_order", label: "Bulk" },
  { value: "celebration", label: "Celebration" },
  { value: "cake", label: "Cake" },
  { value: "contact", label: "Contact" },
];

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<EnquiryDTO[] | null>(null);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [patchingId, setPatchingId] = useState<string | null>(null);
  const [focusRef, setFocusRef] = useState<string | null>(null);

  // Dashboard "View" links arrive as /admin/enquiries?ref=CE-2026-0002 —
  // read the param without useSearchParams so no Suspense boundary is needed.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setFocusRef(ref);
  }, []);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const [enquiriesRes, locationsRes] = await Promise.all([
        fetch("/api/admin/enquiries", { cache: "no-store" }),
        fetch("/api/locations", { cache: "no-store" }),
      ]);
      if (enquiriesRes.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!enquiriesRes.ok) throw new Error("Request failed");
      const enquiriesData = (await enquiriesRes.json()) as { enquiries: EnquiryDTO[] };
      setEnquiries(enquiriesData.enquiries);
      if (locationsRes.ok) {
        const locationsData = (await locationsRes.json()) as {
          locations: { slug: string; name: string; shortName?: string }[];
        };
        setLocations(
          locationsData.locations.map((l) => ({ slug: l.slug, name: l.name, shortName: l.shortName }))
        );
      }
    } catch {
      setLoadError(true);
      toastAuto({
        title: "Could not load enquiries",
        description: "Please try refreshing.",
        variant: "destructive",
      });
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  // Once loaded, expand (and reveal) the enquiry referenced by ?ref=.
  useEffect(() => {
    if (focusRef && enquiries) {
      const match = enquiries.find((e) => e.referenceNumber === focusRef);
      if (match) {
        setTypeFilter("all");
        setStatusFilter("all");
        setSearch("");
        setExpandedId(match.id);
      }
      setFocusRef(null);
    }
  }, [focusRef, enquiries]);

  const counts = useMemo(() => {
    const base: Record<TypeFilter, number> = {
      all: enquiries?.length ?? 0,
      bulk_order: enquiries?.filter((e) => e.type === "bulk_order").length ?? 0,
      celebration: enquiries?.filter((e) => e.type === "celebration").length ?? 0,
      cake: enquiries?.filter((e) => e.type === "cake").length ?? 0,
      contact: enquiries?.filter((e) => e.type === "contact").length ?? 0,
    };
    return base;
  }, [enquiries]);

  const filtered = useMemo(() => {
    if (!enquiries) return [];
    const query = search.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      if (typeFilter !== "all" && enquiry.type !== typeFilter) return false;
      if (statusFilter !== "all" && enquiry.status !== statusFilter) return false;
      if (query) {
        const haystack =
          `${enquiry.contactName} ${enquiry.referenceNumber} ${enquiry.organization ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [enquiries, typeFilter, statusFilter, search]);

  const clearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setSearch("");
  };

  /** Optimistic status change → PATCH → reconcile (or revert) with a toast. */
  const changeStatus = async (enquiry: EnquiryDTO, status: EnquiryStatus) => {
    if (status === enquiry.status) return;
    const snapshot = enquiries;
    setEnquiries(
      (list) => list?.map((e) => (e.id === enquiry.id ? { ...e, status } : e)) ?? list
    );
    setPatchingId(enquiry.id);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = res.ok ? ((await res.json()) as { ok: boolean; enquiry: EnquiryDTO }) : null;
      if (!res.ok || !data?.ok) throw new Error("Request failed");
      const updated = data.enquiry;
      setEnquiries((list) => list?.map((e) => (e.id === updated.id ? updated : e)) ?? list);
      toastAuto({
        title: `Status updated to ${updated.status}`,
        description: `${updated.referenceNumber} · ${updated.contactName}`,
      });
    } catch {
      setEnquiries(snapshot);
      toastAuto({
        title: "Could not update status",
        description: `${enquiry.referenceNumber} was not changed. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setPatchingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
          Operations console
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Enquiries
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Every form submitted on the public site — bulk orders, celebrations, cakes and contact —
          lands here. Open a row to see everything the customer sent and move it through your
          pipeline.
        </p>
      </header>

      {/* Controls */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, reference or organisation"
              className="h-9 border-border bg-card pl-9 text-sm"
              aria-label="Search enquiries"
            />
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger size="sm" className="h-9 w-[168px] border-border bg-card text-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ENQUIRY_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
          {TYPE_FILTERS.map((filter) => {
            const active = typeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setTypeFilter(filter.value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-brand/25 bg-brand/[0.07] text-brand"
                    : "border-border bg-card text-ink-soft hover:text-ink"
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums",
                    active ? "bg-brand/15 text-brand" : "bg-cream text-ink-soft"
                  )}
                >
                  {counts[filter.value]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <Card className="mt-4 gap-0 overflow-hidden border-border py-0 shadow-none">
        <CardContent className="p-0">
          {loadError && enquiries === null ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <p className="text-sm font-medium text-ink">Enquiries could not load.</p>
              <Button size="sm" variant="outline" onClick={() => void load()}>
                Try again
              </Button>
            </div>
          ) : enquiries === null ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-cream">
                <Inbox className="h-5 w-5 text-brass" aria-hidden="true" />
              </span>
              {enquiries.length === 0 ? (
                <>
                  <p className="text-sm font-semibold text-ink">No enquiries yet</p>
                  <p className="max-w-sm text-xs leading-relaxed text-ink-soft">
                    The list is fed directly by the public site. Submit a bulk order, celebration,
                    cake or contact form and it appears here instantly — with a reference number.
                  </p>
                  <Button size="sm" variant="outline" asChild className="mt-1 border-border text-brand">
                    <Link href="/bulk-orders">
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      Submit a test enquiry
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-ink">
                    No enquiries match your filters
                  </p>
                  <p className="max-w-sm text-xs leading-relaxed text-ink-soft">
                    Try a different type, status or search term.
                  </p>
                  <Button size="sm" variant="outline" onClick={clearFilters} className="mt-1 border-border">
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    Clear filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <ul className="pretty-scroll max-h-[calc(100vh-19rem)] min-h-[18rem] divide-y divide-border overflow-y-auto">
              {filtered.map((enquiry) => {
                const expanded = expandedId === enquiry.id;
                return (
                  <li key={enquiry.id} id={`enquiry-${enquiry.id}`}>
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : enquiry.id)}
                      aria-expanded={expanded}
                      aria-controls={`enquiry-detail-${enquiry.id}`}
                      className="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3.5 text-left transition-colors hover:bg-ivory sm:px-5"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-brass transition-transform",
                          expanded && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-xs font-semibold text-brand">
                        {enquiry.referenceNumber}
                      </span>
                      <EnquiryTypeChip type={enquiry.type} />
                      <DemoDataChip isDemo={enquiry.isDemoData} />
                      <span className="min-w-0 flex-1 basis-40">
                        <span className="block truncate text-sm font-medium text-ink">
                          {enquiry.contactName}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-soft">
                          {enquiry.phone}
                          {enquiry.organization ? ` · ${enquiry.organization}` : ""}
                        </span>
                      </span>
                      <span className="hidden text-xs text-ink-soft md:inline">
                        {formatDateTimeIst(enquiry.createdAt)}
                      </span>
                      <StatusChip status={enquiry.status} />
                    </button>
                    {expanded && (
                      <div id={`enquiry-detail-${enquiry.id}`}>
                        <EnquiryDetail
                          enquiry={enquiry}
                          locationOptions={locations}
                          statusPending={patchingId === enquiry.id}
                          onStatusChange={(status) => void changeStatus(enquiry, status)}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
        Showing {filtered.length} of {enquiries?.length ?? 0} enquiries
        <span className="text-brass-soft" aria-hidden="true">
          ·
        </span>
        Seeded records are tagged <DemoDataChip isDemo /> — genuine form submissions are tagged{" "}
        <DemoDataChip isDemo={false} />
      </p>
    </div>
  );
}
