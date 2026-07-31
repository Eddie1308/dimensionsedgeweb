import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { ServiceBrandsEditor } from "./_components/ServiceBrandsEditor";

export default async function AdminServicesPage() {
  const result = await withAdminDb(() =>
    prisma.service.findMany({
      orderBy: [{ order: "asc" }],
      include: { brands: { orderBy: { order: "asc" } } },
    }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader
          title="Services"
          description="Brands each service can source or support. This is not a claim of formal partnership — see Partners for confirmed vendor relationships."
        />
        <DbNotice error={result.error} />
      </>
    );
  }

  const services = result.data;

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Brands each service can source or support. This is not a claim of formal partnership — see Partners for confirmed vendor relationships."
      />
      <div className="space-y-4">
        {services.map((s) => (
          <div key={s.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-base font-semibold text-[var(--color-brand-950)]">{s.titleEn}</h2>
            <p className="mb-4 text-xs text-[var(--color-ink-subtle)]">/{s.slug}</p>
            <ServiceBrandsEditor serviceId={s.id} brands={s.brands} />
          </div>
        ))}
      </div>
    </>
  );
}
