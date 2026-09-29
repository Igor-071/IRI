# Specification: Phase 12 — QA / Polish / Playwright Demo Path

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-29
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 14, `08_BUILD_INSTRUCTIONS` Phase 14

---

## 1. Overview

### 1.1 Summary

Phase 12 is the **final build step**. All 11 feature phases are complete. This phase verifies the P0 demo path works end-to-end, fixes one known QA issue (journey table anchor navigation), sets up Playwright for E2E testing, and writes a smoke test that walks the full 10-step management demo without broken or placeholder states.

### 1.2 Goals

- Fix journey table row click navigation: replace `?tab=journey` query param (ignored by the server component) with `#journey` hash anchor (native browser scroll)
- Add `id="journey"` to the journey `<section>` on the lead detail page
- Create `playwright.config.ts` with Chromium-only, sequential, `e2e/` test directory
- Add `test:e2e` npm script
- Exclude `e2e/` from Vitest to prevent Playwright tests from colliding with unit tests
- Write a single sequential Playwright smoke test covering all 10 steps of the P0 demo path
- Verify all existing tests, typecheck, and lint remain green

### 1.3 Non-Goals

- Cross-browser testing — "Skip" for prototype mode per quality gates
- Visual regression screenshots — V2
- Additional E2E tests beyond the P0 demo path — V2
- Adding `data-testid` attributes — semantic selectors sufficient for prototype
- CI integration for Playwright — covered by existing `.github/workflows/quality-gates.yml` when `test:e2e` script is detected

### 1.4 User Story

As a developer or stakeholder running the demo,
I want a single automated test that walks the entire P0 demo path,
so that I can verify no screen is broken before presenting.

---

## 2. Acceptance Criteria

### AC-001: Journey table rows navigate to `#journey` anchor

```gherkin
GIVEN the user is on /journeys
WHEN they click a row in the journey table
THEN navigation goes to /leads/[personId]#journey
AND the browser scrolls to the journey section
```

**Status:** PASSED — `journey-table.tsx:120` changed from `router.push(\`/leads/${row.id}?tab=journey\`)` to `router.push(\`/leads/${row.id}#journey\`)`. Lead detail page `page.tsx:75` now renders `<section id="journey">`. Browser natively scrolls to the hash anchor.

---

### AC-002: Playwright config created with correct settings

```gherkin
GIVEN the project root
WHEN playwright.config.ts is evaluated
THEN testDir is "./e2e"
AND workers is 1
AND fullyParallel is false
AND only Chromium is configured
AND webServer uses "pnpm dev" on port 3000
AND reuseExistingServer is true locally, false in CI
AND trace is "on-first-retry"
```

**Status:** PASSED — `playwright.config.ts` created at root with all specified settings. `reuseExistingServer: !process.env.CI` ensures fresh server in CI.

---

### AC-003: `test:e2e` script added to package.json

```gherkin
GIVEN the developer runs pnpm test:e2e
WHEN Playwright executes
THEN the e2e/demo-path.spec.ts test runs against the local dev server
```

**Status:** PASSED — `package.json` scripts includes `"test:e2e": "playwright test"`.

---

### AC-004: Vitest excludes e2e directory

```gherkin
GIVEN the developer runs pnpm test
WHEN Vitest collects test files
THEN e2e/*.spec.ts files are not included
AND all 101 existing unit tests pass
```

**Status:** PASSED — `vitest.config.ts` updated with `exclude: ["node_modules", "e2e"]`. Running `pnpm test` yields 3 test files, 101 tests passed, 0 failed.

---

### AC-005: Step 1 — Overview page loads with KPIs and recent inbound

```gherkin
GIVEN the test navigates to /overview
WHEN the page renders
THEN the "Overview" h1 heading is visible
AND KPI cards "Inbound Leads", "Open Pipeline", "Won Revenue" are visible in main content
AND the "Recent inbound" table is visible
AND "John Smith" appears in the table
```

**Status:** PASSED — Selectors scoped to `page.getByRole("main")` to avoid collision with sidebar nav link "Inbound Leads".

---

### AC-006: Step 2 — Click John Smith navigates to lead detail

```gherkin
GIVEN the user is on /overview
WHEN they click "John Smith" in the recent inbound table
THEN the URL changes to /leads/person_john_smith
AND the h1 heading shows "John Smith"
AND "VP Product" and "john.smith@acme.com" are visible
```

**Status:** PASSED — Click scoped to `main.getByText("John Smith").first()`. `waitForURL` confirms route change.

---

### AC-007: Step 3 — Attribution section with Why? dialog

```gherkin
GIVEN the user is on John Smith's lead detail
WHEN they view the Attribution section
THEN "Google Organic", "LinkedIn Organic", and "Contact Form" are visible
AND clicking the first "Why?" button opens an evidence dialog
AND closing the dialog makes it disappear
```

