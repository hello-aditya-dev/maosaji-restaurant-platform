"use client";

import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useSiteStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export type OrderableItem = {
  slug: string;
  name: string;
  categorySlug: string;
  imageUrl: string | null;
};

export function AddToOrderButton({ item, compact = false }: { item: OrderableItem; compact?: boolean }) {
  const addItem = useSiteStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    addItem({
      itemSlug: item.slug,
      name: item.name,
      categorySlug: item.categorySlug,
      imageUrl: item.imageUrl,
    });
    track("order_click", { action: "add-item", item: item.slug });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Add ${item.name} to order list`}
      className={cn(
        "inline-flex items-center justify-center rounded-md border transition-all duration-150 active:scale-[0.96]",
        compact ? "h-8 w-8" : "h-9 w-9",
        added
          ? "border-veg bg-veg text-white"
          : "border-brand/30 bg-white text-brand hover:border-brand hover:bg-brand/10"
      )}
    >
      {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
