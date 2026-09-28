# Inbound Revenue Intelligence
## Seed Data Specification + Hero Demo Scenarios v0.2

> **v0.2 — amended by `00_DECISIONS.md`.** Where this document conflicts with `00_DECISIONS.md`, `00_DECISIONS.md` wins. Figures that do not appear in `00_DECISIONS.md` or `04_SEED_DATA_SPECIFICATION.md` are illustrative and must not be seeded.

## 1. Purpose

This document defines the seeded dataset used by the prototype.

The dataset must serve four purposes:

1. Make the application feel realistically populated.
2. Keep all dashboard totals internally consistent.
3. Support the complete management demo path.
4. Demonstrate multiple attribution patterns, including known, partial and unknown journeys.

The prototype should use deterministic seed data.

Random values may be generated during development, but the final demo dataset must remain stable between runs.

---

## 2. Dataset Scale

The prototype should contain approximately:

- 80 inbound leads
- 45 companies
- 26 opportunities (ledger: 00_DECISIONS.md §9.2)
- 10 won
- 5 lost
- 11 open
- 12 campaigns
- 8–10 acquisition sources
- 300–500 timeline events
- 100+ website sessions
- 30+ meetings
- 100+ communication events

The goal is not statistical realism.

The goal is to create enough density that filters, tables, charts and drill-downs feel credible.

---

## 3. Time Range

Seed data should cover approximately:

**January 1, 2026 → September 27, 2026**

Default dashboard period: **This Year** (Jan 1 → NOW).

`NOW` is fixed at **2026-09-27 12:00 Europe/Sarajevo**. All relative times are computed against it.

Hero demo records should be concentrated in September 2026 so they feel current.

---

## 4. Currency

Use:

**EUR**

for prototype consistency.

Do not mix currencies in the first prototype.

---

## 5. Internal Users

Create these internal owners:

### Igor Kraisnik

Role: Product / Strategy

Used as owner on the primary demo accounts.

### Elma Šemović

Role: Business Development

### Adnan Ahmethodžić

Role: Sales

### Marketing Team

Role: Shared marketing owner

### Unassigned

Used for newly arrived inbound leads.

---

## 6. Acquisition Source Distribution

Lead distribution across 80 leads, by **First Touch bucket** under the 00_DECISIONS.md §5 rules:

| Source | Leads | Opps | Won | Open Pipeline | Won Revenue |
|---|---:|---:|---:|---:|---:|
| Google Organic | 17 | 5 | 2 | €260K | €105K |
| Google Ads | 15 | 5 | 2 | €140K | €55K |
| LinkedIn Organic | 12 | 4 | 1 | €200K | €55K |
| LinkedIn Ads | 8 | 3 | 1 | €220K | €25K |
| Referral (web) | 6 | 4 | 2 | €210K | €180K |
| Event | 4 | 2 | 1 | €60K | €140K |
| Meta | 5 | 1 | 0 | €0 | €0 |
| Email | 2 | 0 | 0 | €0 | €0 |
| Unknown | 11 | 2 | 1 | €160K | €180K |
| **Total** | **80** | **26** | **10** | **€1,250K** | **€740K** |

Direct never appears as a First Touch bucket. Unknown = 7 Unknown-status leads + 4 Partial leads with only relationship / self-reported evidence (incl. Atlas).

These numbers do not need to be perfectly uniform across every reporting view.

Attribution model switching should create different distributions.

---

## 7. Company Mix

Seed companies should represent plausible B2B prospects.

Use a mixture of industries such as:

- Technology
- FinTech
- Healthcare
- Manufacturing
- SaaS
- Logistics
- Professional Services
- Energy
- Automotive
- Retail
- Financial Services

Company sizes:

- 11–50
- 51–200
- 201–500
- 500–1,000
- 1,000–5,000
- 5,000+

---

## 8. Required Hero Companies

The following companies must be manually curated.

These should not be generated procedurally.

---

## 9. Hero Scenario 1 — Acme Inc

### Purpose

This is the primary management demo account.

It demonstrates:

- anonymous acquisition,
- repeat visits,
- multiple attribution perspectives,
- lead conversion,
- communication,
- opportunity creation,
- proposal activity.

### Company

