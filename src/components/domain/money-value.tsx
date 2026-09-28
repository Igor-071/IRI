import { formatMoney, formatMoneyFull } from "@/lib/formatting/money";
import { cn } from "@/lib/utils";

interface MoneyValueProps {
  value: number;
  full?: boolean;
  className?: string;
}

export function MoneyValue({ value, full = false, className }: MoneyValueProps) {
  const formatted = full ? formatMoneyFull(value) : formatMoney(value);

  return (
    <span className={cn("tabular-nums text-sm text-foreground", className)}>
      {formatted}
    </span>
  );
}
