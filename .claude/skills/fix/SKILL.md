# Skill: Quick Fix

Activate when: User says `/fix`, "fix this", "quick fix", or describes a small bug/change that doesn't need full ceremony.

This is a shortcut for MINIMAL and LIGHT tiers. No spec, no test plan, no full review.

## Process

### Step 1: Assess Scope

Read the user's request and determine:

**MINIMAL** (just do it):
- Typo, spelling, grammar fix
- Copy/wording change
- CSS/styling tweak (color, padding, margin, font)
- Config file change
- Single-line fix with obvious correctness

**LIGHT** (test + fix):
- Bug fix (logic error, crash, wrong behavior)
- Small component addition or modification
- Refactoring (extract function, rename, move file)
- Anything that could break existing behavior

If unclear: Default to LIGHT (safer).

### Step 2: Execute

**MINIMAL path:**
1. Read the relevant file(s)
2. Make the change
3. Run `npm run lint`
4. If lint passes: Report "Fixed. Lint clean."
5. If lint fails: Auto-fix with `npm run lint:fix`, then report

**LIGHT path:**
1. Read relevant code to understand the issue
2. Write a failing test that reproduces the bug/validates the change
   - If the change is purely visual (CSS-only): skip the test, note why
3. Run the test — confirm it fails (RED)
4. Make the fix (minimum change to pass the test)
5. Run ALL tests + lint
6. If everything passes: Report results
7. If something fails: Fix and re-run
8. **STOP & WAIT** for user approval

### Step 3: Update State

Write to `.vibe/state.json`:
- Feature: brief description of the fix
- Tier: MINIMAL or LIGHT
- Status: completed
- Move to history

### Step 4: Save to Memory

If the fix revealed a pattern (common bug type, fragile area of code):
- Save to memory MCP for future reference

## Output Format

**MINIMAL:**
```
FIXED: [description]
File: [path]
Lint: Clean
```

**LIGHT:**
```
FIXED: [description]

Changes:
- [file]: [what changed]

Tests: X passing, 0 failing
Lint: Clean

AWAITING YOUR APPROVAL
```

## Error Recovery

- If the "quick fix" turns out to be complex (3+ files, unclear root cause): STOP. Recommend upgrading to STANDARD tier with `/vibe feature`.
- If tests fail after the fix: Don't thrash. Read the failing test, understand why, fix properly.
- If lint can't be auto-fixed: Report the issue. Fix manually.
- If the file doesn't exist or path is wrong: Ask user for correct location.

## Rules

- Never create a spec for a quick fix
- Never run full quality gates — just lint (MINIMAL) or lint+tests (LIGHT)
- If the user asks for something that clearly needs a spec (new feature, new page, API endpoint): Redirect to `/vibe feature` or `/spec`
- Quick fixes should complete in one interaction. If you need to STOP & WAIT more than once, the change isn't quick.
