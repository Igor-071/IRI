# Inbound Revenue Intelligence
## 00_DECISIONS.md — Pre-Implementation Decisions
### v0.2 · 2026-09-27

## 0. How to Use This Document

This document resolves the contradictions, gaps and impossible targets found in the v0.1 package.

**It is the highest authority for data, logic, metric definitions, scope and architecture.** Where any other document conflicts with it, this document wins.

Source-of-truth hierarchy (replaces 08 §2):

| Priority | Document | Authoritative for |
|---|---|---|
| 1 | `00_DECISIONS.md` | Decisions, rules, metric definitions, targets, scope, architecture |
| 2 | `03_DATA_MODEL_EVENT_TAXONOMY.md` | Types, event taxonomy, attribution logic |
| 3 | `04_SEED_DATA_SPECIFICATION.md` | Canonical records, hero journeys, seed numbers |
| 4 | `05_DESIGN_SYSTEM.md` | Visual system and component rules |
| 5 | `06_SCREEN_SPECIFICATIONS.md` | Screen composition |
| 6 | `07_USER_FLOWS.md` | Navigation and interaction behaviour |
| 7 | `02_PROTOTYPE_REQUIREMENTS.md` | Functional scope |
| 8 | `01_PRODUCT_BRIEF.md` | Product intent and positioning only |
| 9 | `08_CLAUDE_CODE_BUILD_INSTRUCTIONS.md` | Build sequencing and implementation rules |

**Illustrative figures rule:** any number, value or record that appears outside `00` and `04` is illustrative. Never seed it. Always derive displayed values from seed data.

**Repository layout:** `CLAUDE.md` sits in the repository root. All numbered documents live in `documentation/`. Do not move them.

---

## 1. Global Constants

```ts
export const NOW = "2026-09-27T12:00:00+02:00" // fixed demo "today"
export const TIMEZONE = "Europe/Sarajevo"
export const LOCALE = "en-GB"
export const CURRENCY = "EUR"
export const DEFAULT_RANGE = "this_year"       // Jan 1 2026 → NOW
```

Rules:

- Never call `Date.now()` or `new Date()` without arguments in application code. All relative times ("1d ago", "waiting 3d 6h") are computed against `NOW`.
- Format all dates with explicit `LOCALE` and `TIMEZONE` so server and client render identical strings (no hydration mismatch).
- All seed timestamps are ISO 8601 with offset, Europe/Sarajevo time.

---

## 2. Product Framing

**Internal first, productisable later.**

The prototype is framed as MOP's own inbound intelligence layer, using MOP's real tool stack and workspace. The architecture and language stay product-grade so it can later be offered to clients.

A small **"Sample data"** marker is shown in the global header next to the workspace name, so management does not read seeded figures as real MOP results.

---

## 3. Core Vocabulary

### 3.1 Lead

A **Lead** is a Person who has at least one `lead_created` event.

- There is no separate Lead entity. `/leads/[id]` uses the Person ID.
- A Person without `lead_created` is a **Contact** (e.g. Michael Brown at Acme). `/leads/[personId]` still renders, labelled "Contact", with the attribution section replaced by: "Not converted — no lead attribution." Relationship attribution, if any, is still shown.
- **Inbound Leads count** = Persons whose `lead_created` timestamp falls inside the selected range.

### 3.2 Display Stage (single derived stage)

Persons no longer store `lifecycleStage`. Every screen shows one derived **Display Stage**:

```text
If the person is primary contact of an opportunity → that opportunity's stage
Otherwise → the person's leadStatus
```

Display Stage values, in order:

`New · Contacted · Qualified · Discovery · Proposal · Negotiation · Won · Lost · Disqualified`

This single vocabulary is used for the Leads "Stage" column, the Stage filter, the Lead Detail header badge and the Journeys table.

Stored enums:

```ts
leadStatus: "new" | "contacted" | "qualified" | "disqualified"
opportunity.stage: "discovery" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
```

(`new` is removed from opportunity stages. Opportunities are created at Discovery or Qualified.)

### 3.3 Owners

Canonical owner list, used by every owner filter and chip:

`Igor Kraisnik · Elma Šemović · Adnan Ahmethodžić · Marketing Team · Unassigned`

IDs: `usr_igor`, `usr_elma`, `usr_adnan`, `usr_marketing`. Elma Šemović — Business Development; Adnan Ahmethodžić — Sales.

### 3.4 Labels

- The model `last_touch` is always labelled **"Last Marketing Touch"** in the UI. Never "Last Touch".
- The conversion column is labelled **"Conversion"** and shows `Channel / Mechanism`, e.g. `Direct / Contact Form`.

---

