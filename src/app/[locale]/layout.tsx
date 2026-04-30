import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, localeDirection, type Locale } from "@/i18n/routing";
import { inter, tajawal } from "@/lib/fonts";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteSettings } from "@/lib/content/siteSettings";
import { cn } from "@/lib/utils";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Dimensions Edge",
    template: "%s · Dimensions Edge",
  },
  description:
    "Low-current and ICT systems integrator — networking, AV, CCTV, access control, fire alarm, and building automation across Saudi Arabia.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const dir = localeDirection[locale as Locale];
  const settings = await getSiteSettings();
  const siteName = locale === "ar" ? settings.siteNameAr : settings.siteNameEn;

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={cn(inter.variable, tajawal.variable)}
    >
      <head>
        {settings.faviconUrl && (
          <link rel="icon" href={settings.faviconUrl} />
        )}
        {siteName && siteName !== "Dimensions Edge" && (
          <title>{siteName}</title>
        )}
      </head>
      <body className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)] antialiased">
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader locale={locale} />
            <main className="flex-1">{children}</main>
            <SiteFooter locale={locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
