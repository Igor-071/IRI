# Specification: Phase 5 — Inbound Leads List

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-28
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 7, `08_BUILD_INSTRUCTIONS` Phase 7

---

## 1. Overview

### 1.1 Summary

Build the Inbound Leads list — a filterable, searchable, sortable table of all 80 leads. This is the primary drill-down target from the Overview screen and a key stop on the P0 demo path (Overview → lead row → Lead Detail). The page supports URL query-parameter filters (`?attribution=unknown`, `?source=linkedin_organic`, etc.) to enable deep-linking from Overview CTAs and the Attribution page.

### 1.2 Goals

- Add `getConversionLabel()` utility for conversion mechanism display names
- Extend `getLeads()` with `owner` filter support
- Build LeadFilters component with search + 4 filter dropdowns synced to URL params
- Build LeadTable component with 9 columns using domain primitives, sortable on Value and Created
- Compose the Leads page replacing the placeholder with ListLayout, filters, and table
- Ensure all 80 leads display correctly with proper attribution rendering
- Enable deep-linking from Overview CTAs via URL search params

### 1.3 Non-Goals

- Lead Detail page (Phase 8)
- Server-side filtering or pagination (80 records, client-side sufficient)
- Export / CSV download (V2)
- Bulk actions / multi-select (V2)
- Advanced search with field-specific operators (V2)

### 1.4 User Story

As a revenue leader viewing the Inbound Leads list,
I want to search, filter, and sort all leads by source, stage, attribution status, and owner,
so that I can find specific leads, identify attribution gaps, and drill into individual lead journeys.

---

## 2. Acceptance Criteria

### AC-001: Lead table displays all 80 leads with correct columns

```gherkin
GIVEN the Leads page is loaded at /leads
WHEN the table renders
THEN it shows all 80 leads
AND columns are: Contact (PersonIdentity), Company, First Touch (SourceBadge), Last Marketing Touch (SourceBadge), Conversion, Stage (StageBadge), Owner (OwnerChip), Value, Created (relative DateTime)
AND default sort is by most recent createdAt
AND clicking a row navigates to /leads/<personId>
```

**Status:** PASSED

---

### AC-002: Page header and layout match spec

```gherkin
GIVEN the Leads page is loaded
WHEN the page renders
THEN the title is "Inbound Leads"
AND the subtitle is "All inbound contacts and their acquisition context."
AND the page uses ListLayout
AND the right side of the header shows the result count (e.g. "80 leads")
```

**Status:** PASSED

---

### AC-003: Search filters leads by name, company, or email

```gherkin
GIVEN the Leads page is loaded
WHEN the user types "john" in the search field
THEN the table filters to show only leads matching "john" in name, email, or company name
AND the result count updates accordingly
AND clearing the search restores the full list
```

**Status:** PASSED

---

### AC-004: Source filter works via dropdown and URL param

```gherkin
GIVEN the Leads page is loaded
WHEN the user selects "Google Organic" from the First Touch Source filter
THEN only leads with firstTouchSource === "google_organic" are shown
AND the URL updates to /leads?source=google_organic
WHEN navigating directly to /leads?source=linkedin_organic
THEN the filter is pre-selected and only matching leads are shown
```

**Status:** PASSED

---

### AC-005: Stage filter works via dropdown and URL param

```gherkin
GIVEN the Leads page is loaded
WHEN the user selects "Proposal" from the Stage filter
THEN only leads with displayStage === "proposal" are shown
AND the URL updates to /leads?stage=proposal
```

**Status:** PASSED

---

### AC-006: Attribution filter works via dropdown and URL param

```gherkin
GIVEN the user navigates to /leads?attribution=unknown
WHEN the page renders
THEN the Attribution filter is pre-selected to "Unknown"
AND only leads with attribution status "unknown" are shown (7 leads)
```

**Status:** PASSED

---

### AC-007: Owner filter works via dropdown

```gherkin
GIVEN the Leads page is loaded
WHEN the user selects "Igor Kraisnik" from the Owner filter
THEN only leads with ownerId === "usr_igor" are shown
```

**Status:** PASSED

---

### AC-008: Multiple filters combine with AND logic

```gherkin
GIVEN the Leads page
WHEN the user selects source=google_organic AND stage=proposal
THEN only leads matching BOTH filters are shown
AND the URL reflects both params: /leads?source=google_organic&stage=proposal
AND a "Clear filters" action resets all filters
```

**Status:** PASSED

---

### AC-009: Unknown attribution rows display correctly

```gherkin
GIVEN leads with unknown attribution (e.g., Vector Group contacts)
WHEN they appear in the table
THEN First Touch shows "Unknown" badge with warning styling
AND Last Marketing Touch shows "Unknown" (not invented)
AND the row does not look broken
```

