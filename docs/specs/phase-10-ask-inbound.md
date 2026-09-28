# Specification: Phase 10 — Ask Inbound

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-09-28
**Status:** Implemented
**Tier:** STANDARD
**Build Order Reference:** CLAUDE.md Step 12, `08_BUILD_INSTRUCTIONS` Phase 12

---

## 1. Overview

### 1.1 Summary

Build the **Ask Inbound** page — a conversational intelligence interface where users type natural language queries and receive structured answers with evidence. This is on the **P0 demo path** (`/ask-inbound → "Where did Acme come from?" → evidence → open journey`). The page supports 5 canonical intents matching 00_DECISIONS.md §10.8, with a single-query/single-answer model (not a chatbot).

### 1.2 Goals

- Extend `lib/ask/index.ts` with 3 missing intents (pipeline by source, unattributed opportunities, conversion rate)
- Update `PROMPT_CHIPS` to match the 5 canonical prompts from 00_DECISIONS.md §10.8
- Build `AskPrompt` component with input, submit, and clickable chip suggestions
- Build `AskAnswer` component rendering structured facts, items, and CTAs per answer type
- Build `AskInboundContent` orchestrator managing query→answer state
- Replace placeholder `/ask-inbound` page with full implementation
- Ensure "Open Acme journey →" CTA links to `/leads/person_john_smith`

### 1.3 Non-Goals

- Chat history or conversational thread — single query → single answer
- Natural language processing or LLM-powered answers — pattern matching only
- Fuzzy matching or typo correction — V2
- Saved queries or query history — V2
- Voice input — V2

### 1.4 User Story

As a marketing or revenue leader viewing the Ask Inbound page,
I want to type natural language questions about attribution, pipeline, and leads,
so that I can get structured answers with evidence without navigating multiple pages.

---

## 2. Acceptance Criteria

### AC-001: Prompt input with placeholder and chip suggestions

```gherkin
GIVEN the user navigates to /ask-inbound
WHEN the page renders
THEN a large but restrained input appears with placeholder "Ask about leads, journeys, pipeline or attribution…"
AND 5 suggested prompt chips are shown below the input:
  "Where did Acme come from?"
  "Which channel generated the most pipeline?"
  "Show leads waiting for a reply."
  "What are our biggest unattributed opportunities?"
  "Which source has the highest conversion rate?"
```

**Status:** PASSED — `AskPrompt` renders `Input` with `h-12 text-base` and the specified placeholder. `PROMPT_CHIPS` array from `lib/ask` provides 5 chips rendered as `<button>` elements below the input. Chip order matches spec.

---

### AC-002: Company attribution query (Acme)

```gherkin
GIVEN the user types "Where did Acme come from?"
WHEN they submit
THEN the answer shows:
  - Narrative summary mentioning Google Organic, LinkedIn Organic, Contact Form
  - Structured facts: First Touch = Google Organic, Last Marketing Touch = LinkedIn Organic, Conversion = Direct / Contact Form, Opportunity = €120K · Proposal
  - CTA: "Open Acme Inc journey →" linking to /leads/person_john_smith
```

**Status:** PASSED — `tryCompanyAttribution()` matches via `COMPANY_PATTERNS` regex, resolves Acme → `company_acme`, finds primary contact `person_john_smith`. Attribution touchpoints resolved via `getFirstTouch`, `getLastMarketingTouch`, `getConversionTouch`. Opportunity resolved from `ledger`. CTA rendered via `answer.cta` field with `href: "/leads/person_john_smith"`.

---

### AC-003: Pipeline by source query

```gherkin
GIVEN the user types "Which channel generated the most pipeline?"
WHEN they submit
THEN the answer shows the top pipeline source under First Touch model
AND includes pipeline value (e.g., "Google Organic · €260K open pipeline")
AND lists top sources with their pipeline values
```

**Status:** PASSED — `tryPipelineBySource()` matches via `PIPELINE_PATTERNS` regex. Reuses `getPipelineBySource()` from `lib/metrics/index.ts` (same function the Overview page uses). Top source returned with `formatMoney()` value. All sources listed as items sorted by value descending.

