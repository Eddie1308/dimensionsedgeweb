import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { VisibilityBadge } from "@/components/admin/VisibilityBadge";

export default async function AdminPartnersPage() {
  const result = await withAdminDb(() =>
    prisma.partner.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Partners" description="Vendors and OEMs shown on the Partners page." />
        <DbNotice error={result.error} />
      </>
    );
  }

  const partners = result.data;

  return (
    <>
      <AdminPageHeader
        title="Partners"
        description="Vendors and OEMs shown on the Partners page."
        actionHref="/admin/partners/new"
        actionLabel="New partner"
      />
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {partners.length === 0 ? (
          <p className="p-12 text-center text-sm text-[var(--color-ink-muted)]">No partners yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Order</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Visibility</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--color-surface-muted)]/40">
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{p.nameEn}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">{p.order}</td>
                  <td className="px-4 py-3"><VisibilityBadge visible={p.isVisible} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/partners/${p.id}/edit`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]">
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
