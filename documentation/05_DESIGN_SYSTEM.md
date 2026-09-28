# Inbound Revenue Intelligence
## DESIGN_SYSTEM.md
### v0.2

> **v0.2 — amended by `00_DECISIONS.md`.** Where this document conflicts with `00_DECISIONS.md`, `00_DECISIONS.md` wins. Figures that do not appear in `00_DECISIONS.md` or `04_SEED_DATA_SPECIFICATION.md` are illustrative and must not be seeded.

## 1. Purpose

This document defines the visual and interaction system for the Inbound Revenue Intelligence prototype.

The system is designed to ensure that:

- all screens feel like one coherent product,
- Claude Code reuses components rather than inventing UI per page,
- data remains the visual priority,
- attribution remains explainable,
- the interface supports dense B2B information without becoming visually noisy,
- the prototype can evolve into a production product without a complete design reset.

The design system follows Atomic Design principles and introduces domain-specific product primitives for revenue intelligence.

---

## 2. Product Design Philosophy

The interface should feel:

- precise,
- calm,
- intelligent,
- premium,
- data-driven,
- executive,
- trustworthy,
- operational rather than decorative.

The product should NOT feel like:

- a generic AI dashboard,
- a marketing landing page,
- a consumer application,
- a CRM clone,
- a neon cyber-security interface,
- a collection of oversized cards.

The guiding principle is:

> **The data is the interface.**

Visual design should support comprehension rather than compete with the information.

---

## 3. Reference Direction

### Attio

Use as inspiration for:

- dense CRM records,
- structured tables,
- entity-based navigation,
- restrained visual styling,
- record detail screens,
- compact controls.

### Linear

Use as inspiration for:

- navigation discipline,
- keyboard-friendly interaction,
- compact component sizing,
- state clarity,
- hover behavior,
- typography hierarchy,
- low visual noise.

### Amplitude

Use as inspiration for:

- analytical drill-down,
- shared filters,
- source segmentation,
- time-range controls,
- progressive disclosure,
- chart-to-record navigation.

### Stripe / Vercel

Use as inspiration for:

- typographic discipline,
- token consistency,
- clean borders,
- subtle layering,
- spacing quality,
- documentation-quality UI structure.

---

## 4. Core Visual Direction

The product is:

**Dark-first**

The UI should use a warm dark foundation rather than pure black.

Primary visual character:

> Warm dark surfaces + precise typography + restrained MOP Red + semantic analytics colors.

---

## 5. Raw Color Palette

### Brand

```text
MOP Red
#F24B57

MOP Dark
#161010

MOP Dark Gray
#252525

MOP Dessert
#DDC1B2

Yellow
#FFD600
```

### Neutrals

```text
MOP White
#FFFFFF

MOP Light Gray
#E7E1E2

MOP Gray
#96999E

Neutral 600
#666666
```

### Alerts

```text
Error
#E20B0B

Success
#74C324

Warning
#F8A20D
```

---

## 6. Semantic Color Tokens

### Foundations

```text
background              #161010
background-subtle       #1B1717

surface                 #1E1B1B
surface-raised          #252525
surface-hover           #2B2929
surface-active          #332E2F

overlay                 rgba(0,0,0,0.60)
```

### Text

```text
text-primary            #FFFFFF
text-secondary          #C2BDBE
text-muted              #96999E
text-disabled           #666666
text-inverse            #161010
```

### Borders

```text
border-subtle           rgba(255,255,255,0.07)
border-default          rgba(255,255,255,0.10)
border-strong           rgba(255,255,255,0.18)
border-focus            #F24B57
```

### Brand Semantics

```text
primary                 #F24B57
primary-hover           derived darker red
primary-active          derived darker red
primary-muted           transparent/red-tinted background
primary-foreground      #161010  (dark text on red ≈ 5.3:1; white on red ≈ 3.5:1 fails AA for button text)

secondary-accent        #DDC1B2
highlight               #FFD600
```

### Functional

```text
success                 #74C324
warning                 #F8A20D
danger                  #E20B0B
info                    text-secondary neutral (Dessert is reserved for acquisition and secondary data series)
```

---

## 7. Brand Color Usage

### MOP Red

Use for:

- primary CTA,
- selected navigation state,
- active tab indicator,
- primary focus ring,
- current chart selection,
- key conversion markers,
- meaningful visual emphasis.

Do not use MOP Red as generic decoration.

### MOP Dessert

Use for:

- secondary data series,
- subtle highlights,
- calm context panels,
- supporting analytics states,
- less aggressive selection surfaces.

### Yellow

Use only for:

- partial / incomplete attribution.

