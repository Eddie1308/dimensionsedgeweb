import { type Partner } from "@/data/partners";

const USE_DB = true;

function rowToPartner(row: {
  nameEn: string;
  nameAr: string;
  logoText: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  order: number;
  isVisible: boolean;
}): Partner {
  return {
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    logoText: row.logoText ?? row.nameEn.slice(0, 4).toUpperCase(),
    logoUrl: row.logoUrl ?? undefined,
    websiteUrl: row.websiteUrl ?? undefined,
    order: row.order,
    isVisible: row.isVisible,
  };
}

export async function getVisiblePartners(): Promise<Partner[]> {
  if (!USE_DB) {
    const { partners: mockPartners } = await import("@/data/partners");
    return mockPartners.filter((p) => p.isVisible).sort((a, b) => a.order - b.order);
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.partner.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });
  return rows.map(rowToPartner);
}
