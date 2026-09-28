# Specification: Phase 7 — Accounts List & Account Detail

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-28
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 9, `08_BUILD_INSTRUCTIONS` Phase 9

---

## 1. Overview

### 1.1 Summary

Build the Accounts list and Account Detail pages — the B2B account view that aggregates multiple people, their attribution, opportunities, and commercial context into a single company screen. This is a critical P0 demo path stop: from Lead Detail, users click a company name (e.g. "Acme Inc") and see all contacts, their individual first touches, opportunities, account-level attribution, and the aggregated journey timeline.

The Account Detail page is the account-level counterpart to Lead Detail. Where Lead Detail focuses on an individual person's journey, Account Detail aggregates all people at a company into a unified view — showing how the buying committee formed, which channels brought each person, and how relationships contributed.

### 1.2 Goals

- Add `getAccountMetrics()` utility for per-company KPIs derived from aggregated events
- Add `getAccountAttribution()` utility for 3-part account attribution (earliest touch, latest marketing, relationships)
- Build Accounts list page with search, source, and owner filters + URL param sync
- Build Account Detail page with identity header, KPI strip, contacts, opportunities, attribution, and journey
- Extend `JourneyTimeline` to support account mode (aggregate events from all people, prefix with actor names)
- Handle invalid IDs with `notFound()`
- Enable navigation from Lead Detail company link → Account Detail (P0 demo path)

### 1.3 Non-Goals

- Editable account fields (V2)
- Account scoring or health metrics (V2)
- Account hierarchy / parent-child relationships (V2)
- Account activity feed beyond journey events (V2)
- Account-level opportunity pipeline chart (V2)

### 1.4 User Story

As a revenue leader viewing an account's detail page,
I want to see all known contacts, their attribution sources, open opportunities, and the aggregated journey across people,
so that I can understand how the buying committee formed, what channels drove engagement, and where the account stands commercially.

---

## 2. Acceptance Criteria

### AC-001: Accounts list displays all companies

```gherkin
GIVEN the user navigates to /accounts
WHEN the page renders
THEN it shows all 26 companies in a table
AND columns are: Company (name, industry, location), Contacts, First Touch, Opportunities, Open Pipeline, Last Activity, Owner
AND clicking a row navigates to /accounts/<companyId>
```

**Status:** PASSED — `AccountTable` renders 7 columns via DataTable; `onRowClick` pushes to `/accounts/${row.id}`; `getAccounts()` returns all 26 companies

---

### AC-002: Accounts list filters work

```gherkin
GIVEN the Accounts page
WHEN the user selects Source or Owner filters, or types in search
THEN the table filters accordingly (Source = earliest account first touch, Owner = company owner)
AND search matches company name or domain (case-insensitive)
AND URL params sync for source and owner
```

**Status:** PASSED — `AccountFilters` syncs `source` and `owner` URL params via `useSearchParams`/`router.replace`; `AccountsContent` filters by `getAccountEarliestTouch()` source, `company.ownerId`, and search against `name`/`domain`

---

### AC-003: Account Detail header shows company identity

```gherkin
GIVEN the user navigates to /accounts/company_acme
WHEN the page renders
THEN header shows: "Acme Inc", domain "acme.com", industry "Technology", size "500–1,000", location "Stockholm, Sweden"
AND breadcrumb shows "Accounts → Acme Inc"
AND OwnerChip shows "Igor Kraisnik"
AND notFound() for invalid IDs
```

**Status:** PASSED — `AccountIdentityHeader` renders company name, domain (Globe icon), industry (Factory icon), size (Users icon), location (MapPin icon), and `OwnerChip`; page calls `notFound()` when `getCompanyById(id)` returns undefined

---

### AC-004: Account KPI strip shows derived metrics

```gherkin
GIVEN the Acme Inc account detail
WHEN the KPI strip renders
THEN it shows: Known Contacts (3), Sessions (aggregate), Open Opportunities (1), Open Pipeline (€120,000), First Seen, Last Activity
AND all values are derived from seed data
```

**Status:** PASSED — `getAccountMetrics()` aggregates across all people: counts `session_started` events, filters opportunities by open stages (`discovery`/`qualified`/`proposal`/`negotiation`), sums pipeline values, finds min/max timestamps; `AccountKpiStrip` renders 6 stat items

---

### AC-005: Known Contacts section lists all people

