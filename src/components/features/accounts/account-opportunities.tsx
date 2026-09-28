"use client";

import { useMemo } from "react";
import { getOpportunitiesByCompanyId } from "@/lib/data/repositories";
import { StageBadge } from "@/components/domain/stage-badge";
import { MoneyValue } from "@/components/domain/money-value";
import { OwnerChip } from "@/components/domain/owner-chip";
import { DateTime } from "@/components/domain/date-time";
import { cn } from "@/lib/utils";
import type { OpportunityStage } from "@/types";

interface AccountOpportunitiesProps {
  companyId: string;
  className?: string;
}

export function AccountOpportunities({
  companyId,
  className,
}: AccountOpportunitiesProps) {
  const opportunities = useMemo(
    () => getOpportunitiesByCompanyId(companyId),
    [companyId],
  );

  if (opportunities.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        No opportunities.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {opportunities.map((opp) => (
        <div
          key={opp.id}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-card px-3 py-2.5"
        >
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
            {opp.opportunityName}
          </span>
          <StageBadge stage={opp.stage as OpportunityStage} variant="opportunity" />
          <MoneyValue value={opp.value} full />
          <OwnerChip ownerId={opp.ownerId} />
          {opp.expectedClose && (
            <DateTime date={opp.expectedClose} format="short" className="text-xs" />
          )}
        </div>
      ))}
    </div>
  );
}
