import { NextResponse, type NextRequest } from "next/server";
import { track } from "@/lib/analytics-api";

export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "menu_search", "menu_item_view", "order_click", "zomato_click", "swiggy_click",
  "call_click", "directions_click", "whatsapp_click",
  "celebration_form_started", "celebration_form_submitted",
  "bulk_form_started", "bulk_form_submitted",
  "cake_form_started", "cake_form_submitted",
  "contact_form_started", "contact_form_submitted",
  "location_selected",
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name : "";
    if (!ALLOWED.has(name)) {
      return new NextResponse(null, { status: 204 });
    }
    const payload =
      body?.payload && typeof body.payload === "object"
        ? (body.payload as Record<string, unknown>)
        : undefined;
    await track(name, payload);
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
