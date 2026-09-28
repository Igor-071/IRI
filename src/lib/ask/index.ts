import { companies, people, events, ledger } from "@/data";
import {
  getFirstTouch,
  getLastMarketingTouch,
  getConversionTouch,
} from "@/lib/attribution";
import { sourceConfig, getSourceLabel } from "@/lib/config/sources";
import { NOW } from "@/lib/config/constants";
import { getPipelineBySource } from "@/lib/metrics";
import { getAttributionMetrics } from "@/lib/metrics/attribution-metrics";
import { formatMoney } from "@/lib/formatting/money";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AskAnswer {
  type:
    | "company"
    | "person"
    | "waiting"
    | "pipeline"
    | "unattributed"
    | "conversion"
    | "general"
    | "prompt_chips";
  title: string;
  summary: string;
  details?: Record<string, string | number | undefined>;
  items?: Array<{ label: string; value: string; href?: string }>;
  cta?: { label: string; href: string };
}

// ---------------------------------------------------------------------------
// Prompt chips (default / unrecognized)
// ---------------------------------------------------------------------------

export const PROMPT_CHIPS: Array<{ label: string; value: string }> = [
  { label: "Attribution", value: "Where did Acme come from?" },
  { label: "Pipeline", value: "Which channel generated the most pipeline?" },
  { label: "Waiting", value: "Show leads waiting for a reply." },
  {
    label: "Unattributed",
    value: "What are our biggest unattributed opportunities?",
  },
  {
    label: "Conversion",
    value: "Which source has the highest conversion rate?",
  },
];

