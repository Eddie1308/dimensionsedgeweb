import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { getSiteSettings } from "@/lib/content/siteSettings";
import { ContactForm } from "./ContactForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isAr = locale === "ar";
  const settings = await getSiteSettings();
  const address = isAr ? settings.addressAr : settings.address;

  return (
    <>
      <PageHeader
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />

      <Section tone="default">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <ContactForm />
              </Reveal>
            </div>

            <aside className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                    {t("contact.directLabel")}
                  </h2>
                  <ul className="mt-6 space-y-5">
                    <ContactItem
                      icon={<Mail className="h-5 w-5" />}
                      label={t("contact.emailLabel")}
                    >
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)]"
                      >
                        {settings.email}
                      </a>
                    </ContactItem>
                    <ContactItem
                      icon={<Phone className="h-5 w-5" />}
                      label={t("contact.phoneLabel")}
                    >
                      <span dir="ltr">{settings.phone}</span>
                    </ContactItem>
                    <ContactItem
                      icon={<MapPin className="h-5 w-5" />}
                      label={t("contact.addressLabel")}
                    >
                      {address}
                    </ContactItem>
                    <ContactItem
                      icon={<Clock className="h-5 w-5" />}
                      label={t("contact.hoursLabel")}
                    >
                      {t("contact.hoursValue")}
                    </ContactItem>
                  </ul>
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-subtle)]">
          {label}
        </p>
        <p className="mt-1 text-[var(--color-ink)]">{children}</p>
      </div>
    </li>
  );
}
