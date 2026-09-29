import type {
  Touchpoint,
  AcquisitionSource,
  ConversionMechanism,
  EventType,
} from "@/types";
import { sessions, events } from "@/data";
import { isMarketingTouch } from "@/lib/config/sources";

const CONVERSION_EVENT_TYPES: Set<EventType> = new Set([
  "form_submitted",
  "booking_submitted",
  "email_inquiry",
  "email_inquiry_received",
  "newsletter_signup",
]);

const EVENT_TYPE_TO_MECHANISM: Partial<Record<EventType, ConversionMechanism>> =
  {
    form_submitted: "contact_form",
    booking_submitted: "book_a_call",
    email_inquiry: "email_inquiry",
    email_inquiry_received: "email_inquiry",
    newsletter_signup: "newsletter_signup",
  };

// Lazy cache: personId → Touchpoint[]
const cache = new Map<string, Touchpoint[]>();

/**
 * Clear the touchpoint cache. Useful for tests.
 */
export function clearTouchpointCache(): void {
  cache.clear();
}

// Build session → events index
let sessionEventsMap: Map<string, typeof events> | null = null;
function getSessionEventsMap() {
  if (!sessionEventsMap) {
    sessionEventsMap = new Map();
    for (const e of events) {
      if (!e.sessionId) continue;
      const arr = sessionEventsMap.get(e.sessionId);
      if (arr) arr.push(e);
      else sessionEventsMap.set(e.sessionId, [e]);
    }
  }
  return sessionEventsMap;
}

// Build personId → sessions index
let personSessionsMap: Map<string, typeof sessions> | null = null;
function getPersonSessionsMap() {
  if (!personSessionsMap) {
    personSessionsMap = new Map();
    for (const s of sessions) {
      const arr = personSessionsMap.get(s.personId);
      if (arr) arr.push(s);
      else personSessionsMap.set(s.personId, [s]);
    }
  }
  return personSessionsMap;
}

// Build personId → events index
let personEventsMap: Map<string, typeof events> | null = null;
function getPersonEventsMap() {
  if (!personEventsMap) {
    personEventsMap = new Map();
    for (const e of events) {
      const arr = personEventsMap.get(e.personId);
      if (arr) arr.push(e);
      else personEventsMap.set(e.personId, [e]);
    }
  }
  return personEventsMap;
}

/**
 * Derive touchpoints from a person's sessions and events.
 * Includes both session-based touchpoints and sessionless acquisition events
 * (e.g. event_attended, campaign_clicked).
 * Returns touchpoints sorted by timestamp ascending.
 */
export function deriveTouchpoints(personId: string): Touchpoint[] {
  const cached = cache.get(personId);
  if (cached) return cached;

  const personSessions = getPersonSessionsMap().get(personId) ?? [];
  const sessEvtMap = getSessionEventsMap();

  // Collect all person conversion events (both in-session and standalone)
  const allPersonEvents = getPersonEventsMap().get(personId) ?? [];
  const allConversionEvents = allPersonEvents
    .filter((e) => CONVERSION_EVENT_TYPES.has(e.type))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  // Session-based touchpoints
  const sortedSessions = personSessions
    .slice()
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  const touchpoints: Touchpoint[] = sortedSessions.map((session) => {
    const sessionEvents = sessEvtMap.get(session.id) ?? [];

    // Check for in-session conversion
    let conversionEvent = sessionEvents.find((e) =>
      CONVERSION_EVENT_TYPES.has(e.type)
    );

    // Check for standalone conversion associated with this session:
    // A standalone conversion (no sessionId) is associated with the last session
    // that started before it, if no later session exists
    if (!conversionEvent) {
      const sessionIdx = sortedSessions.indexOf(session);
      const nextSessionStart = sortedSessions[sessionIdx + 1]?.startedAt;

      conversionEvent = allConversionEvents.find((e) => {
        if (e.sessionId) return false; // already covered by in-session check
        return (
          e.timestamp >= session.startedAt &&
          (!nextSessionStart || e.timestamp < nextSessionStart)
        );
      });
    }

    const source = session.source as AcquisitionSource;
    const tp: Touchpoint = {
      source,
      medium: session.medium,
      sessionId: session.id,
      timestamp: session.startedAt,
      landingPage: session.landingPage,
      referrer: session.referrer,
      campaign: session.campaign,
      content: session.content,
      isConversion: !!conversionEvent,
      conversionMechanism: conversionEvent
        ? EVENT_TYPE_TO_MECHANISM[conversionEvent.type]
        : undefined,
      kind: "session",
      isMarketingTouch: isMarketingTouch(source),
      sourceSystem: conversionEvent?.sourceSystem ?? session.sourceSystem,
    };
    return tp;
  });

  // Sessionless acquisition events (e.g. event_attended, campaign_clicked)
  const personEvents = getPersonEventsMap().get(personId) ?? [];
  for (const evt of personEvents) {
    if (evt.sessionId) continue; // already covered by session touchpoints
    if (evt.category !== "acquisition") continue;
    if (evt.type !== "event_attended") continue;

    const source: AcquisitionSource = "event";
    touchpoints.push({
      source,
      medium: "none",
      timestamp: evt.timestamp,
      landingPage: "",
      referrer: "",
      isConversion: false,
      kind: "event",
      isMarketingTouch: isMarketingTouch(source),
      sourceSystem: evt.sourceSystem,
    });
  }

  // Sort all touchpoints by timestamp
  touchpoints.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  cache.set(personId, touchpoints);
  return touchpoints;
}

/**
 * Get the first marketing touchpoint (earliest visit with a marketing source).
 * Per §5.3: "Earliest touchpoint with isMarketingTouch before the conversion. None → unknown."
 */
export function getFirstTouch(personId: string): Touchpoint | undefined {
  const tps = deriveTouchpoints(personId);
  return tps.find((tp) => tp.isMarketingTouch);
}

/**
 * Get the last touchpoint where the source is a marketing channel.
 * Direct and unknown are NOT marketing touches.
 */
export function getLastMarketingTouch(
  personId: string
): Touchpoint | undefined {
  const tps = deriveTouchpoints(personId);
  for (let i = tps.length - 1; i >= 0; i--) {
    if (tps[i].isMarketingTouch) return tps[i];
  }
  return undefined;
}

/**
 * Get the touchpoint where a conversion event occurred.
 * If multiple conversions, returns the first one.
 */
export function getConversionTouch(personId: string): Touchpoint | undefined {
  const tps = deriveTouchpoints(personId);
  return tps.find((tp) => tp.isConversion);
}
