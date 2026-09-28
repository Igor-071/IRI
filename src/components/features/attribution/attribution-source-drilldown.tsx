"use client";

import Link from "next/link";
import type { AcquisitionSource, AttributionModel } from "@/types";
import type { LedgerEntry } from "@/data/ledger";
import { ledger } from "@/data";
import { resolveOpportunitySource } from "@/lib/metrics/attribution-metrics";
import { getSourceLabel } from "@/lib/config/sources";
import { formatMoneyFull } from "@/lib/formatting/money";
import { StageBadge } from "@/components/domain";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface AttributionSourceDrilldownProps {
  source: AcquisitionSource;
  model: AttributionModel;
}

export function AttributionSourceDrilldown({
  source,
  model,
}: AttributionSourceDrilldownProps) {
  const entries: LedgerEntry[] = ledger.filter(
    (entry) => resolveOpportunitySource(entry, model) === source,
  );

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {getSourceLabel(source)} — Drilldown
          </CardTitle>
          <CardDescription className="text-xs">
            No opportunities attributed to this source under the current model.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalValue = entries.reduce((sum, e) => sum + e.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {getSourceLabel(source)} — {entries.length} opportunities
        </CardTitle>
        <CardDescription className="text-xs">
          Total pipeline + revenue: {formatMoneyFull(totalValue)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/accounts/${entry.companyId}`}
              className="group flex items-center justify-between rounded-md border border-border px-3 py-2 hover:bg-accent/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-foreground">
                  {entry.companyName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {entry.opportunityName}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <StageBadge stage={entry.stage} variant="opportunity" />
                <span className="tabular-nums text-sm font-medium text-foreground">
                  {formatMoneyFull(entry.value)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
