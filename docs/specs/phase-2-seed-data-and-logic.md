# Specification: Phase 2 — Seed Data & Business Logic

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-27
**Status:** Draft
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Phases 3–4, `08_BUILD_INSTRUCTIONS` §52 Phases 2–3

---

## 1. Overview

### 1.1 Summary

Build the complete data layer and business logic for the IRI prototype. This phase delivers: the opportunity ledger, 8 hand-written hero records with canonical events, a deterministic seed generator for 37 additional companies and ~54 non-hero leads, all attribution/journey/metric computation functions, the Ask Inbound answer engine, global search, data repositories, and a comprehensive validation test suite that asserts every target from `00 §14`.

### 1.2 Goals

- Hand-write the 26-row opportunity ledger from `00 §9.2`
- Hand-write all 8 hero companies, contacts, sessions, events, campaigns, and integrations
- Build a deterministic seed generator (mulberry32 PRNG) that creates the remaining records
- Implement attribution logic: `deriveTouchpoints`, first_touch, last_touch, conversion_touch
- Implement attribution status computation (Full / Partial / Unknown)
- Implement account-level attribution
- Implement journey assembly (person + account)
- Implement all metric functions (overview KPIs, pipeline, revenue, funnel, response time, coverage)
- Implement Ask Inbound answer engine (5 intents, keyword matching)
- Implement global search
- Implement data repositories (getPersonById, getLeads, etc.)
- Write validation tests asserting all `00 §14` targets

### 1.3 Non-Goals

- UI components (Phase 5)
- Screen implementations (Phases 6–12)
- Playwright E2E tests (Phase 14)

### 1.4 User Story

As a developer starting Phase 5 (components) and Phase 6+ (screens),
I want a validated, consistent data layer with all business logic as pure functions,
so that every screen can derive correct values by calling `lib/` functions.

---

## 2. Acceptance Criteria

### AC-001: Opportunity ledger

GIVEN the ledger file exists at `src/data/ledger.ts`
WHEN I inspect it
THEN it contains exactly 26 opportunities matching `00 §9.2`
  AND 10 won (€740K total), 5 lost, 11 open (€1.25M total)
  AND each entry has: id, companyId, companyName, opportunityName, value, stage, firstTouchSource, ownerId, primaryContactName, primaryContactId, createdAt, closedAt (if applicable), lostReason, lostAtStage, expectedClose

---

### AC-002: Hero records — Acme Inc

GIVEN hero data exists at `src/data/heroes/acme.ts`
WHEN I load it
THEN Acme Inc company record has correct fields (domain, industry, size, location, owner Igor)
  AND John Smith has 41 events matching `04 §9` exactly
  AND John's journey path is: Google Organic → LinkedIn Organic → Direct → Contact Form
  AND Sarah Johnson exists as a Lead (LinkedIn Organic, Sep 15)
  AND Michael Brown exists as a Contact (relationship introduction by Lena Holm)
  AND RelationshipAttribution for Michael Brown exists (personal_network, Lena Holm, Acme Inc)
  AND SelfReportedAttribution for John exists ("Have been following your LinkedIn content for a while.")

---

### AC-003: Hero records — all 8 companies

GIVEN all hero files exist under `src/data/heroes/`
WHEN I load them
THEN Northstar Health has Emma Larsen (Google Ads, Book a Call, Negotiation)
  AND Atlas Systems has Thomas Weber (Unknown first/last touch, Direct conversion, Partial, relationship Daniel Fischer — Nova Group)
  AND Nordica Labs has Ingrid Solberg (LinkedIn Organic, Contact Form, Full)
  AND Vector Group has Anna Keller (Unknown, Direct, Unknown, waiting 3d 6h at NOW)
  AND Helix Finance has David Müller (LinkedIn Ads, Lost at Proposal)
  AND Meridian Logistics has Marta Novak (Event, Email Inquiry, Won)
  AND Orbit Retail has 3 disqualified leads (Meta, no opportunity)

---

### AC-004: Campaigns and integrations

GIVEN campaign and integration data exists
WHEN I load them
THEN 12 campaigns exist per `04 §7`
  AND 20 integrations exist per `00 §10.7` with correct categories and statuses
  AND Website Tracker is first in the analytics category

---

### AC-005: Seed generator produces deterministic data

GIVEN `scripts/generate-seed.ts` exists
WHEN I run it twice
THEN output is byte-identical both times
  AND it produces 37 additional companies (45 total)
  AND ~54 additional leads (80 total)
  AND output is written to `src/data/generated/`
  AND generated output is checked into git

