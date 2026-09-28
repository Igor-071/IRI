# Specification: Phase 4 — Overview Screen

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-28
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 6, `08_BUILD_INSTRUCTIONS` Phase 6

---

## 1. Overview

### 1.1 Summary

Build the Overview screen — the main dashboard and entry point for the P0 management demo. Phases 1–3 delivered the project foundation, seed data (45 companies, 80 people, 26 opportunities), all business logic, and the shared component library. Phase 4 composes those pieces into the first real screen: a KPI strip, pipeline and revenue breakdowns by source, attribution coverage panel, conversion funnel, and recent leads table. All displayed values are derived from seed data and must match the validation targets in `00_DECISIONS.md §14`.

### 1.2 Goals

- Add `getPipelineBySource()` and `getRevenueBySource()` pure functions to `lib/metrics`
- Fix `leadToOpportunity` calculation (was won÷opps, now opps÷leads = 32.5%)
- Build 7 feature components: MetricCard, KpiStrip, PipelineBySource, RevenueBySource, DataQualityPanel, ConversionFunnel, RecentInbound
- Compose the Overview page with AnalyticsLayout and all sections
- Wire navigation drilldowns: source rows → `/attribution?source=...`, lead rows → `/leads/<id>`, CTAs → `/leads?attribution=...`
- Achieve 19 new unit tests covering the new metric functions
- Enforce zero raw hex colors in all new files

### 1.3 Non-Goals

- Time range filters (V2)
- Trend deltas / sparklines on KPI cards (V2)
- Recharts-based interactive charts (bars are pure CSS)
- Leads list page implementation (Phase 7)
- Attribution page implementation (Phase 10)

### 1.4 User Story

As a revenue leader viewing the Overview dashboard,
I want to see KPIs, pipeline by source, revenue by source, attribution coverage, conversion funnel, and recent leads,
so that I can assess inbound performance at a glance and drill into any area for detail.

---

## 2. Acceptance Criteria

### AC-001: KPI strip displays 6 correct metrics

```gherkin
GIVEN the Overview page is loaded with default range "This Year"
WHEN the KPI strip renders
THEN it shows exactly 6 metric cards in a horizontal row:
  - Inbound Leads: 80
  - Open Pipeline: €1,250,000 (labeled "as of today", snapshot)
  - Won Revenue: €740,000
  - Opportunities: 26
  - Lead → Opportunity: 32.5%
  - Avg. First Response: 2h 18m (±10m)
AND all money values use tabular-nums
AND no trend deltas are shown (V1)
```

**Status:** PASSED

---

### AC-002: Pipeline by Source shows ranked horizontal bars

```gherkin
GIVEN the Overview page is loaded
WHEN Pipeline by Source renders
THEN it shows horizontal bars ranked by value (highest first)
AND each row shows: source label, €-value
AND the header reads "Pipeline by source"
AND a label reads "First Touch · change model in Attribution"
AND clicking a source row navigates to /attribution?source=<source>
```

**Status:** PASSED

---

### AC-003: Attribution Coverage panel shows breakdown

```gherkin
GIVEN the Overview page is loaded
WHEN the Attribution Coverage panel renders
THEN it shows "73%" as the primary metric (58 ÷ 80 = 72.5% → 73%)
AND shows breakdown: 58 Full, 15 Partial, 7 Unknown
AND uses a progress-style visualization (not a donut)
AND shows "Revenue with relationship attribution only: €180K (1 deal)"
AND has a "View unknown-attribution leads" CTA linking to /leads?attribution=unknown
AND clicking Full/Partial/Unknown navigates to /leads?attribution=<status>
```

**Status:** PASSED

---

### AC-004: Revenue by Source shows ranked bars

```gherkin
GIVEN the Overview page is loaded
WHEN Revenue by Source renders
THEN it shows horizontal bars of won revenue by First Touch source
AND each row shows: source label, €-value, number of won deals
AND rows are ranked by value highest first
AND clicking a row navigates to /attribution?source=<source>
```

**Status:** PASSED

---

### AC-005: Conversion Funnel shows 5 stages

```gherkin
GIVEN the Overview page is loaded
WHEN the Conversion Funnel renders
THEN it shows 5 stages: Known Leads (80), Qualified (44), Opportunities (26), Proposals (17), Won (10)
AND conversion rates between stages: 55%, 59%, 65%, 59%
AND the visualization is compact (stepped bars or vertical counts, not a decorative funnel shape)
```