---

### AC-004: Waiting leads query

```gherkin
GIVEN the user types "Show leads waiting for a reply."
WHEN they submit
THEN the answer lists leads whose last communication event is an inbound email with no subsequent outbound
AND shows person name, company, and wait duration
```

**Status:** PASSED — `tryWaitingLeads()` matches via `WAITING_PATTERNS` regex. Groups events by person, finds last `email_received` without subsequent `email_sent`, computes wait duration from `NOW`. Items include `href` linking to lead detail.

---

### AC-005: Unattributed opportunities query

```gherkin
GIVEN the user types "What are our biggest unattributed opportunities?"
WHEN they submit
THEN the answer lists opportunities with unknown first touch
AND shows company name, value, and stage
AND expected: Atlas Systems €180K (Won) · Vector Group €160K (Qualified)
```

**Status:** PASSED — `tryUnattributedOpportunities()` matches via `UNATTRIBUTED_PATTERNS` regex. Filters `ledger` entries where `firstTouchSource === "unknown"`, sorted by value descending. Items render as `"CompanyName · €ValueK"` with stage capitalized.

---

### AC-006: Conversion rate query

```gherkin
GIVEN the user types "Which source has the highest conversion rate?"
WHEN they submit
THEN the answer shows the source with highest lead→opportunity percentage
AND filters for sources with ≥2 leads to avoid noise
AND expected: "Referral (web)" with highest lead→opp conversion
```

**Status:** PASSED — `tryConversionRate()` matches via `CONVERSION_RATE_PATTERNS` regex. Reuses `getAttributionMetrics("first_touch")` from `lib/metrics/attribution-metrics.ts` (same function the Attribution page uses). Filters for `leads >= 2`, sorts by `leadToOppPercent` descending. All eligible sources listed as items with conversion percentages.

---

### AC-007: Unrecognized query shows chips

```gherkin
GIVEN the user types a query that matches no intent
WHEN they submit
THEN the message "This prototype answers these questions:" appears
AND the 5 prompt chips are shown as clickable buttons
```

**Status:** PASSED — `askInbound()` falls through all pattern matchers and returns `promptChipsAnswer()` with `type: "prompt_chips"`, `summary: "This prototype answers these questions:"`. `AskAnswer` component renders chips when `answer.type === "prompt_chips"`, using `onChipClick` callback to submit the selected chip.

---

### AC-008: P0 demo path works

```gherkin
GIVEN the user follows the demo path
WHEN they navigate to /ask-inbound and type "Where did Acme come from?"
THEN the structured answer loads with correct attribution
AND "Open Acme Inc journey →" CTA is clickable
AND CTA navigates to /leads/person_john_smith
```

**Status:** PASSED — Full flow verified: `/ask-inbound` loads → input + 5 chips visible → "Where did Acme come from?" submitted → answer renders with structured facts and CTA → CTA links to `/leads/person_john_smith`.

---

### AC-009: No hex colors, existing tests pass

```gherkin
GIVEN all new/modified files
WHEN verified
THEN zero hex colors, 101 tests pass, tsc clean
```

**Status:** PASSED — `grep '#[0-9a-fA-F]'` returns 0 matches across all new/modified files; 101/101 tests pass; `tsc --noEmit` clean; lint clean on all new/modified files.

---

## 3. Traceability Matrix

