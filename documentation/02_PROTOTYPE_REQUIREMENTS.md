# Inbound Revenue Intelligence
## Prototype Requirements v0.2

> **v0.2 — amended by `00_DECISIONS.md`.** Where this document conflicts with `00_DECISIONS.md`, `00_DECISIONS.md` wins. Figures that do not appear in `00_DECISIONS.md` or `04_SEED_DATA_SPECIFICATION.md` are illustrative and must not be seeded.

## 1. Purpose

This document defines the functional requirements for a high-fidelity interactive prototype of the Inbound Revenue Intelligence platform.

The prototype is intended for internal management presentation and validation.

It must demonstrate how fragmented inbound, marketing, website, communication, CRM and revenue data could be unified into one coherent customer journey.

The prototype should feel like a believable production SaaS product, while operating entirely on seeded mock data.

---

## 2. Prototype Goal

The prototype must allow a stakeholder to answer:

> Where did this lead come from, what happened before they contacted us, what happened after, and did they become pipeline or revenue?

The prototype must demonstrate:

**First Touch → Engagement → Conversion → Communication → Opportunity → Revenue**

---

## 3. Prototype Type

The prototype should be:

- high fidelity,
- desktop-first,
- responsive enough for laptop presentation,
- built as a functional web application,
- powered by realistic seeded data,
- navigable,
- searchable,
- filterable,
- interactive,
- visually polished.

It should NOT be a static presentation or clickable image mockup.

---

## 4. Recommended Prototype Stack

The prototype should use:

- Next.js
- TypeScript
- App Router
- React Server Components where appropriate
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Recharts
- local TypeScript or JSON seed data
- optional lightweight client-side state management only where needed

The prototype does not require a production backend initially.

Seeded data can live inside the application and be accessed through a simple repository/service layer so it can later be replaced with database queries without changing the UI architecture.

Suggested initial structure *(superseded by 00_DECISIONS.md §12 — use `components/ui`, `domain`, `features`, `layout`)*:

```text
app/
  overview/
  leads/
  leads/[id]/
  accounts/
  accounts/[id]/
  attribution/
  journeys/
  integrations/
  ask-inbound/

components/
  dashboard/
  leads/
  accounts/
  attribution/
  journeys/
  shared/

data/
  leads.ts
  accounts.ts
  events.ts
  opportunities.ts
  campaigns.ts

lib/
  attribution/
  analytics/
  data/
  utils/

types/
  lead.ts
  account.ts
  event.ts
  attribution.ts
  opportunity.ts
```

Future production capabilities may introduce:

- Supabase / PostgreSQL
- authentication
- workspace-based multi-tenancy
- Route Handlers
- Server Actions
- integration webhooks
- scheduled synchronization jobs
- OAuth integrations
- secure credential storage

The prototype architecture should make this evolution possible without requiring a complete rewrite.

---

## 5. Primary Navigation

The application should use a persistent left sidebar.

Navigation:

1. Overview
2. Inbound Leads
3. Accounts
4. Attribution
5. Journeys
6. Integrations

Secondary navigation:

7. Ask Inbound

Settings is removed from the prototype (00_DECISIONS.md §10.2).

---

## 6. Global Header

The header should contain:

- workspace name,
- global search,
- "Sample data" marker,
- notification icon,
- user avatar.

Example workspace:

**Ministry of Programming**

Date range (Overview and Attribution page headers only — not in the global header; `?range=`):

Default: **This Year**

Options:

- Last 7 Days
- Last 30 Days
- Last 90 Days
- This Quarter
- This Year

Metric date semantics: 00_DECISIONS.md §7–8. Open pipeline is a snapshot as of today and ignores the range.

---

## 7. Global Search

Search should support:

- person name,
- company name,
- email,
- opportunity name.

Example searches:

`Acme`

`John Smith`

`john.smith@acme.com`

Search results should allow navigation to:

- Lead Detail
- Account Detail

---

## 8. Overview Screen

### Objective

Provide management with a concise overview of inbound performance.

The screen should immediately answer:

- How many inbound leads do we have?
- How much pipeline came from inbound?
- How much revenue came from inbound?
- Which channels contribute most?
- How complete is our attribution data?

