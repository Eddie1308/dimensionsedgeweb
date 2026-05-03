import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { TeamMemberForm } from "../../_components/TeamMemberForm";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await withAdminDb(() => prisma.teamMember.findUnique({ where: { id } }));

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Edit team member" backHref="/admin/team" />
        <DbNotice error={result.error} />
      </>
    );
  }
  const m = result.data;
  if (!m) notFound();

  return (
    <>
      <AdminPageHeader title={`Edit · ${m.nameEn}`} backHref="/admin/team" />
      <TeamMemberForm
        initial={{
          id: m.id, nameEn: m.nameEn, nameAr: m.nameAr,
          titleEn: m.titleEn, titleAr: m.titleAr,
          department: m.department ?? "", photoUrl: m.photoUrl ?? "",
          summaryEn: m.summaryEn, summaryAr: m.summaryAr,
          bioEn: m.bioEn ?? "", bioAr: m.bioAr ?? "",
          order: m.order, isVisible: m.isVisible,
        }}
      />
    </>
  );
}
