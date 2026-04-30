import { getSiteSettings } from "@/lib/content/siteSettings";
import { SiteHeaderClient } from "./SiteHeaderClient";

export async function SiteHeader() {
  const settings = await getSiteSettings();
  return <SiteHeaderClient logoUrl={settings.logoUrl} />;
}
