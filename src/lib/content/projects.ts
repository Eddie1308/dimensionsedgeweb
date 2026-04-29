// Content adapter for Projects.
//
// Phase 4 ships with USE_DB=false so the public site works against the static
// mock catalogue (src/data/projects.ts) without MySQL provisioned.
// Once the DB is live (USER CRITICAL todo: aaPanel setup + migrate + seed):
//   1) Flip USE_DB to true
//   2) Add real projects via the admin UI (Phase 6) or seed
//   3) Toggle isVisible per project
// All consumer pages (server components) call these functions; nothing else
// changes.

import {
  projects as mockProjects,
  type Project,
} from "@/data/projects";

const USE_DB = false;

export async function getVisibleProjects(): Promise<Project[]> {
  if (!USE_DB) {
    return mockProjects
      .filter((p) => p.isVisible)
      .sort((a, b) => a.order - b.order);
  }
  // Phase-4-swap target — Prisma equivalent (kept inert until USE_DB=true):
  //   const { prisma } = await import("@/lib/prisma");
  //   const rows = await prisma.project.findMany({
  //     where: { isVisible: true },
  //     orderBy: { order: "asc" },
  //     include: { images: { orderBy: { order: "asc" } } },
  //   });
  //   return rows.map(rowToProject);
  return [];
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  const visible = await getVisibleProjects();
  return visible.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!USE_DB) {
    const project = mockProjects.find((p) => p.slug === slug);
    if (!project || !project.isVisible) return null;
    return project;
  }
  // Prisma equivalent:
  //   const row = await prisma.project.findUnique({
  //     where: { slug },
  //     include: { images: { orderBy: { order: "asc" } } },
  //   });
  //   if (!row || !row.isVisible) return null;
  //   return rowToProject(row);
  return null;
}

export async function getVisibleProjectSlugs(): Promise<string[]> {
  const visible = await getVisibleProjects();
  return visible.map((p) => p.slug);
}
