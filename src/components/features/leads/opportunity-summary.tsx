import type { LedgerEntry } from "@/data/ledger";
import { StageBadge } from "@/components/domain/stage-badge";
import { MoneyValue } from "@/components/domain/money-value";
import { DateTime } from "@/components/domain/date-time";
import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

interface OpportunitySummaryProps {
  opportunity: LedgerEntry;
  className?: string;
}

export function OpportunitySummary({
  opportunity,
  className,
}: OpportunitySummaryProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-1.5">
        <Briefcase className="size-3 text-muted-foreground" />
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Opportunity
        </span>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
        <p className="text-sm font-medium text-foreground">
          {opportunity.opportunityName}
        </p>
        <div className="flex items-center gap-2">
          <StageBadge stage={opportunity.stage} variant="opportunity" />
          <MoneyValue value={opportunity.value} full />
        </div>
        {opportunity.expectedClose && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Expected close:</span>
            <DateTime date={opportunity.expectedClose} format="date" className="text-xs" />
          </div>
        )}
        {opportunity.closedAt && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Closed:</span>
            <DateTime date={opportunity.closedAt} format="date" className="text-xs" />
          </div>
        )}
      </div>
    </div>
  );
}
