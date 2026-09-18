"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Lock, Megaphone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toastAuto } from "@/components/admin/format";

/**
 * SETTINGS / CONTENT — the two settings the demo writes live:
 * homepage announcement (empty = hidden) and the hero line. Everything else is
 * demo-static and shown read-only.
 */

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [heroLine, setHeroLine] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { settings: Record<string, unknown> };
      setSettings(data.settings);
      setAnnouncement(asString(data.settings.homepage_announcement));
      setHeroLine(asString(data.settings.hero_line));
      setDirty(false);
    } catch {
      setLoadError(true);
      toastAuto({
        title: "Could not load settings",
        description: "Please try refreshing.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homepage_announcement: announcement.trim() ? announcement.trim() : null,
          hero_line: heroLine,
        }),
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { settings: Record<string, unknown> };
      setSettings(data.settings);
      setAnnouncement(asString(data.settings.homepage_announcement));
      setHeroLine(asString(data.settings.hero_line));
      setDirty(false);
      toastAuto({
        title: "Settings saved — homepage reflects changes",
        description: announcement.trim()
          ? "The announcement bar is live on the homepage."
          : "The announcement bar is hidden — the homepage shows no announcement.",
      });
    } catch {
      toastAuto({
        title: "Could not save settings",
        description: "Nothing was changed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
          Operations console
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Settings
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Homepage content the team controls day-to-day. Save and check the homepage — changes are
          rendered from live data.
        </p>
      </header>

      {settings === null ? (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      ) : loadError ? (
        <Card className="mt-6 gap-0 border-border py-0 shadow-none">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-sm font-medium text-ink">Settings could not load.</p>
            <Button size="sm" variant="outline" onClick={() => void load()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-5">
          {/* Editable content */}
          <Card className="gap-0 border-border py-0 shadow-none">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <h2 className="font-serif text-lg font-semibold text-ink">Homepage content</h2>
              <p className="mt-0.5 text-xs text-ink-soft">Writes straight to live site settings</p>
            </div>
            <CardContent className="grid gap-5 p-4 sm:p-5">
              <div className="grid gap-2">
                <Label htmlFor="setting-announcement" className="flex items-center gap-1.5">
                  <Megaphone className="h-3.5 w-3.5 text-brass" aria-hidden="true" />
                  Homepage announcement
                </Label>
                <Input
                  id="setting-announcement"
                  value={announcement}
                  onChange={(e) => {
                    setAnnouncement(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="e.g. Now taking festive gift orders"
                  className="h-10 border-border bg-card"
                  maxLength={140}
                  aria-describedby="setting-announcement-hint"
                />
                <p id="setting-announcement-hint" className="text-[11px] leading-relaxed text-ink-soft">
                  Shown as a highlight line above the hero. Leave empty to hide it — nothing shows
                  on the homepage.
                </p>
                {/* Live preview of the announcement bar */}
                <div className="mt-1 rounded-lg border border-dashed border-border bg-ivory p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">
                    Homepage preview
                  </p>
                  {announcement.trim() ? (
                    <p className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-parchment/25 bg-ink px-4 py-1.5 text-xs font-medium text-cream">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass-soft" aria-hidden="true" />
                      {announcement.trim()}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs italic text-ink-soft/70">
                      No announcement — the homepage hero renders without a highlight line.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="setting-hero-line">Hero line</Label>
                <Input
                  id="setting-hero-line"
                  value={heroLine}
                  onChange={(e) => {
                    setHeroLine(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="One line under the restaurant name"
                  className="h-10 border-border bg-card"
                  maxLength={120}
                />
                <p className="text-[11px] leading-relaxed text-ink-soft">
                  Stored in site settings — the tagline shown under the restaurant name.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-xs text-ink-soft">
                  {dirty ? "You have unsaved changes." : "All changes saved."}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-brand hover:text-brand-deep"
                  >
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      View homepage
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button
                    onClick={() => void save()}
                    disabled={saving || !dirty}
                    className="bg-brand text-parchment hover:bg-brand-deep"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Save className="h-4 w-4" aria-hidden="true" />
                    )}
                    Save settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo-static settings */}
          <Card className="gap-0 border-border py-0 shadow-none">
            <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
              <div>
                <h2 className="font-serif text-lg font-semibold text-ink">
                  Other settings
                </h2>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Demo-static in this build — production exposes the same shape
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a6d3b]">
                <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                Demo data
              </span>
            </div>
            <CardContent className="grid gap-4 p-4 sm:p-5">
              <div className="grid gap-2">
                <Label htmlFor="setting-hero-title" className="text-xs font-medium text-ink-soft">
                  Hero title
                </Label>
                <Input
                  id="setting-hero-title"
                  value={asString(settings.hero_title)}
                  disabled
                  className="border-border bg-ivory text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="setting-contact-note" className="text-xs font-medium text-ink-soft">
                  Contact note
                </Label>
                <Input
                  id="setting-contact-note"
                  value={asString(settings.contact_note)}
                  disabled
                  className="border-border bg-ivory text-sm"
                />
              </div>
              <p className="text-[11px] leading-relaxed text-ink-soft/80">
                Other site settings stay demo-static in this private concept — they are shown so the
                production shape is visible, and become editable once the platform is connected to
                the owner’s data.
              </p>
            </CardContent>
          </Card>

          <p className="text-xs leading-relaxed text-ink-soft">
            Need to see it end-to-end?{" "}
            <Link
              href="/"
              className="font-medium text-brand underline decoration-brass-soft/60 underline-offset-4 transition-colors hover:text-brand-deep"
            >
              Open the public homepage
            </Link>{" "}
            after saving.
          </p>
        </div>
      )}
    </div>
  );
}
