import { companies, people, events, ledger } from "@/data";
import {
  getFirstTouch,
  getLastMarketingTouch,
  getConversionTouch,
} from "@/lib/attribution";
import { sourceConfig } from "@/lib/config/sources";
import { NOW } from "@/lib/config/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AskAnswer {
  type: "company" | "person" | "waiting" | "general" | "prompt_chips";
  title: string;
  summary: string;
  details?: Record<string, string | number | undefined>;
  items?: Array<{ label: string; value: string }>;
}

// ---------------------------------------------------------------------------
// Prompt chips (default / unrecognized)
// ---------------------------------------------------------------------------

const PROMPT_CHIPS: Array<{ label: string; value: string }> = [
  { label: "Attribution", value: "Where did [company] come from?" },
  { label: "Waiting", value: "Show leads waiting for a reply" },
  { label: "Pipeline", value: "What's our pipeline this quarter?" },
  { label: "Revenue", value: "Which source drives the most revenue?" },
  { label: "Funnel", value: "Show me the funnel breakdown" },
];

function promptChipsAnswer(): AskAnswer {
  return {
    type: "prompt_chips",
    title: "Try asking...",
    summary: "Here are some things I can help with:",
    items: PROMPT_CHIPS,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  return `\u20AC${value.toLocaleString("en-GB")}`;
}

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
    c.name.toLowerCase().includes(companyName!.toLowerCase())
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
    : "None";
  const conversionMechanism = conversion?.conversionMechanism
    ? conversion.conversionMechanism.replace(/_/g, " ")
    : "Unknown";

  return {
    type: "company",
    title: `Attribution for ${company.name}`,
    summary: contact
      ? `${contact.name} first arrived via ${firstTouchLabel} and converted through ${conversionMechanism}.`
      : `No contacts found for ${company.name}.`,
    details: {
      "First touch source": firstTouchLabel,
      "Last marketing source": lastMarketingLabel,
      "Conversion mechanism": conversionMechanism,
      "Opportunity value": opportunity
        ? formatCurrency(opportunity.value)
        : undefined,
      "Opportunity stage": opportunity?.stage,
    },
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

  const waiting: Array<{ label: string; value: string }> = [];

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
        e.timestamp.localeCompare(lastReceived.timestamp) > 0
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
    p.name.toLowerCase().includes(personName!.toLowerCase())
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
    : "None";
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

  const waitingResult = tryWaitingLeads(trimmed);
  if (waitingResult) return waitingResult;

  // Unrecognized query
  return promptChipsAnswer();
}
