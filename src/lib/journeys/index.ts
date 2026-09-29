import type {
  AcquisitionSource,
  Event,
  Session,
  ConversionMechanism,
  EventType,
} from "@/types";
import { events, people, sessions } from "@/data";
import { sourceConfig, isMarketingTouch } from "@/lib/config/sources";
import { NOW } from "@/lib/config/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface JourneyPathSegment {
  label: string;
  source?: AcquisitionSource;
  isConversion: boolean;
}

// ---------------------------------------------------------------------------
// Conversion-mechanism labels
// ---------------------------------------------------------------------------
const CONVERSION_MECHANISM_LABELS: Record<ConversionMechanism, string> = {
  contact_form: "Contact Form",
  book_a_call: "Book a Call",
  email_inquiry: "Email Inquiry",
  newsletter_signup: "Newsletter Signup",
};

// Map event types to conversion mechanisms (same mapping as touchpoints.ts)
const EVENT_TYPE_TO_MECHANISM: Partial<
  Record<EventType, ConversionMechanism>
> = {
  form_submitted: "contact_form",
  booking_submitted: "book_a_call",
  email_inquiry: "email_inquiry",
  email_inquiry_received: "email_inquiry",
  newsletter_signup: "newsletter_signup",
};

const CONVERSION_EVENT_TYPES: Set<EventType> = new Set(
  Object.keys(EVENT_TYPE_TO_MECHANISM) as EventType[],
);

// ---------------------------------------------------------------------------
// Lazy lookup maps
// ---------------------------------------------------------------------------
let _personEventsMap: Map<string, Event[]> | null = null;
function getPersonEventsMap(): Map<string, Event[]> {
  if (!_personEventsMap) {
    _personEventsMap = new Map();
    for (const e of events) {
      const arr = _personEventsMap.get(e.personId);
      if (arr) arr.push(e);
      else _personEventsMap.set(e.personId, [e]);
    }
  }
  return _personEventsMap;
}

let _personSessionsMap: Map<string, Session[]> | null = null;
function getPersonSessionsMap(): Map<string, Session[]> {
  if (!_personSessionsMap) {
    _personSessionsMap = new Map();
    for (const s of sessions) {
      const arr = _personSessionsMap.get(s.personId);
      if (arr) arr.push(s);
      else _personSessionsMap.set(s.personId, [s]);
    }
  }
  return _personSessionsMap;
}

// ---------------------------------------------------------------------------
// 1. getPersonJourney
// ---------------------------------------------------------------------------

/**
 * Returns all events for a person sorted chronologically (by timestamp).
 */
