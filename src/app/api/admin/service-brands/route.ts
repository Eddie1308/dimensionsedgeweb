import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { serviceBrandSchema } from "@/lib/validators/admin";
import { isSameOrigin } from "@/lib/security/origin";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = serviceBrandSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const d = parsed.data;
    const created = await prisma.serviceBrand.create({
      data: { serviceId: d.serviceId, name: d.name, order: d.order ?? 0 },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    console.error("[admin/service-brands POST]", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
