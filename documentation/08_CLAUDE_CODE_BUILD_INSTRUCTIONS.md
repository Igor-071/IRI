# Inbound Revenue Intelligence
## CLAUDE_CODE_BUILD_INSTRUCTIONS.md
### v0.2

> **v0.2 — amended by `00_DECISIONS.md`.** Where this document conflicts with `00_DECISIONS.md`, `00_DECISIONS.md` wins. Figures that do not appear in `00_DECISIONS.md` or `04_SEED_DATA_SPECIFICATION.md` are illustrative and must not be seeded.

## 1. Purpose

This document is the primary execution guide for Claude Code.

Claude Code should use this document together with the following authoritative product documents:

```text
00_DECISIONS.md
01_PRODUCT_BRIEF.md
02_PROTOTYPE_REQUIREMENTS.md
03_DATA_MODEL_EVENT_TAXONOMY.md
04_SEED_DATA_SPECIFICATION.md
05_DESIGN_SYSTEM.md
06_SCREEN_SPECIFICATIONS.md
07_USER_FLOWS.md
```

The goal is to build a high-fidelity functional prototype of the Inbound Revenue Intelligence platform.

This prototype is intended for internal management presentation.

It must feel like a credible production product while using deterministic seeded data rather than live integrations.

---

# 2. Source-of-Truth Hierarchy

When requirements overlap or appear ambiguous, use this priority order (00_DECISIONS.md §0):

1. `00_DECISIONS.md` — rules, metric definitions, targets, scope, architecture
2. `03_DATA_MODEL_EVENT_TAXONOMY.md` — types, events, attribution logic
3. `04_SEED_DATA_SPECIFICATION.md` — canonical records and hero journeys
4. `05_DESIGN_SYSTEM.md` — visual and component rules
5. `06_SCREEN_SPECIFICATIONS.md` — screen composition
6. `07_USER_FLOWS.md` — navigation and interaction behavior
7. `02_PROTOTYPE_REQUIREMENTS.md` — functional scope
8. `01_PRODUCT_BRIEF.md` — product intent and positioning only
9. this document — build sequencing and implementation rules

Any figure outside `00` and `04` is illustrative. Never seed it.

Do not invent alternative product behavior when documentation already defines it.

If an implementation detail is missing, choose the simplest solution consistent with the product architecture.

---

# 3. Product Goal

Build a prototype that demonstrates:

> **One explainable customer journey connecting anonymous marketing activity with known people, companies, opportunities and revenue.**

The prototype must make it possible to answer:

- Where did this lead come from?
- What happened before conversion?
- What happened after conversion?
- Which channel influenced the opportunity?
- Which sources generate pipeline?
- Which sources generate revenue?
- What attribution data is missing?
- Why is a particular opportunity attributed to a source?

The product should not feel like:

- another CRM,
- another generic analytics dashboard,
- an AI chatbot with charts,
- a marketing landing page.

---

# 4. Technical Stack

Use:

- Next.js
- TypeScript
- App Router
- React Server Components where appropriate
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Recharts
- Vitest and Playwright
- deterministic local TypeScript seed data

Pin exact versions in `package.json` at project creation. Use Tailwind CSS v4.

Optional:

- lightweight client-side state management if required

Do NOT add:

- Supabase
- PostgreSQL
- authentication
- external APIs
- OAuth
- live integrations
- paid services

unless explicitly requested later.

The prototype should remain self-contained.

---

# 5. Next.js Requirements

Use the current stable Next.js App Router architecture.

Preferred patterns:

- Server Components for mostly static/read-only screens
- Client Components only where interaction requires them
- URL query parameters for meaningful filter state
- reusable data access helpers
- reusable domain logic
- layouts for shared shell

Avoid turning the entire application into a client component.

In Next.js 15+ `searchParams` is async — await it in pages.

Use the fixed `NOW` constant (00_DECISIONS.md §1). Never call `Date.now()` in app code; format dates with fixed locale and time zone to avoid hydration mismatches.

