# Implementation Plan: Vibecoding Workflow v2.0

## Overview

Transform the current workflow from a single-ceremony system into an adaptive, tier-based vibecoding tool with state persistence, error recovery, memory integration, visual verification, CI/CD, parallel workflows, and interactive onboarding.

**Total files to create:** 8 new files
**Total files to modify:** 12 existing files
**Total files to delete/replace:** 0

---

## Phase 1: Rewrite CLAUDE.md with Tier System

**Goal:** Replace the current single-ceremony workflow with the adaptive 4+1 tier system. This is the backbone — everything else depends on it.

### Files to modify:

#### 1.1 `CLAUDE.md` — Complete rewrite

**What changes:**
- Add tier system (Minimal / Light / Standard / Full / Emergency) as the primary workflow model
- Add auto-detection algorithm inline (from `config/detection.yaml` logic)
- Add `/vibe` command syntax and aliases (from `config/commands.yaml`)
- Replace the current "5 phases always" with "right-sized phases per tier"
- Keep personas but assign them to tiers (Tech Lead: Standard+Full, Quality Lead: Full only)
- Keep critical rules, add tier-specific rules
- Add tier override flags (`--minimal`, `--light`, `--standard`, `--full`)
- Add natural language triggers (from `config/commands.yaml`)
- Remove redundant references to YAML configs (they become reference-only)
- Add memory usage instructions (save/recall patterns)
- Add state tracking instructions (read/write `.vibe/state.json`)

**New CLAUDE.md structure:**
```
# CLAUDE.md
## Project Overview (same placeholders)
## Workflow: Adaptive Tier System
  ### How It Works (auto-detect → confirm tier → execute)
  ### Tier Definitions (inline, not referencing YAML)
    - MINIMAL: lint → change → lint → done
    - LIGHT: understand → test → change → verify → done
    - STANDARD: spec → test-plan → implement(TDD) → review(5 gates) → present
    - FULL: spec → test-plan → implement(TDD) → review(10 gates) → document → present
    - EMERGENCY: reproduce → fix → critical-test → deploy → postmortem(24h)
  ### Auto-Detection Rules (inline summary)
  ### Override Flags
## Commands
  ### /vibe (primary command with subcommands)
  ### Legacy skills (/spec, /test-plan, etc. still work)
## Personas (same, with tier assignments)
## Quality Gates (same, with tier assignments)
## State Tracking (.vibe/state.json)
## Memory (what to save, when to recall)
## Code Style (same)
## Git Workflow (same)
## Bug Handling (same)
## Critical Rules (updated for tiers)
## Key Files (updated)
## Commands Reference (updated)
```

---

## Phase 2: New Skills

### 2.1 Create `.claude/skills/vibe/SKILL.md` — The Master Router

**Purpose:** Single entry point that auto-detects tier and routes to the right workflow.

**Behavior:**
1. Parse user request (natural language or `/vibe <command>`)
2. Run auto-detection algorithm (keyword scan, scope estimate, file count)
3. Propose tier with reasoning: "This looks like a LIGHT change (bug fix, 1-2 files). Proceeding with Light tier."
4. Allow user to override: "Override with --standard if you want full ceremony."
5. Execute the tier's phases sequentially
6. Track state in `.vibe/state.json`
7. Use memory MCP to recall relevant past patterns

**Detection algorithm (embedded in skill):**
```
1. Scan request for keywords → score each tier
2. If explicit command (fix/tweak/feature/epic) → use default tier from command
3. If flag present (--minimal/--light/etc.) → use that tier
4. If ambiguous → ask user
5. Emergency keywords always win
```

**Tier execution flows (embedded in skill):**
- MINIMAL: Read file → Make change → Run lint → Report done
- LIGHT: Read context → Write failing test → Fix → Run tests+lint → Report
- STANDARD: Invoke /spec → /test-plan → /implement → /review → Report
- FULL: Invoke /spec → /test-plan → /implement → /review (all 10 gates) → Generate docs → Report
- EMERGENCY: Reproduce → Write regression test → Fix → Run critical tests → Report → Schedule postmortem

### 2.2 Create `.claude/skills/fix/SKILL.md` — Quick Fix (Minimal/Light shortcut)

**Purpose:** Fast path for small changes without full ceremony.

**Behavior:**
1. Assess scope (minimal or light?)
2. If MINIMAL (typo, copy, styling):
   - Make the change
   - Run lint
   - Report: "Fixed. Lint clean."
