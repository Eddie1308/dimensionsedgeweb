"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { Field, FormGrid, FormSection, inputStyles } from "@/components/admin/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ProjectFormValue = {
  id?: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  clientName: string;
  locationEn: string;
  locationAr: string;
  year: number | null;
  coverImage: string;
  serviceId: string;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
};

export type ServiceOption = { id: string; titleEn: string };

type Status = "idle" | "saving" | "uploading" | "deleting";

export function ProjectForm({
  initial,
  services,
}: {
  initial: ProjectFormValue;
  services: ServiceOption[];
}) {
  const router = useRouter();
  const [value, setValue] = useState<ProjectFormValue>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(initial.id);

  function update<K extends keyof ProjectFormValue>(key: K, v: ProjectFormValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  async function uploadCover(file: File) {
    setStatus("uploading");
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "Upload failed");
      }
      update("coverImage", data.url);
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
      const url = isEdit ? `/api/admin/projects/${initial.id}` : "/api/admin/projects";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/projects");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setStatus("idle");
    }
  }

  async function onDelete() {
    if (!isEdit) return;
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setStatus("deleting");
    try {
      const res = await fetch(`/api/admin/projects/${initial.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Delete failed");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection title="Identity" description="The slug is the URL segment — lowercase, hyphenated, stable.">
        <FormGrid>
          <Field label="Slug" htmlFor="slug" required hint="e.g. kafd-trading-floor">
            <input
              id="slug"
              required
              value={value.slug}
              onChange={(e) => update("slug", e.target.value)}
              className={inputStyles}
            />
          </Field>
          <Field label="Service" htmlFor="serviceId">
            <select
              id="serviceId"
              value={value.serviceId}
              onChange={(e) => update("serviceId", e.target.value)}
              className={inputStyles}
            >
              <option value="">— None —</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.titleEn}
                </option>
              ))}
            </select>
          </Field>
        </FormGrid>
      </FormSection>

      <FormSection title="Content (English)">
        <FormGrid>
          <Field label="Title (EN)" htmlFor="titleEn" required span={2}>
            <input id="titleEn" required value={value.titleEn} onChange={(e) => update("titleEn", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Summary (EN)" htmlFor="summaryEn" required span={2}>
            <textarea id="summaryEn" required rows={3} value={value.summaryEn} onChange={(e) => update("summaryEn", e.target.value)} className={cn(inputStyles, "resize-y")} />
          </Field>
          <Field label="Description (EN)" htmlFor="descriptionEn" span={2}>
            <textarea id="descriptionEn" rows={6} value={value.descriptionEn} onChange={(e) => update("descriptionEn", e.target.value)} className={cn(inputStyles, "resize-y")} />
          </Field>
        </FormGrid>
      </FormSection>

      <FormSection title="Content (Arabic)" description="Arabic content appears on /ar pages.">
        <FormGrid>
          <Field label="Title (AR)" htmlFor="titleAr" required span={2}>
            <input id="titleAr" required dir="rtl" value={value.titleAr} onChange={(e) => update("titleAr", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Summary (AR)" htmlFor="summaryAr" required span={2}>
            <textarea id="summaryAr" required dir="rtl" rows={3} value={value.summaryAr} onChange={(e) => update("summaryAr", e.target.value)} className={cn(inputStyles, "resize-y")} />
          </Field>
          <Field label="Description (AR)" htmlFor="descriptionAr" span={2}>
            <textarea id="descriptionAr" dir="rtl" rows={6} value={value.descriptionAr} onChange={(e) => update("descriptionAr", e.target.value)} className={cn(inputStyles, "resize-y")} />
          </Field>
        </FormGrid>
      </FormSection>

      <FormSection title="Meta">
        <FormGrid>
          <Field label="Client name" htmlFor="clientName">
            <input id="clientName" value={value.clientName} onChange={(e) => update("clientName", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Year" htmlFor="year">
            <input id="year" type="number" value={value.year ?? ""} onChange={(e) => update("year", e.target.value ? Number(e.target.value) : null)} className={inputStyles} />
          </Field>
          <Field label="Location (EN)" htmlFor="locationEn">
            <input id="locationEn" value={value.locationEn} onChange={(e) => update("locationEn", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Location (AR)" htmlFor="locationAr">
            <input id="locationAr" dir="rtl" value={value.locationAr} onChange={(e) => update("locationAr", e.target.value)} className={inputStyles} />
          </Field>
        </FormGrid>
      </FormSection>

      <FormSection title="Cover image" description="Recommended 1600×1067 (3:2) — the upload pipeline will optimize and convert to WebP automatically.">
        {value.coverImage ? (
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.coverImage} alt="" className="h-32 w-48 rounded-md border border-[var(--color-border)] object-cover" />
            <div className="text-xs text-[var(--color-ink-muted)]">
              <p className="break-all">{value.coverImage}</p>
              <button type="button" onClick={() => update("coverImage", "")} className="mt-2 text-[var(--color-brand-700)] hover:underline">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className={cn(
            "flex w-full cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-[var(--color-border)]",
            "bg-[var(--color-surface-muted)] px-6 py-8 text-sm hover:border-[var(--color-brand-300)]",
            status === "uploading" && "opacity-60 pointer-events-none",
          )}>
            {status === "uploading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span>{status === "uploading" ? "Uploading…" : "Click to upload (JPG/PNG/WebP, ≤10 MB)"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadCover(f);
              }}
            />
          </label>
        )}
      </FormSection>

      <FormSection title="Visibility">
        <div className="flex flex-col gap-4">
          <Toggle
            label="Visible on public site"
            description="Off = staged in catalogue but hidden from the projects page."
            checked={value.isVisible}
            onChange={(v) => update("isVisible", v)}
          />
          <Toggle
            label="Featured"
            description="Featured projects show a star badge and appear in featured collections."
            checked={value.isFeatured}
            onChange={(v) => update("isFeatured", v)}
          />
          <Field label="Display order" htmlFor="order" hint="Lower numbers appear first.">
            <input id="order" type="number" value={value.order} onChange={(e) => update("order", Number(e.target.value))} className={inputStyles} />
          </Field>
        </div>
      </FormSection>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>
      )}

      <div className="flex items-center justify-between gap-3">
        <div>
          {isEdit && (
            <Button type="button" variant="ghost" size="md" onClick={onDelete} disabled={status !== "idle"} className="text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" size="md" disabled={status !== "idle"}>
            {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEdit ? "Save changes" : "Create project"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <span
        className={cn(
          "mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-[var(--color-brand-600)]" : "bg-neutral-300",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span>
        <span className="block text-sm font-medium text-[var(--color-ink)]">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-[var(--color-ink-muted)]">{description}</span>
        )}
      </span>
    </label>
  );
}
