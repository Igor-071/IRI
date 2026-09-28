import { CURRENCY, LOCALE } from "@/lib/config/constants";

export function formatMoney(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const formatted = millions % 1 === 0 ? millions.toString() : millions.toFixed(1);
    return `€${formatted}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    const formatted = thousands % 1 === 0 ? thousands.toString() : thousands.toFixed(1);
    return `€${formatted}K`;
  }
  return `€${value}`;
}

export function formatMoneyFull(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
