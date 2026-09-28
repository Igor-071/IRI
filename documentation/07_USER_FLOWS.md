# Inbound Revenue Intelligence
## USER_FLOWS.md
### v0.2

> **v0.2 — amended by `00_DECISIONS.md`.** Where this document conflicts with `00_DECISIONS.md`, `00_DECISIONS.md` wins. Figures that do not appear in `00_DECISIONS.md` or `04_SEED_DATA_SPECIFICATION.md` are illustrative and must not be seeded.

## 1. Purpose

This document defines the primary user flows for the Inbound Revenue Intelligence prototype.

The goal is to make clear:

- how users move between screens,
- which actions trigger navigation,
- which filters or context should persist,
- what evidence is shown at each step,
- which flows are critical for the management demo,
- how the product supports investigation rather than passive reporting.

The central interaction principle is:

> **Move from summary → record → journey → evidence without losing context.**

---

# 2. Primary User Roles

The prototype should support the following mental models:

## Leadership

Uses the product to understand:

- inbound performance,
- pipeline,
- revenue,
- attribution coverage,
- source quality,
- management-level trends.

Leadership starts mostly from Overview and Attribution.

---

## Marketing

Uses the product to understand:

- source performance,
- campaign impact,
- first touch,
- last touch,
- conversion touch,
- unattributed demand.

Marketing starts mostly from Overview, Attribution, and Journeys.

---

## Sales / Business Development

Uses the product to understand:

- who the lead is,
- where they came from,
- what they did before contacting,
- recent communication,
- opportunity status,
- whether follow-up is required.

Sales starts mostly from Inbound Leads and Accounts.

---

## Product / Strategy / Growth

Uses the product to understand:

- where the funnel breaks,
- which journeys correlate with opportunity creation,
- attribution quality,
- source-to-revenue behavior,
- stalled leads,
- system gaps.

---

# 3. Global Navigation Flow

Users can move directly between:

```text
Overview
Inbound Leads
Accounts
Attribution
Journeys (P2)
Integrations
Ask Inbound
```

The sidebar is persistent.

Navigation should not reset shared global context unnecessarily.

Global context includes:

- current workspace.

The date range is page-level on Overview and Attribution (`?range=`, default This Year) and is carried in drilldown links from Overview to Attribution (00_DECISIONS.md §8).

---

# 4. Global Search Flow

## Goal

Find a known person, company, email, or opportunity quickly.

## Entry Point

Global header search.

## Flow

```text
Global Search
↓
User enters "Acme"
↓
Results grouped by entity type
↓
User chooses:
  Acme Inc
  or
  John Smith
  or
  AI Transformation Platform
↓
Navigate to selected record
```

## Search Result Behavior

### Person

Navigate to:

`/leads/[personId]`

### Company

Navigate to:

`/accounts/[companyId]`

### Opportunity

For prototype:

Navigate to linked Lead Detail or Account Detail.

---

# 5. Flow 1 — New Inbound Lead Investigation

## User Goal

Understand where a newly arrived lead came from and whether it deserves attention.

## Primary Role

Sales / Business Development

## Entry Point

Overview or Inbound Leads.

## Flow

```text
Overview
↓
Recent Inbound
↓
Select John Smith / Acme
↓
Lead Detail
↓
Review identity
↓
Review commercial context
↓
Review attribution
↓
Review engagement
↓
Inspect customer journey
↓
Review latest communication
↓
Review opportunity
```

## Key Questions Answered

- Who is this?
- Which company are they from?
- What was the first known touch?
- What was the last meaningful marketing touch?
- What caused conversion?
- What did they view before converting?
- Has anyone replied?
- How quickly did we respond?
- Is there an opportunity?
- What is the value and stage?

## Required Interactions

On Lead Detail:

- attribution `Why?` must work,
- journey filters must work,
- company link must work,
- related contacts must work,
- opportunity summary must be visible.

## Success State

The user can explain John's path as:

> Google Organic → LinkedIn Organic → Direct / Contact Form → Email → Meeting → Opportunity → Proposal.

