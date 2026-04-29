"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Handshake,
  Building2,
  Wrench,
  Settings,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { AdminUserMenu } from "./AdminUserMenu";
import { AdminNavLink } from "./AdminNavLink";
import type { AdminSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/clients", label: "Clients", icon: Building2 },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: AdminSession;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Main column */}
      <div className="flex w-full flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 backdrop-blur lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <AdminUserMenu session={session} />
        </header>
        <main className="flex-1 px-4 py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="flex h-14 items-center border-b border-[var(--color-border)] px-6">
        <span className="text-sm font-bold tracking-tight text-[var(--color-brand-900)]">
          Dimensions Edge
        </span>
        <span className="ms-2 rounded bg-[var(--color-brand-100)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-700)]">
          Admin
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {nav.map(({ href, label, icon: Icon, exact }) => (
          <AdminNavLink
            key={href}
            href={href}
            label={label}
            Icon={Icon}
            exact={exact}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="border-t border-[var(--color-border)] p-4 text-xs text-[var(--color-ink-subtle)]">
        <p>Authorized personnel only.</p>
        <p className={cn("mt-1")}>v0.1 · Phase 5</p>
      </div>
    </>
  );
}
