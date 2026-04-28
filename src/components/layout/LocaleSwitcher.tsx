"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  en: "EN",
  ar: "ع",
};

export function LocaleSwitcher({ className }: { className?: string }) {
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const other = routing.locales.find((l) => l !== current) ?? "en";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] " +
          "bg-[var(--color-surface)] px-3 py-1.5 text-sm font-medium " +
          "text-[var(--color-ink-muted)] transition-colors " +
          "hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]",
        className,
      )}
      aria-label={`Switch to ${other === "ar" ? "Arabic" : "English"}`}
    >
      <Globe className="h-4 w-4" aria-hidden="true" />
      <span>{labels[other]}</span>
    </button>
  );
}
