import { setRequestLocale, getTranslations } from "next-intl/server";
import { Compass, Handshake, FileCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const valueIcons = [Compass, Handshake, FileCheck];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const valueKeys = ["engineered", "owned", "documented"] as const;
  const statKeys = ["years", "projects", "engineers", "uptime"] as const;

  return (
    <>
      <PageHeader
        eyebrow={t("about.eyebrow")}
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      />

      {/* Story */}
      <Section tone="default">
        <Container width="narrow">
          <Reveal>
            <h2 className="text-3xl font-bold text-[var(--color-brand-950)] sm:text-4xl">
              {t("about.storyHeading")}
            </h2>
          </Reveal>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-[var(--color-ink-muted)]">
            <Reveal delay={0.05}>
              <p>{t("about.storyP1")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>{t("about.storyP2")}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section tone="muted">
        <Container>
          <Reveal>
            <h2 className="mb-12 text-3xl font-bold text-[var(--color-brand-950)] sm:text-4xl">
              {t("about.valuesHeading")}
            </h2>
          </Reveal>
          <Stagger
            whenInView
            stagger={0.08}
            className="grid gap-6 md:grid-cols-3"
          >
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

      {/* Stats */}
      <Section tone="ink">
        <Container>
          <Reveal>
            <h2 className="mb-12 text-3xl font-bold text-white sm:text-4xl">
              {t("about.byNumbers")}
            </h2>
          </Reveal>
          <Stagger
            whenInView
            stagger={0.1}
            className="grid grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {statKeys.map((key) => (
              <StaggerItem key={key}>
                <div>
                  <p
                    className="text-5xl font-bold text-[var(--color-accent-400)] sm:text-6xl"
                    dir="ltr"
                  >
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
