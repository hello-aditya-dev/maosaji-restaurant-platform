"use client";

/**
 * Analytics event layer (client side).
 * Private demo: events are stored in the local demo database only and shown in
 * the admin dashboard clearly labelled "Demo data". No external analytics.
 */

const ALLOWED = new Set([
  "menu_search",
  "menu_item_view",
  "order_click",
  "zomato_click",
  "swiggy_click",
  "call_click",
  "directions_click",
  "whatsapp_click",
  "celebration_form_started",
  "celebration_form_submitted",
  "bulk_form_started",
  "bulk_form_submitted",
  "cake_form_started",
  "cake_form_submitted",
  "contact_form_started",
  "contact_form_submitted",
  "location_selected",
]);

export function track(name: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!ALLOWED.has(name)) return;
  try {
    const body = JSON.stringify({ name, payload: payload ?? null });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // analytics must never break the UI
  }
}
