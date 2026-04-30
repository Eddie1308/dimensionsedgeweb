"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, KeyRound } from "lucide-react";
import Link from "next/link";
import type { AdminSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export function AdminUserMenu({ session }: { session: AdminSession }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  const initials = session.email.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-full border border-[var(--color-border)]",
          "bg-[var(--color-surface)] px-2 py-1 text-sm font-medium",
          "text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-muted)]",
        )}
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand-100)] text-xs font-semibold text-[var(--color-brand-700)]">
          {initials}
        </span>
        <span className="hidden md:inline">{session.email}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-xs">
            <p className="font-semibold text-[var(--color-ink)]">{session.email}</p>
            <p className="mt-0.5 text-[var(--color-ink-subtle)]">
              Role: {session.role}
            </p>
          </div>
          <Link
            href="/admin/profile"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-muted)]"
          >
            <KeyRound className="h-4 w-4" />
            Change password
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-muted)]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