---

# 6. Flow 2 — Source Performance Investigation

## User Goal

Understand whether a channel generates useful commercial outcomes rather than just lead volume.

## Primary Roles

Leadership, Marketing

## Entry Point

Overview.

## Flow

```text
Overview
↓
Pipeline by Source
↓
Click LinkedIn
↓
Attribution filtered to LinkedIn
↓
Review:
  Leads
  Opportunities
  Pipeline
  Revenue
  Conversion rate
↓
Review attributed opportunities
↓
Select Acme
↓
Open Account or Lead Detail
↓
Inspect underlying journey
```

## Context Persistence

When user clicks LinkedIn from Overview:

Attribution should retain:

```text
source = linkedin_organic
range = the Overview range (passed as ?range=)
```

## Key Questions Answered

- How much pipeline is attributed to this source?
- How much revenue?
- How many opportunities?
- Is the source high-volume or high-quality?
- Which companies make up that value?
- Why was each opportunity attributed here?

---

# 7. Flow 3 — Attribution Model Comparison

## User Goal

Understand why the same revenue can appear under different acquisition channels depending on attribution perspective.

## Primary Roles

Leadership, Marketing, Strategy

## Entry Point

Attribution.

## Flow

```text
Attribution
↓
Default: First Touch
↓
Review source distribution
↓
Review Acme comparison
↓
Switch to Conversion Touch
↓
Observe Acme €120K move from Google Organic to Direct
↓
Switch to Last Marketing Touch
↓
Observe Acme €120K move to LinkedIn Organic
↓
Click the Unknown row
↓
Vector Group and Atlas Systems appear in the drilldown
↓
Open "Why?"
↓
Review supporting touchpoint
```

## Required UI Behavior

Changing attribution model updates:

- KPI attribution totals where applicable,
- ranked source chart,
- attribution table,
- selected source state,
- comparison component.

It must NOT alter:

- raw event history,
- opportunity value,
- original touchpoints.

## Key Product Lesson

> Attribution is a perspective on the same journey, not a rewrite of history.

---

# 8. Flow 4 — Unknown Attribution Investigation

## User Goal

Understand which valuable leads cannot currently be attributed and why.

## Primary Roles

Leadership, Marketing, Strategy

## Entry Point

Overview.

## Flow

```text
Overview
↓
Attribution Coverage
↓
View unknown-attribution leads
↓
Inbound Leads filtered:
  attribution = unknown
↓
Select Vector Group
↓
Lead Detail
↓
Attribution incomplete
↓
Review known timeline
↓
See:
  Direct Visit
  Contact Form
  No prior known touch
↓
Review explanation
```

Alternative entry (used in the management demo): Attribution → Unknown row → Vector Group.

## Required Messaging

Display:

**Attribution incomplete**

Supporting text:

> No known marketing interaction was identified before this conversion.

## Important Rule

Do not infer:

- Google,
- LinkedIn,
- referral,
- campaign,

without evidence.

## Key Product Lesson

> The platform exposes missing knowledge rather than inventing certainty.

---

# 9. Flow 5 — Account-Level Investigation

## User Goal

Understand the full relationship with a B2B account across multiple contacts.

## Primary Roles

Sales, Leadership, Strategy

## Entry Point

Accounts.

## Flow

```text
Accounts
↓
Select Acme Inc
↓
Account Detail
↓
Review account KPIs
↓
Review known contacts
↓
Review opportunity
↓
Review account-level attribution
↓
Review aggregate journey
↓
Select John Smith
↓
Lead Detail
↓
Review person-level journey
```

## Key Questions Answered

- Who from the company has interacted with us?
- Which person first entered the journey?
- Which contact is commercially active?
- What is the total account pipeline?
- Are multiple people influencing the opportunity?
- Does account attribution differ from person attribution?

## Critical Distinction

Account journey:

Aggregates multiple people.

Person journey:

Represents one individual's activity.

The UI must make this difference clear.

---

# 10. Flow 6 — Referral / Relationship Attribution Investigation

