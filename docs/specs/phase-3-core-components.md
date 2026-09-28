# Specification: Phase 3 — Core Components

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-28
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 5, `08_BUILD_INSTRUCTIONS` Phase 5

---

## 1. Overview

### 1.1 Summary

Build the shared component library that all screens consume — domain primitives, layout templates, DataTable, JourneyTimeline, and AttributionSummary. Phases 1–2 established the project foundation, seed data (45 companies, 80 people, 26 opportunities), and all business logic modules. Phase 3 ensures every screen built in Phases 4–12 composes from a consistent, reusable component set rather than reinventing entity display per page.

### 1.2 Goals

- Install missing shadcn atoms required by domain components (badge, tooltip, separator, table, skeleton, dropdown-menu, dialog, scroll-area, avatar, select)
- Install @tanstack/react-table for DataTable
- Build UI atoms: StatusDot, MetricValue, DataTable
- Build 12 domain primitives: PersonIdentity, CompanyIdentity, OpportunityValue, SourceBadge, CampaignBadge, StageBadge, OwnerChip, AttributionStatusBadge, EventTypeBadge, MoneyValue, DateTime, SourceSystemChip
- Build 3 layout templates: ListLayout, RecordDetailLayout, AnalyticsLayout
- Build JourneyTimeline feature component (date-grouped, category-colored, importance-aware, page-view collapsing)
- Build AttributionSummary feature component (three-column, "Why?" evidence, self-reported, relationship, Unknown handling)
- Enforce dependency direction: `app → features → domain → ui`
- Enforce zero raw hex colors — all semantic tokens

### 1.3 Non-Goals

- Screen implementations (Phases 6–12)
- Playwright E2E tests (Phase 14)
- New business logic or data changes

### 1.4 User Story

As a developer building screen pages in Phases 4–12,
I want a validated, consistent component library with domain primitives and layout templates,
so that every screen composes from reusable pieces backed by the data layer.

---

## 2. Acceptance Criteria

### AC-001: Domain primitives render entity data consistently

```gherkin
GIVEN a Person record with name "John Smith", title "VP Product", email "john.smith@acme.com"
WHEN PersonIdentity is rendered with that person
THEN it displays the person's initials in an avatar, full name, and title
AND when showEmail is true, the email is also displayed
AND when compact is true, only the name is shown (no title)
```

**Status:** PASSED

---

### AC-002: SourceBadge maps source to correct label and color

```gherkin
GIVEN an AcquisitionSource value (e.g., "google_organic")
WHEN SourceBadge is rendered with that source
THEN it displays the label from sourceConfig ("Google Organic")
AND uses the colorClass from sourceConfig for styling
AND never uses raw hex values
```

**Status:** PASSED

---

### AC-003: StageBadge supports both display and opportunity stages

```gherkin
GIVEN a DisplayStage "proposal" or OpportunityStage "won"
WHEN StageBadge is rendered with the stage and appropriate variant
THEN it displays the label from the matching config (displayStageConfig or opportunityStageConfig)
AND applies the correct semantic color class
```

**Status:** PASSED

---

### AC-004: AttributionStatusBadge renders three states with correct semantics

```gherkin
GIVEN an AttributionStatus of "full", "partial", or "unknown"
WHEN AttributionStatusBadge is rendered
THEN "full" displays "Fully attributed" with success styling
AND "partial" displays "Partial attribution" with highlight styling
AND "unknown" displays "Attribution incomplete" with muted styling
```

**Status:** PASSED

---

### AC-005: MoneyValue formats currency with tabular numerals

```gherkin
GIVEN a numeric value (e.g., 120000)
WHEN MoneyValue is rendered with that value
THEN it displays "€120K" (compact format by default)
AND when full is true, it displays "€120,000"
AND the rendered text uses the tabular-nums CSS class
```

**Status:** PASSED

---

### AC-006: DateTime formats dates using fixed timezone

```gherkin
GIVEN a date string "2026-09-15T10:00:00+02:00"
WHEN DateTime is rendered with format "date"
THEN it displays the date formatted via formatDate (e.g., "15 Sept 2026")
AND when format is "relative", it uses formatRelativeDate
AND when format is "short", it uses formatShortDate
AND all formatting uses TIMEZONE "Europe/Sarajevo" and LOCALE "en-GB"
```

**Status:** PASSED

---

### AC-007: SourceSystemChip shows data provenance

```gherkin
GIVEN a sourceSystem string (e.g., "website_tracker", "hubspot", "cal_com")
WHEN SourceSystemChip is rendered
THEN it displays a human-readable label (e.g., "Website Tracker", "HubSpot", "Cal.com")
AND uses a compact badge/chip visual style
```

**Status:** PASSED

---

### AC-008: DataTable supports sorting, hover, and row click

