import { NextResponse, type NextRequest } from "next/server";
import { createSession, demoPasscode } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let passcode = "";
  try {
    const body = await request.json();
    passcode = typeof body?.passcode === "string" ? body.passcode : "";
  } catch {
    passcode = "";
  }

  if (passcode !== demoPasscode()) {
    return NextResponse.json({ ok: false, error: "Incorrect passcode." }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
