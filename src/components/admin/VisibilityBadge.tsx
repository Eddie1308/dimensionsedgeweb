import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function VisibilityBadge({ visible }: { visible: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        visible
          ? "bg-emerald-100 text-emerald-700"
          : "bg-neutral-200 text-neutral-700",
      )}
    >
      {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {visible ? "Visible" : "Hidden"}
    </span>
  );
}
