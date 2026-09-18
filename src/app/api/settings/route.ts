import { NextResponse } from "next/server";
import { getProvider } from "@/lib/data-provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const provider = getProvider();
  const settings = await provider.getSettings();
  return NextResponse.json({ settings });
}
