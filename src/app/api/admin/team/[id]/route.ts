import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { z } from "zod";

const patchSchema = z.object({
  nameEn: z.string().trim().min(1).max(120).optional(),
  nameAr: z.string().trim().min(1).max(120).optional(),
  titleEn: z.string().trim().min(1).max(200).optional(),
  titleAr: z.string().trim().min(1).max(200).optional(),
  department: z.string().trim().max(100).optional().or(z.literal("")),
  photoUrl: z.string().trim().max(500).optional().or(z.literal("")),
  summaryEn: z.string().trim().max(500).optional().or(z.literal("")),
  summaryAr: z.string().trim().max(500).optional().or(z.literal("")),
  bioEn: z.string().trim().optional().or(z.literal("")),
  bioAr: z.string().trim().optional().or(z.literal("")),
  order: z.coerce.number().int().optional(),
  isVisible: z.coerce.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const d = parsed.data;
  await prisma.teamMember.update({
    where: { id },
    data: {
      ...(d.nameEn !== undefined && { nameEn: d.nameEn }),
      ...(d.nameAr !== undefined && { nameAr: d.nameAr }),
      ...(d.titleEn !== undefined && { titleEn: d.titleEn }),
      ...(d.titleAr !== undefined && { titleAr: d.titleAr }),
      ...(d.department !== undefined && { department: d.department || null }),
      ...(d.photoUrl !== undefined && { photoUrl: d.photoUrl || null }),
      ...(d.summaryEn !== undefined && { summaryEn: d.summaryEn }),
      ...(d.summaryAr !== undefined && { summaryAr: d.summaryAr }),
      ...(d.bioEn !== undefined && { bioEn: d.bioEn || null }),
      ...(d.bioAr !== undefined && { bioAr: d.bioAr || null }),
      ...(d.order !== undefined && { order: d.order }),
      ...(d.isVisible !== undefined && { isVisible: !!d.isVisible }),
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
