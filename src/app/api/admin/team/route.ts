import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { isSameOrigin } from "@/lib/security/origin";
import { z } from "zod";

const teamMemberSchema = z.object({
  nameEn: z.string().trim().min(1).max(120),
  nameAr: z.string().trim().min(1).max(120),
  titleEn: z.string().trim().min(1).max(200),
  titleAr: z.string().trim().min(1).max(200),
  department: z.string().trim().max(100).optional().or(z.literal("")),
  photoUrl: z.string().trim().max(500).optional().or(z.literal("")),
  summaryEn: z.string().trim().max(500).optional().or(z.literal("")),
  summaryAr: z.string().trim().max(500).optional().or(z.literal("")),
  bioEn: z.string().trim().optional().or(z.literal("")),
  bioAr: z.string().trim().optional().or(z.literal("")),
  order: z.coerce.number().int().optional().default(0),
  isVisible: z.coerce.boolean().optional().default(true),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const members = await prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = teamMemberSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });

  const d = parsed.data;
  const created = await prisma.teamMember.create({
    data: {
      nameEn: d.nameEn, nameAr: d.nameAr,
      titleEn: d.titleEn, titleAr: d.titleAr,
      department: d.department || null,
      photoUrl: d.photoUrl || null,
      summaryEn: d.summaryEn || "",
      summaryAr: d.summaryAr || "",
      bioEn: d.bioEn || null,
      bioAr: d.bioAr || null,
      order: d.order ?? 0,
      isVisible: !!d.isVisible,
    },
  });
  return NextResponse.json({ ok: true, id: created.id });
}
