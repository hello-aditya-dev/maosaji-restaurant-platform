"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Lock, MapPin, Pencil, Phone, Plus } from "lucide-react";
import type { LocationDTO } from "@/lib/data-provider/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toastAuto } from "@/components/admin/format";
import { cn } from "@/lib/utils";

/**
 * LOCATIONS MANAGER — production-shaped records (name, address, phone,
 * ordering links, active) rendered from live data. Editing is wired for
 * production (Supabase mode); in DEMO_MODE the fields open read-only so the
 * verified seed records stay protected during the sales demo.
 */

const GUARDED_NOTE =
  "Location editing is wired for production (Supabase mode); demo mode keeps records read-only to protect seed integrity.";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-3">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft/80 sm:pt-0.5">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

/** Disabled, production-shaped field used inside the guarded dialogs. */
function GuardedField({
  id,
  label,
  value,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  type?: "text" | "url";
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-xs font-medium text-ink-soft">
        {label}
      </Label>
      <Input id={id} type={type} value={value} disabled className="border-border bg-ivory text-sm" />
    </div>
  );
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationDTO[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [editLocation, setEditLocation] = useState<LocationDTO | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/locations", { cache: "no-store" });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { locations: LocationDTO[] };
      setLocations(data.locations);
    } catch {
      setLoadError(true);
      toastAuto({
        title: "Could not load locations",
        description: "Please try refreshing.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
            Operations console
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Locations
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Outlet records powering the public Locations pages — addresses, reference phones and
            verified ordering links.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          variant="outline"
          className="border-border text-ink-soft hover:text-brand"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add location
        </Button>
      </header>

      {/* Cards */}
      {locations === null ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : loadError ? (
        <Card className="mt-6 gap-0 border-border py-0 shadow-none">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-sm font-medium text-ink">Locations could not load.</p>
            <Button size="sm" variant="outline" onClick={() => void load()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {locations.map((location) => (
            <Card key={location.id} className="gap-0 border-border py-0 shadow-none">
              <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-cream text-brand">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-serif text-lg font-semibold leading-snug text-ink">
                      {location.name}
                    </h2>
                    <p className="font-mono text-[11px] text-ink-soft/70">/{location.slug}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                    location.active
                      ? "border-veg/30 bg-veg/[0.08] text-veg"
                      : "border-ink-soft/30 bg-ink-soft/[0.08] text-ink-soft"
                  )}
                >
                  {location.active ? "Active" : "Inactive"}
                </span>
              </div>
              <CardContent className="p-4 sm:p-5">
                <dl className="space-y-3.5">
                  <DetailRow label="Address">{location.address}</DetailRow>
                  <DetailRow label="Phone (reference)">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-brass" aria-hidden="true" />
                      {location.phone ?? "—"}
                    </span>
                  </DetailRow>
                  <DetailRow label="Hours">
                    {location.hoursNote ?? (
                      <span className="text-ink-soft/80">
                        Unconfirmed — hidden on the public site
                      </span>
                    )}
                  </DetailRow>
                  <DetailRow label="Ordering links">
                    <span className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {location.ordering.zomato && (
                        <a
                          href={location.ordering.zomato}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand underline decoration-brass-soft/60 underline-offset-4 transition-colors hover:text-brand-deep"
                        >
                          Zomato <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                      {location.ordering.swiggy && (
                        <a
                          href={location.ordering.swiggy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand underline decoration-brass-soft/60 underline-offset-4 transition-colors hover:text-brand-deep"
                        >
                          Swiggy <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                      {!location.ordering.zomato && !location.ordering.swiggy && (
                        <span className="text-ink-soft/80">—</span>
                      )}
                    </span>
                  </DetailRow>
                  <DetailRow label="Gallery images">
                    {location.gallery.length} stored
                  </DetailRow>
                  <DetailRow label="Display order">{location.displayOrder}</DetailRow>
                </dl>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a6d3b]">
                    <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                    Demo data
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditLocation(location)}
                    className="border-border text-ink-soft hover:text-brand"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        Outlet records are seeded from verified public listings (Zomato/Swiggy) — hours stay hidden
        until the owner confirms them.
      </p>

      {/* Edit dialog — guarded */}
      <Dialog open={editLocation !== null} onOpenChange={(open) => !open && setEditLocation(null)}>
        {editLocation && (
          <DialogContent className="pretty-scroll max-h-[90vh] overflow-y-auto border-border sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-semibold text-ink">
                Edit location
              </DialogTitle>
              <DialogDescription>
                {editLocation.name} — record {editLocation.slug}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <GuardedField id="loc-name" label="Name" value={editLocation.name} />
              <GuardedField id="loc-slug" label="Slug" value={editLocation.slug} />
              <GuardedField id="loc-address" label="Address" value={editLocation.address} />
              <GuardedField id="loc-phone" label="Phone (reference only)" value={editLocation.phone ?? ""} />
              <GuardedField
                id="loc-hours"
                label="Hours note"
                value={editLocation.hoursNote ?? ""}
              />
              <GuardedField
                id="loc-zomato"
                label="Zomato ordering URL"
                value={editLocation.ordering.zomato ?? ""}
                type="url"
              />
              <GuardedField
                id="loc-swiggy"
                label="Swiggy ordering URL"
                value={editLocation.ordering.swiggy ?? ""}
                type="url"
              />
              <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-3">
                <Label htmlFor="loc-active" className="text-sm font-medium">
                  Active (visible on the public site)
                </Label>
                <Switch id="loc-active" checked={editLocation.active} disabled />
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-brass/50 bg-brass/[0.06] p-3.5">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-[#8a6d3b]">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {GUARDED_NOTE}
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditLocation(null)}
                className="border-border"
              >
                Close
              </Button>
              <Button disabled className="cursor-not-allowed bg-brand/50 text-parchment">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Add dialog — same guarded state */}
      <Dialog open={addOpen} onOpenChange={(open) => !open && setAddOpen(false)}>
        <DialogContent className="border-border sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-semibold text-ink">
              Add location
            </DialogTitle>
            <DialogDescription>
              New outlet records follow the same production shape as existing ones.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <GuardedField id="new-loc-name" label="Name" value="" />
            <GuardedField id="new-loc-slug" label="Slug" value="" />
            <GuardedField id="new-loc-address" label="Address" value="" />
            <GuardedField id="new-loc-phone" label="Phone (reference only)" value="" />
            <GuardedField id="new-loc-zomato" label="Zomato ordering URL" value="" type="url" />
            <GuardedField id="new-loc-swiggy" label="Swiggy ordering URL" value="" type="url" />
            <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-3">
              <Label htmlFor="new-loc-active" className="text-sm font-medium">
                Active (visible on the public site)
              </Label>
              <Switch id="new-loc-active" checked disabled />
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-brass/50 bg-brass/[0.06] p-3.5">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-[#8a6d3b]">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {GUARDED_NOTE}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="border-border">
              Close
            </Button>
            <Button disabled className="cursor-not-allowed bg-brand/50 text-parchment">
              Create location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
