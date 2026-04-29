import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { partnerSchema } from "@/lib/validators/admin";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = partnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const d = parsed.data;
    const created = await prisma.partner.create({
      data: {
        nameEn: d.nameEn,
        nameAr: d.nameAr,
        logoUrl: d.logoUrl,
        websiteUrl: d.websiteUrl || null,
        isVisible: !!d.isVisible,
        order: d.order ?? 0,
      },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 });
  }
}
