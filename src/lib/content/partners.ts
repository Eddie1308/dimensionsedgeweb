import { partners as mockPartners, type Partner } from "@/data/partners";

const USE_DB = false;

export async function getVisiblePartners(): Promise<Partner[]> {
  if (!USE_DB) {
    return mockPartners
      .filter((p) => p.isVisible)
      .sort((a, b) => a.order - b.order);
  }
  // Prisma equivalent:
  //   const { prisma } = await import("@/lib/prisma");
  //   return prisma.partner.findMany({
  //     where: { isVisible: true },
  //     orderBy: { order: "asc" },
  //   });
  return [];
}