**Status:** PASSED — Three touchpoint values verified. Dialog opened via `getByRole("button", { name: /Why\?/ }).first()`, verified visible with "Evidence" text, closed via dialog close button.

---

### AC-008: Step 4 — Customer journey section visible

```gherkin
GIVEN the user is on John Smith's lead detail
WHEN they scroll to the journey section
THEN the "Customer journey" h2 heading is visible
AND text matching "Journey assembled from" is visible
```

**Status:** PASSED — Both heading and source system text verified via getByRole and getByText.

---

### AC-009: Step 5 — Opportunity visible in sidebar

```gherkin
GIVEN the user is on John Smith's lead detail
WHEN the sidebar renders
THEN "AI Transformation Platform" is visible
```

**Status:** PASSED — `page.getByText("AI Transformation Platform", { exact: true })` avoids collision with the engagement summary text that contains the same name with additional context.

---

### AC-010: Step 6 — Acme Inc account detail

```gherkin
GIVEN the user is on John Smith's lead detail
WHEN they click the "Acme Inc" link
THEN the URL changes to /accounts/company_acme
AND the h1 heading shows "Acme Inc"
AND the "Known Contacts" h2 section is visible
```

**Status:** PASSED — Link click via `getByRole("link", { name: "Acme Inc" }).first()`. Heading and section verified.

---

### AC-011: Step 7 — Attribution page with tab switching

```gherkin
GIVEN the user navigates to /attribution via sidebar
WHEN the page renders
THEN the "First Touch" tab is selected (aria-selected="true")
AND clicking "Conversion Touch" updates URL to contain model=conversion_touch
AND clicking "Last Marketing Touch" updates URL to contain model=last_touch
AND clicking "First Touch" updates URL to contain model=first_touch
```

**Status:** PASSED — Tab elements located via `getByRole("tab")`. `aria-selected` attribute verified. URL assertions use regex matching on model param.

---

### AC-012: Step 8 — Unknown row click shows Vector Group in drilldown

```gherkin
GIVEN the user is on /attribution with First Touch model
WHEN they click the table row containing "Unknown"
THEN the source drilldown panel appears
AND "Vector Group" is visible in the drilldown
```

**Status:** PASSED — Row located via `page.locator("table tbody tr").filter({ hasText: "Unknown" })`. After click, drilldown card renders with "Vector Group" text.

---

### AC-013: Step 9 — Ask Inbound with Acme chip

```gherkin
GIVEN the user navigates to /ask-inbound via sidebar
WHEN they click the "Where did Acme come from?" chip
THEN "Attribution for Acme Inc" appears as the answer title
AND a link matching "Open Acme Inc journey" is visible
```

**Status:** PASSED — Chip located via `getByRole("button")`. Answer title and CTA link verified.

---

### AC-014: Step 10 — Integrations page with Website Tracker

```gherkin
GIVEN the user navigates to /integrations via sidebar
WHEN the page renders
THEN "Website Tracker" is visible
AND at least one "Connected" status badge is visible
```

**Status:** PASSED — Final step of the demo path. Both text assertions pass.

---

### AC-015: All existing tests and checks remain green

```gherkin
GIVEN all changes in this phase
WHEN verification runs
THEN pnpm test passes (101 tests, 3 files)
AND pnpm typecheck passes (0 errors)
AND pnpm lint has 0 new errors in changed files
AND pnpm test:e2e passes (1 test)
```

**Status:** PASSED — `pnpm test`: 101/101 pass. `pnpm typecheck`: 0 errors. `pnpm lint`: 0 errors in new/modified source files (existing `.next/` cache noise unrelated). `pnpm test:e2e`: 1/1 pass (2.6s).

---

## 3. Traceability Matrix

