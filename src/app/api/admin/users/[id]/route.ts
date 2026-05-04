import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/server";
import { createCode } from "@/lib/verificationCode";
import { sendVerificationCode } from "@/lib/email";
import { isSameOrigin } from "@/lib/security/origin";

// POST to /api/admin/users/[id] — initiate delete (sends code to super user)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true, email: true, isSuperUser: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.isSuperUser) return NextResponse.json({ error: "Cannot delete super user" }, { status: 403 });

  const code = await createCode("DELETE_USER", undefined, id);

  try {
    await sendVerificationCode("DELETE_USER", code, `Name: ${user.name ?? "—"} | Email: ${user.email}`);
  } catch (e) {
    console.error("[users/delete] failed to send code:", e);
    return NextResponse.json({ error: "Failed to send verification code." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Verification code sent to super user." });
}
