# Specification: Phase 9 — Integrations Page

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-28
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 11, `08_BUILD_INSTRUCTIONS` Phase 11

---

## 1. Overview

### 1.1 Summary

Build the **Integrations** page — a read-only grid showing the 20 connected data sources grouped by category with status indicators, sync times, and record counts. This is the **final stop on the P0 demo path** (`/integrations`). Website Tracker appears first in the Analytics group with a journey-stitching explanatory note. The page is a server component with no client interactivity — all data comes from the deterministic seed.

### 1.2 Goals

- Add `groupIntegrationsByCategory()` utility with ordered category config
- Map `lead_capture` → "Inbound capture" per 00_DECISIONS.md §10.7
- Build `IntegrationCard` showing name, description, StatusDot, status label, attention note, relative sync time, record count, and visual-only Manage button
- Build `IntegrationGrid` grouping cards under category headers with item counts
- Highlight Website Tracker with "Enables person-level journey stitching." note
- Replace placeholder `/integrations` page with full implementation

### 1.3 Non-Goals

- Integration management actions (connect, disconnect, configure) — V2
- Filtering or searching integrations — 20 items fit on one page
- Sync history or logs — V2
- Record count breakdowns by type — V2
- Real-time sync status polling — V2

### 1.4 User Story

As a marketing or revenue leader viewing the Integrations page,
I want to see all connected data sources with their current status, last sync time, and record counts,
so that I can understand what data feeds into the system and identify any sources needing attention.

---

## 2. Acceptance Criteria

### AC-001: Website Tracker shown first with explanatory note

```gherkin
GIVEN the user navigates to /integrations
WHEN the page renders
THEN the Website Tracker card appears first in the Analytics group
AND it includes the note "Enables person-level journey stitching."
```

**Status:** PASSED — `IntegrationCard` receives `highlight={integration.id === "int_website_tracker"}` from `IntegrationGrid`; when `highlight` is true, renders the note in `text-primary` below the description. Website Tracker is the first item in the `integrations` array and appears first in the Analytics group.

---

### AC-002: All 20 integrations grouped by category

```gherkin
GIVEN the seed data contains 20 integrations across 8 categories
WHEN the page renders
THEN integrations are grouped under category headers in order:
  Analytics (5), Advertising (3), Inbound capture (6), CRM (1),
  Communication (1), Scheduling (1), Content (2), Automation (1)
AND category "lead_capture" displays as "Inbound capture"
```

**Status:** PASSED — `groupIntegrationsByCategory()` groups by `integration.category`, sorts by `categoryConfig[category].order`, and maps `lead_capture` → `"Inbound capture"`. Category headers render with `(count)` suffix.

---

### AC-003: Status indicators with correct colors

```gherkin
GIVEN each integration has a status
WHEN a card renders
THEN StatusDot and label show:
  connected → success (green)
  attention → warning (yellow) with attentionNote below
  disconnected → error (red)
  archived → inactive (muted)
```

**Status:** PASSED — `statusDotMap` maps `connected→"connected"`, `attention→"warning"`, `disconnected→"error"`, `archived→"inactive"` matching `StatusDot`'s type variants. `statusLabelMap` provides display labels: Connected, Needs attention, Disconnected, Archived. `attentionNote` renders in `text-warning` when present.

---

### AC-004: Last sync in relative time format

```gherkin
GIVEN an integration has a lastSync timestamp
WHEN the card renders
THEN it shows "Last sync" label with relative time (e.g., "15 min ago")
AND archived/disconnected integrations without lastSync show no sync line
```

**Status:** PASSED — `DateTime` component with `format="relative"` renders relative time using `formatRelativeDate()` from `lib/formatting/dates`. Conditional rendering: sync line only appears when `lastSync` is defined. Cal.com (archived), PhantomBuster (disconnected), and Make.com (archived) have no `lastSync` and show no sync line.

---

