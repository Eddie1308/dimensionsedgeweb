import { cn } from "@/lib/utils";

// Visual placeholder until real logo files are uploaded. Renders the brand
// abbreviation in a styled monogram with the partner/client name below.
// Component-level swap: when admin uploads a real logoUrl, render <img> instead.
export function BrandedLogo({
  text,
  name,
  logoUrl,
  className,
}: {
  text: string;
  name?: string;
  logoUrl?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-24 w-full items-center justify-center rounded-md bg-[var(--color-surface)] " +
          "border border-[var(--color-border)] px-4 transition-colors group-hover:border-[var(--color-brand-300)]",
        className,
      )}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={name ?? text}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <span
          className="text-xl font-bold tracking-tight text-[var(--color-brand-700)]"
          dir="ltr"
        >
          {text}
        </span>
      )}
    </div>
  );
}