### KPI Cards

Show:

- Inbound Leads: 80
- Opportunities: 26
- Open Pipeline: €1.25M (11 open opportunities, as of today)
- Won Revenue: €740K
- Lead → Opportunity: 32.5%
- Avg. First Response: approximately 2h 18m

All values derived from seed data. No trend deltas in V1.

### Attribution Health Card

Display:

**Attribution Coverage**

73%

Sub-values:

- Fully attributed
- Partially attributed
- Unknown

Include progress visualization.

Also show: "Revenue with relationship attribution only: €180K (1 deal)".

CTA:

**View unknown-attribution leads**

Navigates to `/leads?attribution=unknown`. Each count (Full / Partial / Unknown) is also clickable.

### Pipeline by Source

Chart.

Rows: the canonical sources (00_DECISIONS.md §4). No channel grouping. Credited by First Touch; label the model ("First Touch · change model in Attribution").

Metric toggle:

- Leads
- Opportunities
- Pipeline
- Revenue

Default:

Pipeline

### Revenue by Source

Horizontal bar chart or ranked chart.

Clicking a source should open Attribution filtered by that source.

### Conversion Funnel

Stages:

Leads → Qualified → Opportunities → Proposals (reached) → Won

Website visitors are excluded. Definitions: 00_DECISIONS.md §7.

The prototype should visually communicate drop-off.

### Recent Inbound

Compact table.

Columns:

- Person
- Company
- Source
- Conversion
- Status
- Owner
- Created

Clicking a row opens Lead Detail.

---

## 9. Inbound Leads Screen

### Objective

Provide the operational view of all inbound leads.

### Header

Title:

**Inbound Leads**

Subtitle:

All inbound contacts and their acquisition context.

Primary action:

**Export**

This can be visual-only in the prototype.

### Search

Search field:

Search leads, companies or emails.

Functional.

### Filters

Filters should work.

Include:

#### Date

- 7 days
- 30 days
- 90 days
- custom visual option

#### First Touch Source

- Google Organic
- Google Ads
- LinkedIn Organic
- LinkedIn Ads
- Meta
- Referral (web)
- Event
- Email
- Unknown

(Direct is never a first touch — 00_DECISIONS.md §4–5.)

#### Conversion Mechanism

- Contact Form
- Book a Call
- Email Inquiry
- Newsletter Signup

#### Stage (Display Stage — 00_DECISIONS.md §3.2)

- New
- Contacted
- Qualified
- Discovery
- Proposal
- Negotiation
- Won
- Lost
- Disqualified

#### Owner

- Igor Kraisnik
- Elma Šemović
- Adnan Ahmethodžić
- Marketing Team
- Unassigned

#### Attribution Status

- Fully Attributed
- Partial
- Unknown

---

## 10. Leads Table

Columns:

- Contact
- Company
- First Touch
- Last Marketing Touch
- Conversion
- Stage
- Owner
- Opportunity Value
- Last Activity

Example row:

John Smith  
Acme Inc  
Google Organic
LinkedIn Organic
Direct / Contact Form
Proposal
Igor Kraisnik
€120K
1d ago

Clicking the row opens Lead Detail.

---

## 11. Lead Detail Screen

This is one of the most important screens in the prototype.

It should feel highly polished.

### Header

Display:

John Smith  
VP Product at Acme Inc  
john.smith@acme.com

Owner: Igor

Display stage: Proposal (single derived stage — 00_DECISIONS.md §3.2)

Opportunity: AI Transformation Platform

Stage: Proposal

Value: €120,000

Expected close: Oct 18, 2026

### Attribution Summary

Four cards:

- First Touch
- Last Marketing Touch
- Conversion
- Self-Reported Source

### Engagement Summary

Show:

- Sessions
- Page Views
- Days from First Touch to Lead
- Content Viewed
- Meetings
- Emails
- Response Time

---

## 12. Customer Journey Timeline

The timeline should be visually central.

Events should have:

- timestamp,
- icon,
- event type,
- source,
- description,
- relevant metadata.

Different categories should be visually distinguishable.

Categories:

- acquisition,
- website,
- content,
- conversion,
- email,
- meeting,
- CRM,
- revenue.

---

## 13. Timeline Filters

Allow filtering by:

- All
- Marketing
- Website
- Communication
- Sales

Functional.

---

## 14. Account Detail Screen

Display:

- Company identity
- Domain
- Industry
- Employees
- Location
- Owner
- Known contacts
- Sessions
- Opportunities
- Pipeline
- First Seen
- Last Activity
- Aggregate account journey

This screen should demonstrate why B2B account attribution is different from person attribution.

---

## 15. Accounts Screen

Table:

- Company
- Contacts
- First Touch (earliest account touch)
- Opportunities
- Pipeline
- Last Activity
- Owner

Filters:

- Source
- Owner

---

## 16. Attribution Screen

### Objective

Connect marketing activity to pipeline and revenue.

### Attribution Model Selector

Top-level control:

- First Touch
- Last Marketing Touch
- Conversion Touch

Changing attribution model should visibly change metrics.

### KPI Cards

Display:

- Attributed Leads
- Attributed Pipeline
- Attributed Revenue
- Average Deal Value

### Channel Performance Table

Columns:

- Source
- Leads
- Qualified
- Opportunities
- Won
- Lead → Opp %
- Pipeline
- Revenue
- Avg Deal

Clicking a source should filter the rest of the screen.

---

## 17. Attribution Comparison

Add a visualization demonstrating that attribution model changes interpretation.

Example opportunity:

**Acme — €120K**

First Touch: Google Organic
Last Marketing Touch: LinkedIn Organic
Conversion: Direct / Contact Form

The UI should make the difference obvious.

---

## 18. Journeys Screen

**Priority: P2** — kept, must not block the demo (00_DECISIONS.md §10.6).

### Objective

Allow exploration of individual journeys independent of CRM stage.

Cards or table displaying:

- person,
- company,
- first touch,
- number of touches,
- conversion event,
- current stage,
- journey duration.

Click opens timeline.

---

## 19. Integrations Screen

### Objective

Show how the platform consolidates the existing ecosystem.

Display integrations grouped by category.

Canonical list, grouping and statuses: 00_DECISIONS.md §10.7. The first-party Website Tracker is shown first.

### Integration Card

Each card should contain:

- logo/icon,
- integration name,
- category,
- status,
- last sync,
- records imported.

Manage may open a simple modal.

---

## 20. Ask Inbound

The prototype should contain a lightweight conversational interface.

It does not need a real LLM connection initially.

Use predefined queries and generated-looking responses based on seed data.

Suggested prompt chips:

- Where did Acme come from?
- Which channel generated the most pipeline?
- Show leads waiting for a reply.
- What are our biggest unattributed opportunities?
- Which source has the highest conversion rate?

---

## 21. Seed Data Requirements

Minimum:

- 80 inbound leads
- 45 companies
- 12 campaigns
- 8 acquisition sources
- 26 opportunities (10 won, 5 lost, 11 open — ledger in 00_DECISIONS.md §9.2)
- 58 Full / 15 Partial / 7 Unknown attribution
- 300+ timeline events

The data does not need to be manually written record by record.

Claude Code can generate structured deterministic seed data.

---

## 22. Required Hero Records

The following records should be manually curated:

- Acme Inc
- Northstar Health
- Atlas Systems
- Nordica Labs
- Vector Group
- Helix Finance
- Meridian Logistics
- Orbit Retail

---

## 23. Campaign Seed Data

Examples:

- AI Transformation Q3
- Product Innovation Europe
- Enterprise AI Search
- LinkedIn Founder Content
- Digital Transformation Search
- AI Product Strategy
- Nordics Expansion
- Website Retargeting

---

## 24. Sources

Normalize to:

- google_organic
- google_ads
- linkedin_organic
- linkedin_ads
- meta
- referral
- event
- direct
- email
- unknown

`direct` is a valid session source and conversion channel but never a marketing touch. `unknown` is an attribution bucket only. Labels and rules: 00_DECISIONS.md §4.

Human-readable labels should be displayed in UI.

---

## 25. Opportunity Stages

