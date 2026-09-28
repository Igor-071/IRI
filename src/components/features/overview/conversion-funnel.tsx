import { getFunnelCounts } from "@/lib/metrics";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const STAGE_LABELS = [
  "Known Leads",
  "Qualified",
  "Opportunities",
  "Proposals",
  "Won",
] as const;

export function ConversionFunnel() {
  const counts = getFunnelCounts();
  const max = counts[0] || 1;

  // Conversion rates between adjacent stages
  const rates: string[] = [];
  for (let i = 1; i < counts.length; i++) {
    const pct = Math.round((counts[i] / counts[i - 1]) * 100);
    rates.push(`${pct}%`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Conversion funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {counts.map((count, i) => (
            <div key={STAGE_LABELS[i]} className="flex flex-col">
              {/* Stage row */}
              <div className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs text-muted-foreground">
                  {STAGE_LABELS[i]}
                </span>
                <div className="relative flex-1 h-5">
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm bg-chart-1"
                    style={{
                      width: `${(count / max) * 100}%`,
                      opacity: 1 - i * 0.15,
                    }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs tabular-nums font-medium text-foreground">
                  {count}
                </span>
              </div>

              {/* Conversion rate between stages */}
              {i < rates.length && (
                <div className="flex items-center gap-3 py-0.5">
                  <span className="w-24 shrink-0" />
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    ↓ {rates[i]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