3. If LIGHT (bug fix, small addition):
   - Understand the issue (read relevant code)
   - Write a failing test (if testable)
   - Make the fix
   - Run tests + lint
   - Report: "Fixed. Tests pass. Lint clean."
4. Track in `.vibe/state.json`

**Key difference from /implement:** No spec, no test plan, no review gates beyond lint+tests.

### 2.3 Create `.claude/skills/status/SKILL.md` — Workflow Status

**Purpose:** Show current workflow state, what phase you're in, what's done, what's next.

**Behavior:**
1. Read `.vibe/state.json`
2. If no active workflow: "No active workflow. Start one with /vibe or /spec."
3. If active: Display current feature, tier, phase, AC completion, gate results
4. Show recent history (last 3 completed workflows)

**Output format:**
```
WORKFLOW STATUS

Active: [Feature Name]
Tier: STANDARD
Phase: Implementation (3/5 ACs done)

Acceptance Criteria:
- AC-001: login form renders — PASSED
- AC-002: validates email — PASSED
- AC-003: submits credentials — PASSED
- AC-004: handles errors — IN PROGRESS
- AC-005: redirects on success — PENDING

Gates: Not yet run (Phase 4)

Next: Complete AC-004, then AC-005, then /review
```

### 2.4 Create `.claude/skills/getting-started/SKILL.md` — Interactive Onboarding

**Purpose:** Walk a new user through their first feature using the workflow, teaching by doing.

**Behavior:**
1. Welcome message explaining the workflow in 3 sentences
2. Ask: "What's the first thing you want to build?"
3. Auto-detect tier for their request
4. Walk through each phase with explanations:
   - "We're in the SPEC phase. I'll write a specification with acceptance criteria..."
   - "Now we'll PLAN TESTS. This ensures we know what to test before coding..."
   - "TDD time. I'll write a failing test first, then make it pass..."
5. At each stop-point, explain WHY we stop
6. After completion, summarize the workflow they just experienced
7. Point to QUICK_REFERENCE.md for future reference

---

## Phase 3: Error Recovery in All Skills

**Goal:** Add structured failure handling to every skill so Claude doesn't improvise on errors.

### Files to modify:

#### 3.1 `.claude/skills/spec/SKILL.md` — Add error recovery

Add section:
```markdown
## Error Recovery
- If user rejects spec: Ask what needs to change. Revise. Re-present.
- If spec exceeds 100 lines: Split into smaller features. Present split proposal.
- If ACs are ambiguous: Ask clarifying questions before finalizing.
- If you can't determine non-goals: Ask "What should this feature NOT do?"
```

#### 3.2 `.claude/skills/test-plan/SKILL.md` — Add error recovery

Add section:
```markdown
## Error Recovery
- If spec not found: Ask user for spec location or offer to create one.
- If spec has no ACs: STOP. Tell user. Do not guess test shapes.
- If AC is untestable as written: Flag it. Propose rewrite. Wait for approval.
- If testing framework not configured: Report missing setup. Don't proceed.
```

#### 3.3 `.claude/skills/implement/SKILL.md` — Add error recovery

Add section:
```markdown
## Error Recovery
- If context7 fails: Warn user. Check docs manually via WebSearch. Note in output.
- If RED test passes unexpectedly: Test is wrong. Delete it. Re-analyze the AC.
- If GREEN breaks other tests: Revert. Understand the coupling. Fix design, not symptoms.
- If lint fails after refactor: Fix lint issues. Re-run all tests.
- If a dependency is missing: Report it. Ask user to install. Don't auto-install.
- If you're stuck on an AC: STOP. Report what you tried. Ask for guidance.
```

#### 3.4 `.claude/skills/review/SKILL.md` — Add error recovery

Add section:
```markdown
## Error Recovery
- If tests fail: Report which tests and why. Fix if obvious. Re-run ALL gates.
- If lint fails: Run `npm run lint:fix`. If auto-fix doesn't resolve, report remaining issues.
- If responsive check fails: Report which breakpoint and what breaks. Fix. Re-check all breakpoints.
- If build fails: Report error. Fix. Re-run full build.
- If Lighthouse < 90: Report score breakdown. Fix top 3 issues. Re-audit.
- If accessibility fails: Report axe-core violations. Fix. Re-scan.
- After ANY fix: Re-run ALL gates from the beginning, not just the failed one.
- If a gate is impossible to pass (e.g., no Lighthouse in CLI): Note as SKIPPED with reason.
```

#### 3.5 `.claude/skills/ship/SKILL.md` — Add error recovery