### AC-005: Record count displayed

```gherkin
GIVEN an integration has a recordCount
WHEN the card renders
THEN it shows the formatted count with "records" unit
```

**Status:** PASSED — `formatRecordCount()` uses `toLocaleString(LOCALE)` for proper thousand separators (e.g., `12,480 records`). Conditional rendering: only shows when `recordCount != null`.

---

### AC-006: Manage button (visual only)

```gherkin
GIVEN any integration card
WHEN rendered
THEN a "Manage" button appears (outline variant, no action)
```

**Status:** PASSED — `Button` with `variant="outline"`, `size="sm"`, `className="w-full"`, and `disabled` attribute. No click handler attached.

---

### AC-007: P0 demo path final stop works

```gherkin
GIVEN the user follows the full demo path
WHEN they arrive at /integrations
THEN the page loads without errors
AND Website Tracker is visible first
AND all 20 integrations are displayed with correct statuses
```

**Status:** PASSED — Server component loads without client-side errors. Website Tracker is first card in first group (Analytics). All 20 integrations render across 8 category sections.

---

### AC-008: No hex colors, existing tests pass

```gherkin
GIVEN all new files
WHEN verified
THEN zero hex colors, 101 tests pass, tsc clean
```

**Status:** PASSED — `grep '#[0-9a-fA-F]'` returns 0 matches across all new files; 101/101 tests pass; `tsc --noEmit` clean.

---

## 3. Traceability Matrix

| Criterion | Test / Verification | Status |
|-----------|---------------------|--------|
| AC-001 | Code review: `integration-card.tsx` — `highlight` prop triggers "Enables person-level journey stitching." note; `integration-grid.tsx` — `highlight={integration.id === "int_website_tracker"}` | PASSED |
| AC-002 | Code review: `lib/config/integrations.ts` — `categoryConfig` with ordered entries; `groupIntegrationsByCategory()` groups, sorts, maps labels; `lead_capture` → "Inbound capture" | PASSED |
| AC-003 | Code review: `integration-card.tsx` — `statusDotMap` and `statusLabelMap` objects; StatusDot receives mapped status; `attentionNote` rendered conditionally in `text-warning` | PASSED |
| AC-004 | Code review: `integration-card.tsx` — conditional `lastSync &&` block with `DateTime format="relative"`; verified Cal.com, PhantomBuster, Make.com omit sync line | PASSED |
| AC-005 | Code review: `integration-card.tsx` — `formatRecordCount()` uses `toLocaleString(LOCALE)`; conditional `recordCount != null` | PASSED |
| AC-006 | Code review: `integration-card.tsx` — `Button variant="outline" size="sm" disabled` with no `onClick` | PASSED |
| AC-007 | Manual verification: `/integrations` loads; Website Tracker first; 20 cards across 8 sections; no console errors | PASSED |
| AC-008 | `grep '#[0-9a-fA-F]'` — 0 matches; `npm run test` — 101/101; `tsc --noEmit` — clean | PASSED |

---

## 4. Technical Design

### 4.1 Category Config Module

**`src/lib/config/integrations.ts`**

```typescript
const categoryConfig: Record<IntegrationCategory, { label: string; order: number }>

getCategoryLabel(category: IntegrationCategory): string
groupIntegrationsByCategory(integrations: Integration[]): { category: IntegrationCategory; label: string; items: Integration[] }[]
```

Grouping logic:
1. Iterate integrations, bucket by `integration.category`
2. Map each bucket to `{ category, label, items }` using `categoryConfig`
3. Sort by `categoryConfig[category].order`

Category order and labels:

| Category | Label | Order |
|----------|-------|-------|
| `analytics` | Analytics | 0 |
| `advertising` | Advertising | 1 |
| `lead_capture` | Inbound capture | 2 |
| `crm` | CRM | 3 |
| `communication` | Communication | 4 |
| `scheduling` | Scheduling | 5 |
| `content` | Content | 6 |
| `automation` | Automation | 7 |

