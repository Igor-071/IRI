export function formatPercent(value: number): string {
  const pct = value * 100;
  const formatted = pct % 1 === 0 ? pct.toString() : pct.toFixed(1);
  return `${formatted}%`;
}