```gherkin
GIVEN Acme has 3 people (John, Sarah, Michael)
WHEN the Known Contacts section renders
THEN it shows all 3 with name, title, first touch source, last activity
AND John Smith is marked "Primary contact"
AND each is clickable → navigates to /leads/<personId>
```

**Status:** PASSED — `AccountContacts` renders `ContactCard` for each person via `getPeopleByCompanyId()`; primary contact detected via `getOpportunityByPersonId()`; each card is a `<Link>` to `/leads/${person.id}`

---

### AC-006: Opportunities section shows compact table

```gherkin
GIVEN Acme has 1 opportunity (AI Transformation Platform)
WHEN the Opportunities section renders
THEN it shows: name, stage (Proposal), value (€120,000), owner, expected close
AND if no opportunities, section shows "No opportunities"
```

**Status:** PASSED — `AccountOpportunities` renders opportunity cards with `StageBadge` (variant="opportunity"), `MoneyValue` (full format), `OwnerChip`, and `DateTime` for expected close; shows "No opportunities." when empty

---

### AC-007: Account Attribution displays 3-part summary

```gherkin
GIVEN Acme account
WHEN the Account Attribution section renders
THEN it shows:
  Earliest account touch: Google Organic · John Smith
  Latest marketing influence: LinkedIn Organic · Sarah Johnson
  Relationship influence: Michael Brown · introduced by Lena Holm (personal network)
AND explicitly communicates that account journeys aggregate multiple people
```

**Status:** PASSED — `getAccountAttribution()` delegates to `getAccountEarliestTouch()`, `getAccountLatestMarketingTouch()`, and `getRelationshipsByPersonId()` for each person; `AccountAttributionSection` renders 3-column grid with `SourceBadge`, person `Link`s, timestamps, and relationship details; header text states "Account journeys aggregate attribution from multiple people."

---

### AC-008: Account journey shows events from all people

```gherkin
GIVEN the Acme account with events from John, Sarah, Michael
WHEN the Account Journey section renders
THEN it shows events from all people, grouped by date
AND event rows identify the actor (person name)
AND "Journey assembled from N systems" header is shown
```

**Status:** PASSED — `JourneyTimeline` extended with optional `companyId` prop; when provided, uses `getAccountJourney(companyId)` instead of `getPersonJourney(personId)`; builds `personNameMap` from event person IDs; prefixes descriptions with "PersonName — description" in account mode

---

### AC-009: Navigation from Lead Detail works

```gherkin
GIVEN the Lead Detail for John Smith shows company "Acme Inc" as a link
WHEN the user clicks the company link
THEN they navigate to /accounts/company_acme
AND the Account Detail loads with correct data
```

**Status:** PASSED — `LeadIdentityHeader` already renders `<Link href="/accounts/${company.id}">` (implemented in Phase 6); Account Detail page loads with all sections populated

---

### AC-010: No raw hex colors

```gherkin
GIVEN all new files in Phase 7
WHEN scanned for hex color patterns
THEN zero matches found
```

**Status:** PASSED — grep confirms 0 hex color matches across all 12 new/modified files

---

### AC-011: Existing tests still pass

```gherkin
GIVEN the 101 existing tests
WHEN npm run test executes
THEN all 101 tests pass
AND TypeScript compilation succeeds with zero errors
```

**Status:** PASSED — 101/101 tests, `tsc --noEmit` clean

---

## 3. Traceability Matrix

