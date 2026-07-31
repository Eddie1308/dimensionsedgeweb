import { type Partner } from "@/data/partners";

// Pure CSS animation (no JS/framer-motion) — cheap to run, pauses on hover
// via a CSS-only selector. Track is rendered twice back-to-back so the
// -50% translateX loop is seamless.
export function LogoMarquee({
  partners,
  isAr,
}: {
  partners: Partner[];
  isAr: boolean;
}) {
  const track = (keyPrefix: string) =>
    partners.map((partner) => {
      const name = isAr ? partner.nameAr : partner.nameEn;
      return (
        <div
          key={`${keyPrefix}-${partner.nameEn}`}
          className="flex h-16 w-40 shrink-0 items-center justify-center px-4"
        >
          {partner.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={partner.logoUrl}
              alt={name}
              className="max-h-12 max-w-full object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
          ) : (
            <span
              className="text-lg font-bold tracking-tight text-[var(--color-ink-subtle)] opacity-60 transition-opacity hover:opacity-100"
              dir="ltr"
            >
              {partner.logoText || name}
            </span>
          )}
        </div>
      );
    });

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee items-center [animation-play-state:running] hover:[animation-play-state:paused] rtl:[animation-direction:reverse]">
        {track("a")}
        {track("b")}
      </div>
    </div>
  );
}
