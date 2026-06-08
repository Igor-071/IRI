# CLAUDE.md - Vibecoding Workflow v2.0

This file is the **single source of truth** for how Claude Code works on this project.

## Project Overview

**Project:** [PROJECT_NAME]
**Approach:** [APPROACH]  <!-- prototype | production -->
**Type:** [web | mobile | backend | fullstack | cli]
**Stack:** [TECH_STACK]

### If PROTOTYPE mode:
- Frontend-only, fast iteration, mock data, 5 quality gates
- Goal: Validate ideas, get visual feedback quickly

### If PRODUCTION mode:
- Full-stack, real database/APIs/auth, all 10 quality gates
- Goal: Ship reliable, production-ready software

---

## Adaptive Tier System

Not every change deserves a spec. But every feature does. The workflow adapts ceremony to complexity.

### How It Works

1. **Detect** — Analyze the request (keywords, scope, file count)
2. **Propose** — Suggest a tier with reasoning
3. **Confirm** — User accepts or overrides
4. **Execute** — Run that tier's phases
5. **Track** — Save state to `.vibe/state.json`

### Tier Definitions

| Tier | When | Phases | Gates |
|------|------|--------|-------|
| **MINIMAL** | Typos, copy, styling, config | Change → Lint | Lint only |
| **LIGHT** | Bug fixes, small additions, refactoring | Understand → Test → Fix → Verify | Lint + Tests |
| **STANDARD** | New features, significant changes | Spec → Test Plan → Implement(TDD) → Review → Present | 5 gates (prototype) or 10 (production) |
| **FULL** | Epics, architecture, security, migrations | Spec → Test Plan → Implement(TDD) → Review → Document → Present | All 10 gates + architecture review |
| **EMERGENCY** | Production down, critical security | Reproduce → Fix → Critical Test → Deploy | Critical tests only, postmortem within 24h |

### MINIMAL Tier
1. Read the file
2. Make the change
3. Run lint (`npm run lint`)
4. Report: done, lint clean

### LIGHT Tier
1. Understand the issue (read relevant code)
2. Write a failing test (if testable — skip for pure styling)
3. Make the fix (minimum change)
4. Run tests + lint
5. Report results
6. **STOP** — Wait for user approval

### STANDARD Tier
1. **Spec** — Create `docs/specs/[feature].md` with Given/When/Then ACs → **STOP & WAIT**
2. **Test Plan** — Plan test matrix, append to spec → **STOP & WAIT**
3. **Implement** — TDD cycle: RED → GREEN → BLUE for each AC
4. **Review** — Run quality gates (5 prototype / 10 production)
5. **Present** — Show results → **STOP & WAIT** for approval
6. On approval: generate feature docs

### FULL Tier
Same as STANDARD, plus:
- Spec includes technical design, security, performance sections
- Architecture review gate
- Security review gate (if auth/data changes)
- Generate comprehensive documentation
- Quality Lead persona active throughout

### EMERGENCY Tier
1. Reproduce the issue
2. Write regression test
3. Fix (minimal, targeted)
4. Run critical tests only
5. Ship immediately with user approval
6. Schedule postmortem within 24 hours
7. Create `docs/bugs/BUG-[number]-[name].md` after the fix

### Auto-Detection Algorithm

When a request comes in, classify it:

**MINIMAL signals:** typo, spelling, grammar, copy, wording, rename, color, padding, margin, config change, env variable, single-line change, "change X to Y"

**LIGHT signals:** fix, bug, broken, crash, error, wrong, add a button, small component, refactor, extract, move, 1-3 files affected, 10-100 lines estimated

**STANDARD signals:** feature, implement, build, create, add (new functionality), form, page, API endpoint, database, 3-10 files, 100-500 lines

**FULL signals:** epic, major, architecture, redesign, migration, security overhaul, system, platform, 10+ files, 500+ lines

**EMERGENCY signals:** urgent, critical, production down, security vulnerability, data breach, users affected, hotfix

**Rules:**
- If explicit tier flag (`--minimal`, `--light`, `--standard`, `--full`) → use that tier
- If explicit command type → use its default tier (see Commands below)
- Emergency keywords always override to EMERGENCY
- When ambiguous → ask the user
- User can always override: "Actually, make this STANDARD"