Name: Acme Inc  
Domain: acme.com  
Industry: Technology  
Employees: 500–1,000  
Location: Stockholm, Sweden  
Owner: Igor Kraisnik

### Primary Contact

John Smith  
VP Product  
john.smith@acme.com

Display stage: Proposal (lead status: qualified)

### Additional Contacts

Sarah Johnson  
CTO  
sarah.johnson@acme.com

Michael Brown
CEO
michael.brown@acme.com

**Sarah Johnson** is a lead (full attribution, LinkedIn Organic): Sep 15 LinkedIn visit → blog post → newsletter signup. Attends the Sep 22 proposal scoping meeting. Listed in `opp_acme_ai.contactIds`. Owner: Igor Kraisnik. Lead status: qualified.

**Michael Brown** is a Contact, not a lead (no conversion). Sep 17: introduced by Lena Holm, former colleague of Igor Kraisnik. RelationshipAttribution: `personal_network`, source "Lena Holm". CC'd on the proposal.

Neither changes John Smith's attribution. Account attribution: earliest touch Google Organic (John, Sep 3) · latest marketing influence LinkedIn Organic (Sarah, Sep 15) · relationship influence Michael Brown (Lena Holm).

### Opportunity

Name: AI Transformation Platform  
Stage: Proposal  
Value: €120,000  
Probability: 65%  
Created: September 18, 2026  
Expected close: October 18, 2026  
Owner: Igor Kraisnik

### Attribution

First Touch: Google Organic  
Last Marketing Touch: LinkedIn Organic  
Conversion Session: Direct  
Conversion Mechanism: Contact Form  
Self-Reported Attribution: “Have been following your LinkedIn content for a while.”  
Attribution Status: Full

### Journey Events (canonical — John Smith)

All times Europe/Sarajevo, 2026. Page-view events count toward Page Views per 00_DECISIONS.md §7.

