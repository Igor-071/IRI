# Inbound Revenue Intelligence
## SCREEN_SPECIFICATIONS.md
### v0.2

> **v0.2 — amended by `00_DECISIONS.md`.** Where this document conflicts with `00_DECISIONS.md`, `00_DECISIONS.md` wins. Figures that do not appear in `00_DECISIONS.md` or `04_SEED_DATA_SPECIFICATION.md` are illustrative and must not be seeded.

## 1. Purpose

This document defines the screen-by-screen UI composition for the Inbound Revenue Intelligence prototype.

It translates the Product Brief, Prototype Requirements, Data Model, Seed Data Specification, and Design System into concrete application screens.

All screens must:

- use the approved Atomic Design system,
- reuse shared product primitives,
- follow the dark-first MOP visual system,
- use deterministic seeded data,
- avoid page-specific one-off styling where reusable components already exist,
- preserve explainability,
- prioritize pipeline, revenue, attribution, and journey over decorative analytics.

This document is intended to be directly usable by Claude Code during implementation.

---

# 2. Application Shell

## 2.1 Overall Layout

Desktop-first layout.

Structure:

```text
┌──────────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                            │
│         ├────────────────────────────────────────────────────│
│         │ Main Content                                      │
│         │                                                    │
│         │                                                    │
└──────────────────────────────────────────────────────────────┘
```

### Sidebar

Width:

220–240px

Default:

Expanded

May collapse at smaller desktop widths.

### Main Content

Fluid width.

Use full horizontal width for analytical screens.

Constrain detail screens only when it improves readability.

---

# 3. Global Navigation

Component:

`<GlobalNavigation />`

## 3.1 Product Identity

Top of sidebar.

Display:

**Inbound**

Optional secondary label:

Revenue Intelligence

Keep compact.

Do not create a large branded hero inside navigation.

---

## 3.2 Primary Navigation

Order:

1. Overview
2. Inbound Leads
3. Accounts
4. Attribution
5. Journeys
6. Integrations

Icons should be simple Lucide icons.

Active state:

- subtle `surface-active` background,
- small MOP Red indicator,
- primary text.

Do not use full red row background.

---

## 3.3 Secondary Navigation

Separated by subtle divider.

Items:

- Ask Inbound

Settings is removed from the prototype (00_DECISIONS.md §10.2).

---

## 3.4 Workspace / User Area

Bottom of sidebar.

Display:

Workspace:

Ministry of Programming

Current user:

Igor Kraisnik

A small "Sample data" badge sits next to the workspace name.

Compact avatar + name.

---

# 4. Global Header

Component:

`<GlobalHeader />`

Height:

Approximately 56–64px.

Contains:

- current page title,
- optional subtitle/context,
- global search trigger,
- "Sample data" marker,
- notifications icon,
- user avatar.

The date range selector is **not** in the global header; it lives in the Overview and Attribution page headers (00_DECISIONS.md §8).

Keep controls compact.

---

## 4.1 Global Search

Component:

`<GlobalSearch />`

Behavior:

- search people,
- companies,
- emails,
- opportunities.

Trigger:

Search field or command-style button.

Example placeholder:

`Search people, companies, opportunities…`

Result grouping:

### People

John Smith  
VP Product · Acme Inc

### Companies

Acme Inc  
€120K open pipeline

### Opportunities

AI Transformation Platform  
Acme Inc · Proposal

Clicking a result navigates to the corresponding detail screen.

---

# 5. Page Header Pattern

Reusable molecule/organism:

`<PageHeader />`

Structure:

```text
Title
Optional supporting text

                                Primary controls/actions
```

Example:

```text
Inbound Leads
All inbound contacts and their acquisition context.

                                Export
```

Avoid oversized page titles.

---

# 6. Overview Screen

Route:

`/overview`

Template:

`DashboardTemplate`

## 6.1 Primary User Question

> How is inbound demand performing, where is pipeline coming from, and how trustworthy is our attribution?

---

## 6.2 Screen Structure

Recommended composition:

