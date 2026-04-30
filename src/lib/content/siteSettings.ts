import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  email: string;
  phone: string;
  address: string;
  addressAr: string;
};

const DEFAULTS: SiteSettings = {
  email: "info@dimensionsedgeest.com",
  phone: "+966 11 000 0000",
  address: "Riyadh, Saudi Arabia",
  addressAr: "الرياض، المملكة العربية السعودية",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ["email", "phone", "address", "addressAr"] } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      email: map.email || DEFAULTS.email,
      phone: map.phone || DEFAULTS.phone,
      address: map.address || DEFAULTS.address,
      addressAr: map.addressAr || DEFAULTS.addressAr,
    };
  } catch {
    return DEFAULTS;
  }
}