| # | Date · Time | Event type | Category | Source system | Detail |
|---|---|---|---|---|---|
| | **Session 1 — Google Organic** (`session_acme_001`, referrer google.com, query "AI product development company") | | | | |
| 1 | Sep 3 · 09:42 | organic_search_visit | acquisition | website_tracker | Google Organic |
| 2 | Sep 3 · 09:43 | landing_page_viewed | website | website_tracker | /services/ai-product-development |
| 3 | Sep 3 · 09:47 | page_viewed | website | website_tracker | /services/product-strategy |
| 4 | Sep 3 · 09:51 | case_study_viewed | content | website_tracker | AI Transformation Case Study |
| 5 | Sep 3 · 09:55 | page_viewed | website | website_tracker | /work |
| 6 | Sep 3 · 09:58 | page_viewed | website | website_tracker | /about |
| | **Session 2 — LinkedIn Organic** (`session_acme_002`, campaign LinkedIn Founder Content, product strategy post) | | | | |
| 7 | Sep 11 · 14:22 | social_visit | acquisition | website_tracker | LinkedIn Organic |
| 8 | Sep 11 · 14:26 | blog_post_viewed | content | ghost | Product Strategy in the AI Era |
| 9 | Sep 11 · 14:31 | page_viewed | website | website_tracker | /services/product-strategy |
| 10 | Sep 11 · 14:35 | case_study_viewed | content | website_tracker | AI Transformation Case Study |
| | **Session 3 — Direct (conversion)** (`session_acme_003`) | | | | |
| 11 | Sep 14 · 10:04 | direct_visit | acquisition | website_tracker | Direct |
| 12 | Sep 14 · 10:05 | page_viewed | website | website_tracker | / |
| 13 | Sep 14 · 10:06 | contact_page_viewed | website | website_tracker | /contact |
| 14 | Sep 14 · 10:08 | form_started | website | website_tracker | Contact form |
| 15 | Sep 14 · 10:11 | form_submitted | conversion | resend | "We are exploring an AI platform…" |
| 16 | Sep 14 · 10:11 | lead_created | conversion | hubspot | Lead created (HubSpot — before the 15 Sep Sales Tracker cutover) |
| 17 | Sep 14 · 10:28 | email_sent | communication | email | Igor → John · first response 17 min |
| 18 | Sep 14 · 12:02 | email_received | communication | email | John → Igor |
| 19 | Sep 14 · 14:30 | email_sent | communication | email | Scheduling discovery call |
| 20 | Sep 16 · 09:00 | meeting_booked | meeting | calendar | Discovery call (mtg_acme_001) |
| 21 | Sep 16 · 14:00 | meeting_completed | meeting | calendar | Discovery call · 45 min |
| 22 | Sep 17 · 09:15 | email_sent | communication | email | Discovery recap |
| 23 | Sep 17 · 11:00 | meeting_booked | meeting | calendar | Proposal scoping (mtg_acme_002) |
| 24 | Sep 18 · 11:30 | opportunity_created | crm | sales_tracker | AI Transformation Platform · €120K · stage qualified |
| | **Session 4 — Direct** (`session_acme_004`) | | | | |
| 25 | Sep 19 · 13:10 | direct_visit | acquisition | website_tracker | Direct |
| 26 | Sep 19 · 13:11 | page_viewed | website | website_tracker | /work |
| 27 | Sep 19 · 13:14 | page_viewed | website | website_tracker | /services/ai-product-development |
| 28 | Sep 19 · 13:18 | case_study_viewed | content | website_tracker | Enterprise AI Search Case Study |
| 29 | Sep 21 · 15:20 | email_received | communication | email | Questions on scope |
| 30 | Sep 21 · 16:05 | email_sent | communication | email | Reply |
| 31 | Sep 22 · 10:00 | meeting_completed | meeting | calendar | Proposal scoping · 60 min · John + Sarah |
| 32 | Sep 24 · 16:00 | proposal_sent | crm | sales_tracker | €120,000 |
| 33 | Sep 24 · 16:00 | opportunity_stage_changed | crm | sales_tracker | → Proposal |
| 34 | Sep 24 · 16:02 | email_sent | communication | email | Proposal cover email (cc Michael Brown) |
| | **Session 5 — Direct** (`session_acme_005`) | | | | |
| 35 | Sep 25 · 08:40 | direct_visit | acquisition | website_tracker | Direct |
| 36 | Sep 25 · 08:41 | page_viewed | website | website_tracker | /services/ai-product-development |
| 37 | Sep 25 · 08:44 | page_viewed | website | website_tracker | /about |
| 38 | Sep 25 · 08:46 | page_viewed | website | website_tracker | /work |
| 39 | Sep 25 · 08:49 | page_viewed | website | website_tracker | /services/software-engineering |
| 40 | Sep 26 · 09:10 | email_received | communication | email | Follow-up questions |
| 41 | Sep 26 · 11:40 | email_sent | communication | email | Reply |

Last activity: Sep 26 · 11:40. Journey path: Google Organic → LinkedIn Organic → Direct → Contact Form.

### Engagement Totals (derived from the events above — validation must reproduce them)

Sessions: 5  
Page Views: 17  
Content Viewed: 4  
Emails: 9  
Meetings: 2  
Days First Touch → Lead: 11  
First Response Time: 17 minutes

---

## 10. Hero Scenario 2 — Northstar Health

### Purpose

Demonstrate a clean paid acquisition journey.

### Company

Northstar Health  
Domain: northstarhealth.io  
Industry: Healthcare Technology  
Employees: 201–500  
Location: Copenhagen, Denmark  
Owner: Elma Šemović

### Primary Contact

Emma Larsen  
Chief Digital Officer  
emma.larsen@northstarhealth.io

### Opportunity

Digital Patient Platform  
Stage: Negotiation  
Value: €75,000  
Probability: 80%

### Attribution

First Touch: Google Ads  
Last Marketing Touch: Google Ads  
Conversion Session: Google Ads  
Conversion Mechanism: Book a Call  
Attribution Status: Full

### Journey Summary

Google Ads  
→ AI Healthcare landing page  
→ Healthcare case study  
→ Pricing / engagement page  
→ Book a Call  
→ Discovery  
→ Opportunity
→ Negotiation

Key dates: first touch and Book a Call Aug 19 (campaign AI Healthcare; booking via the Cal.com page inside the Google Ads session, `sourceSystem: cal_com`) · discovery Aug 22 · opportunity Aug 26 · negotiation Sep 22 · expected close Oct 10.

---

## 11. Hero Scenario 3 — Atlas Systems

### Purpose

