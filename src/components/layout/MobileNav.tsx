"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import { primaryNav } from "./nav-config";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)]"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--color-brand-950)]/60"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 end-0 w-[min(360px,85%)] bg-white shadow-2xl rtl:[transform:translateX(-100%)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  {t("home")}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {primaryNav.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-md px-4 py-3 text-base font-medium transition-colors",
                        active
                          ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                          : "text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-[var(--color-border)] p-4">
                <LocaleSwitcher />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
