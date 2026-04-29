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

  return intlMiddleware(request);
}

export const config = {
  // Run on every path except API, Next internals, and static assets.
  // Admin paths still match here — proxy() above branches on them.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
