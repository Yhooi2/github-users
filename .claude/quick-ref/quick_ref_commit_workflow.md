# Quick Reference: Commit Workflow

## TL;DR

```bash
git add .
npm run commit     # Interactive commit with Commitizen
git push
```

## Pre-commit Hook

**Runs automatically before commit:**

- lint-staged → ESLint (auto-fix) + Prettier
- Only on staged files

**If fails:**

```bash
npm run lint       # See errors
git add .          # After fixing
npm run commit     # Retry
```

## Commit Message Format

```
<type>(<scope>): <subject>
```

### Common Types

| Type       | When             | Version |
| ---------- | ---------------- | ------- |
| `feat`     | New feature      | MINOR   |
| `fix`      | Bug fix          | PATCH   |
| `docs`     | Documentation    | -       |
| `refactor` | Code refactoring | -       |
| `test`     | Tests            | -       |
| `ci`       | CI/CD changes    | -       |
| `chore`    | Maintenance      | -       |
| `!`        | Breaking change  | MAJOR   |

### Examples

```bash
feat(ui): add dark mode toggle
fix(api): handle rate limit errors
docs: update commit workflow
refactor(hooks): extract useProgressiveDisclosure
test(tabs): add CodeTab coverage
ci: update GitHub Actions to v6
feat!: migrate to Apollo Client v4
```

## What Happens After Push to Main

1. **CI Workflow**: Lint → TypeCheck → Tests → Build
2. **E2E Workflow**: Playwright tests
3. **Release Workflow**: Auto-versioning + CHANGELOG + GitHub Release
4. **CodeQL**: Security scanning (if code changed)

## Bypass Hooks (Emergency Only)

```bash
git commit --no-verify -m "hotfix: critical bug"
```

## Full Guide

See [docs/COMMIT_WORKFLOW.md](../../docs/COMMIT_WORKFLOW.md) for complete documentation.