| Criterion | Test / Verification | Status |
|-----------|---------------------|--------|
| AC-001 | Code review: `ask-prompt.tsx` — `Input` with placeholder, `PROMPT_CHIPS.map()` renders 5 `<button>` elements; `lib/ask/index.ts` — `PROMPT_CHIPS` array matches spec | PASSED |
| AC-002 | Code review: `lib/ask/index.ts` — `tryCompanyAttribution()` resolves Acme → correct touchpoints; `answer.cta.href` = `/leads/person_john_smith`; `ask-answer.tsx` renders facts grid + CTA button | PASSED |
| AC-003 | Code review: `lib/ask/index.ts` — `tryPipelineBySource()` reuses `getPipelineBySource()`, formats with `formatMoney()`, returns items sorted by value | PASSED |
| AC-004 | Code review: `lib/ask/index.ts` — `tryWaitingLeads()` groups events, finds unanswered inbound emails, computes wait duration; items include `href` to lead detail | PASSED |
| AC-005 | Code review: `lib/ask/index.ts` — `tryUnattributedOpportunities()` filters `ledger` by `firstTouchSource === "unknown"`, sorts by value desc; Atlas Systems €180K and Vector Group €160K appear | PASSED |
| AC-006 | Code review: `lib/ask/index.ts` — `tryConversionRate()` reuses `getAttributionMetrics("first_touch")`, filters `leads >= 2`, sorts by `leadToOppPercent` desc | PASSED |
| AC-007 | Code review: `lib/ask/index.ts` — `promptChipsAnswer()` returns `summary: "This prototype answers these questions:"`; `ask-answer.tsx` — `type === "prompt_chips"` renders chips with `onChipClick` | PASSED |
| AC-008 | Manual verification: `/ask-inbound` → "Where did Acme come from?" → structured answer → CTA → `/leads/person_john_smith` | PASSED |
| AC-009 | `grep '#[0-9a-fA-F]'` — 0 matches; `npm run test` — 101/101; `tsc --noEmit` — clean; `eslint` on new files — clean | PASSED |

---

## 4. Technical Design

### 4.1 Ask Library — Intent Dispatch

**`src/lib/ask/index.ts`**

Dispatch order (priority-based):
1. Company attribution — regex: `/where\s+did\s+(.+?)\s+come\s+from/i` etc.
2. Person query — regex: `/tell\s+me\s+about\s+(.+)/i` etc.
3. Pipeline by source — regex: `/\b(pipeline|channel.*most|most.*pipeline|generated.*pipeline)\b/i`
4. Unattributed opportunities — regex: `/\b(unattributed|unknown)\b/i`
5. Conversion rate — regex: `/\b(conversion\s*rate|highest\s*conversion)\b/i`
6. Waiting leads — regex: `/\b(waiting|reply|response|pending)\b/i`
7. Fallback → prompt chips

Each intent function returns `AskAnswer | null`. First non-null result wins.

### 4.2 AskAnswer Type

```typescript
interface AskAnswer {
  type: "company" | "person" | "waiting" | "pipeline" | "unattributed" | "conversion" | "general" | "prompt_chips";
  title: string;
  summary: string;
  details?: Record<string, string | number | undefined>;
  items?: Array<{ label: string; value: string; href?: string }>;
  cta?: { label: string; href: string };
}
```

Extensions from original:
- Added `"pipeline" | "unattributed" | "conversion"` to type union
- Added `cta` field for call-to-action buttons (label + href)
- Added `href` to items for linking individual list entries

### 4.3 Prompt Chips

```typescript
const PROMPT_CHIPS = [
  { label: "Attribution", value: "Where did Acme come from?" },
  { label: "Pipeline", value: "Which channel generated the most pipeline?" },
  { label: "Waiting", value: "Show leads waiting for a reply." },
  { label: "Unattributed", value: "What are our biggest unattributed opportunities?" },
  { label: "Conversion", value: "Which source has the highest conversion rate?" },
];
```

Exported for reuse in `AskPrompt` component.

### 4.4 Component Architecture

```
src/components/features/ask-inbound/
  ask-prompt.tsx           ← Input + submit button + clickable chips ("use client")
  ask-answer.tsx           ← Renders AskAnswer: facts grid, items list, CTA ("use client")
  ask-inbound-content.tsx  ← Orchestrator: query/answer state management ("use client")
```

### 4.5 AskPrompt

Props: `{ onSubmit: (query: string) => void }`

- `Input` with `h-12 text-base` sizing and specified placeholder
- `Button` with `ArrowRight` icon, disabled when input empty
- Submit on Enter key or button click
- 5 prompt chips as `<button>` elements with `rounded-full border` styling
- Chip click sets input value and auto-submits via `onSubmit(value)`

### 4.6 AskAnswer

Props: `{ answer: AskAnswerType; onChipClick?: (value: string) => void }`

Layout varies by answer type:

**`prompt_chips` type:**
- Summary text + clickable chip buttons (uses `onChipClick` callback)

**All other types:**
```
┌─────────────────────────────────────────┐
│ Title (text-base font-semibold)          │
│ Summary (text-sm text-muted-foreground)  │
│                                          │
│ Structured Facts (grid 2×2 → 4 cols)    │
│ ┌──────────┐ ┌──────────┐               │
│ │ Label    │ │ Label    │               │
│ │ Value    │ │ Value    │               │
│ └──────────┘ └──────────┘               │
│                                          │
│ Items list (justify-between rows)        │
│ Label ............... Value              │
│ Label ............... Value              │
│                                          │
│ [CTA Button →]                           │
└─────────────────────────────────────────┘
```

- Facts grid: `grid-cols-2 sm:grid-cols-4` with label/value in bordered cards
- Items: `<ul>` with `flex justify-between` rows; items with `href` render as `<Link>`
- CTA: `Button variant="outline" size="sm"` wrapping a `<Link>`

### 4.7 AskInboundContent

Orchestrator component managing:
- `answer` state (`AskAnswer | null`, initially `null`)
- `handleSubmit(query)` calls `askInbound(query)` and sets answer
- Renders `AskPrompt` always (top) + `AskAnswer` conditionally (below)
- Passes `handleSubmit` as `onChipClick` to `AskAnswer` for prompt_chips re-submission

### 4.8 Page Composition

```
AskInboundPage (server component)
  └── PageHeader
  │     title: "Ask Inbound"
  │     subtitle: "Ask questions across attribution, accounts, journeys, pipeline and revenue."
  └── AskInboundContent ("use client")
        └── AskPrompt
        └── AskAnswer (conditional)
```

### 4.9 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Single query/answer | No chat history | Spec says intelligence interface, not chatbot; keeps UI simple |
| Client components | `"use client"` on content + children | Needs input state and dynamic answer rendering |
| Server page wrapper | Page imports PageHeader + client content | Keeps server component for layout |
| Extend existing lib/ask | Modify `index.ts` in-place | Already had 3 of 5 intents; added remaining 2+1 |
| Pipeline query | Reuse `getPipelineBySource()` | Same function the Overview page uses |
| Conversion rate | Reuse `getAttributionMetrics("first_touch")` | Same function the Attribution page uses; filter for highest `leadToOppPercent` |
| Min 2 leads filter | Exclude sources with < 2 leads from conversion rate | Avoids noisy 100% conversion from single-lead sources |
| Unattributed | Filter `ledger` by `firstTouchSource === "unknown"` | Simple, direct query on seed data |
| CTA for company | `cta` field with `href` to `/leads/{primaryContactId}` | Spec says "Open Acme journey →" goes to lead detail |
| Prompt chips always visible | Show in AskPrompt above answer | Per spec §15.3, suggested questions always shown |
| Exported PROMPT_CHIPS | `export const` from lib/ask | Shared between library (fallback answer) and component (initial display) |
| No-match message | "This prototype answers these questions:" | Clear expectation-setting for a prototype |

### 4.10 Reused Modules

| Module | Usage |
|--------|-------|
| `lib/ask/index.ts` | `askInbound()`, `AskAnswer` type, `PROMPT_CHIPS` |
| `lib/metrics/index.ts` | `getPipelineBySource()` for pipeline intent |
| `lib/metrics/attribution-metrics.ts` | `getAttributionMetrics("first_touch")` for conversion rate intent |
| `lib/attribution` | `getFirstTouch()`, `getLastMarketingTouch()`, `getConversionTouch()` for company/person intents |
| `lib/config/sources.ts` | `sourceConfig`, `getSourceLabel()` for display labels |
| `lib/formatting/money.ts` | `formatMoney()` for pipeline/opportunity values |
| `lib/config/constants.ts` | `NOW` for wait duration calculation |
| `data/index.ts` | `companies`, `people`, `events`, `ledger` |
| `components/ui/input` | `Input` for query input |
| `components/ui/button` | `Button` for submit and CTA |
| `components/layout/page-header` | `PageHeader` for page title/subtitle |

---

## 5. Files

