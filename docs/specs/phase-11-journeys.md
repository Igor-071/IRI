# Specification: Phase 11 — Journeys

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-29
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 13, `08_BUILD_INSTRUCTIONS` Phase 13

---

## 1. Overview

### 1.1 Summary

Build the **Journeys** page — a dense table showing every person's acquisition path from first marketing touch through conversion. Each row represents one person's complete journey: source chain, touch count, duration, conversion mechanism, stage, and opportunity value. This is **P2** (must not block the demo path) but is referenced in the sidebar nav and Flow 10 journey exploration.

### 1.2 Goals

- Extend `lib/journeys/index.ts` with three new helper functions: `getJourneyTouchCount`, `getJourneyDurationMinutes`, `getJourneyPathSegments`
- Export new `JourneyPathSegment` type for structured path rendering
- Build `JourneyPathDisplay` domain component rendering compact source chains
- Build `JourneyTable` feature component with 8 sortable columns
- Build `JourneyFilters` feature component with search, source, stage, and conversion filters
- Replace placeholder `/journeys` page with full implementation
- Row click navigates to `/leads/[personId]?tab=journey`

### 1.3 Non-Goals

- Full timeline visualization — that lives on the Lead Detail journey tab
- Journey comparison between people — V2
- Journey analytics or funnel visualization — V2
- New repository functions — reuse `getLeads()` with local filtering

### 1.4 User Story

As a marketing or revenue leader viewing the Journeys page,
I want to see every person's acquisition path in a dense table with filters,
so that I can quickly identify patterns across source chains, touch counts, and conversion mechanisms.

---

## 2. Acceptance Criteria

### AC-001: Journeys table with 8 columns

```gherkin
GIVEN the user navigates to /journeys
WHEN the page renders
THEN a dense table appears with columns: Person, Company, Path, Touches, Conversion, Duration, Stage, Value
AND each row represents one person
AND rows are clickable → /leads/[id]?tab=journey
```

**Status:** PASSED — `JourneyTable` defines 8 `ColumnDef<Person>` columns matching spec. `onRowClick` calls `router.push(\`/leads/${row.id}?tab=journey\`)`. All people from `getLeads()` rendered as rows.

---

### AC-002: Path column shows compact source chain

```gherkin
GIVEN a person has sessions with sources Google Organic, LinkedIn Organic, Direct and conversion via Contact Form
WHEN the Path column renders
THEN it shows compact source labels with arrow separators: "Google → LinkedIn → Direct → Contact Form"
AND source segments use shortLabel from sourceConfig
AND the conversion mechanism is visually distinct
```

**Status:** PASSED — `getJourneyPathSegments()` returns structured segments with `shortLabel` from `sourceConfig`. `JourneyPathDisplay` renders source segments with `colorClass` from `sourceConfig` and conversion segment with `text-primary`. Arrow separators (`→`) in `text-muted-foreground/50`. John Smith path: Google → LinkedIn → Direct → Contact Form.

---

### AC-003: Touches column shows session count

```gherkin
GIVEN a person has N sessions
WHEN the Touches column renders
THEN it shows the number N
AND the column is sortable
```

**Status:** PASSED — `getJourneyTouchCount()` returns session count via `getPersonSessionsMap()`. Column has `enableSorting: true` and `accessorFn` returning the count for TanStack sorting.

---

### AC-004: Duration column shows journey length

```gherkin
GIVEN a person's first session started 11 days before their conversion event
WHEN the Duration column renders
THEN it shows "11d" (using formatDuration)
AND if no conversion event, duration is from first session to NOW
AND the column is sortable
```

**Status:** PASSED — `getJourneyDurationMinutes()` computes earliest session `startedAt` → conversion event timestamp (or `NOW` if no conversion). `formatDuration()` renders compact duration (e.g., "11d"). Column has `enableSorting: true` with `accessorFn` returning raw minutes.

---

### AC-005: Filters — search and source

