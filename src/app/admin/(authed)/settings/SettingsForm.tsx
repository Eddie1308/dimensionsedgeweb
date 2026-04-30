"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Plus, ImagePlus } from "lucide-react";
import { Field, FormSection, inputStyles } from "@/components/admin/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Setting = { key: string; value: string; category: string | null };

const IMAGE_KEYS = ["logoUrl", "faviconUrl", "heroBackground"];

export function SettingsForm({ settings }: { settings: Setting[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Setting[]>(settings);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const grouped = items.reduce<Record<string, Setting[]>>((acc, s) => {
    const key = s.category ?? "uncategorized";
    (acc[key] ??= []).push(s);
    return acc;
  }, {});

  function updateLocal(key: string, value: string) {
    setItems((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }

  async function uploadImage(settingKey: string, file: File) {
    setUploadingKey(settingKey);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      updateLocal(settingKey, data.url);
      // Auto-save after upload
      const setting = items.find((s) => s.key === settingKey);
      if (setting) {
        await fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...setting, value: data.url }),
        });
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  async function saveOne(setting: Setting, e: FormEvent) {
    e.preventDefault();
    setSavingKey(setting.key);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingKey(null);
    }
  }

  async function createNew(e: FormEvent) {
    e.preventDefault();
    if (!newKey.trim()) return;
    setSavingKey("__new__");
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey.trim(), value: "", category: newCategory.trim() || undefined }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Create failed");
      }
      setItems((p) => [...p, { key: newKey.trim(), value: "", category: newCategory.trim() || null }]);
      setNewKey("");
      setNewCategory("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, list]) => (
          <FormSection key={category} title={category[0].toUpperCase() + category.slice(1)}>
            <div className="space-y-4">
              {list.map((s) => {
                const isImageKey = IMAGE_KEYS.includes(s.key);
                const isLong = !isImageKey && (s.value.length > 80 || s.key.toLowerCase().includes("address"));
                return (
                  <form key={s.key} onSubmit={(e) => saveOne(s, e)} className="space-y-2">
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                      <Field label={s.key} htmlFor={s.key}>
                        {isLong ? (
                          <textarea id={s.key} rows={3} value={s.value} onChange={(e) => updateLocal(s.key, e.target.value)} className={cn(inputStyles, "resize-y")} />
                        ) : (
                          <input id={s.key} value={s.value} onChange={(e) => updateLocal(s.key, e.target.value)} className={inputStyles} />
                        )}
                      </Field>
                      <Button type="submit" size="sm" disabled={savingKey === s.key} className="h-9">
                        {savingKey === s.key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Save
                      </Button>
                    </div>
                    {isImageKey && (
                      <div className="flex items-center gap-3">
                        {s.value && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.value} alt="" className="h-10 w-16 rounded border border-[var(--color-border)] object-contain bg-white p-1" />
                        )}
                        <label className={cn("inline-flex cursor-pointer items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-muted)] hover:border-[var(--color-brand-300)] hover:text-[var(--color-ink)]", uploadingKey === s.key && "opacity-60 pointer-events-none")}>
                          {uploadingKey === s.key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                          {uploadingKey === s.key ? "Uploading…" : "Upload image"}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(s.key, f); }} />
                        </label>
                      </div>
                    )}
                  </form>
                );
              })}
            </div>
          </FormSection>
        ))}

      <FormSection title="Add a setting">
        <form onSubmit={createNew} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="Key" htmlFor="newKey" hint="camelCase, no spaces">
            <input id="newKey" value={newKey} onChange={(e) => setNewKey(e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Category" htmlFor="newCategory" hint="Optional grouping">
            <input id="newCategory" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={inputStyles} />
          </Field>
          <Button type="submit" disabled={savingKey === "__new__" || !newKey.trim()} className="h-9">
            {savingKey === "__new__" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </form>
      </FormSection>
    </div>
  );
}