**Status:** PASSED

---

### AC-006: Recent Inbound table shows 8 most recent leads

```gherkin
GIVEN the Overview page is loaded
WHEN the Recent Inbound section renders
THEN it shows a compact table of 8 rows sorted by most recent lead_created
AND columns: Contact (PersonIdentity), Company, First Touch (SourceBadge), Stage (StageBadge), Value, Owner (OwnerChip), Created (relative DateTime)
AND John Smith / Acme is included in the rows
AND clicking a row navigates to /leads/<personId>
AND a "View all leads →" link navigates to /leads
```

**Status:** PASSED

---

### AC-007: Page header and layout match spec

```gherkin
GIVEN the Overview page is loaded
WHEN the page renders
THEN the title is "Overview"
AND the subtitle is "Inbound performance across acquisition, conversion, pipeline and revenue."
AND the page uses AnalyticsLayout
```

**Status:** PASSED

---

### AC-008: Pipeline by Source data is computed correctly

```gherkin
GIVEN all 11 open opportunities in the ledger
WHEN pipeline values are aggregated by firstTouchSource
THEN the totals match the ledger data:
  Google Organic: opp_baltic(140K) + opp_acme(120K) = €260K
  LinkedIn Ads: opp_stratum(220K) = €220K
  Referral: opp_veldt(120K) + opp_hartmann(90K) = €210K
  LinkedIn Organic: opp_aurora(110K) + opp_nordica(90K) = €200K
  Unknown: opp_vector(160K) = €160K
  Google Ads: opp_northstar(75K) + opp_cobalt(65K) = €140K
  Event: opp_polaris(60K) = €60K
```

**Status:** PASSED — verified by `tests/overview-metrics.test.ts`

---

### AC-009: Revenue by Source data is computed correctly

```gherkin
GIVEN the 10 won opportunities in the ledger
WHEN won revenue is aggregated by firstTouchSource
THEN the totals match:
  Referral: brightline(95K) + kestrel(85K) = €180K
  Unknown: atlas(180K) = €180K
  Event: meridian(140K) = €140K
  Google Organic: lumen(60K) + fjord(45K) = €105K
  LinkedIn Organic: solvik(55K) = €55K
  Google Ads: praxis(30K) + verde(25K) = €55K
  LinkedIn Ads: tessera(25K) = €25K
```

**Status:** PASSED — verified by `tests/overview-metrics.test.ts`

---

### AC-010: New lib functions have unit tests

```gherkin
GIVEN new functions getPipelineBySource() and getRevenueBySource() in lib/metrics
WHEN npm run test executes
THEN tests verify correct aggregation totals per source
AND all 82 existing tests still pass
AND TypeScript compilation succeeds with zero errors
```

**Status:** PASSED — 101 tests (82 existing + 19 new), `tsc --noEmit` clean

---

### AC-011: No raw hex colors and semantic tokens only

```gherkin
GIVEN all new files created in Phase 4
WHEN scanned for hex color patterns
THEN zero matches found
AND charts use semantic color tokens from the design system
```

**Status:** PASSED — grep confirms 0 hex color matches

---

### AC-012: Navigation drilldowns work correctly

```gherkin
GIVEN the Overview page
WHEN user clicks a Pipeline/Revenue source row
THEN they navigate to /attribution?source=<source_key>
WHEN user clicks a Recent Inbound row
THEN they navigate to /leads/<personId>
WHEN user clicks "View all leads →"
THEN they navigate to /leads
WHEN user clicks "View unknown-attribution leads"
THEN they navigate to /leads?attribution=unknown
WHEN user clicks a Full/Partial/Unknown count in Attribution Coverage
THEN they navigate to /leads?attribution=<status>
```

**Status:** PASSED

---

## 3. Traceability Matrix