---

# 6. Recommended Project Structure

Use a clear separation between:

- routing,
- design-system components,
- domain components,
- seed data,
- business logic,
- formatting,
- configuration.

Recommended (00_DECISIONS.md §12.1):

```text
app/
  layout.tsx
  page.tsx                 → redirect to /overview
  not-found.tsx
  overview/page.tsx
  leads/page.tsx
  leads/[id]/page.tsx
  accounts/page.tsx
  accounts/[id]/page.tsx
  attribution/page.tsx
  journeys/page.tsx        (P2)
  integrations/page.tsx
  ask-inbound/page.tsx

components/
  ui/                      shadcn primitives + generic DataTable
  domain/                  PersonIdentity, CompanyIdentity, SourceBadge, StageBadge,
                           OwnerChip, AttributionStatus, OpportunityValue,
                           MoneyValue, DateTime, SourceSystemChip
  features/
    overview/  leads/  accounts/  attribution/  journey/
    integrations/  ask-inbound/  search/
  layout/                  AppShell, Sidebar, GlobalHeader, PageHeader,
                           ListLayout, RecordDetailLayout, AnalyticsLayout

data/
  ledger.ts                opportunity ledger (00 §9.2)
  heroes/                  hand-written hero records
  generated/               checked-in generator output

lib/
  attribution/             derive-touchpoints.ts, models.ts, status.ts,
                           account-attribution.ts
  journeys/                person-journey.ts, account-journey.ts, path.ts
  metrics/                 overview.ts, pipeline.ts, revenue.ts, funnel.ts,
                           response-time.ts, attribution-coverage.ts
  data/                    repositories
  ask/                     intents.ts, answers.ts
  search/                  global-search.ts
  formatting/              money.ts, dates.ts, duration.ts
  config/                  constants.ts (NOW), sources.ts, stages.ts,
                           event-types.ts, owners.ts

scripts/
  generate-seed.ts

types/
tests/                     vitest + playwright
```

A different structure is acceptable only if it preserves the same architectural boundaries.

---

# 7. Root Route

`/`

should redirect to:

`/overview`

Do not create a marketing homepage.

The prototype starts inside the application.

---

# 8. Atomic Design Rules

Atomic Design is the design thinking; the folders are pragmatic (00_DECISIONS.md §12):

```text
ui (atoms) → domain (entity primitives) → features (organisms) → layout (templates) → app (pages)
```

Rules:

1. Dependency direction: `app → features → domain → ui`. Nothing imports upward.
2. Do not wrap shadcn primitives. Add to `ui/` only what shadcn lacks.
3. One generic `DataTable` in `ui/`; feature tables configure it.
4. Each domain primitive exists exactly once.
5. Before creating a component, check `ui/`, `domain/`, `features/`, `layout/`.

Do not create duplicate visual components under different names.

---

# 9. Domain Component Rules

The following business concepts must have reusable representations:

```text
Person
Company
Opportunity
Source
Campaign
Stage
Owner
Attribution Status
Money
Date / Time
Journey Event
```

Examples:

```tsx
<PersonIdentity />
<CompanyIdentity />
<OpportunityValue />
<SourceBadge />
<CampaignBadge />
<StageBadge />
<OwnerChip />
<AttributionStatus />
<MoneyValue />
<DateTime />
<JourneyEvent />
```

Never format the same concept differently on different screens unless the design system explicitly requires a compact variant.

---

# 10. Color and Styling Rules

Use semantic CSS variables / Tailwind tokens.

Approved raw palette:

```text
MOP Red        #F24B57
MOP Dark       #161010
MOP Dark Gray  #252525
MOP Dessert    #DDC1B2
Yellow         #FFD600

White          #FFFFFF
Light Gray     #E7E1E2
Gray           #96999E
Neutral 600    #666666

Error          #E20B0B
Success        #74C324
Warning        #F8A20D
```