Demonstrate referral and relationship attribution.

### Company

Atlas Systems  
Domain: atlassystems.eu  
Industry: Enterprise Software  
Employees: 1,000–5,000  
Location: Munich, Germany  
Owner: Igor Kraisnik

### Primary Contact

Thomas Weber  
VP Innovation  
thomas.weber@atlassystems.eu

### Opportunity

AI Discovery & Prototype Program  
Stage: Won  
Value: €180,000  
Closed: September 12, 2026

### Attribution

Detected First Touch: none (Direct only) → Unknown  
Detected Last Marketing Touch: none → Unknown  
Conversion: Direct / Contact Form  
Self-Reported Source: “Recommended by Daniel from Nova Group.”  
Relationship Attribution: Existing Client Referral  
Relationship Source: Daniel Fischer — Nova Group  
Attribution Status: Partial

Important:

The system should NOT change detected attribution to Referral.

Instead show both:

Detected: Direct only — no marketing touch
Relationship: Existing Client Referral

Key dates: lead Jul 8 · opportunity Jul 15 · won Sep 12.

---

## 12. Hero Scenario 4 — Nordica Labs

### Purpose

Demonstrate content-led LinkedIn attribution.

### Company

Nordica Labs  
Domain: nordicalabs.com  
Industry: SaaS  
Employees: 51–200  
Location: Oslo, Norway  
Owner: Adnan Ahmethodžić

### Primary Contact

Ingrid Solberg  
Head of Product  
ingrid@nordicalabs.com

### Opportunity

Product Intelligence Platform  
Stage: Discovery  
Value: €90,000

### Attribution

First Touch: LinkedIn Organic  
Last Marketing Touch: LinkedIn Organic  
Conversion: Contact Form  
Self-Reported: “Found your product strategy content on LinkedIn.”  
Attribution Status: Full

Key dates: LinkedIn visit Aug 30 · blog · repeat LinkedIn visit Sep 10 · contact form Sep 12 · opportunity Sep 20.

---

## 13. Hero Scenario 5 — Vector Group

### Purpose

Demonstrate unknown attribution honestly.

### Company

Vector Group  
Domain: vectorgroup.com  
Industry: Manufacturing  
Employees: 5,000+  
Location: Vienna, Austria  
Owner: Igor Kraisnik

### Primary Contact

Anna Keller  
Director of Digital Transformation  
anna.keller@vectorgroup.com

### Opportunity

Digital Operations Platform  
Stage: Qualified  
Value: €160,000

### Attribution

First Marketing Touch: none → Unknown  
Last Marketing Touch: none → Unknown  
Conversion: Direct / Contact Form  
Prior History: Unknown  
Self-Reported: None  
Relationship Attribution: None  
Attribution Status: Unknown

### UI Requirement

Display:

**Attribution incomplete**

Supporting message:

“No known marketing interaction was identified before this conversion.”

Key dates: direct visit + contact form Sep 9 · discovery meeting Sep 15 · opportunity Sep 17 · last inbound email Sep 24 06:00 → **waiting for reply 3d 6h** at NOW.

---

## 14. Hero Scenario 6 — Helix Finance

### Purpose

Demonstrate LinkedIn Ads with a lost opportunity.

Company: Helix Finance  
Industry: FinTech  
Employees: 201–500

Contact: David Müller, COO

Opportunity: Payments Modernization  
Stage: Lost  
Value: €95,000

Journey:

LinkedIn Ads  
→ FinTech case study  
→ Contact form  
→ Discovery  
→ Proposal  
→ Lost

Lost reason:

Timing / internal priority shift

Domain: helixfinance.de · Owner: Elma Šemović · Lead May 12 · opportunity May 26 · lost at Proposal Aug 21.

---

## 15. Hero Scenario 7 — Meridian Logistics

### Purpose

Demonstrate event-driven attribution.

Company: Meridian Logistics  
Industry: Logistics  
Employees: 1,000–5,000

Contact: Marta Novak, Innovation Director

Opportunity: Logistics Visibility Platform  
Stage: Won  
Value: €140,000

Attribution:

First Touch: Event  
Event: Nordic Digital Leaders Summit  
Last Marketing Touch: Google Organic  
Conversion: Email Inquiry  
Self-reported: “Met your team at Nordic Digital Leaders Summit.”

