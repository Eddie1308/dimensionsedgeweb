import { type Project, type ProjectImage } from "@/data/projects";

const USE_DB = true;

type DbProject = {
  slug: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  clientName: string | null;
  locationEn: string | null;
  locationAr: string | null;
  year: number | null;
  coverImage: string;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
  service: { slug: string } | null;
  images: { url: string; altEn: string | null; altAr: string | null; order: number }[];
};

function rowToProject(row: DbProject): Project {
  return {
    slug: row.slug,
    titleEn: row.titleEn,
    titleAr: row.titleAr,
    summaryEn: row.summaryEn,
    summaryAr: row.summaryAr,
    descriptionEn: row.descriptionEn ?? "",
    descriptionAr: row.descriptionAr ?? "",
    clientName: row.clientName ?? "",
    locationEn: row.locationEn ?? "",
    locationAr: row.locationAr ?? "",
    year: row.year ?? new Date().getFullYear(),
    coverImage: row.coverImage,
    serviceSlug: (row.service?.slug ?? "networking") as Project["serviceSlug"],
    isFeatured: row.isFeatured,
    isVisible: row.isVisible,
    order: row.order,
    images: row.images.map(
      (img): ProjectImage => ({ url: img.url, altEn: img.altEn ?? undefined, altAr: img.altAr ?? undefined }),
    ),
  };
}

const projectInclude = {
  service: { select: { slug: true } },
  images: { orderBy: { order: "asc" as const } },
};

export async function getVisibleProjects(): Promise<Project[]> {
  if (!USE_DB) {
    const { projects: mockProjects } = await import("@/data/projects");
    return mockProjects.filter((p) => p.isVisible).sort((a, b) => a.order - b.order);
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.project.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
    include: projectInclude,
  });
  return rows.map(rowToProject);
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  if (!USE_DB) {
    const { projects: mockProjects } = await import("@/data/projects");
    return mockProjects
      .filter((p) => p.isVisible && p.isFeatured)
      .sort((a, b) => a.order - b.order)
      .slice(0, limit);
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.project.findMany({
    where: { isVisible: true, isFeatured: true },
    orderBy: { order: "asc" },
    take: limit,
    include: projectInclude,
  });
  return rows.map(rowToProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!USE_DB) {
    const { projects: mockProjects } = await import("@/data/projects");
    const project = mockProjects.find((p) => p.slug === slug);
    if (!project || !project.isVisible) return null;
    return project;
  }
  const { prisma } = await import("@/lib/prisma");
  const row = await prisma.project.findUnique({
    where: { slug },
    include: projectInclude,
  });
  if (!row || !row.isVisible) return null;
  return rowToProject(row);
}

export async function getVisibleProjectSlugs(): Promise<string[]> {
  const visible = await getVisibleProjects();
  return visible.map((p) => p.slug);
}
