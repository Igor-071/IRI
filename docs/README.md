# Documentation Hub

Welcome to the project documentation. This folder contains all workflow documentation and templates.

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [METHODOLOGY.md](./METHODOLOGY.md) | Core philosophy and principles (the "why") |
| [WORKFLOW_RULES.md](./WORKFLOW_RULES.md) | Complete workflow reference (the "how") |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Daily cheat sheet — tiers, commands, gates |

---

## Templates

| Template | Location | When to Use |
|----------|----------|-------------|
| Feature Spec | [SPEC_TEMPLATE.md](./SPEC_TEMPLATE.md) | Before starting any new feature |
| Quality Review | [reviews/REVIEW_TEMPLATE.md](./reviews/REVIEW_TEMPLATE.md) | After implementation, before user testing |
| Feature Docs | [features/FEATURE_DOC_TEMPLATE.md](./features/FEATURE_DOC_TEMPLATE.md) | Auto-generated on feature approval |
| Bug Post-Mortem | [bugs/BUG_POSTMORTEM_TEMPLATE.md](./bugs/BUG_POSTMORTEM_TEMPLATE.md) | When analyzing any bug |

---

## Folder Structure

```
docs/
├── README.md              <- You are here
├── METHODOLOGY.md         <- Philosophy & principles
├── WORKFLOW_RULES.md      <- Complete workflow reference
├── QUICK_REFERENCE.md     <- Daily cheat sheet
├── SPEC_TEMPLATE.md       <- Feature specification template
├── IMPLEMENTATION_PLAN.md <- v2.0 implementation plan
│
├── specs/                 <- Feature specifications (INPUT)
│   └── [feature-name].md
│
├── reviews/               <- Quality reviews (QA)
│   ├── REVIEW_TEMPLATE.md
│   └── [feature-name].md
│
├── features/              <- Feature documentation (OUTPUT)
│   ├── FEATURE_DOC_TEMPLATE.md
│   └── [feature-name].md
│
└── bugs/                  <- Bug post-mortems
    ├── BUG_POSTMORTEM_TEMPLATE.md
    └── BUG-[ID]-[name].md
```

---

## Skills (Slash Commands)

Type these in Claude Code:

### Primary (v2.0)

| Command | When |
|---------|------|
| `/vibe <description>` | Start any workflow — auto-detects tier |
| `/fix <description>` | Quick fix — MINIMAL or LIGHT tier |
| `/status` | Show current workflow state |
| `/getting-started` | Interactive onboarding for new users |
| `/worktree start <name>` | Start parallel feature development |

### Standard Workflow

| Command | When |
|---------|------|
| `/spec` | Starting a new feature (STANDARD+ tier) |
| `/test-plan` | After spec is approved |
| `/implement` | After test plan is approved — TDD cycle |
| `/review` | After implementation — run quality gates |
| `/ship` | After review passes — commit + PR |
| `/bug` | When a bug is found — 5 Whys + regression test |
| `/mock-data-doc` | Prototype handoff — document all mocked data |

---

## Getting Started

1. **New user?**
   - Type `/getting-started` in Claude Code for an interactive walkthrough

2. **Quick fix?**
   - Type `/fix <description>` or `/vibe fix <description>`

3. **New Feature?**
   - Type `/vibe feature <description>` or `/spec`
   - Get approval, then `/test-plan`, then `/implement`

4. **Check status?**
   - Type `/status` to see current workflow state

5. **Implementation Done?**
   - Type `/review` — Claude runs quality gates

6. **Bug Found?**
   - Type `/bug` — Claude runs 5 Whys analysis

7. **Prototype approved, handing off to backend?**
   - Type `/mock-data-doc` — generates backend handoff doc

---

## v2.0 Features

### Adaptive Tiers
The workflow auto-detects complexity and applies the right ceremony level. A typo fix gets MINIMAL (lint only). A new feature gets STANDARD (spec → TDD → review). Override with `--minimal`, `--light`, `--standard`, `--full`.

### Error Recovery
Every skill has structured error handling. When a gate fails, a test breaks, or something goes wrong, Claude follows a defined recovery path instead of improvising. Details in each skill file.

### Visual Verification
For UI changes, `/review` captures Playwright screenshots at 375px/768px/1440px and presents them for visual confirmation.

### Memory Integration
The workflow learns across sessions via the memory MCP server. It saves completed workflow metadata, bug patterns, and user preferences. On new work, it recalls similar past features and lessons learned.

### Workflow State
State is persisted to `.vibe/state.json`. Use `/status` to check where you are, `/vibe pause` to save progress, `/vibe resume` to continue.

### CI/CD
Lint, tests, and build run automatically on every PR via GitHub Actions. Manual gates (responsive, visual, performance) run during `/review`.

### Parallel Workflows
Use `/worktree` to work on multiple features simultaneously via git worktrees.

### Source of Truth
`CLAUDE.md` is the single source of truth. Config YAML files in `config/` are reference-only — Claude does not read them.

---

## MOP Foundations

```bash
./scripts/add-mop-foundation.sh         # Next.js
./scripts/add-mop-foundation-rn.sh      # React Native (pnpm)
```

---

## Need Help?

- **Philosophy questions:** See [METHODOLOGY.md](./METHODOLOGY.md)
- **Process questions:** See [WORKFLOW_RULES.md](./WORKFLOW_RULES.md)
- **Quick lookup:** See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