## 4. Sources

One canonical source config in `lib/config/sources.ts`. No channel grouping anywhere in the UI. Every chart, table, filter and drilldown uses these ten values 1:1.

| Key | Label | Marketing touch? | Notes |
|---|---|---|---|
| `google_organic` | Google Organic | Yes | |
| `google_ads` | Google Ads | Yes | |
| `linkedin_organic` | LinkedIn Organic | Yes | |
| `linkedin_ads` | LinkedIn Ads | Yes | |
| `meta` | Meta | Yes | |
| `referral` | Referral (web) | Yes | A referring **website** (partner site, directory, article). Not a human referral. |
| `event` | Event | Yes | Imported/manual event attendance or event referral |
| `email` | Email | Yes | Marketing email / newsletter click (Kit) |
| `direct` | Direct | **No** | Valid session source and conversion channel. Never credited as first or last marketing touch. |
| `unknown` | Unknown | — | Attribution bucket only. Never a session source. |

`partner` is removed from `AcquisitionSource`. Partner or client introductions are **relationship attribution** (§5.7).

Human referrals are always labelled **"Relationship"**, never "Referral", to avoid collision with `referral` (web).

---

## 5. Attribution Rules

### 5.1 Touchpoints (concept kept, derived in V1)

Touchpoint remains a first-class concept in the data model. In V1 it is **derived, not stored**:

```ts
deriveTouchpoints(personId): Touchpoint[]
```

- One touchpoint per **Session** linked to the person (including pre-identification sessions of linked visitors). Source, campaign, landing page, referrer and UTM values come from the session.
- One touchpoint per **sessionless acquisition Event** (e.g. `event_referral` imported from an event attendee list, `campaign_clicked` from Kit without a tracked session).
- **Relationship attribution never becomes a touchpoint.** It stays a separate record (§5.7).
- Touchpoints carry **no role field**. Whether a touchpoint is "first", "last marketing" or "conversion" is decided by the attribution model at query time.
- `isMarketingTouch = source !== "direct"`.

All attribution consumers — the three models, `<AttributionExplanation />`, Ask Inbound, Journeys paths — use `deriveTouchpoints`.

### 5.2 Conversion

The **conversion** is the person's first `lead_created` event. Mechanism comes from the triggering event:

| Triggering event | Mechanism |
|---|---|
| `form_submitted` (contact form) | Contact Form |
| `meeting_requested` / booking page | Book a Call |
| `email_inquiry_received` | Email Inquiry |
| `newsletter_subscribed` | Newsletter Signup |

**Conversion channel** = source of the session in which the conversion happened.

An email inquiry is linked to a session if the same person had a tracked session in the 30 minutes before the email. Otherwise the conversion channel is **Unknown** (mechanism is still known).

### 5.3 The three models

| Model | Credited source |
|---|---|
| `first_touch` — First Touch | Earliest touchpoint with `isMarketingTouch` before the conversion. None → `unknown`. |
| `last_touch` — Last Marketing Touch | Latest touchpoint with `isMarketingTouch` before the conversion. None → `unknown`. |
| `conversion_touch` — Conversion Touch | Conversion channel (may be `direct`). Not linkable → `unknown`. |

Consequence: in First Touch and Last Marketing Touch views the **Direct row is always empty** and is hidden. Direct appears only under Conversion Touch.

### 5.4 Attribution status (per lead)

```text
Full     = ≥1 detected marketing touch before conversion
           AND conversion channel known

Partial  = conversion known, but EITHER
             (a) no detected marketing touch, with self-reported or relationship evidence
             (b) detected marketing touch, but conversion channel unknown

Unknown  = no detected marketing touch AND no self-reported or relationship evidence
```

Hero check:

| Record | Detected marketing touch | Conversion channel | Human evidence | Status |
|---|---|---|---|---|
| Acme / John Smith | Google Organic, LinkedIn Organic | Direct | Self-reported | Full |
| Atlas / Thomas Weber | none | Direct | Self-reported + relationship | Partial (a) |
| Vector / Anna Keller | none | Direct | none | Unknown |
| Meridian / Marta Novak | Event, Google Organic | Google Organic (linked email inquiry) | Self-reported | Full |

Status is computed, never stored.

### 5.5 Opportunity attribution

An opportunity takes the **computed attribution of its primary contact**. Opportunities store no attribution fields. Revenue and pipeline are credited 100% to the source chosen by the active model (no fractional attribution).

### 5.6 Account attribution (Account Detail only)

| Field | Definition |
|---|---|
| Earliest account touch | Earliest marketing touchpoint across all people at the company (show person) |
| Latest marketing influence | Latest marketing touchpoint across all people at the company before the most recent opportunity was created (or before NOW if none) (show person) |
| Relationship influence | Any RelationshipAttribution on the company or its people (show person and source) |

