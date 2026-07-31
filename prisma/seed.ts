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
