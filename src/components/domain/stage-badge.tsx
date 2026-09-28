import type { DisplayStage, OpportunityStage } from "@/types";
import {
  displayStageConfig,
  opportunityStageConfig,
} from "@/lib/config/stages";
import { Badge } from "@/components/ui/atoms/badge";
import { cn } from "@/lib/utils";

interface StageBadgeProps {
  stage: DisplayStage | OpportunityStage;
  variant?: "display" | "opportunity";
  className?: string;
}

export function StageBadge({
  stage,
  variant = "display",
  className,
}: StageBadgeProps) {
  const config =
    variant === "opportunity"
      ? opportunityStageConfig[stage as OpportunityStage]
      : displayStageConfig[stage as DisplayStage];

  if (!config) return null;

  return (
    <Badge
      variant="secondary"
      className={cn("font-normal", config.colorClass, className)}
    >
      {config.label}
    </Badge>
  );
}
