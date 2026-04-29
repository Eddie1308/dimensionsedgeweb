import {
  Network,
  Speaker,
  Camera,
  Lock,
  Megaphone,
  Flame,
  Building2,
  type LucideProps,
} from "lucide-react";
import type { ServiceContent } from "@/data/services";

const iconMap: Record<ServiceContent["iconKey"], React.ComponentType<LucideProps>> = {
  network: Network,
  speaker: Speaker,
  camera: Camera,
  lock: Lock,
  megaphone: Megaphone,
  flame: Flame,
  building: Building2,
};

export function ServiceIcon({
  iconKey,
  ...rest
}: { iconKey: ServiceContent["iconKey"] } & LucideProps) {
  const Icon = iconMap[iconKey];
  return <Icon {...rest} />;
}
