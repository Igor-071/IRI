"use client";

import Link from "next/link";
import { getRevenueBySource } from "@/lib/metrics";
import { formatMoneyFull } from "@/lib/formatting/money";
import { getSourceLabel } from "@/lib/config/sources";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export function RevenueBySource() {
  const data = getRevenueBySource();
  const max = data[0]?.value ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Revenue by source</CardTitle>
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
                  className="absolute inset-y-0 left-0 rounded-sm bg-success/20 group-hover:bg-success/30 transition-colors"
                  style={{ width: `${(entry.value / max) * 100}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-sm bg-success transition-colors"
                  style={{ width: `${(entry.value / max) * 100}%`, opacity: 0.5 }}
                />
              </div>
              <span className="w-28 shrink-0 text-right text-xs tabular-nums text-foreground">
                {formatMoneyFull(entry.value)}
                <span className="ml-1.5 text-muted-foreground">
                  ({entry.count} {entry.count === 1 ? "deal" : "deals"})
                </span>
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
