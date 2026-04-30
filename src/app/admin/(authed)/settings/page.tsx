import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { SettingsForm } from "./SettingsForm";

const DEFAULT_SETTINGS = [
  { key: "email", value: "info@dimensionsedgeest.com", category: "contact" },
  { key: "phone", value: "+966 11 000 0000", category: "contact" },
  { key: "address", value: "Riyadh, Saudi Arabia", category: "contact" },
  { key: "addressAr", value: "الرياض، المملكة العربية السعودية", category: "contact" },
];

export default async function AdminSettingsPage() {
  const result = await withAdminDb(async () => {
    const existing = await prisma.siteSetting.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });
    // Seed defaults for any keys that don't exist yet
    if (existing.length === 0) {
      await prisma.siteSetting.createMany({ data: DEFAULT_SETTINGS });
      return prisma.siteSetting.findMany({
        orderBy: [{ category: "asc" }, { key: "asc" }],
      });
    }
    // Add any missing default keys
    const existingKeys = new Set(existing.map((s) => s.key));
    const missing = DEFAULT_SETTINGS.filter((d) => !existingKeys.has(d.key));
    if (missing.length > 0) {
      await prisma.siteSetting.createMany({ data: missing });
      return prisma.siteSetting.findMany({
        orderBy: [{ category: "asc" }, { key: "asc" }],
      });
    }
    return existing;
  });

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
        description="Contact details and other site-wide values shown in the footer and contact page."
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
