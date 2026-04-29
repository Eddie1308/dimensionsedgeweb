import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { VisibilityBadge } from "@/components/admin/VisibilityBadge";

export default async function AdminClientsPage() {
  const result = await withAdminDb(() =>
    prisma.client.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Clients" />
        <DbNotice error={result.error} />
      </>
    );
  }

  const clients = result.data;

  return (
    <>
      <AdminPageHeader
        title="Clients"
        description="Logos shown on the public Clients wall."
        actionHref="/admin/clients/new"
        actionLabel="New client"
      />
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {clients.length === 0 ? (
          <p className="p-12 text-center text-sm text-[var(--color-ink-muted)]">No clients yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Industry</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Order</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Visibility</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--color-surface-muted)]/40">
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{c.nameEn}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">{c.industryEn ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">{c.order}</td>
                  <td className="px-4 py-3"><VisibilityBadge visible={c.isVisible} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/clients/${c.id}/edit`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]">
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