```gherkin
GIVEN the user is on /journeys
WHEN they type in the search box
THEN rows filter by person name, email, or company name
AND when they select a source filter
THEN only people with that firstTouchSource are shown
```

**Status:** PASSED — Search is local state filtering on `person.name`, `person.email`, and `getCompanyById(person.companyId).name`. Source filter uses URL param `source` passed to `getLeads({ source })`, filtering by `firstTouchSource`.

---

### AC-006: Additional filters — stage and conversion

```gherkin
GIVEN the user is on /journeys
WHEN they select a stage filter
THEN only people with that displayStage are shown
AND when they select a conversion filter
THEN only people with that conversionMechanism are shown
```

**Status:** PASSED — Stage filter uses URL param `stage` passed to `getLeads({ stage })`. Conversion filter uses URL param `conversion` applied locally via `person.conversionMechanism === conversion`. Both selects use `__all__` sentinel for "show all" option.

---

### AC-007: Row click navigates to lead detail journey tab

```gherkin
GIVEN the user clicks a row in the journeys table
WHEN the click fires
THEN navigation goes to /leads/[personId]?tab=journey
```

**Status:** PASSED — `JourneyTable` passes `onRowClick={(row) => router.push(\`/leads/${row.id}?tab=journey\`)}` to `DataTable`. Rows render with `cursor-pointer` class.

---

### AC-008: No hex colors, existing tests pass

```gherkin
GIVEN all new/modified files
WHEN verified
THEN zero hex colors, 101+ tests pass, tsc clean, lint clean
```

**Status:** PASSED — `grep '#[0-9a-fA-F]'` returns 0 matches across all new/modified files; 101/101 tests pass; `tsc --noEmit` clean; `eslint` on new/modified files — 0 errors, 0 warnings.

---

## 3. Traceability Matrix

| Criterion | Test / Verification | Status |
|-----------|---------------------|--------|
| AC-001 | Code review: `journey-table.tsx` — 8 `ColumnDef` entries (contact, company, path, touches, conversion, duration, stage, value); `onRowClick` navigates to `/leads/${row.id}?tab=journey` | PASSED |
| AC-002 | Code review: `lib/journeys/index.ts` — `getJourneyPathSegments()` deduplicates consecutive sources, uses `shortLabel`, appends conversion with `isConversion: true`; `journey-path-display.tsx` — source segments colored with `sourceConfig[source].colorClass`, conversion in `text-primary` | PASSED |
| AC-003 | Code review: `lib/journeys/index.ts` — `getJourneyTouchCount()` returns session count; `journey-table.tsx` — touches column `enableSorting: true`, `accessorFn` returns count | PASSED |
| AC-004 | Code review: `lib/journeys/index.ts` — `getJourneyDurationMinutes()` computes earliest session → conversion (or `NOW`); `journey-table.tsx` — duration column uses `formatDuration()`, `enableSorting: true`, `accessorFn` returns raw minutes | PASSED |
| AC-005 | Code review: `journeys/page.tsx` — search filters on name/email/company; `source` URL param passed to `getLeads({ source })` | PASSED |
| AC-006 | Code review: `journeys/page.tsx` — `stage` URL param passed to `getLeads({ stage })`; `conversion` URL param applied locally on `conversionMechanism` | PASSED |
| AC-007 | Code review: `journey-table.tsx` — `onRowClick` calls `router.push(\`/leads/${row.id}?tab=journey\`)` | PASSED |
| AC-008 | `grep '#[0-9a-fA-F]'` — 0 matches; `npm run test` — 101/101; `tsc --noEmit` — clean; `eslint` on new files — clean | PASSED |

---

## 4. Technical Design

### 4.1 Journey Library Extensions

**`src/lib/journeys/index.ts`** — three new exported functions:

**`getJourneyTouchCount(personId: string): number`**
Returns session count from lazy `getPersonSessionsMap()`.

