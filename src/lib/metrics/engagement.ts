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

export function getPersonEngagement(personId: string): PersonEngagement {
  const events = getEventsByPersonId(personId);

  let sessions = 0;
  let pageViews = 0;
  let contentViewed = 0;
  let meetings = 0;
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

    switch (ev.type) {
      case "session_started":
        sessions++;
        break;
      case "page_viewed":
        pageViews++;
        break;
      case "case_study_viewed":
      case "blog_post_viewed":
        contentViewed++;
        break;
      case "meeting_booked":
      case "meeting_completed":
        meetings++;
        break;
      case "email_sent":
      case "email_received":
        emails++;
        break;
      case "lead_created":
        leadCreatedTimestamp = ev.timestamp;
        break;
    }

    // First response time from first email_sent with responseTimeMinutes
    if (
      ev.type === "email_sent" &&
      firstResponseMinutes === null &&
      ev.metadata.responseTimeMinutes != null
    ) {
      firstResponseMinutes = ev.metadata.responseTimeMinutes;
    }
  }

  const daysToLead = computeDaysToLead(firstEventTimestamp, leadCreatedTimestamp);

  return {
    sessions,
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