function promptChipsAnswer(): AskAnswer {
  return {
    type: "prompt_chips",
    title: "Try asking...",
    summary: "This prototype answers these questions:",
    items: PROMPT_CHIPS,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function humanDuration(days: number): string {
  if (days <= 0) return "today";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week";
  return `${weeks} weeks`;
}

// ---------------------------------------------------------------------------
// Pattern: company attribution
// ---------------------------------------------------------------------------

const COMPANY_PATTERNS = [
  /where\s+did\s+(.+?)\s+come\s+from/i,
  /how\s+did\s+(.+?)\s+find\s+us/i,
  /attribution\s+for\s+(.+)/i,
];

function tryCompanyAttribution(query: string): AskAnswer | null {
  let companyName: string | null = null;

  for (const pattern of COMPANY_PATTERNS) {
    const match = query.match(pattern);
    if (match) {
      companyName = match[1].replace(/[?"']/g, "").trim();
      break;
    }
  }

  if (!companyName) return null;

  const company = companies.find((c) =>
    c.name.toLowerCase().includes(companyName!.toLowerCase()),
  );

  if (!company) {
    return {
      type: "company",
      title: "Company not found",
      summary: `I couldn't find a company matching "${companyName}".`,
    };
  }

  // Find primary contact (first person at that company)
  const contact = people.find((p) => p.companyId === company.id);

  // Get attribution touchpoints
  const firstTouch = contact ? getFirstTouch(contact.id) : undefined;
  const lastMarketing = contact
    ? getLastMarketingTouch(contact.id)
    : undefined;
  const conversion = contact ? getConversionTouch(contact.id) : undefined;

  // Get opportunity from ledger
  const opportunity = ledger.find((l) => l.companyId === company.id);

  const firstTouchLabel = firstTouch
    ? sourceConfig[firstTouch.source].label
    : "Unknown";
  const lastMarketingLabel = lastMarketing
    ? sourceConfig[lastMarketing.source].label
    : "Unknown";
  const conversionMechanism = conversion?.conversionMechanism
    ? conversion.conversionMechanism
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Unknown";

  const oppLabel = opportunity
    ? `${formatMoney(opportunity.value)} · ${opportunity.stage.charAt(0).toUpperCase() + opportunity.stage.slice(1)}`
    : undefined;

  return {
    type: "company",
    title: `Attribution for ${company.name}`,
    summary: contact
      ? `${contact.name} first arrived via ${firstTouchLabel} and last engaged through ${lastMarketingLabel} before converting via ${conversionMechanism}.`
      : `No contacts found for ${company.name}.`,
    details: {
      "First Touch": firstTouchLabel,
      "Last Marketing Touch": lastMarketingLabel,
      Conversion: `Direct / ${conversionMechanism}`,
      Opportunity: oppLabel,
    },
    cta: contact
      ? {
          label: `Open ${company.name} journey →`,
          href: `/leads/${contact.id}`,
        }
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// Pattern: person query
// ---------------------------------------------------------------------------

const PERSON_PATTERNS = [
  /tell\s+me\s+about\s+(.+)/i,
  /who\s+is\s+(.+)/i,
];

function tryPersonQuery(query: string): AskAnswer | null {
  let personName: string | null = null;

  for (const pattern of PERSON_PATTERNS) {
    const match = query.match(pattern);
    if (match) {
      personName = match[1].replace(/[?"']/g, "").trim();
      break;
    }
  }

  if (!personName) return null;

  const person = people.find((p) =>
    p.name.toLowerCase().includes(personName!.toLowerCase()),
  );

  if (!person) {
    return {
      type: "person",
      title: "Person not found",
      summary: `I couldn't find anyone matching "${personName}".`,
    };
  }

  const company = companies.find((c) => c.id === person.companyId);
  const firstTouch = getFirstTouch(person.id);
  const lastMarketing = getLastMarketingTouch(person.id);
  const conversion = getConversionTouch(person.id);

  const firstTouchLabel = firstTouch
    ? sourceConfig[firstTouch.source].label
    : "Unknown";
  const lastMarketingLabel = lastMarketing
    ? sourceConfig[lastMarketing.source].label
    : "Unknown";
  const conversionMechanism = conversion?.conversionMechanism
    ? conversion.conversionMechanism.replace(/_/g, " ")
    : "Unknown";

  return {
    type: "person",
    title: person.name,
    summary: `${person.title} at ${company?.name ?? "Unknown company"}`,
    details: {
      Email: person.email,
      Title: person.title,
      Company: company?.name,
      Stage: person.displayStage,
      "First touch": firstTouchLabel,
      "Last marketing touch": lastMarketingLabel,
      "Conversion mechanism": conversionMechanism,
    },
  };
}

// ---------------------------------------------------------------------------
// Pattern: pipeline by source
// ---------------------------------------------------------------------------

const PIPELINE_PATTERNS =
  /\b(pipeline|channel.*most|most.*pipeline|generated.*pipeline)\b/i;

function tryPipelineBySource(query: string): AskAnswer | null {
  if (!PIPELINE_PATTERNS.test(query)) return null;

  const pipelineData = getPipelineBySource();

  if (pipelineData.length === 0) {
    return {
      type: "pipeline",
      title: "Pipeline by Source",
      summary: "No open pipeline data available.",
    };
  }

  const top = pipelineData[0];
  const topLabel = getSourceLabel(top.source);
  const totalPipeline = pipelineData.reduce((sum, p) => sum + p.value, 0);

  return {
    type: "pipeline",
    title: "Pipeline by Source (First Touch)",
    summary: `${topLabel} generated the most open pipeline with ${formatMoney(top.value)}, out of ${formatMoney(totalPipeline)} total.`,
    details: {
      "Top source": topLabel,
      "Top source pipeline": formatMoney(top.value),
      "Total open pipeline": formatMoney(totalPipeline),
      Sources: `${pipelineData.length} active`,
    },
    items: pipelineData.map((entry) => ({
      label: getSourceLabel(entry.source),
      value: formatMoney(entry.value),
    })),
  };
}

// ---------------------------------------------------------------------------
// Pattern: unattributed opportunities
// ---------------------------------------------------------------------------

const UNATTRIBUTED_PATTERNS = /\b(unattributed|unknown)\b/i;

function tryUnattributedOpportunities(query: string): AskAnswer | null {
  if (!UNATTRIBUTED_PATTERNS.test(query)) return null;

  const unattributed = ledger
    .filter((entry) => entry.firstTouchSource === "unknown")
    .sort((a, b) => b.value - a.value);

  if (unattributed.length === 0) {
    return {
      type: "unattributed",
      title: "Unattributed Opportunities",
      summary: "All opportunities have known attribution.",
    };
  }

  const totalValue = unattributed.reduce((sum, e) => sum + e.value, 0);

  return {
    type: "unattributed",
    title: "Unattributed Opportunities",
    summary: `${unattributed.length} opportunit${unattributed.length === 1 ? "y" : "ies"} with unknown first touch, totalling ${formatMoney(totalValue)}.`,
    details: {
      Count: unattributed.length,
      "Total value": formatMoney(totalValue),
    },
    items: unattributed.map((entry) => ({
      label: `${entry.companyName} · ${formatMoney(entry.value)}`,
      value: entry.stage.charAt(0).toUpperCase() + entry.stage.slice(1),
    })),
  };
}

// ---------------------------------------------------------------------------
// Pattern: conversion rate
// ---------------------------------------------------------------------------

const CONVERSION_RATE_PATTERNS = /\b(conversion\s*rate|highest\s*conversion)\b/i;

function tryConversionRate(query: string): AskAnswer | null {
  if (!CONVERSION_RATE_PATTERNS.test(query)) return null;

  const metrics = getAttributionMetrics("first_touch");

  // Filter for sources with at least 2 leads to avoid noise
  const eligible = metrics.rows.filter((row) => row.leads >= 2);

  if (eligible.length === 0) {
    return {
      type: "conversion",
      title: "Conversion Rate by Source",
      summary: "Not enough data to determine conversion rates.",
    };
  }

  // Sort by leadToOppPercent descending
  const sorted = [...eligible].sort(
    (a, b) => b.leadToOppPercent - a.leadToOppPercent,
  );
  const top = sorted[0];
  const topLabel = getSourceLabel(top.source);
  const topPercent = Math.round(top.leadToOppPercent * 100);

  return {
    type: "conversion",
    title: "Conversion Rate by Source (First Touch)",
    summary: `${topLabel} has the highest lead-to-opportunity conversion rate at ${topPercent}%.`,
    details: {
      "Top source": topLabel,
      "Conversion rate": `${topPercent}%`,
      Leads: top.leads,
      Opportunities: top.opportunities,
    },
    items: sorted.map((row) => ({
      label: getSourceLabel(row.source),
      value: `${Math.round(row.leadToOppPercent * 100)}% · ${row.leads} leads → ${row.opportunities} opps`,
    })),
  };
}

// ---------------------------------------------------------------------------
// Pattern: waiting leads
// ---------------------------------------------------------------------------

const WAITING_PATTERNS = /\b(waiting|reply|response|pending)\b/i;

function tryWaitingLeads(query: string): AskAnswer | null {
  if (!WAITING_PATTERNS.test(query)) return null;

  // Group events by person, sorted by timestamp descending
  const eventsByPerson = new Map<string, typeof events>();
  for (const e of events) {
    const arr = eventsByPerson.get(e.personId);
    if (arr) arr.push(e);
    else eventsByPerson.set(e.personId, [e]);
  }

  const waiting: Array<{ label: string; value: string; href?: string }> = [];

  for (const [personId, personEvents] of eventsByPerson) {
    // Sort by timestamp descending to find most recent
    const sorted = personEvents
      .slice()
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    // Find the most recent email_received
    const lastReceived = sorted.find((e) => e.type === "email_received");
    if (!lastReceived) continue;

    // Check if there's any email_sent AFTER that received email
    const hasSentAfter = sorted.some(
      (e) =>
        e.type === "email_sent" &&
        e.timestamp.localeCompare(lastReceived.timestamp) > 0,
    );
    if (hasSentAfter) continue;

    // This person is waiting for a reply
    const person = people.find((p) => p.id === personId);
    if (!person) continue;

    const company = companies.find((c) => c.id === person.companyId);
    const waitDays = daysBetween(new Date(lastReceived.timestamp), NOW);

    waiting.push({
      label: `${person.name}${company ? ` (${company.name})` : ""}`,
      value: `Waiting ${humanDuration(waitDays)}`,
      href: `/leads/${person.id}`,
    });
  }

  // Sort by wait time (longest first) based on the value text
  waiting.sort((a, b) => {
    // Extract number from "Waiting X days/weeks"
    const numA = parseInt(a.value.match(/\d+/)?.[0] ?? "0", 10);
    const numB = parseInt(b.value.match(/\d+/)?.[0] ?? "0", 10);
    return numB - numA;
  });

  return {
    type: "waiting",
    title: "Leads waiting for a reply",
    summary:
      waiting.length > 0
        ? `${waiting.length} lead${waiting.length === 1 ? "" : "s"} waiting for a response.`
        : "No leads are currently waiting for a reply.",
    items: waiting,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function askInbound(query: string): AskAnswer {
  const trimmed = query.trim();
  if (!trimmed) return promptChipsAnswer();

  // Try each pattern in priority order
  const companyResult = tryCompanyAttribution(trimmed);
  if (companyResult) return companyResult;

  const personResult = tryPersonQuery(trimmed);
  if (personResult) return personResult;

  const pipelineResult = tryPipelineBySource(trimmed);
  if (pipelineResult) return pipelineResult;

  const unattributedResult = tryUnattributedOpportunities(trimmed);
  if (unattributedResult) return unattributedResult;

  const conversionResult = tryConversionRate(trimmed);
  if (conversionResult) return conversionResult;

  const waitingResult = tryWaitingLeads(trimmed);
  if (waitingResult) return waitingResult;

  // Unrecognized query
  return promptChipsAnswer();
}
