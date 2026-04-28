import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on every path except static assets, API, admin, and Next internals.
  // Admin routes are NOT locale-prefixed; they get their own auth middleware
  // wired up in Phase 5.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
