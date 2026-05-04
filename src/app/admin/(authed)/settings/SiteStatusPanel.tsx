"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Megaphone, TriangleAlert } from "lucide-react";
import { FormSection, inputStyles } from "@/components/admin/Field";
import { cn } from "@/lib/utils";

type Props = {
  bannerEnabled: boolean;
  bannerText: string;
  maintenanceEnabled: boolean;
};

function Toggle({
  enabled,
  onChange,
  loading,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={loading}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50",
        enabled ? "bg-[var(--color-brand-600)]" : "bg-[var(--color-border-strong)]",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
          enabled ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

async function saveSetting(key: string, value: string) {
  const res = await fetch("/api/admin/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error("Save failed");
}

export function SiteStatusPanel({ bannerEnabled, bannerText, maintenanceEnabled }: Props) {
  const router = useRouter();
  const [banner, setBanner] = useState(bannerEnabled);
  const [bannerMsg, setBannerMsg] = useState(bannerText);
  const [maintenance, setMaintenance] = useState(maintenanceEnabled);
  const [savingBannerToggle, setSavingBannerToggle] = useState(false);
  const [savingBannerText, setSavingBannerText] = useState(false);
  const [savingMaintenance, setSavingMaintenance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleBanner(val: boolean) {
    setSavingBannerToggle(true);
    setError(null);
    try {
      await saveSetting("bannerEnabled", String(val));
      setBanner(val);
      router.refresh();
    } catch {
      setError("Failed to save banner state");
    } finally {
      setSavingBannerToggle(false);
    }
  }

  async function saveBannerText() {
    setSavingBannerText(true);
    setError(null);
    try {
      await saveSetting("bannerText", bannerMsg);
      router.refresh();
    } catch {
      setError("Failed to save banner text");
    } finally {
      setSavingBannerText(false);
    }
  }

  async function toggleMaintenance(val: boolean) {
    setSavingMaintenance(true);
    setError(null);
    try {
      await saveSetting("maintenanceEnabled", String(val));
      setMaintenance(val);
      router.refresh();
    } catch {
      setError("Failed to save maintenance state");
    } finally {
      setSavingMaintenance(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>
      )}

      {/* Banner */}
      <FormSection title="Announcement banner">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-600)]">
                <Megaphone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">Show banner</p>
                <p className="text-xs text-[var(--color-ink-muted)]">Displays a dismissible strip at the top of every public page</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {savingBannerToggle && <Loader2 className="h-4 w-4 animate-spin text-[var(--color-ink-muted)]" />}
              <Toggle enabled={banner} onChange={toggleBanner} loading={savingBannerToggle} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="bannerText" className="block text-xs font-medium text-[var(--color-ink-muted)] uppercase tracking-wide">
              Banner message
            </label>
            <div className="flex gap-2">
              <input
                id="bannerText"
                value={bannerMsg}
                onChange={(e) => setBannerMsg(e.target.value)}
                placeholder="e.g. Our brand identity is being updated — stay tuned."
                className={cn(inputStyles, "flex-1")}
              />
              <button
                type="button"
                onClick={saveBannerText}
                disabled={savingBannerText}
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-brand-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-700)] disabled:opacity-50"
              >
                {savingBannerText ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Save
              </button>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Maintenance */}
      <FormSection title="Maintenance mode">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              maintenance ? "bg-red-100 text-red-600" : "bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)]",
            )}>
              <TriangleAlert className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">Take site offline</p>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Redirects all public visitors to a maintenance page. Admin panel remains accessible.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savingMaintenance && <Loader2 className="h-4 w-4 animate-spin text-[var(--color-ink-muted)]" />}
            <Toggle enabled={maintenance} onChange={toggleMaintenance} loading={savingMaintenance} />
          </div>
        </div>
        {maintenance && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <strong>Site is offline.</strong> Visitors are seeing the maintenance page. Remember to turn this off when done.
          </div>
        )}
      </FormSection>
    </div>
  );
}
