import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  backHref,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  backHref?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-brand-950)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
            {description}
          </p>
        )}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className={cn(
            "inline-flex items-center gap-2 rounded-md bg-[var(--color-brand-600)] px-4 py-2 text-sm font-semibold text-white",
            "transition-colors hover:bg-[var(--color-brand-700)]",
          )}
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
