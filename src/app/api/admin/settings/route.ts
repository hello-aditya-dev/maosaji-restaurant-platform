import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getProvider } from "@/lib/data-provider";
import { isAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const schema = z.record(z.string().max(60), z.unknown());

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success || Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ ok: false, error: "Invalid settings" }, { status: 422 });
  }
  const provider = getProvider();
  for (const [key, value] of Object.entries(parsed.data)) {
    await provider.upsertSetting(key, value);
  }
  return NextResponse.json({ ok: true, settings: await provider.getSettings() });
}
