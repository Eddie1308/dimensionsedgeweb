import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { BrandedLogo } from "@/components/ui/BrandedLogo";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { getVisibleClients } from "@/lib/content/clients";

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isAr = locale === "ar";
  const clients = await getVisibleClients();

  return (
    <>
      <PageHeader
        eyebrow={t("clients.eyebrow")}
        title={t("clients.title")}
        subtitle={t("clients.subtitle")}
      />

      <Section tone="default">
        <Container>
          <Stagger
            whenInView
            stagger={0.03}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            {clients.map((client) => {
              const name = isAr ? client.nameAr : client.nameEn;
              const industry = isAr ? client.industryAr : client.industryEn;
              return (
                <StaggerItem key={client.nameEn}>
                  <div className="flex h-full flex-col items-center gap-2 text-center">
                    <BrandedLogo text={client.logoText} name={name} />
                    <p className="text-sm font-medium text-[var(--color-ink)]">
                      {name}
                    </p>
                    {industry && (
                      <p className="text-xs text-[var(--color-ink-subtle)]">
                        {industry}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