Account attribution is displayed only on Account Detail and is never used in aggregate charts.

### 5.7 Self-reported and relationship attribution

- Self-reported: stored on Person as `selfReportedSource` + `selfReportedAt`. Displayed, never used in the three models.
- Relationship: stored as `RelationshipAttribution` records (person and/or company). Displayed, never used in the three models.
- The Overview Data Quality panel shows one line: **"Revenue with relationship attribution only: €180K (1 deal)"** — derived as won revenue whose primary contact has status Partial (a) with relationship evidence.

### 5.8 Journey path (Journeys screen, Ask Inbound)

```text
path = sources of all touchpoints up to and including the conversion session, in order
       → consecutive duplicates merged
       → followed by the conversion mechanism
```

Direct **is** shown in paths. The path is history; attribution is an interpretation of it.

Acme: `Google Organic → LinkedIn Organic → Direct → Contact Form`

---

## 6. Data Model Changes (03 amended)

**Stored in V1:**
Workspace, User, Person, Company, Session, Event, Opportunity, Campaign, Integration, RelationshipAttribution.

**Conceptual / derived in V1:**

| Concept | V1 representation |
|---|---|
| Visitor | `visitorId` on Session and Event; visitor view derived |
| Touchpoint | `deriveTouchpoints()` (§5.1) |
| Conversation, Message | Events in `communication` category; subject, bodyPreview, direction in `metadata` |
| Meeting | Events in `meeting` category; `meetingId`, title, durationMinutes, attendees in `metadata` |

**Field changes:**

- Person: remove `lifecycleStage`, `firstTouchId`, `lastMarketingTouchId`, `conversionTouchId`, `attributionStatus`. Add `selfReportedAt`.
- Company: remove `primarySource`, `attributionStatus`.
- Opportunity: remove `firstTouchSource`, `lastTouchSource`, `conversionSource`. Remove stage `new`. Add `contactIds: string[]`, `lostReason?: string`, `lostAtStage?: Stage`.
- Touchpoint type: remove `type` role field; add `kind: "session" | "event"` and `isMarketingTouch: boolean`.
- AcquisitionSource: remove `partner`.
- Integration status: add `"archived"`.
- SourceSystem: add `"email"` (mailbox) and `"cal_com"` (historical bookings).
- Stage history: derived from `opportunity_created` (metadata.stage) and `opportunity_stage_changed` events.

---

## 7. Metric Definitions

| Metric | Definition | Date field |
|---|---|---|
| Inbound Leads | Persons with `lead_created` in range | `lead_created` |
| Opportunities | Opportunities created in range | `createdAt` |
| Won Deals / Won Revenue | Count / sum of won opportunities | `closedAt` |
| Open Pipeline | Sum of open opportunity values (discovery → negotiation). **Snapshot as of NOW; ignores range.** Labelled "as of today". | — |
| Lead → Opportunity % | Leads in range that are primary contact of ≥1 opportunity ÷ leads in range | `lead_created` |
| Qualified (funnel, table) | Leads whose leadStatus is qualified OR who are primary contact of an opportunity | `lead_created` |
| Proposals (funnel) | Opportunities that reached Proposal or later (stage events), including won and lost-after-proposal | `createdAt` |
| Avg. First Response | Mean minutes from `lead_created` to the first outbound `email_sent`, over leads that received one. Calendar time (no business hours). Leads with no response are excluded and surface as "waiting". | `lead_created` |
| Waiting for reply | Latest communication event for the person is inbound (`email_received`) AND older than 72h before NOW AND display stage is not Won/Lost/Disqualified | — |
| Stalled | Open opportunity with no event for 10+ days before NOW | — |
| Attribution Coverage | Full leads ÷ leads (58/80 = 72.5% → displayed **73%**) | `lead_created` |
| Sessions | Distinct `sessionId`s on the person's events | — |
| Page Views | Count of `page_viewed`, `landing_page_viewed`, `contact_page_viewed`, `pricing_page_viewed`, `blog_post_viewed`, `case_study_viewed`, `resource_viewed` | — |
| Content Viewed | Count of events in `content` category | — |
| Emails | Count of `email_sent` + `email_received` | — |
| Meetings | Distinct `meetingId`s with booked or completed status | — |
| Days to Lead | Days from first touchpoint (any source) to conversion | — |

**No trend deltas** ("+12%") in V1. KPI cards show label, value and optional context line only.

---

## 8. Date Range Rules

