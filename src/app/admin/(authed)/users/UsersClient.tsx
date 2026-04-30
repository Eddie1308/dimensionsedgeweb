"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Trash2, Loader2, Plus, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isSuperUser: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

type Step = "list" | "add_form" | "add_verify" | "delete_verify";

export function UsersClient({ users: initialUsers }: { users: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [step, setStep] = useState<Step>("list");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  // Add user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "EDITOR">("EDITOR");

  // Verification code state
  const [code, setCode] = useState("");

  async function handleInitiateAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, role: newRole }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStep("add_verify");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, action: "CREATE_USER" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Invalid code");
      setSuccess("User created and welcome email sent.");
      setStep("list");
      setNewName(""); setNewEmail(""); setNewRole("EDITOR"); setCode("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  async function handleInitiateDelete(userId: string) {
    setError(null);
    setLoading(true);
    setTargetId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "POST" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStep("delete_verify");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setTargetId(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyDelete(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, action: "DELETE_USER" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Invalid code");
      setUsers((prev) => prev.filter((u) => u.id !== targetId));
      setSuccess("User deleted.");
      setStep("list");
      setCode(""); setTargetId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(userId: string, userName: string) {
    if (!confirm(`Reset password for ${userName}? A temporary password will be emailed to them.`)) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setSuccess(`Password reset. Temporary password sent to ${userName}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-200)]";

  if (step === "add_form" || step === "add_verify") {
    return (
      <div className="max-w-lg space-y-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {step === "add_form" ? "New user details" : "Enter verification code"}
          </h2>

          {step === "add_form" && (
            <form onSubmit={handleInitiateAdd} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Full name</label>
                <input required value={newName} onChange={(e) => setNewName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Role</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as "ADMIN" | "EDITOR")} className={inputCls}>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Send verification code
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setStep("list"); setError(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {step === "add_verify" && (
            <form onSubmit={handleVerifyAdd} className="space-y-4">
              <p className="text-sm text-[var(--color-ink-muted)]">
                A 6-digit verification code has been sent to the super user. Enter it below to confirm user creation.
              </p>
              <div>
                <label className="mb-1 block text-sm font-medium">Verification code</label>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  placeholder="123456"
                  className={cn(inputCls, "text-center text-2xl tracking-widest")}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading || code.length !== 6}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Confirm & create user
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setStep("list"); setError(null); setCode(""); }}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (step === "delete_verify") {
    return (
      <div className="max-w-lg">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-red-800">Confirm deletion</h2>
          <p className="mb-4 text-sm text-red-700">
            A 6-digit verification code has been sent to the super user. Enter it to permanently delete this user.
          </p>
          <form onSubmit={handleVerifyDelete} className="space-y-4">
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              placeholder="123456"
              className={cn(inputCls, "text-center text-2xl tracking-widest")}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={loading || code.length !== 6} className="bg-red-600 hover:bg-red-700 text-white">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete user
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setStep("list"); setError(null); setCode(""); setTargetId(null); }}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">{success}</div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => { setStep("add_form"); setSuccess(null); setError(null); }}>
          <Plus className="h-4 w-4" /> Add user
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Last login</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[var(--color-surface-muted)]/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {user.isSuperUser && <Crown className="h-4 w-4 shrink-0 text-amber-500" />}
                    <div>
                      <p className="font-medium text-[var(--color-ink)]">{user.name ?? "—"}</p>
                      <p className="text-xs text-[var(--color-ink-muted)]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                    user.isSuperUser
                      ? "bg-amber-100 text-amber-800"
                      : user.role === "ADMIN"
                        ? "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]"
                        : "bg-neutral-100 text-neutral-700"
                  )}>
                    {user.isSuperUser ? "Super User" : user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!user.isSuperUser && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleResetPassword(user.id, user.name ?? user.email)}
                          disabled={loading}
                          title="Reset password"
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]"
                        >
                          <KeyRound className="h-3 w-3" /> Reset pw
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInitiateDelete(user.id)}
                          disabled={loading}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          {loading && targetId === user.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
