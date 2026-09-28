import type { AttributionStatus } from "@/types";
import { Badge } from "@/components/ui/atoms/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  AttributionStatus,
  { label: string; colorClass: string }
> = {
  full: { label: "Fully attributed", colorClass: "text-success" },
  partial: { label: "Partial attribution", colorClass: "text-highlight" },
  unknown: { label: "Attribution incomplete", colorClass: "text-muted-foreground" },
};

interface AttributionStatusBadgeProps {
  status: AttributionStatus;
  className?: string;
}

export function AttributionStatusBadge({
  status,
  className,
}: AttributionStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="secondary"
      className={cn("font-normal", config.colorClass, className)}
    >
      {config.label}
    </Badge>
  );
}
