/**
 * Price display with truthfulness rules baked in:
 * null → "Price available on ordering partner" (never invent prices).
 */
export function PriceTag({ priceCents, className }: { priceCents: number | null; className?: string }) {
  if (priceCents === null || priceCents === undefined) {
    return (
      <span className={`text-xs text-ink-soft/80 ${className ?? ""}`}>
        Price available on ordering partner
      </span>
    );
  }
  return (
    <span className={`font-medium text-ink ${className ?? ""}`}>
      ₹{(priceCents / 100).toLocaleString("en-IN")}
    </span>
  );
}
