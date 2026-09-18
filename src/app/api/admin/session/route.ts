import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { backendMode } from "@/lib/data-provider";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ authenticated: await isAuthenticated(), mode: backendMode });
}
