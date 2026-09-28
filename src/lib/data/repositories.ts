import {
  companies,
  people,
  sessions,
  events,
  relationships,
  selfReported,
  ledger,
} from "@/data";

import type { LedgerEntry } from "@/data/ledger";

import type {
  Company,
  Person,
  Session,
  Event,
  AcquisitionSource,
  AttributionStatus,
  DisplayStage,
  RelationshipAttribution,
  SelfReportedAttribution,
} from "@/types";

// ---------------------------------------------------------------------------
// Lazy-initialized lookup Maps — built on first access for O(1) lookups
// ---------------------------------------------------------------------------

let personMap: Map<string, Person> | null = null;
let companyMap: Map<string, Company> | null = null;
let sessionMap: Map<string, Session> | null = null;
let eventMap: Map<string, Event> | null = null;
let sessionsByPersonId: Map<string, Session[]> | null = null;
let eventsByPersonId: Map<string, Event[]> | null = null;
let eventsBySessionId: Map<string, Event[]> | null = null;
let peopleByCompanyId: Map<string, Person[]> | null = null;
let opportunitiesByCompanyId: Map<string, LedgerEntry[]> | null = null;
let opportunityByPersonId: Map<string, LedgerEntry> | null = null;
let relationshipsByPersonId: Map<string, RelationshipAttribution[]> | null =
  null;
let selfReportedByPersonId: Map<string, SelfReportedAttribution> | null = null;

function getPersonMap(): Map<string, Person> {
  if (!personMap) {
    personMap = new Map(people.map((p) => [p.id, p]));
  }
  return personMap;
}

function getCompanyMap(): Map<string, Company> {
  if (!companyMap) {
    companyMap = new Map(companies.map((c) => [c.id, c]));
  }
  return companyMap;
}

function getSessionMap(): Map<string, Session> {
  if (!sessionMap) {
    sessionMap = new Map(sessions.map((s) => [s.id, s]));
  }
  return sessionMap;
}

function getEventMap(): Map<string, Event> {
  if (!eventMap) {
    eventMap = new Map(events.map((e) => [e.id, e]));
  }
  return eventMap;
}

function getSessionsByPersonIdMap(): Map<string, Session[]> {
  if (!sessionsByPersonId) {
    sessionsByPersonId = new Map();
    for (const s of sessions) {
      const arr = sessionsByPersonId.get(s.personId);
      if (arr) {
        arr.push(s);
      } else {
        sessionsByPersonId.set(s.personId, [s]);
      }
    }
  }
  return sessionsByPersonId;
}

function getEventsByPersonIdMap(): Map<string, Event[]> {
  if (!eventsByPersonId) {
    eventsByPersonId = new Map();
    for (const e of events) {
      const arr = eventsByPersonId.get(e.personId);
      if (arr) {
        arr.push(e);
      } else {
        eventsByPersonId.set(e.personId, [e]);
      }
    }
    // Pre-sort each group by timestamp
    for (const arr of eventsByPersonId.values()) {
      arr.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }
  }
  return eventsByPersonId;
}

function getEventsBySessionIdMap(): Map<string, Event[]> {
  if (!eventsBySessionId) {
    eventsBySessionId = new Map();
    for (const e of events) {
      if (!e.sessionId) continue;
      const arr = eventsBySessionId.get(e.sessionId);
      if (arr) {
        arr.push(e);
      } else {
        eventsBySessionId.set(e.sessionId, [e]);
      }
    }
    // Pre-sort each group by timestamp
    for (const arr of eventsBySessionId.values()) {
      arr.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }
  }
  return eventsBySessionId;
}

function getPeopleByCompanyIdMap(): Map<string, Person[]> {
  if (!peopleByCompanyId) {
    peopleByCompanyId = new Map();
    for (const p of people) {
      const arr = peopleByCompanyId.get(p.companyId);
      if (arr) {
        arr.push(p);
      } else {
        peopleByCompanyId.set(p.companyId, [p]);
      }
    }
  }
  return peopleByCompanyId;
}

