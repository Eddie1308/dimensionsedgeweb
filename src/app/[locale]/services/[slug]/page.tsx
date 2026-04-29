import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { FadeIn } from "@/components/motion/FadeIn";
import { FadeUp } from "@/components/motion/FadeUp";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { getService, services } from "@/data/services";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const title = locale === "ar" ? service.titleAr : service.titleEn;
  const description = locale === "ar" ? service.summaryAr : service.summaryEn;
  return { title, description };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getService(slug);
  if (!service) notFound();

  const t = await getTranslations();
  const isAr = locale === "ar";

  const title = isAr ? service.titleAr : service.titleEn;
  const summary = isAr ? service.summaryAr : service.summaryEn;
  const intro = isAr ? service.introAr : service.introEn;
  const capabilities = isAr ? service.capabilitiesAr : service.capabilitiesEn;

  return (
    <>
      {/* Hero */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <Container className="py-16 lg:py-24">
          <FadeIn>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)]"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180 rtl:rotate-0" />
              {t("common.backToServices")}
            </Link>
          </FadeIn>
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <FadeIn>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
                  <ServiceIcon
                    iconKey={service.iconKey}
                    className="h-7 w-7"
                    aria-hidden="true"
                  />
                </div>
              </FadeIn>
              <FadeUp delay={0.05}>
                <h1 className="text-4xl font-bold tracking-tight text-[var(--color-brand-950)] sm:text-5xl">
                  {title}
                </h1>
              </FadeUp>
              <FadeUp delay={0.15}>
                <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)] sm:text-xl">
                  {summary}
                </p>
              </FadeUp>
            </div>
          </div>
        </Container>
      </header>

      {/* Intro */}
      <Section tone="default">
        <Container width="narrow">
          <Reveal>
            <p className="text-lg leading-relaxed text-[var(--color-ink)] sm:text-xl">
              {intro}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section tone="muted" className="!pt-0">
        <Container>
          <Reveal>
            <h2 className="mb-10 text-3xl font-bold text-[var(--color-brand-950)] sm:text-4xl">
              {t("services.capabilitiesHeading")}
            </h2>
          </Reveal>
          <Stagger
            whenInView
            stagger={0.05}
            className="grid gap-3 sm:grid-cols-2"
          >
            {capabilities.map((capability) => (
              <StaggerItem key={capability}>
                <div className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-[var(--color-ink)]">{capability}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Partners */}
      <Section tone="default">
        <Container>
          <Reveal>
            <h2 className="mb-8 text-3xl font-bold text-[var(--color-brand-950)] sm:text-4xl">
              {t("services.partnersHeading")}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex flex-wrap gap-3">
              {service.partnersEn.map((partner) => (
                <span
                  key={partner}
                  className="inline-flex items-center rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
                  dir="ltr"
                >
                  {partner}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* CTA */}
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
    </>
  );
}
