import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  context?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  context,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3",
        className,
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
        {value}
      </span>
      {context && (
        <span className="text-[11px] text-muted-foreground">{context}</span>
      )}
    </div>
  );
}
