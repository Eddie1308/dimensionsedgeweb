import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { PartnerForm } from "../../_components/PartnerForm";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await withAdminDb(() =>
    prisma.partner.findUnique({ where: { id } }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Edit partner" backHref="/admin/partners" />
        <DbNotice error={result.error} />
      </>
    );
  }
  const partner = result.data;
  if (!partner) notFound();

  return (
    <>
      <AdminPageHeader title={`Edit · ${partner.nameEn}`} backHref="/admin/partners" />
      <PartnerForm
        initial={{
          id: partner.id,
          nameEn: partner.nameEn,
          nameAr: partner.nameAr,
          logoText: partner.logoText ?? "",
          logoUrl: partner.logoUrl ?? "",
          websiteUrl: partner.websiteUrl ?? "",
          isVisible: partner.isVisible,
          order: partner.order,
        }}
      />
    </>
  );
}
