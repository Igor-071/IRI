import type { AttributionStatus } from "@/types";
import { relationships, selfReported } from "@/data";
import { deriveTouchpoints, getConversionTouch } from "./touchpoints";

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
 * Compute attribution status for a person per §5.4:
 *
 * Full:    ≥1 detected marketing touchpoint before conversion AND conversion channel known
 * Partial: (a) no detected marketing touch + self-reported/relationship evidence
 *       OR (b) detected marketing touch + conversion channel unknown
 * Unknown: no detected marketing touch AND no self-reported/relationship evidence
 */
export function getAttributionStatus(personId: string): AttributionStatus {
  const touchpoints = deriveTouchpoints(personId);
  const hasMarketingTouch = touchpoints.some((tp) => tp.isMarketingTouch);
  const conversion = getConversionTouch(personId);
  const conversionKnown = !!conversion;

  if (hasMarketingTouch && conversionKnown) return "full";

  if (hasMarketingTouch && !conversionKnown) return "partial";

  // No marketing touch — check for self-reported/relationship evidence
  if (getRelMap().has(personId) || getSrMap().has(personId)) return "partial";

  return "unknown";
}

/**
 * Compute attribution coverage: proportion of leads with Full status.
 */
export function getAttributionCoverage(leadPeople: { id: string }[]): number {
  const full = leadPeople.filter(
    (p) => getAttributionStatus(p.id) === "full"
  ).length;
  return full / leadPeople.length;
}
