import { setRequestLocale, getTranslations } from "next-intl/server";
import { Compass, Handshake, FileCheck, Target, Eye } from "lucide-react";
import { LeadershipCard } from "./LeadershipCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { FadeIn } from "@/components/motion/FadeIn";
import { FadeUp } from "@/components/motion/FadeUp";
import { getSiteSettings } from "@/lib/content/siteSettings";
import { getVisibleTeamMembers } from "@/lib/content/team";

const valueIcons = [Compass, Handshake, FileCheck];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const settings = await getSiteSettings();

  const isAr = locale === "ar";
  const valueKeys = ["engineered", "owned", "documented"] as const;
  const statKeys = ["years", "projects", "clients", "uptime"] as const;
  const teamMembers = await getVisibleTeamMembers();

  return (
    <>
      {/* ── Cinematic hero — Aramco style ── */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden bg-[var(--color-brand-950)]">
        {settings.heroBackground && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.heroBackground}
              alt={t("about.heroImageAlt")}
              className="absolute inset-0 h-full w-full object-cover object-top opacity-40"
            />
          </>
        )}
        {/* Gradient overlay — left dark, right lighter */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-950)]/90 via-[var(--color-brand-950)]/60 to-transparent" />

        {/* Title — bottom left like Aramco */}
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12 lg:pb-16">
          <FadeIn>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-400)]">
              {t("about.eyebrow")}
            </p>
          </FadeIn>
          <FadeUp delay={0.1}>
            <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {t("about.title")}
            </h1>
          </FadeUp>
        </Container>
      </div>

      {/* ── Who we are — flowing text like Aramco ── */}
      <Section tone="default">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Sticky heading */}
            <div className="lg:col-span-4">
              <Reveal>
                <h2 className="text-2xl font-bold text-[var(--color-brand-950)] lg:sticky lg:top-28 sm:text-3xl">
                  {t("about.whoHeading")}
                </h2>
              </Reveal>
            </div>
            {/* Paragraphs */}
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-ink-muted)] lg:col-span-8">
              <Reveal delay={0.05}>
                <p>{t("about.whoP1")}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>{t("about.whoP2")}</p>
              </Reveal>
              <Reveal delay={0.15}>
                <p>{t("about.whoP3")}</p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Mission & Vision ── */}
      <Section tone="muted">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-brand-950)]">
                  {t("about.missionHeading")}
                </h3>
                <p className="mt-3 leading-relaxed text-[var(--color-ink-muted)]">
                  {t("about.missionBody")}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-brand-950)]">
                  {t("about.visionHeading")}
                </h3>
                <p className="mt-3 leading-relaxed text-[var(--color-ink-muted)]">
                  {t("about.visionBody")}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── Values ── */}
      <Section tone="default">
        <Container>
          <Reveal>
            <h2 className="mb-12 text-3xl font-bold text-[var(--color-brand-950)] sm:text-4xl">
              {t("about.valuesHeading")}
            </h2>
          </Reveal>
          <Stagger whenInView stagger={0.08} className="grid gap-6 md:grid-cols-3">
            {valueKeys.map((key, i) => {
              const Icon = valueIcons[i];
              return (
                <StaggerItem key={key}>
                  <Card className="h-full">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-600)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-[var(--color-brand-950)]">
                      {t(`about.values.${key}Title`)}
                    </h3>
                    <p className="mt-3 text-[var(--color-ink-muted)]">
                      {t(`about.values.${key}Body`)}
                    </p>
                  </Card>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* ── Team ── */}
      {teamMembers.length > 0 && (
        <Section tone="muted">
          <Container>
            <Reveal>
              <div className="mb-12">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">
                  {t("about.teamSubtitle")}
                </p>
                <h2 className="text-3xl font-bold text-[var(--color-brand-950)] sm:text-4xl">
                  {t("about.teamHeading")}
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <LeadershipCard
                  key={member.id}
                  name={isAr ? member.nameAr : member.nameEn}
                  title={isAr ? member.titleAr : member.titleEn}
                  department={member.department}
                  photoUrl={member.photoUrl}
                  summary={isAr ? member.summaryAr : member.summaryEn}
                  bio={isAr ? member.bioAr : member.bioEn}
                  readMore={t("about.teamReadMore")}
                  readLess={t("about.teamReadLess")}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── Stats ── */}
      <Section tone="ink">
        <Container>
          <Reveal>
            <h2 className="mb-12 text-3xl font-bold text-white sm:text-4xl">
              {t("about.byNumbers")}
            </h2>
          </Reveal>
          <Stagger whenInView stagger={0.1} className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {statKeys.map((key) => (
              <StaggerItem key={key}>
                <div>
                  <p className="text-5xl font-bold text-[var(--color-accent-400)] sm:text-6xl" dir="ltr">
                    {t(`about.stats.${key}Value`)}
                  </p>
                  <p className="mt-3 text-sm font-medium uppercase tracking-wider text-[var(--color-brand-300)]">
                    {t(`about.stats.${key}Label`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}