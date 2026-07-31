"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { inputStyles } from "@/components/admin/Field";
import { cn } from "@/lib/utils";

type Brand = { id: string; name: string };

export function ServiceBrandsEditor({
  serviceId,
  brands,
}: {
  serviceId: string;
  brands: Brand[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function addBrand(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/service-brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, name: newName.trim(), order: brands.length }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Failed to add brand");
      }
      setNewName("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add brand");
    } finally {
      setAdding(false);
    }
  }

  async function removeBrand(id: string) {
    setRemovingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/service-brands/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Failed to remove brand");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove brand");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {brands.length === 0 && (
          <p className="text-xs text-[var(--color-ink-subtle)]">No brands yet — nothing shows on the public page.</p>
        )}
        {brands.map((b) => (
          <span
            key={b.id}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] px-3 py-1.5 text-sm text-[var(--color-ink)]"
          >
            {b.name}
            <button
              type="button"
              onClick={() => removeBrand(b.id)}
              disabled={removingId === b.id}
              className="text-[var(--color-ink-subtle)] hover:text-red-600"
              aria-label={`Remove ${b.name}`}
            >
              {removingId === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={addBrand} className="mt-3 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Cisco"
          className={cn(inputStyles, "max-w-[220px]")}
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:border-[var(--color-brand-300)] hover:text-[var(--color-ink)] disabled:opacity-50"
        >
          {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add
        </button>
      </form>
    </div>
  );
}
