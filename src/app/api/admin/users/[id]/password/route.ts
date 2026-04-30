import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { hashPassword } from "@/lib/auth/credentials";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const schema = z.object({ action: z.literal("reset") });

// POST — super user resets another user's password
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only super user can reset others' passwords
  const caller = await prisma.user.findUnique({ where: { id: session.sub }, select: { isSuperUser: true } });
  if (!caller?.isSuperUser) return NextResponse.json({ error: "Only super user can reset passwords" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true, email: true, isSuperUser: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);
  await prisma.user.update({ where: { id }, data: { passwordHash } });

  try {
    await sendPasswordResetEmail(user.email, user.name ?? user.email, tempPassword);
  } catch (e) {
    console.error("[password/reset] email failed:", e);
  }

  return NextResponse.json({ ok: true });
}
