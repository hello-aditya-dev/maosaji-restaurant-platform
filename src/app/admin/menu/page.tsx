"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import type {
  LocationDTO,
  MenuCategoryDTO,
  MenuItemDTO,
} from "@/lib/data-provider/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { VegBadge } from "@/components/shared/veg-badge";
import { toastAuto } from "@/components/admin/format";
import { cn } from "@/lib/utils";

/**
 * MENU MANAGER — the critical demo feature.
 * Availability and featured toggles PATCH straight into the database the
 * public /menu page reads (force-dynamic), so the site reacts immediately.
 */

type MenuApi = {
  mode: string;
  categories: MenuCategoryDTO[];
  items: MenuItemDTO[];
  locations: LocationDTO[];
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const SLUG_PATTERN = /^[a-z0-9-]+$/;

function ItemThumb({ item }: { item: MenuItemDTO }) {
  if (item.imageUrl && item.imageUrl.startsWith("/")) {
    return (
      <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-cream">
        <Image src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" />
      </span>
    );
  }
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-cream">
      <ImageIcon className="h-4 w-4 text-brass-soft" aria-hidden="true" />
    </span>
  );
}

/* ── Edit dialog ─────────────────────────────────────────────── */

function EditItemForm({
  item,
  categories,
  locations,
  saving,
  onSave,
  onCancel,
}: {
  item: MenuItemDTO;
  categories: MenuCategoryDTO[];
  locations: LocationDTO[];
  saving: boolean;
  onSave: (patch: {
    name: string;
    description: string | null;
    categorySlug: string;
    locationSlugs: string[];
    isVegetarian: boolean;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [categorySlug, setCategorySlug] = useState(item.categorySlug);
  const [locationSlugs, setLocationSlugs] = useState<string[]>(item.locationSlugs);
  const [isVegetarian, setIsVegetarian] = useState(item.isVegetarian);

  const valid = name.trim().length >= 2 && categorySlug.length > 0;

  const toggleLocation = (slug: string, checked: boolean) => {
    setLocationSlugs((prev) =>
      checked ? [...prev, slug] : prev.filter((s) => s !== slug)
    );
  };

  return (
    <DialogContent className="border-border sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-serif text-lg font-semibold text-ink">
          Edit menu item
        </DialogTitle>
        <DialogDescription>
          {item.slug} — changes go live on the public menu immediately.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-name">Name</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-border bg-card"
            maxLength={120}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short menu description (optional)"
            className="min-h-20 border-border bg-card"
            maxLength={500}
          />
        </div>
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select value={categorySlug} onValueChange={setCategorySlug}>
            <SelectTrigger className="w-full border-border bg-card">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Available at</Label>
          <div className="rounded-lg border border-border bg-ivory/60 p-3">
            <div className="flex flex-wrap gap-2">
              {locations.map((location) => (
                <label
                  key={location.slug}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-ink"
                >
                  <Checkbox
                    checked={locationSlugs.includes(location.slug)}
                    onCheckedChange={(checked) => toggleLocation(location.slug, checked === true)}
                    aria-label={location.name}
                  />
                  {location.name}
                </label>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
              Leave all unchecked to show this item at every outlet.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-3">
          <div>
            <Label htmlFor="edit-veg" className="text-sm font-medium">
              Vegetarian
            </Label>
            <p className="text-[11px] text-ink-soft">Shows the green veg indicator on the site.</p>
          </div>
          <Switch id="edit-veg" checked={isVegetarian} onCheckedChange={setIsVegetarian} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={saving} className="border-border">
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSave({
              name: name.trim(),
              description: description.trim() || null,
              categorySlug,
              locationSlugs,
              isVegetarian,
            })
          }
          disabled={!valid || saving}
          className="bg-brand text-parchment hover:bg-brand-deep"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

/* ── Add dialog ──────────────────────────────────────────────── */

function AddItemForm({
  categories,
  locations,
  imagePresets,
  saving,
  onSubmit,
  onCancel,
}: {
  categories: MenuCategoryDTO[];
  locations: LocationDTO[];
  imagePresets: string[];
  saving: boolean;
  onSubmit: (input: {
    name: string;
    slug: string;
    categorySlug: string;
    description: string | null;
    imageUrl: string | null;
    isVegetarian: boolean;
    isAvailable: boolean;
    isFeatured: boolean;
    locationSlugs: string[];
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [categorySlug, setCategorySlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [locationSlugs, setLocationSlugs] = useState<string[]>([]);

  const effectiveSlug = slugTouched ? slug : slugify(name);
  const slugValid = SLUG_PATTERN.test(effectiveSlug) && effectiveSlug.length >= 2;
  const valid = name.trim().length >= 2 && slugValid && categorySlug.length > 0;

  const toggleLocation = (locationSlug: string, checked: boolean) => {
    setLocationSlugs((prev) =>
      checked ? [...prev, locationSlug] : prev.filter((s) => s !== locationSlug)
    );
  };

  return (
    <DialogContent className="pretty-scroll max-h-[90vh] overflow-y-auto border-border sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-serif text-lg font-semibold text-ink">
          Add menu item
        </DialogTitle>
        <DialogDescription>
          Creates a live item — it appears on the public menu immediately.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="add-name">Name</Label>
          <Input
            id="add-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Motichoor Laddoo"
            className="border-border bg-card"
            maxLength={120}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="add-slug">Slug</Label>
          <Input
            id="add-slug"
            value={effectiveSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="auto-generated-from-name"
            className="border-border bg-card font-mono text-sm"
            maxLength={120}
            required
            aria-describedby="add-slug-hint"
          />
          <p id="add-slug-hint" className="text-[11px] leading-relaxed text-ink-soft">
            Auto-generated from the name — lowercase letters, numbers and dashes.
            {effectiveSlug.length > 0 && !slugValid && (
              <span className="font-medium text-[#b3261e]">
                {" "}
                Use only lowercase letters, numbers and dashes.
              </span>
            )}
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select value={categorySlug} onValueChange={setCategorySlug}>
            <SelectTrigger className="w-full border-border bg-card">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="add-description">Description</Label>
          <Textarea
            id="add-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short menu description (optional)"
            className="min-h-20 border-border bg-card"
            maxLength={500}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="add-image">Image URL (optional)</Label>
          <Input
            id="add-image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/images/items/…"
            className="border-border bg-card font-mono text-sm"
            list="menu-image-presets"
            maxLength={300}
          />
          <datalist id="menu-image-presets">
            {imagePresets.map((preset) => (
              <option key={preset} value={preset} />
            ))}
          </datalist>
          <p className="text-[11px] leading-relaxed text-ink-soft">
            Leave empty for a neutral placeholder. Presets from existing items are offered as you
            type.
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Available at</Label>
          <div className="rounded-lg border border-border bg-ivory/60 p-3">
            <div className="flex flex-wrap gap-2">
              {locations.map((location) => (
                <label
                  key={location.slug}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-ink"
                >
                  <Checkbox
                    checked={locationSlugs.includes(location.slug)}
                    onCheckedChange={(checked) => toggleLocation(location.slug, checked === true)}
                    aria-label={location.name}
                  />
                  {location.name}
                </label>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
              Leave all unchecked to show this item at every outlet.
            </p>
          </div>
        </div>
        <div className="grid gap-2.5">
          {(
            [
              { id: "add-veg", label: "Vegetarian", description: "Shows the green veg indicator", value: isVegetarian, set: setIsVegetarian },
              { id: "add-available", label: "Available", description: "Item is visible on the public menu", value: isAvailable, set: setIsAvailable },
              { id: "add-featured", label: "Featured", description: "Item appears in homepage favourites", value: isFeatured, set: setIsFeatured },
            ] as const
          ).map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between rounded-lg border border-border px-3.5 py-3"
            >
              <div>
                <Label htmlFor={row.id} className="text-sm font-medium">
                  {row.label}
                </Label>
                <p className="text-[11px] text-ink-soft">{row.description}</p>
              </div>
              <Switch id={row.id} checked={row.value} onCheckedChange={row.set} />
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={saving} className="border-border">
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSubmit({
              name: name.trim(),
              slug: effectiveSlug,
              categorySlug,
              description: description.trim() || null,
              imageUrl: imageUrl.trim() || null,
              isVegetarian,
              isAvailable,
              isFeatured,
              locationSlugs,
            })
          }
          disabled={!valid || saving}
          className="bg-brand text-parchment hover:bg-brand-deep"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Create item
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function AdminMenuPage() {
  const [data, setData] = useState<MenuApi | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editItem, setEditItem] = useState<MenuItemDTO | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (!res.ok) throw new Error("Request failed");
      const menuData = (await res.json()) as MenuApi;
      setData(menuData);
    } catch {
      setLoadError(true);
      toastAuto({
        title: "Could not load the menu",
        description: "Please try refreshing.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markBusy = (id: string, busy: boolean) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  /** Optimistic PATCH — reconciles with the server row or reverts. */
  const patchItem = async (
    item: MenuItemDTO,
    patch: Partial<MenuItemDTO>,
    success: { title: string; description?: string }
  ): Promise<boolean> => {
    const snapshot = data;
    markBusy(item.id, true);
    setData((d) =>
      d ? { ...d, items: d.items.map((i) => (i.id === item.id ? { ...i, ...patch } : i)) } : d
    );
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = res.ok ? ((await res.json()) as { ok: boolean; item: MenuItemDTO }) : null;
      if (!res.ok || !body?.ok) throw new Error("Request failed");
      const updated = body.item;
      setData((d) =>
        d ? { ...d, items: d.items.map((i) => (i.id === updated.id ? updated : i)) } : d
      );
      toastAuto({ title: success.title, description: success.description });
      return true;
    } catch {
      setData(snapshot);
      toastAuto({
        title: "Could not save the change",
        description: `“${item.name}” was not updated. Please try again.`,
        variant: "destructive",
      });
      return false;
    } finally {
      markBusy(item.id, false);
    }
  };

  const imagePresets = useMemo(
    () =>
      Array.from(
        new Set(
          (data?.items ?? [])
            .map((item) => item.imageUrl)
            .filter((url): url is string => typeof url === "string" && url.length > 0)
        )
      ).sort(),
    [data]
  );

  const groups = useMemo(() => {
    if (!data) return [];
    const categoryBySlug = new Map(data.categories.map((c) => [c.slug, c]));
    const categoryOrder = new Map(data.categories.map((c) => [c.slug, c.displayOrder]));
    const query = search.trim().toLowerCase();
    const filtered = data.items.filter((item) => {
      if (categoryFilter !== "all" && item.categorySlug !== categoryFilter) return false;
      if (query) {
        const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
    const sorted = [...filtered].sort(
      (a, b) =>
        (categoryOrder.get(a.categorySlug) ?? 999) - (categoryOrder.get(b.categorySlug) ?? 999) ||
        a.displayOrder - b.displayOrder ||
        a.name.localeCompare(b.name)
    );
    if (categoryFilter !== "all") {
      return [
        { name: categoryBySlug.get(categoryFilter)?.name ?? categoryFilter, items: sorted },
      ];
    }
    const out: { name: string; items: MenuItemDTO[] }[] = [];
    for (const category of data.categories) {
      const items = sorted.filter((item) => item.categorySlug === category.slug);
      if (items.length > 0) out.push({ name: category.name, items });
    }
    const known = new Set(data.categories.map((c) => c.slug));
    const unknown = sorted.filter((item) => !known.has(item.categorySlug));
    if (unknown.length > 0) out.push({ name: "Other", items: unknown });
    return out;
  }, [data, search, categoryFilter]);

  const counters = useMemo(() => {
    const items = data?.items ?? [];
    return {
      total: items.length,
      available: items.filter((i) => i.isAvailable).length,
      featured: items.filter((i) => i.isFeatured).length,
    };
  }, [data]);

  const saveEdit = async (
    item: MenuItemDTO,
    patch: {
      name: string;
      description: string | null;
      categorySlug: string;
      locationSlugs: string[];
      isVegetarian: boolean;
    }
  ) => {
    setEditSaving(true);
    const ok = await patchItem(item, patch, {
      title: "Item saved — public menu reflects this immediately",
      description: `“${patch.name}” was updated.`,
    });
    setEditSaving(false);
    if (ok) setEditItem(null);
  };

  const submitAdd = async (input: {
    name: string;
    slug: string;
    categorySlug: string;
    description: string | null;
    imageUrl: string | null;
    isVegetarian: boolean;
    isAvailable: boolean;
    isFeatured: boolean;
    locationSlugs: string[];
  }) => {
    if (addSaving) return;
    setAddError(null);
    setAddSaving(true);
    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok: boolean; item?: MenuItemDTO; error?: string }
        | null;
      if (!res.ok || !body?.ok) {
        setAddError(body?.error ?? "Could not create the item. Please check the fields.");
        return;
      }
      setAddOpen(false);
      await load();
      toastAuto({
        title: "Item created — it is live on the public menu",
        description: `“${input.name}” was added to the menu.`,
      });
    } catch {
      setAddError("Could not reach the server. Please try again.");
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
            Operations console
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Menu manager
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Toggle availability or featured and the public site follows immediately — the menu
            pages read this data live.
          </p>
        </div>
        <Button
          onClick={() => {
            setAddError(null);
            setAddOpen(true);
          }}
          className="bg-brand text-parchment hover:bg-brand-deep"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add item
        </Button>
      </header>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items"
            className="h-9 border-border bg-card pl-9 text-sm"
            aria-label="Search menu items"
          />
        </div>
        <div className="flex items-center gap-3 sm:ml-auto">
          <p className="hidden text-xs text-ink-soft md:block">
            {counters.available} available · {counters.featured} featured · {counters.total} items
          </p>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger size="sm" className="h-9 w-[190px] border-border bg-card text-sm">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(data?.categories ?? []).map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      {data === null ? (
        <Card className="mt-4 gap-0 border-border py-0 shadow-none">
          <CardContent className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </CardContent>
        </Card>
      ) : loadError ? (
        <Card className="mt-4 gap-0 border-border py-0 shadow-none">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-sm font-medium text-ink">The menu could not load.</p>
            <Button size="sm" variant="outline" onClick={() => void load()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : groups.length === 0 ? (
        <Card className="mt-4 gap-0 border-border py-0 shadow-none">
          <CardContent className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <UtensilsCrossed className="h-8 w-8 text-brass-soft" aria-hidden="true" />
            <p className="text-sm font-semibold text-ink">No items match</p>
            <p className="max-w-sm text-xs leading-relaxed text-ink-soft">
              Try a different search term or category — or add a new item.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="pretty-scroll mt-4 max-h-[calc(100vh-16rem)] space-y-4 overflow-y-auto pr-0.5">
          {groups.map((group) => (
            <Card key={group.name} className="gap-0 overflow-hidden border-border py-0 shadow-none">
              <div className="flex items-center justify-between gap-3 border-b border-border bg-ivory/60 px-4 py-2.5 sm:px-5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  {group.name}
                </h2>
                <span className="text-[11px] tabular-nums text-ink-soft/70">
                  {group.items.length} {group.items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <ul className="divide-y divide-border">
                {group.items.map((item) => {
                  const busy = busyIds.has(item.id);
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors sm:gap-4 sm:px-5",
                        busy ? "opacity-70" : "hover:bg-ivory/60"
                      )}
                    >
                      <ItemThumb item={item} />
                      <div className="min-w-0 flex-1 basis-44">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          {item.isVegetarian && <VegBadge size={12} />}
                          <p
                            className={cn(
                              "truncate text-sm font-semibold text-ink",
                              !item.isAvailable && "text-ink-soft/60"
                            )}
                          >
                            {item.name}
                          </p>
                          {!item.isAvailable && (
                            <span className="rounded-full border border-ink-soft/25 bg-ink-soft/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
                              Hidden on site
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">
                          {item.description ?? "No description yet"}
                        </p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-ink-soft/70">
                          {item.slug}
                          {item.locationSlugs.length === 0
                            ? " · all outlets"
                            : ` · ${item.locationSlugs.join(", ")}`}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            void patchItem(
                              item,
                              { isFeatured: !item.isFeatured },
                              {
                                title: "Featured updated — homepage reflects this immediately",
                                description: item.isFeatured
                                  ? `“${item.name}” was removed from homepage favourites.`
                                  : `“${item.name}” now appears in homepage favourites.`,
                              }
                            )
                          }
                          disabled={busy}
                          aria-pressed={item.isFeatured}
                          aria-label={
                            item.isFeatured
                              ? `Remove ${item.name} from featured`
                              : `Feature ${item.name}`
                          }
                          title={item.isFeatured ? "Featured on the homepage" : "Not featured"}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                            item.isFeatured
                              ? "border-brass/50 bg-brass/10 text-brass"
                              : "border-border bg-card text-brass-soft hover:text-brass"
                          )}
                        >
                          <Star
                            className={cn("h-4 w-4", item.isFeatured && "fill-brass")}
                            aria-hidden="true"
                          />
                        </button>
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`available-${item.id}`}
                            checked={item.isAvailable}
                            onCheckedChange={(checked) =>
                              void patchItem(
                                item,
                                { isAvailable: checked },
                                {
                                  title: "Menu updated — public site reflects this immediately",
                                  description: checked
                                    ? `“${item.name}” is now available on the public menu.`
                                    : `“${item.name}” is hidden from the public menu.`,
                                }
                              )
                            }
                            disabled={busy}
                          />
                          <label
                            htmlFor={`available-${item.id}`}
                            className="hidden cursor-pointer text-xs text-ink-soft sm:block"
                          >
                            Available
                          </label>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditItem(item)}
                          disabled={busy}
                          aria-label={`Edit ${item.name}`}
                          className="h-8 w-8 border-border text-ink-soft hover:text-brand"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-ink-soft">
        Availability, featured, details and new items all write to the live menu data — the public
        menu pages are rendered dynamically and pick changes up on the next visit.
      </p>

      {/* Edit dialog — keyed so the form resets per item */}
      <Dialog open={editItem !== null} onOpenChange={(open) => !open && setEditItem(null)}>
        {editItem && (
          <EditItemForm
            key={editItem.id}
            item={editItem}
            categories={data?.categories ?? []}
            locations={data?.locations ?? []}
            saving={editSaving}
            onSave={(patch) => void saveEdit(editItem, patch)}
            onCancel={() => setEditItem(null)}
          />
        )}
      </Dialog>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={(open) => !open && !addSaving && setAddOpen(false)}>
        <AddItemForm
          categories={data?.categories ?? []}
          locations={data?.locations ?? []}
          imagePresets={imagePresets}
          saving={addSaving}
          onSubmit={(input) => void submitAdd(input)}
          onCancel={() => setAddOpen(false)}
        />
      </Dialog>
    </div>
  );
}
