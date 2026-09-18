import { NextResponse } from "next/server";
import { getProvider } from "@/lib/data-provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const provider = getProvider();
  const [categories, items, locations] = await Promise.all([
    provider.getCategories(),
    provider.getMenuItems(),
    provider.getLocations(),
  ]);
  return NextResponse.json({ mode: provider.mode, categories, items, locations });
}
