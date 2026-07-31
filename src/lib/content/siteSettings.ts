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
  aboutBanner: string;
  contactBanner: string;
  clientsBanner: string;
  partnersBanner: string;
  projectsBanner: string;
  servicesBanner: string;
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
  aboutBanner: "",
  contactBanner: "",
  clientsBanner: "",
  partnersBanner: "",
  projectsBanner: "",
  servicesBanner: "",
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
            "aboutBanner", "contactBanner", "clientsBanner",
            "partnersBanner", "projectsBanner", "servicesBanner",
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
      aboutBanner: map.aboutBanner || DEFAULTS.aboutBanner,
      contactBanner: map.contactBanner || DEFAULTS.contactBanner,
      clientsBanner: map.clientsBanner || DEFAULTS.clientsBanner,
      partnersBanner: map.partnersBanner || DEFAULTS.partnersBanner,
      projectsBanner: map.projectsBanner || DEFAULTS.projectsBanner,
      servicesBanner: map.servicesBanner || DEFAULTS.servicesBanner,
      bannerEnabled: map.bannerEnabled === "true",
      bannerText: map.bannerText || DEFAULTS.bannerText,
      maintenanceEnabled: map.maintenanceEnabled === "true",
    };
  } catch {
    return DEFAULTS;
  }
}