## User Goal

Understand a lead where digital attribution does not tell the whole story.

## Primary Roles

Leadership, Sales, Marketing

## Entry Point

Accounts or Inbound Leads.

## Example Record

Atlas Systems.

## Flow

```text
Atlas Systems
↓
Lead / Account Detail
↓
Detected Attribution:
  Direct only — no marketing touch (First/Last Marketing Touch = Unknown)
↓
Self-Reported:
  Recommended by Daniel from Nova Group
↓
Relationship Attribution:
  Existing Client Referral
↓
Review journey
↓
Review won opportunity
```

## Key Product Lesson

The system preserves:

```text
Detected attribution
AND
Human relationship attribution
```

It does not replace one with the other.

---

# 11. Flow 7 — Lead Follow-Up / Stalled Lead Investigation

## User Goal

Find inbound leads that need action.

## Primary Roles

Sales / Business Development

## Entry Point

Ask Inbound.

## Flow

```text
Ask Inbound
↓
Choose:
"Show leads waiting for a reply"
↓
Structured response
↓
List of 3–5 leads
↓
Select lead
↓
Lead Detail
↓
Review communication timeline
↓
Review last inbound message
↓
Review owner and stage
```

## Example Result

```text
Anna Keller
Vector Group
Waiting 3d 6h
Owner: Igor
Stage: Qualified
```

## Prototype Limitation

No actual email send action required.

The flow demonstrates operational intelligence.

---

# 12. Flow 8 — Ask Inbound: Account Origin

## User Goal

Get an immediate answer without manually navigating the journey.

## Entry Point

Ask Inbound.

## Flow

```text
Ask Inbound
↓
Select:
"Where did Acme come from?"
↓
Answer generated from seeded data
↓
Display:
  First Touch
  Last Marketing Touch
  Conversion
  Opportunity
↓
Display supporting evidence
↓
Open Acme Journey
```

## Required Answer

The response must reflect the canonical Acme data:

- First Touch: Google Organic
- Last Marketing Touch: LinkedIn Organic
- Conversion: Direct / Contact Form
- Opportunity: €120K / Proposal

## Important Principle

The answer must link to evidence.

---

# 13. Flow 9 — Integration Health Investigation

## User Goal

Understand whether source data is current and which systems feed the journey.

## Primary Roles

Marketing, Strategy, Admin

## Entry Point

Integrations.

## Flow

```text
Integrations
↓
Scan status by category
↓
Select integration with Attention state
↓
Manage modal
↓
Review:
  last successful sync
  record count
  imported data types
  current state
```

## Example

HubSpot:

```text
Attention
Switches off 17 Oct 2026 → Sales Tracker
Journey history preserved
```

Cal.com:

```text
Archived
```

Make.com:

```text
Archived
```

## Prototype Limitation

No live reconnect/authentication required.

---

# 14. Flow 10 — Journey Exploration (P2)

## User Goal

Compare how different leads move from acquisition to commercial outcome.

## Primary Roles

Marketing, Strategy

## Entry Point

Journeys.

## Flow

```text
Journeys
↓
Filter:
  Source = LinkedIn
↓
Review journey paths
↓
Compare:
  number of touches
  journey duration
  conversion mechanism
  stage
  value
↓
Select Nordica Labs
↓
Lead Detail / Journey
```

## Key Questions Answered

- Are LinkedIn journeys longer?
- Which journeys include content engagement?
- How many touches occur before conversion?
- Which paths create opportunities?

---

# 15. Flow 11 — High-Volume vs High-Value Source Comparison

## User Goal

Understand whether the channel generating the most leads is also generating the most commercial value.

## Primary Roles

Leadership, Marketing

## Entry Point

Overview or Attribution.

## Flow

```text
Attribution
↓
Metric = Leads
↓
Observe high-volume channel
↓
Metric = Revenue
↓
Observe ranking change
↓
Select Referral
↓
Review:
  lower lead volume
  higher conversion
  higher average deal
↓
Review attributed companies
```

## Intended Product Story

