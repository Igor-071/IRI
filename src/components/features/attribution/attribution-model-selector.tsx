"use client";

import type { AttributionModel } from "@/types";
import { cn } from "@/lib/utils";

interface AttributionModelSelectorProps {
  value: AttributionModel;
  onChange: (model: AttributionModel) => void;
}

const models: { key: AttributionModel; label: string; description: string }[] =
  [
    {
      key: "first_touch",
      label: "First Touch",
      description:
        "Credits the first marketing interaction that introduced the lead to your brand.",
    },
    {
      key: "last_touch",
      label: "Last Marketing Touch",
      description:
        "Credits the last marketing interaction before the lead converted. Direct is excluded.",
    },
    {
      key: "conversion_touch",
      label: "Conversion Touch",
      description:
        "Credits the channel active during the conversion event (form, call, email).",
    },
  ];

export function AttributionModelSelector({
  value,
  onChange,
}: AttributionModelSelectorProps) {
  const activeModel = models.find((m) => m.key === value) ?? models[0];

  return (
    <div className="space-y-2">
      <div
        role="tablist"
        className="inline-flex items-center rounded-lg border border-border bg-muted/30 p-1"
      >
        {models.map((model) => (
          <button
            key={model.key}
            role="tab"
            aria-selected={value === model.key}
            onClick={() => onChange(model.key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              value === model.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {model.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{activeModel.description}</p>
    </div>
  );
}