---

### AC-006: First Touch distribution matches §9.3

GIVEN all seed data is loaded (heroes + generated)
WHEN I compute First Touch attribution for all 80 leads
THEN the distribution matches `00 §9.3` exactly:
  Google Organic 17, Google Ads 15, LinkedIn Organic 12, LinkedIn Ads 8,
  Referral 6, Event 4, Meta 5, Email 2, Unknown 11

---

### AC-007: Attribution logic

GIVEN `lib/attribution/` functions exist
WHEN I call `deriveTouchpoints(personId)` for John Smith
THEN touchpoints are derived from his sessions and events
  AND `getFirstTouch(personId)` returns google_organic
  AND `getLastMarketingTouch(personId)` returns linkedin_organic
  AND `getConversionTouch(personId)` returns { channel: direct, mechanism: contact_form }
  AND for Vector Group's Anna Keller, first/last touch return unknown
  AND for Atlas Systems' Thomas Weber, first/last marketing touch return unknown, conversion returns direct

---

### AC-008: Attribution status

GIVEN `lib/attribution/status.ts` exists
WHEN I compute attribution status for all 80 leads
THEN 58 are Full, 15 are Partial, 7 are Unknown
  AND coverage = 73% (58 / 80)
  AND John Smith is Full, Thomas Weber is Partial, Anna Keller is Unknown

---

### AC-009: Metric functions

GIVEN `lib/metrics/` functions exist
WHEN I compute overview metrics
THEN Inbound Leads = 80
  AND Opportunities = 26
  AND Open Pipeline = €1,250,000 (11 open)
  AND Won Revenue = €740,000 (10 won)
  AND Lead → Opportunity = 32.5%
  AND Avg First Response = 2h 18m ± 10m
  AND Funnel = 80 → 44 → 26 → 17 → 10

---

### AC-010: Journey assembly

GIVEN `lib/journeys/` functions exist
WHEN I call `getPersonJourney(john_smith_id)`
THEN events are returned in chronological order
  AND all 41 events are included
  AND journey path = "Google Organic → LinkedIn Organic → Direct → Contact Form"
WHEN I call `getAccountJourney(acme_id)`
THEN events from John, Sarah, and Michael are aggregated chronologically
  AND earliest touch = Google Organic (John, Sep 3)
  AND latest marketing influence = LinkedIn Organic (Sarah, Sep 15)

---

### AC-011: Ask Inbound answers

GIVEN `lib/ask/` functions exist
WHEN I query "Where did Acme come from?"
THEN structured answer includes: First Touch Google Organic, Last Marketing LinkedIn Organic, Conversion Direct/Contact Form, Opportunity €120K Proposal
WHEN I query "Show leads waiting for a reply"
THEN answer includes Anna Keller (3d 6h) plus 3 generated waiting leads
WHEN I query unrecognized text
THEN the 5 canonical prompt chips are returned

---

### AC-012: Global search

GIVEN `lib/search/` exists
WHEN I search "Acme"
THEN results include Acme Inc (company), John Smith (person), AI Transformation Platform (opportunity)
WHEN I search "john.smith@acme.com"
THEN results include John Smith

---

### AC-013: Data repositories

GIVEN `lib/data/repositories.ts` exists
WHEN I call `getPersonById("person_john_smith")`
THEN John Smith's full record is returned
WHEN I call `getLeads({ attribution: "unknown" })`
THEN 7 leads are returned including Anna Keller
WHEN I call `getAccounts({})`
THEN 45 companies are returned

---

### AC-014: Validation targets (00 §14)

GIVEN `tests/seed-validation.test.ts` exists
WHEN I run `npm run test`
THEN ALL validation checks from `00 §14` pass:
  - 80 leads, 45 companies, 26 opportunities (10/5/11)
  - €740K revenue, €1.25M pipeline, 32.5% conversion
  - 58/15/7 attribution, 73% coverage
  - Funnel 80→44→26→17→10
  - 2h 18m ±10m response
  - First Touch table matches §9.3
  - Hero assertions (Acme, Atlas, Vector)
  - Acme engagement: 5 sessions, 17 page views, 4 content, 9 emails, 2 meetings, 11 days, 17m
  - Referential integrity: no duplicate IDs, all foreign keys resolve
  - No Date.now() in src/

---

## 3. Traceability Matrix

