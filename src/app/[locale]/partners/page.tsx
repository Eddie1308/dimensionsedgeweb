import { setRequestLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { BrandedLogo } from "@/components/ui/BrandedLogo";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { getVisiblePartners } from "@/lib/content/partners";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isAr = locale === "ar";
  const partners = await getVisiblePartners();

  return (
    <>
      <PageHeader
        eyebrow={t("partners.eyebrow")}
        title={t("partners.title")}
        subtitle={t("partners.subtitle")}
      />

      <Section tone="default">
        <Container>
          <Stagger
            stagger={0.04}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {partners.map((partner) => {
              const name = isAr ? partner.nameAr : partner.nameEn;
              const inner = (
                <div className="group flex h-full flex-col items-center gap-3">
                  <BrandedLogo text={partner.logoText} name={name} />
                  <p className="text-sm font-medium text-[var(--color-ink-muted)]">
                    {name}
                  </p>
                  {partner.websiteUrl && (
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--color-brand-600)] opacity-0 transition-opacity group-hover:opacity-100">
                      {t("partners.visit")}
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  )}
                </div>
              );

              return (
                <StaggerItem key={partner.nameEn}>
                  {partner.websiteUrl ? (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div>{inner}</div>
                  )}
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