```text
Page Header
↓
Primary KPI strip
↓
Main analytics row
  ├── Pipeline by Source
  └── Attribution Health
↓
Secondary analytics row
  ├── Revenue by Source
  └── Conversion Funnel
↓
Recent Inbound
```

Avoid turning every section into an isolated card.

Use spacing and dividers where possible.

---

## 6.3 Page Header

Title:

**Overview**

Subtitle:

Inbound performance across acquisition, conversion, pipeline and revenue.

Right side:

`<DateRangeSelector />`

Default:

This Year (`?range=`)

---

## 6.4 KPI Strip

Use:

`<MetricCard />`

Metrics:

### Inbound Leads

Derived from seed data.

### Opportunities

Derived.

### Open Pipeline

Currency.

### Won Revenue

Currency.

### Lead → Opportunity

Percentage.

### Avg. First Response

Duration.

Layout:

One horizontal row where viewport allows.

Cards should be compact.

No decorative icons required.

Example:

```text
Inbound Leads        Open Pipeline        Won Revenue
80                   €1.25M               €740K
                     as of today
```

No trend deltas in V1.

---

## 6.5 Pipeline by Source

Organism:

`<PipelineBySource />`

Primary chart for Overview.

Preferred visualization:

Horizontal ranked bars.

Reason:

Exact comparison is more important than decorative shape.

Header:

```text
Pipeline by source
```

Controls:

Metric toggle:

- Pipeline
- Revenue
- Opportunities
- Leads

Default:

Pipeline

Label the model: "First Touch · change model in Attribution".

Rows (First Touch, open pipeline — derived; shown here from the ledger):

```text
Google Organic     €260K  ███████████████
LinkedIn Ads       €220K  █████████████
Referral (web)     €210K  ████████████
LinkedIn Organic   €200K  ████████████
Unknown            €160K  █████████
Google Ads         €140K  ████████
Event               €60K  ███
```

Click row:

Navigate to:

`/attribution?source=<source>`

or apply equivalent client-side state.

Selected row:

Use subtle primary accent.

---

## 6.6 Attribution Health

Organism:

`<DataQualityPanel />`

Header:

**Attribution coverage**

Primary value:

Approximately 73%

Breakdown:

- Full
- Partial
- Unknown

Example:

```text
73%
Fully attributed

58 Full
15 Partial
7 Unknown
```

Use progress visualization, not a donut chart.

CTA:

**View unknown-attribution leads**

Action:

Navigate to:

`/leads?attribution=unknown`

Each count (Full / Partial / Unknown) is also clickable to `/leads?attribution=<status>`.

Additional line:

`Revenue with relationship attribution only: €180K (1 deal)`

Supporting copy:

`Shows how much of the current inbound journey can be reliably reconstructed.`

---

## 6.7 Revenue by Source

Organism:

`<RevenueBySource />`

Preferred visualization:

Ranked bars.

Show:

- source,
- won revenue,
- number of won opportunities.

Example:

```text
Referral (web)    €180K     2 won
Unknown           €180K     1 won   (relationship-only: Atlas)
Event             €140K     1 won
Google Organic    €105K     2 won
```

Click:

Drill into Attribution filtered to that source.

---

## 6.8 Conversion Funnel

Organism:

`<ConversionFunnel />`

Stages:

- Known Leads
- Qualified
- Opportunities
- Proposals
- Won

Website visitors are excluded. Proposals = opportunities that reached Proposal or later (from stage events). Definitions: 00_DECISIONS.md §7.

Preferred design:

Horizontal stepped funnel or vertically aligned counts.

Avoid decorative funnel shapes.

Example:

```text
80 Leads
↓ 55%
44 Qualified
↓ 59%
26 Opportunities
↓ 65%
17 Proposals
↓ 59%
10 Won
```

---

## 6.9 Recent Inbound

Organism:

`<LeadTable variant="compact" />`

Header:

**Recent inbound**

Columns:

- Contact
- Company
- First Touch
- Stage
- Value
- Owner
- Created

Limit:

6–8 rows.

Include hero lead:

John Smith / Acme.

Click row:

Open Lead Detail.

Footer action:

**View all leads →**

---

# 7. Inbound Leads Screen

Route:

`/leads`

Template:

`ListTemplate`

## 7.1 Primary User Question

> Which inbound leads exist right now, where did they come from, and what state are they in?

---

## 7.2 Screen Structure

```text
Page Header
↓
Search + Filter Bar
↓
Applied Filter Chips
↓
Lead Table
```

---

## 7.3 Page Header

Title:

**Inbound Leads**

Subtitle:

All inbound contacts and their acquisition context.

Right-side action:

**Export**

Visual-only permitted.

---

## 7.4 Search and Filter Bar

Organism:

`<FilterBar />`

Left:

`<SearchField />`

Placeholder:

`Search leads, companies or emails…`

Filters:

- Date
- First Touch
- Conversion
- Stage
- Owner
- Attribution Status

Right:

Result count.

Example:

`80 leads`

---

## 7.5 Active Filter Chips

Use:

`<FilterChip />`

Example:

```text
First Touch: LinkedIn ×
Stage: Proposal ×
```

Include:

`Clear all`

only when filters are active.

---

## 7.6 Lead Table

Organism:

`<LeadTable />`

Columns:

### Contact

Use:

`<PersonIdentity />`

Display:

Avatar/initials  
Name  
Job title

### Company

Use:

`<CompanyIdentity />`

### First Touch

Use:

`<SourceBadge />`

### Last Marketing Touch

Use:

`<SourceBadge />`

### Conversion

Text + optional source icon.

Example:

Contact Form

### Stage

`<StageBadge />`

### Owner

`<OwnerChip />`

### Opportunity Value

`<OpportunityValue />`

### Last Activity

`<DateTime />`

---

## 7.7 Table Behavior

Required:

- sort,
- search,
- filters,
- row hover,
- clickable rows,
- sticky header.

Optional:

- pagination or simple "show more".

Default sort:

Most recent activity.

---

## 7.8 Unknown Attribution Row Treatment

Do not make unknown records look broken.

Example:

First Touch:

`Unknown`

Attribution status:

`Attribution incomplete` (Unknown) or `Partial attribution` (Partial)

Use warning-adjacent visual treatment.

No invented source.

---

# 8. Lead Detail Screen

Route:

`/leads/[id]`

Primary hero route example:

`/leads/person_john_smith`

Template:

`RecordDetailTemplate`

## 8.1 Primary User Question

> Who is this lead, where did they come from, what have they done, and what is happening commercially?

This is a signature screen.

---

## 8.2 Screen Structure

Recommended:

```text
Identity Header
↓
Commercial + Attribution Summary
↓
Engagement Summary
↓
Main Content
  ├── Customer Journey
  └── Context Rail
      ├── Opportunity
      ├── Communication
      └── Related Contacts
```

On narrower desktop widths:

Context rail may stack below the Journey.

---

## 8.3 Identity Header

Organism:

`<LeadIdentityHeader />`

Left:

```text
John Smith
VP Product at Acme Inc
john.smith@acme.com
```

Use:

`<PersonIdentity />`

Company should be clickable.

Right:

Owner  
Display Stage (one badge — 00_DECISIONS.md §3.2)  
Last activity

Primary actions may remain visual-only:

- Add note
- Open CRM

Avoid too many buttons.

---

## 8.4 Commercial Summary

Organism:

`<OpportunitySummary />`

Display:

Opportunity:

AI Transformation Platform

Stage:

Proposal

Value:

€120,000

Probability:

65%

Expected Close:

Oct 18, 2026

Use restrained layout.

Value should be visually prominent.

---

## 8.5 Attribution Summary

Organism:

`<AttributionSummary />`

Four columns or compact panels:

### First Touch

Google Organic  
Sep 3, 2026  
AI Product Development

`Why?`

### Last Marketing Touch

LinkedIn Organic  
Sep 11, 2026  
Founder content

`Why?`

### Conversion

Direct / Contact Form  
Sep 14, 2026

`Why?`

### Self-Reported

“Have been following your LinkedIn content for a while.”

---

## 8.6 Attribution Explanation

