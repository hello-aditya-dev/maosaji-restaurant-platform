import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getProvider } from "@/lib/data-provider";
import { isAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/, "lowercase-with-dashes"),
  categorySlug: z.string().trim().min(2).max(60),
  description: z.string().trim().max(500).optional().nullable(),
  isVegetarian: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  locationSlugs: z.array(z.string().max(40)).optional(),
  imageUrl: z.string().trim().max(300).optional().nullable(),
});

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid item" },
      { status: 422 }
    );
  }
  try {
    const item = await getProvider().createMenuItem(parsed.data as any);
    return NextResponse.json({ ok: true, item });
  } catch (e: any) {
    const duplicate = String(e?.message ?? "").includes("Unique constraint");
    return NextResponse.json(
      { ok: false, error: duplicate ? "An item with this slug already exists." : "Could not create item." },
      { status: 409 }
    );
  }
}
