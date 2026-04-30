import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { projectSchema } from "@/lib/validators/admin";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const data = parsed.data;
    const created = await prisma.project.create({
      data: {
        slug: data.slug,
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        summaryEn: data.summaryEn,
        summaryAr: data.summaryAr,
        descriptionEn: data.descriptionEn || null,
        descriptionAr: data.descriptionAr || null,
        clientName: data.clientName || null,
        locationEn: data.locationEn || null,
        locationAr: data.locationAr || null,
        year: data.year ?? null,
        coverImage: data.coverImage || "",
        serviceId: data.serviceId || null,
        isFeatured: !!data.isFeatured,
        isVisible: !!data.isVisible,
        order: data.order ?? 0,
      },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
