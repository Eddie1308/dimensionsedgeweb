"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function SiteBanner({ text }: { text: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative z-50 bg-[var(--color-brand-700)] px-4 py-2.5 text-center text-sm font-medium text-white">
      <span>{text}</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/20"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