### Files Created

| File | Purpose |
|------|---------|
| `src/components/features/ask-inbound/ask-prompt.tsx` | Client component: input with placeholder, submit button, 5 clickable prompt chips |
| `src/components/features/ask-inbound/ask-answer.tsx` | Client component: renders structured answer — facts grid, items list, CTA, or prompt chips |
| `src/components/features/ask-inbound/ask-inbound-content.tsx` | Client component: orchestrates query/answer state, connects prompt to answer display |

### Files Modified

| File | Change |
|------|--------|
| `src/lib/ask/index.ts` | Added 3 intents (pipeline, unattributed, conversion rate); extended `AskAnswer` type with `cta`, `href`, and new type variants; updated `PROMPT_CHIPS` to 5 canonical prompts; updated no-match message; updated dispatch order |
| `src/app/(app)/ask-inbound/page.tsx` | Replaced placeholder with server component wrapping `PageHeader` + `AskInboundContent`; updated subtitle to spec text |

---

## 6. Quality Gates

| Gate | Result |
|------|--------|
| TypeScript clean (`npx tsc --noEmit`) | PASSED — 0 errors |
| Lint clean (new/modified files) | PASSED — 0 errors, 0 warnings |
| Tests pass (`npm run test`) | PASSED — 101/101 (all existing tests preserved) |
| No raw hex colors | PASSED — grep confirms 0 matches across all new/modified files |
| Existing tests preserved | PASSED — all 101 prior tests still pass |
| Code review | PASSED — no dead code, no hardcoded values, no boundary errors |

---

## 7. P0 Demo Path Coverage

This phase covers the **Ask Inbound stop** on the P0 demo path:

```
... → Attribution → Ask Inbound → Integrations
```

Specifically:
- Navigate to `/ask-inbound` — page loads with input + 5 prompt chips
- Click "Where did Acme come from?" chip or type it manually
- Structured answer appears: First Touch = Google Organic, Last Marketing Touch = LinkedIn Organic, Conversion = Direct / Contact Form, Opportunity = €120K · Proposal
- "Open Acme Inc journey →" CTA links to `/leads/person_john_smith`
- Unrecognized queries show "This prototype answers these questions:" with 5 chips

---

## 8. Seed Data Verification

### Canonical Query Results

| Query | Expected Answer | Verified |
|-------|-----------------|----------|
| "Where did Acme come from?" | First Touch: Google Organic, Last Marketing Touch: LinkedIn Organic, Conversion: Direct / Contact Form, Opportunity: €120K · Proposal, CTA → `/leads/person_john_smith` | Yes |
| "Which channel generated the most pipeline?" | Google Organic · €260K top source; all sources listed by pipeline value | Yes |
| "Show leads waiting for a reply." | Leads with unanswered inbound emails, with person name, company, and wait duration | Yes |
| "What are our biggest unattributed opportunities?" | Atlas Systems €180K (Won), Vector Group €160K (Qualified) — both `firstTouchSource === "unknown"` | Yes |
| "Which source has the highest conversion rate?" | Referral (web) with highest `leadToOppPercent` among sources with ≥2 leads | Yes |
| "Hello world" (unrecognized) | "This prototype answers these questions:" + 5 chips | Yes |

### Unattributed Opportunities Detail

| Company | Value | Stage | firstTouchSource |
|---------|-------|-------|-----------------|
| Atlas Systems | €180,000 | Won | `unknown` |
| Vector Group | €160,000 | Qualified | `unknown` |

### Company Attribution (Acme) Detail

| Field | Expected | Source |
|-------|----------|--------|
| First Touch | Google Organic | `getFirstTouch("person_john_smith")` |
| Last Marketing Touch | LinkedIn Organic | `getLastMarketingTouch("person_john_smith")` |
| Conversion | Direct / Contact Form | `getConversionTouch("person_john_smith")` |
| Opportunity | €120K · Proposal | `ledger` entry `opp_acme_ai` |
| CTA href | `/leads/person_john_smith` | Primary contact ID |

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | Igor | | [ ] |
| Tech Lead | Alex Chen | 2026-09-28 | [x] |
