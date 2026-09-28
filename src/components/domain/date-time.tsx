import {
  formatDate,
  formatDateTime,
  formatRelativeDate,
  formatShortDate,
} from "@/lib/formatting/dates";
import { cn } from "@/lib/utils";

interface DateTimeProps {
  date: string;
  format?: "date" | "datetime" | "relative" | "short";
  className?: string;
}

const formatters = {
  date: formatDate,
  datetime: formatDateTime,
  relative: formatRelativeDate,
  short: formatShortDate,
};

export function DateTime({
  date,
  format = "date",
  className,
}: DateTimeProps) {
  const formatted = formatters[format](date);

  return (
    <time
      dateTime={date}
      className={cn("text-sm text-muted-foreground", className)}
    >
      {formatted}
    </time>
  );
}