Component:

`<AttributionExplanation />`

Trigger:

`Why?`

Use popover or side panel.

Example:

```text
Why Google Organic?

Sep 3, 09:42

This is the earliest known marketing interaction
for John Smith.

Source system
Website Tracker

Referrer
google.com

Landing page
/services/ai-product-development
```

Important:

This pattern must be reusable across Attribution screen and other detail views.

---

## 8.7 Engagement Summary

Organism:

`<EngagementSummary />`

Compact horizontal stats:

- Sessions
- Page Views
- Content Viewed
- Meetings
- Emails
- Days to Lead
- First Response

Example:

```text
5 Sessions   17 Page Views   4 Content   2 Meetings   9 Emails   11 Days   17m Response
```

Do not place each metric inside a large card.

---

## 8.8 Journey Section

Primary visual area.

Header:

```text
Customer journey
```

Filters:

- All
- Marketing
- Website
- Communication
- Sales

Use:

`<JourneyTimeline />`

Above the timeline show **"Journey assembled from N systems"** with source-system chips.

---

## 8.9 Context Rail

Right rail preferred width:

320–360px.

Contains:

### Opportunity

Compact summary.

### Communication

Last inbound email  
Last outbound email  
Last meeting  
Response time

### Related Contacts

Sarah Johnson — CTO  
Michael Brown — CEO

Each clickable.

---

# 9. Journey Timeline Specification

Organism:

`<JourneyTimeline />`

## 9.1 Grouping

Group events by date.

Example:

```text
SEP 14
```

Date labels should remain visually quiet but clear.

---

## 9.2 Event Layout

Recommended:

```text
10:11    [icon] Conversion
                  Contact form submitted
                  “We are exploring an AI platform…”
                  [Resend] · /contact
```

Every event shows a source-system chip (`<SourceSystemChip />`). Consecutive low-emphasis page views within a session collapse into one expandable row ("3 pages viewed").

Columns:

- time
- event marker/icon
- event content

---

## 9.3 Event Emphasis

### Low

Page view  
Session start  
Email opened

Visual:

Muted text, smaller marker.

### Medium

Case study  
Marketing touch  
Email received  
Meeting booked

Visual:

Normal text, stronger icon.

### High

Form submitted  
Lead created  
Opportunity created  
Proposal sent  
Deal won

Visual:

Strong label and semantic accent.

---

## 9.4 Journey Filters

Filter logic:

### Marketing

Categories:

acquisition, content

### Website

website, conversion

### Communication

communication, meeting

### Sales

crm, revenue

### All

Everything.

Events in the `system` category are never shown.

Filtering should not mutate source data.

---

# 10. Accounts Screen

Route:

`/accounts`

Template:

`ListTemplate`

## 10.1 Primary User Question

> Which companies are engaging with us, how much commercial value do they represent, and how did the relationship begin?

---

## 10.2 Page Header

Title:

**Accounts**

Subtitle:

Companies connected to inbound activity, opportunities and revenue.

---

## 10.3 Filter Bar

Filters:

- Source
- Owner

Search:

Company name or domain.

---

## 10.4 Account Table

Organism:

`<AccountTable />`

Columns:

- Company
- Contacts
- First Touch (earliest account touch)
- Opportunities
- Open Pipeline
- Last Activity
- Owner

Company cell:

Name  
Domain  
Industry

Click row:

Open Account Detail.

---

# 11. Account Detail Screen

Route:

`/accounts/[id]`

Example:

`/accounts/company_acme`

Template:

`RecordDetailTemplate`

## 11.1 Primary User Question

> What is the complete relationship between our company and this account?

---

## 11.2 Header

Display:

Acme Inc

Domain:

acme.com

Industry:

Technology

Employees:

500–1,000

Location:

Stockholm, Sweden

Owner:

Igor Kraisnik

---

## 11.3 Account KPI Strip

Display:

- Known Contacts
- Sessions
- Open Opportunities
- Open Pipeline
- First Seen
- Last Activity

---

## 11.4 Known Contacts

Organism:

`<AccountContacts />`

Rows/cards:

John Smith  
VP Product  
Primary contact

Sarah Johnson  
CTO

Michael Brown  
CEO

Show:

- role,
- first touch,
- last activity,
- opportunity involvement.

Click:

Open Lead Detail.

---

## 11.5 Opportunities

Compact table.

Columns:

- Opportunity
- Stage
- Value
- Owner
- Expected close

Acme:

AI Transformation Platform  
Proposal  
€120K

---

## 11.6 Account Attribution

Show account-level summary separately from person attribution.

Suggested:

```text
Earliest account touch
Google Organic · John Smith

Latest marketing influence
LinkedIn Organic · Sarah Johnson

Relationship influence
Michael Brown · introduced by Lena Holm (personal network)
```

Definitions: 00_DECISIONS.md §5.6.

This area must explicitly communicate that account journeys aggregate multiple people.

---

## 11.7 Account Journey

Use:

`<JourneyTimeline mode="account" />`

Include events from:

- all known people,
- company-level events,
- meetings,
- opportunities.

Event rows should identify actor where relevant.

Example:

```text
Sep 18 · John Smith
Opportunity created
AI Transformation Platform · €120K
```

---

# 12. Attribution Screen

Route:

`/attribution`

Template:

`AnalyticsTemplate`

## 12.1 Primary User Question

> Which acquisition sources generate leads, pipeline and revenue under different attribution perspectives?

---

## 12.2 Header

Title:

**Attribution**

Subtitle:

Compare how acquisition sources contribute to pipeline and revenue.

Right:

Date range selector.

---

## 12.3 Attribution Model Selector

Critical interaction.

Component:

`<AttributionModelSelector />`

Options:

- First Touch
- Last Marketing Touch
- Conversion Touch

Use segmented control or compact tabs.

Default:

First Touch

Changing model must update:

- KPI values where relevant,
- charts,
- source table,
- opportunity examples.

---

## 12.4 Attribution Context

Directly under selector:

Small explanatory sentence.

### First Touch

Credits value to the earliest known acquisition touch.

### Last Marketing Touch

Credits value to the last meaningful marketing touch before conversion.

### Conversion Touch

Credits value to the channel/session where the lead converted.

Do not hide methodology.

---

## 12.5 KPI Strip

Metrics:

- Attributed Leads
- Attributed Open Pipeline
- Attributed Won Revenue
- Average Won Deal

Use selected attribution model.

---

## 12.6 Source Performance Visualization

Preferred:

Ranked horizontal bars.

Metric selector:

- Pipeline
- Revenue
- Opportunities
- Leads

Click source:

Apply source filter to rest of page.

---

## 12.7 Attribution Table

Organism:

`<AttributionTable />`

Columns:

- Source
- Leads
- Qualified
- Opportunities
- Won
- Lead → Opp %
- Open Pipeline
- Revenue
- Avg Deal

Rows:

Google Organic  
Google Ads  
LinkedIn Organic  
LinkedIn Ads  
Referral  
Event  
Direct  
Meta  
Email  
Unknown

In First Touch and Last Marketing Touch, the Direct row is always zero and is hidden; Direct appears only under Conversion Touch. **Unknown** collects leads with no detected marketing touch. Clicking the Unknown row opens the drilldown with Vector Group and Atlas Systems (demo route to Vector).

---

## 12.8 Attribution Comparison

Signature organism:

`<AttributionComparison />`

Purpose:

Demonstrate that a single opportunity can be interpreted differently.

Default hero:

Acme — €120K

Display:

```text
First Touch
Google Organic

Last Marketing Touch
LinkedIn Organic

Conversion
Direct / Contact Form
```

When global attribution model changes:

Highlight the currently credited source.

Include:

`Why?`

---

## 12.9 Source Drilldown

When source selected:

Show:

- opportunities attributed to source,
- companies,
- total pipeline,
- total revenue.

Example:

```text
LinkedIn Organic

4 Opportunities
€200K Open Pipeline
€55K Revenue
```

Then table of relevant accounts.

---

# 13. Journeys Screen

Route:

`/journeys`

Template:

`JourneyTemplate`

**Priority: P2** — kept, deprioritised; must not block the demo (00_DECISIONS.md §10.6).

## 13.1 Primary User Question

> What paths are inbound leads taking before and after conversion?

---

## 13.2 Header

Title:

**Journeys**

Subtitle:

Explore complete customer paths across marketing, website, communication and sales.

---

## 13.3 Filters

- Source
- Conversion
- Stage
- Journey Length
- Attribution Status
- Date Range

Search:

Person or company.

---

## 13.4 Journey List

Preferred:

Dense table rather than card grid.

Columns:

- Person
- Company
- Path
- Touches
- Conversion
- Journey Duration
- Current Stage
- Value

Example Path cell:

```text
Google → LinkedIn → Direct → Contact Form
```

Use compact source icons. The Path column is the primary visual of this screen.

Path rule (00_DECISIONS.md §5.8): sources of all touchpoints up to and including the conversion session, consecutive duplicates merged, followed by the conversion mechanism. Direct **is** shown in paths — the path is history; attribution is an interpretation of it.

Click:

Open Lead Detail focused on Journey.

Optional:

Query parameter:

`?tab=journey`

---

## 13.5 Journey Duration

Examples:

11 days  
3 hours  
24 days

This should help illustrate complexity of B2B conversion.

---

# 14. Integrations Screen

Route:

`/integrations`

Template:

`IntegrationTemplate`

## 14.1 Primary User Question

> Which systems contribute data to the unified journey, and are those connections healthy?

---

## 14.2 Header

Title:

**Integrations**

Subtitle:

Sources feeding acquisition, behavioral, communication and sales data.

---

## 14.3 Integration Groups

Sections:

Canonical list, order and statuses: 00_DECISIONS.md §10.7. The first-party **Website Tracker** is shown first with a one-line note: "Enables person-level journey stitching."

---

## 14.4 Integration Grid

Organism:

`<IntegrationGrid />`

Each card:

```text
Google Ads
Advertising

Connected

Last sync
8 min ago

32 campaigns
```

CTA:

`Manage`

Keep cards compact.

Avoid oversized provider logos.

---

## 14.5 Status Treatment

Connected:

Success.

Attention:

Warning.

Disconnected:

Muted/danger depending on context.

Archived:

Neutral muted.

Examples:

HubSpot:

Attention — switches off 17 Oct 2026, moving to Sales Tracker; journey history preserved

Cal.com:

Archived

Make.com:

Archived

---

## 14.6 Manage Modal

Prototype-only.

Display:

- integration name,
- status,
- sync frequency,
- last sync,
- imported records,
- data types.

Buttons may be visual-only.

---

# 15. Ask Inbound Screen

Route:

`/ask-inbound`

## 15.1 Primary User Question

> Can I interrogate the customer and revenue data conversationally while still seeing the evidence behind the answer?

---

## 15.2 Design Principle

This must not look like a standalone generic chatbot.

It should feel like an intelligence interface inside the product.

---

## 15.3 Screen Structure

```text
Page Header
↓
Prompt Input
↓
Suggested Questions
↓
Answer Area
  ├── Narrative
  ├── Structured Facts
  ├── Evidence
  └── Related Actions
```

---

## 15.4 Header

Title:

**Ask Inbound**

Subtitle:

Ask questions across attribution, accounts, journeys, pipeline and revenue.

---

## 15.5 Prompt Input

Large but restrained input.

Placeholder:

`Ask about leads, journeys, pipeline or attribution…`

Suggested prompt chips:

- Where did Acme come from?
- Which channel generated the most pipeline?
- Show leads waiting for a reply.
- What are our biggest unattributed opportunities?
- Which source has the highest conversion rate?

---

## 15.5a Free-Text Behaviour

Typed input is keyword-matched to the five canonical intents ("acme" → 1; "pipeline" → 2; "reply", "waiting" → 3; "unattributed", "unknown" → 4; "conversion rate" → 5). No match → "This prototype answers these questions:" with the five chips. Answers are computed by `lib/` functions and state the attribution model where relevant (00_DECISIONS.md §10.8).

