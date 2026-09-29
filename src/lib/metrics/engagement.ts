import { getEventsByPersonId } from "@/lib/data/repositories";

export interface PersonEngagement {
  sessions: number;
  pageViews: number;
  contentViewed: number;
  meetings: number;
  emails: number;
  daysToLead: number;
  firstResponseMinutes: number | null;
}

// §7 page-view event types
const PAGE_VIEW_TYPES = new Set([
  "page_viewed",
  "landing_page_viewed",
  "contact_page_viewed",
  "pricing_page_viewed",
  "blog_post_viewed",
  "case_study_viewed",
  "resource_viewed",
]);

export function getPersonEngagement(personId: string): PersonEngagement {
  const events = getEventsByPersonId(personId);

  const sessionIds = new Set<string>();
  let pageViews = 0;
  let contentViewed = 0;
  const meetingIds = new Set<string>();
  let meetingEventsWithoutId = 0;
  let emails = 0;
  let firstResponseMinutes: number | null = null;

  let firstEventTimestamp: string | null = null;
  let leadCreatedTimestamp: string | null = null;

  for (const ev of events) {
    // Track first event
    if (
      firstEventTimestamp === null ||
      ev.timestamp < firstEventTimestamp
    ) {
      firstEventTimestamp = ev.timestamp;
    }

    // Distinct sessions (§7: distinct sessionIds)
    if (ev.sessionId) {
      sessionIds.add(ev.sessionId);
    }

    // Page views (§7: all page-view event types)
    if (PAGE_VIEW_TYPES.has(ev.type)) {
      pageViews++;
    }

    // Content viewed (§7: events in content category)
    if (ev.category === "content") {
      contentViewed++;
    }

    // Meetings (§7: distinct meetingIds)
    if (ev.type === "meeting_booked" || ev.type === "meeting_completed") {
      const meetingId = ev.metadata.meetingId as string | undefined;
      if (meetingId) {
        meetingIds.add(meetingId);
      } else {
        meetingEventsWithoutId++;
      }
    }

    // Emails
    if (ev.type === "email_sent" || ev.type === "email_received") {
      emails++;
    }

    if (ev.type === "lead_created") {
      leadCreatedTimestamp = ev.timestamp;
    }

    // First response time from first email_sent with responseTimeMinutes
    if (
      ev.type === "email_sent" &&
      firstResponseMinutes === null &&
      ev.metadata.responseTimeMinutes != null
    ) {
      firstResponseMinutes = ev.metadata.responseTimeMinutes as number;
    }
  }

  // Meetings: distinct meetingIds + any unpaired meeting events
  const meetings = meetingIds.size + Math.ceil(meetingEventsWithoutId / 2);

  const daysToLead = computeDaysToLead(firstEventTimestamp, leadCreatedTimestamp);

  return {
    sessions: sessionIds.size,
    pageViews,
    contentViewed,
    meetings,
    emails,
    daysToLead,
    firstResponseMinutes,
  };
}

function computeDaysToLead(
  firstEvent: string | null,
  leadCreated: string | null,
): number {
  if (!firstEvent || !leadCreated) return 0;
  const diffMs = new Date(leadCreated).getTime() - new Date(firstEvent).getTime();
  return Math.max(0, Math.floor(diffMs / 86_400_000));
}