**Status:** PASSED

---

### AC-010: Last Marketing Touch column derives from touchpoints

```gherkin
GIVEN a lead with session-derived touchpoints
WHEN the Last Marketing Touch column renders
THEN it shows the source from getLastMarketingTouch(personId)
AND if no marketing touch exists, it shows "Unknown"
```

**Status:** PASSED

---

### AC-011: Conversion column shows mechanism label

```gherkin
GIVEN a lead with conversionMechanism "contact_form"
WHEN the Conversion column renders
THEN it shows "Contact Form"
AND leads with "book_a_call" show "Book a Call"
AND leads with "email_inquiry" show "Email Inquiry"
AND leads with "newsletter_signup" show "Newsletter Signup"
```

**Status:** PASSED

---

### AC-012: Empty state when filters return no results

```gherkin
GIVEN the Leads page with active filters that match zero leads
WHEN the table renders
THEN it shows "No leads match these filters."
AND a "Clear filters" button is available
```

**Status:** PASSED

---

### AC-013: Table supports column sorting

```gherkin
GIVEN the Leads page
WHEN the user clicks the "Created" column header
THEN the table sorts by createdAt ascending
WHEN clicking again
THEN it sorts descending
AND Value column sorts numerically
```

**Status:** PASSED

---

### AC-014: No raw hex colors and semantic tokens only

```gherkin
GIVEN all new files created in Phase 5
WHEN scanned for hex color patterns
THEN zero matches found
```

**Status:** PASSED — grep confirms 0 hex color matches

---

### AC-015: Existing tests still pass

```gherkin
GIVEN the 101 existing tests
WHEN npm run test executes
THEN all 101 tests still pass
AND TypeScript compilation succeeds with zero errors
```

**Status:** PASSED — 101/101 tests, `tsc --noEmit` clean

---

## 3. Traceability Matrix

| Criterion | Test / Verification | Status |
|-----------|---------------------|--------|
| AC-001 | Code review: `lead-table.tsx` — 9 columns, `onRowClick` → `/leads/<id>` | PASSED |
| AC-002 | Code review: `page.tsx` — ListLayout with title/subtitle, result count in LeadFilters | PASSED |
| AC-003 | Code review: `page.tsx` — client-side filter on name/email/company | PASSED |
| AC-004 | Code review: `lead-filters.tsx` — Source Select + `updateParam("source", ...)` | PASSED |
| AC-005 | Code review: `lead-filters.tsx` — Stage Select + `updateParam("stage", ...)` | PASSED |
| AC-006 | Code review: `page.tsx` — `searchParams.get("attribution")` → `getLeads({ attribution })` | PASSED |
| AC-007 | Code review: `lead-filters.tsx` — Owner Select + `updateParam("owner", ...)` | PASSED |
| AC-008 | Code review: `page.tsx` — all filters pass to `getLeads()` as AND; `clearAll()` resets URL | PASSED |
| AC-009 | Code review: `lead-table.tsx` — SourceBadge renders "unknown" with `text-warning` class | PASSED |
| AC-010 | Code review: `lead-table.tsx` — calls `getLastMarketingTouch(personId)`, falls back to `SourceBadge source="unknown"` | PASSED |
| AC-011 | Code review: `lead-table.tsx` — calls `getConversionLabel(person.conversionMechanism)` | PASSED |
| AC-012 | Code review: `data-table.tsx` — empty state renders `emptyMessage`; LeadFilters has Clear button | PASSED |
| AC-013 | Code review: `lead-table.tsx` — Value and Created columns have `enableSorting: true` | PASSED |
| AC-014 | `grep '#[0-9a-fA-F]'` on new files — 0 matches | PASSED |
| AC-015 | `npm run test` — 101/101 pass, `tsc --noEmit` clean | PASSED |

---

## 4. Technical Design

### 4.1 New Library Utility

**`src/lib/config/conversions.ts`**

```typescript
const conversionLabels: Record<ConversionMechanism, string> = {
  contact_form: "Contact Form",
  book_a_call: "Book a Call",
  email_inquiry: "Email Inquiry",
  newsletter_signup: "Newsletter Signup",
};

export function getConversionLabel(mechanism: ConversionMechanism): string;
```

### 4.2 Repository Extension

**`getLeads()` filter interface** extended with `owner?: string`:

```typescript
export function getLeads(
  filters?: {
    attribution?: AttributionStatus;
    source?: AcquisitionSource;
    stage?: DisplayStage;
    owner?: string;     // NEW
  }
): Person[]
```