| Criterion | Test / Verification | Status |
|-----------|---------------------|--------|
| AC-001 | Code review: `account-table.tsx` — 7 columns defined, `onRowClick` → `router.push(/accounts/${row.id})`, `getAccounts()` returns 26 companies | PASSED |
| AC-002 | Code review: `account-filters.tsx` — `updateParam` syncs URL params; `accounts/page.tsx` — filters by `getAccountEarliestTouch()` source, `company.ownerId`, and `name`/`domain` search | PASSED |
| AC-003 | Code review: `account-identity-header.tsx` — renders name, domain, industry, size, location with icons + `OwnerChip`; `[id]/page.tsx` — `notFound()` when `getCompanyById()` returns undefined | PASSED |
| AC-004 | Code review: `account-metrics.ts` — counts `session_started`, filters open stages, sums pipeline, finds min/max timestamps; `account-kpi-strip.tsx` — 6 StatItems | PASSED |
| AC-005 | Code review: `account-contacts.tsx` — `ContactCard` with avatar, name, title, `SourceBadge`, `DateTime`; primary contact badge via `getOpportunityByPersonId()`; `Link` to `/leads/${person.id}` | PASSED |
| AC-006 | Code review: `account-opportunities.tsx` — `StageBadge` variant="opportunity", `MoneyValue` full, `OwnerChip`, `DateTime` short; "No opportunities." fallback | PASSED |
| AC-007 | Code review: `account-attribution.ts` — delegates to `getAccountEarliestTouch()`/`getAccountLatestMarketingTouch()`/`getRelationshipsByPersonId()`; `account-attribution-section.tsx` — 3-column grid, person links, relationship details | PASSED |
| AC-008 | Code review: `journey-timeline.tsx` — optional `companyId` prop, `getAccountJourney()`, `personNameMap`, "PersonName — description" prefix in account mode | PASSED |
| AC-009 | Code review: `lead-identity-header.tsx` already has `<Link href="/accounts/${company.id}">`; Account Detail page renders with correct data | PASSED |
| AC-010 | `grep '#[0-9a-fA-F]'` on new files — 0 matches | PASSED |
| AC-011 | `npm run test` — 101/101 pass, `tsc --noEmit` clean | PASSED |

---

## 4. Technical Design

### 4.1 Account Metrics Utility

**`src/lib/metrics/account-metrics.ts`**

```typescript
interface AccountMetrics {
  knownContacts: number;   // getPeopleByCompanyId().length
  sessions: number;        // count of session_started events across all people
  openOpportunities: number; // opportunities in open stages (discovery/qualified/proposal/negotiation)
  openPipeline: number;    // sum of open opportunity values
  firstSeen: string | null;  // earliest event timestamp across all people
  lastActivity: string | null; // latest event timestamp across all people
}

export function getAccountMetrics(companyId: string): AccountMetrics;
```

Iterates all people at the company, aggregates their events in a single pass per person — counting `session_started` events and tracking min/max timestamps. Open opportunities are filtered from the ledger by stage.

### 4.2 Account Attribution Utility

**`src/lib/attribution/account-attribution.ts`**

```typescript
interface AccountAttributionSummary {
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

export function getAccountAttribution(companyId: string): AccountAttributionSummary;
```

Delegates to existing `getAccountEarliestTouch()` and `getAccountLatestMarketingTouch()` from `lib/journeys/index.ts` for touch attribution. Aggregates relationship attributions across all people at the company via `getRelationshipsByPersonId()`. Converts source labels back to `AcquisitionSource` keys via reverse lookup against `sourceConfig`.

### 4.3 JourneyTimeline Extension

The `JourneyTimeline` component was extended with backward-compatible changes:

```typescript
interface JourneyTimelineProps {
  personId?: string;   // was required, now optional
  companyId?: string;  // new: triggers account mode
  className?: string;
}
```

When `companyId` is provided:
- Uses `getAccountJourney(companyId)` instead of `getPersonJourney(personId)`
- Builds a `personNameMap` (Map<string, string>) from event person IDs → person names
- Passes the map through `collapsePageViews()` → `TimelineEvent.actorName`
- Renders descriptions as "PersonName — description" in account mode

Existing Lead Detail usage (`<JourneyTimeline personId={person.id} />`) is unchanged.

### 4.4 Component Architecture

```
src/components/features/accounts/
  account-filters.tsx               ← Client: Search + Source + Owner selects, URL param sync
  account-table.tsx                 ← Client: DataTable with 7 columns, row click → /accounts/<id>
  account-identity-header.tsx       ← Server: Building2 icon, name, domain, industry, size, location, OwnerChip
  account-kpi-strip.tsx             ← Client: 6-metric stat line from getAccountMetrics()
  account-contacts.tsx              ← Client: contact cards with avatar, primary badge, Link to lead detail
  account-opportunities.tsx         ← Client: opportunity cards with stage, value, owner, expected close
  account-attribution-section.tsx   ← Client: 3-column grid — earliest touch, latest marketing, relationships
```

### 4.5 Page Composition

**Accounts List (`/accounts`):**

```
AccountsPage (client component)
  └── Suspense
        └── AccountsContent
              └── ListLayout
                    ├── title: "Accounts"
                    ├── subtitle: "B2B accounts and their commercial relationships."
                    ├── filters: AccountFilters
                    └── children: AccountTable
```

**Account Detail (`/accounts/[id]`):**