Domain: meridianlogistics.com · Owner: Elma Šemović · Event Mar 19 (imported attendee list) · Google Organic visit Apr 2 followed by email inquiry within 30 min (conversion channel Google Organic) · opportunity Apr 14 · won Aug 28 · status Full.

---

## 16. Hero Scenario 8 — Orbit Retail

### Purpose

Demonstrate many leads but low commercial value.

Company: Orbit Retail  
Industry: Retail  
Employees: 500–1,000

Journey:

Meta campaign  
→ campaign landing page  
→ form submit  
→ qualified poorly  
→ no opportunity

Seed: 3 leads from Orbit Retail (orbitretail.com), Meta campaign, Jun–Jul, Owner: Marketing Team, all Disqualified, no opportunity.

Purpose:

Show why lead volume alone is misleading.

---

## 17. Campaign Seed Data

Create the following campaigns:

1. AI Transformation Q3
2. Product Innovation Europe
3. Enterprise AI Search
4. LinkedIn Founder Content
5. Digital Transformation Search
6. AI Product Strategy
7. Nordics Expansion
8. Website Retargeting
9. Enterprise Innovation Leaders
10. AI Healthcare
11. FinTech Modernization
12. Q3 Executive Content

Each campaign should have:

- source
- platform
- status
- start date
- optional end date

Per-campaign lead, opportunity and pipeline counts are **not required** in V1. Campaigns appear as metadata on sessions and events. If a count is ever displayed, it must be derived.

---

## 18. Opportunity Distribution

The canonical **opportunity ledger** (26 opportunities: 10 won · 5 lost · 11 open) is in `00_DECISIONS.md §9.2`. Seed generation starts from the ledger and generates leads and events backward from it.

---

## 19. Opportunity Value Distribution

Range €25,000 → €220,000, per the ledger. Do not add opportunities outside the ledger.

---

## 20. Revenue Target

Won revenue: **€740,000** exactly (10 won opportunities in the ledger).

---

## 21. Open Pipeline Target

Open pipeline: **€1,250,000** from 11 open opportunities (ledger). It is a snapshot as of NOW and ignores the date range.

This must be calculated from open opportunities.

Do not hardcode dashboard pipeline independently from opportunity data.

---

## 22. Lead Status Distribution

Across all inbound leads (Display Stage):

- New · Contacted · Qualified · Discovery · Proposal · Negotiation · Won · Lost · Disqualified

Target (Display Stage, 00_DECISIONS.md §3.2): 26 opportunity primary contacts (stages per ledger) + Qualified 18 · Contacted 14 · New 12 · Disqualified 10. New leads are Unassigned.

---

## 23. Attribution Quality Distribution

Across all 80 leads:

### Full

58

### Partial

15

### Unknown

7

This creates approximately:

**73% Attribution Coverage**

Partial (15) = 4 type (a) — relationship / self-reported only, no detected marketing touch (incl. Atlas) + 11 type (b) — detected marketing touch, conversion channel unknown. Rules: 00_DECISIONS.md §5.4.

At least 30% of Full leads must have different First Touch and Last Marketing Touch sources, and about half of all conversions must happen in Direct sessions.

---

## 24. Unknown Lead Scenarios

Use several causes:

- direct traffic with no previous cookie history,
- privacy / cookie restrictions,
- forwarded website link,
- external referral without UTM,
- email shared internally,
- unknown event introduction,
- missing integration data.

---

## 25. Communication Timing

Create realistic response times.

Examples:

- 17 min
- 38 min
- 1h 12m
- 2h 05m
- 5h 40m
- 19h
- 2 days

The overall average should be approximately:

**2h 18m**

Hero scenario Acme must remain:

**17 minutes**

Definition (mean over leads with a response; calendar time): 00_DECISIONS.md §7.

---

## 26. Stalled Lead Examples

Create several leads where:

- no response for 3+ days,
- no activity for 10+ days,
- proposal sent but no client response,
- discovery completed but no opportunity created.

Include Anna Keller (Vector, waiting 3d 6h) and three generated leads waiting 3d 1h, 4d 2h and 5d 0h.

These are useful for Ask Inbound queries.

---

## 27. Ask Inbound Seed Answers