- The date range selector lives in the **page header of Overview and Attribution only**, stored as `?range=`. It is removed from the global header.
- Options: Last 7 Days · Last 30 Days · Last 90 Days · This Quarter · This Year. **Default: This Year.**
- Drilldown links from Overview to Attribution carry `?range=`.
- Leads keeps its own Date filter (independent of Overview).
- Targets in §9 apply to the default range (This Year = all seed data).

---

## 9. Seed Data

### 9.1 Generation method (ledger-first)

1. **Heroes** are hand-written in `data/heroes/*.ts`.
2. **The opportunity ledger (§9.2)** is hand-written. It fixes every opportunity's company, primary contact, value, stage, first-touch source and dates.
3. `scripts/generate-seed.ts` generates the remaining companies, leads, sessions and events **backward from the ledger** using a seeded PRNG (e.g. mulberry32, fixed seed). Output is **checked in** as `data/generated/*.ts`. Nothing is generated at render time.
4. `validateSeedData()` and Vitest assert the targets in §14.

Claude Code may fill unspecified hero details (dates, domains, secondary events) as long as they are consistent with this document and 04.

### 9.2 Opportunity ledger (26 opportunities)

**Won — 10 — €740,000**

| ID | Company | Opportunity | Value | First Touch | Owner | Created | Closed |
|---|---|---|---:|---|---|---|---|
| opp_atlas_ai | Atlas Systems | AI Discovery & Prototype Program | 180,000 | unknown (relationship) | Igor | Jul 15 | Sep 12 |
| opp_meridian_visibility | Meridian Logistics | Logistics Visibility Platform | 140,000 | event | Elma | Apr 14 | Aug 28 |
| opp_brightline_energy | Brightline Energy | Energy Data Platform | 95,000 | referral | Adnan | Apr 22 | Jul 16 |
| opp_kestrel_portal | Kestrel Automotive | Connected Vehicle Portal | 85,000 | referral | Elma | Feb 18 | Jun 5 |
| opp_lumen_portal | Lumen Financial | Customer Portal Rebuild | 60,000 | google_organic | Adnan | Mar 10 | May 20 |
| opp_solvik_discovery | Solvik Group | Product Discovery Sprint | 55,000 | linkedin_organic | Igor | May 5 | Jul 2 |
| opp_fjord_mvp | Fjord Analytics | Analytics MVP | 45,000 | google_organic | Elma | Jun 2 | Aug 7 |
| opp_praxis_platform | Praxis Consulting | Client Platform Refresh | 30,000 | google_ads | Adnan | Jan 27 | Mar 20 |
| opp_tessera_prototype | Tessera Insurance | Claims Prototype | 25,000 | linkedin_ads | Elma | Jun 16 | Aug 14 |
| opp_verde_audit | Verde Mobility | UX & Architecture Audit | 25,000 | google_ads | Adnan | Jul 20 | Sep 4 |

**Lost — 5**

| ID | Company | Opportunity | Value | First Touch | Owner | Lost at | Closed | Reason |
|---|---|---|---:|---|---|---|---|---|
| opp_helix_payments | Helix Finance | Payments Modernization | 95,000 | linkedin_ads | Elma | Proposal | Aug 21 | Timing / internal priority shift |
| opp_halden_platform | Halden Manufacturing | Factory Data Platform | 75,000 | google_organic | Adnan | Proposal | Jun 18 | Chose in-house team |
| opp_norrland_pilot | Norrland Energy | Grid Analytics Pilot | 50,000 | linkedin_organic | Igor | Discovery | Sep 8 | No decision |
| opp_vireo_commerce | Vireo Retail Group | Commerce Replatform | 45,000 | google_ads | Adnan | Discovery | Aug 1 | Budget |
| opp_coral_booking | Coral Hospitality | Booking Experience Redesign | 40,000 | meta | Adnan | Qualified | Jul 10 | Low fit |

**Open — 11 — €1,250,000**

