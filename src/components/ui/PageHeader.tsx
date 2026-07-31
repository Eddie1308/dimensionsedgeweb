import { Container } from "./Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { FadeUp } from "@/components/motion/FadeUp";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "default",
  backgroundImage,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "default" | "ink";
  backgroundImage?: string;
}) {
  // A photo background always needs light-on-dark text for legibility,
  // regardless of what tone the page asked for.
  const inkTone = tone === "ink" || Boolean(backgroundImage);

  return (
    <header
      className={cn(
        "relative overflow-hidden border-b",
        inkTone
          ? "bg-[var(--color-brand-950)] text-[var(--color-brand-50)]"
          : "bg-[var(--color-surface-muted)]",
        inkTone
          ? "border-[var(--color-brand-900)]"
          : "border-[var(--color-border)]",
      )}
    >
      {backgroundImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-contain opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-950)]/90 via-[var(--color-brand-950)]/60 to-transparent" />
        </>
      )}
      <Container className="relative z-10 py-20 lg:py-28">
        <div
          className={cn(
            "max-w-3xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow && (
            <FadeIn>
              <p
                className={cn(
                  "mb-4 text-xs font-semibold uppercase tracking-[0.2em]",
                  inkTone
                    ? "text-[var(--color-accent-400)]"
                    : "text-[var(--color-brand-600)]",
                )}
              >
                {eyebrow}
              </p>
            </FadeIn>
          )}
          <FadeUp delay={0.05}>
            <h1
              className={cn(
                "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
                inkTone
                  ? "text-white"
                  : "text-[var(--color-brand-950)]",
              )}
            >
              {title}
            </h1>
          </FadeUp>
          {subtitle && (
            <FadeUp delay={0.15}>
              <p
                className={cn(
                  "mt-6 text-lg leading-relaxed sm:text-xl",
                  inkTone
                    ? "text-[var(--color-brand-200)]"
                    : "text-[var(--color-ink-muted)]",
                )}
              >
                {subtitle}
              </p>
            </FadeUp>
          )}
        </div>
      </Container>
    </header>
  );
}
