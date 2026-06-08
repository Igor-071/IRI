# Skill: Vibe — Adaptive Workflow Router

Activate when: User says `/vibe`, `/v`, or describes a change/feature/fix/task to work on.

This is the **master router**. It detects complexity, picks the right tier, and executes the workflow.

## Process

### Step 1: Parse the Request

Extract from the user's message:
- **What** they want (fix, feature, refactor, etc.)
- **Scope** clues (file names, component names, "small", "big", "major")
- **Explicit command** (`/vibe fix`, `/vibe feature`, `/vibe epic`, etc.)
- **Explicit tier flag** (`--minimal`, `--light`, `--standard`, `--full`)

### Step 2: Detect Tier

**If explicit tier flag** → Use that tier. No detection needed.

**If explicit command** → Use the command's default tier:
| Command | Default Tier |
|---------|-------------|
| `tweak` | MINIMAL |
| `fix` | LIGHT |
| `update` | LIGHT |
| `refactor` | LIGHT |
| `add` | STANDARD |
| `feature` | STANDARD |
| `epic` | FULL |
| `hotfix` | EMERGENCY |

**If natural language** → Run auto-detection:

1. Scan for **MINIMAL signals**: typo, spelling, grammar, copy, wording, rename, color, padding, margin, config, env, "change X to Y", single file/line scope
2. Scan for **LIGHT signals**: fix, bug, broken, crash, error, wrong, add button, small component, refactor, extract, move, 1-3 files, 10-100 lines
3. Scan for **STANDARD signals**: feature, implement, build, create, new page, form, API endpoint, database, auth, 3-10 files, 100-500 lines
4. Scan for **FULL signals**: epic, major, architecture, redesign, migration, security overhaul, platform, 10+ files, 500+ lines
5. Scan for **EMERGENCY signals**: urgent, critical, production down, security vulnerability, data breach, users affected, hotfix

**Emergency always wins.** If any emergency signal is present, use EMERGENCY tier.

**If ambiguous** (signals from multiple tiers, no clear winner): Ask the user.
"This could be LIGHT or STANDARD. Are we fixing something small or building something new?"

### Step 3: Propose and Confirm

Report the detected tier with reasoning:

```
TIER: LIGHT
Reasoning: Bug fix in a single component (1-2 files expected)
Phases: Understand → Test → Fix → Verify

Proceeding with LIGHT tier. Say --standard to upgrade.
```

Wait 1-2 seconds for override. If none, proceed.

### Step 4: Check Memory

Before executing, recall from memory MCP:
- Has a similar feature been built before? What tier was used?
- Any lessons learned that apply to this type of change?
- User's past tier override patterns

If relevant memory exists, mention it briefly:
"Note: A similar auth feature was built last week at STANDARD tier. Reusing patterns."

### Step 5: Load State

Read `.vibe/state.json`:
- If an active workflow exists for a DIFFERENT feature: Warn user. Ask to pause/abort the other one.
- If resuming the SAME feature: Report where we left off.
- If no active workflow: Create new state entry.

### Step 6: Execute the Tier

**MINIMAL:**
1. Read the relevant file(s)
2. Make the change
3. Run `npm run lint` (or project equivalent)
4. If lint fails: fix and re-lint
5. Report: "Done. Lint clean."
6. Update `.vibe/state.json` → completed

**LIGHT:**
1. Read relevant code to understand the issue
2. If testable: Write a failing test → Run it (RED)
3. Make the fix / change
4. Run tests + lint
5. If tests fail: fix and re-run
6. Report results
7. **STOP & WAIT** for approval
8. Update `.vibe/state.json` → completed

**STANDARD:**
1. Invoke `/spec` skill → **STOP & WAIT** for approval
2. Invoke `/test-plan` skill → **STOP & WAIT** for approval
3. Invoke `/implement` skill (TDD cycle for each AC)
4. Invoke `/review` skill (run quality gates)
5. Present results → **STOP & WAIT** for approval
6. On approval: Generate feature docs, update state → completed

**FULL:**
1. Same as STANDARD, but:
   - Spec includes technical design, security, performance sections
   - Quality Lead persona active from test planning onward
   - Run ALL 10 quality gates (regardless of prototype/production mode)
   - Architecture review gate
   - Security review gate (if auth/data changes)
   - Generate comprehensive documentation
   - Update state → completed

**EMERGENCY:**
1. Reproduce the issue (exact steps)
2. Write regression test
3. Fix (minimal, targeted)
4. Run critical tests only
5. **STOP & WAIT** — user decides to ship
6. After shipping: schedule postmortem within 24h
7. Create `docs/bugs/BUG-[number]-[name].md`
8. Update state → completed

### Step 7: Save to Memory

After any workflow completes:
- Save: feature name, tier, gates passed/failed, issues encountered, duration
- If user overrode detection: save the override pattern for future reference
- If a bug was found during review: save the pattern

## Error Recovery

- If auto-detection is uncertain: Ask the user. Never guess.
- If a tier's phases fail midway: Save state. Report what happened. Ask to retry or change tier.
- If user overrides to a lower tier mid-workflow: Drop remaining phases for the higher tier.
- If user overrides to a higher tier mid-workflow: Add remaining phases for the higher tier.
- If `.vibe/state.json` is corrupted or missing: Create a fresh one. Warn user that history is lost.
- If memory MCP is unavailable: Proceed without memory. Note it in output.

## Output Format (Completion)

```
WORKFLOW COMPLETE: [Feature/Fix Name]
TIER: [MINIMAL | LIGHT | STANDARD | FULL | EMERGENCY]

WHAT WAS DONE:
[Clear description]

[If STANDARD+:]
ACCEPTANCE CRITERIA:
- AC-001: [description] — PASSED
...

QUALITY GATES:
| Gate | Status |
|------|--------|
| Lint | PASS   |
...

HOW TO TEST:
1. [Steps]

AWAITING YOUR APPROVAL
```