| Criterion | Test / Verification | Status |
|-----------|---------------------|--------|
| AC-001 | Code review: `kpi-strip.tsx` + `metric-card.tsx` | PASSED |
| AC-002 | Code review: `pipeline-by-source.tsx` | PASSED |
| AC-003 | Code review: `data-quality-panel.tsx` | PASSED |
| AC-004 | Code review: `revenue-by-source.tsx` | PASSED |
| AC-005 | Code review: `conversion-funnel.tsx` | PASSED |
| AC-006 | Code review: `recent-inbound.tsx` | PASSED |
| AC-007 | Code review: `src/app/(app)/overview/page.tsx` | PASSED |
| AC-008 | `tests/overview-metrics.test.ts` — getPipelineBySource (8 tests) | PASSED |
| AC-009 | `tests/overview-metrics.test.ts` — getRevenueBySource (8 tests) | PASSED |
| AC-010 | `npm run test` — 101/101, `tsc --noEmit` clean | PASSED |
| AC-011 | `grep -rn '#[0-9a-fA-F]' src/components/features/overview/` — 0 matches | PASSED |
| AC-012 | Code review: all Link hrefs and router.push calls | PASSED |

---

## 4. Technical Design

### 4.1 New Library Functions

Two pure functions added to `src/lib/metrics/index.ts`:

**`getPipelineBySource()`** → `PipelineBySourceEntry[]`
- Filters ledger for entries where `stage !== "won" && stage !== "lost"`
- Groups by `firstTouchSource`, sums `value`
- Returns sorted descending by value

**`getRevenueBySource()`** → `RevenueBySourceEntry[]`
- Filters ledger for entries where `stage === "won"`
- Groups by `firstTouchSource`, sums `value`, counts deals
- Returns sorted descending by value

**`leadToOpportunity` fix:**
- Before: `wonEntries.length / ledger.length` (win rate, not conversion rate)
- After: `ledger.length / people.length` (26 ÷ 80 = 0.325 = 32.5%)

### 4.2 Component Architecture

```
src/components/features/overview/
  metric-card.tsx          ← Single KPI: label, value, optional context
  kpi-strip.tsx            ← 6 MetricCards in responsive grid
  pipeline-by-source.tsx   ← Ranked horizontal bars (CSS, not Recharts)
  revenue-by-source.tsx    ← Ranked horizontal bars with deal counts
  data-quality-panel.tsx   ← Coverage %, progress bar, breakdown, CTAs
  conversion-funnel.tsx    ← 5-stage stepped bars with conversion %s
  recent-inbound.tsx       ← DataTable (8 rows), 7 columns, row click nav
```

### 4.3 Page Composition

```
AnalyticsLayout
  ├── KpiStrip (6 cards, responsive grid)
  ├── Grid row: PipelineBySource + DataQualityPanel
  ├── Grid row: RevenueBySource + ConversionFunnel
  └── RecentInbound (Card with DataTable)
```

### 4.4 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Horizontal bars | Pure CSS `div` widths | No Recharts dependency for simple bars; faster render |
| Bar colors | `bg-chart-1` (pipeline), `bg-success` (revenue) | Semantic tokens, visually distinguishes pipeline vs. won |
| Attribution coverage | Progress bar, not donut | Matches AC-003, compact, no chart library needed |
| Recent Inbound | Reuse DataTable | Consistent with future Leads list; sorting for free |
| 8 rows hardcoded | `people.slice(0, 8)` after sort | Matches AC-006 spec; no pagination needed |
| Navigation | Next.js `Link` (source bars) + `router.push` (table rows) | Link for static hrefs, router for dynamic row click |
| No "use client" on page | Server component by default | KpiStrip, ConversionFunnel are server-safe; client directive on interactive components only |

### 4.5 Reused Modules

| Module | Usage |
|--------|-------|
| `lib/metrics` | `getOverviewMetrics`, `getFunnelCounts`, `getAvgFirstResponse`, `getPipelineBySource`, `getRevenueBySource` |
| `lib/attribution/status` | `getAttributionStatus` for coverage counts |
| `lib/formatting/*` | `formatMoney`, `formatMoneyFull`, `formatDuration`, `formatPercent` |
| `lib/config/sources` | `getSourceLabel` for bar labels |
| `lib/data/repositories` | `getOpportunityByPersonId` for value column |
| `data/ledger` | `ledger` for relationship-only revenue calculation |
| `components/domain/*` | PersonIdentity, SourceBadge, StageBadge, MoneyValue, DateTime, OwnerChip |
| `components/ui/data-table` | RecentInbound table |
| `components/ui/card` | Card wrappers for each panel |
| `components/layout` | AnalyticsLayout for page structure |

