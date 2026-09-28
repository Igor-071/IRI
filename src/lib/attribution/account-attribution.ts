import type { AcquisitionSource } from "@/types";
import {
  getPeopleByCompanyId,
  getRelationshipsByPersonId,
} from "@/lib/data/repositories";
import {
  getAccountEarliestTouch,
  getAccountLatestMarketingTouch,
} from "@/lib/journeys";
import { sourceConfig } from "@/lib/config/sources";

export interface AccountAttributionSummary {
  earliest: {
    source: AcquisitionSource;
    sourceLabel: string;
    personName: string;
    personId: string;
    timestamp: string;
  } | null;
  latestMarketing: {
    source: AcquisitionSource;
    sourceLabel: string;
    personName: string;
    personId: string;
    timestamp: string;
  } | null;
  relationships: Array<{
    personId: string;
    personName: string;
    type: string;
    referrerName: string;
    referrerCompany: string;
    notes?: string;
  }>;
}

/**
 * Resolves a source label back to an AcquisitionSource key.
 * Falls back to "unknown" if not found.
 */
function sourceLabelToKey(label: string): AcquisitionSource {
  for (const [key, config] of Object.entries(sourceConfig)) {
    if (config.label === label) return key as AcquisitionSource;
  }
  return "unknown";
}

export function getAccountAttribution(
  companyId: string,
): AccountAttributionSummary {
  const people = getPeopleByCompanyId(companyId);

  // Earliest touch across all people
  const earliestRaw = getAccountEarliestTouch(companyId);
  let earliest: AccountAttributionSummary["earliest"] = null;
  if (earliestRaw) {
    const sourceKey = sourceLabelToKey(earliestRaw.source);
    const person = people.find((p) => p.name === earliestRaw.personName);
    earliest = {
      source: sourceKey,
      sourceLabel: earliestRaw.source,
      personName: earliestRaw.personName,
      personId: person?.id ?? "",
      timestamp: earliestRaw.timestamp,
    };
  }

  // Latest marketing touch across all people
  const latestRaw = getAccountLatestMarketingTouch(companyId);
  let latestMarketing: AccountAttributionSummary["latestMarketing"] = null;
  if (latestRaw) {
    const sourceKey = sourceLabelToKey(latestRaw.source);
    const person = people.find((p) => p.name === latestRaw.personName);
    latestMarketing = {
      source: sourceKey,
      sourceLabel: latestRaw.source,
      personName: latestRaw.personName,
      personId: person?.id ?? "",
      timestamp: latestRaw.timestamp,
    };
  }

  // Relationship attributions across all people
  const relationships: AccountAttributionSummary["relationships"] = [];
  for (const person of people) {
    const rels = getRelationshipsByPersonId(person.id);
    for (const rel of rels) {
      relationships.push({
        personId: person.id,
        personName: person.name,
        type: rel.type,
        referrerName: rel.referrerName,
        referrerCompany: rel.referrerCompany,
        notes: rel.notes,
      });
    }
  }

  return { earliest, latestMarketing, relationships };
}
