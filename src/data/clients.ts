// Client wall. Two hidden to test the toggle.
export type Client = {
  nameEn: string;
  nameAr: string;
  logoText: string;
  industryEn?: string;
  industryAr?: string;
  order: number;
  isVisible: boolean;
};

export const clients: Client[] = [
  { nameEn: "Saudi National Bank", nameAr: "البنك الأهلي السعودي", logoText: "SNB", industryEn: "Banking", industryAr: "بنوك", order: 1, isVisible: true },
  { nameEn: "Aramco", nameAr: "أرامكو", logoText: "ARAMCO", industryEn: "Energy", industryAr: "طاقة", order: 2, isVisible: true },
  { nameEn: "STC", nameAr: "STC", logoText: "stc", industryEn: "Telecom", industryAr: "اتصالات", order: 3, isVisible: true },
  { nameEn: "Ministry of Interior", nameAr: "وزارة الداخلية", logoText: "MOI", industryEn: "Government", industryAr: "حكومي", order: 4, isVisible: true },
  { nameEn: "King Faisal Hospital", nameAr: "مستشفى الملك فيصل التخصصي", logoText: "KFSH", industryEn: "Healthcare", industryAr: "صحة", order: 5, isVisible: true },
  { nameEn: "Saudi Aramco Schools", nameAr: "مدارس أرامكو", logoText: "SAS", industryEn: "Education", industryAr: "تعليم", order: 6, isVisible: true },
  { nameEn: "Riyadh Bank", nameAr: "بنك الرياض", logoText: "RB", industryEn: "Banking", industryAr: "بنوك", order: 7, isVisible: true },
  { nameEn: "Saudi Electricity", nameAr: "الشركة السعودية للكهرباء", logoText: "SEC", industryEn: "Utilities", industryAr: "مرافق", order: 8, isVisible: true },
  { nameEn: "Almarai", nameAr: "المراعي", logoText: "Almarai", industryEn: "FMCG", industryAr: "سلع استهلاكية", order: 9, isVisible: true },
  { nameEn: "King Abdulaziz University", nameAr: "جامعة الملك عبدالعزيز", logoText: "KAU", industryEn: "Education", industryAr: "تعليم", order: 10, isVisible: true },
  { nameEn: "NEOM", nameAr: "نيوم", logoText: "NEOM", industryEn: "Real Estate", industryAr: "عقارات", order: 11, isVisible: false },
  { nameEn: "Red Sea Global", nameAr: "البحر الأحمر العالمية", logoText: "RSG", industryEn: "Hospitality", industryAr: "ضيافة", order: 12, isVisible: false },
];
