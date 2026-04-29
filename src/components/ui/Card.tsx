import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
        interactive &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-brand-300)] hover:shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
