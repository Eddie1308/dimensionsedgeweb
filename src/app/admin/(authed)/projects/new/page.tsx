import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { ProjectForm } from "../_components/ProjectForm";

const empty = {
  slug: "",
  titleEn: "",
  titleAr: "",
  summaryEn: "",
  summaryAr: "",
  descriptionEn: "",
  descriptionAr: "",
  clientName: "",
  locationEn: "",
  locationAr: "",
  year: null,
  coverImage: "",
  serviceId: "",
  isFeatured: false,
  isVisible: false,
  order: 0,
};

export default async function NewProjectPage() {
  const result = await withAdminDb(() =>
    prisma.service.findMany({
      orderBy: { order: "asc" },
      select: { id: true, titleEn: true },
    }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="New project" backHref="/admin/projects" />
        <DbNotice error={result.error} />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader title="New project" backHref="/admin/projects" />
      <ProjectForm initial={empty} services={result.data} />
    </>
  );
}