```gherkin
GIVEN a column definition array and a data array
WHEN DataTable is rendered
THEN it displays all rows with column headers
AND clicking a sortable column header sorts the data by that column
AND rows highlight on hover
AND clicking a row calls onRowClick with the row data (when provided)
AND when data is empty, it shows the emptyMessage
AND headers are sticky when the table scrolls
```

**Status:** PASSED

---

### AC-009: ListLayout composes PageHeader with filter slot

```gherkin
GIVEN a title, optional subtitle, optional filters ReactNode, and children
WHEN ListLayout is rendered
THEN it displays PageHeader with the title and subtitle
AND renders the filters slot between header and content
AND renders children in a full-width content area (no max-width constraint)
```

**Status:** PASSED

---

### AC-010: RecordDetailLayout provides two-column structure

```gherkin
GIVEN a header ReactNode, optional sidebar ReactNode, optional breadcrumb, and children
WHEN RecordDetailLayout is rendered
THEN it renders optional breadcrumb above the header
AND header spans the full width
AND below the header, content is split into main area and sidebar
AND the overall container has a max-width of ~1400px
```

**Status:** PASSED

---

### AC-011: AnalyticsLayout provides header + filter + grid area

```gherkin
GIVEN a title, optional subtitle, optional filters ReactNode, and children
WHEN AnalyticsLayout is rendered
THEN it displays PageHeader with title and subtitle
AND renders the filters slot
AND renders children in a content area suitable for charts and tables
```

**Status:** PASSED

---

### AC-012: JourneyTimeline displays events grouped by date

```gherkin
GIVEN a personId for a person with journey events (e.g., "person_john_smith")
WHEN JourneyTimeline is rendered
THEN it shows a header "Journey assembled from N systems" with source system chips
AND events are grouped by date with date labels (e.g., "SEP 14")
AND each event shows: time, category accent color, description, source system chip
AND high-importance events (lead_created, form_submitted, opportunity_created, proposal_sent, deal_won) are visually emphasized
AND low-importance events (page_viewed, session_started) are visually muted
AND consecutive page_viewed events within one session collapse into "N pages viewed"
```

**Status:** PASSED

---

### AC-013: JourneyTimeline category colors match design system §35

```gherkin
GIVEN events with various categories
WHEN JourneyTimeline renders those events
THEN acquisition events use dessert accent
AND website events use neutral accent
AND conversion events use MOP Red accent
AND communication events use neutral-warm accent
AND revenue events use success green accent
AND all colors use semantic tokens (not raw hex)
```

**Status:** PASSED

---

### AC-014: AttributionSummary shows three-column attribution

```gherkin
GIVEN a personId for "person_john_smith" (Full attribution)
WHEN AttributionSummary is rendered
THEN it shows three sections: First Touch, Last Marketing Touch, Conversion Touch
AND First Touch shows "Google Organic" with SourceBadge
AND Last Marketing Touch shows "LinkedIn Organic" with SourceBadge
AND Conversion Touch shows "Contact Form"
AND each section includes timestamp and landing page
```

**Status:** PASSED

---

### AC-015: AttributionSummary handles Unknown attribution

```gherkin
GIVEN a personId for "person_anna_keller" (Unknown attribution)
WHEN AttributionSummary is rendered
THEN First Touch shows "Unknown" state
AND Last Marketing Touch shows "Unknown" state
AND the message "No known marketing interaction was identified before conversion." is displayed
AND no source badge is fabricated
```

**Status:** PASSED

---

### AC-016: AttributionSummary includes self-reported and relationship data

```gherkin
GIVEN a personId that has selfReported data (e.g., John Smith → "LinkedIn content")
WHEN AttributionSummary is rendered
THEN it displays a separate "Self-Reported" section with the response
AND given a personId with relationship data (e.g., Thomas Weber → "Existing Client Referral")
THEN it displays a separate "Relationship" section with referrer details
```

**Status:** PASSED

---

### AC-017: AttributionSummary "Why?" reveals evidence

```gherkin
GIVEN a personId with full attribution
WHEN the user clicks the "Why?" button on a touchpoint
THEN a dialog/panel opens showing: timestamp, source system, referrer, landing page, campaign (if any)
AND the explanation data comes from the touchpoint's session/event data
```

**Status:** PASSED

---

### AC-018: No dependency direction violations

```gherkin
GIVEN all new component files
WHEN imports are analyzed
THEN domain/ components only import from ui/, lib/, types/, data/
AND features/ components only import from domain/, ui/, lib/, types/, data/
AND layout/ components only import from ui/, lib/, types/
AND no component imports from app/ or from a higher-level features/ folder
```

**Status:** PASSED — grep confirms zero imports from `@/app` or `@/components/features` in domain/ or layout/.

