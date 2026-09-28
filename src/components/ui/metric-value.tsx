import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface MetricValueProps {
  value: string;
  label: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "flat";
  };
  className?: string;
}

const trendIcons = {
  up: ArrowUp,
  down: ArrowDown,
  flat: Minus,
};

const trendColors = {
  up: "text-success",
  down: "text-destructive",
  flat: "text-muted-foreground",
};

export function MetricValue({ value, label, trend, className }: MetricValueProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </span>
        {trend && (
          <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", trendColors[trend.direction])}>
            {(() => {
              const Icon = trendIcons[trend.direction];
              return <Icon className="size-3" />;
            })()}
            {trend.value}
          </span>
        )}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
