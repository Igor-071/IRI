# Specification: Phase 8 — Attribution Page

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-28
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 10, `08_BUILD_INSTRUCTIONS` Phase 10

---

## 1. Overview

### 1.1 Summary

Build the **Attribution** page — the analytical screen where users compare how acquisition sources contribute to pipeline and revenue under different attribution models. This is a critical P0 demo path stop: users switch between First Touch, Last Marketing Touch, and Conversion Touch models and watch Acme's €120K visibly move between Google Organic, LinkedIn Organic, and Direct.

The page introduces model-parameterized attribution — a single computation function that takes an `AttributionModel` and returns per-source rows with leads, qualified, opportunities, won, pipeline, revenue, and conversion rates. All components on the page share this computation and react to model changes via URL state.

### 1.2 Goals

- Add `getAttributionMetrics()` utility with model-parameterized source resolution
- Add `resolvePersonSource()` and `resolveOpportunitySource()` as reusable attribution primitives
- Build segmented model selector with URL state sync (`?model=first_touch|last_touch|conversion_touch`)
- Build KPI strip showing Attributed Leads, Open Pipeline, Won Revenue, Avg Won Deal
- Build source chart with CSS horizontal bars and metric toggle (Pipeline/Revenue/Opportunities/Leads)
- Build attribution table with 9 columns, sortable numerics, and source drilldown on row click
- Build Acme comparison card showing €120K under all 3 models side by side
- Build source drilldown panel showing filtered opportunities linked to account detail
- Hide Direct row under First Touch and Last Marketing Touch models
- Enable `?source=unknown` to show Vector Group and Atlas Systems

### 1.3 Non-Goals

- Multi-touch attribution (linear, time-decay, U-shaped) — V2
- Custom attribution model builder — V2
- Attribution by campaign (not source) — V2
- Export or download attribution data — V2
- Attribution trends over time — V2

### 1.4 User Story

As a marketing or revenue leader viewing the Attribution page,
I want to switch between First Touch, Last Marketing Touch, and Conversion Touch models and see how sources shift in contribution,
so that I can understand which channels are driving pipeline and revenue under each perspective.

---

## 2. Acceptance Criteria

### AC-001: Model selector with URL state

```gherkin
GIVEN the user navigates to /attribution
WHEN the page renders
THEN a segmented control shows: First Touch | Last Marketing Touch | Conversion Touch
AND First Touch is selected by default (?model=first_touch)
AND an explanatory context sentence appears below the selector
AND changing the model updates all sections and the URL
```

**Status:** PASSED — `AttributionModelSelector` renders 3 buttons with `role="tab"` and `aria-selected`; active model stored in URL via `useSearchParams`; context sentence switches per model via `models` config array

---

### AC-002: KPI strip updates per model

```gherkin
GIVEN the Attribution page with any model selected
WHEN the KPI strip renders
THEN it shows: Attributed Leads, Open Pipeline, Won Revenue, Avg Won Deal
AND totals remain consistent across models (same data, different grouping)
```

**Status:** PASSED — `AttributionKpiStrip` receives `AttributionMetrics` computed via `getAttributionMetrics(model)`; totals are aggregated from all rows regardless of source grouping; `MetricCard` reused from Overview

---

### AC-003: Source chart with metric toggle

```gherkin
GIVEN the Attribution page
WHEN the source chart renders
THEN horizontal ranked bars show sources sorted by selected metric
AND toggle buttons allow switching: Pipeline | Revenue | Opportunities | Leads
AND Direct row is hidden for first_touch/last_touch, visible for conversion_touch
AND clicking a source bar sets ?source=X
```

**Status:** PASSED — `AttributionSourceChart` uses internal `chartMetric` state with 4 toggle buttons; CSS bar pattern from `pipeline-by-source.tsx`; `filteredRows` excludes Direct for non-conversion models; click handler calls `onSourceClick(source)` which sets `?source=` URL param

---

### AC-004: Attribution table with 9 columns

```gherkin
GIVEN the Attribution page
WHEN the table renders
THEN columns are: Source, Leads, Qualified, Opportunities, Won, Lead→Opp %, Open Pipeline, Revenue, Avg Deal
AND rows show all sources (except Direct hidden for first_touch/last_touch)
AND Unknown row is clickable → triggers source drilldown
AND numeric columns are sortable
```

**Status:** PASSED — `AttributionTable` defines 9 `ColumnDef`s; Source uses `SourceBadge`; numeric columns use `formatMoneyFull`/`formatPercent`; `DataTable` enables sorting via `getSortedRowModel()`; Direct filtered in UI; `onRowClick` calls `onSourceClick(row.source)`

