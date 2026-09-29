import type { AcquisitionSource, AttributionModel } from "@/types";
import type { LedgerEntry } from "@/data/ledger";
import { ledger } from "@/data";
import { getLastMarketingTouch } from "@/lib/attribution/touchpoints";
import {
  getFirstTouchSource,
  getConversionChannel,
  getDisplayStage,
  getLeadPeople,
} from "@/lib/attribution/derived";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AttributionSourceRow {
  source: AcquisitionSource;
  leads: number;
  qualified: number;
  opportunities: number;
  won: number;
  leadToOppPercent: number;
  openPipeline: number;
  revenue: number;
  avgDeal: number;
}

export interface AttributionMetrics {
  rows: AttributionSourceRow[];
  totalLeads: number;
  totalOpenPipeline: number;
  totalWonRevenue: number;
  avgWonDeal: number;
}

// ---------------------------------------------------------------------------
// Source resolution
// ---------------------------------------------------------------------------

const QUALIFIED_STAGES = new Set([
  "qualified",
  "discovery",
  "proposal",
  "negotiation",
  "won",
  "lost",
]);

/**
 * Resolve which acquisition source a person falls under for a given model.
 * All values are derived from touchpoints — no stored fields.
 */
export function resolvePersonSource(
  personId: string,
  model: AttributionModel,
): AcquisitionSource {
  switch (model) {
    case "first_touch":
      return getFirstTouchSource(personId);
    case "last_touch": {
      const lmt = getLastMarketingTouch(personId);
      return lmt?.source ?? "unknown";
    }
    case "conversion_touch":
      return getConversionChannel(personId);
  }
}

/**
 * Resolve which acquisition source an opportunity falls under for a given model.
 * Uses the primary contact's attribution.
 */
export function resolveOpportunitySource(
  entry: LedgerEntry,
  model: AttributionModel,
): AcquisitionSource {
  return resolvePersonSource(entry.primaryContactId, model);
}

// ---------------------------------------------------------------------------
// Main computation
// ---------------------------------------------------------------------------

export function getAttributionMetrics(
  model: AttributionModel,
): AttributionMetrics {
  // Build per-source accumulators
  const accum = new Map<
    AcquisitionSource,
    {
      leads: number;
      qualified: number;
      opportunities: number;
      won: number;
      openPipeline: number;
      revenue: number;
      wonCount: number;
    }
  >();

  function getOrCreate(source: AcquisitionSource) {
    let row = accum.get(source);
    if (!row) {
      row = {
        leads: 0,
        qualified: 0,
        opportunities: 0,
        won: 0,
        openPipeline: 0,
        revenue: 0,
        wonCount: 0,
      };
      accum.set(source, row);
    }
    return row;
  }

  // Count leads and qualified per source — only people with lead_created event
  const leadPeople = getLeadPeople();
  for (const person of leadPeople) {
    const source = resolvePersonSource(person.id, model);
    const row = getOrCreate(source);
    row.leads += 1;
    const stage = getDisplayStage(person.id);
    if (QUALIFIED_STAGES.has(stage)) {
      row.qualified += 1;
    }
  }

  // Count opportunities, pipeline, and revenue per source
  for (const entry of ledger) {
    const source = resolveOpportunitySource(entry, model);
    const row = getOrCreate(source);
    row.opportunities += 1;

    if (entry.stage === "won") {
      row.won += 1;
      row.revenue += entry.value;
      row.wonCount += 1;
    } else if (entry.stage !== "lost") {
      row.openPipeline += entry.value;
    }
  }

  // Build rows
  const rows: AttributionSourceRow[] = Array.from(accum.entries()).map(
    ([source, data]) => ({
      source,
      leads: data.leads,
      qualified: data.qualified,
      opportunities: data.opportunities,
      won: data.won,
      leadToOppPercent:
        data.leads > 0 ? data.opportunities / data.leads : 0,
      openPipeline: data.openPipeline,
      revenue: data.revenue,
      avgDeal:
        data.wonCount > 0
          ? Math.round(data.revenue / data.wonCount)
          : 0,
    }),
  );

  // Sort by open pipeline descending
  rows.sort((a, b) => b.openPipeline - a.openPipeline);

  // Totals
  const totalLeads = rows.reduce((sum, r) => sum + r.leads, 0);
  const totalOpenPipeline = rows.reduce((sum, r) => sum + r.openPipeline, 0);
  const totalWonRevenue = rows.reduce((sum, r) => sum + r.revenue, 0);
  const totalWon = rows.reduce((sum, r) => sum + r.won, 0);
  const avgWonDeal = totalWon > 0 ? Math.round(totalWonRevenue / totalWon) : 0;

  return {
    rows,
    totalLeads,
    totalOpenPipeline,
    totalWonRevenue,
    avgWonDeal,
  };
}
