# Specification: Phase 6 — Lead Detail

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-28
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 8, `08_BUILD_INSTRUCTIONS` Phase 8

---

## 1. Overview

### 1.1 Summary

Build the Lead Detail page — the signature screen that reconstructs the full path from first marketing touch to revenue for an individual lead. This is the most critical stop on the P0 demo path: users click a lead row (e.g. John Smith / Acme) and see identity, commercial context, attribution with "Why?" evidence, engagement metrics, the full customer journey timeline, and a context rail with opportunity details, communication summary, and related contacts.

The two heavy components — `AttributionSummary` and `JourneyTimeline` — were already fully implemented in Phase 3. This phase composes them with new lead-specific sections into the full detail page.

### 1.2 Goals

- Add `getPersonEngagement()` utility for per-person engagement metrics derived from events
- Build LeadIdentityHeader with avatar, name, title, email, company link, stage, and owner
- Build EngagementSummary — compact horizontal stat line with 7 derived metrics
- Build context rail sidebar: OpportunitySummary, CommunicationSummary, RelatedContacts
- Compose the Lead Detail page replacing the placeholder with RecordDetailLayout
- Handle invalid IDs with `notFound()`
- Enable navigation from Leads list row click (already wired in Phase 5)

### 1.3 Non-Goals

- Account Detail page (Phase 9)
- Editable lead fields (V2)
- Export / PDF generation (V2)
- Activity log / audit trail beyond journey events (V2)
- Lead scoring or predictive analytics (V2)

### 1.4 User Story

As a revenue leader viewing a lead's detail page,
I want to see the full identity, attribution chain with evidence, engagement metrics, customer journey, and commercial context,
so that I can understand how this lead arrived, how they engaged, and where they stand in the pipeline.

---

## 2. Acceptance Criteria

### AC-001: Page loads and shows lead identity

```gherkin
GIVEN the user navigates to /leads/person_john_smith
WHEN the page renders
THEN the header shows: name "John Smith", title "VP Product", email, company "Acme Inc" (clickable → /accounts/company_acme)
AND the breadcrumb shows "Leads → John Smith"
AND StageBadge shows "Proposal", OwnerChip shows "Igor Kraisnik"
AND a 404-style message appears for invalid IDs
```

**Status:** PASSED

---

### AC-002: Attribution summary displays correctly

```gherkin
GIVEN a lead with full attribution (John Smith)
WHEN the Attribution section renders
THEN it shows First Touch (Google Organic), Last Marketing Touch (LinkedIn Organic), Conversion (Contact Form)
AND "Why?" buttons open evidence dialogs
AND Self-Reported shows "Have been following your LinkedIn content for a while."
```

**Status:** PASSED — AttributionSummary component renders all touchpoints, "Why?" dialogs, self-reported, and relationship sections

---

### AC-003: Unknown attribution displays correctly

```gherkin
GIVEN a lead with unknown attribution (e.g. Vector Group contact)
WHEN the Attribution section renders
THEN First Touch and Last Marketing Touch show "Unknown"
AND message reads "No known marketing interaction was identified before conversion."
AND the AttributionStatusBadge shows "Attribution incomplete"
```

**Status:** PASSED — AttributionSummary handles unknown/missing touchpoints with correct messaging

---

### AC-004: Customer journey timeline renders

```gherkin
GIVEN a lead with journey events
WHEN the Journey section renders
THEN it shows "Customer journey" heading
AND "Journey assembled from N systems" with SourceSystemChip badges
AND events grouped by date, collapsed page views, category-colored dots
```

**Status:** PASSED — JourneyTimeline component groups events by date, collapses page views, shows source system chips

---

### AC-005: Engagement summary shows correct metrics

```gherkin
GIVEN John Smith's events
WHEN the Engagement Summary renders
THEN it shows a compact stat line: Sessions · Page Views · Content · Meetings · Emails · Days to Lead · First Response
AND values are derived from the person's events (not hardcoded)
```

**Status:** PASSED — `getPersonEngagement()` counts event types; EngagementSummary renders 7 stat items

---

### AC-006: Opportunity details appear in context rail

```gherkin
GIVEN a lead who is primary contact of an opportunity (John Smith → AI Transformation Platform)
WHEN the sidebar renders
THEN it shows: opportunity name, stage (Proposal), value (€120,000), expected close date
AND if no opportunity exists, the section is hidden
```

**Status:** PASSED — OpportunitySummary renders conditionally; hidden when `getOpportunityByPersonId()` returns undefined

---

### AC-007: Related contacts show in context rail

```gherkin
GIVEN Acme Inc has multiple contacts (John Smith, Sarah Johnson, Michael Brown)
WHEN the sidebar renders
THEN "Related Contacts" shows the OTHER people at the same company (not the current lead)
AND each is clickable → navigates to their /leads/<id> page
```

**Status:** PASSED — RelatedContacts filters out current person from `getPeopleByCompanyId()` results

---

### AC-008: Communication summary in context rail

```gherkin
GIVEN a lead with email and meeting events
WHEN the Communication section renders
THEN it shows: last inbound email, last outbound email, last meeting (descriptions + relative dates)
AND if no communication events exist, section is hidden
```

