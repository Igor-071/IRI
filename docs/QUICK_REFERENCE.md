# Quick Reference

Daily cheat sheet for the Vibecoding Workflow v2.0.

---

## Adaptive Tier System

| Tier | When | Phases | Gates |
|------|------|--------|-------|
| **MINIMAL** | Typos, copy, styling | Change → Lint | Lint only |
| **LIGHT** | Bug fixes, small additions | Understand → Test → Fix → Verify | Lint + Tests |
| **STANDARD** | New features | Spec → Test Plan → TDD → Review → Present | 5 or 10 gates |
| **FULL** | Epics, architecture | Spec → Test Plan → TDD → Review → Docs → Present | All gates |
| **EMERGENCY** | Production down | Reproduce → Fix → Critical Test → Deploy | Critical only |

---

## Commands

```
/vibe <description>          Auto-detect tier and begin
/vibe fix <description>      Bug fix (LIGHT)
/vibe tweak <description>    Small change (MINIMAL)
/vibe feature <description>  New feature (STANDARD)
/vibe epic <description>     Major feature (FULL)
/vibe hotfix <description>   Production fire (EMERGENCY)

/vibe status                 Show current workflow state
/vibe pause                  Save and pause
/vibe resume                 Resume from saved state

/fix <description>           Quick fix shortcut (MINIMAL/LIGHT)
/status                      Workflow status
/getting-started             Interactive onboarding
/worktree start <name>       Start parallel feature
```

### Tier Overrides

Append to any command: `--minimal`, `--light`, `--standard`, `--full`

---

## Legacy Skills (Still Work)

| Command | When to Use |
|---------|-------------|
| `/spec` | Create specification (STANDARD+ tier) |
| `/test-plan` | Plan test matrix (STANDARD+ tier) |
| `/implement` | TDD implementation (STANDARD+ tier) |
| `/review` | Run quality gates (STANDARD+ tier) |
| `/ship` | Commit + PR (any tier) |
| `/bug` | Bug analysis (any tier) |
| `/mock-data-doc` | Backend handoff doc |

---

## Given/When/Then Format

```gherkin
### AC-001: [Brief description]

GIVEN [precondition]
  AND [additional precondition]
WHEN [action]
  AND [additional action]
THEN [expected result]
  AND [additional result]
```

---

## TDD Cycle

```
RED   → Write failing test (test must fail)
GREEN → Write minimum code to pass
BLUE  → Refactor, keep tests passing
```

---

## Quality Gates by Tier

| Gate | MINIMAL | LIGHT | STANDARD | FULL |
|------|---------|-------|----------|------|
| Lint | Yes | Yes | Yes | Yes |
| Tests | - | Yes | Yes | Yes |
| ACs met | - | - | Yes | Yes |
| Responsive | - | Optional | Yes | Yes |
| Code review | - | - | Yes | Yes |
| Performance | - | - | Prod only | Yes |
| Accessibility | - | - | Prod only | Yes |
| Cross-browser | - | - | Prod only | Yes |
| Build | - | - | Prod only | Yes |
| Security | - | - | Prod only | Yes |
| Visual | - | Optional | Optional | Yes |

### Visual Verification (UI changes)

Playwright screenshots at 375px / 768px / 1440px. Presented to user for confirmation.
If Playwright unavailable: marked SKIPPED, user verifies manually.

### CI/CD (Automatic)

Lint, typecheck, tests, and build run on every PR via `.github/workflows/quality-gates.yml`.
Manual gates (responsive, visual, performance, a11y, security) run during `/review`.

---

## Error Recovery (Quick Reference)

Every skill has built-in error recovery. Key patterns:

- **After any fix → re-run ALL checks** (not just the failed one)
- **Test passes when it shouldn't → delete and rewrite the test**
- **Fix breaks other tests → REVERT, fix design first**
- **Stuck after reasonable effort → STOP, report, ask user**
- **Quick fix too complex → upgrade to STANDARD tier**

Full details in each skill: `.claude/skills/[name]/SKILL.md`

---

## Traceability Matrix

```markdown
| Criterion | Test File | Test Name | Status |
|-----------|-----------|-----------|--------|
| AC-001 | `file.test.ts` | `test name` | PASS/FAIL/PENDING |
```

---

## Feature Delivery Format

```
FEATURE COMPLETE: [Name]
TIER: [MINIMAL | LIGHT | STANDARD | FULL]

WHAT WAS BUILT: [Description]

ACCEPTANCE CRITERIA:
- AC-001: [description] — PASSED

QUALITY GATES: ALL PASSED

HOW TO TEST:
1. [Steps]

AWAITING YOUR APPROVAL
```

---

## Bug Handling

```
1. STOP     → Don't fix immediately
2. ANALYZE  → 5 Whys
3. DOCUMENT → Post-mortem
4. TEST     → Failing test first
5. FIX      → Minimal fix
6. VERIFY   → Run tests
7. REVIEW   → Quality check
8. CLOSE    → Update post-mortem, save to memory
```

---

## Commit Format

```
<type>(<scope>): <description>
```

| Type | Use |
|------|-----|
| feat | New feature |
| fix | Bug fix |
| spec | Specification |
| test | Tests |
| docs | Documentation |
| refactor | Refactoring |
| chore | Maintenance |

---

## Approval Triggers

"approved", "looks good", "green light", "ship it", "lgtm"
→ Approve current phase and proceed

---

## File Locations

| Type | Location |
|------|----------|
| **Source of truth** | `CLAUDE.md` |
| Specs | `docs/specs/[feature].md` |
| Reviews | `docs/reviews/[feature].md` |
| Feature Docs | `docs/features/[feature].md` |
| Bug Post-mortems | `docs/bugs/[bug-id].md` |
| Workflow State | `.vibe/state.json` |
| Config (reference only) | `config/*.yaml` — YAML is NOT read by Claude |

---

## Critical Rules

**NEVER:**
- Apply FULL ceremony to a typo (use MINIMAL)
- Apply MINIMAL ceremony to a feature (use STANDARD+)
- Commit or push without user instruction
- Skip quality gates for the active tier
- Force push, reset --hard, or clean -f

**ALWAYS:**
- Match ceremony to complexity
- Tests before code (LIGHT+ tiers)
- Stop & Wait for approval at phase gates
- Update `.vibe/state.json` during workflows
- Use `use context7` with framework/library APIs

---

## Tooling

### Hooks (Automatic)

| Hook | Trigger | What it does |
|------|---------|--------------|
| Auto-lint | Every Write/Edit on `.js/.ts/.tsx` | Runs `eslint --fix` |
| Pre-commit | Every `git commit` | Runs `npm run lint && npm run test` |

### MCP Servers

| Server | Purpose | Activation |
|--------|---------|------------|
| `context7` | Live framework/library docs | Add `use context7` to prompt |
| `playwright` | Browser automation, responsive | Available automatically |
| `github` | Issues, PRs, code search | Requires `GITHUB_TOKEN` |
| `sequential-thinking` | Architecture reasoning | Available automatically |
| `memory` | Persistent knowledge across sessions | Available automatically |

### MOP Foundations

```bash
./scripts/add-mop-foundation.sh         # Next.js
./scripts/add-mop-foundation-rn.sh      # React Native (pnpm)
```

### Personal Preferences

```bash
cp CLAUDE.local.md.example CLAUDE.local.md
# Edit CLAUDE.local.md — it is gitignored
```
