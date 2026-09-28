import type { EventType } from "@/types";
import { eventTypeConfig } from "@/lib/config/event-types";
import { Badge } from "@/components/ui/atoms/badge";
import { cn } from "@/lib/utils";

interface EventTypeBadgeProps {
  type: EventType;
  className?: string;
}

export function EventTypeBadge({ type, className }: EventTypeBadgeProps) {
  const config = eventTypeConfig[type];

  return (
    <Badge variant="outline" className={cn("font-normal", className)}>
      {config.label}
    </Badge>
  );
}