Filters combine with AND logic — person must match all provided filter values.

### 4.3 Component Architecture

```
src/components/features/leads/
  lead-filters.tsx    ← Search input + 4 Select dropdowns + result count + clear button
  lead-table.tsx      ← DataTable with 9 columns, sortable Value/Created, row click nav
```

### 4.4 Page Composition

```
Suspense
  └── LeadsContent (client component, useSearchParams)
        └── ListLayout
              ├── title: "Inbound Leads"
              ├── subtitle: "All inbound contacts and their acquisition context."
              ├── filters: LeadFilters
              └── children: LeadTable
```

The `Suspense` boundary wraps the client component that uses `useSearchParams()`, which is required by Next.js App Router.

### 4.5 Filter State Architecture

| Filter | URL Param | Component | Data Source |
|--------|-----------|-----------|-------------|
| Search | (client state only) | Input with Search icon | name/email/company matching |
| Source | `?source=google_organic` | Select dropdown | `sourceConfig` keys |
| Stage | `?stage=proposal` | Select dropdown | `displayStageConfig` keys |
| Attribution | `?attribution=unknown` | Select dropdown | `"full" \| "partial" \| "unknown"` |
| Owner | `?owner=usr_igor` | Select dropdown | `ownerOptions` from config |

URL params are read via `useSearchParams()` and written via `router.replace()` with `{ scroll: false }`. Search is client-only state (not persisted to URL) for instant feedback.

### 4.6 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Filter state management | URL search params via `useSearchParams` | Enables deep-linking from Overview CTAs, back-nav preserves state |
| Search implementation | Client-side filter on name/email/company | 80 records, no server needed; instant feedback |
| Search not in URL | Local `useState` only | Avoids excessive URL changes while typing; other filters are more valuable for deep-links |
| Last Marketing Touch | Call `getLastMarketingTouch(personId)` per row | Derives from session data, matches attribution spec |
| Conversion column | Map `person.conversionMechanism` to label | Person model already has this field; label map in `lib/config/conversions.ts` |
| Value column | `getOpportunityByPersonId()` → `opp.value` | Same pattern as RecentInbound on Overview |
| Default sort | `createdAt` descending (newest first) | Applied in page component before passing to DataTable |
| Sortable columns | Value and Created only | Other columns are badges/chips that don't benefit from sorting |
| Select "All" option | `__all__` sentinel value mapped to empty string | Radix Select requires non-empty values; mapped back to empty on change |

### 4.7 Reused Modules

| Module | Usage |
|--------|-------|
| `lib/data/repositories` | `getLeads()`, `getCompanyById()`, `getOpportunityByPersonId()` |
| `lib/attribution/touchpoints` | `getLastMarketingTouch()` for Last Marketing Touch column |
| `lib/config/sources` | `sourceConfig` for filter options |
| `lib/config/stages` | `displayStageConfig` for filter options |
| `lib/config/owners` | `ownerOptions` for filter dropdown |
| `lib/config/conversions` | `getConversionLabel()` for Conversion column |
| `components/domain/*` | PersonIdentity, SourceBadge, StageBadge, OwnerChip, MoneyValue, DateTime |
| `components/ui/data-table` | DataTable with sorting and row click |
| `components/ui/input` | Search input field |
| `components/ui/atoms/select` | Filter dropdowns |
| `components/ui/button` | Clear filters button |
| `components/layout` | ListLayout for page structure |

---

## 5. Files

### Files Created

| File | Purpose |
|------|---------|
| `src/lib/config/conversions.ts` | Conversion mechanism label map and `getConversionLabel()` |
| `src/components/features/leads/lead-filters.tsx` | Search input + 4 Select dropdowns + result count + clear button, URL param sync |
| `src/components/features/leads/lead-table.tsx` | 9-column DataTable with domain primitives, sortable Value/Created, row click navigation |

### Files Modified

| File | Change |
|------|--------|
| `src/lib/data/repositories.ts` | Added `owner?: string` to `getLeads()` filter interface with `person.ownerId` matching |
| `src/app/(app)/leads/page.tsx` | Replaced placeholder with full composition: client component with `useSearchParams`, `ListLayout`, `LeadFilters`, `LeadTable`, wrapped in `Suspense` |

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
Overview → [click lead row] → /leads → [click John Smith row] → /leads/per_john_smith
```

Deep-link from Overview:
- "View unknown-attribution leads" → `/leads?attribution=unknown` — 7 leads shown
- "View all leads →" → `/leads` — 80 leads shown
- Attribution coverage breakdown clicks → `/leads?attribution=full|partial|unknown`

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-28 | [x] |