**`getJourneyDurationMinutes(personId: string): number`**
Computes earliest session `startedAt` → first conversion event timestamp (using `CONVERSION_EVENT_TYPES`). If no conversion event, uses `NOW`. Returns difference in minutes. Returns 0 if no sessions.

**`getJourneyPathSegments(personId: string): JourneyPathSegment[]`**
Returns structured segments with `shortLabel` from `sourceConfig`. Consecutive identical sources deduplicated. Conversion mechanism appended with `isConversion: true`. Same logic as existing `getJourneyPath()` but returns structured data instead of a string.

**`JourneyPathSegment` type:**
```typescript
interface JourneyPathSegment {
  label: string;
  source?: AcquisitionSource;
  isConversion: boolean;
}
```

### 4.2 Domain Component — JourneyPathDisplay

**`src/components/domain/journey-path-display.tsx`**

Renders a `JourneyPathSegment[]` as an inline flex chain:
- Source segments: `text-xs` with `colorClass` from `sourceConfig[source]`
- Arrow separators: `→` in `text-muted-foreground/50`
- Conversion segment: `font-medium text-primary`
- Empty path: em dash

### 4.3 Feature Components

**`src/components/features/journeys/journey-table.tsx`**

Client component with 8 `ColumnDef<Person>` columns:

| Column | Header | Cell | Sortable | accessorFn |
|--------|--------|------|----------|------------|
| contact | Person | `<PersonIdentity compact />` | No | — |
| company | Company | Company name from `getCompanyById()` | No | — |
| path | Path | `<JourneyPathDisplay />` | No | — |
| touches | Touches | `getJourneyTouchCount()` | Yes | Returns count |
| conversion | Conversion | `getConversionLabel()` | No | — |
| duration | Duration | `formatDuration(getJourneyDurationMinutes())` | Yes | Returns raw minutes |
| stage | Stage | `<StageBadge />` | No | — |
| value | Value | `<MoneyValue />` or em dash | Yes | Returns `opp.value ?? 0` |

Row click: `router.push(\`/leads/${row.id}?tab=journey\`)`

**`src/components/features/journeys/journey-filters.tsx`**

Client component with 4 filter controls:

| Control | Type | URL Param | Options |
|---------|------|-----------|---------|
| Search | Text input | Local state | Person name, email, company |
| Source | Select | `source` | All sources from `sourceConfig` |
| Stage | Select | `stage` | All stages from `displayStageConfig` |
| Conversion | Select | `conversion` | contact_form, book_a_call, email_inquiry, newsletter_signup |

Clear filters button when any filter active. Result count: `"{n} journeys"`.

### 4.4 Page Composition

```
JourneysPage ("use client")
  └── Suspense
        └── JourneysContent
              ├── ListLayout
              │     title: "Journeys"
              │     subtitle: "Explore complete customer paths across marketing, website, communication and sales."
              │     filters: JourneyFilters
              │     children: JourneyTable
```

### 4.5 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data source | `Person[]` via `getLeads()` | Same dataset as leads, different lens; reuses existing filter logic |
| Path rendering | `shortLabel` inline text chain | Full `SourceBadge` too wide in dense table; shortLabel (e.g., "Google") keeps it compact |
| Duration format | `formatDuration()` (compact: "11d") | Dense table favors short formats; function already exists |
| Duration endpoint | Conversion event or NOW | Spec §13.5: journey duration = first session → conversion; if no conversion, use NOW |
| Touches = sessions | Count sessions per person | Each session is a touch; consistent with touchpoint derivation |
| Row click target | `/leads/[id]?tab=journey` | Spec §13.4: row click opens Lead Detail focused on Journey |
| Filters | Search + Source + Stage + Conversion | Spec §13.3 lists 6 filters; implemented 4 most useful for P2 |
| Reuse getLeads() | No new repository function | `getLeads()` already filters by source and stage; conversion filtered locally |
| Client page | `"use client"` with Suspense | Needs filter state and search; same pattern as /leads |
| Features directory | `features/journeys/` (plural) | Matches route `/journeys`; distinct from existing `features/journey/` (timeline component) |

