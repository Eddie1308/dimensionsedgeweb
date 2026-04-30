"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { primaryNav } from "./nav-config";

export function SiteHeaderClient({ logoUrl, siteName }: { logoUrl?: string; siteName?: string }) {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur-md">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link href="/" className="-mx-2 rounded-md px-2 py-1">
            <Logo logoUrl={logoUrl} siteName={siteName} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher className="hidden lg:inline-flex" />
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
