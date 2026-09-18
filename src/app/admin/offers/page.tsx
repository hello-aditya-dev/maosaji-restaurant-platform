"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, BadgePercent, CalendarDays, Lock, Sparkles } from "lucide-react";
import type { OfferDTO } from "@/lib/data-provider/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatDateIst, toastAuto } from "@/components/admin/format";

/**
 * OFFERS MANAGER — the demo offer rendered from live data with a structured
 * preview of every field the team would edit (title, window, image, headline,
 * description, CTA, destination, active). Full CRUD is production scope; the
 * seeded demo offer stays read-only here.
 */

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

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<OfferDTO[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/offers", { cache: "no-store" });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { offers: OfferDTO[] };
      setOffers(data.offers);
    } catch {
      setLoadError(true);
      toastAuto({
        title: "Could not load offers",
        description: "Please try refreshing.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const offer = offers?.[0] ?? null;

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
          Operations console
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Offers
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">
          The offer shown on the public homepage, straight from live data. The structured preview
          below is exactly what the team edits — offers manager CRUD (create, schedule, retire) is
          production scope for this platform.
        </p>
      </header>

      {offers === null ? (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      ) : loadError ? (
        <Card className="mt-6 gap-0 border-border py-0 shadow-none">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-sm font-medium text-ink">Offers could not load.</p>
            <Button size="sm" variant="outline" onClick={() => void load()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : !offer ? (
        <Card className="mt-6 gap-0 border-border py-0 shadow-none">
          <CardContent className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <BadgePercent className="h-8 w-8 text-brass-soft" aria-hidden="true" />
            <p className="text-sm font-semibold text-ink">No active offers</p>
            <p className="max-w-sm text-xs leading-relaxed text-ink-soft">
              When an offer is active and inside its date window, it appears on the homepage and
              here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {/* The offer card, as rendered from live data */}
          <Card className="gap-0 overflow-hidden border-border py-0 shadow-none">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <h2 className="font-serif text-lg font-semibold text-ink">Active offer</h2>
              <p className="mt-0.5 text-xs text-ink-soft">
                Rendered on the public homepage from live data
              </p>
            </div>
            <div className="relative aspect-[16/9] bg-cream">
              {offer.imageSlug && offer.imageSlug.startsWith("/") && (
                <Image
                  src={offer.imageSlug}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-ivory/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a6d3b] backdrop-blur-sm">
                Demo data
              </span>
            </div>
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
                Offer
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-ink">
                {offer.headline ?? offer.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{offer.description}</p>
              <p className="mt-4 flex items-center gap-2 text-xs text-ink-soft">
                <CalendarDays className="h-3.5 w-3.5 text-brass" aria-hidden="true" />
                {formatDateIst(offer.startsAt)} – {formatDateIst(offer.endsAt)}
                <span className="ml-1 inline-flex items-center rounded-full border border-veg/30 bg-veg/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-veg">
                  Active
                </span>
              </p>
              {offer.ctaLabel && offer.ctaHref && (
                <p className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm">
                  <span className="font-medium text-ink">{offer.ctaLabel}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                    → {offer.ctaHref}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Structured preview of the editable fields */}
          <Card className="gap-0 border-border py-0 shadow-none">
            <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
              <div>
                <h2 className="font-serif text-lg font-semibold text-ink">
                  Fields the team would edit
                </h2>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Production-shaped preview — read-only in demo mode
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a6d3b]">
                <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                Demo data
              </span>
            </div>
            <CardContent className="grid gap-4 p-4 sm:p-5">
              <GuardedField id="offer-title" label="Title" value={offer.title} />
              <GuardedField id="offer-headline" label="Headline" value={offer.headline ?? ""} />
              <div className="grid gap-2">
                <Label htmlFor="offer-description" className="text-xs font-medium text-ink-soft">
                  Description
                </Label>
                <Textarea
                  id="offer-description"
                  value={offer.description ?? ""}
                  disabled
                  className="min-h-20 border-border bg-ivory text-sm"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <GuardedField id="offer-start" label="Start date" value={formatDateIst(offer.startsAt)} />
                <GuardedField id="offer-end" label="End date" value={formatDateIst(offer.endsAt)} />
              </div>
              <GuardedField id="offer-image" label="Image path" value={offer.imageSlug ?? ""} />
              <div className="grid gap-4 sm:grid-cols-2">
                <GuardedField id="offer-cta-label" label="CTA label" value={offer.ctaLabel ?? ""} />
                <GuardedField
                  id="offer-cta-href"
                  label="CTA destination"
                  value={offer.ctaHref ?? ""}
                  type="url"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-3">
                <Label htmlFor="offer-active" className="text-sm font-medium">
                  Active (live on the homepage inside the date window)
                </Label>
                <Switch id="offer-active" checked={offer.active} disabled />
              </div>
              <div className="rounded-lg border border-dashed border-brass/50 bg-brass/[0.06] p-3.5">
                <p className="flex items-start gap-2 text-xs leading-relaxed text-[#8a6d3b]">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Offers manager CRUD — creating, scheduling and retiring offers with owner-confirmed
                  details — is production scope for the platform. Demo mode keeps the seeded offer
                  read-only.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
