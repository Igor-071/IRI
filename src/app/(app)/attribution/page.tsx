"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";
import type { AttributionModel, AcquisitionSource } from "@/types";
import { AnalyticsLayout } from "@/components/layout";
import { DateRangeSelector } from "@/components/domain/date-range-selector";
import { getAttributionMetrics } from "@/lib/metrics/attribution-metrics";
import { AttributionModelSelector } from "@/components/features/attribution/attribution-model-selector";
import { AttributionKpiStrip } from "@/components/features/attribution/attribution-kpi-strip";
import { AttributionSourceChart } from "@/components/features/attribution/attribution-source-chart";
import { AttributionTable } from "@/components/features/attribution/attribution-table";
import { AttributionComparison } from "@/components/features/attribution/attribution-comparison";
import { AttributionSourceDrilldown } from "@/components/features/attribution/attribution-source-drilldown";

const VALID_MODELS = new Set<string>([
  "first_touch",
  "last_touch",
  "conversion_touch",
]);

function AttributionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const modelParam = searchParams.get("model") ?? "first_touch";
  const model: AttributionModel = VALID_MODELS.has(modelParam)
    ? (modelParam as AttributionModel)
    : "first_touch";

  const sourceParam = searchParams.get("source");

  const metrics = useMemo(() => getAttributionMetrics(model), [model]);

  const setModel = useCallback(
    (newModel: AttributionModel) => {
      const params = new URLSearchParams();
      params.set("model", newModel);
      // Clear source when switching models
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  const setSource = useCallback(
    (source: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("source") === source) {
        params.delete("source");
      } else {
        params.set("source", source);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <AnalyticsLayout
      title="Attribution"
      subtitle="Connect marketing activity to pipeline and revenue."
      actions={<DateRangeSelector />}
    >
      <div className="flex flex-col gap-6">
        <AttributionModelSelector value={model} onChange={setModel} />

        <AttributionKpiStrip metrics={metrics} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AttributionSourceChart
            rows={metrics.rows}
            model={model}
            activeSource={sourceParam}
            onSourceClick={setSource}
          />
          <AttributionComparison activeModel={model} />
        </div>

        <AttributionTable
          rows={metrics.rows}
          model={model}
          onSourceClick={setSource}
        />

        {sourceParam && (
          <AttributionSourceDrilldown
            source={sourceParam as AcquisitionSource}
            model={model}
          />
        )}
      </div>
    </AnalyticsLayout>
  );
}

export default function AttributionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
          Loading attribution…
        </div>
      }
    >
      <AttributionContent />
    </Suspense>
  );
}
