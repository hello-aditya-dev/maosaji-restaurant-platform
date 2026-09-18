import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Dashboard stat card — operations styling: white card, hairline border,
 * serif figure, small-caps label, "DEMO DATA" provenance chip.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  demo = true,
  className,
}: {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  hint?: string;
  demo?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 border-border py-0 shadow-none", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">{label}</p>
            <p className="mt-2 font-serif text-3xl font-semibold leading-none text-ink tabular-nums">
              {value}
            </p>
            {hint && <p className="mt-2 text-xs leading-relaxed text-ink-soft">{hint}</p>}
          </div>
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-cream text-brand">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </div>
        {demo && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a6d3b]">
            Demo data
          </span>
        )}
      </CardContent>
    </Card>
  );
}
