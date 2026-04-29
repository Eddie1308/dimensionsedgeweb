import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { FadeUp } from "@/components/motion/FadeUp";

// Reusable shell for routes whose content is dynamic and arrives in Phase 4
// (Projects, Partners, Clients). Lets the navigation work end-to-end without
// 404s while we build the admin + DB integration.
export function ComingSoonPage({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <Section tone="default" className="min-h-[60vh]">
      <Container width="narrow">
        <div className="text-center">
          <FadeIn>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">
              {t("comingSoon.eyebrow")}
            </p>
          </FadeIn>
          <FadeUp delay={0.05}>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-brand-950)] sm:text-5xl">
              {t("comingSoon.title")}
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-ink-muted)]">
              {t("comingSoon.subtitle")}
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href={`/${locale}/services`}
                variant="primary"
                size="lg"
              >
                {t("comingSoon.ctaServices")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </ButtonLink>
              <ButtonLink
                href={`/${locale}/contact`}
                variant="outline"
                size="lg"
              >
                {t("comingSoon.ctaContact")}
              </ButtonLink>
            </div>
          </FadeUp>
        </div>
      </Container>
    </Section>
  );
}
