import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { AdminSession } from "./session";

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  try {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return { sub: user.id, email: user.email, role: user.role };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
