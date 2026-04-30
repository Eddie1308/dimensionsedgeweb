"use client";

import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { primaryNav } from "./nav-config";
import type { SiteSettings } from "@/lib/content/siteSettings";

const serviceLinks = [
  { slug: "networking", key: "networking" },
  { slug: "audio-visual", key: "audioVisual" },
  { slug: "cctv", key: "cctv" },
  { slug: "access-control", key: "accessControl" },
  { slug: "pa-system", key: "paSystem" },
  { slug: "fire-alarm", key: "fireAlarm" },
  { slug: "building-automation", key: "buildingAutomation" },
];

export function SiteFooterClient({
  settings,
  locale,
}: {
  settings: SiteSettings;
  locale: string;
}) {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const tServices = useTranslations("services");
  const year = new Date().getFullYear();
  const isAr = locale === "ar";
  const address = isAr ? settings.addressAr : settings.address;

  return (
    <footer className="bg-[var(--color-brand-950)] text-[var(--color-brand-100)]">
      <Container width="wide" className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="ink" logoUrl={settings.logoUrl} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-brand-200)]">
              {tFooter("tagline")}
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-400)]" aria-hidden="true" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-400)]" aria-hidden="true" />
                <span dir="ltr">{settings.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-400)]" aria-hidden="true" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-8 lg:grid-cols-3">
            <FooterColumn title={tFooter("explore")}>
              {primaryNav.slice(1, 5).map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {tNav(item.key)}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title={tFooter("services")}>
              {serviceLinks.map((s) => (
                <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                  {tServices(s.key)}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title={tFooter("company")}>
              <FooterLink href="/about">{tNav("about")}</FooterLink>
              <FooterLink href="/partners">{tNav("partners")}</FooterLink>
              <FooterLink href="/clients">{tNav("clients")}</FooterLink>
              <FooterLink href="/contact">{tNav("contact")}</FooterLink>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-[var(--color-brand-800)] pt-6 text-xs text-[var(--color-brand-300)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {tFooter("rightsReserved")}</p>
          <p>{tFooter("yearsOfExperience")}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-300)]">
        {title}
      </h3>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[var(--color-brand-200)] transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}
