"use client";

import { useState } from "react";
import type { AttributionModel } from "@/types";
import type { AttributionSourceRow } from "@/lib/metrics/attribution-metrics";
import { formatMoney } from "@/lib/formatting/money";
import { getSourceLabel } from "@/lib/config/sources";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChartMetric = "openPipeline" | "revenue" | "opportunities" | "leads";

const metricOptions: { key: ChartMetric; label: string }[] = [
  { key: "openPipeline", label: "Pipeline" },
  { key: "revenue", label: "Revenue" },
  { key: "opportunities", label: "Opportunities" },
  { key: "leads", label: "Leads" },
];

interface AttributionSourceChartProps {
  rows: AttributionSourceRow[];
  model: AttributionModel;
  activeSource: string | null;
  onSourceClick: (source: string) => void;
}

function formatMetricValue(metric: ChartMetric, value: number): string {
  if (metric === "openPipeline" || metric === "revenue") {
    return formatMoney(value);
  }
  return value.toString();
}

export function AttributionSourceChart({
  rows,
  model,
  activeSource,
  onSourceClick,
}: AttributionSourceChartProps) {
  const [chartMetric, setChartMetric] = useState<ChartMetric>("openPipeline");

  // Filter Direct for first_touch/last_touch models
  const filteredRows =
    model === "conversion_touch"
      ? rows
      : rows.filter((r) => r.source !== "direct");

  // Sort by selected metric descending
  const sorted = [...filteredRows].sort(
    (a, b) => b[chartMetric] - a[chartMetric],
  );

  const max = sorted[0]?.[chartMetric] ?? 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Sources</CardTitle>
          <div className="inline-flex items-center rounded-md border border-border bg-muted/30 p-0.5">
            {metricOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setChartMetric(opt.key)}
                className={cn(
                  "rounded px-2 py-1 text-[11px] font-medium transition-colors",
                  chartMetric === opt.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2.5">
          {sorted.map((entry) => {
            const value = entry[chartMetric];
            const widthPct = max > 0 ? (value / max) * 100 : 0;

            return (
              <button
                key={entry.source}
                onClick={() => onSourceClick(entry.source)}
                className={cn(
                  "group flex items-center gap-3 text-left",
                  activeSource === entry.source && "ring-1 ring-ring rounded-sm",
                )}
              >
                <span className="w-28 shrink-0 truncate text-xs text-muted-foreground group-hover:text-foreground">
                  {getSourceLabel(entry.source)}
                </span>
                <div className="relative flex-1 h-5">
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm bg-chart-1/20 group-hover:bg-chart-1/30 transition-colors"
                    style={{ width: `${widthPct}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm bg-chart-1 transition-colors"
                    style={{ width: `${widthPct}%`, opacity: 0.6 }}
                  />
                </div>
                <span className="w-20 shrink-0 text-right text-xs tabular-nums text-foreground">
                  {formatMetricValue(chartMetric, value)}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
