import { Suspense } from "react";
import { AnalyticsLayout } from "@/components/layout";
import { DateRangeSelector } from "@/components/domain/date-range-selector";
import { KpiStrip } from "@/components/features/overview/kpi-strip";
import { PipelineBySource } from "@/components/features/overview/pipeline-by-source";
import { DataQualityPanel } from "@/components/features/overview/data-quality-panel";
import { RevenueBySource } from "@/components/features/overview/revenue-by-source";
import { ConversionFunnel } from "@/components/features/overview/conversion-funnel";
import { RecentInbound } from "@/components/features/overview/recent-inbound";

export default function OverviewPage() {
  return (
    <AnalyticsLayout
      title="Overview"
      subtitle="Inbound performance across acquisition, conversion, pipeline and revenue."
      actions={
        <Suspense>
          <DateRangeSelector />
        </Suspense>
      }
    >
      <div className="flex flex-col gap-6">
        {/* KPI strip */}
        <KpiStrip />

        {/* Pipeline by Source + Attribution Coverage */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PipelineBySource />
          <DataQualityPanel />
        </div>

        {/* Revenue by Source + Conversion Funnel */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueBySource />
          <ConversionFunnel />
        </div>

        {/* Recent Inbound */}
        <RecentInbound />
      </div>
    </AnalyticsLayout>
  );
}