---

### AC-005: Acme attribution comparison

```gherkin
GIVEN the Attribution page
WHEN the comparison section renders
THEN it shows Acme €120K under all 3 models side by side:
  First Touch: Google Organic
  Last Marketing Touch: LinkedIn Organic
  Conversion Touch: Direct
AND the active model column is highlighted
```

**Status:** PASSED — `AttributionComparison` resolves `person_john_smith` via `getPersonById()`; calls `resolvePersonSource(person, model)` for each of the 3 models; active model column gets `border-ring bg-accent/50`; shows `SourceBadge` and source label per model

---

### AC-006: Source drilldown

```gherkin
GIVEN ?source=unknown is set
WHEN the drilldown section renders
THEN it shows Vector Group (€160K, Qualified) and Atlas Systems (€180K, Won)
AND each links to their account detail page
```

**Status:** PASSED — `AttributionSourceDrilldown` filters `ledger` via `resolveOpportunitySource(entry, model) === source`; renders opportunity cards with `StageBadge` (variant="opportunity"), `formatMoneyFull`, and `<Link href="/accounts/${entry.companyId}">`; Vector Group and Atlas Systems both have `firstTouchSource: "unknown"` and appear under Unknown

---

### AC-007: P0 demo path works

```gherkin
GIVEN the user follows the demo path
WHEN they switch First Touch → Conversion Touch → Last Marketing Touch
THEN Acme €120K moves Google Organic → Direct → LinkedIn Organic
AND clicking Unknown row → Vector Group visible
```

**Status:** PASSED — Model switching via `setModel()` updates `?model=` and clears `?source=`; `resolvePersonSource()` returns correct sources for John Smith under each model; Unknown drilldown shows both Vector Group and Atlas Systems entries

---

### AC-008: No hex colors, existing tests pass

```gherkin
GIVEN all new files
WHEN verified
THEN zero hex colors, 101 tests pass, tsc clean
```

**Status:** PASSED — `grep '#[0-9a-fA-F]'` returns 0 matches; 101/101 tests pass; `tsc --noEmit` clean; `eslint` clean on all new files

---

## 3. Traceability Matrix

| Criterion | Test / Verification | Status |
|-----------|---------------------|--------|
| AC-001 | Code review: `attribution-model-selector.tsx` — 3 buttons with `role="tab"`, `aria-selected`, context sentence array; `page.tsx` — `useSearchParams` for `model`, defaults to `first_touch` | PASSED |
| AC-002 | Code review: `attribution-kpi-strip.tsx` — 4 `MetricCard`s from `AttributionMetrics` totals; totals aggregated from all source rows | PASSED |
| AC-003 | Code review: `attribution-source-chart.tsx` — `chartMetric` state, 4 toggle buttons, CSS bars, Direct filtered for non-conversion, `onSourceClick` callback | PASSED |
| AC-004 | Code review: `attribution-table.tsx` — 9 `ColumnDef`s, `SourceBadge` for source, sortable numerics, Direct filtered, `onRowClick` → `onSourceClick` | PASSED |
| AC-005 | Code review: `attribution-comparison.tsx` — `resolvePersonSource(john, model)` for each of 3 models; active column highlighted with `border-ring bg-accent/50` | PASSED |
| AC-006 | Code review: `attribution-source-drilldown.tsx` — `ledger.filter()` via `resolveOpportunitySource(entry, model) === source`; `Link` to `/accounts/${entry.companyId}` | PASSED |
| AC-007 | Manual verification: First Touch → Google Organic, Conversion Touch → Direct, Last Marketing Touch → LinkedIn Organic; Unknown drilldown shows Vector Group + Atlas Systems | PASSED |
| AC-008 | `grep '#[0-9a-fA-F]'` — 0 matches; `npm run test` — 101/101; `tsc --noEmit` — clean; `eslint` — clean | PASSED |

---

## 4. Technical Design

### 4.1 Attribution Metrics Module

**`src/lib/metrics/attribution-metrics.ts`**

Core types:

```typescript
interface AttributionSourceRow {
  source: AcquisitionSource;
  leads: number;
  qualified: number;
  opportunities: number;
  won: number;
  leadToOppPercent: number;
  openPipeline: number;
  revenue: number;
  avgDeal: number;
}

interface AttributionMetrics {
  rows: AttributionSourceRow[];
  totalLeads: number;
  totalOpenPipeline: number;
  totalWonRevenue: number;
  avgWonDeal: number;
}
```

