import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { VisibilityBadge } from "@/components/admin/VisibilityBadge";

export default async function AdminTeamPage() {
  const result = await withAdminDb(() =>
    prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader title="Team" />
        <DbNotice error={result.error} />
      </>
    );
  }

  const members = result.data;

  return (
    <>
      <AdminPageHeader
        title="Team"
        description="People shown on the About page."
        actionHref="/admin/team/new"
        actionLabel="New member"
      />
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {members.length === 0 ? (
          <p className="p-12 text-center text-sm text-[var(--color-ink-muted)]">No team members yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Title</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Department</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Order</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Visibility</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--color-surface-muted)]/40">
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                    <div className="flex items-center gap-3">
                      {m.photoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                      )}
                      {m.nameEn}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">{m.titleEn}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">{m.department ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">{m.order}</td>
                  <td className="px-4 py-3"><VisibilityBadge visible={m.isVisible} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/team/${m.id}/edit`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]">
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
