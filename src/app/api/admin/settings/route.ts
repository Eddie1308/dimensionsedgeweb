import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { settingPatchSchema } from "@/lib/validators/admin";

// Upsert a single setting by key.
export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = settingPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const { key, value, category } = parsed.data;
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value, category: category || null },
      create: { key, value, category: category || null },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/settings PATCH]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
