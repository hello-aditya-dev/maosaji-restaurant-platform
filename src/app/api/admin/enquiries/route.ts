import { NextResponse } from "next/server";
import { getProvider } from "@/lib/data-provider";
import { isAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const enquiries = await getProvider().listEnquiries();
  return NextResponse.json({ enquiries });
}