### 4.2 Component Architecture

```
src/components/features/integrations/
  integration-card.tsx   ← Single card: name, description, status, sync, count, manage
  integration-grid.tsx   ← Groups cards by category with headers and responsive grid
```

### 4.3 IntegrationCard

Props: `{ integration: Integration; highlight?: boolean }`

Layout:
```
┌─────────────────────────────┐
│ Name                        │
│ Description (text-xs muted) │
│ ✦ Journey note (if highlight)│
│                             │
│ ● Connected                 │
│ ⚠ attentionNote (if any)   │
│                             │
│ Last sync · 15m ago         │
│ 12,480 records              │
│                             │
│ [Manage]                    │
└─────────────────────────────┘
```

Status mappings:

| Integration Status | StatusDot Variant | Display Label |
|--------------------|-------------------|---------------|
| `connected` | `connected` | Connected |
| `attention` | `warning` | Needs attention |
| `disconnected` | `error` | Disconnected |
| `archived` | `inactive` | Archived |

Highlighted card (Website Tracker) receives `ring-1 ring-primary/30` on the Card.

### 4.4 IntegrationGrid

Props: `{ integrations: Integration[] }`

Renders grouped sections:
```
<section>                          ← per category
  <h2>Analytics (5)</h2>           ← category label + count
  <div class="grid 1/2/3 cols">   ← responsive grid
    <IntegrationCard />            ← per integration
  </div>
</section>
```

### 4.5 Page Composition

```
IntegrationsPage (server component)
  └── PageHeader
  │     title: "Integrations"
  │     subtitle: "Sources feeding acquisition, behavioral, communication and sales data."
  └── IntegrationGrid
        integrations: imported from @/data
```

No `"use client"` — the page is a server component. All data is static seed data imported at build time.

### 4.6 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Server component | No `"use client"` on page | Static seed data, no interactivity needed — Manage buttons are visual only |
| Category config | New `lib/config/integrations.ts` | Central place for display labels, order, and grouping logic |
| Category label | `lead_capture` → "Inbound capture" | Per 00_DECISIONS.md §10.7 |
| StatusDot mapping | `attention` → `"warning"`, `disconnected` → `"error"` | Matches StatusDot's existing type variants |
| Record count formatting | `toLocaleString(LOCALE)` | Consistent with project locale (en-GB); provides thousand separators |
| Record count unit | Generic "records" | Integrations don't specify individual units in seed data |
| Manage button | Visual-only, `outline` variant, `disabled` | Spec §14.6 says buttons may be visual-only for prototype |
| Highlight via prop | `highlight` boolean on IntegrationCard | Clean separation — grid decides which card is highlighted, card renders the UI |
| No filters or search | Omit | 20 items fit on one page; spec doesn't call for filtering |

### 4.7 Reused Modules

| Module | Usage |
|--------|-------|
| `data/heroes/integrations` | `integrations` array — 20 seed records |
| `types/integration` | `Integration`, `IntegrationCategory`, `IntegrationStatus` types |
| `components/ui/status-dot` | `StatusDot` with `connected`, `warning`, `error`, `inactive` variants |
| `components/domain/date-time` | `DateTime` with `format="relative"` for last sync |
| `components/ui/card` | `Card`, `CardContent` |
| `components/ui/button` | `Button variant="outline" size="sm"` |
| `components/layout/page-header` | `PageHeader` with title and subtitle |
| `lib/config/constants` | `LOCALE` for record count formatting |

---

## 5. Files

### Files Created

| File | Purpose |
|------|---------|
| `src/lib/config/integrations.ts` | Category config map with labels and order; `getCategoryLabel()` and `groupIntegrationsByCategory()` utility functions |
| `src/components/features/integrations/integration-card.tsx` | Single integration card — name, description, StatusDot, status label, attention note, relative sync time, record count, visual Manage button |
| `src/components/features/integrations/integration-grid.tsx` | Groups integrations by category using `groupIntegrationsByCategory()`; renders category headers with counts and responsive card grids |

