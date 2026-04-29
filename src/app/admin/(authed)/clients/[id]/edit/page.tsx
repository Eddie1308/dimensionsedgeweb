import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { ClientForm } from "../../_components/ClientForm";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await withAdminDb(() =>
    prisma.client.findUnique({ where: { id } }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Edit client" backHref="/admin/clients" />
        <DbNotice error={result.error} />
      </>
    );
  }
  const client = result.data;
  if (!client) notFound();

  return (
    <>
      <AdminPageHeader title={`Edit · ${client.nameEn}`} backHref="/admin/clients" />
      <ClientForm
        initial={{
          id: client.id,
          nameEn: client.nameEn,
          nameAr: client.nameAr,
          logoUrl: client.logoUrl,
          industryEn: client.industryEn ?? "",
          industryAr: client.industryAr ?? "",
          isVisible: client.isVisible,
          order: client.order,
        }}
      />
    </>
  );
}
