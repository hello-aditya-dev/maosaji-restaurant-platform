import { cn } from "@/lib/utils";

/**
 * Section header used across utility pages (menu, locations, forms…).
 * Editorial voice: quiet eyebrow, display serif, generous leading.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow-ink">{eyebrow}</p>}
      <h2 className="display-sm mt-3 font-serif font-medium text-ink text-balance">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ink-soft text-pretty">{description}</p>}
    </div>
  );
}
