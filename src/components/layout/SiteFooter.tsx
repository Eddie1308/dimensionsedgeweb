import { getSiteSettings } from "@/lib/content/siteSettings";
import { SiteFooterClient } from "./SiteFooterClient";

export async function SiteFooter({ locale }: { locale: string }) {
  const settings = await getSiteSettings();
  return <SiteFooterClient settings={settings} locale={locale} />;
}