---

## 5. Files

### Files Created

| File | Purpose |
|------|---------|
| `src/components/features/overview/metric-card.tsx` | Single KPI card: label, value, optional context |
| `src/components/features/overview/kpi-strip.tsx` | 6 MetricCards in responsive grid |
| `src/components/features/overview/pipeline-by-source.tsx` | Ranked horizontal bars for open pipeline |
| `src/components/features/overview/revenue-by-source.tsx` | Ranked horizontal bars for won revenue |
| `src/components/features/overview/data-quality-panel.tsx` | Attribution coverage % + breakdown + CTAs |
| `src/components/features/overview/conversion-funnel.tsx` | 5-stage funnel with conversion rates |
| `src/components/features/overview/recent-inbound.tsx` | DataTable of 8 most recent leads |
| `tests/overview-metrics.test.ts` | 19 tests for getPipelineBySource, getRevenueBySource, leadToOpportunity |

### Files Modified

| File | Change |
|------|--------|
| `src/lib/metrics/index.ts` | Added `PipelineBySourceEntry` and `RevenueBySourceEntry` types, `getPipelineBySource()`, `getRevenueBySource()`. Fixed `leadToOpportunity` from `won/opps` to `opps/leads`. Removed unused `LedgerEntry` import. |
| `src/app/(app)/overview/page.tsx` | Replaced placeholder with full Overview composition using AnalyticsLayout and all 6 section components. |

---

## 6. Quality Gates

| Gate | Result |
|------|--------|
| TypeScript clean (`npx tsc --noEmit`) | PASSED — 0 errors |
| Lint clean (new/modified files) | PASSED — 0 errors, 0 warnings |
| Tests pass (`npm run test`) | PASSED — 101/101 (82 existing + 19 new) |
| No raw hex colors | PASSED — grep confirms 0 matches in new files |
| Existing tests preserved | PASSED — all 82 prior tests still pass |
| Responsive layout | Grid uses `grid-cols-2 lg:grid-cols-6` (KPI) and `lg:grid-cols-2` (panels) |
| No dead code | PASSED — removed unused `LedgerEntry` import |

---

## 7. Validation Targets (from 00_DECISIONS.md §14)

| Metric | Expected | Actual | Match |
|--------|----------|--------|-------|
| Inbound Leads | 80 | 80 | ✓ |
| Open Pipeline | €1,250,000 | €1,250,000 | ✓ |
| Won Revenue | €740,000 | €740,000 | ✓ |
| Opportunities | 26 | 26 | ✓ |
| Lead → Opportunity | 32.5% | 32.5% | ✓ |
| Funnel: Known Leads | 80 | 80 | ✓ |
| Funnel: Qualified | 44 | 44 | ✓ |
| Funnel: Opportunities | 26 | 26 | ✓ |
| Funnel: Proposals | 17 | 17 | ✓ |
| Funnel: Won | 10 | 10 | ✓ |
| Attribution: Full | 58 | 58 | ✓ |
| Attribution: Partial | 15 | 15 | ✓ |
| Attribution: Unknown | 7 | 7 | ✓ |
| Pipeline: Google Organic | €260K | €260K | ✓ |
| Pipeline: LinkedIn Ads | €220K | €220K | ✓ |
| Pipeline: Referral | €210K | €210K | ✓ |
| Pipeline: LinkedIn Organic | €200K | €200K | ✓ |
| Pipeline: Unknown | €160K | €160K | ✓ |
| Pipeline: Google Ads | €140K | €140K | ✓ |
| Pipeline: Event | €60K | €60K | ✓ |
| Revenue: Referral | €180K (2) | €180K (2) | ✓ |
| Revenue: Unknown | €180K (1) | €180K (1) | ✓ |
| Revenue: Event | €140K (1) | €140K (1) | ✓ |
| Revenue: Google Organic | €105K (2) | €105K (2) | ✓ |
| Revenue: LinkedIn Organic | €55K (1) | €55K (1) | ✓ |
| Revenue: Google Ads | €55K (2) | €55K (2) | ✓ |
| Revenue: LinkedIn Ads | €25K (1) | €25K (1) | ✓ |

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-28 | [x] |