---

## 15.6 Answer Pattern

Example:

Question:

`Where did Acme come from?`

Answer:

Acme's first known interaction was through Google Organic on September 3. John Smith returned through LinkedIn on September 11 and converted through a direct visit to the contact form on September 14.

Structured facts:

```text
First Touch
Google Organic

Last Marketing Touch
LinkedIn Organic

Conversion
Direct / Contact Form

Opportunity
€120K · Proposal
```

Evidence:

- Sep 3 Google Organic visit
- Sep 11 LinkedIn visit
- Sep 14 form submission

CTA:

`Open Acme journey →`

---

## 15.7 Evidence Pattern

Use:

`<EvidenceList />`

Every answer should link to underlying data.

Do not display unsupported AI-style conclusions.

---

# 16. Settings Screen

Removed from the prototype (00_DECISIONS.md §10.2).

---

# 17. Cross-Screen Interaction Rules

## 17.1 Source Drilldown

Source clicks should behave consistently.

Example:

LinkedIn click from:

- Overview,
- Attribution,
- Lead Detail,

should lead to Attribution filtered to LinkedIn, or open the same drilldown context.

---

## 17.2 Person Navigation

Clicking a person always opens:

`/leads/[personId]`

---

## 17.3 Company Navigation

Clicking a company always opens:

`/accounts/[companyId]`

---

## 17.4 Opportunity Navigation

For the prototype, opportunity detail may remain embedded in Lead/Account Detail.

If standalone opportunity routes are not implemented, opportunity clicks should open the linked Account or Lead Detail.

---

## 17.5 "Why?" Pattern

Every attribution explanation uses the same component.

Do not create separate explanation UI per screen.

---

# 18. Loading States

Data is local and synchronous. One route-level `loading.tsx` at most; no per-page skeletons (00_DECISIONS.md §10.2).

---

# 19. Empty States

Use concise factual messaging.

Examples:

### Leads

```text
No leads match these filters.

Clear filters or change the date range.
```

### Attribution

```text
No attributed opportunities found for this period.
```

### Journeys

```text
No journeys match the selected filters.
```

Avoid illustrations.

---

# 20. Error States

Example integration error:

```text
LinkedIn data could not be refreshed.

Last successful sync:
24 minutes ago

Retry sync
```

Do not block the entire product because one integration is stale.

---

# 21. Responsive Rules

Primary target:

1280px–1600px desktop.

At smaller widths:

- sidebar may collapse,
- KPI strip may wrap,
- right context rail may stack,
- tables may horizontally scroll,
- charts retain readable labels.

Mobile is not required for V1.

---

# 22. Accessibility Requirements

Required:

- keyboard navigation,
- visible focus states,
- tooltip labels for icon-only buttons,
- sufficient contrast,
- semantic headings,
- labels on form controls,
- status communicated with icon/text, not color alone.

---

# 23. Atomic Design Mapping by Screen

*v0.2: atoms = `components/ui`, molecules/domain primitives = `components/domain`, organisms = `components/features`, templates = `components/layout` (00_DECISIONS.md §12).*

## Overview

Atoms:

- Text
- MetricValue
- Badge
- Icon

Molecules:

- MetricCard
- DateRangeSelector
- SourceBadge

Organisms:

- PipelineBySource
- RevenueBySource
- ConversionFunnel
- DataQualityPanel
- LeadTable

Template:

DashboardTemplate

---

## Leads

Atoms:

- Input
- Badge
- Avatar
- Timestamp

Molecules:

- SearchField
- FilterSelect
- FilterChip
- PersonIdentity
- CompanyIdentity
- SourceBadge
- StageBadge
- OwnerChip

Organisms:

- FilterBar
- LeadTable

Template:

ListTemplate

---

## Lead Detail

Atoms:

- Text
- MetricValue
- Divider
- Icon

Molecules:

- PersonIdentity
- CompanyIdentity
- SourceBadge
- OpportunityValue
- TimelineMeta

Organisms:

- AttributionSummary
- EngagementSummary
- OpportunitySummary
- JourneyTimeline
- AccountContacts

