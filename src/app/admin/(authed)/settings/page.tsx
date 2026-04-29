import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const result = await withAdminDb(() =>
    prisma.siteSetting.findMany({ orderBy: [{ category: "asc" }, { key: "asc" }] }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Site settings" />
        <DbNotice error={result.error} />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Site settings"
        description="Logo, hero background, contact details, and other site-wide values."
      />
      <SettingsForm
        settings={result.data.map((s) => ({
          key: s.key,
          value: s.value,
          category: s.category,
        }))}
      />
    </>
  );
}
