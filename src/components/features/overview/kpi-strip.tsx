import { getOverviewMetrics } from "@/lib/metrics";
import { formatMoneyFull } from "@/lib/formatting/money";
import { formatDuration } from "@/lib/formatting/duration";
import { formatPercent } from "@/lib/formatting/percent";
import { MetricCard } from "./metric-card";

export function KpiStrip() {
  const m = getOverviewMetrics();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MetricCard
        label="Inbound Leads"
        value={m.inboundLeads.toString()}
      />
      <MetricCard
        label="Open Pipeline"
        value={formatMoneyFull(m.openPipeline)}
        context="as of today"
      />
      <MetricCard
        label="Won Revenue"
        value={formatMoneyFull(m.wonRevenue)}
      />
      <MetricCard
        label="Opportunities"
        value={m.opportunities.toString()}
      />
      <MetricCard
        label="Lead → Opportunity"
        value={formatPercent(m.leadToOpportunity)}
      />
      <MetricCard
        label="Avg. First Response"
        value={formatDuration(m.avgFirstResponse)}
      />
    </div>
  );
}
