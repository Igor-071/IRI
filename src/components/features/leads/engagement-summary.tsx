"use client";

import { useMemo } from "react";
import { getPersonEngagement } from "@/lib/metrics/engagement";
import { formatDuration } from "@/lib/formatting/duration";
import { cn } from "@/lib/utils";
import {
  Globe,
  Eye,
  FileText,
  CalendarCheck,
  Mail,
  Clock,
  Zap,
} from "lucide-react";

interface EngagementSummaryProps {
  personId: string;
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

export function EngagementSummary({
  personId,
  className,
}: EngagementSummaryProps) {
  const engagement = useMemo(
    () => getPersonEngagement(personId),
    [personId],
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-card px-4 py-3",
        className,
      )}
    >
      <StatItem
        icon={<Globe className="size-3" />}
        label="Sessions"
        value={engagement.sessions}
      />
      <StatItem
        icon={<Eye className="size-3" />}
        label="Page Views"
        value={engagement.pageViews}
      />
      <StatItem
        icon={<FileText className="size-3" />}
        label="Content"
        value={engagement.contentViewed}
      />
      <StatItem
        icon={<CalendarCheck className="size-3" />}
        label="Meetings"
        value={engagement.meetings}
      />
      <StatItem
        icon={<Mail className="size-3" />}
        label="Emails"
        value={engagement.emails}
      />
      <StatItem
        icon={<Clock className="size-3" />}
        label="Days to Lead"
        value={engagement.daysToLead}
      />
      <StatItem
        icon={<Zap className="size-3" />}
        label="First Response"
        value={
          engagement.firstResponseMinutes != null
            ? formatDuration(engagement.firstResponseMinutes)
            : "\u2014"
        }
      />
    </div>
  );
}