```
AccountDetailPage (server component, async)
  └── RecordDetailLayout
        ├── breadcrumb: Accounts → {company.name}
        ├── header: AccountIdentityHeader
        └── children:
              ├── AccountKpiStrip
              ├── Known Contacts section
              │     └── AccountContacts
              ├── Opportunities section
              │     └── AccountOpportunities
              ├── Account Attribution section
              │     └── AccountAttributionSection
              └── Account Journey section
                    └── JourneyTimeline (companyId mode)
```

The detail page is a server component. It fetches company data synchronously from in-memory seed data and passes the `companyId` to client components that use `useMemo` for their own data derivation.

### 4.6 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Account metrics | New `lib/metrics/account-metrics.ts` | Parallel to `engagement.ts`; keeps business logic out of components |
| Account attribution | New `lib/attribution/account-attribution.ts` | Delegates to existing journey functions; adds relationship aggregation |
| Source label → key resolution | `sourceLabelToKey()` reverse lookup | `getAccountEarliestTouch()` returns label strings; need `AcquisitionSource` keys for `SourceBadge` |
| JourneyTimeline extension | Optional `companyId` prop, keep `personId` optional | Backward compatible — existing Lead Detail usage unchanged |
| Account detail layout | Server component page with RecordDetailLayout, no sidebar | Account has more horizontal content than Lead Detail; no context rail needed |
| Accounts list page | Client component with Suspense (`useSearchParams`) | Same pattern as Leads list page |
| Primary contact detection | `getOpportunityByPersonId(person.id)` | If person is primary contact on an opportunity, show badge |
| Account table First Touch | `getAccountEarliestTouch()` from journeys lib | Returns `{source, personName, timestamp}` — convert label to key, render `SourceBadge` |
| Contacts section | Cards with `Link` to lead detail | Spec requires click → Lead Detail; cards provide richer presentation than table rows |
| Open pipeline calculation | Filter opportunities by open stages, sum values | `OPEN_STAGES` Set for O(1) lookup; consistent with pipeline definitions in `00_DECISIONS.md` |

### 4.7 Reused Modules

| Module | Usage |
|--------|-------|
| `lib/data/repositories` | `getCompanyById()`, `getPeopleByCompanyId()`, `getOpportunitiesByCompanyId()`, `getEventsByPersonId()`, `getPersonById()`, `getOpportunityByPersonId()`, `getRelationshipsByPersonId()`, `getAccounts()` |
| `lib/journeys` | `getAccountJourney()`, `getAccountEarliestTouch()`, `getAccountLatestMarketingTouch()`, `getPersonJourney()` |
| `lib/config/sources` | `sourceConfig` for label/color lookup, `isMarketingTouch()` |
| `lib/config/owners` | `ownerOptions` for filter dropdown |
| `lib/formatting/dates` | `formatRelativeDate()` via `DateTime` component |
| `lib/formatting/money` | `formatMoney()`, `formatMoneyFull()` via `MoneyValue` component |
| `lib/config/stages` | `opportunityStageConfig` via `StageBadge` |
| `components/domain/*` | CompanyIdentity, SourceBadge, StageBadge, OwnerChip, MoneyValue, DateTime, SourceSystemChip |
| `components/layout` | ListLayout, RecordDetailLayout, PageHeader |
| `components/ui` | DataTable, Input, Select, Button, Avatar, Badge |

---

## 5. Files

### Files Created

| File | Purpose |
|------|---------|
| `src/lib/metrics/account-metrics.ts` | Pure function `getAccountMetrics()` — computes 6 account KPI metrics from aggregated events and opportunities |
| `src/lib/attribution/account-attribution.ts` | Pure function `getAccountAttribution()` — 3-part attribution summary (earliest, latest marketing, relationships) |
| `src/components/features/accounts/account-filters.tsx` | Search + Source + Owner filter bar with URL param sync and result count |
| `src/components/features/accounts/account-table.tsx` | DataTable with 7 columns: Company, Contacts, First Touch, Opportunities, Open Pipeline, Last Activity, Owner |
| `src/components/features/accounts/account-identity-header.tsx` | Header: Building2 icon, company name, domain, industry, size, location, OwnerChip |
| `src/components/features/accounts/account-kpi-strip.tsx` | Compact 6-metric stat line from `getAccountMetrics()` |
| `src/components/features/accounts/account-contacts.tsx` | Contact cards with avatar, name, title, first touch, last activity, primary contact badge, clickable → lead detail |
| `src/components/features/accounts/account-opportunities.tsx` | Opportunity cards with name, stage, value, owner, expected close; "No opportunities." fallback |
| `src/components/features/accounts/account-attribution-section.tsx` | 3-column attribution: earliest touch, latest marketing influence, relationship influence with person links |

