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

/**
 * Derive touchpoints from a person's sessions and events.
 * Returns touchpoints sorted by timestamp ascending.
 */
export function deriveTouchpoints(personId: string): Touchpoint[] {
  const cached = cache.get(personId);
  if (cached) return cached;

  const personSessions = getPersonSessionsMap().get(personId) ?? [];
  const sessEvtMap = getSessionEventsMap();

  const touchpoints: Touchpoint[] = personSessions
    .slice()
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    .map((session) => {
      const sessionEvents = sessEvtMap.get(session.id) ?? [];
      const conversionEvent = sessionEvents.find((e) =>
        CONVERSION_EVENT_TYPES.has(e.type)
      );

      const tp: Touchpoint = {
        source: session.source as AcquisitionSource,
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
      };
      return tp;
    });

  cache.set(personId, touchpoints);
  return touchpoints;
}

/**
 * Get the first touchpoint (earliest visit).
 */
export function getFirstTouch(personId: string): Touchpoint | undefined {
  const tps = deriveTouchpoints(personId);
  return tps[0];
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
    if (isMarketingTouch(tps[i].source)) return tps[i];
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
