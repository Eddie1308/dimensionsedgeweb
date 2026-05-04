import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  email: string;
  phone: string;
  address: string;
  addressAr: string;
  logoUrl: string;
  faviconUrl: string;
  siteNameEn: string;
  siteNameAr: string;
  heroBackground: string;
  bannerEnabled: boolean;
  bannerText: string;
  maintenanceEnabled: boolean;
};

const DEFAULTS: SiteSettings = {
  email: "info@dimensionsedgeest.com",
  phone: "+966 11 000 0000",
  address: "Riyadh, Saudi Arabia",
  addressAr: "الرياض، المملكة العربية السعودية",
  logoUrl: "",
  faviconUrl: "",
  siteNameEn: "Dimensions Edge",
  siteNameAr: "ديمنشنز إيدج",
  heroBackground: "",
  bannerEnabled: false,
  bannerText: "",
  maintenanceEnabled: false,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  noStore();
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            "email", "phone", "address", "addressAr",
            "contactEmail", "contactPhone", "addressEn",
            "logoUrl", "faviconUrl",
            "siteNameEn", "siteNameAr",
            "heroBackground",
            "bannerEnabled", "bannerText", "maintenanceEnabled",
          ],
        },
      },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      email: map.email || map.contactEmail || DEFAULTS.email,
      phone: map.phone || map.contactPhone || DEFAULTS.phone,
      address: map.address || map.addressEn || DEFAULTS.address,
      addressAr: map.addressAr || DEFAULTS.addressAr,
      logoUrl: map.logoUrl || DEFAULTS.logoUrl,
      faviconUrl: map.faviconUrl || DEFAULTS.faviconUrl,
      siteNameEn: map.siteNameEn || DEFAULTS.siteNameEn,
      siteNameAr: map.siteNameAr || DEFAULTS.siteNameAr,
      heroBackground: map.heroBackground || DEFAULTS.heroBackground,
      bannerEnabled: map.bannerEnabled === "true",
      bannerText: map.bannerText || DEFAULTS.bannerText,
      maintenanceEnabled: map.maintenanceEnabled === "true",
    };
  } catch {
    return DEFAULTS;
  }
}
