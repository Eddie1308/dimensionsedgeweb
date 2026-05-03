import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

export type TeamMember = {
  id: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  department: string | null;
  photoUrl: string | null;
  summaryEn: string;
  summaryAr: string;
  bioEn: string | null;
  bioAr: string | null;
  order: number;
};

export async function getVisibleTeamMembers(): Promise<TeamMember[]> {
  noStore();
  try {
    const rows = await prisma.teamMember.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      select: {
        id: true, nameEn: true, nameAr: true, titleEn: true, titleAr: true,
        department: true, photoUrl: true, summaryEn: true, summaryAr: true,
        bioEn: true, bioAr: true, order: true,
      },
    });
    return rows;
  } catch {
    return [];
  }
}