Add section:
```markdown
## Error Recovery
- If pre-commit hook fails: Fix the issue. Stage fixes. Create NEW commit (never --amend).
- If push fails (non-fast-forward): Report conflict. Ask user how to resolve.
- If PR creation fails: Report error. Check gh auth status. Report to user.
- If branch doesn't exist on remote: Create with `git push -u origin <branch>`.
- If there are unstaged changes mixed with staged: Report. Ask user which files to include.
```

#### 3.6 `.claude/skills/bug/SKILL.md` — Add error recovery

Add section:
```markdown
## Error Recovery
- If bug is not reproducible: Document what you tried. Ask user for more context/steps.
- If Five Whys stalls: Report where analysis stopped. Ask user for domain knowledge.
- If regression test is hard to write: The bug may span multiple systems. Simplify scope.
- If fix breaks other tests: Revert. The root cause analysis was incomplete. Go deeper.
- If you can't find the root cause after reasonable effort: Report findings. Suggest pair debugging.
```

#### 3.7 `.claude/skills/mock-data-doc/SKILL.md` — Add error recovery

Add section:
```markdown
## Error Recovery
- If no mock data found: Report search locations checked. Ask user where mocks live.
- If mock shapes are ambiguous: Mark fields as "type unclear" — don't guess.
- If mock data is scattered across 20+ files: Group by entity, not by file. Note all sources.
- If relationships between mocks are unclear: Document what you see. Flag as "relationship unclear."
```

---

## Phase 4: Workflow State Persistence

**Goal:** Enable pause/resume/status across sessions.

### 4.1 Create `.vibe/state.json` schema (documented in new skill)

**Schema:**
```json
{
  "version": 1,
  "active_workflow": {
    "feature": "user-authentication",
    "tier": "standard",
    "started_at": "2025-01-15T10:30:00Z",
    "current_phase": "implementation",
    "spec_file": "docs/specs/user-authentication.md",
    "acceptance_criteria": {
      "AC-001": { "status": "passed", "test_file": "src/auth/login.test.ts" },
      "AC-002": { "status": "in_progress", "test_file": null },
      "AC-003": { "status": "pending", "test_file": null }
    },
    "gates": {
      "tests": null,
      "lint": null,
      "acs_met": null,
      "responsive": null,
      "code_review": null
    },
    "notes": []
  },
  "history": [
    {
      "feature": "landing-page",
      "tier": "light",
      "completed_at": "2025-01-14T16:00:00Z",
      "result": "shipped"
    }
  ]
}
```

### 4.2 Update all skills to read/write state

Every skill that starts, progresses, or completes work must:
- Read `.vibe/state.json` at start
- Update phase/AC status during work
- Write `.vibe/state.json` on completion or pause

Add state management instructions to each skill's process section.

### 4.3 Add pause/resume to CLAUDE.md

Add instructions:
- "pause" or `/vibe pause` → Save current state, report what's in progress
- "resume" or `/vibe resume` → Read state, report where we left off, continue
- State file is gitignored (already in `.vibe/`)

---

## Phase 5: Config Consolidation

**Goal:** Single source of truth — CLAUDE.md and skills are authoritative, YAML configs become reference-only.

### Files to modify:

#### 5.1 Rename config files to mark as reference

- `config/workflow.config.yaml` → add header comment: `# REFERENCE ONLY — authoritative config is in CLAUDE.md`
- `config/tiers.yaml` → add header: `# REFERENCE ONLY — tier definitions are in CLAUDE.md`
- `config/commands.yaml` → add header: `# REFERENCE ONLY — command definitions are in CLAUDE.md`
- `config/detection.yaml` → add header: `# REFERENCE ONLY — detection rules are in .claude/skills/vibe/SKILL.md`
- `config/gates.yaml` → add header: `# REFERENCE ONLY — gate definitions are in .claude/skills/review/SKILL.md`
- `config/personas.yaml` → add header: `# REFERENCE ONLY — persona definitions are in CLAUDE.md`

#### 5.2 Update `docs/WORKFLOW_RULES.md`

- Add note at top: "CLAUDE.md is the single source of truth. This document is a detailed reference."
- Update to reflect tier system
- Update commands section

#### 5.3 Update `docs/QUICK_REFERENCE.md`

- Add tier quick reference table
- Add `/vibe` command cheat sheet
- Add `/fix` shortcut reference
- Add `/status` reference
- Update phase descriptions to mention tiers

#### 5.4 Update `docs/METHODOLOGY.md`

- Add section: "Adaptive Ceremony: Right-Sized Process"
- Explain tier philosophy: "Not every change deserves a spec. But every feature does."
- Update workflow flow diagram to show tier routing