---

### AC-019: No raw hex colors in components

```gherkin
GIVEN all new component files
WHEN the source is scanned for hex color patterns (#[0-9A-Fa-f]{3,8})
THEN zero matches are found
AND all colors use semantic Tailwind classes (bg-primary, text-muted-foreground, etc.)
```

**Status:** PASSED — grep confirms zero hex color matches in all new files.

---

### AC-020: Existing tests remain passing

```gherkin
GIVEN the 82 existing seed-validation tests
WHEN npm run test is executed after Phase 3 implementation
THEN all 82 tests pass
AND TypeScript compilation (npx tsc --noEmit) succeeds with zero errors
```

**Status:** PASSED — 82/82 tests pass, `tsc --noEmit` clean.

---

## 3. Traceability Matrix

| Criterion | Verification Method | Status |
|-----------|---------------------|--------|
| AC-001 | Code review: `src/components/domain/person-identity.tsx` | PASSED |
| AC-002 | Code review: `src/components/domain/source-badge.tsx` | PASSED |
| AC-003 | Code review: `src/components/domain/stage-badge.tsx` | PASSED |
| AC-004 | Code review: `src/components/domain/attribution-status-badge.tsx` | PASSED |
| AC-005 | Code review: `src/components/domain/money-value.tsx` | PASSED |
| AC-006 | Code review: `src/components/domain/date-time.tsx` | PASSED |
| AC-007 | Code review: `src/components/domain/source-system-chip.tsx` | PASSED |
| AC-008 | Code review: `src/components/ui/data-table.tsx` | PASSED |
| AC-009 | Code review: `src/components/layout/list-layout.tsx` | PASSED |
| AC-010 | Code review: `src/components/layout/record-detail-layout.tsx` | PASSED |
| AC-011 | Code review: `src/components/layout/analytics-layout.tsx` | PASSED |
| AC-012 | Code review: `src/components/features/journey/journey-timeline.tsx` | PASSED |
| AC-013 | Code review: `src/components/features/journey/journey-timeline.tsx` | PASSED |
| AC-014 | Code review: `src/components/features/attribution/attribution-summary.tsx` | PASSED |
| AC-015 | Code review: `src/components/features/attribution/attribution-summary.tsx` | PASSED |
| AC-016 | Code review: `src/components/features/attribution/attribution-summary.tsx` | PASSED |
| AC-017 | Code review: `src/components/features/attribution/attribution-summary.tsx` | PASSED |
| AC-018 | grep for import violations — zero matches | PASSED |
| AC-019 | grep for hex colors — zero matches | PASSED |
| AC-020 | `npx tsc --noEmit` + `npm run test` (82/82) | PASSED |

---

## 4. Technical Design

### 4.1 Component Architecture

```
src/components/
  ui/                           ← shadcn primitives + app-specific UI atoms
    atoms/                      ← shadcn-managed components
      badge.tsx                   Badge (new)
      tooltip.tsx                 Tooltip (new)
      separator.tsx               Separator (new)
      table.tsx                   Table (new)
      skeleton.tsx                Skeleton (new)
      dropdown-menu.tsx           DropdownMenu (new)
      dialog.tsx                  Dialog (new)
      scroll-area.tsx             ScrollArea (new)
      avatar.tsx                  Avatar (new)
      select.tsx                  Select (new)
      button.tsx                  Re-export of ui/button.tsx
    button.tsx                  ← existing
    card.tsx                    ← existing
    input.tsx                   ← existing
    status-dot.tsx              ← NEW: connection/sync status indicator
    metric-value.tsx            ← NEW: large KPI display with trend
    data-table.tsx              ← NEW: generic sortable table (@tanstack/react-table v8)

  domain/                       ← entity display primitives (presentational only)
    person-identity.tsx           Avatar + name + title
    company-identity.tsx          Name + industry + location
    opportunity-value.tsx         Name + money + stage badge
    source-badge.tsx              Source label with config color
    campaign-badge.tsx            Simple campaign label
    stage-badge.tsx               Display or opportunity stage
    owner-chip.tsx                Avatar + owner name
    attribution-status-badge.tsx  Full/Partial/Unknown
    event-type-badge.tsx          Event type label
    money-value.tsx               Formatted currency (tabular-nums)
    date-time.tsx                 Formatted date/time (fixed TZ)
    source-system-chip.tsx        Data provenance chip
    index.ts                      Barrel export

  layout/                       ← page layout templates
    app-shell.tsx               ← existing
    sidebar.tsx                 ← existing
    global-header.tsx           ← existing
    page-header.tsx             ← existing
    list-layout.tsx             ← NEW: leads/accounts list pages
    record-detail-layout.tsx    ← NEW: lead/account detail pages
    analytics-layout.tsx        ← NEW: attribution/overview pages
    index.ts                    ← MODIFIED: added 3 new exports

  features/                     ← feature-level composite components
    journey/
      journey-timeline.tsx      ← NEW: full person journey display
    attribution/
      attribution-summary.tsx   ← NEW: three-column attribution + evidence
```

