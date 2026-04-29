"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function MessagesList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function toggleRead(m: Message) {
    setBusy(m.id);
    try {
      await fetch(`/api/admin/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !m.isRead }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(m: Message) {
    if (!confirm("Delete this message?")) return;
    setBusy(m.id);
    try {
      await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center text-sm text-[var(--color-ink-muted)]">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <ul className="divide-y divide-[var(--color-border)]">
        {messages.map((m) => {
          const open = openId === m.id;
          return (
            <li key={m.id} className={cn("transition-colors", !m.isRead && "bg-[var(--color-brand-50)]/40")}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : m.id)}
                className="flex w-full items-start gap-4 px-4 py-3 text-left hover:bg-[var(--color-surface-muted)]/60"
              >
                <span className={cn("mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md", m.isRead ? "bg-neutral-100 text-neutral-500" : "bg-[var(--color-brand-100)] text-[var(--color-brand-700)]")}>
                  {m.isRead ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className={cn("text-sm", m.isRead ? "font-medium text-[var(--color-ink)]" : "font-semibold text-[var(--color-brand-950)]")}>{m.name}</span>
                    <span className="text-xs text-[var(--color-ink-muted)]">{m.email}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[var(--color-ink-muted)]">
                    {m.subject ?? m.message.slice(0, 80)}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-[var(--color-ink-subtle)]">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </button>
              {open && (
                <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-4">
                  <dl className="grid gap-2 text-xs sm:grid-cols-2">
                    <div><dt className="text-[var(--color-ink-subtle)]">Email</dt><dd>{m.email}</dd></div>
                    {m.phone && <div><dt className="text-[var(--color-ink-subtle)]">Phone</dt><dd dir="ltr">{m.phone}</dd></div>}
                    {m.company && <div><dt className="text-[var(--color-ink-subtle)]">Company</dt><dd>{m.company}</dd></div>}
                    {m.subject && <div className="sm:col-span-2"><dt className="text-[var(--color-ink-subtle)]">Subject</dt><dd>{m.subject}</dd></div>}
                  </dl>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--color-ink)]">{m.message}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRead(m)}
                      disabled={busy === m.id}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--color-surface-sunken)]"
                    >
                      Mark as {m.isRead ? "unread" : "read"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(m)}
                      disabled={busy === m.id}
                      className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
