# Inbound Revenue Intelligence
## Prototype Product Brief v0.2

> **v0.2 — amended by `00_DECISIONS.md`.** Where this document conflicts with `00_DECISIONS.md`, `00_DECISIONS.md` wins. Figures that do not appear in `00_DECISIONS.md` or `04_SEED_DATA_SPECIFICATION.md` are illustrative and must not be seeded.

## 1. Product Thesis

Companies generate inbound demand across many disconnected systems: websites, analytics, paid advertising, organic search, social media, forms, email, CRM, calendars, content platforms, and sales tools.

Each system understands only a small part of the customer journey.

As a result, when a new inbound lead appears, the company often cannot reliably answer:

- Where did this lead originally come from?
- Which marketing interactions influenced the lead?
- What happened before the person contacted us?
- What happened after the lead entered the sales process?
- Which channels actually generate opportunities?
- Which channels ultimately generate revenue?

The proposed platform consolidates these fragmented signals into **one continuous customer journey from first anonymous interaction to closed revenue**.

---

## 2. Core Product Promise

> **Understand exactly how inbound demand becomes pipeline and revenue.**

The platform should connect:

**Acquisition → Website Behaviour → Identification → Communication → Opportunity → Revenue**

Instead of treating marketing analytics, CRM, email and sales activity as separate systems, the product reconstructs them as one journey.

---

## 3. Prototype Objective

The purpose of the prototype is not to prove every technical integration.

The prototype must prove the **product experience and business value**.

The management team should be able to understand the product within approximately five minutes of using it.

The central moment should be:

> “A company contacted us. Show me exactly what we know about where they came from, what they did before contacting us, and what happened afterward.”

---

## 4. Primary Problem

Today the organization uses multiple tools across marketing, analytics, lead capture, communication and sales.

Examples include:

- GA4
- Google Search Console
- Google Ads
- LinkedIn
- Meta
- Google Business Profile
- Hotjar
- HubSpot / Sales Tracker
- Resend
- Kit
- Cal.com
- Ghost
- Buffer
- Trello / Skybox
- Make.com

These systems contain useful information, but they do not maintain one continuous customer identity and journey.

For example, a person may:

1. Discover the company through Google.
2. Visit several pages.
3. Return through LinkedIn.
4. Read a case study.
5. Visit directly several days later.
6. Submit a contact form.
7. Exchange emails with the team.
8. Book a meeting.
9. Become an opportunity.
10. Receive a proposal.
11. Become a customer.

Today these actions may exist across five or more different systems.

The relationship between them is frequently lost.

---

## 5. Prototype Hypothesis

If marketing, website, lead capture, communication and sales signals are presented as one customer journey, teams will be able to:

- understand where inbound demand originates,
- identify which channels contribute to pipeline,
- understand the path before conversion,
- improve lead response and follow-up,
- identify stalled opportunities,
- distinguish high-volume sources from high-value sources,
- understand revenue contribution by source,
- improve confidence in marketing investment decisions.

---

## 6. Target Users

### Leadership

Primary questions:

- Where is our pipeline coming from?
- Which channels generate revenue?
- How much inbound pipeline are we generating?
- How much attribution data are we missing?
- Which acquisition sources create our highest-value opportunities?

Leadership primarily needs aggregated business intelligence.

### Marketing

Primary questions:

- Which campaigns generate qualified leads?
- Which content influences opportunities?
- What was the first touch?
- What was the last marketing touch?
- Which landing pages produce strong opportunities?
- Which channels create revenue rather than simply traffic?

Marketing needs attribution and journey intelligence.

### Sales / Business Development

Primary questions:

- Where did this lead come from?
- What did they interact with before contacting us?
- Which pages or content did they view?
- Has anyone already communicated with this company?
- When was the last interaction?
- What is the current opportunity status?

Sales needs customer context and relationship history.

### Growth / Product / Strategy

Primary questions:

- Where does the inbound funnel break?
- How long does conversion take?
- Which sources produce strong opportunities?
- Which lead characteristics correlate with revenue?
- Where is attribution incomplete?
- Which systems or processes are causing information loss?

---

## 7. Core Product Model

The prototype should represent the inbound journey as:

### Anonymous Visitor

A person arrives on the website but has not yet identified themselves.

↓

### Known Person

The person submits a form, books a meeting, subscribes or otherwise provides identity.

↓

### Company

The known person is associated with an organization.

↓

### Lead

The person/company becomes an actionable inbound lead.

↓

### Opportunity

Commercial intent is established.

↓

### Customer / Revenue

The opportunity is won.

---

## 8. Core Journey Model

The product should visually communicate:

**Discovery**

Google  
LinkedIn  
Meta  
Referral  
Event  
Direct  
Other

↓

**Engagement**

Website pages  
Blog posts  
Case studies  
Social content  
Repeat visits

↓

**Identification**