Use (no `New` stage — opportunities start at Discovery or Qualified):

- Discovery
- Qualified
- Proposal
- Negotiation
- Won
- Lost

---

## 26. Data Quality States

Every lead should have:

### Full

First touch known  
Last touch known  
Conversion known

### Partial

Some attribution known

### Unknown

No meaningful source available

Exact rules (including how Direct and relationship evidence count): 00_DECISIONS.md §5.4.

These states should be filterable.

---

## 27. Required Interactions

The following interactions MUST work:

- sidebar navigation,
- global search,
- lead search,
- lead filters,
- account filters,
- date selector (Overview, Attribution),
- attribution model selector,
- channel drill-down,
- lead row navigation,
- account row navigation,
- journey filtering,
- unattributed leads CTA,
- Ask Inbound prompt selection,
- integration modal.

---

## 28. Interactions That Can Be Simulated

The following may be visual-only:

- export,
- integration authentication,
- inviting users,
- changing workspace,
- notification center,
- account settings,
- billing,
- creating real campaigns,
- sending email.

---

## 29. Visual Direction

The application should feel:

- premium,
- executive,
- modern,
- data-focused,
- serious,
- calm,
- enterprise-ready.

Avoid:

- generic startup gradients,
- excessive decorative illustrations,
- oversized cards everywhere,
- playful consumer SaaS styling,
- neon colors,
- excessive glassmorphism.

The product should visually prioritize:

**data clarity and trust.**

---

## 30. Layout Principles

Use generous but efficient spacing.

Dashboard density should feel closer to:

- modern analytics,
- revenue intelligence,
- enterprise CRM,

rather than a marketing landing page.

Tables should be information-rich.

Detail views should use hierarchy carefully.

The journey timeline should receive significant visual emphasis.

---

## 31. Information Hierarchy

Prioritize:

1. Revenue / pipeline
2. Attribution
3. Customer identity
4. Journey
5. Communication
6. Supporting behavioral analytics

Avoid making pageviews feel more important than opportunities or revenue.

---

## 32. Prototype Demo Path

1. Open Overview; show leads, pipeline, revenue and 73% attribution coverage.
2. Open John Smith / Acme from Recent Inbound.
3. Show First Touch, Last Marketing Touch, Conversion; open Why?.
4. Scroll the customer journey ("assembled from N systems").
5. Show the €120K opportunity.
6. Open Acme Inc account journey (John, Sarah, Michael).
7. Open Attribution; switch First Touch → Conversion Touch → Last Marketing Touch.
8. Click the Unknown row → Vector Group → Attribution incomplete.
9. Ask Inbound: "Where did Acme come from?"
10. Finish on Integrations.

Canonical version: 00_DECISIONS.md §11.

---

## 33. Prototype Success Test

Someone unfamiliar with the project should be able to use the prototype for five minutes and correctly explain:

> The platform connects marketing, website, CRM and communication signals to show how inbound demand becomes revenue.

If they describe it merely as:

> another CRM,

or:

> another marketing dashboard,

the prototype has failed to communicate the concept.

---

## 34. Core Differentiator to Preserve

The differentiation is:

> **One explainable customer journey connecting anonymous marketing activity with known people, companies, opportunities and revenue.**

---

## 35. Build Priority

### Priority 1

Next.js application shell  
Navigation  
Seed data model

### Priority 2

Overview

### Priority 3

Inbound Leads

### Priority 4

Lead Detail + Journey

### Priority 5

Accounts

### Priority 6

Attribution

### Priority 7

Journeys (P2)

### Priority 8

Integrations

### Priority 9

Ask Inbound

Polish only after the main flows work.

---

## 36. Definition of Done

The prototype is ready for management presentation when:

- the primary demo path works without broken navigation,
- all hero accounts are populated,
- all charts contain coherent numbers,
- attribution switching works,
- lead filtering works,
- journey timelines are populated,
- account relationships are visible,
- data quality gaps are represented,
- the integrations ecosystem is visible,
- the product can be demoed end-to-end without explaining missing screens,
- no placeholder lorem ipsum remains,
- no obviously fake/random data appears in the hero scenarios.