| ID | Company | Opportunity | Value | Stage | First Touch | Owner | Created | Expected close |
|---|---|---|---:|---|---|---|---|---|
| opp_stratum_banking | Stratum Bank | Digital Banking Platform | 220,000 | Negotiation | linkedin_ads | Igor | Jul 22 | Oct 24 |
| opp_vector_operations | Vector Group | Digital Operations Platform | 160,000 | Qualified | unknown | Igor | Sep 17 | Dec 15 |
| opp_baltic_tracking | Baltic Freight Group | Shipment Tracking Platform | 140,000 | Proposal | google_organic | Adnan | Aug 12 | Oct 30 |
| opp_acme_ai | Acme Inc | AI Transformation Platform | 120,000 | Proposal | google_organic | Igor | Sep 18 | Oct 18 |
| opp_veldt_platform | Veldt Partners | Client Intelligence Platform | 120,000 | Proposal | referral | Elma | Aug 18 | Oct 31 |
| opp_aurora_fleet | Aurora Mobility | Fleet Operations Suite | 110,000 | Qualified | linkedin_organic | Igor | Sep 1 | Nov 14 |
| opp_nordica_product | Nordica Labs | Product Intelligence Platform | 90,000 | Discovery | linkedin_organic | Adnan | Sep 20 | Dec 5 |
| opp_hartmann_inspection | Hartmann Industrie | AI Quality Inspection | 90,000 | Discovery | referral | Elma | Sep 10 | Dec 12 |
| opp_northstar_digital | Northstar Health | Digital Patient Platform | 75,000 | Negotiation | google_ads | Elma | Aug 26 | Oct 10 |
| opp_cobalt_personalization | Cobalt Retail Tech | Personalization Engine | 65,000 | Discovery | google_ads | Adnan | Sep 16 | Nov 28 |
| opp_polaris_portal | Polaris Energy | Customer Energy Portal | 60,000 | Qualified | event | Adnan | Sep 3 | Nov 20 |

All dates are 2026. All won opportunities passed through Proposal. Proposals reached = 5 open (Proposal/Negotiation) + 10 won + 2 lost at Proposal = **17**.

### 9.3 Lead distribution (80 leads)

**By First Touch bucket (under §5 rules):**

| Source | Leads | Opportunities | Won | Open Pipeline | Won Revenue | Lead → Opp |
|---|---:|---:|---:|---:|---:|---:|
| Google Organic | 17 | 5 | 2 | €260K | €105K | 29% |
| Google Ads | 15 | 5 | 2 | €140K | €55K | 33% |
| LinkedIn Organic | 12 | 4 | 1 | €200K | €55K | 33% |
| LinkedIn Ads | 8 | 3 | 1 | €220K | €25K | 38% |
| Referral (web) | 6 | 4 | 2 | €210K | €180K | **67%** |
| Event | 4 | 2 | 1 | €60K | €140K | 50% |
| Meta | 5 | 1 | 0 | €0 | €0 | 20% |
| Email | 2 | 0 | 0 | €0 | €0 | 0% |
| Unknown | 11 | 2 | 1 | €160K | €180K | 18% |
| **Total** | **80** | **26** | **10** | **€1,250K** | **€740K** | **32.5%** |

The four business lessons (04 §37) now hold in the data:

1. Google Ads: 15 leads → €55K revenue. Volume ≠ value.
2. Referral (web): 6 leads, 67% lead → opportunity, €180K revenue.
3. Acme moves between Google Organic / LinkedIn Organic / Direct across models.
4. Unknown holds €180K revenue (Atlas, relationship-only) and €160K open pipeline (Vector).

**By attribution status:** Full 58 · Partial 15 · Unknown 7.

- Unknown bucket (11) = 7 Unknown-status leads + 4 Partial (a) leads (Atlas + 3 generated relationship/self-reported leads).
- The other 11 Partial leads are type (b): detected first touch, unlinked email inquiry or calendar booking; they sit in their source buckets under First/Last Marketing Touch and in Unknown under Conversion Touch.

**Multi-touch requirement:** at least 30% of Full leads must have a different source for First Touch vs Last Marketing Touch, and about half of all conversions must happen in Direct sessions, so switching models visibly moves value.

**By Display Stage:** 26 opportunity primary contacts (stages per ledger) + 54 others: Qualified 18 · Contacted 14 · New 12 · Disqualified 10. Qualified funnel count = 26 + 18 = **44**.

New leads are owned by **Unassigned**.

### 9.4 Acme hero corrections

The full Acme event list in 04 §9 is canonical and now reproduces the engagement totals exactly (5 sessions, 17 page views, 4 content, 9 emails, 2 meetings, 11 days to lead, 17 min first response).

Additional Acme people:

- **Sarah Johnson (CTO)** — is a lead. Sep 15 LinkedIn Organic visit (campaign LinkedIn Founder Content) → blog post → newsletter signup (lead created, mechanism Newsletter Signup, channel LinkedIn Organic, status Full). Attends Sep 22 proposal scoping meeting. Listed in `opp_acme_ai.contactIds`.
- **Michael Brown (CEO)** — a Contact, not a lead. Sep 17 note: introduced by Lena Holm, a former colleague of Igor Kraisnik. RelationshipAttribution `{ companyId: company_acme, personId: person_michael_brown, sourceType: "personal_network", sourceName: "Lena Holm" }`. CC'd on the proposal.

