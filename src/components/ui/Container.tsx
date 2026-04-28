import { cn } from "@/lib/utils";

type Width = "narrow" | "default" | "wide" | "full";

const widthClasses: Record<Width, string> = {
  narrow: "max-w-[var(--container-narrow)]",
  default: "max-w-[var(--container-default)]",
  wide: "max-w-[var(--container-wide)]",
  full: "max-w-none",
};

export function Container({
  children,
  className,
  width = "default",
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  width?: Width;
  as?: React.ElementType;
}) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-12",
        widthClasses[width],
        className,
      )}
    >
      {children}
    </Component>
  );
}
