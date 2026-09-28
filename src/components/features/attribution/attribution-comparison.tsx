"use client";

import type { AttributionModel } from "@/types";
import { resolvePersonSource } from "@/lib/metrics/attribution-metrics";
import { getPersonById } from "@/lib/data/repositories";
import { getSourceLabel } from "@/lib/config/sources";
import { SourceBadge } from "@/components/domain";
import { formatMoneyFull } from "@/lib/formatting/money";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AttributionComparisonProps {
  activeModel: AttributionModel;
}

const MODELS: { key: AttributionModel; label: string }[] = [
  { key: "first_touch", label: "First Touch" },
  { key: "last_touch", label: "Last Marketing Touch" },
  { key: "conversion_touch", label: "Conversion Touch" },
];

const ACME_OPP_VALUE = 120000;

export function AttributionComparison({
  activeModel,
}: AttributionComparisonProps) {
  const person = getPersonById("person_john_smith");
  if (!person) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Attribution comparison</CardTitle>
        <CardDescription className="text-xs">
          Acme Inc — AI Transformation Platform ({formatMoneyFull(ACME_OPP_VALUE)})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {MODELS.map((model) => {
            const source = resolvePersonSource(person, model.key);
            const isActive = activeModel === model.key;

            return (
              <div
                key={model.key}
                className={cn(
                  "flex flex-col gap-2 rounded-lg border p-3 transition-colors",
                  isActive
                    ? "border-ring bg-accent/50"
                    : "border-border",
                )}
              >
                <span className="text-[11px] font-medium text-muted-foreground">
                  {model.label}
                </span>
                <SourceBadge source={source} />
                <span className="text-xs text-muted-foreground">
                  {getSourceLabel(source)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
