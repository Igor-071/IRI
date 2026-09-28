import type { AttributionMetrics } from "@/lib/metrics/attribution-metrics";
import { MetricCard } from "@/components/features/overview/metric-card";
import { formatMoney, formatMoneyFull } from "@/lib/formatting/money";

interface AttributionKpiStripProps {
  metrics: AttributionMetrics;
}

export function AttributionKpiStrip({ metrics }: AttributionKpiStripProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <MetricCard
        label="Attributed Leads"
        value={metrics.totalLeads.toString()}
      />
      <MetricCard
        label="Open Pipeline"
        value={formatMoney(metrics.totalOpenPipeline)}
      />
      <MetricCard
        label="Won Revenue"
        value={formatMoney(metrics.totalWonRevenue)}
      />
      <MetricCard
        label="Avg Won Deal"
        value={formatMoneyFull(metrics.avgWonDeal)}
      />
    </div>
  );
}
