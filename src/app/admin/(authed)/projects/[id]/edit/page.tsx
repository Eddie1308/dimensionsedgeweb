import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { ProjectForm } from "../../_components/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await withAdminDb(async () => {
    const [project, services] = await Promise.all([
      prisma.project.findUnique({
        where: { id },
        include: { images: { orderBy: { order: "asc" } } },
      }),
      prisma.service.findMany({
        orderBy: { order: "asc" },
        select: { id: true, titleEn: true },
      }),
    ]);
    return { project, services };
  });

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Edit project" backHref="/admin/projects" />
        <DbNotice error={result.error} />
      </>
    );
  }

  const { project, services } = result.data;
  if (!project) notFound();

  const initial = {
    id: project.id,
    slug: project.slug,
    titleEn: project.titleEn,
    titleAr: project.titleAr,
    summaryEn: project.summaryEn,
    summaryAr: project.summaryAr,
    descriptionEn: project.descriptionEn ?? "",
    descriptionAr: project.descriptionAr ?? "",
    clientName: project.clientName ?? "",
    locationEn: project.locationEn ?? "",
    locationAr: project.locationAr ?? "",
    year: project.year,
    coverImage: project.coverImage,
    serviceId: project.serviceId ?? "",
    isFeatured: project.isFeatured,
    isVisible: project.isVisible,
    order: project.order,
  };

  return (
    <>
      <AdminPageHeader title={`Edit · ${project.titleEn}`} backHref="/admin/projects" />
      <ProjectForm
        initial={initial}
        services={services}
        initialGallery={project.images.map((img) => ({
          id: img.id,
          url: img.url,
          altEn: img.altEn,
          altAr: img.altAr,
          order: img.order,
        }))}
      />
    </>
  );
}
