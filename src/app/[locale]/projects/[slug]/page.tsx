import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Calendar, MapPin, Briefcase, Layers } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { FadeUp } from "@/components/motion/FadeUp";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { getProjectBySlug } from "@/lib/content/projects";
import { getService } from "@/data/services";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Disabled: would require knowing projects at build time. Pages render on demand instead.
// export async function generateStaticParams() {
//   const slugs = await getVisibleProjectSlugs();
//   return routing.locales.flatMap((locale) =>
//     slugs.map((slug) => ({ locale, slug })),
//   );
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const description = locale === "ar" ? project.summaryAr : project.summaryEn;
  return { title, description };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations();
  const isAr = locale === "ar";

  const title = isAr ? project.titleAr : project.titleEn;
  const summary = isAr ? project.summaryAr : project.summaryEn;
  const description = isAr ? project.descriptionAr : project.descriptionEn;
  const location = isAr ? project.locationAr : project.locationEn;
  const service = getService(project.serviceSlug);
  const serviceTitle = service
    ? isAr
      ? service.titleAr
      : service.titleEn
    : project.serviceSlug;

  return (
    <>
      {/* Hero with cover */}
      <header className="relative isolate overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div
          className="absolute inset-0 -z-10 opacity-25"
          // eslint-disable-next-line react/forbid-dom-props
          style={{
            backgroundImage: `url("${project.coverImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Container className="py-16 lg:py-24">
          <FadeIn>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)]"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180 rtl:rotate-0" />
              {t("projects.back")}
            </Link>
          </FadeIn>
          <div className="mt-8 max-w-3xl">
            <FadeUp delay={0.05}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">
                {project.year} · {location}
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--color-brand-950)] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)] sm:text-xl">
                {summary}
              </p>
            </FadeUp>
          </div>
        </Container>
      </header>

      {/* Body + meta */}
      <Section tone="default">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <article className="lg:col-span-8">
              <Reveal>
                <p className="text-lg leading-relaxed text-[var(--color-ink)]">
                  {description}
                </p>
              </Reveal>

              {project.images.length > 0 && (
                <Stagger
                  whenInView
                  stagger={0.08}
                  className="mt-12 grid gap-4 sm:grid-cols-2"
                >
                  {project.images.map((img, i) => (
                    <StaggerItem key={i}>
                      <div
                        className="aspect-[4/3] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-sunken)]"
                        // eslint-disable-next-line react/forbid-dom-props
                        style={{
                          backgroundImage: `url("${img.url}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        aria-label={
                          isAr ? img.altAr ?? title : img.altEn ?? title
                        }
                      />
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </article>

            <aside className="lg:col-span-4">
              <Reveal delay={0.05}>
                <dl className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
                  <MetaRow
                    icon={<Briefcase className="h-4 w-4" />}
                    label={t("projects.clientLabel")}
                    value={project.clientName}
                  />
                  <MetaRow
                    icon={<MapPin className="h-4 w-4" />}
                    label={t("projects.locationLabel")}
                    value={location}
                  />
                  <MetaRow
                    icon={<Calendar className="h-4 w-4" />}
                    label={t("projects.yearLabel")}
                    value={String(project.year)}
                    forceLtr
                  />
                  <MetaRow
                    icon={<Layers className="h-4 w-4" />}
                    label={t("projects.serviceLabel")}
                    value={
                      <Link
                        href={`/services/${project.serviceSlug}`}
                        className="text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] hover:underline"
                      >
                        {serviceTitle}
                      </Link>
                    }
                  />
                </dl>
              </Reveal>
            </aside>
          </div>
        </Container>
      </Section>

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

function MetaRow({
  icon,
  label,
  value,
  forceLtr,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  forceLtr?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[var(--color-border)] py-4 last:border-0 last:pb-0 first:pt-0">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
        {icon}
      </span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-subtle)]">
          {label}
        </dt>
        <dd
          className="mt-1 text-sm text-[var(--color-ink)]"
          {...(forceLtr ? { dir: "ltr" } : {})}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}