### 4.2 Dependency Direction

```
app/ → features/ → domain/ → ui/
                           → lib/
                           → types/
                           → data/
```

- `domain/` components are presentational — they receive typed data, never call repositories
- `features/` components may call `lib/` functions to derive display data
- `layout/` components import only from `ui/` and `lib/`
- No upward imports (domain never imports features, layout never imports features)

### 4.3 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| @tanstack/react-table version | v8.21.3 | v9 has breaking API changes incompatible with shadcn DataTable pattern |
| shadcn component path | `src/components/ui/atoms/` | Matches `components.json` alias config |
| Domain primitives are props-only | No repository calls | Keeps them testable and reusable across contexts |
| JourneyTimeline uses `useMemo` | Memoize `getPersonJourney` | Avoid re-deriving on every render |
| AttributionSummary uses Dialog | "Why?" evidence modal | Keeps main layout clean while providing evidence on demand |
| Page view collapsing | Consecutive same-session page_viewed events | Reduces visual noise in long journeys |
| Category accent colors | Semantic Tailwind classes (`bg-dessert`, `bg-primary`, `bg-success`) | Zero raw hex, matches design system §35 |

### 4.4 Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-table` | 8.21.3 | DataTable sorting, column model |
| `@radix-ui/react-dialog` | (via shadcn) | Attribution "Why?" dialog |
| `@radix-ui/react-avatar` | (via shadcn) | PersonIdentity, OwnerChip |
| `@radix-ui/react-scroll-area` | (via shadcn) | Timeline scrolling |
| `@radix-ui/react-separator` | (via shadcn) | Layout dividers |
| `@radix-ui/react-tooltip` | (via shadcn) | Metric explanations |
| `@radix-ui/react-dropdown-menu` | (via shadcn) | Column visibility |
| `@radix-ui/react-select` | (via shadcn) | Filter controls |

---

## 5. Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `src/components/ui/status-dot.tsx` | 27 | Connection/sync status indicator |
| `src/components/ui/metric-value.tsx` | 42 | Large KPI display with trend |
| `src/components/ui/data-table.tsx` | 117 | Generic sortable table |
| `src/components/domain/person-identity.tsx` | 42 | Avatar + name + title |
| `src/components/domain/company-identity.tsx` | 25 | Company name + metadata |
| `src/components/domain/opportunity-value.tsx` | 27 | Opportunity name + value + stage |
| `src/components/domain/source-badge.tsx` | 22 | Source label with config color |
| `src/components/domain/campaign-badge.tsx` | 16 | Simple campaign label badge |
| `src/components/domain/stage-badge.tsx` | 31 | Display/opportunity stage badge |
| `src/components/domain/owner-chip.tsx` | 23 | Avatar + owner name chip |
| `src/components/domain/attribution-status-badge.tsx` | 27 | Full/Partial/Unknown badge |
| `src/components/domain/event-type-badge.tsx` | 19 | Event type label badge |
| `src/components/domain/money-value.tsx` | 17 | Formatted currency |
| `src/components/domain/date-time.tsx` | 28 | Formatted date/time |
| `src/components/domain/source-system-chip.tsx` | 30 | Data provenance chip |
| `src/components/domain/index.ts` | 12 | Barrel export |
| `src/components/layout/list-layout.tsx` | 24 | List page template |
| `src/components/layout/record-detail-layout.tsx` | 28 | Detail page template |
| `src/components/layout/analytics-layout.tsx` | 24 | Analytics page template |
| `src/components/features/journey/journey-timeline.tsx` | 170 | Full journey display |
| `src/components/features/attribution/attribution-summary.tsx` | 210 | Three-column attribution |
| `src/components/ui/atoms/button.tsx` | 3 | Re-export for dialog compatibility |

## Files Modified

| File | Change |
|------|--------|
| `src/components/layout/index.ts` | Added 3 new layout exports |

---

## 6. Quality Gates

| Gate | Result |
|------|--------|
| TypeScript clean (`npx tsc --noEmit`) | PASSED — 0 errors |
| Lint clean (new files only) | PASSED — 0 errors, 0 warnings |
| Tests pass (`npm run test`) | PASSED — 82/82 |
| No raw hex colors | PASSED — grep confirms 0 matches |
| No dependency violations | PASSED — grep confirms 0 upward imports |
| Existing functionality preserved | PASSED — no modifications to lib/, data/, or types/ |

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-28 | [x] |
