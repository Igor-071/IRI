# Inbound Revenue Intelligence
## Data Model & Event Taxonomy v0.2

> **v0.2 — amended by `00_DECISIONS.md`.** Where this document conflicts with `00_DECISIONS.md`, `00_DECISIONS.md` wins. Figures that do not appear in `00_DECISIONS.md` or `04_SEED_DATA_SPECIFICATION.md` are illustrative and must not be seeded.

## 1. Purpose

This document defines the shared internal data model for the prototype.

Every major screen, chart, filter, attribution calculation, lead profile, account view and journey timeline should use the same normalized entities and event structures.

The goal is to create one coherent model that can support both:

- seeded prototype data today,
- real integrations and database persistence later.

---

## 2. Core Modeling Principle

The system should be built around two concepts:

**Entities**

Who or what exists?

and

**Events**

What happened?

Most product behavior can be represented as:

> Entity + Event + Timestamp + Source + Metadata

Examples:

John Smith viewed a case study.

Acme Inc created an opportunity.

A visitor arrived through Google Ads.

A salesperson replied to a lead.

An opportunity moved to Proposal.

---

## 3. Core Entities

The prototype should define the following core entities:

1. Visitor
2. Person
3. Company
4. Session
5. Event
6. Touchpoint
7. Campaign
8. Opportunity
9. Conversation
10. Message
11. Meeting
12. Integration
13. User
14. Workspace

**V1 storage (00_DECISIONS.md §6):**

- Stored: Workspace, User, Person, Company, Session, Event, Opportunity, Campaign, Integration, RelationshipAttribution.
- Conceptual / derived in V1: Visitor (`visitorId` on Session and Event), Touchpoint (derived from Session + Event, §12), Conversation, Message and Meeting (represented as Events with metadata, §18–20).

---

## 4. Workspace

```ts
type Workspace = {
  id: string
  name: string
  slug: string
  currency: "EUR" | "USD" | "GBP"
  timezone: string
}
```

Seed example:

```ts
{
  id: "ws_mop",
  name: "Ministry of Programming",
  slug: "ministry-of-programming",
  currency: "EUR",
  timezone: "Europe/Sarajevo"
}
```

---

## 5. User

```ts
type User = {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: "admin" | "marketing" | "sales" | "leadership"
}
```

Seed users (canonical owners):

- Igor Kraisnik
- Elma Šemović
- Adnan Ahmethodžić
- Marketing Team

`Unassigned` is represented by `ownerId` being empty.

---

## 6. Visitor

```ts
type Visitor = {
  id: string
  anonymousId: string
  firstSeenAt: string
  lastSeenAt: string
  firstSessionId?: string
  personId?: string
  attributionStatus: "full" | "partial" | "unknown"
}
```

Important:

A Visitor may later become linked to a Person.

```text
visitor_83fj2
↓ identifies as
person_john_smith
```

The prototype should preserve the anonymous history after identity resolution.

---

## 7. Person

```ts
type Person = {
  id: string
  workspaceId: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  jobTitle?: string
  companyId?: string
  ownerId?: string
  leadStatus:
    | "new"
    | "contacted"
    | "qualified"
    | "disqualified"
  createdAt: string
  updatedAt: string
  selfReportedSource?: string
  selfReportedAt?: string
}

// v0.2: lifecycleStage, touch IDs and attributionStatus are removed.
// Lead = Person with a lead_created event. Display Stage, attribution
// and attribution status are derived (00_DECISIONS.md §3, §5).
```

---

## 8. Company

```ts
type Company = {
  id: string
  workspaceId: string
  name: string
  domain: string
  industry?: string
  employeeRange?: string
  location?: string
  ownerId?: string
  createdAt: string
  firstSeenAt?: string
  lastActivityAt?: string
}

// v0.2: primarySource and attributionStatus removed; account
// attribution is derived (00_DECISIONS.md §5.6).
```

---

## 9. Session

