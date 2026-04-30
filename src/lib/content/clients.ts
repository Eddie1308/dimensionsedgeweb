import { type Client } from "@/data/clients";

const USE_DB = true;

function rowToClient(row: {
  nameEn: string;
  nameAr: string;
  logoText: string | null;
  logoUrl: string | null;
  industryEn: string | null;
  industryAr: string | null;
  order: number;
  isVisible: boolean;
}): Client {
  return {
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    logoText: row.logoText ?? row.nameEn.slice(0, 4).toUpperCase(),
    industryEn: row.industryEn ?? undefined,
    industryAr: row.industryAr ?? undefined,
    order: row.order,
    isVisible: row.isVisible,
  };
}

export async function getVisibleClients(): Promise<Client[]> {
  if (!USE_DB) {
    const { clients: mockClients } = await import("@/data/clients");
    return mockClients.filter((c) => c.isVisible).sort((a, b) => a.order - b.order);
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.client.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });
  return rows.map(rowToClient);
}