---

## Commands

### Primary: `/vibe` (alias: `/v`)

```
/vibe fix <description>        → LIGHT (default)
/vibe tweak <description>      → MINIMAL (default)
/vibe update <description>     → LIGHT (default)
/vibe add <description>        → STANDARD (default)
/vibe refactor <description>   → LIGHT (default)
/vibe feature <description>    → STANDARD (default)
/vibe epic <description>       → FULL (default)
/vibe hotfix <description>     → EMERGENCY
```

### Tier Overrides

Append to any command:
```
--minimal    Force MINIMAL tier
--light      Force LIGHT tier
--standard   Force STANDARD tier
--full       Force FULL tier
--skip-test  Skip tests (MINIMAL only)
--with-spec  Add spec phase to LIGHT
--with-review Add review phase to LIGHT
```

### Workflow Control
```
/vibe status     Show current workflow state
/vibe pause      Save state and pause
/vibe resume     Resume from saved state
/vibe approve    Approve current phase
/vibe abort      Abort current workflow
```

### Legacy Skills (still work)
```
/spec            Create specification (STANDARD+ tier)
/test-plan       Plan tests (STANDARD+ tier)
/implement       TDD implementation (STANDARD+ tier)
/review          Run quality gates (STANDARD+ tier)
/ship            Commit + PR (any tier)
/bug             Bug analysis (any tier)
/mock-data-doc   Backend handoff doc
/fix             Quick fix (MINIMAL/LIGHT)
/status          Workflow status
/getting-started Interactive onboarding
/worktree        Parallel workflow management
```

### Natural Language Triggers

**Approval:** "approved", "looks good", "green light", "ship it", "lgtm"
→ Approve current phase and proceed

**Rejection:** "change this", "not quite", "redo", "wrong"
→ Ask what needs to change, revise

**Tier override:** "this needs more ceremony", "make it thorough"
→ Upgrade tier. "keep it simple", "just do it" → downgrade tier.

---

## Team Personas

### Tech Lead (Alex Chen)
- **Active in:** STANDARD/FULL tiers — Spec, Implementation
- **Focus:** Architecture, clean code, TDD, performance, security
- **Style:** Technical but clear

### Quality Lead (Dr. Priya Patel)
- **Active in:** FULL tier — Test Planning, Review, User Testing
- **Focus:** Quality gates, UX, accessibility, testing
- **Style:** Thorough, detailed checklists

**Switching:** Tech Lead for specs/architecture/implementation. Quality Lead for testing/reviews/gates. Both for FULL tier spec reviews and feature completion.

**MINIMAL/LIGHT tiers:** No persona switching needed. Just do the work directly.

---

## Quality Gates

### Prototype Mode (5 gates — STANDARD tier)

- [ ] **Tests pass** — `npm run test` — 0 failures
- [ ] **Lint clean** — `npm run lint` — 0 errors, 0 warnings
- [ ] **All ACs met** — Every AC has a passing test
- [ ] **Responsive** — Works at 320px, 375px, 768px, 1024px, 1440px
- [ ] **Code review** — No dead code, hardcoded values, or boundary errors

### Production Mode (10 gates — STANDARD/FULL tiers)

All prototype gates PLUS:
- [ ] **Performance** — Lighthouse > 90, FCP < 1.5s
- [ ] **Accessibility** — WCAG 2.1 AA, axe-core clean, keyboard navigation works
- [ ] **Cross-browser** — Chrome, Safari, Firefox
- [ ] **Build succeeds** — `npm run build` — 0 errors
- [ ] **Security scan** — No XSS, no injection, secrets in env vars

### Visual Verification (UI changes, any tier with UI)

Capture Playwright screenshots at 375px, 768px, 1440px. Present to user for visual confirmation. If Playwright unavailable, ask user to manually verify.

### Gates by Tier

| Gate | MINIMAL | LIGHT | STANDARD | FULL |
|------|---------|-------|----------|------|
| Lint | Required | Required | Required | Required |
| Tests | Skip | Required | Required | Required |
| ACs met | Skip | Skip | Required | Required |
| Responsive | Skip | Optional | Required | Required |
| Code review | Skip | Skip | Required | Required |
| Performance | Skip | Skip | Prod only | Required |
| Accessibility | Skip | Skip | Prod only | Required |
| Cross-browser | Skip | Skip | Prod only | Required |
| Build | Skip | Skip | Prod only | Required |
| Security | Skip | Skip | Prod only | Required |
| Visual | Skip | Optional | Optional | Required |