**Status:** PASSED — CommunicationSummary finds last `email_received`, `email_sent`, `meeting_completed`; returns null when no items

---

### AC-009: RecordDetailLayout used correctly

```gherkin
GIVEN the Lead Detail page
WHEN it renders
THEN it uses RecordDetailLayout with breadcrumb, header, sidebar, and children
AND the sidebar is hidden on small screens (< lg)
```

**Status:** PASSED — RecordDetailLayout applies `hidden lg:block` to sidebar, 320px fixed width

---

### AC-010: Row click from Leads list navigates correctly

```gherkin
GIVEN the Leads list page
WHEN the user clicks a row
THEN they navigate to /leads/<personId>
AND the Lead Detail page loads with the correct data
AND the back button returns to /leads with filter state preserved
```

**Status:** PASSED — LeadTable `onRowClick` calls `router.push(/leads/${row.id})`, URL-param filter state preserved on back navigation

---

### AC-011: No raw hex colors

```gherkin
GIVEN all new files in Phase 6
WHEN scanned for hex color patterns
THEN zero matches found
```

**Status:** PASSED — grep confirms 0 hex color matches in all 8 new/modified files

---

### AC-012: Existing tests still pass

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
| AC-001 | Code review: `page.tsx` — breadcrumb with Link to /leads, `LeadIdentityHeader` with person/company/lastActivity, `notFound()` for invalid IDs | PASSED |
| AC-002 | Code review: `AttributionSummary` — three-column grid, "Why?" Dialog, self-reported/relationship sections | PASSED |
| AC-003 | Code review: `AttributionSummary` — TouchpointSection renders "Unknown" with message when no touchpoint | PASSED |
| AC-004 | Code review: `JourneyTimeline` — `groupByDate`, `collapsePageViews`, `SourceSystemChip`, category accent dots | PASSED |
| AC-005 | Code review: `engagement.ts` — counts by event type; `engagement-summary.tsx` — 7 StatItems with icons | PASSED |
| AC-006 | Code review: `opportunity-summary.tsx` — renders name, StageBadge, MoneyValue, DateTime; conditional in `lead-context-rail.tsx` | PASSED |
| AC-007 | Code review: `related-contacts.tsx` — filters `getPeopleByCompanyId()` excluding current; Link to `/leads/<id>` | PASSED |
| AC-008 | Code review: `communication-summary.tsx` — `findLastByType` for email_received/email_sent/meeting_completed; returns null when empty | PASSED |
| AC-009 | Code review: `page.tsx` — uses `RecordDetailLayout` with breadcrumb, header, sidebar slots | PASSED |
| AC-010 | Code review: `lead-table.tsx` — `onRowClick` → `router.push(/leads/${row.id})`; URL params preserved | PASSED |
| AC-011 | `grep '#[0-9a-fA-F]'` on new files — 0 matches | PASSED |
| AC-012 | `npm run test` — 101/101 pass, `tsc --noEmit` clean | PASSED |

---

## 4. Technical Design

### 4.1 Engagement Metrics Utility

**`src/lib/metrics/engagement.ts`**

```typescript
interface PersonEngagement {
  sessions: number;        // count of session_started events
  pageViews: number;       // count of page_viewed events
  contentViewed: number;   // count of case_study_viewed + blog_post_viewed
  meetings: number;        // count of meeting_booked + meeting_completed
  emails: number;          // count of email_sent + email_received
  daysToLead: number;      // days from first event to lead_created event
  firstResponseMinutes: number | null; // from first email_sent with responseTimeMinutes metadata
}

export function getPersonEngagement(personId: string): PersonEngagement;
```

Pure function that iterates a person's events once, counts by type, and computes derived timing metrics. No external state; fully testable.

### 4.2 Component Architecture

```
src/components/features/leads/
  lead-identity-header.tsx    ← Server component: avatar, name, title, email, company Link, StageBadge, OwnerChip
  engagement-summary.tsx      ← Client component: 7-metric stat line from getPersonEngagement()
  opportunity-summary.tsx     ← Server component: opportunity card with name, stage, value, dates
  communication-summary.tsx   ← Client component: last inbound/outbound/meeting from events
  related-contacts.tsx        ← Server component: filtered list of other people at same company
  lead-context-rail.tsx       ← Client component: composes OpportunitySummary + CommunicationSummary + RelatedContacts
```

### 4.3 Page Composition

```
LeadDetailPage (server component, async)
  └── RecordDetailLayout
        ├── breadcrumb: Leads → {person.name}
        ├── header: LeadIdentityHeader
        ├── sidebar: LeadContextRail
        │     ├── OpportunitySummary (if opportunity exists)
        │     ├── CommunicationSummary (if comm events exist)
        │     └── RelatedContacts (if other contacts exist)
        └── children:
              ├── EngagementSummary
              ├── Attribution section
              │     └── AttributionSummary (client, "Why?" dialogs)
              └── Customer journey section
                    └── JourneyTimeline (client, event grouping)
```

The page is a server component. It fetches person/company/events data synchronously from the in-memory seed data and passes IDs to client components that use `useMemo` for their own data derivation.

