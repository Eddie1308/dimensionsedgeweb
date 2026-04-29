import { clients as mockClients, type Client } from "@/data/clients";

const USE_DB = false;

export async function getVisibleClients(): Promise<Client[]> {
  if (!USE_DB) {
    return mockClients
      .filter((c) => c.isVisible)
      .sort((a, b) => a.order - b.order);
  }
  // Prisma equivalent:
  //   const { prisma } = await import("@/lib/prisma");
  //   return prisma.client.findMany({
  //     where: { isVisible: true },
  //     orderBy: { order: "asc" },
  //   });
  return [];
}
