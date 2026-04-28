import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Network,
  Speaker,
  Camera,
  Lock,
  Megaphone,
  Flame,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FadeUp } from "@/components/motion/FadeUp";
import { FadeIn } from "@/components/motion/FadeIn";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const serviceCards = [
  { slug: "networking", key: "networking", Icon: Network },
  { slug: "audio-visual", key: "audioVisual", Icon: Speaker },
  { slug: "cctv", key: "cctv", Icon: Camera },
  { slug: "access-control", key: "accessControl", Icon: Lock },
  { slug: "pa-system", key: "paSystem", Icon: Megaphone },
  { slug: "fire-alarm", key: "fireAlarm", Icon: Flame },
  { slug: "building-automation", key: "buildingAutomation", Icon: Building2 },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      {/* Hero */}
      <Section tone="default" className="pt-20 lg:pt-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">
                {t("home.heroEyebrow")}
              </p>
            </FadeIn>
            <FadeUp delay={0.1}>
              <h1 className="text-display text-[var(--color-brand-950)]">
                {t("home.heroTitle")}
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-ink-muted)] sm:text-xl">
                {t("home.heroSubtitle")}
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink
                  href={`/${locale}/services`}
                  variant="primary"
                  size="lg"
                >
                  {t("home.ctaPrimary")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </ButtonLink>
                <ButtonLink
                  href={`/${locale}/projects`}
                  variant="outline"
                  size="lg"
                >
                  {t("home.ctaSecondary")}
                </ButtonLink>
              </div>
            </FadeUp>
          </div>
        </Container>
      </Section>

      {/* Services preview */}
      <Section tone="muted">
        <Container>
          <Reveal>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">
                {t("home.servicesEyebrow")}
              </p>
              <h2 className="text-3xl font-bold text-[var(--color-brand-950)] sm:text-4xl">
                {t("home.servicesTitle")}
              </h2>
              <p className="mt-4 text-base text-[var(--color-ink-muted)] sm:text-lg">
                {t("home.servicesSubtitle")}
              </p>
            </div>
          </Reveal>

          <Stagger
            whenInView
            stagger={0.06}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {serviceCards.map(({ slug, key, Icon }) => (
              <StaggerItem key={slug}>
                <Link
                  href={`/services/${slug}`}
                  className="group block h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-brand-300)] hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-600)] transition-colors group-hover:bg-[var(--color-brand-100)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[var(--color-brand-950)]">
                    {t(`services.${key}`)}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-600)] transition-colors group-hover:text-[var(--color-brand-700)]">
                    {t("common.readMore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