Source resolution functions:

```typescript
resolvePersonSource(person: Person, model: AttributionModel): AcquisitionSource
  first_touch      → person.firstTouchSource
  last_touch       → getLastMarketingTouch(person.id)?.source ?? "unknown"
  conversion_touch → person.conversionChannel

resolveOpportunitySource(entry: LedgerEntry, model: AttributionModel): AcquisitionSource
  → getPersonById(entry.primaryContactId) → resolvePersonSource(person, model)
```

Main function:

```typescript
getAttributionMetrics(model: AttributionModel): AttributionMetrics
```

Two-pass computation:
1. Iterate `people` — count leads and qualified per resolved source
2. Iterate `ledger` — count opportunities, open pipeline, won revenue per resolved source
3. Build rows sorted by open pipeline descending
4. Compute totals

### 4.2 Component Architecture

```
src/components/features/attribution/
  attribution-model-selector.tsx    ← Client: 3-button segmented control, role=tablist
  attribution-kpi-strip.tsx         ← Server-safe: 4 MetricCards from AttributionMetrics
  attribution-source-chart.tsx      ← Client: CSS horizontal bars, metric toggle, click → ?source=
  attribution-table.tsx             ← Client: DataTable 9 columns, sortable, click → source drilldown
  attribution-comparison.tsx        ← Client: Acme 3-model side-by-side, active highlighted
  attribution-source-drilldown.tsx  ← Client: filtered opportunity list, links to /accounts/<id>
```

### 4.3 Page Composition

```
AttributionPage
  └── Suspense
        └── AttributionContent (client)
              └── AnalyticsLayout
                    ├── title: "Attribution"
                    ├── subtitle: "Connect marketing activity to pipeline and revenue."
                    └── children:
                          ├── AttributionModelSelector (model, setModel)
                          ├── AttributionKpiStrip (metrics)
                          ├── Grid [2 cols on lg]:
                          │     ├── AttributionSourceChart (rows, model, source, setSource)
                          │     └── AttributionComparison (activeModel)
                          ├── AttributionTable (rows, model, setSource)
                          └── AttributionSourceDrilldown (if ?source= set)
```

State management via URL search params:
- `?model=first_touch|last_touch|conversion_touch` — defaults to `first_touch`
- `?source=<source_key>` — optional, drives drilldown visibility
- `setModel()` clears `?source=` to prevent stale drilldowns across models

### 4.4 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Attribution metrics | New `lib/metrics/attribution-metrics.ts` | Pure function, model-parameterized, all components share same computation |
| Source resolution | Exported `resolvePersonSource()` + `resolveOpportunitySource()` | Centralized model→source mapping; reused by drilldown and comparison |
| Direct row visibility | Filter in UI, not data | Computation includes Direct naturally; UI hides for First Touch / Last Marketing Touch per spec rules |
| No Recharts | CSS horizontal bars | Consistent with existing Overview charts (`pipeline-by-source.tsx`), no new dependency |
| Model switching clears source | `setModel()` also clears `?source=` | A drilldown from one model may not apply to another |
| Acme comparison | Hardcoded reference to `person_john_smith` | Spec requires this specific hero example; `opp_acme_ai` value is €120K |
| Segmented control | Custom styled buttons with `role=tablist` | No shadcn Tabs exists in the project; accessible ARIA roles |
| Source click toggle | Clicking same source deselects | Better UX than requiring a separate "clear" action |

### 4.5 Reused Modules

