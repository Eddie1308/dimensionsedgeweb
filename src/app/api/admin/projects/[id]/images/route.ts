import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { z } from "zod";

const addImageSchema = z.object({
  url: z.string().min(1),
  altEn: z.string().optional(),
  altAr: z.string().optional(),
  order: z.number().int().optional().default(0),
});

const deleteImageSchema = z.object({
  imageId: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = addImageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  try {
    const image = await prisma.projectImage.create({
      data: {
        projectId: id,
        url: parsed.data.url,
        altEn: parsed.data.altEn || null,
        altAr: parsed.data.altAr || null,
        order: parsed.data.order ?? 0,
      },
    });
    return NextResponse.json({ ok: true, id: image.id });
  } catch (e) {
    console.error("[admin/projects/images POST]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await params;
  const body = await request.json().catch(() => null);
  const parsed = deleteImageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  try {
    await prisma.projectImage.delete({ where: { id: parsed.data.imageId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/projects/images DELETE]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
