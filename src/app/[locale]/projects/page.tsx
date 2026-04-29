import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { getVisibleProjects } from "@/lib/content/projects";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isAr = locale === "ar";
  const projects = await getVisibleProjects();

  return (
    <>
      <PageHeader
        eyebrow={t("projects.eyebrow")}
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
      />

      <Section tone="default">
        <Container>
          {projects.length === 0 ? (
            <Reveal>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-12 text-center">
                <h3 className="text-xl font-semibold text-[var(--color-brand-950)]">
                  {t("projects.noneTitle")}
                </h3>
                <p className="mt-3 text-[var(--color-ink-muted)]">
                  {t("projects.noneBody")}
                </p>
              </div>
            </Reveal>
          ) : (
            <Stagger
              whenInView
              stagger={0.06}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {projects.map((project) => {
                const title = isAr ? project.titleAr : project.titleEn;
                const summary = isAr ? project.summaryAr : project.summaryEn;
                const location = isAr ? project.locationAr : project.locationEn;
                return (
                  <StaggerItem key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block h-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-brand-300)] hover:shadow-lg"
                    >
                      <div
                        className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--color-surface-sunken)]"
                        // eslint-disable-next-line react/forbid-dom-props
                        style={{
                          backgroundImage: `url("${project.coverImage}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {project.isFeatured && (
                          <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-accent-500)] px-2.5 py-1 text-xs font-semibold text-[var(--color-brand-950)]">
                            <Star className="h-3 w-3 fill-current" />
                            {t("projects.featured")}
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-brand-600)]">
                          {project.year} · {location}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold leading-tight text-[var(--color-brand-950)]">
                          {title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm text-[var(--color-ink-muted)]">
                          {summary}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-600)] transition-colors group-hover:text-[var(--color-brand-700)]">
                          {t("projects.viewProject")}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </Container>
      </Section>
    </>
  );
}
