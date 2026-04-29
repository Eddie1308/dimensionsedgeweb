import { NextResponse } from "next/server";
import { z } from "zod";
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  signSession,
} from "@/lib/auth/session";
import { verifyCredentials } from "@/lib/auth/credentials";

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 400 },
    );
  }

  const session = await verifyCredentials(
    parsed.data.email,
    parsed.data.password,
  );
  if (!session) {
    // Generic message — do not leak whether email or password is wrong.
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  }

  const token = await signSession(session);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