None of these change John Smith's attribution. Account attribution for Acme:

```text
Earliest account touch      Google Organic · John Smith · Sep 3
Latest marketing influence  LinkedIn Organic · Sarah Johnson · Sep 15
Relationship influence      Michael Brown · introduced by Lena Holm (personal network)
```

Email address is **john.smith@acme.com** everywhere.

### 9.5 Waiting / stalled records

- Anna Keller (Vector): last inbound email Sep 24 06:00 → **waiting 3d 6h** at NOW.
- Three generated leads waiting 3d 1h, 4d 2h and 5d 0h.
- At least two stalled open opportunities (no event for 10+ days) among generated records, and one proposal with no client reply.

---

## 10. Scope and Screen Decisions

### 10.1 Priority tiers

| Tier | Screens / behaviour |
|---|---|
| P0 | Shell, Overview, Leads, Lead Detail (+ Why?, journey), Account Detail (Acme), Attribution, Ask Inbound (Acme), Integrations, demo path |
| P1 | Accounts list, global search, leads/accounts filters, journey filters, integration modal, remaining Ask Inbound prompts |
| P2 | Journeys screen, keyboard shortcuts, persisted filter state |

### 10.2 Removed / reduced

- **Settings:** removed from navigation and routes.
- **Loading skeletons:** data is local and synchronous. One route-level `loading.tsx` at most. No per-page skeletons.
- **Accounts filters:** Source and Owner only.
- **Accounts "Primary Source" column:** removed.
- **Campaign reconciliation:** campaigns have no required lead/opportunity/pipeline counts. Campaign appears as metadata in the timeline, "Why?" and session data. The campaign filter is removed.
- **Website visitors in funnel:** excluded.
- **Brief data-quality extras** (duplicate contacts, missing campaign data, known company %): removed.
- **KPI trend deltas:** removed.

### 10.3 Overview

- Pipeline by Source and Revenue by Source use **First Touch** and label it: "First Touch · change model in Attribution".
- Data Quality panel: Full 58 / Partial 15 / Unknown 7 (each count clickable to `/leads?attribution=<status>`), coverage 73%, relationship-only revenue line (§5.7). CTA **"View unknown-attribution leads"** → `/leads?attribution=unknown`.
- Funnel: Leads 80 → Qualified 44 → Opportunities 26 → Proposals 17 → Won 10.

### 10.4 Lead Detail

- Header shows one Display Stage badge (no separate lifecycle / lead status).
- Every journey event shows a **source-system chip** (Website Tracker, GA4, LinkedIn, Resend, HubSpot, Sales Tracker, Email, Calendar…).
- Above the timeline: **"Journey assembled from N systems"** with the system chips.
- Consecutive low-emphasis page views within one session collapse into an expandable row ("3 pages viewed").

### 10.5 Attribution

- Model selector order: First Touch · Last Marketing Touch · Conversion Touch.
- Direct row hidden in First Touch and Last Marketing Touch (always zero).
- Clicking the **Unknown** row opens the drilldown listing Vector Group and Atlas Systems — this is the demo route to Vector.

### 10.6 Journeys (P2)

Kept, deprioritised. Minimum: dense table with the Path column as the primary visual (compact source icon chain, §5.8), Source filter, row click → `/leads/[id]?tab=journey`. Must not block the demo.

### 10.7 Integrations (canonical list — MOP's real stack)

| Category | Integration | Status | Card note |
|---|---|---|---|
| Analytics | **Website Tracker (first-party)** | Connected | Shown first. Part of this platform. Stitches anonymous sessions to known people — GA4 alone does not provide person-level journeys. |
| Analytics | GA4 | Connected | Site and form events |
| Analytics | Google Search Console | Connected | Organic search queries |
| Analytics | Hotjar | Connected | Session recordings — behaviour context, no journey events |
| Analytics | Google Business Profile | Connected | Local search and profile visits |
| Advertising | Google Ads | Connected | |
| Advertising | LinkedIn | Connected | Ads + Company Page (Business Manager) |
| Advertising | Meta | Attention | Ads + Facebook Pixel. Agency engagement wound down; no active campaigns |
| Inbound capture | Resend | Connected | Website contact form (replaced Formspree) |
| Inbound capture | HubSpot | Attention | CRM, forms, conversations. **Switches off 17 Oct 2026 → Sales Tracker. Journey history is preserved.** |
| Inbound capture | Kit (ConvertKit) | Connected | Email sequences and newsletter |
| Inbound capture | Cal.com | Archived | Booking. License archived; historical bookings retained |
| Inbound capture | Skybox + Trello | Connected | LinkedIn outbound and first-lead intake. Outbound-sourced leads are tagged and excluded from inbound metrics |
| Inbound capture | PhantomBuster | Disconnected | Being deactivated |
| CRM | Sales Tracker | Connected | HubSpot replacement. New CRM records from 15 Sep 2026 |
| Communication | Email | Connected | Team mailboxes |
| Scheduling | Calendar | Connected | Team calendars (meetings) |
| Content | Ghost | Connected | Blog |
| Content | Buffer | Connected | Social scheduling |
| Automation | Make.com | Archived | License archived |

