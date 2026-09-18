import { cn } from "@/lib/utils";
import type { EnquiryDTO, EnquiryStatus } from "@/lib/data-provider/types";
import { typeLabel } from "./format";

/**
 * Admin chips — statuses, enquiry types and demo/live provenance.
 * Colour rules: NEW=red-tint, CONTACTED=amber, QUALIFIED=slate (blue-gray),
 * QUOTED=violet-gray, WON=green, LOST=gray. No bright blue anywhere.
 */

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  NEW: "border-brand/25 bg-brand/[0.07] text-brand",
  CONTACTED: "border-[#b45309]/30 bg-[#b45309]/[0.08] text-[#92400e]",
  QUALIFIED: "border-slate-500/30 bg-slate-500/10 text-slate-700",
  QUOTED: "border-[#7c6a9a]/30 bg-[#7c6a9a]/[0.1] text-[#5a4a78]",
  WON: "border-veg/30 bg-veg/[0.08] text-veg",
  LOST: "border-ink-soft/30 bg-ink-soft/[0.08] text-ink-soft",
};

export function StatusChip({ status, className }: { status: EnquiryStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        STATUS_STYLES[status],
        className
      )}
    >
      {status}
    </span>
  );
}

export function EnquiryTypeChip({ type, className }: { type: EnquiryDTO["type"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-cream px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-soft",
        className
      )}
    >
      {typeLabel(type)}
    </span>
  );
}

/** Provenance chip — seeded demo records vs. genuinely submitted records. */
export function DemoDataChip({ isDemo, className }: { isDemo: boolean; className?: string }) {
  return isDemo ? (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-brass/40 bg-brass/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a6d3b]",
        className
      )}
    >
      Demo data
    </span>
  ) : (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-veg/30 bg-veg/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-veg",
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-veg" aria-hidden="true" />
      Live
    </span>
  );
}
