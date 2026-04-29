// Mock project catalogue. Phase 4 ships this as the data source so the gallery
// is fully working without MySQL. Once the DB is provisioned (see USER CRITICAL
// todos), src/lib/content/projects.ts flips USE_DB to true and reads the
// equivalent shape from Prisma.
//
// isVisible mirrors the Prisma model: false = staged in catalogue but hidden
// from the public site. Two are intentionally hidden so the toggle behaviour
// is observable in the gallery.

export type ProjectImage = {
  url: string;
  altEn?: string;
  altAr?: string;
};

export type Project = {
  slug: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  clientName: string;
  locationEn: string;
  locationAr: string;
  year: number;
  // serviceSlug ties to src/data/services.ts — not enforced statically here
  // because in DB land the relation is by FK. The adapter layer can join.
  serviceSlug:
    | "networking"
    | "audio-visual"
    | "cctv"
    | "access-control"
    | "pa-system"
    | "fire-alarm"
    | "building-automation";
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
  coverImage: string;
  images: ProjectImage[];
};

// Branded SVG placeholders generated inline. Once real photos arrive,
// these get replaced with /uploads/... paths via the admin uploader.
const placeholder = (label: string, hueA: string, hueB: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${hueA}"/>
          <stop offset="1" stop-color="${hueB}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <text x="60" y="740" font-family="Inter, system-ui, sans-serif" font-size="42" font-weight="700" fill="rgba(255,255,255,0.85)">${label}</text>
    </svg>`,
  )}`;

const navy = ["#1e3a5f", "#0f1f33"];
const slate = ["#334155", "#1e293b"];
const teal = ["#0e7490", "#164e63"];
const amber = ["#b45309", "#78350f"];
const violet = ["#5b21b6", "#3b1772"];
const emerald = ["#047857", "#064e3b"];

export const projects: Project[] = [
  {
    slug: "kafd-trading-floor",
    titleEn: "KAFD Trading Floor — AV & Networking",
    titleAr: "قاعة التداول في كافد — صوت ومرئيات وشبكات",
    summaryEn:
      "300-position trading floor with redundant networking, video walls, and dealer-board PA.",
    summaryAr:
      "قاعة تداول بـ300 موقع مع شبكات احتياطية وجدران فيديو ونظام نداء للمتداولين.",
    descriptionEn:
      "We delivered the structured cabling, dealer-board PA, and 24-screen video wall for a flagship trading floor in KAFD. Cat6A copper to every position, redundant fibre uplinks to two diverse risers, and a Crestron control system that switches sources for any position from the central NOC. Commissioned in twelve weeks, no defects at handover.",
    descriptionAr:
      "نفّذنا الكابلات المنظمة ونظام النداء للمتداولين وجدار الفيديو من 24 شاشة لقاعة تداول رئيسية في مركز الملك عبدالله المالي. كابلات Cat6A إلى كل موقع وروابط ألياف بصرية احتياطية إلى ممرين مختلفين ونظام تحكم Crestron يُبدّل المصادر لأي موقع من غرفة التحكم المركزية. تمّ التشغيل خلال اثني عشر أسبوعاً بلا ملاحظات عند التسليم.",
    clientName: "Confidential — Tier-1 Bank",
    locationEn: "King Abdullah Financial District, Riyadh",
    locationAr: "مركز الملك عبدالله المالي، الرياض",
    year: 2024,
    serviceSlug: "audio-visual",
    isFeatured: true,
    isVisible: true,
    order: 1,
    coverImage: placeholder("Trading Floor · KAFD", navy[0], navy[1]),
    images: [
      { url: placeholder("Dealer board", navy[0], navy[1]) },
      { url: placeholder("Video wall NOC", slate[0], slate[1]) },
      { url: placeholder("Cabling backbone", teal[0], teal[1]) },
    ],
  },
  {
    slug: "ministry-hq-cctv",
    titleEn: "Ministry HQ — Campus-Wide CCTV",
    titleAr: "مقر وزاري — كاميرات مراقبة على مستوى الحرم",
    summaryEn:
      "850-channel Hikvision deployment across four buildings with central VMS and ANPR.",
    summaryAr:
      "تركيب 850 قناة Hikvision عبر أربعة مبانٍ مع نظام إدارة فيديو مركزي والتعرّف على لوحات المركبات.",
    descriptionEn:
      "Federated VMS spanning four buildings, ANPR at all six gates, AI-driven perimeter analytics, and 90-day retention on a redundant NVR cluster. We led the field-of-view design, ran the security clearances for our installers, and trained the SOC team over a two-week parallel-running period.",
    descriptionAr:
      "نظام إدارة فيديو موحّد يغطي أربعة مبانٍ مع التعرّف على لوحات المركبات في البوابات الست وتحليلات محيطية بالذكاء الاصطناعي واحتفاظ 90 يوماً على مجموعة NVR احتياطية. قُدنا تصميم مجالات الرؤية وأنجزنا التصاريح الأمنية للفنيين ودرّبنا فريق غرفة العمليات خلال أسبوعين من التشغيل المتوازي.",
    clientName: "Government Entity",
    locationEn: "Riyadh",
    locationAr: "الرياض",
    year: 2023,
    serviceSlug: "cctv",
    isFeatured: true,
    isVisible: true,
    order: 2,
    coverImage: placeholder("Campus CCTV · 850ch", slate[0], slate[1]),
    images: [
      { url: placeholder("Perimeter analytics", slate[0], slate[1]) },
      { url: placeholder("ANPR gate", navy[0], navy[1]) },
    ],
  },
  {
    slug: "grand-mosque-pa",
    titleEn: "Grand Mosque PA & Sound Reinforcement",
    titleAr: "نظام النداء وتعزيز الصوت لجامع كبير",
    summaryEn:
      "Distributed line-array sound system with prayer-time scheduling and EN54-certified evacuation.",
    summaryAr:
      "نظام صوت موزّع بمكبرات خطية مع جدولة أوقات الصلاة وإخلاء معتمد EN54.",
    descriptionEn:
      "Eight DSP zones, line arrays for the prayer hall, ceiling speakers in the ablution areas, and a fully redundant amplifier room. The system shifts to evacuation mode automatically on a fire alarm signal — Civil Defense witnessed the cause-and-effect testing on commissioning day.",
    descriptionAr:
      "ثماني مناطق DSP ومكبرات خطية لقاعة الصلاة وسماعات سقفية في مناطق الوضوء وغرفة مكبرات صوت احتياطية بالكامل. ينتقل النظام تلقائياً إلى وضع الإخلاء عند إشارة إنذار الحريق — شهد الدفاع المدني اختبار السبب والنتيجة في يوم التشغيل.",
    clientName: "Awqaf Foundation",
    locationEn: "Eastern Province",
    locationAr: "المنطقة الشرقية",
    year: 2024,
    serviceSlug: "pa-system",
    isFeatured: false,
    isVisible: true,
    order: 3,
    coverImage: placeholder("Mosque PA · 8 zones", amber[0], amber[1]),
    images: [
      { url: placeholder("Line array detail", amber[0], amber[1]) },
      { url: placeholder("Amplifier room", slate[0], slate[1]) },
    ],
  },
  {
    slug: "private-hospital-bacs",
    titleEn: "Private Hospital — BACS Integration",
    titleAr: "مستشفى خاص — تكامل أنظمة أتمتة المباني",
    summaryEn:
      "Niagara supervisor unifying HVAC, lighting, and energy submetering across two towers.",
    summaryAr:
      "مشرف Niagara يُوحّد أنظمة التكييف والإضاءة وقياس الطاقة عبر برجين.",
    descriptionEn:
      "Brought four legacy BMS islands under a single Tridium Niagara supervisor, connected over BACnet/IP and Modbus TCP. We negotiated the protocol exposure with the original vendors, modelled every chiller plant point, and built dashboards that the facilities team could read without IT support. Energy savings: 14% in the first quarter post-commissioning.",
    descriptionAr:
      "ضمّنا أربعة جزر BMS قديمة تحت مشرف Tridium Niagara واحد متصلاً عبر BACnet/IP و Modbus TCP. تفاوضنا مع الموردين الأصليين على كشف البروتوكول ونمذجنا كل نقاط محطات التبريد وبنينا لوحات يقرؤها فريق التشغيل دون دعم تقني. التوفير في الطاقة: 14% في الربع الأول بعد التشغيل.",
    clientName: "Healthcare Group",
    locationEn: "Jeddah",
    locationAr: "جدة",
    year: 2024,
    serviceSlug: "building-automation",
    isFeatured: true,
    isVisible: true,
    order: 4,
    coverImage: placeholder("BACS · Niagara", emerald[0], emerald[1]),
    images: [
      { url: placeholder("Chiller plant", emerald[0], emerald[1]) },
      { url: placeholder("Operator dashboard", teal[0], teal[1]) },
    ],
  },
  {
    slug: "tech-campus-access",
    titleEn: "Tech Campus — Access Control & Visitor Mgmt",
    titleAr: "مجمّع تقني — تحكم بالدخول وإدارة زوار",
    summaryEn:
      "240 doors, biometric + mobile credentials, AD-integrated lifecycle.",
    summaryAr:
      "240 باباً وهويات بصرية ومحمولة وتكامل دورة حياة مع Active Directory.",
    descriptionEn:
      "240-door rollout with HID readers, Suprema biometrics for high-security zones, mobile credentials over BLE for engineering staff. Tied into Active Directory so onboarding/transfer/offboarding flows from HR cascade automatically — zero orphan badges in the first audit.",
    descriptionAr:
      "تركيب 240 باباً مع قرّاء HID وبصمة Suprema للمناطق العالية الأمن وهويات محمولة عبر BLE للمهندسين. متكامل مع Active Directory لتنتقل عمليات التعيين والنقل وإنهاء الخدمة من الموارد البشرية تلقائياً — صفر بطاقات يتيمة في أول تدقيق.",
    clientName: "Tech Holding",
    locationEn: "Riyadh",
    locationAr: "الرياض",
    year: 2025,
    serviceSlug: "access-control",
    isFeatured: false,
    isVisible: true,
    order: 5,
    coverImage: placeholder("240 doors · AD-integrated", violet[0], violet[1]),
    images: [{ url: placeholder("Reader install", violet[0], violet[1]) }],
  },
  {
    slug: "mall-fire-alarm",
    titleEn: "Mega-Mall Fire Alarm & Voice Evacuation",
    titleAr: "نظام إنذار حريق وإخلاء صوتي لمول كبير",
    summaryEn:
      "Addressable detection across 180,000 m² with EN54 voice evacuation.",
    summaryAr:
      "كشف عنواني عبر 180,000 م² مع إخلاء صوتي معتمد EN54.",
    descriptionEn:
      "Notifier addressable panels, eight network nodes, 8,000 devices, and EN54-16/24 voice evacuation tied to the BMS for HVAC shutdown and smoke pressurization. Commissioned phase-by-phase as tenants moved in, no false alarms during go-live.",
    descriptionAr:
      "لوحات Notifier العنوانية وثمانية عقد شبكية و8,000 جهاز وإخلاء صوتي EN54-16/24 مرتبط بنظام إدارة المباني لإيقاف التكييف وضغط الدخان. تمّ التشغيل على مراحل مع دخول المستأجرين وبلا إنذارات كاذبة أثناء التشغيل.",
    clientName: "Retail Developer",
    locationEn: "Riyadh",
    locationAr: "الرياض",
    year: 2023,
    serviceSlug: "fire-alarm",
    isFeatured: false,
    isVisible: true,
    order: 6,
    coverImage: placeholder("Fire alarm · 180k m²", amber[0], amber[1]),
    images: [{ url: placeholder("Panel network", amber[0], amber[1]) }],
  },
  {
    slug: "stadium-networking",
    titleEn: "Stadium Networking & WiFi",
    titleAr: "شبكات وWiFi لاستاد",
    summaryEn:
      "High-density WiFi 6E for 60,000 seats, fibre backbone, and broadcast infrastructure.",
    summaryAr:
      "WiFi 6E عالي الكثافة لـ60,000 مقعد وألياف بصرية وبنية البث.",
    descriptionEn:
      "Hidden — staged in catalogue, awaiting client press release before publishing.",
    descriptionAr: "مخفي — مُجهَّز في الكتالوج بانتظار البيان الصحفي للعميل.",
    clientName: "Confidential",
    locationEn: "TBA",
    locationAr: "يُعلن لاحقاً",
    year: 2025,
    serviceSlug: "networking",
    isFeatured: false,
    isVisible: false,
    order: 7,
    coverImage: placeholder("Stadium · WiFi 6E", teal[0], teal[1]),
    images: [],
  },
  {
    slug: "airport-terminal-av",
    titleEn: "Airport Terminal AV Refresh",
    titleAr: "تحديث الصوت والمرئيات لصالة مطار",
    summaryEn:
      "Flight information displays, paging, and lounge AV across the new concourse.",
    summaryAr:
      "شاشات معلومات الرحلات والنداء والصوت والصورة لقاعات الانتظار في الصالة الجديدة.",
    descriptionEn:
      "Hidden — under NDA until terminal opens.",
    descriptionAr: "مخفي — تحت اتفاقية عدم إفصاح حتى افتتاح الصالة.",
    clientName: "Aviation Authority",
    locationEn: "TBA",
    locationAr: "يُعلن لاحقاً",
    year: 2025,
    serviceSlug: "audio-visual",
    isFeatured: false,
    isVisible: false,
    order: 8,
    coverImage: placeholder("Airport AV", navy[0], navy[1]),
    images: [],
  },
];

export function getProjectMockBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
