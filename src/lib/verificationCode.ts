import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

export function generateCode(): string {
  // Cryptographically secure 6-digit code (100000-999999).
  return String(crypto.randomInt(100000, 1000000));
}

// Tracks failed attempts per (action) — once we hit MAX_ATTEMPTS, all codes
// for that action are invalidated to stop brute force. Resets when a code
// is successfully consumed or via the cleanup interval.
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
type AttemptRecord = { count: number; resetAt: number };
const attempts = new Map<string, AttemptRecord>();

function recordFailure(action: string): boolean {
  const now = Date.now();
  const rec = attempts.get(action);
  if (!rec || rec.resetAt < now) {
    attempts.set(action, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return true;
  }
  rec.count++;
  return rec.count <= MAX_ATTEMPTS;
}

function clearAttempts(action: string) {
  attempts.delete(action);
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
  if (!record) {
    const stillAllowed = recordFailure(action);
    if (!stillAllowed) {
      return { ok: false, error: "Too many failed attempts. Request a new code." };
    }
    return { ok: false, error: "Invalid verification code." };
  }
  if (record.expiresAt < new Date()) {
    return { ok: false, error: "Verification code has expired." };
  }
  await prisma.verificationCode.update({ where: { id: record.id }, data: { usedAt: new Date() } });
  clearAttempts(action);
  return { ok: true, payload: record.payload, targetUserId: record.targetUserId };
}
