import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { clientSchema } from "@/lib/validators/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = clientSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const d = parsed.data;
    await prisma.client.update({
      where: { id },
      data: {
        ...(d.nameEn !== undefined && { nameEn: d.nameEn }),
        ...(d.nameAr !== undefined && { nameAr: d.nameAr }),
        ...(d.logoText !== undefined && { logoText: d.logoText || null }),
        ...(d.logoUrl !== undefined && { logoUrl: d.logoUrl || null }),
        ...(d.industryEn !== undefined && { industryEn: d.industryEn || null }),
        ...(d.industryAr !== undefined && { industryAr: d.industryAr || null }),
        ...(d.isVisible !== undefined && { isVisible: !!d.isVisible }),
        ...(d.order !== undefined && { order: d.order ?? 0 }),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/clients PATCH]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/clients DELETE]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
