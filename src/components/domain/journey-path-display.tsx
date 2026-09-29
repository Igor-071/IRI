import { cn } from "@/lib/utils";
import { sourceConfig } from "@/lib/config/sources";
import type { JourneyPathSegment } from "@/lib/journeys";

interface JourneyPathDisplayProps {
  segments: JourneyPathSegment[];
}

export function JourneyPathDisplay({ segments }: JourneyPathDisplayProps) {
  if (segments.length === 0) {
    return <span className="text-xs text-muted-foreground">{"\u2014"}</span>;
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-0.5 text-xs">
      {segments.map((seg, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          {i > 0 && (
            <span className="text-muted-foreground/50">{"\u2192"}</span>
          )}
          <span
            className={cn(
              "whitespace-nowrap",
              seg.isConversion
                ? "font-medium text-primary"
                : seg.source
                  ? sourceConfig[seg.source].colorClass
                  : "text-muted-foreground",
            )}
          >
            {seg.label}
          </span>
        </span>
      ))}
    </span>
  );
}
