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

function collapsePageViews(events: Event[], personNameMap?: Map<string, string>): TimelineEvent[] {
  const result: TimelineEvent[] = [];
  let i = 0;

  while (i < events.length) {
    const ev = events[i];
    const config = eventTypeConfig[ev.type];
    const actorName = personNameMap?.get(ev.personId);

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

                const description = item.collapsed
                  ? `${item.collapsed.count} pages viewed`
                  : ev.description;

                const displayText = item.actorName
                  ? `${item.actorName} \u2014 ${description}`
                  : description;

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

                    {/* Description */}
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
                    </div>

                    {/* Source system */}
                    <SourceSystemChip
                      system={ev.sourceSystem}
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
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
