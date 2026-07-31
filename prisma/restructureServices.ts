// One-off migration: restructures the 7-service catalogue into the real
// 6-service structure (see conversation/commit history for the "why" —
// fire-alarm and building-automation were never real services, PA folds
// into Audio Visual, CCTV+Access Control merge, Cabling splits out of
// Networking, and ERPNext/Cybersecurity are brand new).
//
// Safe to re-run: every step is idempotent (upserts, guarded deletes,
// delete-then-recreate for brand lists).
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

const finalServices = [
  {
    slug: "networking",
    titleEn: "ICT & Networking",
    titleAr: "الشبكات وتقنية المعلومات",
    summaryEn:
      "Enterprise WiFi, network design, and server sourcing that keeps every other system in the building talking to each other.",
    summaryAr:
      "شبكات WiFi للمؤسسات وتصميم شبكات وتوريد خوادم يُبقي جميع الأنظمة في المبنى مترابطة.",
    iconKey: "network",
    order: 1,
  },
  {
    slug: "cabling",
    titleEn: "Structured Cabling",
    titleAr: "الكابلات المنظمة",
    summaryEn:
      "A high-performing network starts with a solid foundation — precision structured cabling built for efficiency and long-term scalability.",
    summaryAr:
      "الشبكة عالية الأداء تبدأ بأساس متين — كابلات منظمة بدقة عالية لضمان الكفاءة وقابلية التوسّع طويلة الأمد.",
    iconKey: "cable",
    order: 2,
  },
  {
    slug: "audio-visual",
    titleEn: "Audio Visual",
    titleAr: "أنظمة الصوت والصورة",
    summaryEn:
      "Transform the way your business communicates — boardrooms, auditoriums, digital signage, and classrooms engineered for performance and reliability.",
    summaryAr:
      "غيّروا طريقة تواصل أعمالكم — قاعات اجتماعات وقاعات كبرى ولافتات رقمية وفصول دراسية مصمّمة للأداء والموثوقية.",
    iconKey: "speaker",
    order: 3,
  },
  {
    slug: "erpnext",
    titleEn: "ERP Implementation",
    titleAr: "تطبيق ERP",
    summaryEn:
      "Technology should simplify business, not complicate it — we implement ERPNext for companies, restaurants, logistics, schools, and factories, tailored to how you actually work.",
    summaryAr:
      "التقنية يجب أن تُبسّط الأعمال لا أن تُعقّدها — نُطبّق ERPNext للشركات والمطاعم والخدمات اللوجستية والمدارس والمصانع، بما يتناسب مع طريقة عملكم الفعلية.",
    iconKey: "workflow",
    order: 4,
  },
  {
    slug: "cybersecurity",
    titleEn: "Cybersecurity",
    titleAr: "الأمن السيبراني",
    summaryEn:
      "Security is a business necessity, not an afterthought — protection built around your actual risk profile.",
    summaryAr:
      "الأمن ضرورة للأعمال لا رفاهية إضافية — حماية مبنية على مستوى المخاطر الفعلي لديكم.",
    iconKey: "shield",
    order: 5,
  },
  {
    slug: "cctv",
    titleEn: "CCTV & Access Control",
    titleAr: "المراقبة والتحكم بالدخول",
    summaryEn:
      "Security goes beyond surveillance — intelligent CCTV and access control ecosystems working together, not bolted on separately.",
    summaryAr:
      "الأمن لا يقتصر على المراقبة — أنظمة مراقبة وتحكم بالدخول ذكية تعمل معاً بدلاً من كونها أنظمة منفصلة.",
    iconKey: "camera",
    order: 6,
  },
];

const brandsBySlug: Record<string, string[]> = {
  networking: ["Cisco", "Aruba"],
  cabling: ["Commscope", "Panduit", "Fluke Networks"],
  "audio-visual": ["itc", "Samsung", "Hikvision", "Yealink", "Bosch", "Crestron", "Extron", "LG"],
  cctv: ["Hikvision", "Milestone", "Genetec", "HID", "Suprema", "ZKTeco"],
  // erpnext / cybersecurity: no confirmed brands yet — add via /admin/services.
};

const obsoleteSlugs = ["access-control", "fire-alarm", "building-automation", "pa-system"];

async function main() {
  // 1. Upsert the 6 final Service rows (creates cabling/erpnext/cybersecurity,
  // updates titles on networking/cctv).
  for (const s of finalServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  const bySlug = async (slug: string) => prisma.service.findUnique({ where: { slug } });
  const [accessControl, fireAlarm, buildingAutomation, paSystem, cctv, audioVisual] =
    await Promise.all([
      bySlug("access-control"),
      bySlug("fire-alarm"),
      bySlug("building-automation"),
      bySlug("pa-system"),
      bySlug("cctv"),
      bySlug("audio-visual"),
    ]);

  // 2. Reassign projects off the services about to be removed.
  if (accessControl && cctv) {
    const { count } = await prisma.project.updateMany({
      where: { serviceId: accessControl.id },
      data: { serviceId: cctv.id },
    });
    console.log(`Reassigned ${count} project(s) from access-control -> cctv.`);
  }
  if (paSystem && audioVisual) {
    const { count } = await prisma.project.updateMany({
      where: { serviceId: paSystem.id },
      data: { serviceId: audioVisual.id },
    });
    console.log(`Reassigned ${count} project(s) from pa-system -> audio-visual.`);
  }
  if (fireAlarm) {
    const { count } = await prisma.project.updateMany({
      where: { serviceId: fireAlarm.id },
      data: { serviceId: null },
    });
    console.log(`Unassigned ${count} project(s) from fire-alarm.`);
  }
  if (buildingAutomation) {
    const { count } = await prisma.project.updateMany({
      where: { serviceId: buildingAutomation.id },
      data: { serviceId: null },
    });
    console.log(`Unassigned ${count} project(s) from building-automation.`);
  }

  // 3. Delete the obsolete Service rows (cascades their ServiceBrand rows).
  for (const slug of obsoleteSlugs) {
    const result = await prisma.service.deleteMany({ where: { slug } });
    if (result.count > 0) console.log(`Deleted obsolete service: ${slug}`);
  }

  // 4. Replace ServiceBrand rows for the 6 final services with the correct
  // list (delete-then-recreate so this is safe to run more than once).
  for (const [slug, brands] of Object.entries(brandsBySlug)) {
    const service = await bySlug(slug);
    if (!service) continue;
    await prisma.serviceBrand.deleteMany({ where: { serviceId: service.id } });
    await prisma.serviceBrand.createMany({
      data: brands.map((name, i) => ({ serviceId: service.id, name, order: i })),
    });
    console.log(`Set ${brands.length} brand(s) for ${slug}.`);
  }

  console.log("Service restructure complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
