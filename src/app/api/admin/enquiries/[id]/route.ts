import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getProvider, ENQUIRY_STATUSES } from "@/lib/data-provider";
import { isAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  status: z.enum(ENQUIRY_STATUSES as [string, ...string[]]),
});

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 422 });
  }
  try {
    const enquiry = await getProvider().updateEnquiryStatus(id, parsed.data.status as any);
    return NextResponse.json({ ok: true, enquiry });
  } catch {
    return NextResponse.json({ ok: false, error: "Enquiry not found" }, { status: 404 });
  }
}
