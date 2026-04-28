import { cn } from "@/lib/utils";

type Tone = "default" | "muted" | "sunken" | "ink";

const toneClasses: Record<Tone, string> = {
  default: "bg-[var(--color-surface)] text-[var(--color-ink)]",
  muted: "bg-[var(--color-surface-muted)] text-[var(--color-ink)]",
  sunken: "bg-[var(--color-surface-sunken)] text-[var(--color-ink)]",
  ink: "bg-[var(--color-brand-950)] text-[var(--color-brand-50)]",
};

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-24 lg:py-32",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}
