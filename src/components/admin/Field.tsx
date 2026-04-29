import { cn } from "@/lib/utils";

export const inputStyles =
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm " +
  "text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] " +
  "focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-200)]";

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  span = 1,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  span?: 1 | 2;
}) {
  return (
    <div className={cn(span === 2 && "sm:col-span-2")}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]"
      >
        {label}
        {required && <span className="ms-0.5 text-[var(--color-brand-600)]">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-[var(--color-ink-subtle)]">{hint}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function FormGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">{children}</div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <header className="mb-5">
        <h2 className="text-base font-semibold text-[var(--color-brand-950)]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
