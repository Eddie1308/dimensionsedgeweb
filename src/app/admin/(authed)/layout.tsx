import { requireAdminSession } from "@/lib/auth/server";
import { AdminShell } from "../_components/AdminShell";

// Wraps every authenticated admin page with the persistent shell (sidebar + topbar).
// requireAdminSession() redirects to /admin/login if the cookie is missing/invalid;
// the proxy already does this redirect, but this is defense in depth.
export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();
  return <AdminShell session={session}>{children}</AdminShell>;
}