**Not shown:** Manatal (careers / recruitment — explicitly out of scope, Brief §17).

The Integration category `lead_capture` is labelled **"Inbound capture"** in the UI.

**CRM cutover rule (seed data):** CRM events (`lead_created`, `lead_status_changed`, `person_assigned`, `note_added`, `opportunity_*`, `proposal_sent`, `deal_won`, `opportunity_lost`) use `sourceSystem: "hubspot"` before **2026-09-15** and `"sales_tracker"` from that date. Acme's journey therefore spans both CRMs (lead created in HubSpot on Sep 14, opportunity created in Sales Tracker on Sep 18) — a live illustration that the journey survives the CRM migration.

Booking conversions ("Book a Call") before the Cal.com archive use `sourceSystem: "cal_com"`. Meetings use `"calendar"`.

Every `sourceSystem` used in events must map to a listed integration.

### 10.8 Ask Inbound

Five canonical prompts (the only ones):

1. Where did Acme come from?
2. Which channel generated the most pipeline?
3. Show leads waiting for a reply.
4. What are our biggest unattributed opportunities?
5. Which source has the highest conversion rate?

Rules:

- Answers are computed by the same `lib/` functions the screens use. No stored answer strings for numbers.
- Answers that depend on a model state it ("under First Touch…").
- **Free text:** input is keyword-matched to the five intents (e.g. "acme" → 1; "pipeline" → 2; "reply", "waiting" → 3; "unattributed", "unknown" → 4; "conversion rate" → 5). No match → a short message "This prototype answers these questions:" with the five chips.

Expected answers (default range, First Touch):

| Prompt | Answer |
|---|---|
| 1 | Google Organic → LinkedIn Organic → Direct / Contact Form · €120K · Proposal |
| 2 | Google Organic · €260K open pipeline |
| 3 | Anna Keller (Vector, 3d 6h) + 3 generated leads |
| 4 | Atlas Systems €180K (won, relationship-only) · Vector Group €160K (open, unknown) |
| 5 | Referral (web) · 67% lead → opportunity |

---

## 11. Management Demo Path (updated)

```text
1. /overview — leads, open pipeline, won revenue; attribution coverage 73%
2. Recent Inbound → John Smith / Acme
3. Attribution Summary → Why? (First Touch)
4. Customer Journey — "assembled from N systems"
5. Opportunity €120K · Proposal
6. Click Acme Inc → Account Detail → account journey (John, Sarah, Michael)
7. /attribution — First Touch (Acme → Google Organic)
   → Conversion Touch (Acme → Direct)
   → Last Marketing Touch (Acme → LinkedIn Organic)
8. Click Unknown row → Vector Group → "Attribution incomplete"
9. /ask-inbound → "Where did Acme come from?" → evidence → open journey
10. /integrations — Website Tracker first, then the existing stack
```

Every step must work without explanation. Any defect blocks presentation readiness.

---

## 12. Architecture

### 12.1 Folder structure

Atomic Design remains the **design thinking**. The codebase uses pragmatic folders:

```text
app/                     routes only (server components by default)
components/
  ui/                    shadcn primitives + generic DataTable (atoms)
  domain/                entity primitives: PersonIdentity, CompanyIdentity,
                         SourceBadge, StageBadge, OwnerChip, AttributionStatus,
                         OpportunityValue, MoneyValue, DateTime, SourceSystemChip
  features/              journey/, attribution/, leads/, accounts/, overview/,
                         integrations/, ask-inbound/, search/
  layout/                AppShell, Sidebar, GlobalHeader, PageHeader,
                         ListLayout, RecordDetailLayout, AnalyticsLayout
data/
  heroes/                hand-written hero records
  generated/             checked-in generator output
  ledger.ts              opportunity ledger (§9.2)
lib/
  attribution/           derive-touchpoints, models, status, account-attribution
  journeys/              person-journey, account-journey, path
  metrics/               overview, pipeline, revenue, funnel, response-time, coverage
  data/                  repositories (getPersonById, getLeads(filters)…)
  ask/                   intent matching + answer builders
  search/
  formatting/            money, dates (NOW-relative), duration
  config/                constants (NOW…), sources, stages, event-types, owners
scripts/
  generate-seed.ts
types/
tests/                   vitest (logic) + playwright (P0 demo path)
```

