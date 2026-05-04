import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { projectSchema } from "@/lib/validators/admin";

async function requireSession() {
  const session = await getAdminSession();
  if (!session) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const d = parsed.data;
    await prisma.project.update({
      where: { id },
      data: {
        ...(d.slug !== undefined && { slug: d.slug }),
        ...(d.titleEn !== undefined && { titleEn: d.titleEn }),
        ...(d.titleAr !== undefined && { titleAr: d.titleAr }),
        ...(d.summaryEn !== undefined && { summaryEn: d.summaryEn }),
        ...(d.summaryAr !== undefined && { summaryAr: d.summaryAr }),
        ...(d.descriptionEn !== undefined && { descriptionEn: d.descriptionEn || null }),
        ...(d.descriptionAr !== undefined && { descriptionAr: d.descriptionAr || null }),
        ...(d.clientName !== undefined && { clientName: d.clientName || null }),
        ...(d.locationEn !== undefined && { locationEn: d.locationEn || null }),
        ...(d.locationAr !== undefined && { locationAr: d.locationAr || null }),
        ...(d.year !== undefined && { year: d.year ?? null }),
        ...(d.coverImage !== undefined && { coverImage: d.coverImage }),
        ...(d.serviceId !== undefined && { serviceId: d.serviceId || null }),
        ...(d.isFeatured !== undefined && { isFeatured: !!d.isFeatured }),
        ...(d.isVisible !== undefined && { isVisible: !!d.isVisible }),
        ...(d.order !== undefined && { order: d.order ?? 0 }),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/projects PATCH]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, response } = await requireSession();
  if (!session) return response!;
  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/projects DELETE]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