Do not scatter raw hex values through JSX.

Avoid:

```tsx
className="bg-[#F24B57]"
```

Prefer semantic tokens:

```tsx
className="bg-primary"
```

---

# 11. Visual Character

The application must be:

- dark-first,
- warm,
- premium,
- restrained,
- data-dense,
- executive,
- enterprise-ready.

Do not use:

- gradients as primary visual language,
- neon effects,
- glassmorphism,
- huge corner radii,
- oversized decorative cards,
- random icons in KPI cards,
- rainbow charts.

Prefer:

- typography,
- spacing,
- thin borders,
- restrained surfaces,
- structured tables,
- compact charts.

---

# 12. Typography

Use Inter or equivalent modern grotesk.

Use tabular numerals for:

- revenue,
- pipeline,
- percentages,
- counts.

Use sentence case.

Avoid large marketing-style headings inside the application.

---

# 13. Data Model Enforcement

Use the types defined in:

`03_DATA_MODEL_EVENT_TAXONOMY.md`

Do not invent page-specific alternatives to:

- Person,
- Company,
- Event,
- Opportunity,
- Touchpoint,
- Session,
- Integration.

The Event model is the source of truth for journey timelines.

Touchpoints are derived from Session + Event via `deriveTouchpoints()` — not stored (00_DECISIONS.md §5.1). Conversations, messages and meetings are Events with metadata.

Do not create a separate manually curated timeline data model.

---

# 14. Data Access Layer

Pages and UI components should not directly perform complex filtering and calculations.

Use reusable data functions.

Examples:

```ts
getPersonById(id)
getCompanyById(id)
getOpportunityById(id)

getPersonJourney(personId)
getCompanyJourney(companyId)

getFirstTouch(personId)
getLastMarketingTouch(personId)
getConversionTouch(personId)

getOverviewMetrics(dateRange)
getPipelineBySource(model, dateRange)
getRevenueBySource(model, dateRange)

getAttributionCoverage()
getLeads(filters)
getAccounts(filters)
```

Business logic must live outside visual components.

---

# 15. Seed Data Rules

Use:

`04_SEED_DATA_SPECIFICATION.md`

as the canonical source.

Hero scenarios must be manually curated and exact.

Do not procedurally overwrite or alter:

- Acme Inc
- Northstar Health
- Atlas Systems
- Nordica Labs
- Vector Group
- Helix Finance
- Meridian Logistics
- Orbit Retail

Additional records may be generated deterministically.

Do not use `Math.random()` at render time.

The prototype should render the same dataset every time.

---

# 16. Hero Record IDs

Prefer readable IDs.

Use or closely follow:

```text
ws_mop

usr_igor
usr_elma
usr_adnan

company_acme
company_northstar
company_atlas
company_nordica
company_vector

person_john_smith
person_emma_larsen
person_thomas_weber
person_ingrid_solberg
person_anna_keller

opp_acme_ai
opp_northstar_digital
opp_atlas_ai
opp_nordica_product
opp_vector_operations
```

Use stable IDs throughout.

---

# 17. Acme Is the Canonical Demo Record

Acme must always resolve to:

```text
Company
Acme Inc

Person
John Smith
VP Product

Opportunity
AI Transformation Platform

Value
€120,000

Stage
Proposal
```

Attribution:

```text
First Touch
Google Organic

Last Marketing Touch
LinkedIn Organic

Conversion
Direct / Contact Form

Self-Reported
Have been following your LinkedIn content for a while.
```

Do not allow derived logic to contradict these values.

---

# 18. Vector Group Is the Canonical Unknown Example

Vector must show:

```text
First marketing touch
None → Unknown

Last marketing touch
None → Unknown

Conversion
Direct / Contact Form

Previous known marketing history
None

Attribution status
Unknown
```

Display:

**Attribution incomplete**

Do not infer a source.

---

# 19. Atlas Systems Is the Canonical Relationship Example

