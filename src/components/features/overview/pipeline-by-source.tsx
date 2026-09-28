"use client";

import Link from "next/link";
import { getPipelineBySource } from "@/lib/metrics";
import { formatMoneyFull } from "@/lib/formatting/money";
import { getSourceLabel } from "@/lib/config/sources";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function PipelineBySource() {
  const data = getPipelineBySource();
  const max = data[0]?.value ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Pipeline by source</CardTitle>
        <CardDescription className="text-xs">
          First Touch · change model in Attribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2.5">
          {data.map((entry) => (
            <Link
              key={entry.source}
              href={`/attribution?source=${entry.source}`}
              className="group flex items-center gap-3"
            >
              <span className="w-28 shrink-0 truncate text-xs text-muted-foreground group-hover:text-foreground">
                {getSourceLabel(entry.source)}
              </span>
              <div className="relative flex-1 h-5">
                <div
                  className="absolute inset-y-0 left-0 rounded-sm bg-chart-1/20 group-hover:bg-chart-1/30 transition-colors"
                  style={{ width: `${(entry.value / max) * 100}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-sm bg-chart-1 transition-colors"
                  style={{ width: `${(entry.value / max) * 100}%`, opacity: 0.6 }}
                />
              </div>
              <span className="w-20 shrink-0 text-right text-xs tabular-nums text-foreground">
                {formatMoneyFull(entry.value)}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
