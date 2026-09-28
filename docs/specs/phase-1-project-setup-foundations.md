# Specification: Phase 1 — Project Setup & Foundations

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-27
**Status:** Draft
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Phases 1–2, `08_BUILD_INSTRUCTIONS` §52 Phases 0–1

---

## 1. Overview

### 1.1 Summary

Restructure the MOP foundation scaffold into the IRI prototype architecture. This phase delivers: a renamed and cleaned project, the complete dark theme token system, all TypeScript types, configuration constants, formatting utilities, the application shell (sidebar, global header, page layouts), and stub pages for every route. No seed data, no business logic, no feature UI — just the architectural skeleton that every subsequent phase builds on.

### 1.2 Goals

- Clean MOP boilerplate and rename project to `iri`
- Install missing dependencies (Recharts, Vitest, Playwright)
- Restructure `src/components/` from atoms/molecules/organisms/views to `ui/domain/features/layout` per `00 §12`
- Implement dark theme tokens mapped to shadcn variables per `00 §12.3` and `05_DESIGN_SYSTEM`
- Load Inter font with tabular numerals support
- Define all TypeScript types from `03_DATA_MODEL`
- Create all config files (NOW constant, sources, stages, event types, owners)
- Create formatting utilities (money, dates, duration)
- Build application shell: AppShell, Sidebar, GlobalHeader, PageHeader
- Create stub pages for all 9 routes
- Root `/` redirects to `/overview`

### 1.3 Non-Goals

- Seed data generation (Phase 3)
- Business logic / attribution / metrics (Phase 4)
- Feature components or screen UI (Phases 5–12)
- DataTable, JourneyTimeline, charts (Phase 5)
- Vitest or Playwright test suites (Phase 3–4, written alongside logic)

### 1.4 User Story

As a developer starting Phase 2,
I want a clean project skeleton with typed configs, themed shell, and all routes,
so that I can immediately begin writing seed data and business logic without architectural decisions.

---

## 2. Acceptance Criteria

### AC-001: Project identity and dependencies

GIVEN the MOP foundation scaffold exists
WHEN Phase 1 is complete
THEN `package.json` name is `iri`
  AND Recharts, Vitest, and Playwright are installed
  AND MOP boilerplate components are removed (forms-showcase, invoice-form, newsletter-form, profile-form, admin-page, home-page, server/client demo components)
  AND `src/lib/actions.ts`, `src/lib/schemas.ts`, `src/providers/global-state-provider.tsx` are removed
  AND `npm run dev` starts without errors
  AND `npm run build` succeeds
  AND `npm run lint` is clean

---

### AC-002: Component folder structure

GIVEN the project has been restructured
WHEN I inspect `src/components/`
THEN the structure is:
```
components/
  ui/          (shadcn primitives only — button, card, input, etc.)
  domain/      (empty, ready for Phase 5)
  features/    (empty, ready for Phase 6+)
  layout/      (AppShell, Sidebar, GlobalHeader, PageHeader)
```
  AND the old `atoms/`, `molecules/`, `organisms/`, `views/` folders are gone
  AND dependency direction is enforced: layout imports from ui only, nothing imports upward

---

### AC-003: Dark theme tokens