| Criterion | Test File | Status |
|-----------|-----------|--------|
| AC-001 | `tests/seed-validation.test.ts` | ⏳ |
| AC-002 | `tests/seed-validation.test.ts` | ⏳ |
| AC-003 | `tests/seed-validation.test.ts` | ⏳ |
| AC-004 | `tests/seed-validation.test.ts` | ⏳ |
| AC-005 | `scripts/generate-seed.ts` (manual) | ⏳ |
| AC-006 | `tests/seed-validation.test.ts` | ⏳ |
| AC-007 | `tests/attribution.test.ts` | ⏳ |
| AC-008 | `tests/attribution.test.ts` | ⏳ |
| AC-009 | `tests/metrics.test.ts` | ⏳ |
| AC-010 | `tests/journeys.test.ts` | ⏳ |
| AC-011 | `tests/ask-inbound.test.ts` | ⏳ |
| AC-012 | `tests/search.test.ts` | ⏳ |
| AC-013 | `tests/repositories.test.ts` | ⏳ |
| AC-014 | `tests/seed-validation.test.ts` | ⏳ |

---

## 4. Technical Design

### 4.1 Data Layer Structure

```
src/data/
  ledger.ts                    26 opportunities (hand-written)
  heroes/
    acme.ts                    Acme Inc + John, Sarah, Michael + 41 events
    northstar.ts               Northstar Health + Emma
    atlas.ts                   Atlas Systems + Thomas + relationship
    nordica.ts                 Nordica Labs + Ingrid
    vector.ts                  Vector Group + Anna
    helix.ts                   Helix Finance + David
    meridian.ts                Meridian Logistics + Marta
    orbit.ts                   Orbit Retail + 3 disqualified
    campaigns.ts               12 campaigns
    integrations.ts            20 integrations
    users.ts                   Workspace + 3 owners
    index.ts                   Aggregates all hero data
  generated/
    companies.ts               37 generated companies
    people.ts                  ~54 generated leads
    sessions.ts                Generated sessions
    events.ts                  Generated events
    index.ts                   Aggregates generated data
  index.ts                     Merges heroes + generated, exports all

scripts/
  generate-seed.ts             Deterministic generator (mulberry32)
```

### 4.2 Business Logic Structure

```
src/lib/
  attribution/
    derive-touchpoints.ts      deriveTouchpoints(personId) → Touchpoint[]
    models.ts                  getFirstTouch, getLastMarketingTouch, getConversionTouch
    status.ts                  computeAttributionStatus → Full/Partial/Unknown
    account-attribution.ts     getAccountAttribution(companyId)
    index.ts
  journeys/
    person-journey.ts          getPersonJourney(personId) → Event[]
    account-journey.ts         getAccountJourney(companyId) → Event[]
    path.ts                    getJourneyPath(personId) → string
    index.ts
  metrics/
    overview.ts                getOverviewMetrics(dateRange)
    pipeline.ts                getPipelineBySource(model, dateRange)
    revenue.ts                 getRevenueBySource(model, dateRange)
    funnel.ts                  getConversionFunnel(dateRange)
    response-time.ts           getAvgFirstResponse()
    attribution-coverage.ts    getAttributionCoverage()
    index.ts
  data/
    repositories.ts            getPersonById, getLeads, getAccounts, etc.
  ask/
    intents.ts                 matchIntent(query) → intent | null
    answers.ts                 generateAnswer(intent) → structured answer
    index.ts
  search/
    global-search.ts           search(query) → grouped results
```

### 4.3 Generator Approach

1. Read ledger → for each non-hero opportunity, generate company + primary contact + events
2. Generate remaining non-opportunity leads to hit 80 total
3. Distribute by First Touch source per §9.3
4. Assign attribution statuses to hit 58/15/7
5. Generate response times targeting 2h 18m mean
6. Generate waiting records (3d 1h, 4d 2h, 5d 0h)
7. Generate 2 stalled opportunities
8. Output to `src/data/generated/`
9. All randomness via mulberry32 with fixed seed

---

## 5. Implementation Order

1. Workspace/users/campaigns/integrations (static data)
2. Opportunity ledger
3. Hero records one by one (Acme first, then others)
4. Seed generator + generated output
5. Data repositories
6. Attribution logic + tests
7. Journey logic + tests
8. Metric functions + tests
9. Ask Inbound + tests
10. Global search + tests
11. Seed validation suite (§14 targets)

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-27 | [x] |
