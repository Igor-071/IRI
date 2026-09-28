import type { Opportunity } from "@/types";
import { StageBadge } from "./stage-badge";
import { MoneyValue } from "./money-value";
import { cn } from "@/lib/utils";

interface OpportunityValueProps {
  opportunity: Opportunity;
  className?: string;
}

export function OpportunityValue({
  opportunity,
  className,
}: OpportunityValueProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {opportunity.name}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <MoneyValue value={opportunity.value} />
          <StageBadge stage={opportunity.stage} variant="opportunity" />
        </div>
      </div>
    </div>
  );
}