Contact form  
Demo request  
Email  
Booking  
Newsletter signup

↓

**Relationship**

Email  
Meeting  
Follow-up  
Conversation

↓

**Commercial Intent**

Opportunity  
Proposal  
Negotiation

↓

**Revenue**

Won  
Lost  
Expansion

---

## 9. Attribution Philosophy

The product should avoid the simplistic concept of one universal "lead source."

Instead, it should preserve multiple attribution perspectives.

For every lead, the prototype should be able to show:

### First Touch

How did this person first discover the company?

Example: Google / Organic

### Last Marketing Touch

What was the final attributable marketing interaction before conversion?

Example: LinkedIn / Organic

### Conversion Touch

What interaction caused the person to identify themselves?

Example: Website Contact Form

### Self-Reported Attribution

What does the lead say caused them to contact the company?

Example: “I saw your keynote at an industry conference.”

### Relationship Attribution

Was the opportunity created through a human relationship?

Example: Referral from existing customer.

All of these can coexist.

---

## 10. Account-Level Attribution

The product is primarily designed for B2B environments.

Therefore, attribution should not stop at individual people.

Example:

### ACME INC.

John Smith  
First discovered company through Google.

Sarah Johnson  
Engaged with LinkedIn content.

Michael Brown
Introduced through a personal relationship (recorded as relationship attribution).

Together these interactions contributed to:

Opportunity: AI Transformation Platform
Potential value: €120,000

The prototype should demonstrate both:

- person-level journey
- company-level journey

---

## 11. Prototype Scope

The prototype will use realistic seeded data.

It will NOT initially connect live production integrations.

The prototype should demonstrate the expected behavior of a production platform without requiring OAuth, API synchronization or real tracking infrastructure.

---

## 12. Prototype Core Screens

The prototype should contain six primary areas.

### 1. Overview

Executive view of inbound performance.

Key metrics:

- Inbound Leads
- Opportunities
- Won Deals
- Pipeline Value
- Revenue
- Lead-to-Opportunity Conversion
- Average Lead Response Time
- Attribution Coverage (Full / Partial / Unknown)

Supporting visualizations:

- Pipeline by source
- Revenue by source
- Lead volume by source
- Conversion funnel
- Recent inbound leads
- Attribution data quality

### 2. Inbound Inbox / Leads

Operational list of inbound leads.

Each record should display:

- person
- company
- role
- lead status
- opportunity stage
- first touch
- last marketing touch
- conversion source
- date created
- owner
- potential opportunity value
- last activity

Filters:

- source (first touch)
- conversion mechanism
- stage (display stage)
- owner
- date
- attribution status

(Canonical filter values: 02 §9 and 00_DECISIONS.md §3–4.)

Search should work.

### 3. Lead / Account Detail

This is the primary product screen.

The screen should contain:

#### Identity

Person  
Company  
Job title  
Email  
Owner

#### Commercial information

Lead status  
Opportunity stage  
Estimated value  
Probability  
Expected close date

#### Attribution

First touch  
Last marketing touch  
Conversion source  
Self-reported source

#### Engagement

Sessions  
Pages viewed  
Content viewed  
Campaign interactions

#### Communication

Last email  
Last meeting  
Last response  
Response time

#### Related contacts

Other known people from the same company.

### 4. Customer Journey

Chronological representation of the full journey.

Example:

September 3  
Google Search  
"AI product development company"

September 3  
Visited  
/services/ai-product-development

September 3  
Viewed  
AI Transformation Case Study

September 11  
LinkedIn Organic  
Product strategy post

September 14  
Direct visit

September 14  
Contact form submitted

September 14  
Team replied  
17 minute response time

September 16  
Discovery meeting

September 18  
Opportunity created

September 24  
Proposal sent  
€120,000

*(Illustrative sequence. In the seed data Acme is at Proposal and has no won event.)*

The timeline should visually distinguish:

- acquisition
- website activity
- conversion
- communication
- meetings
- CRM events
- revenue events

### 5. Attribution & Revenue

Leadership / marketing analysis.

Example table:

| Source | Leads | Opportunities | Won | Pipeline | Revenue |
|---|---:|---:|---:|---:|---:|
| Organic Search | 62 | 21 | 9 | €620K | €340K |
| LinkedIn | 48 | 19 | 8 | €580K | €290K |
| Referral | 17 | 13 | 10 | €710K | €520K |
| Google Ads | 104 | 11 | 3 | €240K | €90K |

*Illustrative only. Real values are derived from seed data — see 00_DECISIONS.md §9.3.*

Users should be able to switch attribution perspective:

- First Touch
- Last Marketing Touch
- Conversion Touch

Prototype numbers should change appropriately.

### 6. Integrations

Visual representation of the data ecosystem.

Example:

GA4 — Connected  
Google Ads — Connected  
Google Search Console — Connected  
LinkedIn — Connected  
Meta — Connected  
Resend — Connected  
Sales Tracker — Connected  
Email — Connected  
Calendar — Connected  
Ghost — Connected

*Canonical integration list and statuses: 00_DECISIONS.md §10.7.*

The integrations do not need to actually connect during the prototype.

This screen exists to demonstrate how the production system would consolidate the existing stack.

---

## 13. Hero Demo Scenario

The prototype should include one highly polished demo account.

### ACME INC.

Primary contact:

John Smith  
VP Product

Opportunity:

AI Transformation Platform

Value:

€120,000

Stage:

Proposal

### Journey

September 3  
Google Organic  
Search: "AI product development company"

September 3  
Landing page  
AI Product Development

September 3  
Viewed case study

September 11  
Returned through LinkedIn

September 11  
Viewed Product Strategy article

September 14  
Returned directly

September 14  
Submitted Contact Form

September 14  
First response after 17 minutes

September 16  
Discovery meeting booked

September 18  
Opportunity created

September 24  
Proposal sent

Current status:

Proposal under review.

### Attribution

First Touch  
Google Organic

Last Marketing Touch  
LinkedIn Organic

Conversion Touch  
Direct / Contact Form

Self-Reported Source  
“Have been following your LinkedIn content.”

This account should demonstrate the product concept better than any slide can.

---

## 14. Additional Seed Scenarios

### Scenario 2 — Paid Acquisition

Google Ads  
→ Landing Page  
→ Case Study  
→ Contact Form  
→ Opportunity

Purpose: Demonstrate paid attribution.

### Scenario 3 — Referral

Direct visit  
→ Contact Form

Self-reported:

“Recommended by existing client.”

Purpose: Demonstrate dark / relationship attribution.

### Scenario 4 — LinkedIn

LinkedIn post  
→ Website  
→ Repeat visits  
→ Contact form  
→ Opportunity

Purpose: Demonstrate social influence.

### Scenario 5 — Unknown Attribution

Direct visit  
→ Contact form

No known previous history.

Purpose: Demonstrate data-quality gaps.

---

## 15. Data Quality

The prototype should make missing attribution visible.

Example (derived from seed data):

Fully attributed  
73% (58 leads)

Partial attribution  
15 leads

Attribution incomplete (Unknown)  
7 leads

Revenue with relationship attribution only  
€180K (1 deal)

This reinforces an important product idea:

> The system does not only show what the company knows. It also shows what the company does not know.

---

## 16. AI Feature — Prototype Only

The prototype may contain one lightweight AI experience.

Working name:

**Ask Inbound**

Canonical questions (00_DECISIONS.md §10.8):

- Where did Acme come from?
- Which channel generated the most pipeline?
- Show leads waiting for a reply.
- What are our biggest unattributed opportunities?
- Which source has the highest conversion rate?

The AI feature should use the existing structured prototype data.

AI is not the main product proposition.

It is an interface for exploring the revenue intelligence created by the platform.

---

## 17. Explicit Non-Goals for Prototype

The prototype will NOT attempt to:

- replace GA4,
- replace Hotjar,
- replace the CRM,
- replace email,
- replace marketing automation,
- replace ad platforms,
- provide real production attribution,
- implement live OAuth integrations,
- implement full identity resolution,
- implement production tracking infrastructure,
- provide recruitment analytics,
- support Manatal,
- implement complex machine-learning attribution models.

---

## 18. Prototype Product Principle

Every metric should be explainable.

If the system shows (illustrative):

LinkedIn Organic
€200K Open Pipeline

the user should be able to navigate from:

€200K Open Pipeline

↓

Opportunities

↓

Companies

↓

People

↓

Customer journeys

↓

Specific attribution events

The product should avoid black-box attribution.

---

## 19. Success Criteria for the Prototype

The prototype succeeds if a management stakeholder can use it and understand:

1. The current inbound data problem.
2. Why existing systems cannot provide the complete journey.
3. How the proposed product connects those systems.
4. Where a specific lead originated.
5. What happened before the lead converted.
6. What happened after conversion.
7. How marketing activity connects to pipeline.
8. How pipeline connects to revenue.
9. Why this could improve marketing and sales decisions.
10. How the product could technically become real.

The desired reaction is:

> “This is information we should already have, but today we don't.”

---

## 20. Working Product Positioning

### Internal working name

Inbound Revenue Intelligence

### One-line description

A unified view of how inbound demand moves from first interaction to pipeline and revenue.

### Product promise

**From first touch to revenue — one customer journey.**

### Alternative management framing

**Know where your revenue actually comes from.**

---

## 21. Framing (v0.2)

The prototype is framed **internal first, productisable later**: MOP's own inbound intelligence layer across MOP's real tool stack, built with product-grade architecture and language so it can later be offered to clients. Seeded figures are marked as sample data in the UI.