function getOpportunitiesByCompanyIdMap(): Map<string, LedgerEntry[]> {
  if (!opportunitiesByCompanyId) {
    opportunitiesByCompanyId = new Map();
    for (const entry of ledger) {
      const arr = opportunitiesByCompanyId.get(entry.companyId);
      if (arr) {
        arr.push(entry);
      } else {
        opportunitiesByCompanyId.set(entry.companyId, [entry]);
      }
    }
  }
  return opportunitiesByCompanyId;
}

function getOpportunityByPersonIdMap(): Map<string, LedgerEntry> {
  if (!opportunityByPersonId) {
    opportunityByPersonId = new Map();
    for (const entry of ledger) {
      opportunityByPersonId.set(entry.primaryContactId, entry);
    }
  }
  return opportunityByPersonId;
}

function getRelationshipsByPersonIdMap(): Map<
  string,
  RelationshipAttribution[]
> {
  if (!relationshipsByPersonId) {
    relationshipsByPersonId = new Map();
    for (const r of relationships) {
      const arr = relationshipsByPersonId.get(r.personId);
      if (arr) {
        arr.push(r);
      } else {
        relationshipsByPersonId.set(r.personId, [r]);
      }
    }
  }
  return relationshipsByPersonId;
}

function getSelfReportedByPersonIdMap(): Map<string, SelfReportedAttribution> {
  if (!selfReportedByPersonId) {
    selfReportedByPersonId = new Map(
      selfReported.map((sr) => [sr.personId, sr])
    );
  }
  return selfReportedByPersonId;
}

// ---------------------------------------------------------------------------
// Attribution status — delegates to canonical attribution module
// ---------------------------------------------------------------------------

import { getAttributionStatus } from "@/lib/attribution/status";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getPersonById(id: string): Person | undefined {
  return getPersonMap().get(id);
}

export function getCompanyById(id: string): Company | undefined {
  return getCompanyMap().get(id);
}

export function getSessionById(id: string): Session | undefined {
  return getSessionMap().get(id);
}

export function getEventById(id: string): Event | undefined {
  return getEventMap().get(id);
}

export function getSessionsByPersonId(personId: string): Session[] {
  return getSessionsByPersonIdMap().get(personId) ?? [];
}

export function getEventsByPersonId(personId: string): Event[] {
  return getEventsByPersonIdMap().get(personId) ?? [];
}

export function getEventsBySessionId(sessionId: string): Event[] {
  return getEventsBySessionIdMap().get(sessionId) ?? [];
}

export function getPeopleByCompanyId(companyId: string): Person[] {
  return getPeopleByCompanyIdMap().get(companyId) ?? [];
}

export function getOpportunitiesByCompanyId(
  companyId: string
): LedgerEntry[] {
  return getOpportunitiesByCompanyIdMap().get(companyId) ?? [];
}

export function getOpportunityByPersonId(
  personId: string
): LedgerEntry | undefined {
  return getOpportunityByPersonIdMap().get(personId);
}

export function getRelationshipsByPersonId(
  personId: string
): RelationshipAttribution[] {
  return getRelationshipsByPersonIdMap().get(personId) ?? [];
}

export function getSelfReportedByPersonId(
  personId: string
): SelfReportedAttribution | undefined {
  return getSelfReportedByPersonIdMap().get(personId);
}

export function getLeads(
  filters?: {
    attribution?: AttributionStatus;
    source?: AcquisitionSource;
    stage?: DisplayStage;
    owner?: string;
  }
): Person[] {
  if (!filters) return [...people];

  return people.filter((person) => {
    if (filters.stage && person.displayStage !== filters.stage) {
      return false;
    }

    if (filters.source && person.firstTouchSource !== filters.source) {
      return false;
    }

    if (filters.attribution) {
      if (getAttributionStatus(person) !== filters.attribution) return false;
    }

    if (filters.owner && person.ownerId !== filters.owner) {
      return false;
    }

    return true;
  });
}

export function getAccounts(_filters?: {}): Company[] {
  return [...companies];
}