| Criterion | Test / Verification | Status |
|-----------|---------------------|--------|
| AC-001 | Code review: `journey-table.tsx:120` — `#journey` hash; `page.tsx:75` — `<section id="journey">` | PASSED |
| AC-002 | Code review: `playwright.config.ts` — testDir, workers, fullyParallel, Chromium-only, webServer, trace | PASSED |
| AC-003 | Code review: `package.json` — `"test:e2e": "playwright test"` | PASSED |
| AC-004 | Code review: `vitest.config.ts` — `exclude: ["node_modules", "e2e"]`; `pnpm test` — 101/101, 3 files | PASSED |
| AC-005 | E2E: `demo-path.spec.ts` Step 1 — Overview h1, KPI cards in main, Recent inbound, John Smith | PASSED |
| AC-006 | E2E: `demo-path.spec.ts` Step 2 — Click John Smith, URL /leads/person_john_smith, heading, title, email | PASSED |
| AC-007 | E2E: `demo-path.spec.ts` Step 3 — Attribution sources, Why? dialog open/close | PASSED |
| AC-008 | E2E: `demo-path.spec.ts` Step 4 — Customer journey heading, "Journey assembled from" text | PASSED |
| AC-009 | E2E: `demo-path.spec.ts` Step 5 — "AI Transformation Platform" exact text | PASSED |
| AC-010 | E2E: `demo-path.spec.ts` Step 6 — Acme Inc link, URL /accounts/company_acme, heading, Known Contacts | PASSED |
| AC-011 | E2E: `demo-path.spec.ts` Step 7 — Attribution tabs aria-selected, URL model params | PASSED |
| AC-012 | E2E: `demo-path.spec.ts` Step 8 — Unknown row click, Vector Group in drilldown | PASSED |
| AC-013 | E2E: `demo-path.spec.ts` Step 9 — Ask Inbound chip, answer title, CTA link | PASSED |
| AC-014 | E2E: `demo-path.spec.ts` Step 10 — Website Tracker, Connected badge | PASSED |
| AC-015 | `pnpm test` — 101/101; `pnpm typecheck` — 0 errors; `pnpm lint` — 0 new errors; `pnpm test:e2e` — 1/1 | PASSED |

---

## 4. Technical Design

### 4.1 QA Fix — Journey Anchor Navigation

**Problem:** Journey table rows navigated to `/leads/[id]?tab=journey`, but the lead detail page is a server component that does not read the `tab` search param. The journey section was not scrolled to.

**Solution:** Two-line fix using native browser hash anchor:

1. `src/app/(app)/leads/[id]/page.tsx:75` — Add `id="journey"` to the journey `<section>` element
2. `src/components/features/journeys/journey-table.tsx:120` — Change `?tab=journey` → `#journey`

The browser natively scrolls to `#journey` on navigation. No new client components or state management needed.

### 4.2 Playwright Configuration

**`playwright.config.ts`** at project root:

| Setting | Value | Rationale |
|---------|-------|-----------|
| `testDir` | `"./e2e"` | Separates from Vitest `tests/`; Playwright convention |
| `workers` | `1` | Demo path is a single sequential narrative |
| `fullyParallel` | `false` | Steps depend on prior navigation state |
| `retries` | `0` | Prototype mode — fail fast |
| `reporter` | `"html"` | Rich failure reports with screenshots |
| `trace` | `"on-first-retry"` | Captures trace on failures for debugging |
| `projects` | Chromium only | Cross-browser is "Skip" for prototype quality gates |
| `webServer.command` | `"pnpm dev"` | Starts the Next.js dev server |
| `webServer.reuseExistingServer` | `!process.env.CI` | Reuse running server locally; fresh server in CI |

### 4.3 Vitest Exclusion

`vitest.config.ts` updated with `exclude: ["node_modules", "e2e"]` to prevent Vitest from collecting Playwright spec files. Without this, Vitest would attempt to run `e2e/demo-path.spec.ts` and fail because Playwright's `test()` function is not compatible with Vitest's test runner.

### 4.4 Demo Path Smoke Test

**`e2e/demo-path.spec.ts`** — Single sequential test covering the 10-step P0 demo path:

| Step | Route | Navigation | Key Assertions |
|------|-------|------------|----------------|
| 1 | `/overview` | Direct navigation | Overview h1, KPI cards (Inbound Leads, Open Pipeline, Won Revenue), Recent inbound table, John Smith row |
| 2 | `/leads/person_john_smith` | Click John Smith in table | h1 "John Smith", "VP Product", "john.smith@acme.com" |
| 3 | Same page | Scroll/view | Attribution h2, Google Organic, LinkedIn Organic, Contact Form, Why? dialog open/close |
| 4 | Same page | Scroll/view | Customer journey h2, "Journey assembled from" text |
| 5 | Same page | Sidebar view | "AI Transformation Platform" (exact match) |
| 6 | `/accounts/company_acme` | Click Acme Inc link | h1 "Acme Inc", Known Contacts h2 |
| 7 | `/attribution` | Sidebar nav | First Touch tab selected, tab switching updates URL params |
| 8 | Same page | Click Unknown row | Vector Group in drilldown panel |
| 9 | `/ask-inbound` | Sidebar nav | Ask Inbound h1, chip click, "Attribution for Acme Inc" answer, CTA link |
| 10 | `/integrations` | Sidebar nav | "Website Tracker", "Connected" badge |

### 4.5 Selector Strategy

