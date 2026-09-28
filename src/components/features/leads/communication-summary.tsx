"use client";

import { useMemo } from "react";
import type { Event } from "@/types";
import { getEventsByPersonId } from "@/lib/data/repositories";
import { DateTime } from "@/components/domain/date-time";
import { cn } from "@/lib/utils";
import { Mail, MailOpen, CalendarCheck } from "lucide-react";

interface CommunicationSummaryProps {
  personId: string;
  className?: string;
}

interface CommItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  date: string;
}

function findLastByType(events: Event[], type: string): Event | undefined {
  let last: Event | undefined;
  for (const ev of events) {
    if (ev.type === type) {
      if (!last || ev.timestamp > last.timestamp) {
        last = ev;
      }
    }
  }
  return last;
}

export function CommunicationSummary({
  personId,
  className,
}: CommunicationSummaryProps) {
  const items = useMemo(() => {
    const events = getEventsByPersonId(personId);
    const result: CommItem[] = [];

    const lastInbound = findLastByType(events, "email_received");
    if (lastInbound) {
      result.push({
        icon: <MailOpen className="size-3" />,
        label: "Last inbound email",
        description: lastInbound.description,
        date: lastInbound.timestamp,
      });
    }

    const lastOutbound = findLastByType(events, "email_sent");
    if (lastOutbound) {
      result.push({
        icon: <Mail className="size-3" />,
        label: "Last outbound email",
        description: lastOutbound.description,
        date: lastOutbound.timestamp,
      });
    }

    const lastMeeting = findLastByType(events, "meeting_completed");
    if (lastMeeting) {
      result.push({
        icon: <CalendarCheck className="size-3" />,
        label: "Last meeting",
        description: lastMeeting.description,
        date: lastMeeting.timestamp,
      });
    }

    return result;
  }, [personId]);

  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-1.5">
        <Mail className="size-3 text-muted-foreground" />
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Communication
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-0.5 rounded-lg border border-border bg-card p-3"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{item.icon}</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase">
                {item.label}
              </span>
            </div>
            <p className="text-xs text-foreground line-clamp-2">
              {item.description}
            </p>
            <DateTime
              date={item.date}
              format="relative"
              className="text-[10px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