Seed data (First Touch): Google Ads — 15 leads, €55K revenue. Referral (web) — 6 leads, 67% lead → opportunity, €180K revenue.

The prototype should make this visible.

---

# 16. Flow 12 — Recent Inbound to Account Context

## User Goal

Move from a person-level lead to the broader account context.

## Flow

```text
Overview
↓
Recent Inbound
↓
John Smith
↓
Lead Detail
↓
Click Acme Inc
↓
Account Detail
↓
Review other contacts
↓
Review account-wide timeline
```

This should be seamless.

---

# 17. Filter Persistence Rules

## Date Range

Page-level on Overview and Attribution only (`?range=`, default This Year). Carried in drilldown links from Overview to Attribution. Leads has its own independent Date filter. No cross-app persistence required.

---

## Source Context

If user drills from a source visualization into Attribution:

Persist selected source.

Example:

```text
Overview
→ LinkedIn
→ Attribution
```

Attribution opens with LinkedIn selected.

---

## Lead Filters

Filters on Leads do not need to persist permanently after leaving the page.

However:

Back navigation should preferably restore current state.

---

# 18. Attribution Context Rules

The selected attribution model should persist while user remains in Attribution.

Optional prototype enhancement:

Persist model across session using local state/storage.

Not required:

Global attribution model across the whole application.

---

# 19. Back Navigation

Browser back behavior should remain reliable.

Example:

```text
Attribution
↓
LinkedIn
↓
Acme
↓
Back
```

Should return to:

LinkedIn-filtered Attribution state where practical.

Avoid dead-end drilldowns.

---

# 20. Deep-Link Rules

Core record routes should be directly accessible.

Examples:

```text
/leads/person_john_smith
/accounts/company_acme
/attribution
/integrations
```

The prototype should not require navigating from Overview to make record pages render correctly.

---

# 21. Management Demo Flow

This is the highest-priority flow.

Target duration:

Approximately 5–7 minutes.

## Step 1 — Establish Scale

Open:

`/overview`

Show:

- inbound leads,
- pipeline,
- won revenue.

Narrative intent:

> We have inbound activity and commercial value, but the underlying journey is fragmented across multiple systems.

---

## Step 2 — Establish the Data Gap

Show:

**Attribution Coverage**

Approximately 73%.

Narrative intent:

> We can also quantify what we don't know.

Do not over-explain yet.

---

## Step 3 — Make the Product Personal

Open:

John Smith / Acme Inc.

Narrative intent:

> Instead of just seeing a contact form submission, we can reconstruct what happened before it.

---

## Step 4 — Show Attribution

Show:

First Touch:

Google Organic

Last Marketing Touch:

LinkedIn Organic

Conversion:

Direct / Contact Form

Self-Reported:

LinkedIn content

Click one:

`Why?`

Narrative intent:

> These are different questions, so the product keeps them separate.

---

## Step 5 — Show the Journey

Scroll through:

```text
Google
→ Product Page
→ Case Study
→ LinkedIn
→ Article
→ Direct Visit
→ Contact Form
→ Reply
→ Meeting
→ Opportunity
→ Proposal
```

Narrative intent:

> This is the missing continuous journey.

This is the main "wow" moment.

---

## Step 6 — Connect Journey to Money

Show:

Opportunity:

€120K  
Proposal

Narrative intent:

> We are no longer stopping at marketing conversion. We connect the journey to pipeline.

---

## Step 6b — Show the Account

Click Acme Inc.

Show the account journey: John Smith (Google → LinkedIn → Direct), Sarah Johnson (LinkedIn Organic), Michael Brown (relationship introduction).

Narrative intent:

> B2B deals involve several people. The account view combines them without losing who did what.

---

## Step 7 — Demonstrate Attribution Perspective

Open Attribution.

Show Acme under First Touch (Google Organic).

Switch:

First Touch → Conversion Touch (Direct) → Last Marketing Touch (LinkedIn Organic)

Narrative intent:

> The underlying history doesn't change. Only the attribution lens changes.

---

