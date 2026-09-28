"use client";

import { useMemo } from "react";
import { getAccountMetrics } from "@/lib/metrics/account-metrics";
import { formatMoneyFull } from "@/lib/formatting/money";
import { formatRelativeDate } from "@/lib/formatting/dates";
import { cn } from "@/lib/utils";
import {
  Users,
  Globe,
  Target,
  DollarSign,
  CalendarClock,
  Activity,
} from "lucide-react";

interface AccountKpiStripProps {
  companyId: string;
  className?: string;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

export function AccountKpiStrip({
  companyId,
  className,
}: AccountKpiStripProps) {
  const metrics = useMemo(() => getAccountMetrics(companyId), [companyId]);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-card px-4 py-3",
        className,
      )}
    >
      <StatItem
        icon={<Users className="size-3" />}
        label="Known Contacts"
        value={metrics.knownContacts}
      />
      <StatItem
        icon={<Globe className="size-3" />}
        label="Sessions"
        value={metrics.sessions}
      />
      <StatItem
        icon={<Target className="size-3" />}
        label="Open Opps"
        value={metrics.openOpportunities}
      />
      <StatItem
        icon={<DollarSign className="size-3" />}
        label="Open Pipeline"
        value={metrics.openPipeline > 0 ? formatMoneyFull(metrics.openPipeline) : "\u2014"}
      />
      <StatItem
        icon={<CalendarClock className="size-3" />}
        label="First Seen"
        value={metrics.firstSeen ? formatRelativeDate(metrics.firstSeen) : "\u2014"}
      />
      <StatItem
        icon={<Activity className="size-3" />}
        label="Last Activity"
        value={metrics.lastActivity ? formatRelativeDate(metrics.lastActivity) : "\u2014"}
      />
    </div>
  );
}
