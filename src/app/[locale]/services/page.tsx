import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { services } from "@/data/services";
import type { Locale } from "@/i18n/routing";

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isAr = locale === "ar";

  return (
    <>
      <PageHeader
        eyebrow={t("services.eyebrow")}
        title={t("services.indexTitle")}
        subtitle={t("services.indexSubtitle")}
      />

      <Section tone="default">
        <Container>
          <Stagger
            whenInView
            stagger={0.06}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => {
              const title = isAr ? service.titleAr : service.titleEn;
              const summary = isAr ? service.summaryAr : service.summaryEn;
              return (
                <StaggerItem key={service.slug}>
                  <Card interactive className="h-full">
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex h-full flex-col"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-600)] transition-colors group-hover:bg-[var(--color-brand-100)]">
                        <ServiceIcon
                          iconKey={service.iconKey}
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-[var(--color-brand-950)]">
                        {title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                        {summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-600)] transition-colors group-hover:text-[var(--color-brand-700)]">
                        {t("services.explore")}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                      </span>
                    </Link>
                  </Card>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      <CtaBlock locale={locale as Locale} t={t} />
    </>
  );
}

function CtaBlock({
  locale,
  t,
}: {
  locale: Locale;
  // next-intl's translator type is awkward to import here; using any-bound generic
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  return (
    <Section tone="ink">
      <Container width="narrow">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {t("services.talkHeading")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--color-brand-200)]">
              {t("services.talkBody")}
            </p>
            <ButtonLink
              href={`/${locale}/contact`}
              variant="secondary"
              size="lg"
              className="mt-8"
            >
              {t("services.talkCta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