---

## Phase 6: Memory Integration

**Goal:** Make the workflow learn from past sessions.

### 6.1 Update `.claude/skills/vibe/SKILL.md` — Add memory hooks

Add to the vibe skill:
```markdown
## Memory Integration

After completing any workflow:
1. Save to memory MCP: feature name, tier used, gates passed/failed, issues encountered
2. Save user preferences: if user overrides tier detection, remember the pattern

Before starting any workflow:
1. Recall from memory: Has a similar feature been built? What tier was used? Any lessons?
2. Recall user preferences: Does user prefer certain patterns? Skip certain checks?

Memory keys:
- `workflow::<feature-name>` — completed workflow metadata
- `preference::tier-override::<pattern>` — user's tier preferences
- `lesson::<category>` — lessons learned from past bugs/reviews
```

### 6.2 Update `.claude/skills/review/SKILL.md` — Save gate results

After review completes:
- Save to memory: which gates failed first, what the fix was
- If same gate fails repeatedly, flag it in future reviews

### 6.3 Update `.claude/skills/bug/SKILL.md` — Save bug patterns

After bug resolution:
- Save to memory: bug category, root cause pattern, prevention measure
- On future bugs, recall: "A similar bug was found before — see BUG-003"

---

## Phase 7: Visual Verification in Review

**Goal:** Add screenshot-based visual verification to the review skill.

### 7.1 Update `.claude/skills/review/SKILL.md` — Add visual verification gate

Add after Gate 4 (Responsive):

```markdown
### Gate 4b: Visual Verification (if UI change)

1. Use Playwright MCP to capture screenshots at key breakpoints:
   - 375px (mobile)
   - 768px (tablet)
   - 1440px (desktop)
2. Present screenshots to user with annotations:
   - What changed visually
   - Before/after comparison (if baseline exists)
3. User confirms visual correctness

If Playwright is unavailable:
- Note as SKIPPED: "No browser automation available"
- Ask user to manually verify
```

### 7.2 Update `.claude/skills/review/SKILL.md` — Add baseline management

```markdown
## Visual Baselines

After user approves screenshots:
- Save screenshot descriptions to `.vibe/baselines/[feature].json`
- On future reviews, compare against baseline
- Report visual regressions
```

---

## Phase 8: Activate CI/CD

**Goal:** Turn the example workflow into a real, working CI pipeline.

### 8.1 Create `.github/workflows/quality-gates.yml` (new file, replacing example)

```yaml
name: Quality Gates
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck || true

      - name: Tests
        run: npm run test || true

      - name: Build
        run: npm run build || true
```

**Notes:**
- Use `|| true` for optional commands that may not exist in all projects
- Keep it generic — works with any JS/TS project
- No Lighthouse/a11y in CI (those are manual review gates)
- Projects customize by removing `|| true` when commands are available

### 8.2 Delete `.github/workflows/quality-check.yml.example`

Replace with the real workflow above. No more dead examples.

### 8.3 Update `CLAUDE.md` — Reference CI

Add to Quality Gates section:
```markdown
## CI/CD
Quality gates 1, 2, and 9 (lint, tests, build) run automatically on every PR via GitHub Actions.
Manual gates (responsive, performance, accessibility) are verified during /review.
```

---

## Phase 9: Parallel Workflow Support

**Goal:** Document and skill-ify git worktree-based parallel development.

### 9.1 Create `.claude/skills/worktree/SKILL.md`

```markdown
# Skill: Parallel Workflow (Worktrees)

Activate when: User wants to work on multiple features simultaneously.

## Start a parallel feature
1. Create worktree: `git worktree add .claude/worktrees/<feature-name> -b feature/<feature-name>`
2. Initialize state: Create `.vibe/state.json` entry for this feature
3. Report: "Worktree created. Working on <feature-name> in parallel."

## Switch context
1. List worktrees: `git worktree list`
2. Show status of each feature's workflow
3. Switch to requested feature

## Merge back
1. Verify all gates pass in the worktree
2. Switch to main branch
3. Merge: `git merge feature/<feature-name>`
4. Clean up: `git worktree remove .claude/worktrees/<feature-name>`

## Rules
- Each worktree gets its own branch
- Never merge without user approval
- Run gates before merge, not after
- Keep worktree list clean — remove completed ones
```

### 9.2 Update `CLAUDE.md` — Add parallel workflow section

Brief section explaining worktrees and pointing to `/worktree` skill.

---

## Phase 10: Documentation Updates

**Goal:** Update all docs to reflect v2.0 changes.