### Files Modified

| File | Change |
|------|--------|
| `src/app/(app)/integrations/page.tsx` | Replaced placeholder with full server component: `PageHeader` + `IntegrationGrid`; updated subtitle to spec text |

---

## 6. Quality Gates

| Gate | Result |
|------|--------|
| TypeScript clean (`npx tsc --noEmit`) | PASSED — 0 errors |
| Lint clean (new/modified files) | PASSED — 0 new errors |
| Tests pass (`npm run test`) | PASSED — 101/101 (all existing tests preserved) |
| No raw hex colors | PASSED — grep confirms 0 matches across all 4 new/modified files |
| Existing tests preserved | PASSED — all 101 prior tests still pass |
| Code review | PASSED — no dead code, no hardcoded values, no boundary errors |

---

## 7. P0 Demo Path Coverage

This phase covers the **final stop** on the P0 demo path:

```
... → Ask Inbound → Integrations
```

Specifically:
- Navigate to `/integrations` — page loads instantly (server component, no client JS)
- Website Tracker appears first in the Analytics group with `ring-primary/30` highlight and "Enables person-level journey stitching." note
- All 8 category groups visible: Analytics (5), Advertising (3), Inbound capture (6), CRM (1), Communication (1), Scheduling (1), Content (2), Automation (1)
- Connected integrations (15): green StatusDot, relative sync time, record count
- Attention integrations (2): Meta ("Agency engagement wound down; no active campaigns.") and HubSpot ("Switches off 17 Oct 2026 → Sales Tracker. Journey history preserved.") — yellow StatusDot with attention note
- Disconnected integration (1): PhantomBuster — red StatusDot
- Archived integrations (2): Cal.com and Make.com — muted StatusDot, no sync time
- All 20 integrations displayed with Manage buttons

---

## 8. Seed Data Verification

### Integration Counts by Category

| Category | Expected | Actual | Integrations |
|----------|----------|--------|-------------|
| Analytics | 5 | 5 | Website Tracker, GA4, Google Search Console, Hotjar, Google Business Profile |
| Advertising | 3 | 3 | Google Ads, LinkedIn, Meta |
| Inbound capture | 6 | 6 | Resend, HubSpot, Kit (ConvertKit), Cal.com, Skybox + Trello, PhantomBuster |
| CRM | 1 | 1 | Sales Tracker |
| Communication | 1 | 1 | Email |
| Scheduling | 1 | 1 | Calendar |
| Content | 2 | 2 | Ghost, Buffer |
| Automation | 1 | 1 | Make.com |
| **Total** | **20** | **20** | |

### Status Distribution

| Status | Count | Integrations |
|--------|-------|-------------|
| Connected | 15 | Website Tracker, GA4, Google Search Console, Hotjar, Google Business Profile, Google Ads, LinkedIn, Resend, Kit, Skybox + Trello, Sales Tracker, Email, Calendar, Ghost, Buffer |
| Attention | 2 | Meta, HubSpot |
| Disconnected | 1 | PhantomBuster |
| Archived | 2 | Cal.com, Make.com |

### Website Tracker — Highlight Verification

| Field | Expected | Actual |
|-------|----------|--------|
| Position | First in Analytics | First item in array, first card rendered |
| Highlight ring | `ring-1 ring-primary/30` | Applied via `highlight` prop |
| Journey note | "Enables person-level journey stitching." | Rendered in `text-primary` |
| Status | Connected (green) | `status: "connected"` → StatusDot `connected` |
| Last sync | Relative time | `lastSync: "2026-09-27T11:45:00+02:00"` → "15m ago" |
| Record count | 12,480 | `recordCount: 12480` → "12,480 records" |

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-28 | [x] |
