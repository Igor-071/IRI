# Skill: Quality Review

Activate when: Implementation is approved and ready for final review before shipping.

## Quality Gates

Run each gate. Report pass/fail. ALL must pass.

### Prototype Mode (5 gates)

| # | Gate | How to Verify | Pass Criteria |
|---|------|---------------|---------------|
| 1 | **Tests pass** | `npm run test` | 0 failures |
| 2 | **Lint clean** | `npm run lint` | 0 errors, 0 warnings |
| 3 | **All ACs met** | Check traceability matrix | Every AC has a passing test |
| 4 | **Responsive** | Playwright or manual check at 320/375/768/1024/1440px | No layout breaks |
| 5 | **Code review** | Read the diff. Check for: dead code, hardcoded values, missing error handling at boundaries, security issues | Clean |

### Production Mode (add these 5)

| # | Gate | How to Verify | Pass Criteria |
|---|------|---------------|---------------|
| 6 | **Performance** | Lighthouse audit | Score > 90, FCP < 1.5s |
| 7 | **Accessibility** | axe-core or Lighthouse a11y | WCAG 2.1 AA, keyboard nav works |
| 8 | **Cross-browser** | Test in Chrome, Safari, Firefox | No visual or functional regressions |
| 9 | **Build succeeds** | `npm run build` | 0 errors |
| 10 | **Security scan** | Check for XSS, injection, exposed secrets | Clean |

## Output Format

```
QUALITY REVIEW: [Feature Name]

| # | Gate           | Status | Notes              |
|---|----------------|--------|--------------------|
| 1 | Tests pass     | PASS   | 12/12 passing      |
| 2 | Lint clean     | PASS   |                    |
| 3 | All ACs met    | PASS   | 4/4 criteria       |
| 4 | Responsive     | PASS   | All breakpoints OK |
| 5 | Code review    | PASS   | No issues found    |

RESULT: ALL GATES PASSED — Ready to ship
```

## Visual Verification (Gate 4b — UI changes)

If the feature includes UI changes:

1. Use Playwright MCP to capture screenshots at key breakpoints:
   - 375px (mobile)
   - 768px (tablet)
   - 1440px (desktop)
2. Present screenshots to user with description of what changed
3. User confirms visual correctness

If Playwright is unavailable: Note as SKIPPED — "No browser automation available. Please verify visually." Ask user to manually check.

## State Tracking

On start: Update `.vibe/state.json` — set phase to "review".
On each gate: Update the gate's status (passed/failed) in state.
On completion: Update phase to "review_complete".

## Memory Integration

After review completes:
- Save to memory MCP: which gates failed first, what the fix was
- If a gate fails repeatedly across features, flag it in future reviews: "Note: lint has failed in the last 3 reviews — consider adding a pre-save hook."

## Error Recovery

- **Tests fail:** Report which tests and why. If the fix is obvious (missing import, typo), fix it. If unclear, ask user. After ANY fix, re-run ALL gates from the beginning.
- **Lint fails:** Run `npm run lint:fix` first. If auto-fix resolves it, continue. If not, report remaining issues and fix manually. Re-run all gates.
- **Responsive check fails:** Report which breakpoint breaks and what the issue is (overflow, hidden content, tiny text). Fix. Re-check ALL breakpoints, not just the broken one.
- **Build fails:** Report the full error. Fix. Re-run the build. If the error is in a dependency, report to user.
- **Lighthouse < 90:** Report the score breakdown (Performance, Accessibility, Best Practices, SEO). Fix the top 3 issues by impact. Re-audit.
- **Accessibility fails:** Report axe-core violations with severity. Fix critical/serious first. Re-scan.
- **After ANY fix:** Re-run ALL gates from gate 1. Never assume a fix didn't affect other gates.
- **Gate is impossible to run** (e.g., no Lighthouse in CLI, no browser for responsive): Mark as SKIPPED with reason. Don't fail the review — but note it clearly.
- **All gates pass but code review finds issues:** Fix the issues. Re-run all automated gates to verify the fix didn't break anything.
