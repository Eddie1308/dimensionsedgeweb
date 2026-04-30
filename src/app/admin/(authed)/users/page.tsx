import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { UsersClient } from "./UsersClient";

export default async function AdminUsersPage() {
  const result = await withAdminDb(async () => {
    const users = await prisma.user.findMany({
      orderBy: [{ isSuperUser: "desc" }, { createdAt: "asc" }],
      select: { id: true, name: true, email: true, role: true, isSuperUser: true, lastLoginAt: true, createdAt: true },
    });
    return users.map((u) => ({
      ...u,
      lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      createdAt: u.createdAt.toISOString(),
    }));
  });

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Users" />
        <DbNotice error={result.error} />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="Manage admin panel access. Super user cannot be deleted."
      />
      <UsersClient users={result.data} />
    </>
  );
}
