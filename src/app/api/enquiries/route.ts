import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getProvider } from "@/lib/data-provider";
import { track } from "@/lib/analytics-api";

export const dynamic = "force-dynamic";

const phone = z
  .string()
  .trim()
  .min(8, "Phone number looks too short")
  .max(16, "Phone number looks too long")
  .regex(/^[0-9+\-\s()]+$/, "Phone can only contain digits and + - ( )");

const base = {
  contactName: z.string().trim().min(2, "Please tell us your name").max(80),
  phone,
  email: z.union([z.literal(""), z.string().trim().email("That email doesn't look right").max(120)]).optional(),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
  locationSlug: z.string().trim().max(40).optional().nullable(),
  budgetRange: z.string().trim().max(60).optional().nullable(),
  // honeypot — must stay empty; bots fill it
  company: z.string().max(0).optional().or(z.literal("").optional()),
};

const celebrationSchema = z.object({
  ...base,
  type: z.literal("celebration"),
  eventDate: z.string().trim().min(1, "Please choose an event date"),
  guestCount: z.coerce.number().int().min(1, "Expected guests is required").max(100000),
  requirements: z.array(z.string().max(40)).max(12).optional(),
});

const bulkSchema = z.object({
  ...base,
  type: z.literal("bulk_order"),
  organization: z.string().trim().min(2, "Organisation name is required").max(120),
  quantity: z.string().trim().min(2, "Please tell us the quantity").max(120),
  occasion: z.string().trim().min(2, "Occasion is required").max(80),
  eventDate: z.string().trim().min(1, "Please choose a required-by date"),
  categories: z.array(z.string().max(40)).max(12).optional(),
});

const cakeSchema = z.object({
  ...base,
  type: z.literal("cake"),
  eventDate: z.string().trim().min(1, "Please choose the date you need the cake"),
  cakeType: z.string().trim().min(2, "Cake type is required").max(120),
  cakeWeight: z.string().trim().min(1, "Approximate weight is required").max(40),
  cakeMessage: z.string().trim().max(200).optional().or(z.literal("")),
});

const contactSchema = z.object({
  ...base,
  type: z.literal("contact"),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
});

const schema = z.discriminatedUnion("type", [celebrationSchema, bulkSchema, cakeSchema, contactSchema]);

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const data = parsed.data;

  // Honeypot triggered → silently accept (do not tip off bots) but do not store.
  if (data.company) {
    return NextResponse.json({ ok: true, reference: "CO-2026-0000" });
  }

  const provider = getProvider();
  const enquiry = await provider.createEnquiry({
    type: data.type,
    contactName: data.contactName,
    phone: data.phone,
    email: data.email || null,
    organization: data.type === "bulk_order" ? data.organization : null,
    locationSlug: data.locationSlug || null,
    eventDate: data.type === "contact" ? null : data.eventDate || null,
    guestCount: data.type === "celebration" ? data.guestCount : null,
    quantity: data.type === "bulk_order" ? data.quantity : null,
    budgetRange: data.budgetRange || null,
    requirements:
      data.type === "celebration" ? data.requirements ?? []
      : data.type === "bulk_order" ? data.categories ?? []
      : [],
    cakeType: data.type === "cake" ? data.cakeType : null,
    cakeWeight: data.type === "cake" ? data.cakeWeight : null,
    cakeMessage: data.type === "cake" ? data.cakeMessage || null : null,
    message: data.message || null,
  });

  // Private demo: no external notification is ever sent (no email/SMS/WhatsApp).
  void track(`${data.type}_form_submitted`, { reference: enquiry.referenceNumber });

  return NextResponse.json({ ok: true, reference: enquiry.referenceNumber, enquiry });
}
