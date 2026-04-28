import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const url = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
});
const prisma = new PrismaClient({ adapter });

const services = [
  {
    slug: "networking",
    titleEn: "Networking & Structured Cabling",
    titleAr: "الشبكات والكابلات المنظمة",
    summaryEn:
      "Cat6/Cat6A/Fiber backbones, enterprise WiFi, and certified structured cabling for offices, hospitals, and campuses.",
    summaryAr:
      "شبكات Cat6 و Cat6A والألياف البصرية وشبكات WiFi للمؤسسات وكابلات منظمة معتمدة للمكاتب والمستشفيات والمجمعات.",
    iconKey: "network",
    order: 1,
  },
  {
    slug: "audio-visual",
    titleEn: "Audio-Visual Systems",
    titleAr: "أنظمة الصوت والصورة",
    summaryEn:
      "Conference rooms, auditoriums, and digital signage powered by itc — discussion systems, line arrays, and control.",
    summaryAr:
      "قاعات المؤتمرات والقاعات الكبرى واللافتات الرقمية بدعم من itc — أنظمة المناقشة ومكبرات الصوت ووحدات التحكم.",
    iconKey: "speaker",
    order: 2,
  },
  {
    slug: "cctv",
    titleEn: "CCTV & Video Surveillance",
    titleAr: "كاميرات المراقبة",
    summaryEn:
      "Hikvision IP camera systems, NVR/VMS deployments, and AI-driven analytics for perimeter and indoor security.",
    summaryAr:
      "أنظمة كاميرات Hikvision IP وحلول NVR/VMS وتحليلات الذكاء الاصطناعي للأمان الداخلي والمحيطي.",
    iconKey: "camera",
    order: 3,
  },
  {
    slug: "access-control",
    titleEn: "Access Control",
    titleAr: "أنظمة التحكم بالدخول",
    summaryEn:
      "Card, biometric, and mobile-credential access systems integrated with HR, visitor management, and time attendance.",
    summaryAr:
      "أنظمة الدخول بالبطاقات والبصمة والهوية المحمولة المتكاملة مع الموارد البشرية وإدارة الزوار والحضور.",
    iconKey: "lock",
    order: 4,
  },
  {
    slug: "pa-system",
    titleEn: "Public Address Systems",
    titleAr: "أنظمة النداء العام",
    summaryEn:
      "EN54-certified voice evacuation, background music, and zoned PA for malls, mosques, and industrial sites.",
    summaryAr:
      "أنظمة الإخلاء الصوتي المعتمدة EN54 والموسيقى الخلفية والنداء العام المقسم للمولات والمساجد والمواقع الصناعية.",
    iconKey: "megaphone",
    order: 5,
  },
  {
    slug: "fire-alarm",
    titleEn: "Fire Alarm Systems",
    titleAr: "أنظمة إنذار الحريق",
    summaryEn:
      "Addressable detection, conventional panels, and integrated emergency response — Civil Defense compliant.",
    summaryAr:
      "أنظمة الكشف العنواني واللوحات التقليدية والاستجابة المتكاملة للطوارئ — متوافقة مع الدفاع المدني.",
    iconKey: "flame",
    order: 6,
  },
  {
    slug: "building-automation",
    titleEn: "Building Automation (BACS)",
    titleAr: "أنظمة أتمتة المباني",
    summaryEn:
      "BACnet/Modbus integration of HVAC, lighting, and metering for efficient, observable smart buildings.",
    summaryAr:
      "تكامل BACnet/Modbus لأنظمة التكييف والإضاءة والقياس لمبانٍ ذكية فعّالة وقابلة للمراقبة.",
    iconKey: "building",
    order: 7,
  },
];

const settings = [
  { key: "siteNameEn", value: "Dimensions Edge", category: "branding" },
  { key: "siteNameAr", value: "ديمنشنز إيدج", category: "branding" },
  { key: "logoUrl", value: "/images/logo.svg", category: "branding" },
  { key: "heroBackground", value: "/images/hero-default.jpg", category: "branding" },
  { key: "contactEmail", value: "info@dimensionsedge.sa", category: "contact" },
  { key: "contactPhone", value: "+966 11 000 0000", category: "contact" },
  { key: "addressEn", value: "Riyadh, Saudi Arabia", category: "contact" },
  { key: "addressAr", value: "الرياض، المملكة العربية السعودية", category: "contact" },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@dimensionsedge.sa";
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ?? "change-me-after-first-login";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Site Administrator",
      role: "ADMIN",
    },
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, category: setting.category },
      create: setting,
    });
  }

  console.log("Seed complete.");
  console.log(`Admin: ${adminEmail}`);
  console.log("Change the seeded admin password on first login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
