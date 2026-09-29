import { companies, people, events, ledger } from "@/data";
import {
  getFirstTouch,
  getLastMarketingTouch,
  getConversionTouch,
} from "@/lib/attribution";
import { getDisplayStage } from "@/lib/attribution/derived";
import { resolvePersonSource } from "@/lib/metrics/attribution-metrics";
import { sourceConfig, getSourceLabel } from "@/lib/config/sources";
import { NOW } from "@/lib/config/constants";
import { getPipelineBySource } from "@/lib/metrics";
import { getAttributionMetrics } from "@/lib/metrics/attribution-metrics";
import { formatMoney } from "@/lib/formatting/money";
import { formatDate } from "@/lib/formatting/dates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EvidenceItem {
  date: string;
  description: string;
  href?: string;
}

export interface AskAnswer {
  type:
    | "company"
    | "person"
    | "won_content"
    | "pipeline"
    | "unattributed"
    | "conversion"
    | "general"
    | "prompt_chips";
  title: string;
  summary: string;
  details?: Record<string, string | number | undefined>;
  items?: Array<{ label: string; value: string; href?: string }>;
  evidence?: EvidenceItem[];
  cta?: { label: string; href: string };
}

// ---------------------------------------------------------------------------
// Prompt chips (default / unrecognized)
// ---------------------------------------------------------------------------

export const PROMPT_CHIPS: Array<{ label: string; value: string }> = [
  { label: "Attribution", value: "Where did Acme come from?" },
  { label: "Pipeline", value: "Which channel generated the most pipeline?" },
  {
    label: "Won Content",
    value: "Which content appears most in won journeys?",
  },
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
  const conversionChannel = conversion
    ? sourceConfig[conversion.source].label
    : "Unknown";

  const oppLabel = opportunity
    ? `${formatMoney(opportunity.value)} · ${opportunity.stage.charAt(0).toUpperCase() + opportunity.stage.slice(1)}`
    : undefined;

  // Build evidence from contact's events
  const contactEvidence: EvidenceItem[] = [];
  if (contact) {
    const personEvents = events
      .filter((e) => e.personId === contact.id)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const keyTypes = new Set([
      "session_started", "form_submitted", "booking_submitted",
      "email_inquiry_received", "newsletter_signup", "lead_created",
      "opportunity_created", "deal_won",
    ]);
    for (const ev of personEvents) {
      if (keyTypes.has(ev.type)) {
        contactEvidence.push({
          date: formatDate(ev.timestamp),
          description: ev.description,
          href: `/leads/${contact.id}`,
        });
      }
    }
  }

  return {
    type: "company",
    title: `Attribution for ${company.name}`,
    summary: contact
      ? `${contact.name} first arrived via ${firstTouchLabel} and last engaged through ${lastMarketingLabel} before converting via ${conversionChannel} / ${conversionMechanism}.`
      : `No contacts found for ${company.name}.`,
    details: {
      "First Touch": firstTouchLabel,
      "Last Marketing Touch": lastMarketingLabel,
      Conversion: `${conversionChannel} / ${conversionMechanism}`,
      Opportunity: oppLabel,
    },
    evidence: contactEvidence.length > 0 ? contactEvidence : undefined,
    cta: contact
      ? {
          label: `Open ${company.name} journey`,
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

  // Evidence: key journey events
  const personEvents = events
    .filter((e) => e.personId === person.id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const keyTypes = new Set([
    "session_started", "form_submitted", "booking_submitted",
    "email_inquiry_received", "newsletter_signup", "lead_created",
    "opportunity_created", "deal_won", "deal_lost",
  ]);
  const evidence: EvidenceItem[] = personEvents
    .filter((ev) => keyTypes.has(ev.type))
    .map((ev) => ({
      date: formatDate(ev.timestamp),
      description: ev.description,
      href: `/leads/${person.id}`,
    }));

  return {
    type: "person",
    title: person.name,
    summary: `${person.title} at ${company?.name ?? "Unknown company"}`,
    details: {
      Email: person.email,
      Title: person.title,
      Company: company?.name,
      Stage: getDisplayStage(person.id),
      "First touch": firstTouchLabel,
      "Last marketing touch": lastMarketingLabel,
      "Conversion mechanism": conversionMechanism,
    },
    evidence: evidence.length > 0 ? evidence : undefined,
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
    title: "Open Pipeline by Source (First Touch)",
    summary: `${topLabel} generated the most open pipeline with ${formatMoney(top.value)}, out of ${formatMoney(totalPipeline)} total open pipeline.`,
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
    .filter((entry) => resolvePersonSource(entry.primaryContactId, "first_touch") === "unknown")
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
// Pattern: content in won journeys
// ---------------------------------------------------------------------------

const WON_CONTENT_PATTERNS = /\b(content.*won|won.*content|won.*journey|content.*journey)\b/i;

function tryWonContent(query: string): AskAnswer | null {
  if (!WON_CONTENT_PATTERNS.test(query)) return null;

  // Find all won deals
  const wonDeals = ledger.filter((l) => l.stage === "won");
  const wonContactIds = new Set(wonDeals.map((d) => d.primaryContactId));

  // Collect all content events from won journeys
  const contentCounts = new Map<string, { count: number; deals: Set<string> }>();
  const contentEvidence: EvidenceItem[] = [];

  for (const ev of events) {
    if (!wonContactIds.has(ev.personId)) continue;
    if (ev.type !== "blog_post_viewed" && ev.type !== "case_study_viewed") continue;

    const title =
      (ev.metadata.articleTitle as string) ??
      (ev.metadata.caseStudyTitle as string) ??
      ev.description;

    const existing = contentCounts.get(title);
    if (existing) {
      existing.count++;
      existing.deals.add(ev.personId);
    } else {
      contentCounts.set(title, { count: 1, deals: new Set([ev.personId]) });
    }

    // Find the deal's company for evidence
    const deal = wonDeals.find((d) => d.primaryContactId === ev.personId);
    contentEvidence.push({
      date: formatDate(ev.timestamp),
      description: `${title} — ${deal?.companyName ?? ""}`,
      href: `/leads/${ev.personId}`,
    });
  }

  // Sort by count descending
  const sorted = Array.from(contentCounts.entries())
    .sort((a, b) => b[1].count - a[1].count);

  if (sorted.length === 0) {
    return {
      type: "won_content",
      title: "Content in Won Journeys",
      summary: "No content interactions found in won deal journeys.",
    };
  }

  const topTitle = sorted[0][0];
  const topCount = sorted[0][1].count;
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  return {
    type: "won_content",
    title: "Content in Won Journeys",
    summary: `"${topTitle}" appeared ${topCount} time${topCount === 1 ? "" : "s"} across ${sorted[0][1].deals.size} won deal${sorted[0][1].deals.size === 1 ? "" : "s"}. ${wonDeals.length} deals totalling ${formatMoney(wonRevenue)} in won revenue.`,
    details: {
      "Top content": topTitle,
      "Appearances": topCount,
      "Won deals": wonDeals.length,
      "Won revenue": formatMoney(wonRevenue),
    },
    items: sorted.map(([title, data]) => ({
      label: title,
      value: `${data.count}× across ${data.deals.size} deal${data.deals.size === 1 ? "" : "s"}`,
    })),
    evidence: contentEvidence.length > 0 ? contentEvidence : undefined,
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

  const wonContentResult = tryWonContent(trimmed);
  if (wonContentResult) return wonContentResult;

  // Unrecognized query
  return promptChipsAnswer();
}