Atlas must preserve two separate truths:

Detected attribution:

```text
Direct
```

Relationship attribution:

```text
Existing Client Referral
Daniel Fischer — Nova Group
```

Do not silently convert Direct into Referral in standard first/last/conversion models.

In First Touch and Last Marketing Touch, Atlas is credited to **Unknown**; in Conversion Touch, to **Direct**. Status: Partial.

---

# 20. Attribution Logic

Support exactly three prototype models:

```text
first_touch
last_touch
conversion_touch
```

## First Touch

Earliest derived touchpoint that is a marketing touch (`source !== "direct"`) before conversion. None → `unknown`.

## Last Marketing Touch (`last_touch`)

Latest derived marketing touch before conversion. None → `unknown`. Direct is never credited in this model. UI label is always "Last Marketing Touch".

## Conversion Touch

The channel/session in which identification occurred.

Example:

```text
Channel
Direct

Mechanism
Contact Form
```

Status rules (Full / Partial / Unknown), opportunity attribution (primary contact) and account attribution: 00_DECISIONS.md §5.

---

# 21. Attribution Must Be Derived

Do not make charts depend on arbitrary static source totals.

Opportunity value should move between channels when attribution model changes.

Example:

Acme €120K:

```text
First Touch
→ Google Organic

Last Marketing Touch
→ LinkedIn Organic

Conversion Touch
→ Direct
```

The raw journey stays unchanged.

---

# 22. Pipeline and Revenue Definitions

Use consistently:

```text
Open Pipeline
= total value of open opportunities

Revenue
= total value of won opportunities
```

Lost opportunities contribute to neither.

Do not use different definitions on different screens.

---

# 23. Dashboard Metrics

Derive:

- Inbound Leads
- Opportunities
- Won Deals
- Open Pipeline
- Won Revenue
- Lead → Opportunity %
- Avg. First Response
- Attribution Coverage

Do not hardcode KPI values independently from seed data. Metric definitions: 00_DECISIONS.md §7. No trend deltas in V1.

If final derived totals differ slightly from planning targets, display the derived totals.

Consistency matters more than matching an arbitrary mock number.

---

# 24. Global Application Shell

Implement first:

- dark theme tokens,
- sidebar,
- global header,
- workspace user area,
- page content shell.

Sidebar navigation:

```text
Overview
Inbound Leads
Accounts
Attribution
Journeys
Integrations

Ask Inbound
```

Settings is removed.

Root redirects to Overview.

---

# 25. Date Range

Page-level on Overview and Attribution only, stored as `?range=`.

Options:

- Last 7 Days
- Last 30 Days
- Last 90 Days
- This Quarter
- This Year

Default: **This Year**.

Carry `?range=` in drilldown links from Overview to Attribution. Open pipeline ignores the range (snapshot as of NOW).

---

# 26. Global Search

Implement functional search over:

- people,
- companies,
- emails,
- opportunities.

Result grouping:

```text
People
Companies
Opportunities
```

Click result navigates to canonical record.

Search can be fully local.

---

# 27. Build Overview First

Route:

`/overview`

Must contain:

- KPI strip,
- Pipeline by Source,
- Attribution Coverage,
- Revenue by Source,
- Conversion Funnel,
- Recent Inbound.

Use exact composition from:

`06_SCREEN_SPECIFICATIONS.md`.

All source rows should be clickable where specified.

Pipeline/Revenue by Source use First Touch and label it.

---

# 28. Build Leads Second

Route:

`/leads`

Must support:

- search,
- source filter,
- conversion filter,
- stage filter (Display Stage),
- owner filter,
- attribution status filter,
- sortable table,
- row navigation.

Prefer query parameters.

Example:

```text
/leads?attribution=unknown
```

---

# 29. Build Lead Detail Third

Route:

`/leads/[id]`

This is a critical demo screen.

Must contain:

- identity,
- company,
- commercial context,
- attribution summary,
- engagement summary,
- journey timeline,
- opportunity context,
- communication context,
- related contacts.