GIVEN `globals.css` has been updated
WHEN the app loads in a browser
THEN the theme is dark by default (dark background, light text)
  AND semantic CSS variables are defined per `00 §12.3`:
    `--background` maps to MOP Dark (#161010 / oklch equivalent)
    `--foreground` maps to White (#FFFFFF)
    `--primary` maps to MOP Red (#F24B57)
    `--muted` maps to MOP Dark Gray (#252525)
    `--border` maps to a subtle border tone
    `--accent` maps to MOP Dessert (#DDC1B2)
  AND chart colors are defined (chart-1 through chart-5)
  AND source-specific semantic colors are defined for the 8 acquisition sources
  AND status colors are mapped: `--success` (#74C324), `--warning` (#F8A20D), `--destructive` (#E20B0B)
  AND no raw hex values appear in any component JSX (only semantic classes)

---

### AC-004: Inter font with tabular numerals

GIVEN the layout.tsx configures Inter via `next/font/google`
WHEN numeric values are rendered (KPIs, money, percentages)
THEN the font is Inter
  AND a `tabular-nums` CSS utility class is available for numeric display

---

### AC-005: TypeScript types

GIVEN `src/types/` directory exists
WHEN I inspect the type definitions
THEN the following types/interfaces are defined per `03_DATA_MODEL`:
  - `Person` (id, name, email, title, companyId, ownerId, displayStage, createdAt, etc.)
  - `Company` (id, name, domain, industry, size, location, ownerId, etc.)
  - `Session` (id, personId, source, medium, startedAt, landingPage, referrer, etc.)
  - `Event` (id, personId, sessionId, type, category, timestamp, metadata, sourceSystem, etc.)
  - `Opportunity` (id, companyId, primaryContactId, name, value, stage, ownerId, expectedClose, etc.)
  - `Campaign` (id, name, source, status, startDate, endDate, etc.)
  - `Integration` (id, name, category, status, lastSync, recordCount, etc.)
  - `RelationshipAttribution` (personId, type, referrerName, referrerCompany, etc.)
  - `Touchpoint` (derived — not stored, used as return type of deriveTouchpoints)
  - `Workspace`, `User`
  AND enum/union types exist for: `AcquisitionSource`, `ConversionMechanism`, `OpportunityStage`, `DisplayStage`, `AttributionStatus`, `AttributionModel`, `EventType`, `EventCategory`, `IntegrationCategory`, `IntegrationStatus`
  AND all types compile without errors

---

### AC-006: Configuration constants

GIVEN `src/lib/config/` directory exists
WHEN I inspect the config files
THEN `constants.ts` exports:
  - `NOW` as `new Date('2026-09-27T12:00:00+02:00')`
  - `TIMEZONE` as `'Europe/Sarajevo'`
  - `LOCALE` as `'en-GB'`
  - `CURRENCY` as `'EUR'`
  - `WORKSPACE_NAME` as `'Ministry of Programming'`
  AND `sources.ts` exports the canonical source config map (9 sources: google_organic through unknown) with label, icon component, and semantic color class per `00 §4`
  AND `stages.ts` exports opportunity stages (Discovery through Lost) and display stages (New through Disqualified) with labels and colors
  AND `event-types.ts` exports event type config with category, importance level, label, and icon
  AND `owners.ts` exports the 3 owners + Marketing Team + Unassigned per `00 §3.3`

---

### AC-007: Formatting utilities

GIVEN `src/lib/formatting/` directory exists
WHEN I call the formatting functions
THEN `formatMoney(120000)` returns `'€120K'`
  AND `formatMoneyFull(120000)` returns `'€120,000'`
  AND `formatPercent(0.325)` returns `'32.5%'`
  AND `formatDate(date)` returns a locale-consistent string using LOCALE and TIMEZONE (never `Date.now()`)
  AND `formatRelativeDate(date)` returns relative strings like `'2h ago'`, `'3d ago'` relative to NOW
  AND `formatDuration(minutes)` returns `'17m'`, `'2h 18m'`, `'3d 6h'` as appropriate

---

### AC-008: Application shell — Sidebar

GIVEN the app renders at `/overview`
WHEN I view the sidebar
THEN it displays the IRI logo/wordmark at the top
  AND navigation items are listed in order: Overview, Inbound Leads, Accounts, Attribution, Journeys, Integrations
  AND "Ask Inbound" appears as a separate secondary section below the main nav
  AND the active route is visually highlighted
  AND the workspace name "Ministry of Programming" appears at the bottom with "Sample data" badge
  AND user avatar/initials area appears at the bottom
  AND Settings is NOT present (removed per `00 §10.2`)

---

### AC-009: Application shell — Global Header

GIVEN any page is loaded
WHEN I view the global header bar
THEN it contains a page title area (left)
  AND a global search input (center/right) with placeholder "Search leads, companies or emails..."
  AND a notification icon (visual only)
  AND a user avatar/initials (visual only)
  AND no "Sample data" badge (it's in the sidebar per Resolution D)

---

### AC-010: Application shell — PageHeader

GIVEN a page uses the PageHeader layout component
WHEN the page renders
THEN it shows the page title and optional subtitle
  AND optionally shows a DateRangeSelector (for Overview and Attribution only)
  AND optionally shows action buttons (e.g. Export)

---

### AC-011: Route stubs and root redirect

GIVEN the app is running
WHEN I navigate to `/`
THEN I am redirected to `/overview`
  AND the following routes render stub pages with their title:
  - `/overview` → "Overview"
  - `/leads` → "Inbound Leads"
  - `/leads/[id]` → "Lead Detail"
  - `/accounts` → "Accounts"
  - `/accounts/[id]` → "Account Detail"
  - `/attribution` → "Attribution"
  - `/journeys` → "Journeys"
  - `/integrations` → "Integrations"
  - `/ask-inbound` → "Ask Inbound"
  AND navigating to an unknown route shows a not-found page with "Record not found" message and a link back
  AND all stub pages render inside the AppShell (sidebar + header visible)

---

### AC-012: No hydration mismatches

GIVEN the app is running in development mode
WHEN I navigate through all routes
THEN no hydration mismatch warnings appear in the console
  AND no `Date.now()` or `new Date()` (without fixed argument) calls exist in app code
  AND all date formatting uses the NOW constant and fixed LOCALE/TIMEZONE

---

## 3. Traceability Matrix

| Criterion | Test File | Test Name | Status |
|-----------|-----------|-----------|--------|
| AC-001 | manual | `npm run dev`, `npm run build`, `npm run lint` | ⏳ |
| AC-002 | manual | folder inspection | ⏳ |
| AC-003 | manual | visual check in browser | ⏳ |
| AC-004 | manual | visual check in browser | ⏳ |
| AC-005 | `npm run typecheck` | TypeScript compilation | ⏳ |
| AC-006 | `npm run typecheck` | TypeScript compilation | ⏳ |
| AC-007 | `tests/formatting.test.ts` | unit tests | ⏳ |
| AC-008 | manual | visual check in browser | ⏳ |
| AC-009 | manual | visual check in browser | ⏳ |
| AC-010 | manual | visual check in browser | ⏳ |
| AC-011 | manual | navigation through all routes | ⏳ |
| AC-012 | manual | console check for hydration warnings | ⏳ |

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## 4. Technical Design

### 4.1 Files to Create or Modify

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Rename to `iri`, add recharts, vitest, playwright |
| `src/app/globals.css` | Modify | Dark theme tokens per 00 §12.3 |
| `src/app/layout.tsx` | Modify | Inter font, remove GlobalStateProvider, AppShell wrapper |
| `src/app/page.tsx` | Modify | Redirect to /overview |
| `src/app/not-found.tsx` | Create | Not-found page |
| `src/app/overview/page.tsx` | Create | Stub |
| `src/app/leads/page.tsx` | Create | Stub |
| `src/app/leads/[id]/page.tsx` | Create | Stub |
| `src/app/accounts/page.tsx` | Create | Stub |
| `src/app/accounts/[id]/page.tsx` | Create | Stub |
| `src/app/attribution/page.tsx` | Create | Stub |
| `src/app/journeys/page.tsx` | Create | Stub |
| `src/app/integrations/page.tsx` | Create | Stub |
| `src/app/ask-inbound/page.tsx` | Create | Stub |
| `src/types/index.ts` | Create | All type exports |
| `src/types/person.ts` | Create | Person, DisplayStage |
| `src/types/company.ts` | Create | Company |
| `src/types/session.ts` | Create | Session |
| `src/types/event.ts` | Create | Event, EventType, EventCategory |
| `src/types/opportunity.ts` | Create | Opportunity, OpportunityStage |
| `src/types/campaign.ts` | Create | Campaign |
| `src/types/integration.ts` | Create | Integration, IntegrationCategory, IntegrationStatus |
| `src/types/attribution.ts` | Create | Touchpoint, RelationshipAttribution, AttributionStatus, AttributionModel, AcquisitionSource, ConversionMechanism |
| `src/types/workspace.ts` | Create | Workspace, User |
| `src/lib/config/constants.ts` | Create | NOW, TIMEZONE, LOCALE, CURRENCY, WORKSPACE_NAME |
| `src/lib/config/sources.ts` | Create | Source config map |
| `src/lib/config/stages.ts` | Create | Stage config maps |
| `src/lib/config/event-types.ts` | Create | Event type config |
| `src/lib/config/owners.ts` | Create | Owner definitions |
| `src/lib/formatting/money.ts` | Create | formatMoney, formatMoneyFull |
| `src/lib/formatting/dates.ts` | Create | formatDate, formatRelativeDate |
| `src/lib/formatting/duration.ts` | Create | formatDuration |
| `src/lib/formatting/percent.ts` | Create | formatPercent |
| `src/lib/formatting/index.ts` | Create | Re-exports |
| `src/components/layout/app-shell.tsx` | Create | Main layout wrapper |
| `src/components/layout/sidebar.tsx` | Create | Navigation sidebar |
| `src/components/layout/global-header.tsx` | Create | Top header bar |
| `src/components/layout/page-header.tsx` | Create | Page title + actions |
| `src/components/layout/index.ts` | Create | Re-exports |
| `tests/formatting.test.ts` | Create | Formatting utility tests |
| `vitest.config.ts` | Create | Vitest configuration |

### 4.1b Files to Delete

| File | Reason |
|------|--------|
| `src/components/ui/atoms/` | Flatten into `src/components/ui/` |
| `src/components/ui/molecules/` | MOP boilerplate — remove entirely |
| `src/components/ui/organisms/` | MOP boilerplate — remove entirely |
| `src/components/views/` | MOP boilerplate — remove entirely |
| `src/lib/actions.ts` | MOP server actions — not needed |
| `src/lib/schemas.ts` | MOP form schemas — not needed |
| `src/providers/global-state-provider.tsx` | MOP provider — not needed |

### 4.2 State Management

No application-level state management in Phase 1. URL query parameters will be used for filter state in later phases. Sidebar active state is derived from the current pathname via `usePathname()`.

---

## 5. UI/UX Requirements

### 5.1 Desktop (1280–1600px, primary target)

- Sidebar: fixed, ~240px wide
- Content area: fluid, fills remaining width
- Header: sticky top

### 5.2 Responsive (< 1280px)

- Sidebar: collapsible to icon-only (~64px) — implementation can be deferred to Phase 14 (QA/Polish)

### 5.3 Visual Character (from `08 §11`)

- Dark-first, warm, premium, restrained, data-dense
- No gradients, neon, glassmorphism, oversized cards
- Typography-led, thin borders, structured spacing

### 5.4 Accessibility

- Semantic HTML (`nav`, `main`, `header`)
- Focus states on all interactive elements
- Keyboard navigation through sidebar items
- Adequate contrast on dark background

---

## 6. Error Handling

| Error Scenario | User Message | Technical Handling |
|----------------|--------------|-------------------|
| Unknown route | "Record not found. The requested lead or account is not available." | `not-found.tsx` with link to Overview |

---

## 7. Performance Considerations

- Inter font loaded via `next/font/google` (self-hosted, no CLS)
- No client components in shell except Sidebar (needs `usePathname`)
- Stub pages are Server Components

---

## 8. Dependencies

### 8.1 New Dependencies

- `recharts` — charts (used in Phase 6+)
- `vitest` + `@vitest/ui` — unit testing (used from Phase 3)
- `@playwright/test` — E2E testing (used in Phase 14)

### 8.2 Keep from MOP Foundation

- `next` 16.3.5, `react` 19.3.0, `typescript` 5.9.3
- `tailwindcss` 4.3.3, `@tailwindcss/postcss`
- `lucide-react`
- `@radix-ui/*` (via shadcn)
- `class-variance-authority`, `clsx`, `tailwind-merge`
- ESLint, Prettier, Husky, lint-staged

---

## 9. Open Questions

None — all resolved via contradiction resolutions and `00_DECISIONS.md`.

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-27 | [x] |
