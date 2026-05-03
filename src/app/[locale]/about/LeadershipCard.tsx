"use client";

import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";

type TeamCardProps = {
  name: string;
  title: string;
  department: string | null;
  photoUrl: string | null;
  summary: string;
  bio: string | null;
  readMore: string;
  readLess: string;
};

export function LeadershipCard({ name, title, department, photoUrl, summary, bio, readMore, readLess }: TeamCardProps) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = bio ? bio.split(/\n\n+/).filter(Boolean) : [];

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow hover:shadow-md">
      {/* Photo */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--color-surface-muted)]">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="h-20 w-20 text-[var(--color-border)]" />
          </div>
        )}
      </div>

      <div className="p-6">
        {department && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-500)]">
            {department}
          </p>
        )}
        <h3 className="text-xl font-bold text-[var(--color-brand-950)]">{name}</h3>
        <p className="mt-1 text-sm font-medium text-[var(--color-ink-muted)]">{title}</p>
        {summary && <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{summary}</p>}

        {paragraphs.length > 0 && (
          <>
            <div className={cn(
              "overflow-hidden transition-all duration-500",
              expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
            )}>
              <div className="mt-4 space-y-3 border-t border-[var(--color-border)] pt-4">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{para}</p>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)]"
            >
              {expanded ? readLess : readMore}
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", expanded && "rotate-180")} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
