import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "default",
  logoUrl,
}: {
  className?: string;
  variant?: "default" | "ink";
  logoUrl?: string;
}) {
  const t = useTranslations("site");

  const markColor =
    variant === "ink"
      ? "text-[var(--color-brand-50)]"
      : "text-[var(--color-brand-700)]";
  const accent =
    variant === "ink"
      ? "text-[var(--color-accent-400)]"
      : "text-[var(--color-accent-600)]";
  const wordColor =
    variant === "ink"
      ? "text-[var(--color-brand-50)]"
      : "text-[var(--color-brand-900)]";

  if (logoUrl) {
    return (
      <div className={cn("flex items-center", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={t("name")} className="h-10 max-w-[160px] object-contain" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        className={cn("h-8 w-8 shrink-0", markColor)}
        aria-hidden="true"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="currentColor" opacity="0.08" />
        <path d="M9 9h7a7 7 0 1 1 0 14H9z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M19 16h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={accent} />
      </svg>
      <span className={cn("text-base font-bold tracking-tight sm:text-lg", wordColor)}>
        {t("name")}
      </span>
    </div>
  );
}
