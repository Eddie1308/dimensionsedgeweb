// One-off script: populates ServiceBrand from the brand lists that used to be
// hardcoded in src/data/services.ts (removed once ServiceBrand became the
// source of truth). Safe to re-run — skips any service that already has
// brand rows, so it won't create duplicates.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const url = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
});
const prisma = new PrismaClient({ adapter });

const brandsBySlug: Record<string, string[]> = {
  networking: ["Cisco", "Aruba", "Commscope", "Panduit", "Fluke Networks"],
  "audio-visual": ["itc", "Bosch", "Crestron", "Extron", "Samsung", "LG"],
  cctv: ["Hikvision", "Milestone", "Genetec"],
  "access-control": ["HID", "Suprema", "Hikvision", "ZKTeco"],
  "pa-system": ["Bosch", "TOA", "itc", "Ateis"],
  "fire-alarm": ["Notifier", "Honeywell", "Edwards", "Siemens"],
  "building-automation": ["Siemens", "Schneider Electric", "Honeywell", "Tridium"],
};

async function main() {
  for (const [slug, brands] of Object.entries(brandsBySlug)) {
    const service = await prisma.service.findUnique({ where: { slug } });
    if (!service) {
      console.log(`Skipping ${slug} — no matching Service row.`);
      continue;
    }
    const existing = await prisma.serviceBrand.count({ where: { serviceId: service.id } });
    if (existing > 0) {
      console.log(`Skipping ${slug} — already has ${existing} brand(s).`);
      continue;
    }
    await prisma.serviceBrand.createMany({
      data: brands.map((name, i) => ({ serviceId: service.id, name, order: i })),
    });
    console.log(`Seeded ${brands.length} brand(s) for ${slug}.`);
  }
  console.log("Backfill complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
