# Vibecoding Workflow Rules (v2.0)

> **CLAUDE.md is the single source of truth.** This document is a detailed reference that expands on the rules defined there.

Complete reference for the development workflow. For philosophy and principles, see [METHODOLOGY.md](./METHODOLOGY.md).

---

## Table of Contents

1. [Adaptive Tier System](#adaptive-tier-system)
2. [Commands](#commands)
3. [Development Phases](#development-phases)
4. [Acceptance Criteria Format](#acceptance-criteria-format)
5. [Traceability Matrix](#traceability-matrix)
6. [Quality Gates](#quality-gates)
7. [Feature Delivery Format](#feature-delivery-format)
8. [Bug Handling Workflow](#bug-handling-workflow)
9. [Git Workflow](#git-workflow)
10. [Documentation Workflow](#documentation-workflow)
11. [Team Personas](#team-personas)
12. [Workflow State](#workflow-state)
13. [Memory Integration](#memory-integration)
14. [Parallel Workflows](#parallel-workflows)
15. [Critical Rules](#critical-rules)

---

## Adaptive Tier System

The workflow adapts ceremony to complexity. Every request goes through: Detect → Propose Tier → Confirm → Execute → Track.

| Tier | Ceremony Level | When to Use | Gates |
|------|---------------|-------------|-------|
| **MINIMAL** | Lint only | Typos, copy, styling, config | Lint |
| **LIGHT** | Test + Fix | Bug fixes, small additions, refactoring | Lint + Tests |
| **STANDARD** | Full 5-phase | New features, significant changes | 5 (prototype) or 10 (production) |
| **FULL** | Full + extras | Epics, architecture, security, migrations | All 10 + architecture review |
| **EMERGENCY** | Critical path | Production down, security vulnerability | Critical tests only |

Auto-detection uses keyword signals, scope estimation, and file count. Users can always override with `--minimal`, `--light`, `--standard`, `--full`.

---

## Commands

### Primary: `/vibe` (alias: `/v`)

| Command | Default Tier | Description |
|---------|-------------|-------------|
| `/vibe tweak <desc>` | MINIMAL | Small change |
| `/vibe fix <desc>` | LIGHT | Bug fix |
| `/vibe update <desc>` | LIGHT | Update existing |
| `/vibe refactor <desc>` | LIGHT | Refactoring |
| `/vibe add <desc>` | STANDARD | Add functionality |
| `/vibe feature <desc>` | STANDARD | New feature |
| `/vibe epic <desc>` | FULL | Major feature |
| `/vibe hotfix <desc>` | EMERGENCY | Production fire |

### Workflow Control

| Command | Action |
|---------|--------|
| `/vibe status` | Show current state |
| `/vibe pause` | Save and pause |
| `/vibe resume` | Resume from saved state |
| `/vibe approve` | Approve current phase |
| `/vibe abort` | Abort workflow |

### Shortcuts

| Command | Action |
|---------|--------|
| `/fix <desc>` | Quick fix (MINIMAL/LIGHT) |
| `/status` | Workflow status |
| `/getting-started` | Interactive onboarding |
| `/worktree start <name>` | Parallel feature |

---

## Development Phases

### Phase 1: Specification & Design

**Persona:** Tech Lead (Alex Chen)

**Objective:** Create a detailed, unambiguous specification before any code is written.

**Steps:**
1. Understand the user's request fully
2. Ask clarifying questions if needed
3. Create specification file: `docs/specs/[feature-name].md`
4. Use the [SPEC_TEMPLATE.md](./SPEC_TEMPLATE.md)
5. Write ALL acceptance criteria in Given/When/Then format
6. Include empty traceability matrix
7. Present spec to user

**Output:** Specification document

**Gate:** User must explicitly approve spec before proceeding

```
User says: "Spec approved" / "Looks good" / "Proceed"
     ↓
Move to Phase 2
```

---

### Phase 2: Test Planning

**Persona:** Quality Lead (Dr. Priya Patel)

**Objective:** Plan test strategy based on approved specification.

**Steps:**
1. Review approved specification
2. Identify test types needed (unit, integration, e2e)
3. Plan tests for each acceptance criterion
4. Identify edge cases and error scenarios
5. Note any test data requirements

**Output:** Test plan (can be part of spec or separate)

---

### Phase 3: Implementation

**Persona:** Tech Lead (Alex Chen)

**Objective:** Implement the feature using TDD (Test-Driven Development).

**TDD Cycle:**
```
For each acceptance criterion:

1. RED   → Write failing test
           - Test must fail (proves test is valid)
           - Test name matches criterion

2. GREEN → Write minimum code to pass
           - No over-engineering
           - Just enough to make test pass

3. BLUE  → Refactor
           - Improve code quality
           - Keep tests passing
           - Update traceability matrix
```

**Steps:**
1. Start with AC-001
2. Write failing test for AC-001
3. Implement to make test pass
4. Refactor if needed
5. Update traceability matrix with test location
6. Repeat for AC-002, AC-003, etc.

**Output:** Working implementation with tests

---

### Phase 4: Team Review

**Persona:** Quality Lead (Dr. Priya Patel)

**Objective:** Verify all quality gates pass before user testing.

**Steps:**
1. Run all quality gate checks
2. Create review document: `docs/reviews/[feature-name].md`
3. Document status of each gate
4. Fix any failing gates
5. All gates must be GREEN

**Output:** Review document with all gates passing

---

### Phase 5: User Testing

**Persona:** Quality Lead (Dr. Priya Patel)

**Objective:** Present completed feature to user for approval.

**Steps:**
1. Present feature using standard delivery format (see below)
2. **STOP and WAIT** for explicit user approval
3. If user requests changes: iterate from relevant phase
4. If user approves: generate documentation

**Approval Triggers:**
- "Approved"
- "Green light"
- "Looks good"
- "Ship it"

**On Approval:**
1. Generate feature documentation in `docs/features/[feature-name].md`
2. Mark feature as COMPLETE
3. Await user instruction for commit

---

## Acceptance Criteria Format

### Required Format: Given/When/Then

Every acceptance criterion MUST use this format:

```gherkin
### AC-[NUMBER]: [Brief Description]

GIVEN [precondition or context]
  AND [additional precondition if needed]
WHEN [action or event occurs]
  AND [additional action if needed]
THEN [expected outcome]
  AND [additional outcome if needed]
```

### Examples

**Good Example:**
```gherkin
### AC-001: Successful login with valid credentials

GIVEN a registered user with email "test@example.com"
  AND the user is on the login page
WHEN they enter email "test@example.com"
  AND they enter the correct password
  AND they click the "Sign In" button
THEN they are redirected to the dashboard
  AND they see a welcome message "Welcome back, [Name]"
  AND their session is created with 24-hour expiry
```

**Bad Example:**
```
User should be able to log in successfully.
```
(Too vague - what does "successfully" mean? What are the exact steps?)

### Edge Cases

Always include acceptance criteria for:
- Error states
- Empty states
- Boundary conditions
- Invalid inputs
- Permission denied scenarios

---

## Traceability Matrix

### Format

Every spec must include a traceability matrix:

```markdown
## Traceability Matrix

| Criterion | Test File | Test Name | Status |
|-----------|-----------|-----------|--------|
| AC-001 | `src/__tests__/login.test.ts` | `should redirect to dashboard on valid login` | ⏳ |
| AC-002 | `src/__tests__/login.test.ts` | `should show error on invalid password` | ⏳ |
| AC-003 | `src/__tests__/login.test.ts` | `should lock account after 3 failed attempts` | ⏳ |
```

### Status Icons

- ⏳ Pending - Test not yet written
- ✅ Passed - Test written and passing
- ❌ Failed - Test written but failing

### Rules

1. Every criterion MUST have a test
2. Every test MUST reference a criterion
3. Feature not complete until all ✅
4. Matrix updated during implementation

---

## Quality Gates

> **The authoritative definition lives in `.claude/skills/review/SKILL.md`.**
> This section expands each gate with a detailed checklist. If these ever
> diverge from the skill, the skill wins — it is what Claude executes.

### Prototype Mode (5 essential)

### Gate 1: Tests pass
- [ ] `npm run test` exits 0
- [ ] 0 failing tests
- [ ] Coverage meets project threshold (if configured)

### Gate 2: Lint clean
- [ ] `npm run lint` exits 0
- [ ] 0 warnings
- [ ] TypeScript strict mode (no `any`)
- [ ] No `console.log` in production code paths
- [ ] No commented-out code

### Gate 3: All ACs met
- [ ] Every AC in the spec maps to a passing test
- [ ] Traceability matrix complete
- [ ] No AC marked ⏳ or ❌
- [ ] Happy path and edge cases both covered

### Gate 4: Responsive
*(Skip for CLI/backend projects)*
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone standard)
- [ ] 768px (Tablet)
- [ ] 1024px (Desktop)
- [ ] 1440px (Large desktop)
- [ ] Touch targets ≥ 44x44px
- [ ] Body text ≥ 16px on mobile

### Gate 5: Code review
- [ ] No dead code or unreachable branches
- [ ] No hardcoded values that should be config
- [ ] Error handling at system boundaries only
- [ ] No off-by-one or boundary errors
- [ ] Naming is clear; no abbreviations
- [ ] Matches design system / consistent spacing (if UI)
- [ ] Complex code has a one-line comment explaining *why*

### Production Mode (adds 5)

### Gate 6: Performance
- [ ] Lighthouse > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No Cumulative Layout Shift
- [ ] Images optimized

### Gate 7: Accessibility
*(Skip for CLI/backend projects)*
- [ ] WCAG 2.1 AA (axe-core or Lighthouse a11y)
- [ ] Keyboard navigation works end-to-end
- [ ] Screen reader labels present
- [ ] Color contrast passes
- [ ] Alt text for images
- [ ] Semantic HTML

### Gate 8: Cross-browser
*(Skip for non-web projects)*
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Chrome Mobile
- [ ] Safari Mobile

### Gate 9: Build succeeds
- [ ] `npm run build` exits 0
- [ ] No type errors
- [ ] No broken imports
- [ ] API calls wired to real endpoints (not mocks)
- [ ] Loading and error states display correctly

### Gate 10: Security scan
- [ ] No XSS vectors (`dangerouslySetInnerHTML` reviewed)
- [ ] No SQL/command injection points
- [ ] Secrets only in environment variables
- [ ] Input sanitization at boundaries
- [ ] Auth checks on protected routes

---

## Feature Delivery Format

When presenting completed feature to user:

```markdown
## FEATURE COMPLETE: [Feature Name]

### What Was Built
[Clear, concise description of the feature]

### Acceptance Criteria Status
| Criterion | Description | Status |
|-----------|-------------|--------|
| AC-001 | [Brief description] | PASSED |
| AC-002 | [Brief description] | PASSED |
| AC-003 | [Brief description] | PASSED |

### Quality Gates
| Gate | Status |
|------|--------|
| Tests pass | PASSED |
| Lint clean | PASSED |
| All ACs met | PASSED |
| Responsive | PASSED |
| Code review | PASSED |
| Performance | PASSED |
| Accessibility | PASSED |
| Cross-browser | PASSED |
| Build succeeds | PASSED |
| Security scan | PASSED |

### How to Test
1. [Step-by-step testing instructions]
2. [Include specific URLs/paths]
3. [Note any test credentials needed]

### Traceability
[Include completed traceability matrix]

### Known Limitations
[List any known limitations or future improvements]

---

**AWAITING YOUR APPROVAL**
```

---

## Bug Handling Workflow

### When a Bug is Found

```
1. STOP      → Do not fix immediately
2. ANALYZE   → Root cause analysis (5 Whys)
3. DOCUMENT  → Create post-mortem
4. TEST      → Write failing regression test
5. FIX       → Implement minimal fix
6. VERIFY    → Run all tests
7. REVIEW    → Quality Lead reviews
8. CLOSE     → Update post-mortem
```

### 5 Whys Analysis

Example:
```
Bug: User session expires immediately after login

1. Why? → Session token was not being stored
2. Why? → localStorage call was failing silently
3. Why? → localStorage was undefined in SSR context
4. Why? → Component was being rendered server-side
5. Why? → Missing "use client" directive

Root Cause: Component needs "use client" directive
```

### Severity Levels

| Severity | Definition | Response |
|----------|------------|----------|
| Critical | Data loss, security breach, complete failure | Immediate |
| High | Major feature broken, no workaround | Same day |
| Medium | Feature degraded, workaround exists | Next sprint |
| Low | Minor issue, cosmetic | Backlog |

---

## Git Workflow

### Core Rules

1. **NEVER** auto-commit
2. **NEVER** auto-push
3. AI proposes commits, user approves

### Commit Format: Conventional Commits

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Use For |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `spec` | Specification |
| `test` | Tests |
| `refactor` | Code refactoring |
| `chore` | Maintenance |

### Examples

```bash
feat(auth): add user login with email/password
fix(auth): prevent session expiry on page refresh
spec(auth): add login feature specification
test(auth): add login acceptance criteria tests
docs(auth): add login feature documentation
refactor(auth): extract session logic to hook
chore(deps): update dependencies
```

### Recommended Commit Points

1. After spec approved → `spec(feature): add [feature] specification`
2. After tests written → `test(feature): add acceptance tests`
3. After implementation → `feat(feature): implement [feature]`
4. After bug fix → `fix(feature): [description]`
5. After docs generated → `docs(feature): add documentation`

---

## Documentation Workflow

### Three Documentation Outputs

```
docs/specs/[feature].md      → INPUT (before coding)
docs/reviews/[feature].md    → QA (after coding)
docs/features/[feature].md   → OUTPUT (after approval)
```

### Auto-Generation Trigger

When user says "approved", "green light", or "looks good":

1. Generate `docs/features/[feature-name].md`
2. Include technical documentation
3. Include user-facing documentation
4. Mark feature as COMPLETE

### Feature Documentation Contents

**Technical:**
- Component/function API reference
- Props/parameters documentation
- Data flows and state management
- Code usage examples
- Integration points

**User-Facing:**
- Feature description
- How to use (step-by-step)
- Screenshots/examples
- Known limitations

---

## Team Personas

### Tech Lead (Alex Chen)

**Active in:** Phase 1 (Spec), Phase 3 (Implementation)

**Responsibilities:**
- Write technical specifications
- Design system architecture
- Implement features with TDD
- Optimize performance
- Handle security considerations

**Communication Style:**
- Technical but clear
- Comprehensive detail
- Focuses on correctness and maintainability

### Quality Lead (Dr. Priya Patel)

**Active in:** Phase 2 (Test Plan), Phase 4 (Review), Phase 5 (User Test)

**Responsibilities:**
- Plan test strategy
- Review quality gates
- Validate UX and accessibility
- Analyze bugs (root cause)
- Create review documents

**Communication Style:**
- Thorough and precise
- Detailed checklists
- Focuses on user experience and consistency

---

## Error Handling & Recovery

Every skill has structured error recovery built in. When something fails, Claude follows a defined path instead of improvising.

### General Recovery Principles

1. **After ANY fix, re-run ALL checks** — not just the one that failed
2. **Report honestly** — if stuck, say so. Don't fabricate solutions
3. **Escalate to user** — when blocked after reasonable effort, ask for guidance
4. **Never guess** — if a type is unclear, a requirement is ambiguous, or a root cause is uncertain, flag it

### Skill-Specific Recovery

| Skill | Common Failures | Recovery Path |
|-------|----------------|---------------|
| `/spec` | User rejects spec; spec too long; ambiguous ACs | Revise specific sections; split feature; ask clarifying questions |
| `/test-plan` | Spec has no ACs; AC is untestable; no test framework | STOP and report; propose rewrite; report missing setup |
| `/implement` | context7 down; RED test passes; GREEN breaks others | Fall back to WebSearch; delete wrong test; REVERT and fix design |
| `/review` | Tests fail; lint fails; build fails; gate impossible | Fix and re-run ALL gates; auto-fix lint; mark impossible as SKIPPED |
| `/ship` | Pre-commit hook fails; push rejected; PR creation fails | Fix and NEW commit (never amend); report conflict; check `gh auth` |
| `/bug` | Can't reproduce; Five Whys stalls; fix breaks tests | Document attempts and ask user; report where analysis stopped; REVERT |
| `/mock-data-doc` | No mocks found; ambiguous shapes; doc already exists | Report search locations; mark as "type unclear"; ask overwrite/append |

### Key Rule

If a "quick fix" (`/fix`) turns out to be complex (3+ files, unclear root cause), STOP and recommend upgrading to STANDARD tier with `/vibe feature`.

Full error recovery details are in each skill file: `.claude/skills/[name]/SKILL.md`.

---

## Visual Verification

For UI changes, the review skill captures screenshots at key breakpoints using Playwright MCP:

| Breakpoint | Device |
|-----------|--------|
| 375px | Mobile (iPhone) |
| 768px | Tablet |
| 1440px | Desktop |

**Process:**
1. Playwright navigates to the feature's page at each breakpoint
2. Screenshots are presented to the user with descriptions of what changed
3. User confirms visual correctness

**When unavailable:** If Playwright MCP is not configured, visual verification is marked as SKIPPED. The user is asked to manually verify.

**By tier:**
- MINIMAL: No visual verification
- LIGHT: Optional (if UI change)
- STANDARD: Optional (recommended for UI)
- FULL: Required

---

## CI/CD Integration

Quality gates 1, 2, and 9 (lint, tests, build) run automatically via GitHub Actions on every push to `main`/`develop` and every PR.

**Pipeline file:** `.github/workflows/quality-gates.yml`

**What runs automatically:**
| Gate | CI Step | Notes |
|------|---------|-------|
| Lint | `npm run lint` | Gate 1 |
| Type check | `npm run typecheck` | Part of Gate 2 |
| Tests | `npm run test` | Gate 2 |
| Build | `npm run build` | Gate 9 |

**What runs manually (during `/review`):**
- Responsive check (Gate 4) — requires browser
- Visual verification (Gate 4b) — requires Playwright
- Code review (Gate 5) — requires reading the diff
- Performance (Gate 6) — requires Lighthouse
- Accessibility (Gate 7) — requires axe-core
- Cross-browser (Gate 8) — requires multiple browsers
- Security (Gate 10) — requires code analysis

The CI pipeline detects which npm scripts exist in `package.json` before running each step. If a script is missing, that step is **skipped** (not silently passed). This means a fresh project with no scripts configured will skip all gates rather than falsely reporting green. Once your project has the scripts, the detection is a no-op and every step runs normally.

---

## Workflow State

State is tracked in `.vibe/state.json` (gitignored). Every skill reads and updates it.

- **On start:** Create state entry with feature name, tier, phase
- **On phase completion:** Update phase, AC status, gate results
- **On pause:** Save current position and notes
- **On resume:** Read state, report where we left off, continue
- **On completion:** Move to history, clear active workflow

Use `/status` to see current state at any time.

### `.vibe/state.json` Schema

```json
{
  "version": "2.0",
  "active": {
    "feature": "user-authentication",
    "tier": "STANDARD",
    "phase": "implement",
    "startedAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T14:22:00Z",
    "spec": "docs/specs/user-authentication.md",
    "acceptanceCriteria": {
      "AC-001": { "status": "passed", "testFile": "src/__tests__/login.test.ts" },
      "AC-002": { "status": "in-progress", "testFile": null },
      "AC-003": { "status": "pending", "testFile": null }
    },
    "gates": {
      "lint": "passed",
      "tests": "passed",
      "acs_met": "pending",
      "responsive": "pending",
      "code_review": "pending",
      "performance": "skipped",
      "accessibility": "skipped",
      "cross_browser": "skipped",
      "build": "skipped",
      "security": "skipped",
      "visual": "skipped"
    },
    "notes": "Working on AC-002, login error handling"
  },
  "history": [
    {
      "feature": "landing-page",
      "tier": "LIGHT",
      "result": "completed",
      "startedAt": "2025-01-14T09:00:00Z",
      "completedAt": "2025-01-14T11:30:00Z",
      "gates": { "lint": "passed", "tests": "passed" }
    }
  ]
}
```

### Field Reference

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `version` | string | `"2.0"` | Schema version |
| `active` | object \| null | — | Current workflow (null if idle) |
| `active.feature` | string | — | Feature name (matches spec filename) |
| `active.tier` | string | `MINIMAL` \| `LIGHT` \| `STANDARD` \| `FULL` \| `EMERGENCY` | Active tier |
| `active.phase` | string | `spec` \| `test-plan` \| `implement` \| `review` \| `present` \| `done` | Current phase |
| `active.startedAt` | string | ISO 8601 | When workflow began |
| `active.updatedAt` | string | ISO 8601 | Last state change |
| `active.spec` | string \| null | — | Path to spec file (STANDARD+ only) |
| `active.acceptanceCriteria` | object | — | Map of AC ID → status object |
| `active.acceptanceCriteria[id].status` | string | `pending` \| `in-progress` \| `passed` \| `failed` | AC status |
| `active.acceptanceCriteria[id].testFile` | string \| null | — | Path to test file (null until written) |
| `active.gates` | object | — | Map of gate name → result |
| `active.gates[name]` | string | `pending` \| `passed` \| `failed` \| `skipped` | Gate result |
| `active.notes` | string | — | Free-text progress notes |
| `history` | array | — | Completed workflows (most recent first) |
| `history[].result` | string | `completed` \| `aborted` | How the workflow ended |

### Rules

- Create `.vibe/` directory and `state.json` on first workflow if they don't exist
- MINIMAL tier: set `active` with feature/tier/phase only (no ACs or gates beyond lint)
- LIGHT tier: track feature/tier/phase + lint and test gates
- STANDARD/FULL: track all fields
- On completion: move `active` to front of `history`, set `active` to `null`
- On abort: move to history with `"result": "aborted"`
- Keep history capped at 20 entries (drop oldest)

---

## Memory Integration

The memory MCP server enables learning across sessions.

**Saved after workflows:**
- Feature name, tier used, gates passed/failed, issues encountered
- User's tier override patterns

**Saved after bug fixes:**
- Bug category, root cause pattern, prevention measure

**Recalled before new work:**
- Similar past features and their tiers
- Lessons learned that apply
- User preferences

---

## Parallel Workflows

Use `/worktree` to manage parallel feature development via git worktrees.

| Command | Action |
|---------|--------|
| `/worktree start <name>` | Create branch + worktree |
| `/worktree list` | Show all parallel workflows |
| `/worktree switch <name>` | Switch context |
| `/worktree merge <name>` | Merge back (after gates pass) |
| `/worktree clean` | Remove completed worktrees |

Rules:
- Each worktree gets its own branch
- Never merge without user approval
- Run gates before merge
- Maximum 3 recommended

---

## Critical Rules

### NEVER

1. Apply FULL ceremony to a typo fix (use MINIMAL)
2. Apply MINIMAL ceremony to a new feature (use STANDARD+)
3. Skip Given/When/Then format for acceptance criteria (STANDARD+ tiers)
4. Proceed without explicit user approval at phase gates
5. Commit or push without user instruction
6. Skip quality gates for the active tier
7. Fix bugs without root cause analysis (use `/bug`)
8. Force push, reset --hard, or clean -f

### ALWAYS

1. Match ceremony to complexity — use the right tier
2. Write failing tests before implementation (LIGHT+ tiers)
3. Update traceability matrix (STANDARD+ tiers)
4. Stop and wait for user approval at phase gates
5. Generate documentation on feature approval (STANDARD+ tiers)
6. Update `.vibe/state.json` during workflows
7. Save lessons to memory after completing workflows
8. Use `use context7` with framework/library APIs
9. Create post-mortems for bugs

---

## Tooling Reference

### Skills

Skills are slash commands that encode each workflow phase. Invoke them in Claude Code:

| Skill | Command | Activates When |
|-------|---------|----------------|
| **Vibe** | `/vibe` | **Primary entry point — auto-detects tier and routes** |
| **Fix** | `/fix` | Quick fix — MINIMAL or LIGHT tier |
| **Status** | `/status` | Show current workflow state |
| **Getting Started** | `/getting-started` | Interactive onboarding for new users |
| **Worktree** | `/worktree` | Parallel feature development |
| Spec | `/spec` | Create specification (STANDARD+ tier) |
| Test Plan | `/test-plan` | Plan tests (STANDARD+ tier) |
| Implement | `/implement` | TDD implementation (STANDARD+ tier) |
| Review | `/review` | Run quality gates (STANDARD+ tier) |
| Ship | `/ship` | Commit + PR (any tier) |
| Bug | `/bug` | Bug analysis with 5 Whys |
| Mock Data Doc | `/mock-data-doc` | Prototype handoff doc |

Skills live in `.claude/skills/[name]/SKILL.md`. Each file is the complete, self-contained instruction set for that phase. The **review skill is the authoritative definition of quality gates** — CLAUDE.md and docs reference its gate names.

### Hooks

Hooks run automatically, defined in `.claude/settings.json`:

**PostToolUse — Auto-lint on write**
- Fires after every `Write` or `Edit` on `.js/.ts/.tsx/.vue/.svelte` files
- Runs: `npx eslint --fix <file>`
- Effect: Files are always lint-clean immediately after being written

**PreCommit — Gate before every commit**
- Fires before every `git commit`
- Runs: `npm run lint && npm run test`
- Effect: A commit cannot land with failing lint or tests

### MCP Servers

MCP servers extend Claude's capabilities. Configured in `.mcp.json`.

**context7** — Real-time documentation
- Purpose: Fetches current docs for any framework or library
- Usage: Add `use context7` to any prompt involving a framework API
- No setup required

**playwright** — Browser automation
- Purpose: Responsive testing, visual verification, E2E checks
- Used by the `/review` skill for the Responsive gate
- No setup required

**github** — GitHub integration
- Purpose: Read/write issues, PRs, code search, Actions
- Requires: `export GITHUB_TOKEN=ghp_your_personal_access_token`
- Add to your shell profile (`~/.zshrc` or `~/.bashrc`) for persistence

**sequential-thinking** — Structured reasoning
- Purpose: Architecture decisions, complex debugging chains
- No setup required

**memory** — Cross-session knowledge
- Purpose: Persists a knowledge graph across Claude Code sessions
- Stored at: `.claude/memory.json`
- No setup required

### context7 Usage Pattern

Add `use context7` whenever you are working with a framework or library API:

```
"Build a login form with React Hook Form, use context7"
"Set up Drizzle ORM with Supabase, use context7"
"Add a Playwright test for the auth flow, use context7"
```

### Frontend Foundation (Next.js)

New Next.js projects scaffold from the MOP foundation at
`github.com/ministryofprogramming/mop-foundation-nextjs`. The foundation is
pulled fresh via `degit` — not vendored — so every project gets the latest
version.

```bash
./scripts/add-mop-foundation.sh         # pull latest main
./scripts/add-mop-foundation.sh v1.2.0  # pin to tag/branch/commit
```

The script overlays foundation files onto the project and preserves all
workflow files: `CLAUDE.md`, `CLAUDE.local.md*`, `.claude/`, `.mcp.json`,
`config/`, `docs/`, `scripts/`, and `.gitignore` (merged, not replaced).

Re-run any time to pull foundation updates. Safe to re-run — existing
foundation files are overwritten; workflow files are untouched.

### Prototype → Backend Handoff

When a prototype is approved and real backend work begins, run
`/mock-data-doc`. The skill scans all mock data in the codebase (mocks/,
fixtures/, MSW handlers, hardcoded arrays, localStorage writes) and writes
`docs/MOCKED_DATA_STRUCTURE.md` — a complete handoff artifact for the backend
team covering:

- Every mocked entity with TypeScript shape and example values
- All simulated operations (list, get, create, update, delete) with suggested
  real endpoints
- Relationships and implied constraints (uniqueness, enums, ranges)
- Prototype-only assumptions the backend must NOT carry forward (no auth,
  hardcoded admins, in-memory persistence)
- Handoff checklist for the backend team

### Configuration Files

| File | What it controls |
|------|-----------------|
| `CLAUDE.md` | Mode, quality gates, workflow instructions (Claude reads this) |
| `.claude/settings.json` | Hooks and permissions (Claude Code reads this) |
| `.claude/skills/` | Per-phase execution logic (loaded on-demand) |
| `.mcp.json` | MCP server definitions (Claude Code reads this) |
| `config/workflow.config.yaml` | **Documentation only** — Claude does NOT read YAML |

### Personal Preferences File

`CLAUDE.local.md` is a gitignored file for personal workflow customization:

```bash
cp CLAUDE.local.md.example CLAUDE.local.md
# Edit with your preferences — never committed to git
```
