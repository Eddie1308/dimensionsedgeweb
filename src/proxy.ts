import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE_NAME, verifySession } from "./lib/auth/session";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

async function adminGuard(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);

  // Already logged in and visiting login → bounce to dashboard.
  if (isPublic && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Protected admin path without a valid session → redirect to login.
  if (!isPublic && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return adminGuard(request);
  }

  // Strip any inbound x-pathname so a client cannot smuggle a value to bypass
  // the maintenance redirect (which reads this header in the locale layout).
  // Then set our own trusted value before downstream rendering.
  request.headers.delete("x-pathname");
  request.headers.set("x-pathname", pathname);

  const response = intlMiddleware(request);
  // Defense in depth: also remove from the outgoing response headers so the
  // value never reaches the browser as a leak.
  response.headers.delete("x-pathname");
  return response;
}

export const config = {
  // Run on every path except API, Next internals, and static assets.
  // Admin paths still match here — proxy() above branches on them.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
