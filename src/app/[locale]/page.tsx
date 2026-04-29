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
  CheckCircle2,
  Shield,
  Wrench,
  Clock,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FadeUp } from "@/components/motion/FadeUp";
import { FadeIn } from "@/components/motion/FadeIn";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { getVisiblePartners } from "@/lib/content/partners";
import { getFeaturedProjects } from "@/lib/content/projects";

const serviceCards = [
  { slug: "networking", key: "networking", Icon: Network },
  { slug: "audio-visual", key: "audioVisual", Icon: Speaker },
  { slug: "cctv", key: "cctv", Icon: Camera },
  { slug: "access-control", key: "accessControl", Icon: Lock },
  { slug: "pa-system", key: "paSystem", Icon: Megaphone },
  { slug: "fire-alarm", key: "fireAlarm", Icon: Flame },
  { slug: "building-automation", key: "buildingAutomation", Icon: Building2 },
];

const whyUsIcons = [Shield, Wrench, CheckCircle2, Clock];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isAr = locale === "ar";

  const [featuredProjects, partners] = await Promise.all([
    getFeaturedProjects(3),
    getVisiblePartners(),
  ]);

  const whyUsKeys = ["engineered", "owned", "documented", "responsive"] as const;

  return (
    <>
      {/* ── Hero ── */}
      <Section tone="default" className="pt-20 lg:pt-28 pb-16 lg:pb-20">
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
                <ButtonLink href={`/${locale}/services`} variant="primary" size="lg">
                  {t("home.ctaPrimary")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </ButtonLink>
                <ButtonLink href={`/${locale}/projects`} variant="outline" size="lg">
                  {t("home.ctaSecondary")}
                </ButtonLink>
              </div>
            </FadeUp>
          </div>
        </Container>
      </Section>

      {/* ── Stats bar ── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-brand-950)]">
        <Container width="wide">
          <Stagger whenInView stagger={0.08} className="grid grid-cols-2 divide-x divide-[var(--color-brand-800)] lg:grid-cols-4 rtl:divide-x-reverse">
            {(["years", "projects", "clients", "uptime"] as const).map((key) => (
              <StaggerItem key={key}>
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                  <span className="text-4xl font-bold text-[var(--color-accent-400)] sm:text-5xl" dir="ltr">
                    {t(`about.stats.${key}Value`)}
                  </span>
                  <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-300)]">
                    {t(`about.stats.${key}Label`)}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ── Services preview ── */}
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

          <Stagger whenInView stagger={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map(({ slug, key, Icon }) => (
              <StaggerItem key={slug}>
                <Link
                  href={`/services/${slug}`}
                  className="group block h-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-brand-300)] hover:shadow-lg"
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

      {/* ── Why choose us ── */}
      <Section tone="default">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">
                  {t("home.whyEyebrow")}
                </p>
                <h2 className="text-3xl font-bold text-[var(--color-brand-950)] sm:text-4xl">
                  {t("home.whyTitle")}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-[var(--color-ink-muted)]">
                  {t("home.whyBody")}
                </p>
                <ButtonLink href={`/${locale}/about`} variant="outline" size="md" className="mt-8">
                  {t("home.whyCta")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </ButtonLink>
              </div>
            </Reveal>

            <Stagger whenInView stagger={0.07} className="grid gap-4 sm:grid-cols-2">
              {whyUsKeys.map((key, i) => {
                const Icon = whyUsIcons[i];
                return (
                  <StaggerItem key={key}>
                    <Card className="h-full">
                      <Icon className="h-6 w-6 text-[var(--color-brand-600)]" aria-hidden="true" />
                      <h3 className="mt-4 font-semibold text-[var(--color-brand-950)]">
                        {t(`home.why.${key}Title`)}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                        {t(`home.why.${key}Body`)}
                      </p>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ── Featured projects ── */}
      {featuredProjects.length > 0 && (
        <Section tone="muted">
          <Container>
            <Reveal>
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">
                    {t("home.projectsEyebrow")}
                  </p>
                  <h2 className="text-3xl font-bold text-[var(--color-brand-950)] sm:text-4xl">
                    {t("home.projectsTitle")}
                  </h2>
                </div>
                <Link
                  href={`/${locale}/projects`}
                  className="hidden items-center gap-1 text-sm font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)] sm:inline-flex"
                >
                  {t("home.projectsCta")}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </Reveal>

            <Stagger whenInView stagger={0.08} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => {
                const title = isAr ? project.titleAr : project.titleEn;
                const summary = isAr ? project.summaryAr : project.summaryEn;
                const location = isAr ? project.locationAr : project.locationEn;
                return (
                  <StaggerItem key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div
                        className="aspect-[3/2] w-full bg-[var(--color-surface-sunken)]"
                        style={{ backgroundImage: `url("${project.coverImage}")`, backgroundSize: "cover", backgroundPosition: "center" }}
                      />
                      <div className="p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-brand-600)]">
                          {project.year} · {location}
                        </p>
                        <h3 className="mt-2 font-semibold leading-tight text-[var(--color-brand-950)]">
                          {title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--color-ink-muted)]">{summary}</p>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Container>
        </Section>
      )}

      {/* ── Partners logos ── */}
      {partners.length > 0 && (
        <Section tone="default">
          <Container>
            <Reveal>
              <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-subtle)]">
                {t("home.partnersEyebrow")}
              </p>
            </Reveal>
            <Stagger whenInView stagger={0.04} className="flex flex-wrap items-center justify-center gap-8">
              {partners.slice(0, 8).map((partner) => {
                const name = isAr ? partner.nameAr : partner.nameEn;
                return (
                  <StaggerItem key={partner.nameEn}>
                    <span
                      className="text-lg font-bold tracking-tight text-[var(--color-ink-subtle)] opacity-60 transition-opacity hover:opacity-100"
                      dir="ltr"
                    >
                      {partner.logoText || name}
                    </span>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Container>
        </Section>
      )}

      {/* ── CTA ── */}
      <Section tone="ink">
        <Container width="narrow">
          <Reveal>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {t("home.ctaHeading")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--color-brand-200)]">
                {t("home.ctaBody")}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink href={`/${locale}/contact`} variant="secondary" size="lg">
                  {t("home.ctaContact")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </ButtonLink>
                <ButtonLink href={`/${locale}/services`} variant="ghost" size="lg" className="text-[var(--color-brand-200)] hover:bg-[var(--color-brand-900)] hover:text-white">
                  {t("home.ctaServices")}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
