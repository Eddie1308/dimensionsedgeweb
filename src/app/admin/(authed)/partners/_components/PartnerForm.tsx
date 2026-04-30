"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { Field, FormGrid, FormSection, inputStyles } from "@/components/admin/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type PartnerFormValue = {
  id?: string;
  nameEn: string;
  nameAr: string;
  logoText: string;
  logoUrl: string;
  websiteUrl: string;
  isVisible: boolean;
  order: number;
};

export function PartnerForm({ initial }: { initial: PartnerFormValue }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "uploading" | "deleting">("idle");
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(initial.id);

  function update<K extends keyof PartnerFormValue>(k: K, val: PartnerFormValue[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  async function uploadLogo(file: File) {
    setStatus("uploading");
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      update("logoUrl", data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setStatus("idle");
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const url = isEdit ? `/api/admin/partners/${initial.id}` : "/api/admin/partners";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/partners");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setStatus("idle");
    }
  }

  async function onDelete() {
    if (!isEdit || !confirm("Delete this partner?")) return;
    setStatus("deleting");
    try {
      const res = await fetch(`/api/admin/partners/${initial.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/partners");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection title="Identity">
        <FormGrid>
          <Field label="Name (EN)" htmlFor="nameEn" required>
            <input id="nameEn" required value={v.nameEn} onChange={(e) => update("nameEn", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Name (AR)" htmlFor="nameAr" required>
            <input id="nameAr" required dir="rtl" value={v.nameAr} onChange={(e) => update("nameAr", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Logo abbreviation" htmlFor="logoText" hint="Short text shown when no logo image (e.g. HIK, CISCO)">
            <input id="logoText" value={v.logoText} onChange={(e) => update("logoText", e.target.value)} className={inputStyles} maxLength={20} />
          </Field>
          <Field label="Website URL" htmlFor="websiteUrl" hint="Optional. Must include https://">
            <input id="websiteUrl" type="url" value={v.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} className={inputStyles} />
          </Field>
        </FormGrid>
      </FormSection>

      <FormSection title="Logo" description="Upload the partner's official logo (transparent PNG preferred).">
        {v.logoUrl ? (
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.logoUrl} alt="" className="h-20 w-32 rounded-md border border-[var(--color-border)] bg-white object-contain p-2" />
            <button type="button" onClick={() => update("logoUrl", "")} className="text-xs text-[var(--color-brand-700)] hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <label className={cn(
            "flex w-full cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-[var(--color-border)]",
            "bg-[var(--color-surface-muted)] px-6 py-8 text-sm hover:border-[var(--color-brand-300)]",
            status === "uploading" && "opacity-60 pointer-events-none",
          )}>
            {status === "uploading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span>{status === "uploading" ? "Uploading…" : "Click to upload logo"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
          </label>
        )}
      </FormSection>

      <FormSection title="Visibility">
        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-3">
            <span className={cn("inline-flex h-5 w-9 items-center rounded-full transition-colors", v.isVisible ? "bg-[var(--color-brand-600)]" : "bg-neutral-300")}>
              <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", v.isVisible ? "translate-x-4" : "translate-x-0.5")} />
            </span>
            <input type="checkbox" checked={v.isVisible} onChange={(e) => update("isVisible", e.target.checked)} className="sr-only" />
            <span className="text-sm font-medium">Visible on public site</span>
          </label>
          <Field label="Order" htmlFor="order">
            <input id="order" type="number" value={v.order} onChange={(e) => update("order", Number(e.target.value))} className={inputStyles} />
          </Field>
        </div>
      </FormSection>

      {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <div>
          {isEdit && (
            <Button type="button" variant="ghost" onClick={onDelete} disabled={status !== "idle"} className="text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
        <Button type="submit" disabled={status !== "idle"}>
          {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Save changes" : "Create partner"}
        </Button>
      </div>
    </form>
  );
}
