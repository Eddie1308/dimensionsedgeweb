// Static service catalogue — single source of truth for Phase 3 (static pages).
// Phase 4 replaces this with DB queries against the Service model. The DB seed
// already contains the slugs and short summaries; this file holds the rich
// long-form content for the detail pages.

export type ServiceContent = {
  slug: string;
  iconKey: "network" | "cable" | "speaker" | "workflow" | "shield" | "camera";
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  // Detail-page sections
  introEn: string;
  introAr: string;
  capabilitiesEn: string[];
  capabilitiesAr: string[];
  // Visual hint for the hero block (used in cover style)
  accentHueEn?: string;
};

export const services: ServiceContent[] = [
  {
    slug: "networking",
    iconKey: "network",
    titleEn: "ICT & Networking",
    titleAr: "الشبكات وتقنية المعلومات",
    summaryEn:
      "Enterprise WiFi, network design, and server sourcing that keeps every other system in the building talking to each other.",
    summaryAr:
      "شبكات WiFi للمؤسسات وتصميم شبكات وتوريد خوادم يُبقي جميع الأنظمة في المبنى مترابطة.",
    introEn:
      "We build resilient IT infrastructures that keep businesses connected, productive, and ready for growth. By combining enterprise-grade networking technologies with strategic planning, we deliver secure, scalable, and high-performance environments tailored to your operational needs.",
    introAr:
      "نبني بنية تحتية لتقنية المعلومات تُبقي الأعمال متصلة ومنتجة وجاهزة للنمو. من خلال الجمع بين تقنيات الشبكات على مستوى المؤسسات والتخطيط الاستراتيجي، نقدّم بيئات آمنة وقابلة للتوسع وعالية الأداء مصمّمة خصيصاً لاحتياجاتكم التشغيلية.",
    capabilitiesEn: [
      "Enterprise WiFi design and deployment, indoor and outdoor",
      "Network design, switching, and routing",
      "Servers and IT hardware sourcing and procurement",
      "Network monitoring and ongoing support",
    ],
    capabilitiesAr: [
      "تصميم وتركيب شبكات WiFi للمؤسسات داخلياً وخارجياً",
      "تصميم الشبكات والتبديل والتوجيه",
      "توريد الخوادم والأجهزة التقنية",
      "مراقبة الشبكات والدعم المستمر",
    ],
  },
  {
    slug: "cabling",
    iconKey: "cable",
    titleEn: "Structured Cabling",
    titleAr: "الكابلات المنظمة",
    summaryEn:
      "A high-performing network starts with a solid foundation — precision structured cabling built for efficiency and long-term scalability.",
    summaryAr:
      "الشبكة عالية الأداء تبدأ بأساس متين — كابلات منظمة بدقة عالية لضمان الكفاءة وقابلية التوسّع طويلة الأمد.",
    introEn:
      "We design, install, and certify the physical cabling infrastructure that every other system depends on. From a single floor of cubicles to multi-tower campuses, our teams deliver TIA/EIA-compliant runs with as-built documentation that survives the first audit.",
    introAr:
      "نُصمّم ونركّب ونعتمد البنية التحتية المادية للكابلات التي تعتمد عليها جميع الأنظمة الأخرى. من طابق واحد من المكاتب إلى مجمّعات متعددة الأبراج، تُقدّم فرقنا تركيبات متوافقة مع TIA/EIA مع توثيق دقيق يصمد أمام أي تدقيق.",
    capabilitiesEn: [
      "Cat6 and Cat6A copper structured cabling",
      "Single-mode and multi-mode fiber optic backbones",
      "Data centre racks, PDUs, and cable management",
      "Switches, patch panels, and network cabinets",
    ],
    capabilitiesAr: [
      "كابلات Cat6 و Cat6A النحاسية المنظمة",
      "ألياف بصرية أحادية ومتعددة الأنماط",
      "خزائن مراكز البيانات وموزعات الطاقة وإدارة الكابلات",
      "المفاتيح ولوحات التوصيل وخزائن الشبكات",
    ],
  },
  {
    slug: "audio-visual",
    iconKey: "speaker",
    titleEn: "Audio Visual",
    titleAr: "أنظمة الصوت والصورة",
    summaryEn:
      "Transform the way your business communicates — boardrooms, auditoriums, digital signage, and classrooms engineered for performance and reliability.",
    summaryAr:
      "غيّروا طريقة تواصل أعمالكم — قاعات اجتماعات وقاعات كبرى ولافتات رقمية وفصول دراسية مصمّمة للأداء والموثوقية.",
    introEn:
      "Our AV work spans everything from a single meeting room to a full auditorium. That means interactive and LED display screens, digital signage, paperless conferencing with motorized or tabletop screens, microphone and audio systems, and — for larger spaces — professional sound, lighting, and information-release systems for schools and public areas.",
    introAr:
      "أعمالنا في الصوت والصورة تمتد من قاعة اجتماعات واحدة إلى قاعة كبرى متكاملة. يشمل ذلك الشاشات التفاعلية وشاشات LED واللافتات الرقمية وأنظمة المؤتمرات اللاورقية بشاشات متحركة أو مدمجة في الطاولة، وأنظمة الميكروفونات والصوت، وللمساحات الأكبر — أنظمة الصوت الاحترافية والإضاءة وأنظمة عرض المعلومات للمدارس والمساحات العامة.",
    capabilitiesEn: [
      "Interactive and LED display screens, indoor and outdoor",
      "Digital signage (itc, Samsung, Hikvision, Yealink)",
      "Paperless conference systems — motorized pop-up and tabletop screens",
      "Microphone and audio conferencing systems",
      "Auditorium systems — pro sound, stage lighting, and in-seat microphones",
      "Information release and way-finding displays for schools and lobbies",
      "Public address systems, including fire-alarm integrated voice evacuation",
    ],
    capabilitiesAr: [
      "شاشات تفاعلية وشاشات LED داخلية وخارجية",
      "لافتات رقمية (itc و Samsung و Hikvision و Yealink)",
      "أنظمة مؤتمرات لاورقية — شاشات متحركة ومدمجة في الطاولة",
      "أنظمة ميكروفونات ومؤتمرات صوتية",
      "أنظمة القاعات الكبرى — صوت احترافي وإضاءة وميكروفونات المقاعد",
      "أنظمة عرض المعلومات والإرشاد للمدارس والردهات",
      "أنظمة النداء العام، بما في ذلك الإخلاء الصوتي المتكامل مع إنذار الحريق",
    ],
  },
  {
    slug: "erpnext",
    iconKey: "workflow",
    titleEn: "ERP Implementation",
    titleAr: "تطبيق ERP",
    summaryEn:
      "Technology should simplify business, not complicate it — we implement ERPNext for companies, restaurants, logistics, schools, and factories, tailored to how you actually work.",
    summaryAr:
      "التقنية يجب أن تُبسّط الأعمال لا أن تُعقّدها — نُطبّق ERPNext للشركات والمطاعم والخدمات اللوجستية والمدارس والمصانع، بما يتناسب مع طريقة عملكم الفعلية.",
    introEn:
      "We implement ERPNext — a complete ERP platform — configured for how your business actually operates, whether that's a corporate office, a restaurant, a logistics operation, a school, or a factory floor. From initial setup to full cross-department rollout, we configure exactly the modules you need, migrate your existing data, and train your team so the system gets used, not shelved.",
    introAr:
      "نُطبّق ERPNext — منصة ERP متكاملة — بما يتناسب مع طريقة عمل مؤسستكم الفعلية، سواء كانت شركة أو مطعماً أو عملية لوجستية أو مدرسة أو مصنعاً. من الإعداد الأولي إلى التطبيق الكامل عبر الأقسام، نُهيّئ الوحدات التي تحتاجونها بالضبط وننقل بياناتكم الحالية وندرّب فريقكم بحيث يُستخدم النظام فعلياً لا أن يُهمَل.",
    capabilitiesEn: [
      "Helpdesk Support",
      "Accounting",
      "HR",
      "ZATCA integration",
      "Buying",
      "Selling",
      "Stock (inventory management)",
      "Assets",
      "Manufacturing",
      "Projects",
      "CRM",
    ],
    capabilitiesAr: [
      "الدعم الفني (Helpdesk)",
      "المحاسبة (Accounting)",
      "الموارد البشرية (HR)",
      "التكامل مع فوترة ZATCA الإلكترونية",
      "المشتريات (Buying)",
      "المبيعات (Selling)",
      "المخزون وإدارة المستودعات (Stock)",
      "الأصول (Assets)",
      "التصنيع (Manufacturing)",
      "المشاريع (Projects)",
      "إدارة علاقات العملاء (CRM)",
    ],
  },
  {
    slug: "cybersecurity",
    iconKey: "shield",
    titleEn: "Cybersecurity",
    titleAr: "الأمن السيبراني",
    summaryEn:
      "Security is a business necessity, not an afterthought — protection built around your actual risk profile.",
    summaryAr:
      "الأمن ضرورة للأعمال لا رفاهية إضافية — حماية مبنية على مستوى المخاطر الفعلي لديكم.",
    introEn:
      "We work with established security partners to assess, design, and deploy protection appropriate to your risk profile — not a one-size-fits-all package. That covers network security, endpoint protection, and access control, backed by ongoing monitoring so new threats don't go unnoticed.",
    introAr:
      "نعمل مع شركاء أمنيين موثوقين لتقييم وتصميم ونشر الحماية المناسبة لمستوى المخاطر لديكم — وليس حلاً واحداً يناسب الجميع. يشمل ذلك أمن الشبكات وحماية الأجهزة الطرفية والتحكم بالوصول، مدعومة بمراقبة مستمرة حتى لا تمر التهديدات الجديدة دون رصد.",
    capabilitiesEn: [
      "Network and infrastructure security assessments",
      "Firewall and endpoint protection deployment",
      "Access control and identity management",
      "Security monitoring and incident response",
    ],
    capabilitiesAr: [
      "تقييمات أمن الشبكات والبنية التحتية",
      "نشر جدران الحماية وحماية الأجهزة الطرفية",
      "التحكم بالوصول وإدارة الهويات",
      "المراقبة الأمنية والاستجابة للحوادث",
    ],
  },
  {
    slug: "cctv",
    iconKey: "camera",
    titleEn: "CCTV & Access Control",
    titleAr: "المراقبة والتحكم بالدخول",
    summaryEn:
      "Security goes beyond surveillance — intelligent CCTV and access control ecosystems working together, not bolted on separately.",
    summaryAr:
      "الأمن لا يقتصر على المراقبة — أنظمة مراقبة وتحكم بالدخول ذكية تعمل معاً بدلاً من كونها أنظمة منفصلة.",
    introEn:
      "We design surveillance systems that meet daily operational reality, not just the design brief. Alongside CCTV, we integrate access control — card, biometric, and mobile-credential systems — so identity and video work together instead of as two separate systems bolted on after the fact.",
    introAr:
      "نُصمّم أنظمة مراقبة تلبي الواقع التشغيلي اليومي لا فقط مواصفات التصميم. إلى جانب المراقبة، نُدمج التحكم بالدخول — بالبطاقات والبصمة والهوية المحمولة — بحيث تعمل الهوية والفيديو معاً بدلاً من كونهما نظامين منفصلين.",
    capabilitiesEn: [
      "Hikvision IP cameras: dome, bullet, PTZ, panoramic",
      "Centralized VMS with multi-site federation and AI analytics",
      "Card, fingerprint, and mobile-credential access control",
      "Visitor management and HR/Active Directory integration",
      "Storage sizing, retention policy, and RAID NVR design",
    ],
    capabilitiesAr: [
      "كاميرات Hikvision IP: قبّة وسهمية و PTZ وبانورامية",
      "نظام إدارة فيديو مركزي متعدد المواقع مع تحليلات الذكاء الاصطناعي",
      "التحكم بالدخول بالبطاقات والبصمة والهوية المحمولة",
      "إدارة الزوار والتكامل مع الموارد البشرية و Active Directory",
      "تخطيط التخزين وسياسة الاحتفاظ وتصميم NVR بـRAID",
    ],
  },
];

export function getService(slug: string | undefined): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
