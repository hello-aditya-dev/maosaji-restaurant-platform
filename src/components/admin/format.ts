import { toast } from "@/hooks/use-toast";
import type { EnquiryDTO } from "@/lib/data-provider/types";

/**
 * Admin display helpers — dates in the restaurant's timezone (Asia/Kolkata),
 * label prettifiers and an auto-dismissing toast wrapper.
 * Client-side only (used exclusively by admin client components).
 */

export const IST_TIMEZONE = "Asia/Kolkata";

/** "12 Feb 2026, 4:30 pm" */
export function formatDateTimeIst(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: IST_TIMEZONE,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** "12 Feb 2026" */
export function formatDateIst(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: IST_TIMEZONE,
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** "Monday, 16 February 2026" */
export function formatLongDateIst(date: Date): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: IST_TIMEZONE,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

/** Current hour (0–23) in Asia/Kolkata. */
export function istHour(date = new Date()): number {
  try {
    const raw = new Intl.DateTimeFormat("en-GB", {
      timeZone: IST_TIMEZONE,
      hour: "2-digit",
      hour12: false,
    }).format(date);
    return Number.parseInt(raw, 10) % 24;
  } catch {
    return date.getHours();
  }
}

export function greetingForHour(hour: number): "Good morning." | "Good afternoon." | "Good evening." {
  if (hour < 12) return "Good morning.";
  if (hour < 17) return "Good afternoon.";
  return "Good evening.";
}

export function typeLabel(type: EnquiryDTO["type"]): string {
  switch (type) {
    case "bulk_order":
      return "Bulk";
    case "celebration":
      return "Celebration";
    case "cake":
      return "Cake";
    case "contact":
      return "Contact";
  }
}

export function typeLabelLong(type: EnquiryDTO["type"]): string {
  switch (type) {
    case "bulk_order":
      return "Bulk order";
    case "celebration":
      return "Celebration";
    case "cake":
      return "Cake";
    case "contact":
      return "Contact";
  }
}

/** "menu_item_view" → "Menu item view" */
export function eventLabel(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/(^|\s)([a-z])/g, (_m, prefix: string, letter: string) => prefix + letter.toUpperCase());
}

type ToastInput = Parameters<typeof toast>[0];

/**
 * The shared shadcn toast lingers until dismissed; admin feedback should be
 * snappy during the demo, so auto-dismiss after a short delay.
 */
export function toastAuto(input: ToastInput, ms = 4500): void {
  const handle = toast(input);
  window.setTimeout(() => handle.dismiss(), ms);
}