```ts
type Session = {
  id: string
  visitorId: string
  personId?: string
  companyId?: string
  startedAt: string
  endedAt?: string
  source: AcquisitionSource
  medium?: string
  campaignId?: string
  referrer?: string
  landingPage?: string
  exitPage?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  gclid?: string
  fbclid?: string
  linkedinClickId?: string
}
```

Sessions should preserve source data rather than relying only on one lead-level source field.

---

## 10. Acquisition Sources

```ts
type AcquisitionSource =
  | "google_organic"
  | "google_ads"
  | "linkedin_organic"
  | "linkedin_ads"
  | "meta"
  | "referral"
  | "event"
  | "direct"
  | "email"
  | "unknown"

// "direct": valid session source and conversion channel, never a marketing touch.
// "unknown": attribution bucket only, never a session source.
// "partner" removed: partner/client introductions are relationship attribution.
```

---

## 11. Campaign

```ts
type Campaign = {
  id: string
  name: string
  platform:
    | "google_ads"
    | "linkedin_ads"
    | "meta"
    | "organic"
    | "email"
    | "event"
  source: AcquisitionSource
  startDate?: string
  endDate?: string
  status: "active" | "paused" | "completed"
}
```

---

## 12. Touchpoint

Touchpoints represent attribution-relevant interactions.

**Touchpoint is a first-class concept, but in V1 it is derived, not stored** (00_DECISIONS.md §5.1). `deriveTouchpoints(personId)` produces:

- one touchpoint per Session linked to the person (including linked pre-identification visitor sessions);
- one touchpoint per sessionless acquisition Event (e.g. `event_referral`, imported event attendance, Kit `campaign_clicked` without a tracked session).

Relationship attribution never becomes a touchpoint. Touchpoints carry no role: whether a touchpoint is first, last marketing or conversion is decided by the attribution model at query time. Production may persist touchpoints without changing this shape.

```ts
type Touchpoint = {
  id: string
  personId?: string
  visitorId?: string
  companyId?: string
  sessionId?: string
  timestamp: string
  source: AcquisitionSource
  medium?: string
  campaignId?: string
  kind: "session" | "event"
  isMarketingTouch: boolean // false when source === "direct"
  channel?: string
  content?: string
  landingPage?: string
  referrer?: string
}
```

---

## 13. Event

The Event entity is the universal activity model.

```ts
type Event = {
  id: string
  workspaceId: string
  timestamp: string

  eventType: EventType
  category: EventCategory

  visitorId?: string
  personId?: string
  companyId?: string
  sessionId?: string
  opportunityId?: string
  campaignId?: string

  sourceSystem: SourceSystem

  title: string
  description?: string

  metadata?: Record<string, unknown>
}
```

This should power the journey timeline.

---

## 14. Event Categories

```ts
type EventCategory =
  | "acquisition"
  | "website"
  | "content"
  | "conversion"
  | "communication"
  | "meeting"
  | "crm"
  | "revenue"
  | "system"
```

---

## 15. Source Systems

```ts
type SourceSystem =
  | "website_tracker"
  | "ga4"
  | "google_ads"
  | "google_search_console"
  | "linkedin"
  | "meta"
  | "resend"
  | "sales_tracker"
  | "hubspot"
  | "kit"
  | "email"
  | "calendar"
  | "cal_com"
  | "ghost"
  | "buffer"
  | "manual"
```

---

## 16. Event Taxonomy

### Acquisition Events

```text
session_started
campaign_clicked
organic_search_visit
social_visit
referral_visit
direct_visit
event_referral
partner_referral
```

### Website Events

```text
page_viewed
landing_page_viewed
pricing_page_viewed
contact_page_viewed
form_started
cta_clicked
```

### Content Events

```text
blog_post_viewed
case_study_viewed
resource_viewed
video_viewed
```

### Conversion Events

```text
form_submitted
meeting_requested
newsletter_subscribed
email_inquiry_received
lead_created
```

### Communication Events

```text
email_received
email_sent
email_opened
email_replied
note_added
```

