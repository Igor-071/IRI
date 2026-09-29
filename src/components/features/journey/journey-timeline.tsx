"use client";

import { useMemo } from "react";
import type { Event } from "@/types";
import { getPersonJourney, getAccountJourney } from "@/lib/journeys";
import { getPersonById } from "@/lib/data/repositories";
import { eventTypeConfig } from "@/lib/config/event-types";
import { TIMEZONE, LOCALE } from "@/lib/config/constants";
import { SourceSystemChip } from "@/components/domain/source-system-chip";
import { cn } from "@/lib/utils";

// Category accent colors per design system §35
const categoryAccents: Record<string, string> = {
  acquisition: "bg-dessert",
  website: "bg-muted-foreground",
  content: "bg-muted-foreground",
  conversion: "bg-primary",
  communication: "bg-dessert/60",
  meeting: "bg-accent-foreground",
  crm: "bg-primary/60",
  revenue: "bg-success",
};

// Human-readable category labels
const categoryLabels: Record<string, string> = {
  acquisition: "Acquisition",
  website: "Website",
  content: "Content",
  conversion: "Conversion",
  communication: "Communication",
  meeting: "Meeting",
  crm: "CRM",
  revenue: "Revenue",
};

interface JourneyTimelineProps {
  personId?: string;
  companyId?: string;
  className?: string;
}

interface EventGroup {
  dateLabel: string;
  events: TimelineEvent[];
}

interface TimelineEvent {
  event: Event;
  collapsed?: { count: number };
  actorName?: string;
  /** When a meeting_booked and meeting_completed share a meetingId, merge them */
  mergedMeeting?: { bookedAt: string; completedAt: string; duration?: number };
}

function formatTimeOnly(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  });
}

function formatDayLabel(timestamp: string): string {
  const d = new Date(timestamp);
  return d
    .toLocaleDateString(LOCALE, {
      month: "short",
      day: "numeric",
      timeZone: TIMEZONE,
    })
    .toUpperCase();
}

/**
 * Build a clear, human-readable title for a timeline event.
 * Uses the eventTypeConfig label as the primary title, then adds
 * contextual detail from the event description/metadata.
 */
function buildEventTitle(ev: Event, item: TimelineEvent): string {
  const config = eventTypeConfig[ev.type];

  if (item.collapsed) {
    return `${item.collapsed.count} pages viewed`;
  }

  if (item.mergedMeeting) {
    const dur = item.mergedMeeting.duration;
    return `${ev.description}${dur ? ` (${dur} min)` : ""}`;
  }

  // For high-importance events, use the config label + quoted content if available
  switch (ev.type) {
    case "form_submitted": {
      const content = ev.metadata.content as string | undefined;
      if (content) {
        const truncated = content.length > 80 ? content.slice(0, 77) + "..." : content;
        return `${config.label} — "${truncated}"`;
      }
      return config.label;
    }
    case "booking_submitted":
      return config.label;
    case "email_inquiry_received":
    case "email_inquiry":
      return config.label;
    case "lead_created":
      return config.label;
    case "opportunity_created":
      return ev.description;
    case "proposal_sent":
      return ev.description;
    case "deal_won":
    case "deal_lost":
      return ev.description;
    case "stage_changed":
      return ev.description;
    case "email_sent":
    case "email_received": {
      const subject = ev.metadata.subject as string | undefined;
      return subject ? `${config.label}: ${subject}` : ev.description;
    }
    case "blog_post_viewed": {
      const title = ev.metadata.articleTitle as string | undefined;
      return title ? `Read: ${title}` : ev.description;
    }
    case "case_study_viewed": {
      const title = ev.metadata.caseStudyTitle as string | undefined;
      return title ? `Viewed: ${title}` : ev.description;
    }
    case "page_viewed": {
      const page = ev.metadata.page as string | undefined;
      return page ? `Viewed ${page}` : ev.description;
    }
    default:
      return ev.description || config.label;
  }
}