### 10.1 Update `docs/WORKFLOW_RULES.md`
- Add tier system reference
- Add new commands (/vibe, /fix, /status, /getting-started, /worktree)
- Update phase descriptions to be tier-aware
- Add state tracking section
- Add memory integration section
- Add visual verification section

### 10.2 Update `docs/QUICK_REFERENCE.md`
- Add tier quick-reference table at the top
- Add /vibe command cheat sheet
- Update gate assignments per tier
- Add state commands (pause/resume/status)

### 10.3 Update `docs/METHODOLOGY.md`
- Add "Adaptive Ceremony" philosophy section
- Update flow diagram to show tier routing
- Add "Learning from Past Sessions" section (memory)
- Add "Visual Verification" section

### 10.4 Update `docs/README.md`
- Update skill list (add new skills)
- Update workflow overview to mention tiers
- Add getting-started reference

### 10.5 Update `README.md` (project root)
- Mention v2.0 tier system
- Update feature list
- Add getting-started instructions

---

## Execution Order & Dependencies

```
Phase 1 (CLAUDE.md rewrite)
    ↓
Phase 2 (New skills: /vibe, /fix, /status, /getting-started)
    ↓
Phase 3 (Error recovery in all existing skills) ←— can parallel with Phase 2
    ↓
Phase 4 (State persistence)
    ↓
Phase 5 (Config consolidation) ←— can parallel with Phase 4
    ↓
Phase 6 (Memory integration) ←— depends on Phase 2 (/vibe skill exists)
    ↓
Phase 7 (Visual verification) ←— depends on Phase 3 (review skill updated)
    ↓
Phase 8 (CI/CD activation) ←— independent, can parallel with Phase 6-7
    ↓
Phase 9 (Parallel workflows) ←— independent, can parallel with Phase 6-8
    ↓
Phase 10 (Documentation) ←— MUST be last, reflects all other changes
```

---

## File Change Summary

### New Files (8):
1. `.claude/skills/vibe/SKILL.md` — Master router skill
2. `.claude/skills/fix/SKILL.md` — Quick fix skill
3. `.claude/skills/status/SKILL.md` — Status display skill
4. `.claude/skills/getting-started/SKILL.md` — Onboarding skill
5. `.claude/skills/worktree/SKILL.md` — Parallel workflow skill
6. `.github/workflows/quality-gates.yml` — Real CI pipeline
7. `.vibe/state.json` — State schema (created at runtime)
8. `docs/IMPLEMENTATION_PLAN.md` — This plan (already created)

### Modified Files (12):
1. `CLAUDE.md` — Complete rewrite for tier system
2. `.claude/skills/spec/SKILL.md` — Error recovery section
3. `.claude/skills/test-plan/SKILL.md` — Error recovery section
4. `.claude/skills/implement/SKILL.md` — Error recovery + state tracking
5. `.claude/skills/review/SKILL.md` — Error recovery + visual verification + memory
6. `.claude/skills/ship/SKILL.md` — Error recovery section
7. `.claude/skills/bug/SKILL.md` — Error recovery + memory
8. `.claude/skills/mock-data-doc/SKILL.md` — Error recovery section
9. `config/*.yaml` (6 files) — Add "REFERENCE ONLY" headers
10. `docs/WORKFLOW_RULES.md` — Tier system + new skills
11. `docs/QUICK_REFERENCE.md` — Tier quick ref + new commands
12. `docs/METHODOLOGY.md` — Adaptive ceremony philosophy

### Deleted Files (1):
1. `.github/workflows/quality-check.yml.example` — Replaced by real workflow

---

## Success Criteria

After all phases are complete:

- [ ] A typo fix (`/vibe fix the typo in header`) goes through MINIMAL tier (lint only)
- [ ] A bug fix (`/vibe fix the login crash`) goes through LIGHT tier (test + fix + verify)
- [ ] A new feature (`/vibe add user authentication`) goes through STANDARD tier (spec → test → implement → review)
- [ ] An epic (`/vibe epic: redesign the dashboard`) goes through FULL tier (all phases, all 10 gates)
- [ ] `/status` shows current workflow state
- [ ] Pausing and resuming a feature works across sessions
- [ ] All skills have error recovery paths
- [ ] CI runs lint+tests on every PR
- [ ] Memory recalls past patterns and preferences
- [ ] Visual screenshots are part of review
- [ ] Parallel features work via worktrees
- [ ] A new user can run `/getting-started` and learn by doing
- [ ] CLAUDE.md is the single source of truth (no config drift)