| Strategy | Usage | Rationale |
|----------|-------|-----------|
| `getByRole("heading")` | Page and section headings | Semantic, accessible |
| `getByRole("link")` | Navigation links | Reliable for `<a>` elements |
| `getByRole("tab")` | Attribution model tabs | Uses `role="tab"` with `aria-selected` |
| `getByRole("button")` | Why? buttons, Ask Inbound chips | Semantic button elements |
| `getByRole("dialog")` | Evidence dialog | Radix dialog has `role="dialog"` |
| `getByRole("main")` | Scoping to main content | Avoids sidebar nav text collisions |
| `getByText()` | Content verification | Text-based for data-driven content |
| `.first()` | Disambiguation | Used when multiple elements match (e.g., "Google Organic" appears in multiple places) |
| `locator().filter()` | Table row selection | Locates specific rows by text content |

### 4.6 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Anchor fix | `#journey` hash | Zero-dependency, native browser scroll, 2-line change |
| Test dir | `e2e/` | Separates from Vitest `tests/`; Playwright convention |
| Browser | Chromium only | Cross-browser is "Skip" for prototype quality gates |
| Test structure | Single sequential test | Demo path is a narrative walkthrough; splitting loses navigation state |
| Selectors | Text + role-based | No `data-testid` in prototype; semantic selectors sufficient and more readable |
| Scoping | `getByRole("main")` | Prevents sidebar nav text from causing strict mode violations |
| Vitest exclusion | `exclude: ["node_modules", "e2e"]` | Prevents Playwright's `test()` from being collected by Vitest |
| webServer | `pnpm dev` with `reuseExistingServer` | Fast local runs with existing server; clean server in CI |

---

## 5. Files

### Files Created

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Playwright config: Chromium-only, `e2e/` test dir, sequential workers, webServer with dev server |
| `e2e/demo-path.spec.ts` | P0 demo path smoke test — 10-step sequential walkthrough of the full management demo |

### Files Modified

| File | Change |
|------|--------|
| `package.json` | Added `"test:e2e": "playwright test"` script |
| `vitest.config.ts` | Added `exclude: ["node_modules", "e2e"]` to prevent Playwright test collection |
| `src/app/(app)/leads/[id]/page.tsx` | Added `id="journey"` to journey `<section>` element (line 75) |
| `src/components/features/journeys/journey-table.tsx` | Changed `?tab=journey` to `#journey` in `router.push` call (line 120) |

---

## 6. Quality Gates

| Gate | Result |
|------|--------|
| TypeScript clean (`pnpm typecheck`) | PASSED — 0 errors |
| Lint clean (new/modified source files) | PASSED — 0 new errors |
| Tests pass (`pnpm test`) | PASSED — 101/101 (3 files, all existing tests preserved) |
| E2E test pass (`pnpm test:e2e`) | PASSED — 1/1 (2.6s, Chromium) |
| No raw hex colors | PASSED — 0 matches across all new/modified files |
| Code review | PASSED — no dead code, no hardcoded values, no boundary errors |

---

## 7. P0 Demo Path Coverage

This phase provides **automated verification** of the complete P0 demo path defined in CLAUDE.md:

```
Overview → John Smith / Acme → Attribution Summary → Why? →
Customer Journey → Acme Account → Attribution (First → Conversion →
Last Marketing Touch) → Unknown row → Vector Group →
Ask Inbound → Integrations
```

Every step is covered by assertions in `e2e/demo-path.spec.ts`. The test runs in under 3 seconds against the local dev server.

### Step-by-Step Mapping

| Demo Path Step | Spec Step | Route | AC |
|----------------|-----------|-------|----|
| Overview | Step 1 | `/overview` | AC-005 |
| John Smith / Acme | Step 2 | `/leads/person_john_smith` | AC-006 |
| Attribution Summary | Step 3 | Same page | AC-007 |
| Why? | Step 3 | Dialog | AC-007 |
| Customer Journey | Step 4 | Same page | AC-008 |
| Acme Account | Steps 5-6 | `/accounts/company_acme` | AC-009, AC-010 |
| Attribution (tab switching) | Step 7 | `/attribution` | AC-011 |
| Unknown row → Vector Group | Step 8 | Same page | AC-012 |
| Ask Inbound | Step 9 | `/ask-inbound` | AC-013 |
| Integrations | Step 10 | `/integrations` | AC-014 |

---

## 8. Definition of Done — Final Assessment

Per CLAUDE.md, the prototype is ready when:

| Criterion | Status |
|-----------|--------|
| All P0 flows work | PASSED — E2E test covers full demo path |
| Derived data matches validation targets in 00_DECISIONS.md §14 | PASSED — all phases verified against seed data |
| Hero journeys are correct | PASSED — John Smith (Full), Vector Group (Unknown), Atlas Systems (Partial) |
| Navigation/filters/search work | PASSED — sidebar nav, table row clicks, search, URL filters all functional |
| Visual rules are consistent | PASSED — semantic tokens, no hex colors, dark-first theme |
| Full management demo runs without broken or placeholder states | PASSED — automated E2E test completes in 2.6s |

---

## 9. Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-29 | [x] |
