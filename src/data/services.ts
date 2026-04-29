// Static service catalogue — single source of truth for Phase 3 (static pages).
// Phase 4 replaces this with DB queries against the Service model. The DB seed
// already contains the slugs and short summaries; this file holds the rich
// long-form content for the detail pages.

export type ServiceContent = {
  slug: string;
  iconKey:
    | "network"
    | "speaker"
    | "camera"
    | "lock"
    | "megaphone"
    | "flame"
    | "building";
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  // Detail-page sections
  introEn: string;
  introAr: string;
  capabilitiesEn: string[];
  capabilitiesAr: string[];
  partnersEn: string[]; // OEM / vendor names — not translated
  // Visual hint for the hero block (used in cover style)
  accentHueEn?: string;
};

export const services: ServiceContent[] = [
  {
    slug: "networking",
    iconKey: "network",
    titleEn: "Networking & Structured Cabling",
    titleAr: "الشبكات والكابلات المنظمة",
    summaryEn:
      "Cat6/Cat6A/Fiber backbones, enterprise WiFi, and certified structured cabling for offices, hospitals, and campuses.",
    summaryAr:
      "شبكات Cat6 و Cat6A والألياف البصرية وشبكات WiFi للمؤسسات وكابلات منظمة معتمدة للمكاتب والمستشفيات والمجمعات.",
    introEn:
      "We design, install, and certify the physical and logical infrastructure that every other system depends on. From a single floor of cubicles to multi-tower campuses, our cabling teams deliver TIA/EIA-compliant runs with full Fluke certification and as-built documentation that survives the first audit.",
    introAr:
      "نُصمّم ونركّب ونعتمد البنية التحتية المادية والمنطقية التي تعتمد عليها جميع الأنظمة الأخرى. من طابق واحد من المكاتب إلى مجمّعات متعددة الأبراج — تُقدّم فرقنا تركيبات متوافقة مع TIA/EIA مع اعتماد كامل من Fluke وتوثيق دقيق يصمد أمام أي تدقيق.",
    capabilitiesEn: [
      "Cat6 and Cat6A copper structured cabling",
      "Single-mode and multi-mode fiber optic backbones",
      "Indoor and outdoor enterprise WiFi (Cisco, Aruba, Ruckus)",
      "Data centre racks, PDUs, and cable management",
      "Fluke DSX certification and as-built documentation",
      "Network design, switching, and routing",
    ],
    capabilitiesAr: [
      "كابلات Cat6 و Cat6A النحاسية المنظمة",
      "ألياف بصرية أحادية ومتعددة الأنماط",
      "شبكات WiFi للمؤسسات داخلياً وخارجياً (Cisco و Aruba و Ruckus)",
      "خزائن مراكز البيانات وموزعات الطاقة وإدارة الكابلات",
      "اعتماد Fluke DSX وتوثيق التركيب الفعلي",
      "تصميم الشبكات والتبديل والتوجيه",
    ],
    partnersEn: ["Cisco", "Aruba", "Commscope", "Panduit", "Fluke Networks"],
  },
  {
    slug: "audio-visual",
    iconKey: "speaker",
    titleEn: "Audio-Visual Systems",
    titleAr: "أنظمة الصوت والصورة",
    summaryEn:
      "Conference rooms, auditoriums, and digital signage powered by itc — discussion systems, line arrays, and unified control.",
    summaryAr:
      "قاعات المؤتمرات والقاعات الكبرى واللافتات الرقمية بدعم من itc — أنظمة المناقشة ومكبرات الصوت ووحدات التحكم الموحدة.",
    introEn:
      "Our long partnership with itc lets us deliver everything from a single boardroom to a 2,000-seat auditorium with integrated discussion, voting, simultaneous interpretation, and broadcast-grade audio. Every install is commissioned by certified engineers and handed over with operator training.",
    introAr:
      "تتيح لنا شراكتنا الطويلة مع itc تنفيذ كل شيء من قاعة اجتماعات واحدة إلى قاعة كبرى تتسع لألفي مقعد مع أنظمة مناقشة وتصويت وترجمة فورية وصوت بجودة البث المباشر. يتم تشغيل كل تركيب من قِبل مهندسين معتمدين ويُسلَّم مع تدريب المشغّلين.",
    capabilitiesEn: [
      "Conference and discussion systems (itc TS series)",
      "Auditorium line arrays and DSP-based zoning",
      "Simultaneous interpretation booths and IR distribution",
      "4K video walls, projection, and digital signage",
      "Crestron and Extron control system programming",
      "Mosque sound systems with prayer-time integration",
    ],
    capabilitiesAr: [
      "أنظمة المؤتمرات والمناقشة (سلسلة itc TS)",
      "مكبرات صوت خطية للقاعات وتقسيم مناطق رقمي DSP",
      "كبائن الترجمة الفورية وتوزيع IR",
      "جدران فيديو 4K وأنظمة عرض ولافتات رقمية",
      "برمجة أنظمة التحكم Crestron و Extron",
      "أنظمة صوت المساجد مع تكامل أوقات الصلاة",
    ],
    partnersEn: ["itc", "Bosch", "Crestron", "Extron", "Samsung", "LG"],
  },
  {
    slug: "cctv",
    iconKey: "camera",
    titleEn: "CCTV & Video Surveillance",
    titleAr: "كاميرات المراقبة",
    summaryEn:
      "Hikvision IP camera systems, NVR/VMS deployments, and AI-driven analytics for perimeter and indoor security.",
    summaryAr:
      "أنظمة كاميرات Hikvision IP وحلول NVR/VMS وتحليلات الذكاء الاصطناعي للأمان الداخلي والمحيطي.",
    introEn:
      "From a 16-camera retail rollout to multi-thousand-channel city-scale projects, our Hikvision-certified team delivers IP video that meets the design intent and the SOC's daily reality. We design for redundancy, scope analytics carefully, and document every camera's field of view so the operations team can use the system from day one.",
    introAr:
      "من تركيبات بـ16 كاميرا في المتاجر إلى مشاريع على مستوى المدن بآلاف القنوات — يُقدّم فريقنا المعتمد من Hikvision أنظمة فيديو IP تلبي قصد التصميم والواقع اليومي لغرفة العمليات. نُصمّم للاستمرارية ونُحدّد التحليلات بعناية ونُوثّق مجال رؤية كل كاميرا ليستخدم فريق العمليات النظام من اليوم الأول.",
    capabilitiesEn: [
      "Hikvision IP cameras: dome, bullet, PTZ, panoramic",
      "ANPR / LPR for vehicle access and tolling",
      "Facial recognition and AI behavioural analytics",
      "Centralized VMS with multi-site federation",
      "Storage sizing, retention policy, and RAID NVR design",
      "Body-worn camera integration",
    ],
    capabilitiesAr: [
      "كاميرات Hikvision IP: قبّة وسهمية و PTZ وبانورامية",
      "التعرّف على لوحات السيارات للدخول وتحصيل الرسوم",
      "التعرّف على الوجوه وتحليلات السلوك بالذكاء الاصطناعي",
      "نظام إدارة فيديو مركزي متعدد المواقع",
      "تخطيط التخزين وسياسة الاحتفاظ وتصميم NVR بـRAID",
      "تكامل الكاميرات الشخصية المحمولة",
    ],
    partnersEn: ["Hikvision", "Milestone", "Genetec"],
  },
  {
    slug: "access-control",
    iconKey: "lock",
    titleEn: "Access Control",
    titleAr: "أنظمة التحكم بالدخول",
    summaryEn:
      "Card, biometric, and mobile-credential access systems integrated with HR, visitor management, and time attendance.",
    summaryAr:
      "أنظمة الدخول بالبطاقات والبصمة والهوية المحمولة المتكاملة مع الموارد البشرية وإدارة الزوار والحضور.",
    introEn:
      "Whether the site is a 4-door clinic or a multi-building corporate campus, we treat access control as the people-facing edge of identity. Our systems integrate cleanly with Active Directory and HR platforms so onboarding, transfers, and offboarding propagate automatically — no orphan badges, no audit findings.",
    introAr:
      "سواء كان الموقع عيادة بأربعة أبواب أو حرماً مؤسسياً متعدد المباني — نتعامل مع التحكم بالدخول كحدّ مواجه للأفراد لإدارة الهوية. تتكامل أنظمتنا بسلاسة مع Active Directory ومنصات الموارد البشرية بحيث ينتقل التعيين والنقل وإنهاء الخدمة تلقائياً — بلا بطاقات يتيمة وبلا ملاحظات تدقيق.",
    capabilitiesEn: [
      "Card, fingerprint, palm-vein, and facial credentials",
      "Mobile credentials via NFC/BLE",
      "Anti-passback, mantrap, and high-security door logic",
      "Active Directory and HR system integration",
      "Visitor pre-registration and self-service kiosks",
      "Time and attendance reporting",
    ],
    capabilitiesAr: [
      "بطاقات وبصمة وعرق راحة اليد والوجه كهويات",
      "الهويات المحمولة عبر NFC/BLE",
      "منع التمرير المعكوس وأبواب التأمين العالي",
      "تكامل مع Active Directory وأنظمة الموارد البشرية",
      "التسجيل المسبق للزوار وأكشاك الخدمة الذاتية",
      "تقارير الوقت والحضور",
    ],
    partnersEn: ["HID", "Suprema", "Hikvision", "ZKTeco"],
  },
  {
    slug: "pa-system",
    iconKey: "megaphone",
    titleEn: "Public Address Systems",
    titleAr: "أنظمة النداء العام",
    summaryEn:
      "EN54-certified voice evacuation, background music, and zoned PA for malls, mosques, and industrial sites.",
    summaryAr:
      "أنظمة الإخلاء الصوتي المعتمدة EN54 والموسيقى الخلفية والنداء العام المقسم للمولات والمساجد والمواقع الصناعية.",
    introEn:
      "When the building has to tell people what to do — whether that's directing customers in a mall or evacuating a tower — the PA system is the difference between calm and chaos. We design EN54-certified voice-evacuation systems that pass Civil Defense inspection and integrate cleanly with the fire alarm panel.",
    introAr:
      "عندما يحتاج المبنى لإخبار الناس بما يفعلون — سواء بتوجيه الزبائن في مول أو إخلاء برج — فإن نظام النداء العام هو الفرق بين الهدوء والفوضى. نُصمّم أنظمة إخلاء صوتي معتمدة EN54 تجتاز فحص الدفاع المدني وتتكامل بسلاسة مع لوحة إنذار الحريق.",
    capabilitiesEn: [
      "EN54-16/24 certified voice evacuation (VA)",
      "Multi-zone background music and paging",
      "Mosque public-address with prayer-time scheduling",
      "Industrial-grade horns and weatherproof speakers",
      "Integration with fire alarm and BMS",
      "Distributed amplifier rooms with redundant DSP",
    ],
    capabilitiesAr: [
      "أنظمة إخلاء صوتي معتمدة EN54-16/24",
      "موسيقى خلفية ونداء متعدد المناطق",
      "نظام نداء المساجد مع جدولة أوقات الصلاة",
      "أبواق صناعية ومكبرات مقاومة للطقس",
      "تكامل مع إنذار الحريق ونظام إدارة المباني",
      "غرف مكبرات صوت موزعة مع DSP احتياطي",
    ],
    partnersEn: ["Bosch", "TOA", "itc", "Ateis"],
  },
  {
    slug: "fire-alarm",
    iconKey: "flame",
    titleEn: "Fire Alarm Systems",
    titleAr: "أنظمة إنذار الحريق",
    summaryEn:
      "Addressable detection, conventional panels, and integrated emergency response — Civil Defense compliant.",
    summaryAr:
      "أنظمة الكشف العنواني واللوحات التقليدية والاستجابة المتكاملة للطوارئ — متوافقة مع الدفاع المدني.",
    introEn:
      "Fire alarm work is regulated work. Every panel we install is sized for the building's hazard class, programmed against the approved fire matrix, and signed off by Civil Defense. We carry the certifications, hold the as-built drawings, and respond when the panel calls — including out-of-hours.",
    introAr:
      "أعمال إنذار الحريق أعمال منظَّمة. كل لوحة نُركّبها مُصمَّمة وفق فئة خطر المبنى ومُبرمجة وفق مصفوفة الحريق المعتمدة وموقَّعة من الدفاع المدني. نحمل الشهادات ونحتفظ بمخططات التركيب الفعلي ونستجيب عندما تنادي اللوحة — بما في ذلك خارج ساعات العمل.",
    capabilitiesEn: [
      "Addressable and conventional fire detection panels",
      "Aspirating smoke detection (VESDA) for high-value zones",
      "Linear heat detection for cable galleries and tunnels",
      "Civil Defense compliance and approval support",
      "Cause-and-effect matrix programming and commissioning",
      "Annual maintenance and 24/7 response contracts",
    ],
    capabilitiesAr: [
      "لوحات كشف الحريق العنوانية والتقليدية",
      "الكشف بالشفط (VESDA) للمناطق عالية القيمة",
      "كشف الحرارة الخطي لأنفاق الكابلات",
      "التوافق مع الدفاع المدني ودعم الموافقات",
      "برمجة مصفوفة السبب والنتيجة والتشغيل",
      "صيانة سنوية وعقود استجابة على مدار الساعة",
    ],
    partnersEn: ["Notifier", "Honeywell", "Edwards", "Siemens"],
  },
  {
    slug: "building-automation",
    iconKey: "building",
    titleEn: "Building Automation (BACS)",
    titleAr: "أنظمة أتمتة المباني",
    summaryEn:
      "BACnet/Modbus integration of HVAC, lighting, and metering for efficient, observable smart buildings.",
    summaryAr:
      "تكامل BACnet/Modbus لأنظمة التكييف والإضاءة والقياس لمبانٍ ذكية فعّالة وقابلة للمراقبة.",
    introEn:
      "Buildings waste energy when nobody is watching them. Our BACS practice connects HVAC, lighting, metering, and the systems we install ourselves to a single supervisor that gives operations a real-time view and gives finance a real consumption number. We focus on integrations that survive vendor turnover and reduce energy spend in the first year.",
    introAr:
      "تُهدر المباني الطاقة عندما لا يراقبها أحد. تربط ممارستنا في BACS أنظمة التكييف والإضاءة والقياس والأنظمة التي نُركّبها بأنفسنا في لوحة مشرف واحدة تمنح فرق العمليات رؤية فورية وتمنح فرق المالية رقم استهلاك حقيقي. نركّز على عمليات تكامل تصمد أمام تغيُّر المورّدين وتُقلّل الإنفاق على الطاقة في السنة الأولى.",
    capabilitiesEn: [
      "BACnet/IP, BACnet/MS-TP, and Modbus integration",
      "HVAC controls: VAV, FCU, AHU, chiller plant optimization",
      "DALI and BACnet lighting control",
      "Energy submetering and dashboards",
      "Niagara Framework and Tridium supervisors",
      "Open-protocol design — no vendor lock-in",
    ],
    capabilitiesAr: [
      "تكامل BACnet/IP و BACnet/MS-TP و Modbus",
      "تحكم التكييف: VAV و FCU و AHU وتحسين محطات التبريد",
      "تحكم الإضاءة DALI و BACnet",
      "قياس فرعي للطاقة ولوحات تحكم",
      "إطار عمل Niagara ومشرفو Tridium",
      "تصميم بروتوكول مفتوح — بلا قيود مورّد",
    ],
    partnersEn: ["Siemens", "Schneider Electric", "Honeywell", "Tridium"],
  },
];

export function getService(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