Template:

RecordDetailTemplate

---

## Accounts

Molecules:

- CompanyIdentity
- SourceBadge
- OwnerChip
- OpportunityValue

Organisms:

- FilterBar
- AccountTable

Template:

ListTemplate

---

## Account Detail

Organisms:

- AccountContacts
- OpportunitySummary
- AttributionSummary
- JourneyTimeline

Template:

RecordDetailTemplate

---

## Attribution

Molecules:

- MetricCard
- SourceBadge
- FilterChip

Organisms:

- AttributionModelSelector
- AttributionTable
- AttributionComparison
- PipelineBySource
- RevenueBySource

Template:

AnalyticsTemplate

---

## Journeys

Molecules:

- PersonIdentity
- CompanyIdentity
- SourceBadge
- StageBadge

Organisms:

- FilterBar
- JourneyTable

Template:

JourneyTemplate

---

## Integrations

Molecules:

- IntegrationStatus

Organisms:

- IntegrationGrid

Template:

IntegrationTemplate

---

## Ask Inbound

Molecules:

- PromptChip
- SourceBadge
- OpportunityValue

Organisms:

- AskInboundPanel
- EvidenceList

Template:

Conversation/Analytics hybrid

---

# 24. Claude Code Implementation Rules

Claude Code should follow these rules while implementing screens:

1. Reuse components from `ui/`, `domain/`, `features/` and `layout/`; follow the dependency direction `app → features → domain → ui`.
2. Do not introduce raw hex colors in JSX.
3. Do not create business logic inside page components.
4. Do not manually hardcode dashboard metrics when they can be derived.
5. All timeline events must come from the Event model.
6. All attribution summaries must come from attribution logic.
7. All source labels must use the shared source mapping.
8. All money formatting must use the shared MoneyValue formatter/component.
9. All person/company navigation must use canonical routes.
10. All hero records must exactly match the Seed Data Specification.
11. Unknown attribution must remain unknown.
12. Relationship attribution must not silently overwrite detected attribution.
13. Keep visual density high but readable.
14. Prefer borders and spacing over excessive cards.
15. Use MOP Red selectively.
16. Do not create gradient-heavy or neon SaaS styling.
17. Do not build standalone AI-chat styling for Ask Inbound.
18. Every analytical summary should allow a path to underlying evidence.

---

# 25. Build Order by Screen

Recommended implementation order:

## Phase 1

- Application shell
- Sidebar
- Global header
- Tokens
- Core atoms/molecules

## Phase 2

- Overview
- Leads
- Lead Detail

These three screens must be presentation-quality first.

## Phase 3

- Accounts
- Account Detail
- Attribution

## Phase 4

- Integrations
- Ask Inbound
- Journeys (P2)

## Phase 5

- Not-found and empty states
- Error states
- Responsive polish
- Accessibility pass
- Demo-path QA

---

# 26. Management Demo Critical Path

The following path must be flawless (00_DECISIONS.md §11):

```text
Overview
↓
Recent Inbound
↓
John Smith / Acme
↓
Attribution Summary → Why?
↓
Customer Journey (assembled from N systems)
↓
Acme Inc account journey
↓
Attribution
↓
First Touch → Conversion Touch → Last Marketing Touch
↓
Unknown row → Vector Group / Attribution incomplete
↓
Ask Inbound
↓
Integrations
```

Any defect on this path blocks prototype readiness.

---

# 27. Screen Definition of Done

A screen is considered complete when:

- it answers its primary user question immediately,
- it uses approved components,
- it uses seeded data correctly,
- navigation works,
- filters or controls work where required,
- loading/empty states exist,
- business logic is not duplicated in UI,
- visual hierarchy prioritizes revenue, attribution, identity and journey,
- no placeholder content remains,
- no inconsistent source/stage labels exist,
- screen appearance matches DESIGN_SYSTEM.md.

---

# 28. Final UX Principle

Every screen should help the user move from:

**summary**

to:

**specific record**

to:

**underlying evidence**

without losing context.

This is the defining interaction model of the product.