export function getPersonJourney(personId: string): Event[] {
  const personEvents = getPersonEventsMap().get(personId) ?? [];
  return personEvents
    .slice()
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

// ---------------------------------------------------------------------------
// 2. getAccountJourney
// ---------------------------------------------------------------------------

/**
 * Gets all people at the company and aggregates all their events
 * sorted chronologically.
 */
export function getAccountJourney(companyId: string): Event[] {
  const companyPeople = people.filter((p) => p.companyId === companyId);
  const allEvents: Event[] = [];
  const eventsMap = getPersonEventsMap();

  for (const person of companyPeople) {
    const personEvents = eventsMap.get(person.id) ?? [];
    allEvents.push(...personEvents);
  }

  return allEvents.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

// ---------------------------------------------------------------------------
// 3. getJourneyPath
// ---------------------------------------------------------------------------

/**
 * Derives the journey path string.
 *
 * For each session (sorted by startedAt), adds the source label from
 * sourceConfig. Consecutive identical sources are deduplicated. If a
 * conversion event is found across any session, the conversion mechanism
 * label is appended at the end.
 *
 * Example: "Google Organic -> LinkedIn Organic -> Direct -> Contact Form"
 */
export function getJourneyPath(personId: string): string {
  const personSessions = (getPersonSessionsMap().get(personId) ?? [])
    .slice()
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  const eventsMap = getPersonEventsMap();
  const personEvents = eventsMap.get(personId) ?? [];

  // Build source path with deduplication of consecutive identical sources
  const pathParts: string[] = [];
  for (const session of personSessions) {
    const label = sourceConfig[session.source].label;
    if (pathParts.length === 0 || pathParts[pathParts.length - 1] !== label) {
      pathParts.push(label);
    }
  }

  // Find conversion mechanism from events
  const conversionEvent = personEvents.find((e) =>
    CONVERSION_EVENT_TYPES.has(e.type),
  );
  if (conversionEvent) {
    const mechanism = EVENT_TYPE_TO_MECHANISM[conversionEvent.type];
    if (mechanism) {
      pathParts.push(CONVERSION_MECHANISM_LABELS[mechanism]);
    }
  }

  return pathParts.join(" \u2192 ");
}

// ---------------------------------------------------------------------------
// 4. getAccountEarliestTouch
// ---------------------------------------------------------------------------

/**
 * Finds the earliest session across all people at the company.
 * Returns the source label, person name, and timestamp.
 */
export function getAccountEarliestTouch(
  companyId: string,
): { source: string; personName: string; timestamp: string } | undefined {
  const companyPeople = people.filter((p) => p.companyId === companyId);
  const sessionsMap = getPersonSessionsMap();

  let earliest: Session | undefined;
  let earliestPerson: (typeof companyPeople)[number] | undefined;

  for (const person of companyPeople) {
    const personSessions = sessionsMap.get(person.id) ?? [];
    for (const session of personSessions) {
      if (
        !earliest ||
        session.startedAt.localeCompare(earliest.startedAt) < 0
      ) {
        earliest = session;
        earliestPerson = person;
      }
    }
  }

  if (!earliest || !earliestPerson) return undefined;

  return {
    source: sourceConfig[earliest.source].label,
    personName: earliestPerson.name,
    timestamp: earliest.startedAt,
  };
}

// ---------------------------------------------------------------------------
// 5. getAccountLatestMarketingTouch
// ---------------------------------------------------------------------------

/**
 * Finds the latest marketing session across all people at the company.
 * Uses `isMarketingTouch` to filter sessions.
 */
export function getAccountLatestMarketingTouch(
  companyId: string,
): { source: string; personName: string; timestamp: string } | undefined {
  const companyPeople = people.filter((p) => p.companyId === companyId);
  const sessionsMap = getPersonSessionsMap();

  let latest: Session | undefined;
  let latestPerson: (typeof companyPeople)[number] | undefined;

  for (const person of companyPeople) {
    const personSessions = sessionsMap.get(person.id) ?? [];
    for (const session of personSessions) {
      if (!isMarketingTouch(session.source)) continue;
      if (
        !latest ||
        session.startedAt.localeCompare(latest.startedAt) > 0
      ) {
        latest = session;
        latestPerson = person;
      }
    }
  }

  if (!latest || !latestPerson) return undefined;

  return {
    source: sourceConfig[latest.source].label,
    personName: latestPerson.name,
    timestamp: latest.startedAt,
  };
}

// ---------------------------------------------------------------------------
// 6. getJourneyTouchCount
// ---------------------------------------------------------------------------

/**
 * Returns the number of sessions (touches) for a person.
 */
export function getJourneyTouchCount(personId: string): number {
  return (getPersonSessionsMap().get(personId) ?? []).length;
}

// ---------------------------------------------------------------------------
// 7. getJourneyDurationMinutes
// ---------------------------------------------------------------------------

/**
 * Returns journey duration in minutes: first session → conversion event (or NOW).
 */
export function getJourneyDurationMinutes(personId: string): number {
  const personSessions = getPersonSessionsMap().get(personId) ?? [];
  if (personSessions.length === 0) return 0;

  const earliest = personSessions.reduce((a, b) =>
    a.startedAt.localeCompare(b.startedAt) < 0 ? a : b,
  );

  const personEvents = getPersonEventsMap().get(personId) ?? [];
  const conversionEvent = personEvents.find((e) =>
    CONVERSION_EVENT_TYPES.has(e.type),
  );

  const startTime = new Date(earliest.startedAt).getTime();
  const endTime = conversionEvent
    ? new Date(conversionEvent.timestamp).getTime()
    : NOW.getTime();

  return Math.max(0, (endTime - startTime) / 60_000);
}

// ---------------------------------------------------------------------------
// 8. getJourneyPathSegments
// ---------------------------------------------------------------------------

/**
 * Structured version of getJourneyPath — returns segments with source info
 * and a flag for the conversion step.
 */
export function getJourneyPathSegments(
  personId: string,
): JourneyPathSegment[] {
  const personSessions = (getPersonSessionsMap().get(personId) ?? [])
    .slice()
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  const personEvents = getPersonEventsMap().get(personId) ?? [];

  const segments: JourneyPathSegment[] = [];
  for (const session of personSessions) {
    const cfg = sourceConfig[session.source];
    if (
      segments.length === 0 ||
      segments[segments.length - 1].label !== cfg.label
    ) {
      segments.push({
        label: cfg.label,
        source: session.source,
        isConversion: false,
      });
    }
  }

  const conversionEvent = personEvents.find((e) =>
    CONVERSION_EVENT_TYPES.has(e.type),
  );
  if (conversionEvent) {
    const mechanism = EVENT_TYPE_TO_MECHANISM[conversionEvent.type];
    if (mechanism) {
      segments.push({
        label: CONVERSION_MECHANISM_LABELS[mechanism],
        isConversion: true,
      });
    }
  }

  return segments;
}