---

## Workflow State Tracking

State is saved to `.vibe/state.json` (gitignored). Every skill reads and updates it.

**On workflow start:** Create state entry with feature name, tier, phase
**On phase completion:** Update phase, AC status, gate results
**On pause:** Save current position and notes
**On resume:** Read state, report where we left off, continue
**On completion:** Move to history, clear active workflow

**Schema:** The formal `.vibe/state.json` schema (field types, allowed values, examples) is defined in [WORKFLOW_RULES.md § Workflow State](docs/WORKFLOW_RULES.md#workflow-state). Key rules:
- Create `.vibe/` and `state.json` on first workflow if they don't exist
- MINIMAL/LIGHT: track feature, tier, phase, and relevant gates only
- STANDARD/FULL: track all fields including ACs, all gates, spec path
- On completion: move `active` to `history`, set `active` to `null`
- Cap history at 20 entries

See `/status` skill for display format.

---

## Error Recovery

Every skill has structured error recovery. Key principles:

- **After any fix, re-run ALL checks** — not just the one that failed
- **Report honestly** — if stuck after reasonable effort, say so and ask for guidance
- **Never guess** — if types are unclear, requirements ambiguous, or root cause uncertain, flag it
- **Escalate scope** — if a `/fix` turns complex (3+ files, unclear root cause), recommend upgrading to STANDARD with `/vibe feature`
- **REVERT on regression** — if a fix breaks other tests, revert immediately and fix the design

Full error recovery details are in each skill file: `.claude/skills/[name]/SKILL.md`.

---

## Memory Integration

Use the memory MCP server to learn from past sessions.

**Save after completing any workflow:**
- Feature name, tier used, gates passed/failed, issues encountered
- User's tier override patterns (if they frequently upgrade/downgrade)

**Save after bug fixes:**
- Bug category, root cause pattern, prevention measure

**Recall before starting any workflow:**
- Has a similar feature been built? What tier was used?
- Any lessons learned that apply?
- User preferences for similar change types

---

## Acceptance Criteria Format

All acceptance criteria MUST use Given/When/Then:

```gherkin
### AC-001: [Brief description]
GIVEN [precondition/context]
WHEN [action taken]
AND [additional action if needed]
THEN [expected result]
AND [additional expectation if needed]
```

## Feature Delivery Format

```
FEATURE COMPLETE: [Feature Name]
TIER: [MINIMAL | LIGHT | STANDARD | FULL]

WHAT WAS BUILT:
[Clear description]

ACCEPTANCE CRITERIA STATUS:
- AC-001: [description] — PASSED
- AC-002: [description] — PASSED

QUALITY GATES:
[List each gate run with status]

HOW TO TEST:
1. [Step-by-step instructions]

TRACEABILITY:
| Criterion | Test File | Test Name | Status |
|-----------|-----------|-----------|--------|
| AC-001    | ...       | ...       | PASSED |

AWAITING YOUR APPROVAL
```

## Code Style

- Keep functions small. One purpose per function.
- Name things clearly. No abbreviations.
- Handle errors at system boundaries only. Trust internal code.
- Conventional commits: `feat|fix|docs|spec|test|refactor|chore(scope): description`
- Commit message = WHY, not WHAT. The diff shows what changed.

## Bug Handling

Use the `/bug` skill. Summary:

1. **STOP** — Don't fix immediately
2. **ANALYZE** — Root cause analysis (5 Whys)
3. **DOCUMENT** — Create post-mortem in `docs/bugs/`
4. **TEST** — Write failing regression test FIRST
5. **FIX** — Implement minimal fix
6. **VERIFY** — Run all tests
7. **REVIEW** — Quality Lead reviews
8. **CLOSE** — Update post-mortem, save to memory

## Git Workflow

**NEVER commit or push without explicit user instruction.**

Conventional Commits: `<type>(<scope>): <description>`
Types: `feat`, `fix`, `docs`, `spec`, `test`, `refactor`, `chore`

## CI/CD

Quality gates 1, 2, and 9 (lint, tests, build) run automatically on every PR via GitHub Actions (`.github/workflows/quality-gates.yml`). The pipeline detects which npm scripts exist in `package.json` and only runs steps for configured scripts — missing scripts are skipped (not silently passed). Manual gates (responsive, performance, accessibility, visual) are verified during `/review`.

## Documentation Auto-Generation

When user says "approved", "green light", or "looks good":
1. Generate feature documentation in `docs/features/[feature-name].md`
2. Include both technical and user-facing documentation
3. Mark feature as COMPLETE
4. Save workflow metadata to memory

## When Stuck

- Check `.vibe/state.json` for current workflow state
- Check `docs/specs/` for the approved spec
- Recall from memory: similar past features
- Run tests to see what's failing
- Ask the user — don't guess at requirements

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.local.md.example` | Personal preferences template |
| `.mcp.json` | MCP servers (context7, github, playwright, memory, sequential-thinking) |
| `.claude/settings.json` | Hooks and permissions |
| `.claude/skills/` | All workflow skills |
| `.vibe/state.json` | Current workflow state (gitignored) |
| `scripts/add-mop-foundation.sh` | Pull latest MOP Next.js foundation |
| `scripts/add-mop-foundation-rn.sh` | Pull latest MOP React Native foundation |
| `scripts/upgrade-to-production.sh` | Prototype → Production upgrade |
| `config/` | Reference configs (YAML, not authoritative — CLAUDE.md is truth) |
| `docs/METHODOLOGY.md` | Core philosophy and principles |
| `docs/WORKFLOW_RULES.md` | Complete workflow reference |
| `docs/QUICK_REFERENCE.md` | Daily cheat sheet |
| `docs/SPEC_TEMPLATE.md` | Feature specification template |

## Frontend Foundation (Next.js)

Scaffold from `github.com/ministryofprogramming/mop-foundation-nextjs` via
`./scripts/add-mop-foundation.sh`. Workflow files are never overwritten.

## Frontend Foundation (React Native)

Scaffold from `github.com/ministryofprogramming/mop-foundation-react-native` via
`./scripts/add-mop-foundation-rn.sh`. Uses pnpm. Workflow files are never overwritten.

## Prototype → Backend Handoff

Run `/mock-data-doc` to generate `docs/MOCKED_DATA_STRUCTURE.md` — a handoff artifact describing every mocked entity, operation, and assumption.

## Parallel Workflows

For working on multiple features simultaneously, use `/worktree` skill to manage git worktrees with isolated branches.

## Commands

```bash
# Development
npm run dev              # Start dev server

# Testing
npm run test             # Run tests
npm run test:coverage    # Run with coverage

# Quality
npm run lint             # Run linter
npm run lint:fix         # Fix linting issues
npm run typecheck        # TypeScript check

# Build
npm run build            # Production build
```

### React Native (if using MOP React Native foundation)

```bash
pnpm start               # Start Expo dev server
pnpm ios                 # Run on iOS simulator
pnpm android             # Run on Android emulator
pnpm lint                # Run linter
pnpm type-check          # TypeScript check
```

## Critical Rules

### ALWAYS
1. **ALWAYS** match ceremony to complexity — use the right tier
2. **ALWAYS** use Given/When/Then for acceptance criteria (STANDARD+ tiers)
3. **ALWAYS** write failing tests before implementation (LIGHT+ tiers)
4. **ALWAYS** wait for explicit user approval at phase gates
5. **ALWAYS** update traceability matrix (STANDARD+ tiers)
6. **ALWAYS** generate documentation on feature approval (STANDARD+ tiers)
7. **ALWAYS** use `use context7` when working with any framework or library
8. **ALWAYS** update `.vibe/state.json` during workflows
9. **ALWAYS** save lessons to memory after completing workflows

### NEVER
1. **NEVER** commit or push without user instruction
2. **NEVER** skip quality gates for the active tier
3. **NEVER** proceed without approval at phase gates
4. **NEVER** apply FULL ceremony to a typo fix (use MINIMAL)
5. **NEVER** apply MINIMAL ceremony to a new feature (use STANDARD+)
6. **NEVER** guess at requirements — ask the user
7. **NEVER** force push, reset --hard, or clean -f