### Files Modified

| File | Change |
|------|--------|
| `src/components/features/journey/journey-timeline.tsx` | Added optional `companyId` prop; account mode uses `getAccountJourney()`, builds person name map, prefixes event descriptions with actor names |
| `src/app/(app)/accounts/page.tsx` | Replaced placeholder with client component: Suspense-wrapped `AccountsContent` with `ListLayout`, `AccountFilters`, `AccountTable`, filtering by source/owner/search |
| `src/app/(app)/accounts/[id]/page.tsx` | Replaced placeholder with server component: `RecordDetailLayout` with breadcrumb, `AccountIdentityHeader`, `AccountKpiStrip`, `AccountContacts`, `AccountOpportunities`, `AccountAttributionSection`, `JourneyTimeline` (account mode); `notFound()` for invalid IDs |

---

## 6. Quality Gates

| Gate | Result |
|------|--------|
| TypeScript clean (`npx tsc --noEmit`) | PASSED — 0 errors |
| Lint clean (new/modified files) | PASSED — 0 errors, 0 warnings |
| Tests pass (`npm run test`) | PASSED — 101/101 (all existing tests preserved) |
| No raw hex colors | PASSED — grep confirms 0 matches in all new files |
| Existing tests preserved | PASSED — all 101 prior tests still pass |
| Code review | PASSED — no dead code, no hardcoded values, no boundary errors |

---

## 7. P0 Demo Path Coverage

This phase enables the following segments of the P0 demo path:

```
... John Smith / Acme → ... → Customer Journey → Acme Account → ...
```

Specifically:
- From Lead Detail, click "Acme Inc" company link → `/accounts/company_acme`
- Account header: "Acme Inc", acme.com, Technology, 500–1,000, Stockholm Sweden, Owner: Igor Kraisnik
- KPI strip: 3 contacts, aggregated sessions, 1 open opp, €120,000 pipeline
- Known Contacts: John Smith (Primary contact), Sarah Johnson, Michael Brown — each clickable → lead detail
- Opportunity: AI Transformation Platform, Proposal, €120,000
- Account Attribution:
  - Earliest: Google Organic · John Smith
  - Latest Marketing: LinkedIn Organic · Sarah Johnson
  - Relationship: Michael Brown · introduced by Lena Holm (personal network)
- Account Journey: events from all 3 people, grouped by date, with actor name prefixes
- Breadcrumb "Accounts" → back to `/accounts` list
- Invalid account ID → 404

---

## 8. Canonical Demo Records — Verification

### Acme Inc (`company_acme`)

| Field | Expected | Actual |
|-------|----------|--------|
| Contacts | 3 (John Smith, Sarah Johnson, Michael Brown) | 3 — via `getPeopleByCompanyId()` |
| Earliest Touch | Google Organic · John Smith | Google Organic · John Smith — via `getAccountEarliestTouch()` |
| Latest Marketing | LinkedIn Organic · Sarah Johnson | LinkedIn Organic · Sarah Johnson — via `getAccountLatestMarketingTouch()` |
| Relationship | Michael Brown · Personal Network · Lena Holm | Michael Brown · personal_network · Lena Holm — via `getRelationshipsByPersonId()` |
| Open Opportunities | 1 (AI Transformation Platform, Proposal, €120,000) | 1 — via `getOpportunitiesByCompanyId()` filtered by open stages |

### Vector Group (`company_vector`)

| Field | Expected | Actual |
|-------|----------|--------|
| First Touch | Unknown | Unknown — no marketing sessions, `getAccountEarliestTouch()` returns direct |
| Attribution | Unknown — do not infer a source | Unknown — no marketing touch found |

### Atlas Systems (`company_atlas`)

| Field | Expected | Actual |
|-------|----------|--------|
| First Touch | Unknown (Direct conversion) | Direct — via `getAccountEarliestTouch()` |
| Relationship | Existing Client Referral · Daniel Fischer (Nova Group) | existing_client_referral — via `getRelationshipsByPersonId()` |

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-28 | [x] |
