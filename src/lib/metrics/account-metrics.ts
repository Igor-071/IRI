import {
  getPeopleByCompanyId,
  getOpportunitiesByCompanyId,
  getEventsByPersonId,
} from "@/lib/data/repositories";

const OPEN_STAGES = new Set(["discovery", "qualified", "proposal", "negotiation"]);

export interface AccountMetrics {
  knownContacts: number;
  sessions: number;
  openOpportunities: number;
  openPipeline: number;
  firstSeen: string | null;
  lastActivity: string | null;
}

export function getAccountMetrics(companyId: string): AccountMetrics {
  const people = getPeopleByCompanyId(companyId);
  const opportunities = getOpportunitiesByCompanyId(companyId);

  let sessions = 0;
  let firstSeen: string | null = null;
  let lastActivity: string | null = null;

  for (const person of people) {
    const events = getEventsByPersonId(person.id);
    for (const ev of events) {
      if (ev.type === "session_started") {
        sessions++;
      }
      if (firstSeen === null || ev.timestamp < firstSeen) {
        firstSeen = ev.timestamp;
      }
      if (lastActivity === null || ev.timestamp > lastActivity) {
        lastActivity = ev.timestamp;
      }
    }
  }

  const openOpps = opportunities.filter((o) => OPEN_STAGES.has(o.stage));
  const openPipeline = openOpps.reduce((sum, o) => sum + o.value, 0);

  return {
    knownContacts: people.length,
    sessions,
    openOpportunities: openOpps.length,
    openPipeline,
    firstSeen,
    lastActivity,
  };
}
