import { describe, it, expect } from "vitest";
import { companies, people, sessions, events, ledger, relationships, selfReported } from "@/data";
import { getAttributionStatus, getAttributionCoverage } from "@/lib/attribution/status";
import { deriveTouchpoints, getFirstTouch, getLastMarketingTouch, getConversionTouch } from "@/lib/attribution/touchpoints";
import { getFunnelCounts, getOverviewMetrics, getAvgFirstResponse } from "@/lib/metrics";
import { getJourneyPath } from "@/lib/journeys";
import { globalSearch } from "@/lib/search";
import { getPersonById, getCompanyById, getLeads, getSessionsByPersonId, getEventsByPersonId, getOpportunitiesByCompanyId } from "@/lib/data/repositories";
import { isMarketingTouch } from "@/lib/config/sources";

// ---------------------------------------------------------------------------
// §14 — Volume targets
// ---------------------------------------------------------------------------

describe("volume targets", () => {
  it("has 45 companies", () => {
    expect(companies).toHaveLength(45);
  });

  it("has 80 people (leads)", () => {
    expect(people).toHaveLength(80);
  });

  it("has 26 opportunities in ledger", () => {
    expect(ledger).toHaveLength(26);
  });

  it("every person has a valid companyId", () => {
    const companyIds = new Set(companies.map((c) => c.id));
    for (const p of people) {
      expect(companyIds.has(p.companyId)).toBe(true);
    }
  });

  it("every session has a valid personId", () => {
    const personIds = new Set(people.map((p) => p.id));
    for (const s of sessions) {
      expect(personIds.has(s.personId)).toBe(true);
    }
  });

  it("every event has a valid personId", () => {
    const personIds = new Set(people.map((p) => p.id));
    for (const e of events) {
      expect(personIds.has(e.personId)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// §14 — First touch source distribution
// ---------------------------------------------------------------------------

describe("first touch source distribution", () => {
  const dist: Record<string, number> = {};
  for (const p of people) {
    dist[p.firstTouchSource] = (dist[p.firstTouchSource] || 0) + 1;
  }

  it("Google Organic: 17", () => expect(dist["google_organic"]).toBe(17));
  it("Google Ads: 15", () => expect(dist["google_ads"]).toBe(15));
  it("LinkedIn Organic: 12", () => expect(dist["linkedin_organic"]).toBe(12));
  it("LinkedIn Ads: 8", () => expect(dist["linkedin_ads"]).toBe(8));
  it("Referral: 6", () => expect(dist["referral"]).toBe(6));
  it("Meta: 5", () => expect(dist["meta"]).toBe(5));
  it("Event: 4", () => expect(dist["event"]).toBe(4));
  it("Email: 2", () => expect(dist["email"]).toBe(2));
  it("Unknown + Direct = 11", () => {
    expect((dist["unknown"] ?? 0) + (dist["direct"] ?? 0)).toBe(11);
  });
});

// ---------------------------------------------------------------------------
// §14 — Conversion funnel
// ---------------------------------------------------------------------------

describe("conversion funnel", () => {
  it("matches [80, 44, 26, 17, 10]", () => {
    const funnel = getFunnelCounts();
    expect(funnel).toEqual([80, 44, 26, 17, 10]);
  });

  it("leads = 80", () => expect(getFunnelCounts()[0]).toBe(80));
  it("qualified+ = 44", () => expect(getFunnelCounts()[1]).toBe(44));
  it("opportunities = 26", () => expect(getFunnelCounts()[2]).toBe(26));
  it("proposals = 17", () => expect(getFunnelCounts()[3]).toBe(17));
  it("won = 10", () => expect(getFunnelCounts()[4]).toBe(10));
});

// ---------------------------------------------------------------------------
// §14 — Revenue & pipeline
// ---------------------------------------------------------------------------

describe("revenue and pipeline", () => {
  it("won revenue = €740,000", () => {
    const metrics = getOverviewMetrics();
    expect(metrics.wonRevenue).toBe(740_000);
  });

  it("open pipeline = €1,250,000", () => {
    const metrics = getOverviewMetrics();
    expect(metrics.openPipeline).toBe(1_250_000);
  });

  it("10 won opportunities", () => {
    expect(ledger.filter((e) => e.stage === "won")).toHaveLength(10);
  });

  it("5 lost opportunities", () => {
    expect(ledger.filter((e) => e.stage === "lost")).toHaveLength(5);
  });

  it("11 open opportunities", () => {
    expect(
      ledger.filter((e) => e.stage !== "won" && e.stage !== "lost"),
    ).toHaveLength(11);
  });
});

// ---------------------------------------------------------------------------
// §14 — Attribution status distribution
// ---------------------------------------------------------------------------

describe("attribution status distribution", () => {
  const statusCounts = { full: 0, partial: 0, unknown: 0 };
  for (const p of people) {
    const s = getAttributionStatus(p);
    statusCounts[s]++;
  }

  it("58 Full", () => expect(statusCounts.full).toBe(58));
  it("15 Partial", () => expect(statusCounts.partial).toBe(15));
  it("7 Unknown", () => expect(statusCounts.unknown).toBe(7));

  it("attribution coverage = 72.5%", () => {
    const coverage = getAttributionCoverage(people);
    expect(coverage).toBeCloseTo(0.725, 2);
  });
});

// ---------------------------------------------------------------------------
// §14 — Attribution status is derived from data (not stored)
// ---------------------------------------------------------------------------

describe("attribution derivation", () => {
  it("Full status = person has at least one session with marketing source", () => {
    const fullPeople = people.filter((p) => getAttributionStatus(p) === "full");
    for (const person of fullPeople) {
      const touchpoints = deriveTouchpoints(person.id);
      const hasMarketing = touchpoints.some((tp) => isMarketingTouch(tp.source));
      expect(hasMarketing).toBe(true);
    }
  });

  it("Unknown status = no marketing sessions, non-marketing firstTouchSource, no relationship/self-reported", () => {
    const relSet = new Set(relationships.map((r) => r.personId));
    const srSet = new Set(selfReported.map((sr) => sr.personId));
    const unknownPeople = people.filter((p) => getAttributionStatus(p) === "unknown");
    for (const person of unknownPeople) {
      const touchpoints = deriveTouchpoints(person.id);
      const hasMarketing = touchpoints.some((tp) => isMarketingTouch(tp.source));
      expect(hasMarketing).toBe(false);
      expect(isMarketingTouch(person.firstTouchSource)).toBe(false);
      expect(relSet.has(person.id)).toBe(false);
      expect(srSet.has(person.id)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// §14 — Response time
// ---------------------------------------------------------------------------

describe("mean first response time", () => {
  it("is within 128–148 minutes (2h 18m ± 10m)", () => {
    const avg = getAvgFirstResponse();
    expect(avg).toBeGreaterThanOrEqual(128);
    expect(avg).toBeLessThanOrEqual(148);
  });
});

// ---------------------------------------------------------------------------
// Hero record integrity — Acme Corp / John Smith
// ---------------------------------------------------------------------------

describe("hero: Acme Corp / John Smith", () => {
  it("John Smith exists and is at Acme Corp", () => {
    const john = getPersonById("person_john_smith");
    expect(john).toBeDefined();
    expect(john!.companyId).toBe("company_acme");
  });

  it("John Smith has google_organic first touch", () => {
    const john = getPersonById("person_john_smith")!;
    expect(john.firstTouchSource).toBe("google_organic");
  });

  it("John Smith attribution status is full", () => {
    const john = getPersonById("person_john_smith")!;
    expect(getAttributionStatus(john)).toBe("full");
  });

  it("John Smith first touch = google_organic", () => {
    const ft = getFirstTouch("person_john_smith");
    expect(ft).toBeDefined();
    expect(ft!.source).toBe("google_organic");
  });

  it("John Smith last marketing touch = linkedin_organic", () => {
    const lmt = getLastMarketingTouch("person_john_smith");
    expect(lmt).toBeDefined();
    expect(lmt!.source).toBe("linkedin_organic");
  });

  it("John Smith conversion touch = contact_form", () => {
    const ct = getConversionTouch("person_john_smith");
    expect(ct).toBeDefined();
    expect(ct!.conversionMechanism).toBe("contact_form");
  });

  it("John Smith journey path includes Google Organic → LinkedIn Organic → Direct → Contact Form", () => {
    const path = getJourneyPath("person_john_smith");
    expect(path).toContain("Google Organic");
    expect(path).toContain("LinkedIn Organic");
    expect(path).toContain("Direct");
    expect(path).toContain("Contact Form");
  });

  it("John Smith has sessions", () => {
    const s = getSessionsByPersonId("person_john_smith");
    expect(s.length).toBeGreaterThan(0);
  });

  it("John Smith has events", () => {
    const e = getEventsByPersonId("person_john_smith");
    expect(e.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Hero: Thomas Weber (Atlas) — partial attribution
// ---------------------------------------------------------------------------

describe("hero: Thomas Weber / Atlas Systems — partial attribution", () => {
  it("Thomas Weber exists", () => {
    const thomas = getPersonById("person_thomas_weber");
    expect(thomas).toBeDefined();
  });

  it("Thomas Weber attribution status is partial", () => {
    const thomas = getPersonById("person_thomas_weber")!;
    expect(getAttributionStatus(thomas)).toBe("partial");
  });

  it("Thomas Weber has no marketing sessions", () => {
    const lmt = getLastMarketingTouch("person_thomas_weber");
    expect(lmt).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Hero: Anna Keller (Vector) — unknown attribution
// ---------------------------------------------------------------------------

describe("hero: Anna Keller / Vector Group — unknown attribution", () => {
  it("Anna Keller exists", () => {
    const anna = getPersonById("person_anna_keller");
    expect(anna).toBeDefined();
  });

  it("Anna Keller attribution status is unknown", () => {
    const anna = getPersonById("person_anna_keller")!;
    expect(getAttributionStatus(anna)).toBe("unknown");
  });

  it("Anna Keller first touch source is unknown", () => {
    const anna = getPersonById("person_anna_keller")!;
    expect(anna.firstTouchSource).toBe("unknown");
  });
});

// ---------------------------------------------------------------------------
// Repositories
// ---------------------------------------------------------------------------

describe("repositories", () => {
  it("getPersonById returns correct person", () => {
    const p = getPersonById("person_john_smith");
    expect(p).toBeDefined();
    expect(p!.name).toBe("John Smith");
  });

  it("getCompanyById returns correct company", () => {
    const c = getCompanyById("company_acme");
    expect(c).toBeDefined();
    expect(c!.name).toBe("Acme Inc");
  });

  it("getLeads returns all 80 people with no filters", () => {
    expect(getLeads()).toHaveLength(80);
  });

  it("getLeads filters by attribution status", () => {
    expect(getLeads({ attribution: "full" })).toHaveLength(58);
    expect(getLeads({ attribution: "partial" })).toHaveLength(15);
    expect(getLeads({ attribution: "unknown" })).toHaveLength(7);
  });

  it("getOpportunitiesByCompanyId returns Acme opportunities", () => {
    const opps = getOpportunitiesByCompanyId("company_acme");
    expect(opps.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

describe("global search", () => {
  it("finds Acme Corp by name", () => {
    const results = globalSearch("Acme");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("Acme Inc");
  });

  it("finds John Smith by name", () => {
    const results = globalSearch("John Smith");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("John Smith");
  });

  it("returns empty for empty query", () => {
    expect(globalSearch("")).toHaveLength(0);
  });

  it("returns at most 20 results", () => {
    // "a" should match many entries
    const results = globalSearch("a");
    expect(results.length).toBeLessThanOrEqual(20);
  });
});

// ---------------------------------------------------------------------------
// CRM cutover: sourceSystem
// ---------------------------------------------------------------------------

describe("CRM cutover", () => {
  it("CRM events before 2026-09-15 use hubspot", () => {
    const cutover = "2026-09-15T00:00:00";
    const crmBefore = events.filter(
      (e) => e.category === "crm" && e.timestamp < cutover,
    );
    expect(crmBefore.length).toBeGreaterThan(0);
    for (const e of crmBefore) {
      expect(e.sourceSystem).toBe("hubspot");
    }
  });

  it("CRM events from 2026-09-15 onward use sales_tracker", () => {
    const cutover = "2026-09-15T00:00:00";
    const crmAfter = events.filter(
      (e) => e.category === "crm" && e.timestamp >= cutover,
    );
    expect(crmAfter.length).toBeGreaterThan(0);
    for (const e of crmAfter) {
      expect(e.sourceSystem).toBe("sales_tracker");
    }
  });
});

// ---------------------------------------------------------------------------
// Data integrity: no duplicate IDs
// ---------------------------------------------------------------------------

describe("no duplicate IDs", () => {
  it("company IDs are unique", () => {
    const ids = companies.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("person IDs are unique", () => {
    const ids = people.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("session IDs are unique", () => {
    const ids = sessions.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("event IDs are unique", () => {
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ledger IDs are unique", () => {
    const ids = ledger.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
