import type { AcquisitionSource, DisplayStage, Person } from "@/types";
import { people, events } from "@/data";
import { getFirstTouch, getConversionTouch } from "./touchpoints";
import { getOpportunityByPersonId } from "@/lib/data/repositories";

// ---------------------------------------------------------------------------
// Lead detection — a lead is a person with a lead_created event
// ---------------------------------------------------------------------------

let leadPeopleCache: Person[] | null = null;
let leadIdSet: Set<string> | null = null;

function getLeadIdSet(): Set<string> {
  if (!leadIdSet) {
    leadIdSet = new Set<string>();
    for (const e of events) {
      if (e.type === "lead_created") {
        leadIdSet.add(e.personId);
      }
    }
  }
  return leadIdSet;
}

/**
 * Check if a person is a lead (has a lead_created event).
 */
export function isLead(personId: string): boolean {
  return getLeadIdSet().has(personId);
}

/**
 * Get all people who are leads (have a lead_created event).
 */
export function getLeadPeople(): Person[] {
  if (!leadPeopleCache) {
    const ids = getLeadIdSet();
    leadPeopleCache = people.filter((p) => ids.has(p.id));
  }
  return leadPeopleCache;
}

// ---------------------------------------------------------------------------
// Derived attribution fields
// ---------------------------------------------------------------------------

/**
 * Get the first touch source for a person (derived from touchpoints).
 * Returns the source of the first marketing touchpoint, or "unknown".
 */
export function getFirstTouchSource(personId: string): AcquisitionSource {
  return getFirstTouch(personId)?.source ?? "unknown";
}

/**
 * Get the conversion channel for a person (derived from touchpoints).
 * Returns the source of the conversion touchpoint, or "unknown".
 */
export function getConversionChannel(personId: string): AcquisitionSource {
  return getConversionTouch(personId)?.source ?? "unknown";
}

/**
 * Get the display stage for a person (derived).
 * If the person is the primary contact of an opportunity → opportunity stage.
 * Otherwise → person.leadStatus.
 */
export function getDisplayStage(personId: string): DisplayStage {
  const opp = getOpportunityByPersonId(personId);
  if (opp) return opp.stage as DisplayStage;

  const person = people.find((p) => p.id === personId);
  if (!person) return "new";
  return person.leadStatus;
}
