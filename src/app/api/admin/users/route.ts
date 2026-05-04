import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { createCode } from "@/lib/verificationCode";
import { sendVerificationCode } from "@/lib/email";
import { isSameOrigin } from "@/lib/security/origin";
import { z } from "zod";

const initiateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  role: z.enum(["ADMIN", "EDITOR"]),
});

// GET — list all users
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: [{ isSuperUser: "desc" }, { createdAt: "asc" }],
    select: { id: true, name: true, email: true, role: true, isSuperUser: true, lastLoginAt: true, createdAt: true },
  });
  return NextResponse.json({ users });
}

// POST — initiate user creation (sends code to super user)
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = initiateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const { name, email, role } = parsed.data;

  // Check email not already in use
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }

  const payload = JSON.stringify({ name, email, role });
  const code = await createCode("CREATE_USER", payload);

  try {
    await sendVerificationCode("CREATE_USER", code, `Name: ${name} | Email: ${email} | Role: ${role}`);
  } catch (e) {
    console.error("[users] failed to send verification code:", e);
    return NextResponse.json({ error: "Failed to send verification code. Check email config." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Verification code sent to super user." });
}
