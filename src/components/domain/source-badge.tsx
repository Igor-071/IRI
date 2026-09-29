import type { AcquisitionSource } from "@/types";
import { sourceConfig } from "@/lib/config/sources";
import { Badge } from "@/components/ui/atoms/badge";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: AcquisitionSource;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const config = sourceConfig[source];

  if (!config) {
    return (
      <Badge variant="secondary" className={cn("font-normal text-muted-foreground", className)}>
        {source}
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn("font-normal", config.colorClass, className)}
    >
      {config.label}
    </Badge>
  );
}
