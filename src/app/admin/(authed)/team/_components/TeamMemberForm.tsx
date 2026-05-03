"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { Field, FormGrid, FormSection, inputStyles } from "@/components/admin/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type TeamMemberFormValue = {
  id?: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  department: string;
  photoUrl: string;
  summaryEn: string;
  summaryAr: string;
  bioEn: string;
  bioAr: string;
  order: number;
  isVisible: boolean;
};

export function TeamMemberForm({ initial }: { initial: TeamMemberFormValue }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "uploading" | "deleting">("idle");
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(initial.id);

  function update<K extends keyof TeamMemberFormValue>(k: K, val: TeamMemberFormValue[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  async function uploadPhoto(file: File) {
    setStatus("uploading");
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      update("photoUrl", data.url);
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
      const url = isEdit ? `/api/admin/team/${initial.id}` : "/api/admin/team";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/team");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setStatus("idle");
    }
  }

  async function onDelete() {
    if (!isEdit || !confirm("Delete this team member?")) return;
    setStatus("deleting");
    try {
      const res = await fetch(`/api/admin/team/${initial.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/team");
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
          <Field label="Title (EN)" htmlFor="titleEn" required>
            <input id="titleEn" required value={v.titleEn} onChange={(e) => update("titleEn", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Title (AR)" htmlFor="titleAr" required>
            <input id="titleAr" required dir="rtl" value={v.titleAr} onChange={(e) => update("titleAr", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Department" htmlFor="department" hint="e.g. Executive, Sales, Technical, Operations">
            <input id="department" value={v.department} onChange={(e) => update("department", e.target.value)} className={inputStyles} />
          </Field>
        </FormGrid>
      </FormSection>

      <FormSection title="Photo">
        {v.photoUrl ? (
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.photoUrl} alt="" className="h-24 w-24 rounded-full border border-[var(--color-border)] object-cover" />
            <button type="button" onClick={() => update("photoUrl", "")} className="text-xs text-[var(--color-brand-700)] hover:underline">Remove</button>
          </div>
        ) : (
          <label className={cn("flex w-full cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-8 text-sm hover:border-[var(--color-brand-300)]", status === "uploading" && "opacity-60 pointer-events-none")}>
            {status === "uploading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span>{status === "uploading" ? "Uploading…" : "Click to upload photo"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }} />
          </label>
        )}
      </FormSection>

      <FormSection title="Summary" description="Short one-line description shown under the name.">
        <FormGrid>
          <Field label="Summary (EN)" htmlFor="summaryEn" span={2}>
            <textarea id="summaryEn" rows={2} value={v.summaryEn} onChange={(e) => update("summaryEn", e.target.value)} className={cn(inputStyles, "resize-y")} />
          </Field>
          <Field label="Summary (AR)" htmlFor="summaryAr" span={2}>
            <textarea id="summaryAr" rows={2} dir="rtl" value={v.summaryAr} onChange={(e) => update("summaryAr", e.target.value)} className={cn(inputStyles, "resize-y")} />
          </Field>
        </FormGrid>
      </FormSection>

      <FormSection title="Bio" description="Full biography shown when the user clicks Read more.">
        <FormGrid>
          <Field label="Bio (EN)" htmlFor="bioEn" span={2}>
            <textarea id="bioEn" rows={6} value={v.bioEn} onChange={(e) => update("bioEn", e.target.value)} className={cn(inputStyles, "resize-y")} placeholder="Write the full biography here. Use blank lines to separate paragraphs." />
          </Field>
          <Field label="Bio (AR)" htmlFor="bioAr" span={2}>
            <textarea id="bioAr" rows={6} dir="rtl" value={v.bioAr} onChange={(e) => update("bioAr", e.target.value)} className={cn(inputStyles, "resize-y")} placeholder="اكتب السيرة الذاتية الكاملة هنا." />
          </Field>
        </FormGrid>
      </FormSection>

      <FormSection title="Visibility">
        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-3">
            <span className={cn("inline-flex h-5 w-9 items-center rounded-full transition-colors", v.isVisible ? "bg-[var(--color-brand-600)]" : "bg-neutral-300")}>
              <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", v.isVisible ? "translate-x-4" : "translate-x-0.5")} />
            </span>
            <input type="checkbox" checked={v.isVisible} onChange={(e) => update("isVisible", e.target.checked)} className="sr-only" />
            <span className="text-sm font-medium">Visible on About page</span>
          </label>
          <Field label="Display order" htmlFor="order">
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
          {isEdit ? "Save changes" : "Create member"}
        </Button>
      </div>
    </form>
  );
}