The following questions must return deterministic answers:

- Where did Acme come from?
- Which channel generated the most pipeline?
- Show leads waiting for a reply.
- What are our biggest unattributed opportunities?
- Which source has the highest conversion rate?

Expected answers: 00_DECISIONS.md §10.8 (Referral (web) 67% highest conversion; Google Organic €260K most open pipeline under First Touch; Atlas €180K and Vector €160K biggest unattributed; Acme → Google Organic → LinkedIn Organic → Direct / Contact Form).

---

## 28. Attribution Model Demonstration

The same underlying opportunities should produce visibly different results depending on selected model.

Example:

### Acme

First Touch: Google Organic  
Last Marketing Touch: LinkedIn Organic  
Conversion: Direct

€120K pipeline should move between those channels when model changes.

Demo order: First Touch → Conversion Touch → Last Marketing Touch (ends on a model where Vector remains in the Unknown row).

---

## 29. Person Generation Rules

Non-hero names should feel geographically plausible for European B2B companies.

Use a mixture of names from:

- Nordics
- DACH
- UK
- Netherlands
- Balkans
- France
- Central Europe

Avoid obviously fake patterns.

---

## 30. Job Titles

Use plausible senior B2B roles:

- CEO
- CTO
- CIO
- Chief Digital Officer
- VP Product
- Head of Product
- VP Innovation
- Director of Digital Transformation
- COO
- Head of Strategy
- Innovation Director
- Head of Engineering
- Digital Product Director

---

## 31. Website Content Seed Data

Pages:

- `/`
- `/services/ai-product-development`
- `/services/product-strategy`
- `/services/digital-transformation`
- `/services/software-engineering`
- `/contact`
- `/work`
- `/about`

Content:

- Product Strategy in the AI Era
- AI Transformation Case Study
- Enterprise AI Search Case Study
- Building AI-Native Products
- Digital Transformation Without the Theatre
- From Prototype to Production
- Product Discovery for Enterprise Teams

---

## 32. Conversion Mechanisms

Use:

- Contact Form
- Book a Call
- Email Inquiry
- Newsletter Signup
- Referral Introduction

Primary commercial conversions should overwhelmingly be:

- Contact Form
- Book a Call
- Email Inquiry

---

## 33. Integration Seed Data

Canonical integration list and statuses: 00_DECISIONS.md §10.7.

---

## 34. Dashboard Consistency Rule

No top-level metric should be manually hardcoded if it can be derived.

The seed dataset should be tuned until derived values tell the intended story.

---

## 35. Deterministic Seed Generation

For non-hero records:

Use deterministic generation.

Do not use `Math.random()` directly during application render.

The prototype must display the same data every time.

---

## 36. ID Convention

Recommended IDs:

```text
ws_mop

usr_igor
usr_elma

company_acme
company_northstar

person_john_smith
person_emma_larsen

opp_acme_ai
opp_northstar_digital

session_acme_001

evt_acme_001

touch_acme_google_001
```

Readable IDs are preferred for the prototype.

---

## 37. Demo Narrative Embedded in Data

The seeded dataset should intentionally demonstrate four business lessons:

1. The source with the most leads is not necessarily the source with the most revenue.
2. Referrals may generate few leads but very high conversion and deal values.
3. A single lead can have multiple valid attribution perspectives.
4. Unknown attribution is itself valuable information.

---

## 38. Preferred Overview Numbers

Use these only if underlying seed data reconciles:

Inbound Leads: 80  
Opportunities: 26  
Open Pipeline: €1,250,000  
Won Deals: 10  
Won Revenue: €740,000  
Lead → Opportunity: 32.5%  
Attribution Coverage: 73%  
Average First Response: approximately 2h 18m

Full validation targets: 00_DECISIONS.md §14.

These numbers should be adjusted to match the final generated dataset.

---

## 39. Definition of Done

Seed data is complete when:

- hero scenarios match the product brief,
- dashboard totals reconcile,
- attribution switching visibly changes outcomes,
- every hero account has a meaningful journey,
- all filters return useful results,
- unknown attribution records exist,
- stalled leads exist,
- won and lost opportunities exist,
- Ask Inbound can answer its predefined questions,
- no major screen appears empty,
- the dataset tells the intended management story.