The Journey must be the visually dominant section.

---

# 30. Build Attribution Explanation

Implement one reusable component:

```tsx
<AttributionExplanation />
```

Use for:

- First Touch
- Last Marketing Touch
- Conversion Touch

It should expose:

- timestamp,
- rationale,
- source system,
- referrer,
- landing page,
- campaign/content if available.

Do not create three separate explanation components.

---

# 31. Build Accounts

Routes:

```text
/accounts
/accounts/[id]
```

Accounts table must support:

- search,
- source,
- industry,
- stage,
- owner,
- value filters.

Account Detail must aggregate:

- multiple people,
- opportunities,
- account-level journey.

---

# 32. Build Attribution Screen

Route:

`/attribution`

Critical requirements:

- model selector,
- ranked source visualization,
- KPI strip,
- source table,
- Acme comparison,
- source drilldown.

Model state should preferably be represented by:

```text
?model=first_touch
?model=last_touch
?model=conversion_touch
```

Source filter:

```text
?source=linkedin_organic
```

---

# 33. Build Journeys

Route:

`/journeys`

Use dense table.

Columns:

- Person
- Company
- Path
- Touches
- Conversion
- Duration
- Stage
- Value

Path example:

```text
Google → LinkedIn → Direct → Contact Form
```

Use source icons where appropriate.

Priority P2. Path rule: 00_DECISIONS.md §5.8.

---

# 34. Build Integrations

Route:

`/integrations`

Group by:

- Analytics
- Advertising
- Lead Capture
- CRM
- Communication
- Scheduling
- Content
- Automation

No live APIs.

Use seeded state. Canonical list and statuses: 00_DECISIONS.md §10.7 (Website Tracker first).

Manage opens a modal.

---

# 35. Build Ask Inbound Last

Route:

`/ask-inbound`

This does not require a real LLM.

Implement deterministic responses to predefined prompts.

Required prompts:

```text
Where did Acme come from?
Which channel generated the most pipeline?
Show leads waiting for a reply.
What are our biggest unattributed opportunities?
Which source has the highest conversion rate?
```

Responses should be generated from seed data where practical.

Answers must be computed by the same `lib/` functions as the screens.

Free text is keyword-matched to the five intents; no match shows the five prompts (00_DECISIONS.md §10.8).

---

# 36. Ask Inbound UI Rule

Do not create a generic ChatGPT clone.

Use:

- structured answer,
- key facts,
- evidence list,
- actions.

Example:

```text
Acme's first known interaction was through Google Organic...

First Touch
Google Organic

Last Marketing Touch
LinkedIn Organic

Conversion
Direct / Contact Form

Opportunity
€120K · Proposal

Evidence
Sep 3 Google Organic
Sep 11 LinkedIn
Sep 14 Form submission

Open Acme journey →
```

---

# 37. Charts

Use Recharts.

Preferred:

- horizontal bar charts,
- compact line charts only when needed,
- simple funnel representation.

Avoid:

- 3D,
- radial gauge,
- decorative donut overload,
- excessive animation.

Charts must use semantic palette from DESIGN_SYSTEM.

---

# 38. Tables

Tables are core product UI.

Use consistent table behavior across:

- Leads
- Accounts
- Attribution
- Journeys.

Shared features:

- hover state,
- sticky header,
- sorting where useful,
- alignment,
- compact rows,
- clickable records,
- empty states.

Do not build separate unrelated table styles.

---

# 39. Journey Timeline

Implement as reusable organism:

```tsx
<JourneyTimeline />
```

Support:

```text
mode="person"
mode="account"
```

Events must come from the canonical Event data.

Support filters:

- All
- Marketing
- Website
- Communication
- Sales

---

# 40. Journey Event Hierarchy

Use event importance.

Low emphasis:

- page_viewed
- session_started
- email_opened

Medium:

