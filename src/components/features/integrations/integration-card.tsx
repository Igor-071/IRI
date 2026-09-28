import type { Integration, IntegrationStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/status-dot";
import { DateTime } from "@/components/domain/date-time";
import { LOCALE } from "@/lib/config/constants";

const statusDotMap: Record<
  IntegrationStatus,
  "connected" | "warning" | "error" | "inactive"
> = {
  connected: "connected",
  attention: "warning",
  disconnected: "error",
  archived: "inactive",
};

const statusLabelMap: Record<IntegrationStatus, string> = {
  connected: "Connected",
  attention: "Needs attention",
  disconnected: "Disconnected",
  archived: "Archived",
};

function formatRecordCount(count: number): string {
  return count.toLocaleString(LOCALE);
}

interface IntegrationCardProps {
  integration: Integration;
  highlight?: boolean;
}

export function IntegrationCard({ integration, highlight }: IntegrationCardProps) {
  const { name, description, status, lastSync, recordCount, attentionNote } =
    integration;

  return (
    <Card className={highlight ? "ring-1 ring-primary/30" : undefined}>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
          {highlight && (
            <p className="mt-1 text-xs text-primary">
              Enables person-level journey stitching.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <StatusDot status={statusDotMap[status]} size="sm" />
            <span className="text-xs text-muted-foreground">
              {statusLabelMap[status]}
            </span>
          </div>
          {attentionNote && (
            <p className="text-xs text-warning">{attentionNote}</p>
          )}
        </div>

        <div className="space-y-0.5 text-xs text-muted-foreground">
          {lastSync && (
            <div className="flex items-center gap-1">
              <span>Last sync</span>
              <span>·</span>
              <DateTime date={lastSync} format="relative" className="text-xs" />
            </div>
          )}
          {recordCount != null && (
            <p>{formatRecordCount(recordCount)} records</p>
          )}
        </div>

        <Button variant="outline" size="sm" className="w-full" disabled>
          Manage
        </Button>
      </CardContent>
    </Card>
  );
}
