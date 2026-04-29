// Custom JWT session for the admin area. Edge-compatible (uses jose, not jsonwebtoken)
// so the proxy/middleware can verify the cookie without spinning up Node.
//
// Phase 5 ships with env-based credentials so testing works without MySQL.
// Phase 6 will swap the verifyCredentials() call to look up User in Prisma.

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE_NAME = "de_admin_session";
const SESSION_TTL_HOURS = 8;

function getSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET;
  if (!raw || raw.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set it in .env (>= 32 chars).",
    );
  }
  return new TextEncoder().encode(raw);
}

export type AdminSession = {
  sub: string; // user id (or email for env-mode)
  email: string;
  role: "ADMIN" | "EDITOR";
};

export async function signSession(session: AdminSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("dimensions-edge")
    .setExpirationTime(`${SESSION_TTL_HOURS}h`)
    .sign(getSecret());
}

export async function verifySession(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: "dimensions-edge",
    });
    if (!isAdminSession(payload)) return null;
    return payload;
  } catch {
    return null;
  }
}

function isAdminSession(p: JWTPayload): p is JWTPayload & AdminSession {
  return (
    typeof p.sub === "string" &&
    typeof (p as Record<string, unknown>).email === "string" &&
    ((p as Record<string, unknown>).role === "ADMIN" ||
      (p as Record<string, unknown>).role === "EDITOR")
  );
}

export const SESSION_TTL_SECONDS = SESSION_TTL_HOURS * 60 * 60;
