import { prisma } from "@/lib/prisma";

export async function getServiceBrandNames(slug: string): Promise<string[]> {
  const rows = await prisma.serviceBrand.findMany({
    where: { service: { slug } },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => r.name);
}
