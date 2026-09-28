# Contradiction Resolutions

## Pre-Implementation Review — 2026-09-27

Before starting development, all 9 documentation files were read in priority order defined by `CLAUDE.md`. Five contradictions were identified between lower-priority documents and `00_DECISIONS.md`. All resolved per the standing rule: **`00_DECISIONS.md` wins.**

Approved by Igor before Phase 1.

---

## Resolution A — Remove `partner_referral` event type

**Source:** `03_DATA_MODEL_EVENT_TAXONOMY.md` §16 lists `partner_referral` as an acquisition event type.

**Conflict:** `00_DECISIONS.md` §4 removes `partner` from `AcquisitionSource`. Partner introductions are relationship attribution, not acquisition events.

**Resolution:** Do not implement `partner_referral` in the event type enum. Relationship introductions are modeled as `RelationshipAttribution` records.

---

## Resolution B — `attributionStatus` is derived, never stored

**Source:** `03_DATA_MODEL_EVENT_TAXONOMY.md` §6 defines `Visitor` with `attributionStatus` as a stored field.

**Conflict:** `00_DECISIONS.md` §6 says attribution status is derived (computed by `lib/attribution/status.ts`). Visitor is conceptual in V1.

**Resolution:** Do not include `attributionStatus` on any stored type. Always compute it from touchpoint data.

---

## Resolution C — Accounts filters are Source and Owner only

**Source:** `08_CLAUDE_CODE_BUILD_INSTRUCTIONS.md` §31 lists "source, industry, stage, owner, value filters" for Accounts.

**Conflict:** `00_DECISIONS.md` §10.2 explicitly says "Accounts filters: Source and Owner only."

**Resolution:** Implement Source and Owner filters plus search on the Accounts page. No industry, stage, or value filters.

---

## Resolution D — "Sample data" badge in sidebar only

**Source:** `05_DESIGN_SYSTEM.md` §62, `06_SCREEN_SPECIFICATIONS.md` §3.4 and §4 place the badge in different locations (sidebar, global header, or both).

**Conflict:** `00_DECISIONS.md` §2 says "next to the workspace name."

**Resolution:** One badge next to the workspace name in the sidebar bottom. No duplicate in the global header.

---

## Resolution E — Leads date filter uses standard options independently

**Source:** `02_PROTOTYPE_REQUIREMENTS.md` §9 lists "7 days, 30 days, 90 days, custom visual option" for Leads.

**Conflict:** `00_DECISIONS.md` §8 defines canonical date range options (Last 7/30/90 Days, This Quarter, This Year) and states the `?range=` parameter is only on Overview and Attribution. Leads has its own independent Date filter.

**Resolution:** Leads gets the same option labels (Last 7 Days, Last 30 Days, Last 90 Days, This Quarter, This Year) for visual consistency, but operates independently — no `?range=` URL sync with Overview/Attribution. Default: This Year.