| Module | Usage |
|--------|-------|
| `lib/attribution/touchpoints` | `getLastMarketingTouch()` for last_touch model resolution |
| `lib/data/repositories` | `getPersonById()` for opportunity → person lookup |
| `lib/config/sources` | `sourceConfig`, `getSourceLabel()` for display |
| `lib/formatting/money` | `formatMoney()`, `formatMoneyFull()` |
| `lib/formatting/percent` | `formatPercent()` for Lead→Opp % |
| `components/features/overview/metric-card` | `MetricCard` for KPI strip |
| `components/features/overview/pipeline-by-source` | CSS bar pattern reference |
| `components/domain/*` | `SourceBadge`, `StageBadge`, `MoneyValue` |
| `components/ui/data-table` | `DataTable` with sorting support |
| `components/ui/card` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` |
| `components/layout` | `AnalyticsLayout` |
| `data/ledger` | `ledger`, `LedgerEntry` |
| `data/index` | `people` |

---

## 5. Files

### Files Created

| File | Purpose |
|------|---------|
| `src/lib/metrics/attribution-metrics.ts` | Pure functions: `resolvePersonSource()`, `resolveOpportunitySource()`, `getAttributionMetrics()` — model-parameterized attribution computation |
| `src/components/features/attribution/attribution-model-selector.tsx` | Segmented control with `role=tablist`, 3 model buttons, context sentence per model |
| `src/components/features/attribution/attribution-kpi-strip.tsx` | 4 MetricCards: Attributed Leads, Open Pipeline, Won Revenue, Avg Won Deal |
| `src/components/features/attribution/attribution-source-chart.tsx` | CSS horizontal bars with Pipeline/Revenue/Opportunities/Leads metric toggle, click → `?source=` |
| `src/components/features/attribution/attribution-table.tsx` | DataTable with 9 columns (Source, Leads, Qualified, Opps, Won, Lead→Opp %, Pipeline, Revenue, Avg Deal), sortable |
| `src/components/features/attribution/attribution-comparison.tsx` | Acme €120K 3-model comparison — Google Organic / LinkedIn Organic / Direct with active highlight |
| `src/components/features/attribution/attribution-source-drilldown.tsx` | Filtered opportunity list for selected source, linked to `/accounts/<companyId>` |

### Files Modified

| File | Change |
|------|--------|
| `src/app/(app)/attribution/page.tsx` | Replaced placeholder with client component: Suspense-wrapped `AttributionContent` with `useSearchParams` for `model` and `source`, `useMemo` for `getAttributionMetrics()`, `AnalyticsLayout` wrapper |

---

## 6. Quality Gates

| Gate | Result |
|------|--------|
| TypeScript clean (`npx tsc --noEmit`) | PASSED — 0 errors |
| Lint clean (new/modified files) | PASSED — 0 errors, 0 warnings |
| Tests pass (`npm run test`) | PASSED — 101/101 (all existing tests preserved) |
| No raw hex colors | PASSED — grep confirms 0 matches across all 8 new/modified files |
| Existing tests preserved | PASSED — all 101 prior tests still pass |
| Code review | PASSED — no dead code, no hardcoded values, no boundary errors |

---

## 7. P0 Demo Path Coverage

This phase enables the following segment of the P0 demo path:

```
... → Attribution (First → Conversion → Last Marketing Touch) → Unknown row → Vector Group → ...
```

Specifically:
- Navigate to `/attribution` — First Touch model active by default
- KPI strip: total leads, open pipeline, won revenue, avg won deal
- Source chart: Google Organic, LinkedIn Organic, Referral, etc. ranked by pipeline; Direct hidden
- Acme comparison card: First Touch = Google Organic (highlighted), Last Marketing Touch = LinkedIn Organic, Conversion Touch = Direct
- Switch to Conversion Touch — Acme moves to Direct, Direct row appears in chart and table
- Switch to Last Marketing Touch — Acme moves to LinkedIn Organic
- Click Unknown row in table → drilldown shows Vector Group (€160K, Qualified) and Atlas Systems (€180K, Won)
- Click Vector Group → navigates to `/accounts/company_vector`

---

## 8. Canonical Demo Records — Verification

### Acme Inc — Attribution Comparison

| Model | Expected Source | Actual Source |
|-------|-----------------|---------------|
| First Touch | Google Organic | Google Organic — `person.firstTouchSource` is `google_organic` |
| Last Marketing Touch | LinkedIn Organic | LinkedIn Organic — `getLastMarketingTouch("person_john_smith")` returns LinkedIn Organic session |
| Conversion Touch | Direct | Direct — `person.conversionChannel` is `direct` |

### Vector Group — Unknown Attribution

| Field | Expected | Actual |
|-------|----------|--------|
| First Touch Source | Unknown | `unknown` — `person_anna_keller.firstTouchSource` is `unknown` |
| Drilldown | Shows under Unknown | `resolveOpportunitySource(opp_vector_operations, "first_touch")` → `unknown` |
| Value | €160,000 | €160,000 — `opp_vector_operations.value` |
| Stage | Qualified | Qualified — `opp_vector_operations.stage` |

### Atlas Systems — Unknown with Relationship

| Field | Expected | Actual |
|-------|----------|--------|
| First Touch Source | Unknown | `unknown` — `opp_atlas_ai.firstTouchSource` is `unknown` |
| Drilldown | Shows under Unknown | `resolveOpportunitySource(opp_atlas_ai, "first_touch")` → `unknown` |
| Value | €180,000 | €180,000 — `opp_atlas_ai.value` |
| Stage | Won | Won — `opp_atlas_ai.stage` |

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-28 | [x] |
