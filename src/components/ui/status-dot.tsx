import { cn } from "@/lib/utils";

type StatusDotStatus = "connected" | "warning" | "error" | "inactive";

const statusClasses: Record<StatusDotStatus, string> = {
  connected: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  inactive: "bg-muted-foreground",
};

interface StatusDotProps {
  status: StatusDotStatus;
  size?: "sm" | "md";
  className?: string;
}

export function StatusDot({ status, size = "sm", className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full",
        size === "sm" ? "size-1.5" : "size-2.5",
        statusClasses[status],
        className
      )}
      aria-label={status}
    />
  );
}