- case_study_viewed
- social_visit
- email_received
- meeting_booked

High:

- form_submitted
- lead_created
- opportunity_created
- proposal_sent
- deal_won

High-value events should visually dominate page-view noise.

---

# 41. Source Mapping

Create one canonical mapping file.

Example:

```ts
export const sourceConfig = {
  google_organic: {
    label: "Google Organic",
    // icon, semantic class
  },
  ...
}
```

All UI should use this mapping.

Do not manually type source labels throughout pages.

---

# 42. Stage Mapping

Create one canonical opportunity/lead stage config.

Do not manually style stages per screen.

---

# 43. Formatting

Create shared formatters for:

- currency,
- percentages,
- dates,
- relative time,
- durations.

Examples:

```ts
formatMoney(120000) // €120K
formatMoneyFull(120000) // €120,000
formatDuration(17) // 17m
formatRelativeDate(...) // 2h ago
```

Use consistently.

---

# 44. Loading States

Data is local and synchronous. One route-level `loading.tsx` at most. No per-page skeletons.

---

# 45. Empty States

Implement concise empty states.

No illustrations required.

Always provide a logical recovery action.

Example:

```text
No leads match these filters.

Clear filters
```

---

# 46. Error States

Handle:

- unknown route record,
- invalid person ID,
- invalid company ID,
- empty data states.

Do not expose raw Next.js or runtime errors during demo.

---

# 47. Responsive Scope

Primary target:

1280px to 1600px desktop.

Support:

- sidebar collapse,
- wrapping KPI strip,
- horizontal tables,
- stacked detail rail.

Do not spend major effort on mobile.

---

# 48. Accessibility

Minimum requirements:

- semantic HTML,
- focus states,
- keyboard-accessible controls,
- tooltips for icon-only actions,
- labels for filters,
- adequate contrast,
- status represented by text/icon in addition to color.

---

# 49. Performance

Because data is local:

- avoid unnecessary state duplication,
- avoid unnecessary client components,
- avoid rendering hundreds of hidden timeline events,
- memoize only where useful,
- keep implementation simple.

No premature optimization.

---

# 50. URL State

Prefer meaningful URL query parameters for:

- source filters,
- attribution model,
- attribution status,
- stage.

Examples:

```text
/leads?attribution=unknown

/attribution?model=last_touch

/attribution?model=first_touch&source=google_organic

/journeys?source=linkedin_organic
```

This improves:

- back navigation,
- deep linking,
- demo reliability.

---

# 51. Management Demo Path

This path is P0 and must work flawlessly (00_DECISIONS.md §11):

```text
/overview
↓
Recent Inbound
↓
John Smith / Acme
↓
Attribution Summary → Why?
↓
Customer Journey
↓
/accounts/company_acme — account journey
↓
/attribution
↓
First Touch → Conversion Touch → Last Marketing Touch
↓
Unknown row → Vector Group → Attribution incomplete
↓
/ask-inbound → Where did Acme come from?
↓
/integrations
```

Do not consider the prototype presentation-ready until this full path has been tested manually.

---

# 52. Build Sequence

Implement in this order.

## Phase 0 — Project Setup

- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Lucide
- Recharts
- linting
- formatting

## Phase 1 — Foundations

- tokens
- theme
- fonts
- types
- configs
- formatting
- application shell

## Phase 2 — Seed Data and Logic

- opportunity ledger (00 §9.2)
- canonical hero records
- seed generator script (ledger-first, seeded PRNG, output checked in)
- deterministic secondary records
- journeys
- attribution
- metrics
- search

Before UI polish, verify data consistency.

## Phase 3 — Core Components

- atoms
- molecules
- domain primitives
- DataTable foundation
- JourneyTimeline
- AttributionSummary

## Phase 4 — P0 Screens

- Overview
- Leads
- Lead Detail

Make these high quality before expanding.

## Phase 5 — Analytical Screens

- Accounts
- Account Detail
- Attribution

