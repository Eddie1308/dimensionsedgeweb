import {
  Network,
  Cable,
  Speaker,
  Workflow,
  ShieldCheck,
  Camera,
  type LucideProps,
} from "lucide-react";
import type { ServiceContent } from "@/data/services";

const iconMap: Record<ServiceContent["iconKey"], React.ComponentType<LucideProps>> = {
  network: Network,
  cable: Cable,
  speaker: Speaker,
  workflow: Workflow,
  shield: ShieldCheck,
  camera: Camera,
};

export function ServiceIcon({
  iconKey,
  ...rest
}: { iconKey: ServiceContent["iconKey"] } & LucideProps) {
  const Icon = iconMap[iconKey];
  return <Icon {...rest} />;
}
