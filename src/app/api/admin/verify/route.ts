import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { consumeCode } from "@/lib/verificationCode";
import { hashPassword } from "@/lib/auth/credentials";
import { sendWelcomeEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  code: z.string().length(6),
  action: z.enum(["CREATE_USER", "DELETE_USER"]),
});

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { code, action } = parsed.data;
  const result = await consumeCode(code, action);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (action === "CREATE_USER") {
    if (!result.payload) return NextResponse.json({ error: "Invalid code payload" }, { status: 400 });
    const { name, email, role } = JSON.parse(result.payload) as { name: string; email: string; role: "ADMIN" | "EDITOR" };

    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);

    const user = await prisma.user.create({
      data: { name, email, role, passwordHash, isSuperUser: false },
    });

    try {
      await sendWelcomeEmail(email, name, tempPassword);
    } catch (e) {
      console.error("[verify] failed to send welcome email:", e);
    }

    return NextResponse.json({ ok: true, userId: user.id });
  }

  if (action === "DELETE_USER") {
    if (!result.targetUserId) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: result.targetUserId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.isSuperUser) return NextResponse.json({ error: "Cannot delete super user" }, { status: 403 });

    await prisma.user.delete({ where: { id: result.targetUserId } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