## Phase 6 — Supporting Screens

- Integrations
- Ask Inbound
- Journeys (P2)

## Phase 7 — QA and Polish

- loading
- empty
- error states
- accessibility
- navigation
- demo path
- visual consistency

---

# 53. Required Data Validation

Before polishing UI, create development checks for:

- duplicate IDs,
- invalid foreign references,
- events pointing to missing entities,
- opportunities without companies,
- inconsistent hero values,
- incorrect won revenue,
- incorrect open pipeline,
- attribution coverage mismatch,
- any target in 00_DECISIONS.md §14.

This may be a utility function run during development.

Example:

```ts
validateSeedData()
```

It may log errors in development.

Do not show validation tooling in the prototype UI.

---

# 54. Required Business Logic Tests

At minimum verify:

## Acme

```text
First Touch = Google Organic
Last Marketing Touch = LinkedIn Organic
Conversion = Direct
Opportunity = €120K
```

## Vector

```text
Attribution = Unknown
```

## Atlas

```text
First / Last Marketing Touch = Unknown
Conversion = Direct / Contact Form
Status = Partial
Relationship = Existing Client Referral (Daniel Fischer — Nova Group)
```

## Acme engagement and account

```text
5 sessions · 17 page views · 4 content · 9 emails · 2 meetings · 11 days · 17m
Earliest account touch = Google Organic (John)
Latest marketing influence = LinkedIn Organic (Sarah)
```

## Revenue

Won opportunity sum matches dashboard revenue.

## Pipeline

Open opportunity sum matches dashboard pipeline.

---

# 55. Testing Strategy

Use lightweight tests where useful.

Highest-value tests:

- attribution functions,
- metric aggregation,
- journey sorting,
- filter logic,
- seed consistency.

Use Vitest for logic and Playwright for one smoke test that walks the full P0 demo path.

Do not spend excessive time testing purely presentational components.

---

# 56. Development Guardrails

Do NOT:

- add features outside documented scope,
- create live external integrations,
- redesign the visual system,
- introduce another UI framework,
- add a second charting library,
- create a separate CRM model,
- simplify attribution into `lead_source`,
- convert unknown attribution into inferred attribution,
- mix relationship attribution into standard attribution silently,
- hardcode totals that conflict with records,
- duplicate business logic in React components,
- use random data on every refresh.

---

# 57. Claude Code Working Method

When implementing, proceed in small coherent increments.

For each phase:

1. Read relevant docs.
2. Identify required components.
3. Implement shared primitives first.
4. Implement screen.
5. Validate data.
6. Test required interactions.
7. Compare against screen specification.
8. Refactor duplicates before moving on.

Avoid generating the entire app in one uncontrolled pass.

---

# 58. When Requirements Are Ambiguous

Use these principles:

1. Preserve explainability.
2. Preserve data consistency.
3. Prefer reuse over new components.
4. Prefer simpler implementation.
5. Prefer dense enterprise UX over decorative SaaS UI.
6. Keep management demo path working.
7. Do not invent new product scope.

---

# 59. Definition of Prototype Done

The prototype is done when:

- Next.js app runs reliably,
- all documented routes work,
- all P0 flows work,
- Acme journey is polished,
- attribution switching visibly works,
- unknown attribution is demonstrated,
- account-level journey works,
- global search works,
- primary filters work,
- charts reconcile with tables,
- pipeline reconciles with opportunities,
- revenue reconciles with won deals,
- Ask Inbound returns consistent seeded answers,
- Integrations visually represent the ecosystem,
- no placeholder content remains,
- no raw framework errors are reachable through normal demo use,
- visual system is consistent,
- management demo can be delivered without explaining broken or missing behavior.

---

# 60. Final Build Principle

> **Build the smallest functional system that convincingly demonstrates the complete path from first touch to revenue.**

The purpose of the prototype is not to simulate every production capability.

It is to make the product vision concrete, credible, interactive, and technically believable.
