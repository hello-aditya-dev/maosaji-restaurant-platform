"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ITEM IMAGE — robust food image with graceful degradation.
 *
 *  • square aspect, object-cover, overflow-hidden — never overflows
 *  • shimmer placeholder while the image streams in (no blank box)
 *  • if the src 404s or fails to decode, swaps to an elegant serif-initial
 *    tile on a cream/grain backdrop (premium printed-menu pattern) — never a
 *    broken-image icon
 *  • when there is no imageUrl at all, the serif-initial tile shows from the
 *    start (no flash of empty)
 *  • `unavailable` items get grayscale + the caller can overlay its own badge
 *
 * The fallback is intentionally typographic — it reads like a printed menu
 * card, so the menu looks complete and premium even before photography exists
 * for an item (or if a single image fails to load on a flaky connection).
 */

const SHIMMER = "relative overflow-hidden bg-gradient-to-br from-cream via-ivory to-cream";

export function ItemImage({
  src,
  alt,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className,
  aspectClass = "aspect-square",
  unavailable = false,
  priority = false,
}: {
  src: string | null;
  alt: string;
  sizes?: string;
  className?: string;
  aspectClass?: string;
  unavailable?: boolean;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className={cn("relative overflow-hidden", aspectClass, SHIMMER, className)}>
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={cn(
            "object-cover transition-transform duration-300",
            unavailable && "grayscale",
          )}
        />
      ) : (
        // Elegant typographic fallback — a printed-menu card.
        <div
          className="absolute inset-0 flex items-center justify-center grain bg-gradient-to-br from-ivory via-cream to-ivory"
          aria-hidden="true"
        >
          <span className="font-serif text-5xl font-medium text-brand/35 select-none">
            {alt.trim().charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      {/* Subtle inner hairline so the tile never blends into the card border */}
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-espresso/5" />
    </div>
  );
}
