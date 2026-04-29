import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { withAdminDb } from "@/lib/admin/db-guard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DbNotice } from "@/components/admin/DbNotice";
import { VisibilityBadge } from "@/components/admin/VisibilityBadge";

export default async function AdminProjectsPage() {
  const result = await withAdminDb(() =>
    prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { service: { select: { titleEn: true, slug: true } } },
    }),
  );

  if (!result.ok) {
    return (
      <>
        <AdminPageHeader
          title="Projects"
          description="Portfolio entries shown on the public Projects page."
        />
        <DbNotice error={result.error} />
      </>
    );
  }

  const projects = result.data;

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description="Toggle visibility per project. Hidden projects stay in the catalogue but do not appear on the public site."
        actionHref="/admin/projects/new"
        actionLabel="New project"
      />

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {projects.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--color-ink-muted)]">
            No projects yet. <Link href="/admin/projects/new" className="font-medium text-[var(--color-brand-700)] hover:underline">Create the first one →</Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr className="text-left">
                <Th>Title</Th>
                <Th>Service</Th>
                <Th>Year</Th>
                <Th>Visibility</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-[var(--color-surface-muted)]/40">
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--color-ink)]">{project.titleEn}</span>
                      {project.isFeatured && (
                        <Star className="h-3.5 w-3.5 fill-[var(--color-accent-500)] text-[var(--color-accent-500)]" aria-label="Featured" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--color-ink-subtle)]">{project.slug}</p>
                  </Td>
                  <Td className="text-[var(--color-ink-muted)]">
                    {project.service?.titleEn ?? "—"}
                  </Td>
                  <Td className="text-[var(--color-ink-muted)]">{project.year ?? "—"}</Td>
                  <Td>
                    <VisibilityBadge visible={project.isVisible} />
                  </Td>
                  <Td className="text-right">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)] ${className ?? ""}`}>
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ""}`}>{children}</td>;
}
