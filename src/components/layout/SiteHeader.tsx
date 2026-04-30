import { getSiteSettings } from "@/lib/content/siteSettings";
import { SiteHeaderClient } from "./SiteHeaderClient";

export async function SiteHeader({ locale }: { locale?: string }) {
  const settings = await getSiteSettings();
  const siteName = locale === "ar" ? settings.siteNameAr : settings.siteNameEn;
  return <SiteHeaderClient logoUrl={settings.logoUrl} siteName={siteName} />;
}