Communication event `metadata`: `{ direction, subject?, bodyPreview?, senderName }`.

### Meeting Events

```text
meeting_booked
meeting_rescheduled
meeting_completed
meeting_cancelled
```

Meeting event `metadata`: `{ meetingId, title, durationMinutes, attendees }`.

### CRM Events

```text
lead_status_changed
person_assigned
company_created
opportunity_created
opportunity_stage_changed
proposal_sent
opportunity_lost
```

### Revenue Events

```text
deal_won
revenue_recorded
expansion_opportunity_created
```

The `system` category is never shown in journey timelines.

---

## 17. Opportunity

```ts
type Opportunity = {
  id: string
  workspaceId: string
  name: string
  companyId: string
  primaryContactId: string
  contactIds: string[]
  ownerId?: string

  stage:
    | "discovery"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "won"
    | "lost"

  value: number
  currency: "EUR" | "USD" | "GBP"

  probability?: number

  createdAt: string
  expectedCloseDate?: string
  closedAt?: string
  lostReason?: string
  lostAtStage?: "discovery" | "qualified" | "proposal" | "negotiation"
}

// v0.2: stored attribution fields removed. An opportunity uses its
// primary contact's derived attribution (00_DECISIONS.md §5.5).
// Stage history is derived from opportunity_created (metadata.stage)
// and opportunity_stage_changed events.
```

---

> **§18–20 are conceptual in V1.** Conversations, messages and meetings are represented as Events (`communication` and `meeting` categories) with metadata. Do not create separate seed files for them.

## 18. Conversation

```ts
type Conversation = {
  id: string
  personId: string
  companyId?: string
  opportunityId?: string
  channel: "email" | "linkedin" | "chat"
  startedAt: string
  lastActivityAt: string
  messageCount: number
}
```

---

## 19. Message

```ts
type Message = {
  id: string
  conversationId: string
  personId?: string
  senderType: "internal" | "external"
  senderName: string
  timestamp: string
  subject?: string
  bodyPreview?: string
  direction: "inbound" | "outbound"
}
```

---

## 20. Meeting

```ts
type Meeting = {
  id: string
  personId: string
  companyId?: string
  opportunityId?: string
  title: string
  scheduledAt: string
  durationMinutes: number
  status: "booked" | "completed" | "cancelled"
  ownerId?: string
}
```

---

## 21. Integration

```ts
type Integration = {
  id: string
  name: string
  category:
    | "analytics"
    | "advertising"
    | "lead_capture"
    | "crm"
    | "communication"
    | "scheduling"
    | "content"
    | "automation"

  status: "connected" | "attention" | "disconnected" | "archived"

  lastSyncAt?: string
  recordsImported?: number
}
```

---

## 22. Attribution Model

```ts
type AttributionModel =
  | "first_touch"
  | "last_touch"
  | "conversion_touch"
```

UI labels: First Touch · **Last Marketing Touch** (`last_touch`) · Conversion Touch.

These models should not mutate underlying data.

They are views over touchpoints.

---

## 23. First-Touch Logic

Earliest derived touchpoint with `isMarketingTouch === true` before the conversion (first `lead_created`).

If none exists, credit `unknown`.

Direct is never credited.

---

## 24. Last-Marketing-Touch Logic

Latest derived touchpoint with `isMarketingTouch === true` before the conversion.

If none exists, credit `unknown`. Direct is never credited in this model.

---

## 25. Conversion-Touch Logic

Conversion = the person's first `lead_created` event.

Store both:

- **conversion channel** = source of the session in which the conversion happened (may be `direct`);
- **conversion mechanism** = Contact Form · Book a Call · Email Inquiry · Newsletter Signup.

An email inquiry is linked to a session if the person had a tracked session in the previous 30 minutes; otherwise the conversion channel is `unknown`.

Direct therefore appears only in the Conversion Touch model.

---

## 26. Self-Reported Attribution

