import { cn } from "@/lib/utils";

/**
 * Indian vegetarian indicator (FSSAI-style square-and-dot), rendered with CSS.
 * Used ONLY where public data clearly supports a vegetarian item.
 */
export function VegBadge({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-[3px] border-2 border-veg bg-white", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Vegetarian"
      title="Vegetarian"
    >
      <span className="block rounded-full bg-veg" style={{ width: size * 0.4, height: size * 0.4 }} />
    </span>
  );
}