### 12.2 Rules

- **Dependency direction:** `app → features → domain → ui`. Nothing imports upward. `lib/` is imported by `app` and `features`, never by `ui`.
- Do not wrap shadcn primitives. Add a primitive to `ui/` only if shadcn lacks it.
- One generic `DataTable` in `ui/`. `LeadTable`, `AccountTable`, `AttributionTable`, `JourneyTable` are feature configurations of it.
- Each domain primitive exists exactly once.
- `lib/` contains pure functions over seed arrays. Pages (server components) call `lib/` and pass serialisable props to client components (charts, filters, toggles, search, Ask Inbound).
- Filter, model and range state lives in URL query parameters. In Next.js 15+ `searchParams` is async — await it in pages.

### 12.3 Stack and versions

- Pin exact versions in `package.json` at project creation: current stable Next.js (App Router), React, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide, Recharts, Vitest, Playwright.
- Tokens are defined as CSS variables in `app/globals.css` via Tailwind v4 `@theme`. Semantic tokens map to shadcn names:

| 05 semantic token | shadcn variable |
|---|---|
| background | `--background` |
| text-primary | `--foreground` |
| surface | `--card`, `--popover` |
| surface-raised | `--secondary` |
| surface-hover / surface-active | `--accent` |
| text-muted | `--muted-foreground` |
| background-subtle | `--muted` |
| border-default | `--border`, `--input` |
| border-focus | `--ring` |
| primary | `--primary` |
| text-inverse | `--primary-foreground` |
| danger | `--destructive` |
| success / warning / highlight / secondary-accent | `--success` / `--warning` / `--highlight` / `--dessert` (custom) |
| chart series | `--chart-1` (red) … `--chart-5` |

---

## 13. Design Adjustments (05 amended)

| Colour | Single meaning |
|---|---|
| MOP Red | Primary action, selection, conversion markers |
| Dessert | Acquisition events and secondary data series |
| Yellow | Partial / incomplete attribution only |
| Warning orange | Integration attention, waiting / stalled |
| Success green | Won, connected |
| Error red | Failures, destructive |

- "Info" uses neutral `text-secondary`, not Dessert.
- Communication events in the timeline use neutral warm (`text-secondary`), not yellow.
- **Primary button text is dark (`#161010`) on MOP Red** (~5.3:1). White on MOP Red is ~3.5:1 and fails WCAG AA for button text.

---

## 14. Validation Targets

`validateSeedData()` and Vitest must assert (default range):

| Check | Expected |
|---|---|
| Inbound leads | 80 |
| Companies | 45 |
| Opportunities | 26 (10 won · 5 lost · 11 open) |
| Won revenue | €740,000 |
| Open pipeline | €1,250,000 |
| Lead → Opportunity | 32.5% |
| Attribution status | 58 Full · 15 Partial · 7 Unknown |
| Coverage | 73% |
| Funnel | 80 → 44 → 26 → 17 → 10 |
| Avg first response | 2h 18m ± 10m |
| First Touch table | exactly §9.3 |
| Acme / John | First Google Organic · Last Marketing LinkedIn Organic · Conversion Direct / Contact Form · Full · €120K Proposal |
| Acme engagement | 5 sessions · 17 page views · 4 content · 9 emails · 2 meetings · 11 days · 17m |
| Acme account | earliest Google Organic (John) · latest LinkedIn Organic (Sarah) · relationship Michael Brown |
| Atlas | First/Last Marketing = Unknown · Conversion Direct · Partial · relationship Existing Client Referral (Daniel Fischer — Nova Group) |
| Vector | First/Last Marketing = Unknown · Conversion Direct · Unknown · waiting 3d 6h |
| Referral (web) | highest Lead → Opp (67%) |
| Integrity | no duplicate IDs; every foreign key resolves; every event `sourceSystem` maps to an integration; no `Date.now()` in app code |

Playwright smoke test walks the full §11 demo path.

---

## 15. Open Items for Igor to Confirm

1. **Kit, Cal.com and Make.com statuses** — to be checked with Haris B.
2. **Email and Calendar** are shown generically ("Team mailboxes", "Team calendars") — confirm the actual provider name if it should be displayed.
3. **Sales Tracker cutover date** (15 Sep 2026) is a demo assumption — adjust if the real date differs.
4. **Owner name spelling:** Elma Šemović, Adnan Ahmethodžić.
5. **Framing (§2):** internal first, productisable later.

Resolved: dark text on MOP Red primary buttons is accepted (§13).
