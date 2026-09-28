import type { AttributionStatus, Person } from "@/types";
import { relationships, selfReported } from "@/data";
import { isMarketingTouch } from "@/lib/config/sources";
import { deriveTouchpoints } from "./touchpoints";

// Lazy indices
let relMap: Map<string, boolean> | null = null;
let srMap: Map<string, boolean> | null = null;

function getRelMap() {
  if (!relMap) {
    relMap = new Map();
    for (const r of relationships) relMap.set(r.personId, true);
  }
  return relMap;
}

function getSrMap() {
  if (!srMap) {
    srMap = new Map();
    for (const sr of selfReported) srMap.set(sr.personId, true);
  }
  return srMap;
}

/**
 * Compute attribution status for a person.
 *
 * Full:    At least one session has a marketing source (verified session-level tracking).
 * Partial: No marketing sessions, but Person.firstTouchSource is marketing (CRM-level data
 *          without session verification) OR has relationship/self-reported attribution.
 * Unknown: No marketing sessions, non-marketing firstTouchSource, no relationship or
 *          self-reported data.
 */
export function getAttributionStatus(person: Person): AttributionStatus {
  const touchpoints = deriveTouchpoints(person.id);
  const hasMarketingSession = touchpoints.some((tp) =>
    isMarketingTouch(tp.source)
  );

  if (hasMarketingSession) return "full";

  // Check CRM-level first touch source
  if (isMarketingTouch(person.firstTouchSource)) return "partial";

  // Check relationship and self-reported data
  if (getRelMap().has(person.id) || getSrMap().has(person.id)) return "partial";

  return "unknown";
}

/**
 * Compute attribution coverage: proportion of leads with Full status.
 */
export function getAttributionCoverage(allPeople: Person[]): number {
  const full = allPeople.filter(
    (p) => getAttributionStatus(p) === "full"
  ).length;
  return full / allPeople.length;
}