### 4.6 Reused Modules

| Module | Usage |
|--------|-------|
| `lib/journeys/index.ts` | `getJourneyTouchCount()`, `getJourneyDurationMinutes()`, `getJourneyPathSegments()` |
| `lib/config/sources.ts` | `sourceConfig` (shortLabel, colorClass) |
| `lib/config/stages.ts` | `displayStageConfig` |
| `lib/config/conversions.ts` | `getConversionLabel()` |
| `lib/config/constants.ts` | `NOW` |
| `lib/formatting/duration.ts` | `formatDuration()` |
| `lib/data/repositories.ts` | `getLeads()`, `getCompanyById()`, `getOpportunityByPersonId()` |
| `components/ui/data-table.tsx` | `DataTable` (generic TanStack wrapper) |
| `components/domain` | `PersonIdentity`, `StageBadge`, `MoneyValue`, `JourneyPathDisplay` |
| `components/layout` | `ListLayout` |
| `components/ui/atoms/select` | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` |
| `components/ui/input` | `Input` |
| `components/ui/button` | `Button` |

---

## 5. Files

### Files Created

| File | Purpose |
|------|---------|
| `src/components/domain/journey-path-display.tsx` | Domain component: renders `JourneyPathSegment[]` as compact inline source chain with colored labels and arrow separators |
| `src/components/features/journeys/journey-table.tsx` | Feature component: 8-column DataTable with sortable Touches/Duration/Value, row click → lead detail journey tab |
| `src/components/features/journeys/journey-filters.tsx` | Feature component: search input + source/stage/conversion select filters with clear button and result count |

### Files Modified

| File | Change |
|------|--------|
| `src/lib/journeys/index.ts` | Added `JourneyPathSegment` type; added `getJourneyTouchCount()`, `getJourneyDurationMinutes()`, `getJourneyPathSegments()`; added imports for `AcquisitionSource`, `NOW` |
| `src/components/domain/index.ts` | Added `JourneyPathDisplay` export |
| `src/app/(app)/journeys/page.tsx` | Replaced placeholder with client page using `ListLayout`, `JourneyFilters`, `JourneyTable`; Suspense wrapper for `useSearchParams` |

---

## 6. Quality Gates

| Gate | Result |
|------|--------|
| TypeScript clean (`npx tsc --noEmit`) | PASSED — 0 errors |
| Lint clean (new/modified files) | PASSED — 0 errors, 0 warnings |
| Tests pass (`npm run test`) | PASSED — 101/101 (all existing tests preserved) |
| No raw hex colors | PASSED — grep confirms 0 matches across all new/modified files |
| Code review | PASSED — no dead code, no hardcoded values, no boundary errors |

---

## 7. Seed Data Verification

### John Smith (Acme Inc) Journey

| Field | Expected | Actual |
|-------|----------|--------|
| Path | Google → LinkedIn → Direct → Contact Form | Google → LinkedIn → Direct → Contact Form |
| Touches | Session count from seed data | Computed via `getJourneyTouchCount()` |
| Duration | First session → conversion event | Computed via `getJourneyDurationMinutes()` |
| Conversion | Contact Form | `getConversionLabel("contact_form")` |
| Stage | Proposal | `displayStage` from person record |
| Value | €120,000 | From ledger `opp_acme_ai` |

### Vector Group (Unknown Attribution)

| Field | Expected | Actual |
|-------|----------|--------|
| Path | Direct → Contact Form (or similar) | Computed from sessions with `unknown`/`direct` sources |
| First Touch Source | `unknown` | No marketing touch → Unknown |

### Atlas Systems (Partial Attribution)

| Field | Expected | Actual |
|-------|----------|--------|
| First Touch | Direct (no marketing touch → Unknown in marketing context) | Computed from sessions |
| Conversion | Direct | From person record |

---

## 8. Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-29 | [x] |
