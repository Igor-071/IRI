import { events, ledger, companies } from "@/data";
import { NOW } from "@/lib/config/constants";
import type { AcquisitionSource } from "@/types";
import { resolvePersonSource } from "./attribution-metrics";
import { getLeadPeople, getDisplayStage } from "@/lib/attribution/derived";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OverviewMetrics {
  inboundLeads: number;
  opportunities: number;
  openPipeline: number;
  wonRevenue: number;
  leadToOpportunity: number;
  avgFirstResponse: number;
  funnel: [number, number, number, number, number];
}

export interface PipelineBySourceEntry {
  source: AcquisitionSource;
  value: number;
}

export interface RevenueBySourceEntry {
  source: AcquisitionSource;
  value: number;
  count: number;
}

export interface WaitingLead {
  personId: string;
  personName: string;
  companyName: string;
  waitingSince: string;
  waitingMinutes: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const QUALIFIED_STAGES = new Set([
  "qualified",
  "discovery",
  "proposal",
  "negotiation",
  "won",
  "lost",
]);

const PROPOSAL_REACHED_STAGES = new Set(["won", "proposal", "negotiation"]);
const PROPOSAL_LOST_AT_STAGES = new Set(["proposal", "negotiation"]);

// ---------------------------------------------------------------------------
// getAvgFirstResponse
// ---------------------------------------------------------------------------

export function getAvgFirstResponse(): number {
  const responseTimes = events
    .filter(
      (e) =>
        e.type === "email_sent" &&
        e.metadata.responseTimeMinutes !== undefined,
    )
    .map((e) => e.metadata.responseTimeMinutes as number);

  if (responseTimes.length === 0) return 0;
  return (
    responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
  );
}

// ---------------------------------------------------------------------------
// getFunnelCounts
// ---------------------------------------------------------------------------

export function getFunnelCounts(): [number, number, number, number, number] {
  const leadPeople = getLeadPeople();
  const leads = leadPeople.length;

  const qualified = leadPeople.filter((p) =>
    QUALIFIED_STAGES.has(getDisplayStage(p.id)),
  ).length;

  const opportunities = ledger.length;

  const proposals = ledger.filter((entry) => {
    if (PROPOSAL_REACHED_STAGES.has(entry.stage)) return true;
    if (
      entry.stage === "lost" &&
      entry.lostAtStage &&
      PROPOSAL_LOST_AT_STAGES.has(entry.lostAtStage)
    )
      return true;
    return false;
  }).length;

  const won = ledger.filter((entry) => entry.stage === "won").length;

  return [leads, qualified, opportunities, proposals, won];
}

// ---------------------------------------------------------------------------
// getOverviewMetrics
// ---------------------------------------------------------------------------

export function getOverviewMetrics(): OverviewMetrics {
  const wonEntries = ledger.filter((e) => e.stage === "won");

  const openPipeline = ledger
    .filter((e) => e.stage !== "won" && e.stage !== "lost")
    .reduce((sum, e) => sum + e.value, 0);

  const wonRevenue = wonEntries.reduce((sum, e) => sum + e.value, 0);

  const leadPeople = getLeadPeople();
  const leadToOpportunity = ledger.length / leadPeople.length;

  return {
    inboundLeads: leadPeople.length,
    opportunities: ledger.length,
    openPipeline,
    wonRevenue,
    leadToOpportunity,
    avgFirstResponse: getAvgFirstResponse(),
    funnel: getFunnelCounts(),
  };
}

// ---------------------------------------------------------------------------
// getWaitingLeads
// ---------------------------------------------------------------------------

export function getWaitingLeads(): WaitingLead[] {
  const companiesById = new Map(companies.map((c) => [c.id, c]));
  const nowMs = NOW.getTime();
  const leadPeople = getLeadPeople();

  // Group events by personId
  const eventsByPerson = new Map<string, typeof events>();
  for (const event of events) {
    let list = eventsByPerson.get(event.personId);
    if (!list) {
      list = [];
      eventsByPerson.set(event.personId, list);
    }
    list.push(event);
  }

  const waiting: WaitingLead[] = [];

  for (const person of leadPeople) {
    const personEvents = eventsByPerson.get(person.id);
    if (!personEvents) continue;

    // Filter to communication events (email_sent and email_received)
    const commEvents = personEvents
      .filter((e) => e.type === "email_sent" || e.type === "email_received")
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

    if (commEvents.length === 0) continue;

    const lastComm = commEvents[commEvents.length - 1];

    if (lastComm.type === "email_received") {
      const waitingSinceMs = new Date(lastComm.timestamp).getTime();
      const waitingMinutes = Math.round((nowMs - waitingSinceMs) / 60_000);
      const company = companiesById.get(person.companyId);

      waiting.push({
        personId: person.id,
        personName: person.name,
        companyName: company?.name ?? "",
        waitingSince: lastComm.timestamp,
        waitingMinutes,
      });
    }
  }

  // Sort by waiting time descending (longest waiting first)
  waiting.sort((a, b) => b.waitingMinutes - a.waitingMinutes);

  return waiting;
}

// ---------------------------------------------------------------------------
// getPipelineBySource
// ---------------------------------------------------------------------------

export function getPipelineBySource(): PipelineBySourceEntry[] {
  const openEntries = ledger.filter(
    (e) => e.stage !== "won" && e.stage !== "lost",
  );

  const map = new Map<AcquisitionSource, number>();
  for (const entry of openEntries) {
    const source = resolvePersonSource(entry.primaryContactId, "first_touch");
    map.set(source, (map.get(source) ?? 0) + entry.value);
  }

  return Array.from(map.entries())
    .map(([source, value]) => ({ source, value }))
    .sort((a, b) => b.value - a.value);
}

// ---------------------------------------------------------------------------
// getRevenueBySource
// ---------------------------------------------------------------------------

export function getRevenueBySource(): RevenueBySourceEntry[] {
  const wonEntries = ledger.filter((e) => e.stage === "won");

  const map = new Map<AcquisitionSource, { value: number; count: number }>();
  for (const entry of wonEntries) {
    const source = resolvePersonSource(entry.primaryContactId, "first_touch");
    const existing = map.get(source);
    if (existing) {
      existing.value += entry.value;
      existing.count += 1;
    } else {
      map.set(source, { value: entry.value, count: 1 });
    }
  }

  return Array.from(map.entries())
    .map(([source, { value, count }]) => ({ source, value, count }))
    .sort((a, b) => b.value - a.value);
}
