"use client";

import Link from "next/link";
import { people } from "@/data";
import { getAttributionStatus } from "@/lib/attribution/status";
import { formatMoney } from "@/lib/formatting/money";
import { ledger } from "@/data/ledger";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface StatusCount {
  full: number;
  partial: number;
  unknown: number;
}

function computeCounts(): StatusCount {
  const counts: StatusCount = { full: 0, partial: 0, unknown: 0 };
  for (const person of people) {
    const status = getAttributionStatus(person);
    counts[status] += 1;
  }
  return counts;
}

function getRelationshipOnlyRevenue(): { value: number; count: number } {
  // Opportunities where firstTouchSource is "unknown" but won
  const unknownWon = ledger.filter(
    (e) => e.stage === "won" && e.firstTouchSource === "unknown",
  );
  return {
    value: unknownWon.reduce((sum, e) => sum + e.value, 0),
    count: unknownWon.length,
  };
}

export function DataQualityPanel() {
  const counts = computeCounts();
  const total = people.length;
  const coveragePct = Math.round((counts.full / total) * 100);
  const relOnly = getRelationshipOnlyRevenue();

  const segments = [
    { label: "Full", count: counts.full, status: "full" as const },
    { label: "Partial", count: counts.partial, status: "partial" as const },
    { label: "Unknown", count: counts.unknown, status: "unknown" as const },
  ];

  const barColors = {
    full: "bg-success",
    partial: "bg-warning",
    unknown: "bg-muted-foreground",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Attribution coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Primary metric */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tabular-nums text-foreground">
              {coveragePct}%
            </span>
            <span className="text-xs text-muted-foreground">
              of leads fully attributed
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
            {segments.map((seg) => (
              <div
                key={seg.status}
                className={barColors[seg.status]}
                style={{ width: `${(seg.count / total) * 100}%` }}
              />
            ))}
          </div>

          {/* Breakdown */}
          <div className="flex gap-4">
            {segments.map((seg) => (
              <Link
                key={seg.status}
                href={`/leads?attribution=${seg.status}`}
                className="group flex items-center gap-1.5 text-xs"
              >
                <span
                  className={`inline-block size-2 rounded-full ${barColors[seg.status]}`}
                />
                <span className="text-muted-foreground group-hover:text-foreground">
                  {seg.count} {seg.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Relationship-only revenue */}
          <p className="text-xs text-muted-foreground">
            Revenue with relationship attribution only:{" "}
            <span className="tabular-nums text-foreground">
              {formatMoney(relOnly.value)}
            </span>{" "}
            ({relOnly.count} {relOnly.count === 1 ? "deal" : "deals"})
          </p>

          {/* CTA */}
          <Link
            href="/leads?attribution=unknown"
            className="inline-flex text-xs font-medium text-primary hover:text-primary/80"
          >
            View unknown-attribution leads →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
