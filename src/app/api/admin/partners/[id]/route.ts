import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { partnerSchema } from "@/lib/validators/admin";
import { isSameOrigin } from "@/lib/security/origin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = partnerSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const d = parsed.data;
    await prisma.partner.update({
      where: { id },
      data: {
        ...(d.nameEn !== undefined && { nameEn: d.nameEn }),
        ...(d.nameAr !== undefined && { nameAr: d.nameAr }),
        ...(d.logoText !== undefined && { logoText: d.logoText || null }),
        ...(d.logoUrl !== undefined && { logoUrl: d.logoUrl || null }),
        ...(d.websiteUrl !== undefined && { websiteUrl: d.websiteUrl || null }),
        ...(d.isVisible !== undefined && { isVisible: !!d.isVisible }),
        ...(d.order !== undefined && { order: d.order ?? 0 }),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/partners PATCH]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.partner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/partners DELETE]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
