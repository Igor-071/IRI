# Skill: Bug Analysis

Activate when: A bug is found during development or reported by user.

## Process

### 1. STOP — Don't fix yet
Understand before acting.

### 2. Reproduce
```
Write the exact steps to reproduce the bug.
If you can't reproduce it, you can't fix it.
```

### 3. Five Whys
```
Why did it happen? → [Answer 1]
Why? → [Answer 2]
Why? → [Answer 3]
Why? → [Answer 4]
Why? → [Root cause]
```

### 4. Write failing test FIRST
```
Write a test that reproduces the bug.
Run it. Confirm it fails.
This is now your regression test.
```

### 5. Fix — Minimal change
```
Fix the root cause. Not the symptom.
The smallest change that makes the failing test pass.
```

### 6. Verify
```
Run ALL tests. Not just the new one.
The fix must not break anything else.
```

### 7. Document in `docs/bugs/BUG-[number]-[name].md`

```markdown
# BUG-[number]: [Short description]

## What happened
[One paragraph]

## Root cause (Five Whys)
1. [Why 1]
2. [Why 2]
3. [Why 3]
4. [Why 4]
5. [Root cause]

## Fix applied
[What was changed and why]

## Regression test
[File:line — test name]

## Prevention
[What would prevent this class of bug in the future]
```

## State Tracking

On start: Update `.vibe/state.json` — set active workflow with tier "LIGHT" or "EMERGENCY" and phase "bug_analysis".
On fix applied: Update phase to "bug_fix_applied".
On verification: Update phase to "bug_verified". Move to history.

## Memory Integration

After bug resolution:
- Save to memory MCP: bug category, root cause pattern, affected files, prevention measure
- On future bugs, recall: "A similar bug was found before — see BUG-003. Root cause was [pattern]."
- Track bug frequency by area: if the same module has 3+ bugs, flag it for refactoring.

## Rules
- Never skip the failing test. The test proves the bug existed and proves it's fixed.
- Fix root causes, not symptoms. A symptom fix means the bug comes back.
- Keep bug docs short. If it takes more than a page, the bug is multiple bugs.

## Error Recovery
- **Bug is not reproducible:** Document exactly what you tried (steps, environment, data). Ask user for more context, exact steps, or screenshots. Don't guess at a fix for a bug you can't reproduce.
- **Five Whys stalls (can't go deeper):** Report where the analysis stopped and why. Ask user for domain knowledge: "I reached 'the validation regex is wrong' but I don't know why it was written this way. Can you provide context?"
- **Regression test is hard to write:** The bug may span multiple systems or involve timing/state. Simplify: test the smallest reproducible case. If truly untestable, document why and add a manual test step.
- **Fix breaks other tests:** REVERT immediately. The root cause analysis was incomplete — the actual root cause is deeper or different. Go back to Five Whys with new information.
- **Can't find root cause after reasonable effort:** Report your findings honestly. Suggest pair debugging or point to the most likely area. Don't fabricate a root cause.
- **Bug is actually a feature request:** Clarify with user. If it's a feature, redirect to `/vibe feature` or `/spec`. Don't treat feature requests as bugs.