## Step 8 — Demonstrate Trust

Click the **Unknown** row → open Vector Group.

Show:

Attribution incomplete.

Narrative intent:

> If we don't know, we say we don't know. The system doesn't manufacture attribution.

---

## Step 9 — Demonstrate Intelligence Layer

Open Ask Inbound.

Choose:

`Where did Acme come from?`

Show structured answer + evidence.

Narrative intent:

> Once the underlying journey exists, AI becomes a useful interface to trusted data.

---

## Step 10 — Show Feasibility

Open Integrations.

Show the first-party Website Tracker first (it makes person-level stitching possible), then:

GA4  
Google Ads  
LinkedIn  
Meta  
Resend  
Sales Tracker  
Email  
Ghost  
etc.

Narrative intent:

> The product becomes the intelligence layer across tools we already use rather than requiring us to replace everything.

---

# 22. Demo Flow Guardrails

During the management demo:

Do not spend time on:

- Settings,
- export,
- pagination,
- technical implementation details,
- integration configuration,
- edge-case filters.

Focus on:

- journey,
- attribution,
- pipeline,
- explainability,
- unknown data,
- integration layer.

---

# 23. Flow Priority Levels

## P0 — Must Work Perfectly

- Management Demo Flow
- Lead Investigation
- Attribution Comparison
- Unknown Attribution
- Account Detail / Lead Detail navigation (Acme account journey)
- Ask Inbound → Acme
- Overview → source drilldown

## P1 — Must Work

- Leads filters
- Accounts filters
- Journey filters
- integration modal
- stalled leads query
- global search

## P2 — Nice to Have

- Journeys screen,
- persistent browser state for complex filters,
- keyboard shortcuts,
- sophisticated search ranking,
- settings persistence.

---

# 24. Flow State Model

Where practical, UI state should be represented in URL query parameters.

Examples:

```text
/leads?source=linkedin_organic&stage=proposal

/attribution?model=last_touch&source=linkedin_organic

/journeys?source=google_ads
```

Benefits:

- shareable prototype states,
- predictable back navigation,
- easier demo preparation.

Not every transient UI state needs to be in the URL.

---

# 25. Error Flow

If a record cannot be found:

Display:

```text
Record not found

The requested lead or account is not available in the current workspace.

Return to leads
```

Do not crash or show a framework error page.

---

# 26. Empty Filter Flow

If filters return no records:

Display:

```text
No leads match these filters.

Clear filters or change the date range.
```

CTA:

`Clear filters`

---

# 27. Loading Flow

Data is local; navigation is effectively instant. Maintain the shell; one route-level `loading.tsx` at most. No per-page skeletons.

---

# 28. Evidence Navigation

Any analytical result should expose a path to evidence.

Examples:

```text
Revenue by Source
↓
Source
↓
Opportunity
↓
Account
↓
Journey
↓
Event
```

or:

```text
Ask Inbound answer
↓
Evidence event
↓
Lead journey
```

This flow should feel consistent everywhere.

---

# 29. Canonical Navigation Rules

Use these rules globally:

```text
Person
→ Lead Detail

Company
→ Account Detail

Source
→ Attribution filtered to source

Attribution explanation
→ Popover / side panel

Journey event
→ Remains inside current record

Integration
→ Manage modal
```

Avoid inconsistent destinations.

---

# 30. User Flow Definition of Done

User flows are implemented correctly when:

- every P0 flow works end-to-end,
- users can drill from summary to evidence,
- navigation destinations are consistent,
- attribution model changes do not alter raw history,
- unknown attribution remains unknown,
- account and person journeys are clearly distinct,
- global date context behaves consistently,
- there are no dead-end screens in the demo path,
- browser back behavior is reasonable,
- hero scenarios always produce the expected story.

---

# 31. Core Interaction Principle

> **The product is not a set of dashboards. It is an investigation system.**

Every important surface should help the user answer:

1. What happened?
2. Who or what does it relate to?
3. Why is the system showing this conclusion?
4. What is the underlying evidence?
5. What commercial outcome followed?
