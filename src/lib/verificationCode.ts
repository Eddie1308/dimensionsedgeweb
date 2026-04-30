import { prisma } from "@/lib/prisma";

export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createCode(
  action: "CREATE_USER" | "DELETE_USER",
  payload?: string,
  targetUserId?: string,
) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await prisma.verificationCode.create({
    data: { code, action, payload: payload ?? null, targetUserId: targetUserId ?? null, expiresAt },
  });
  return code;
}

export async function consumeCode(
  code: string,
  action: "CREATE_USER" | "DELETE_USER",
): Promise<{ ok: true; payload?: string | null; targetUserId?: string | null } | { ok: false; error: string }> {
  const record = await prisma.verificationCode.findFirst({
    where: { code, action, usedAt: null },
  });
  if (!record) return { ok: false, error: "Invalid verification code." };
  if (record.expiresAt < new Date()) return { ok: false, error: "Verification code has expired." };
  await prisma.verificationCode.update({ where: { id: record.id }, data: { usedAt: new Date() } });
  return { ok: true, payload: record.payload, targetUserId: record.targetUserId };
}