Warning orange (#F8A20D) is used for integration attention and waiting / stalled leads. Each colour has one meaning (00_DECISIONS.md §13).

---

## 8. Success / Warning / Error Rules

Brand red must remain distinct from destructive red.

```text
Brand action
#F24B57

Destructive
#E20B0B
```

Success is reserved for genuinely positive states.

Warning is for attention-required states.

Error is for failures and destructive actions.

---

## 9. Typography

Recommended font direction:

**Inter** or another highly readable modern grotesk.

The prototype should not introduce a decorative display typeface.

### Type Scale

Display: 32–36 px, 600  
H1: 28 px, 600  
H2: 22–24 px, 600  
H3: 18 px, 600  
Body: 14–15 px, 400  
Small: 12–13 px  
Table: 13–14 px  
Numeric KPI: 24–32 px, 600, tabular numerals

---

## 10. Typography Rules

Use sentence case.

Avoid:

- ALL CAPS as primary UI style,
- excessive bold,
- giant headings,
- marketing headline treatment inside application screens.

Labels should be smaller and quieter than values.

---

## 11. Spacing System

Use a 4px base grid.

Recommended scale:

```text
4
8
12
16
20
24
32
40
48
64
```

Most application spacing should live between 8px and 24px.

---

## 12. Layout Grid

Desktop-first.

Recommended application layout:

```text
Sidebar
220–240px

Main content
fluid

Max content width
none for analytical tables
1400–1600px for constrained detail views
```

---

## 13. Radius

Use restrained radius.

Recommended:

```text
small       6px
default     8px
large       10px
modal       12px
```

Pill radius is acceptable for compact badges and tags.

---

## 14. Borders

Borders are preferred over heavy shadows.

Use subtle 1px borders for most visual separation.

Not every section requires a container.

---

## 15. Elevation

Shadows should be minimal.

Use elevation only for:

- dropdowns,
- modals,
- command palette,
- overlays,
- floating panels.

---

## 16. Motion

Motion must be subtle and fast.

Recommended:

```text
150–200ms
ease-out
```

---

## 17. Atomic Design Architecture

The component hierarchy is:

```text
Design Tokens
↓
Atoms
↓
Molecules
↓
Organisms
↓
Templates
↓
Pages
```

Claude Code should respect this hierarchy **as design thinking**. The codebase uses pragmatic folders instead of textbook Atomic folders (00_DECISIONS.md §12):

```text
components/
  ui/        atoms — shadcn primitives + generic DataTable (do not wrap shadcn)
  domain/    entity primitives (molecule level) — each exists exactly once
  features/  organisms — journey, attribution, leads, accounts, overview,
             integrations, ask-inbound, search
  layout/    templates — AppShell, Sidebar, GlobalHeader, PageHeader,
             ListLayout, RecordDetailLayout, AnalyticsLayout
```

Dependency direction: `app → features → domain → ui`. Nothing imports upward.

---

## 18. Atoms

Required atoms *(v0.2: provided by shadcn in `components/ui` where possible — do not re-wrap. Add Radio, Textarea, Switch, Spinner only if a screen needs them.)*:

```text
Button
IconButton
Badge
Avatar
Text
Heading
Label
Input
Textarea
Checkbox
Radio
Switch
Divider
Tooltip
Spinner
Skeleton
Progress
StatusDot
SourceIcon
MetricValue
MoneyValue
Timestamp
Icon
```

---

## 19. Molecules

Required molecules *(v0.2: entity primitives live once in `components/domain`; generic controls come from `components/ui`)*:

```text
SearchField
FilterSelect
DateRangeSelector
MetricCard
SourceBadge
StageBadge
AttributionBadge
AttributionStatus
OwnerChip
PersonIdentity
CompanyIdentity
OpportunityValue
StatDelta
TimelineMeta
IntegrationStatus
EmptyMessage
SectionHeader
FilterChip
```

---

## 20. Product Primitives

Required:

```text
<PersonIdentity />
<CompanyIdentity />
<OpportunityValue />
<SourceBadge />
<CampaignBadge />
<StageBadge />
<OwnerChip />
<AttributionStatus />
<EventType />
<MoneyValue />
<DateTime />
<SourceSystemChip />
```

The same entity should never be represented inconsistently across screens.

---

## 21. Organisms

Required organisms *(v0.2: live in `components/features/<feature>`)*:

```text
GlobalNavigation
GlobalHeader
GlobalSearch
FilterBar
LeadTable
AccountTable
AttributionTable
JourneyTimeline
AttributionSummary
EngagementSummary
OpportunitySummary
ConversionFunnel
PipelineBySource
RevenueBySource
DataQualityPanel
AccountContacts
IntegrationGrid
AskInboundPanel
```

---

## 22. Templates

Required templates *(v0.2: implemented as layout components in `components/layout` — AppShell, PageHeader, ListLayout, RecordDetailLayout, AnalyticsLayout; Journeys and Integrations reuse ListLayout)*:

```text
DashboardTemplate
ListTemplate
RecordDetailTemplate
AnalyticsTemplate
JourneyTemplate
IntegrationTemplate
```

---

## 23. Page Mapping

```text
/overview
→ DashboardTemplate

/leads
→ ListTemplate

/leads/[id]
→ RecordDetailTemplate

/accounts
→ ListTemplate

/accounts/[id]
→ RecordDetailTemplate

/attribution
→ AnalyticsTemplate

/journeys
→ JourneyTemplate

/integrations
→ IntegrationTemplate

/ask-inbound
→ Analytics/Conversation hybrid
```

---

## 24. Navigation System

Sidebar should contain:

- product identity,
- primary navigation,
- secondary navigation,
- workspace/user area.

Active navigation:

Use a subtle dark selection surface with a red indicator.

Do not fill the entire active row with bright red.

---

## 25. Data Tables

Tables are a primary product surface.

Required behaviors:

```text
sorting
filters
search
sticky headers
row hover
clickable rows
status cells
money cells
source cells
person/company cells
column alignment
empty state
loading state
```

Implement one generic `DataTable` in `components/ui`; LeadTable, AccountTable, AttributionTable and JourneyTable are feature configurations of it.

Recommended row height:

44–52px

---

## 26. Metric Cards

Metric cards should not feel like giant containers.

Use:

```text
label
value
trend
optional context
```

No decorative icon is required by default.

---

## 27. Analytics Layout

Prefer:

- data tables,
- ranked bars,
- compact charts,
- meaningful comparisons.

Avoid:

- decorative donut charts,
- 3D charts,
- gauges,
- chart overload.

---

## 28. Chart Palette

Recommended priority:

```text
Primary series
MOP Red

Secondary
MOP Dessert

Tertiary
Yellow

Additional
Neutral variants

Positive outcome
Success Green
```

Do not create rainbow charts.

---

## 29. Chart Interaction

Charts should support progressive disclosure.

Example:

```text
Referral
€180K
↓
Referral opportunities
↓
Companies
↓
Account journey
```

---

## 30. Attribution UI Pattern

Never display only:

```text
Source: LinkedIn
```

Preferred:

```text
First Touch
Google Organic

Last Marketing Touch
LinkedIn Organic

Conversion
Direct / Contact Form
```

---

## 31. Attribution Explainability

Every attribution output should support:

**Why?**

Opening the explanation reveals:

- timestamp,
- reason,
- source system,
- referrer,
- landing page,
- relevant campaign/content.

This should be reusable as:

```text
<AttributionExplanation />
```

---

## 32. Attribution Status

### Full

Label: Fully attributed

### Partial

Label: Partial attribution

Use yellow / warning-adjacent treatment.

### Unknown

Label: Attribution incomplete

Supporting copy:

No known marketing interaction was identified before conversion.

---

## 33. Journey Timeline

The journey timeline is one of the signature UI elements.

It must not look like a generic vertical activity log.

Events should be hierarchical.

Recommended format:

```text
SEP 14

10:04   Website
        Direct visit
        /contact

10:11   Conversion
        Contact form submitted
        “We are exploring an AI platform…”

10:28   Communication
        Igor replied
        Response time 17m
```

---

### Journey provenance (v0.2)

- Every event shows a compact **source-system chip** (Website Tracker, GA4, LinkedIn, Resend, Sales Tracker, Email, Calendar…).
- Above the timeline: **"Journey assembled from N systems"** with the system chips. This visualises the core thesis.
- Consecutive low-emphasis page views within one session collapse into one expandable row ("3 pages viewed").

---

## 34. Timeline Event Hierarchy

### Low emphasis

- page viewed,
- generic session,
- email opened.

### Medium emphasis

- case study viewed,
- marketing touch,
- email received,
- meeting booked.

### High emphasis

- lead created,
- form submitted,
- opportunity created,
- proposal sent,
- deal won.

---

## 35. Timeline Category Semantics

Suggested accents:

```text
Acquisition
Dessert

Website
Neutral

Content
Gray / Dessert muted

Conversion
MOP Red

Communication
Neutral warm (text-secondary)

Meeting
Neutral accent

CRM / Opportunity
MOP Red muted

Revenue
Success Green
```

---

## 36. Account Detail

Account pages should emphasize:

```text
Company identity
Commercial status
Known contacts
Aggregated journey
Opportunities
```

The UI should clearly distinguish person-level data from company-level data.

---

## 37. Lead Detail

Lead detail should follow this hierarchy:

```text
Identity
↓
Commercial context
↓
Attribution
↓
Engagement
↓
Journey
↓
Communication
```

The Journey should receive the largest visual area.

---

## 38. Filters

Filters should be compact and persistent.

Use:

- dropdown
- filter chip
- date selector
- search

Active filters should be visually obvious.

---

## 39. Search

Global Search should support:

- person
- company
- email
- opportunity

Results should display entity type.

---

## 40. Empty States

Empty states should remain factual.

Avoid playful illustrations.

---

## 41. Loading States

Data is local and synchronous. One route-level `loading.tsx` is enough; no per-page skeletons.

Avoid full-screen spinners.

---

## 42. Error States

Errors should explain:

- what failed,
- whether data is stale,
- what user can do.

---

## 43. Integration Cards

Integration cards should be compact.

Display:

- Integration name
- Status
- Last sync
- Record count

Status indicators:

- Connected
- Attention
- Disconnected
- Archived

Avoid large logo-heavy cards.

---

## 44. Ask Inbound

The AI interface should visually belong to the product.

Do not make it resemble a generic standalone chatbot.

It should contain:

- contextual questions,
- structured answers,
- linked evidence,
- actions to open records.

---

## 45. Evidence Pattern

AI answers should reference underlying product records.

Conceptually:

```text
Answer
↓
Supporting events
↓
Open source journey
```

---

## 46. Responsive Behavior

Prototype priority:

Desktop.

Minimum practical width:

1280px.

Mobile optimization is not required for V1.

---

## 47. Accessibility

Required:

- sufficient contrast,
- visible focus states,
- keyboard navigation,
- semantic labels,
- tooltips for icon-only actions,
- do not communicate status using color alone.

---

## 48. Dark Theme Rules

Dark theme is default.

Avoid:

- pure black backgrounds,
- white borders,
- extreme contrast,
- glowing red effects.

Use warm tonal hierarchy.

---

## 49. Component Naming

Use semantic component names.

Good:

```text
AttributionSummary
JourneyEvent
SourceBadge
OpportunityValue
LeadTable
AccountContacts
```

Avoid:

```text
RedCard
BigBox
FancyPanel
Section3
```

---

## 50. Code Structure

See 00_DECISIONS.md §12.1:

```text
components/
  ui/
  domain/
  features/
  layout/
```

---

## 51. Styling Rule

Never hardcode brand hex values inside component JSX.

Avoid:

```tsx
className="bg-[#F24B57]"
```

Use semantic token classes such as:

```tsx
className="bg-primary"
```

or CSS variables.

---

## 52. Tailwind / shadcn Token Direction

Use Tailwind CSS v4 with tokens defined in `app/globals.css` via `@theme`. Map semantic tokens to shadcn variables using the table in 00_DECISIONS.md §12.3.

Example:

```text
--background
--foreground
--card
--card-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--destructive
--border
--input
--ring
--success
--warning
```

---

## 53. UI Composition Rule

Screens must reuse existing system components.

Before introducing a new visual component, check whether:

- Atom exists,
- Molecule exists,
- Organism exists,
- Domain primitive exists.

Page-specific one-off components should be rare.

---

## 54. Design Quality Test

Before considering a screen complete, ask:

- Does the screen communicate its primary question immediately?
- Is revenue/pipeline more visually important than pageviews?
- Are attribution states understandable without explanation?
- Are dense data surfaces readable?
- Can the user drill from metric to record?
- Is any color being used only decoratively?
- Are there unnecessary containers?
- Does it feel like one product rather than multiple templates?

---

## 55. Primary Design Principle

> **Clarity before decoration.**

## 56. Secondary Design Principle

> **Density without noise.**

## 57. Attribution Principle

> **Every attribution result should be explainable.**

## 58. Data Principle

> **Exact data should remain accessible beneath every summary.**

## 59. Interaction Principle

> **Every summary should lead to evidence.**

Example:

```text
€180K Referral Revenue
↓
Won opportunities
↓
Companies
↓
People
↓
Customer journey
↓
Underlying events
```

---

## 60. Prototype Design Definition of Done

The design system is successfully implemented when:

- all pages share the same tokens,
- components are reused consistently,
- raw colors are not scattered through JSX,
- tables follow one standard,
- attribution follows one standard,
- journey events follow one standard,
- statuses are consistent,
- filters behave consistently,
- spacing and typography follow the system,
- charts use the approved palette,
- the application can be visually understood without decorative explanation.

---

## 61. Final Product Character

The application should feel like:

> **A sophisticated internal intelligence system for understanding how relationships become revenue.**

Not:

> A colorful marketing analytics dashboard.

Not:

> Another CRM.

Not:

> An AI chatbot with some charts.

The product identity should come from:

- customer journey reconstruction,
- attribution clarity,
- account intelligence,
- revenue connection,
- explainability.

---

## 62. Sample Data Marker (v0.2)

Show a small neutral "Sample data" badge next to the workspace name in the global header, so seeded figures are not read as real results.