### 4.4 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Page component type | Server component (async) | Only needs to read params and pass data; client interactivity delegated to children |
| Engagement metrics | New pure function in `lib/metrics/engagement.ts` | Keeps business logic out of components; single-pass over events; testable |
| Context rail composition | 3 independent sub-components | Each section can be hidden when no data (e.g., no opportunity, no communication events) |
| Company link | Next.js `<Link>` to `/accounts/{companyId}` | Required by P0 demo path (Lead → Account) |
| Related contacts filter | `getPeopleByCompanyId()` excluding current person | Simple client-side filter; 80 total records |
| Communication summary | Derived from person's events by type | `email_sent`, `email_received`, `meeting_completed` — most recent of each |
| 404 handling | `notFound()` from `next/navigation` | Standard Next.js App Router pattern for invalid IDs |
| Last activity date | Last event timestamp from sorted events array | Events are pre-sorted in repository; take last element |

### 4.5 Reused Modules

| Module | Usage |
|--------|-------|
| `lib/data/repositories` | `getPersonById()`, `getCompanyById()`, `getEventsByPersonId()`, `getOpportunityByPersonId()`, `getPeopleByCompanyId()` |
| `lib/attribution/touchpoints` | Via `AttributionSummary` — `getFirstTouch()`, `getLastMarketingTouch()`, `getConversionTouch()` |
| `lib/attribution/status` | Via `AttributionSummary` — `getAttributionStatus()` |
| `lib/journeys` | Via `JourneyTimeline` — `getPersonJourney()` |
| `lib/formatting/dates` | Via `DateTime` — `formatRelativeDate()` |
| `lib/formatting/duration` | In `EngagementSummary` — `formatDuration()` for first response time |
| `lib/formatting/money` | Via `MoneyValue` — `formatMoneyFull()` for opportunity value |
| `lib/config/owners` | Via `OwnerChip` — `getOwnerName()` |
| `lib/config/stages` | Via `StageBadge` — `displayStageConfig`, `opportunityStageConfig` |
| `components/domain/*` | PersonIdentity, StageBadge, OwnerChip, MoneyValue, DateTime, SourceSystemChip, AttributionStatusBadge |
| `components/features/attribution` | `AttributionSummary` with "Why?" evidence dialogs |
| `components/features/journey` | `JourneyTimeline` with date grouping, page view collapsing |
| `components/layout` | `RecordDetailLayout` with breadcrumb, header, sidebar, children slots |

---

## 5. Files

### Files Created

| File | Purpose |
|------|---------|
| `src/lib/metrics/engagement.ts` | Pure function `getPersonEngagement()` — computes 7 engagement metrics from events |
| `src/components/features/leads/lead-identity-header.tsx` | Header: avatar, name, title, email, company link, StageBadge, OwnerChip, last activity |
| `src/components/features/leads/engagement-summary.tsx` | Compact horizontal stat line with 7 metrics and icons |
| `src/components/features/leads/opportunity-summary.tsx` | Sidebar card: opportunity name, stage badge, value, expected close |
| `src/components/features/leads/communication-summary.tsx` | Last inbound email, outbound email, meeting with relative dates |
| `src/components/features/leads/related-contacts.tsx` | Other people at same company, clickable → their lead detail |
| `src/components/features/leads/lead-context-rail.tsx` | Sidebar composition: OpportunitySummary + CommunicationSummary + RelatedContacts |

### Files Modified

| File | Change |
|------|--------|
| `src/app/(app)/leads/[id]/page.tsx` | Replaced placeholder with full composition: RecordDetailLayout with breadcrumb, LeadIdentityHeader, LeadContextRail sidebar, EngagementSummary + AttributionSummary + JourneyTimeline in main content; `notFound()` for invalid IDs |

---

## 6. Quality Gates

| Gate | Result |
|------|--------|
| TypeScript clean (`npx tsc --noEmit`) | PASSED — 0 errors |
| Lint clean (new/modified files) | PASSED — 0 errors, 0 warnings |
| Tests pass (`npm run test`) | PASSED — 101/101 (all existing tests preserved) |
| No raw hex colors | PASSED — grep confirms 0 matches in new files |
| Existing tests preserved | PASSED — all 101 prior tests still pass |
| Code review | PASSED — no dead code, no hardcoded values, no boundary errors |

---

## 7. P0 Demo Path Coverage

This phase enables the following segment of the P0 demo path:

```
Overview → John Smith / Acme → Attribution Summary → Why? → Customer Journey → Acme Account
```

Specifically:
- `/leads/person_john_smith` — full identity, attribution chain with evidence, engagement metrics, journey timeline
- Attribution "Why?" buttons → evidence dialogs with source, timestamp, landing page, campaign
- Company name link → `/accounts/company_acme` (Account Detail, Phase 9)
- Related contacts → click Sarah Johnson → `/leads/person_sarah_johnson`
- Sidebar shows AI Transformation Platform opportunity: Proposal stage, €120,000, expected close
- Breadcrumb "Leads" → back to `/leads` list with filter state preserved

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-28 | [x] |
