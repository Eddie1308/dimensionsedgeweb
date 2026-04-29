// Credential verification.
//
// Phase 5: env-based admin (works without MySQL). The user logs in with
// SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD from .env.
//
// Phase 6 swap: replace the body of verifyCredentials() with a Prisma lookup
// against the User model and compare passwordHash with bcrypt.compare().

import bcrypt from "bcryptjs";
import type { AdminSession } from "./session";

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  // Phase 5 (env mode)
  const expectedEmail = process.env.SEED_ADMIN_EMAIL;
  const expectedPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) return null;
  if (email.trim().toLowerCase() !== expectedEmail.toLowerCase()) return null;
  if (password !== expectedPassword) return null;
  return {
    sub: `env:${expectedEmail}`,
    email: expectedEmail,
    role: "ADMIN",
  };

  // Phase 6 swap target — Prisma User lookup:
  //   const { prisma } = await import("@/lib/prisma");
  //   const user = await prisma.user.findUnique({ where: { email } });
  //   if (!user) return null;
  //   const ok = await bcrypt.compare(password, user.passwordHash);
  //   if (!ok) return null;
  //   await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  //   return { sub: user.id, email: user.email, role: user.role };
}

// Shared helper — Phase 6 will use it server-side too.
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