```ts
type SelfReportedAttribution = {
  personId: string
  value: string
  capturedAt: string
}
```

V1 storage: `Person.selfReportedSource` + `Person.selfReportedAt` (no separate record).

Never overwrite detected attribution with self-reported attribution.

---

## 27. Relationship Attribution

```ts
type RelationshipAttribution = {
  personId?: string
  companyId?: string
  sourceType:
    | "existing_client"
    | "employee"
    | "partner"
    | "event"
    | "personal_network"
  sourceName?: string
  notes?: string
}
```

---

## 28. Identity Resolution

For prototype purposes, identity resolution should be deterministic.

Rules:

1. Same verified email = same person.
2. When anonymous visitor submits known email, link Visitor → Person.
3. All past sessions and events connected to that Visitor become visible on the Person journey.
4. Matching email domain can associate Person → Company.

---

## 29. Company Resolution

Prototype rule:

If email is a business domain and a matching company domain exists, associate person automatically.

Do not automatically associate free email domains such as:

- gmail.com
- outlook.com
- yahoo.com
- icloud.com

---

## 30. Attribution Status

```ts
type AttributionStatus =
  | "full"
  | "partial"
  | "unknown"
```

### Full

At least one detected marketing touch before conversion **and** a known conversion channel.

### Partial

Conversion known, but either:

- (a) no detected marketing touch, with self-reported or relationship evidence (e.g. Atlas), or
- (b) a detected marketing touch, but the conversion channel is unknown (e.g. unlinked email inquiry).

### Unknown

No detected marketing touch **and** no self-reported or relationship evidence (e.g. Vector).

Status is computed, never stored. Direct-only journeys never count as a marketing touch.

---

## 31. Journey Construction

The customer journey should be generated by:

1. retrieving all events linked to Person,
2. retrieving linked Visitor history,
3. retrieving Company events where relevant,
4. retrieving Opportunity events,
5. sorting all events by timestamp.

The UI should not maintain a second manually curated timeline model.

The Event table is the source of truth.

---

## 32. Account Journey

For Company-level view:

Aggregate events from:

- company,
- all known people,
- relevant opportunities,
- relevant meetings,
- relevant conversations.

This creates one account-level journey.

---

### Account attribution (Account Detail only)

- Earliest account touch: earliest marketing touchpoint across all people at the company.
- Latest marketing influence: latest marketing touchpoint across all people before the most recent opportunity was created.
- Relationship influence: any RelationshipAttribution on the company or its people.

Never used in aggregate charts (00_DECISIONS.md §5.6).

---

## 33. Derived Metrics

Examples:

- Days to Lead
- Lead Response Time
- Time to Opportunity
- Time to Close
- Sessions
- Page Views

Exact definitions: 00_DECISIONS.md §7. All are calculated from base data.

---

## 34. Dashboard Metrics

Derived values should include:

- Inbound Leads
- Opportunities
- Won Deals
- Pipeline Value
- Revenue
- Lead → Opportunity %
- Average Response Time
- Attribution Coverage

---

## 35. Attribution Coverage Formula

Example:

```text
fully attributed leads / total inbound leads
```

Seed result: 58 / 80 = 72.5%, displayed as 73%.

The prototype may also show:

- Full
- Partial
- Unknown

as separate counts.

---

## 36. Revenue Attribution

For the prototype:

If an opportunity is Won, its full revenue value should be assigned to the selected attribution model.

Example:

Acme: €120K

First Touch mode: Google Organic gets €120K  
Last Marketing Touch mode: LinkedIn Organic gets €120K  
Conversion mode: Direct gets €120K

Do not implement fractional multi-touch attribution in the prototype.

An opportunity is credited using its **primary contact's** attribution (00_DECISIONS.md §5.5).

---

## 37. Pipeline Attribution

Same logic as revenue attribution, but use open opportunity value.

Recommended convention:

**Pipeline = open opportunity value**

**Revenue = won opportunity value**

---

## 38. Data Consistency Rules

Claude Code should ensure:

- every Person references a valid Company where applicable,
- every Opportunity references a valid Company,
- every Event references existing IDs,
- hero journeys match attribution cards,
- chart totals match table totals,
- revenue totals match Won opportunities,
- pipeline totals match open opportunities,
- date filters do not create impossible KPI numbers.

---

## 39. Hero Scenario: Acme

Required data relationships:

```text
Visitor
visitor_acme_001

↓ identified as

Person
person_john_smith

↓ belongs to

Company
company_acme

↓ linked to

Opportunity
opp_acme_ai
```

Attribution:

```text
First Touch:
google_organic

Last Marketing Touch:
linkedin_organic

Conversion Source:
direct

Conversion Mechanism:
contact_form
```

---

## 40. Hero Scenario: Northstar Health

Journey:

```text
Google Ads
→ Landing Page
→ Case Study
→ Meeting Requested
→ Opportunity
```

---

## 41. Hero Scenario: Atlas Systems

Journey:

```text
Relationship introduction (offline — recorded as relationship attribution, not a touchpoint)
→ Direct Visit
→ Contact Form
→ Opportunity
→ Won
```

Detected attribution and relationship attribution must remain distinct. First and Last Marketing Touch = `unknown`; conversion channel = `direct`; status = Partial.

---

## 42. Hero Scenario: Nordica Labs

Journey:

```text
LinkedIn Organic
→ Blog
→ Repeat LinkedIn Visit
→ Contact Form
→ Opportunity
```

---

## 43. Hero Scenario: Vector Group

Journey:

```text
Direct Visit
→ Contact Form
→ Opportunity
```

No previous known activity.

Attribution status:

```text
unknown
```

First and Last Marketing Touch = `unknown`; conversion channel = `direct`.

---

## 44. Suggested File Structure

*Superseded by 00_DECISIONS.md §12.1. Conversations, messages, meetings, touchpoints and visitors have no seed files in V1.*

```text
types/
  workspace.ts
  user.ts
  visitor.ts
  person.ts
  company.ts
  session.ts
  event.ts
  touchpoint.ts
  campaign.ts
  opportunity.ts
  communication.ts
  integration.ts
  attribution.ts
```

Seed data:

```text
data/
  workspaces.ts
  users.ts
  visitors.ts
  people.ts
  companies.ts
  sessions.ts
  events.ts
  touchpoints.ts
  campaigns.ts
  opportunities.ts
  integrations.ts
```

Derived logic:

```text
lib/
  attribution/
  journeys/
  metrics/
```

---

## 45. Important Architecture Rule

UI components should not calculate business logic directly.

Use domain-level helper functions such as:

```ts
getRevenueBySource(...)
getPersonJourney(...)
getAttributionForPerson(...)
getOverviewMetrics(...)
```

---

## 46. Prototype Database Future Mapping

The model should map cleanly to future relational tables such as:

```text
workspaces
users
visitors
persons
companies
sessions
events
touchpoints
campaigns
opportunities
conversations
messages
meetings
integrations
```

---

## 47. Non-Goals for Data Model v0.1

Do not model yet:

- billing,
- subscription plans,
- advanced permissions,
- complex multi-touch fractional attribution,
- probabilistic identity resolution,
- custom objects,
- workflow automation,
- full email threading,
- full CRM activities,
- advanced marketing spend modeling,
- predictive lead scoring.

---

## 48. Definition of Done

The data model is ready for prototype implementation when:

- every core screen can be driven from the shared model,
- every journey comes from Events,
- attribution can be calculated consistently,
- company and person views share linked data,
- hero scenarios produce expected results,
- dashboard metrics reconcile with opportunity data,
- no screen requires inventing one-off fields that conflict with the model.

---

## 49. Core Rule to Preserve

The system should never reduce the journey to one field called:

`lead_source`

The model should preserve:

- first touch,
- marketing touches,
- conversion touch,
- self-reported attribution,
- relationship attribution,
- communication,
- opportunity,
- revenue.
