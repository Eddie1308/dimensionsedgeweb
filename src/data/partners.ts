// Vendor / OEM partners. Two are intentionally hidden to test the toggle.
export type Partner = {
  nameEn: string;
  nameAr: string;
  logoText: string;
  logoUrl?: string;
  websiteUrl?: string;
  order: number;
  isVisible: boolean;
};

export const partners: Partner[] = [
  { nameEn: "Hikvision", nameAr: "Hikvision", logoText: "HIK", websiteUrl: "https://www.hikvision.com", order: 1, isVisible: true },
  { nameEn: "Cisco", nameAr: "Cisco", logoText: "cisco", websiteUrl: "https://www.cisco.com", order: 2, isVisible: true },
  { nameEn: "itc", nameAr: "itc", logoText: "itc", websiteUrl: "https://www.itc-pro.com", order: 3, isVisible: true },
  { nameEn: "Bosch", nameAr: "Bosch", logoText: "BOSCH", websiteUrl: "https://www.bosch.com", order: 4, isVisible: true },
  { nameEn: "Honeywell", nameAr: "Honeywell", logoText: "HW", websiteUrl: "https://www.honeywell.com", order: 5, isVisible: true },
  { nameEn: "Siemens", nameAr: "Siemens", logoText: "SIEMENS", websiteUrl: "https://www.siemens.com", order: 6, isVisible: true },
  { nameEn: "Aruba", nameAr: "Aruba", logoText: "aruba", websiteUrl: "https://www.arubanetworks.com", order: 7, isVisible: true },
  { nameEn: "Suprema", nameAr: "Suprema", logoText: "SUPREMA", websiteUrl: "https://www.supremainc.com", order: 8, isVisible: true },
  { nameEn: "Tridium", nameAr: "Tridium", logoText: "TRIDIUM", order: 9, isVisible: false },
  { nameEn: "HID Global", nameAr: "HID Global", logoText: "HID", order: 10, isVisible: false },
];