function collapsePageViews(events: Event[], personNameMap?: Map<string, string>): TimelineEvent[] {
  const result: TimelineEvent[] = [];

  // First pass: merge meeting_booked + meeting_completed by meetingId
  const meetingCompletedByMeetingId = new Map<string, Event>();
  for (const ev of events) {
    if (ev.type === "meeting_completed") {
      const meetingId = ev.metadata.meetingId as string | undefined;
      if (meetingId) meetingCompletedByMeetingId.set(meetingId, ev);
    }
  }

  const skippedEventIds = new Set<string>();
  // Mark meeting_booked events that have a matching completion — we'll merge them
  const mergedBookings = new Map<string, Event>(); // eventId → completed event
  for (const ev of events) {
    if (ev.type === "meeting_booked") {
      const meetingId = ev.metadata.meetingId as string | undefined;
      if (meetingId) {
        const completed = meetingCompletedByMeetingId.get(meetingId);
        if (completed) {
          mergedBookings.set(ev.id, completed);
          skippedEventIds.add(completed.id);
        }
      }
    }
  }

  let i = 0;
  while (i < events.length) {
    const ev = events[i];

    // Skip completed meetings that are merged into their booking
    if (skippedEventIds.has(ev.id)) {
      i++;
      continue;
    }

    const config = eventTypeConfig[ev.type];
    const actorName = personNameMap?.get(ev.personId);

    // Handle merged meetings
    const completedEvent = mergedBookings.get(ev.id);
    if (completedEvent) {
      result.push({
        event: ev,
        actorName,
        mergedMeeting: {
          bookedAt: ev.timestamp,
          completedAt: completedEvent.timestamp,
          duration: completedEvent.metadata.duration as number | undefined,
        },
      });
      i++;
      continue;
    }

    // Collapse consecutive low-importance page_viewed events within same session
    if (ev.type === "page_viewed" && config.importance === "low") {
      let count = 1;
      let j = i + 1;
      while (
        j < events.length &&
        events[j].type === "page_viewed" &&
        events[j].sessionId === ev.sessionId
      ) {
        count++;
        j++;
      }

      if (count > 1) {
        result.push({
          event: ev,
          collapsed: { count },
          actorName,
        });
        i = j;
        continue;
      }
    }

    result.push({ event: ev, actorName });
    i++;
  }

  return result;
}

function groupByDate(events: Event[], personNameMap?: Map<string, string>): EventGroup[] {
  const groups: Map<string, Event[]> = new Map();

  for (const ev of events) {
    const dateKey = formatDayLabel(ev.timestamp);
    const arr = groups.get(dateKey);
    if (arr) arr.push(ev);
    else groups.set(dateKey, [ev]);
  }

  return Array.from(groups.entries()).map(([dateLabel, groupEvents]) => ({
    dateLabel,
    events: collapsePageViews(groupEvents, personNameMap),
  }));
}

export function JourneyTimeline({
  personId,
  companyId,
  className,
}: JourneyTimelineProps) {
  const isAccountMode = !!companyId;

  const events = useMemo(() => {
    if (companyId) return getAccountJourney(companyId);
    if (personId) return getPersonJourney(personId);
    return [];
  }, [personId, companyId]);

  // Build person name lookup for account mode
  const personNameMap = useMemo(() => {
    if (!isAccountMode) return undefined;
    const map = new Map<string, string>();
    for (const ev of events) {
      if (!map.has(ev.personId)) {
        const person = getPersonById(ev.personId);
        if (person) map.set(ev.personId, person.name);
      }
    }
    return map;
  }, [events, isAccountMode]);

  const sourceSystems = useMemo(() => {
    const systems = new Set<string>();
    for (const ev of events) {
      systems.add(ev.sourceSystem);
    }
    return Array.from(systems);
  }, [events]);

  const groups = useMemo(() => groupByDate(events, personNameMap), [events, personNameMap]);

  if (events.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        No journey events found.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Journey assembled from {sourceSystems.length} system{sourceSystems.length !== 1 ? "s" : ""}
        </span>
        <div className="flex flex-wrap gap-1">
          {sourceSystems.map((sys) => (
            <SourceSystemChip key={sys} system={sys} />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.dateLabel}>
            {/* Date label */}
            <div className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground">
              {group.dateLabel}
            </div>

            {/* Events */}
            <div className="flex flex-col gap-0.5">
              {group.events.map((item, idx) => {
                const ev = item.event;
                const config = eventTypeConfig[ev.type];
                const accentColor =
                  categoryAccents[ev.category] ?? "bg-muted-foreground";
                const isHigh = config.importance === "high";
                const isLow = config.importance === "low";
                const catLabel = categoryLabels[ev.category] ?? ev.category;

                const displayTitle = buildEventTitle(ev, item);
                const displayText = item.actorName
                  ? `${item.actorName} \u2014 ${displayTitle}`
                  : displayTitle;

                return (
                  <div
                    key={`${ev.id}-${idx}`}
                    className={cn(
                      "group flex items-start gap-3 rounded px-2 py-1.5",
                      isHigh && "bg-card",
                      isLow && !item.collapsed && "opacity-60"
                    )}
                  >
                    {/* Time */}
                    <span className="w-12 shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {formatTimeOnly(ev.timestamp)}
                    </span>

                    {/* Category accent dot */}
                    <span
                      className={cn(
                        "mt-1.5 size-1.5 shrink-0 rounded-full",
                        accentColor
                      )}
                    />

                    {/* Description + category label */}
                    <div className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "text-sm",
                          isHigh
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {displayText}
                      </span>
                      <span className="ml-2 text-[10px] text-muted-foreground/50">
                        {catLabel}
                      </span>
                    </div>

                    {/* Source system chip — always visible */}
                    <SourceSystemChip
                      system={ev.sourceSystem}
                      className="shrink-0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
