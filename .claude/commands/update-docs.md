# Update Project Documentation

After making changes to the project, update documentation following Claude Code best practices.

## Instructions

### 1. Analyze Changes
First, check what was changed:
```bash
git diff --stat HEAD~1
git log -1 --pretty=format:"%s"
```

### 2. Update CLAUDE.md (if needed)
CLAUDE.md must stay **under 100-150 lines**. Only update if:
- Test count/coverage changed significantly
- New major components added
- Architecture changed
- New commands added

Key sections to check:
- **Status line**: Tests count, coverage %
- **Commands**: Any new npm scripts?
- **Key Components**: New important components?
- **Documentation table**: New docs added?

### 3. Update docs/INDEX.md (if needed)
Only if:
- New documentation files created
- Files moved or deleted
- Phase status changed

### 4. What NOT to do
- Don't add phase history to CLAUDE.md (keep it minimal)
- Don't create new docs unless absolutely necessary
- Don't duplicate information across files
- Don't add time estimates or timelines

### 5. Best Practices (Anthropic)
- CLAUDE.md is prepended to every prompt - keep it concise
- Use `#` key during coding to add instructions iteratively
- Focus on: commands, file locations, style guidelines, quirks
- Archive outdated docs to `docs/history/` instead of deleting

### 6. Commit Documentation Changes
If docs were updated:
```bash
git add .claude/CLAUDE.md docs/INDEX.md
git commit -m "docs: Update documentation after [feature/fix name]"
```

## Example Update

If tests changed from 1980 to 2050:
```markdown
# In CLAUDE.md, update Status line:
**Status:** Production | Tests: 2050 (100%) | Coverage: 91.36%
```

If new component added:
```markdown
# In CLAUDE.md Key Components table, add row:
| `NewComponent` | Description of purpose |
```

## Checklist
- [ ] CLAUDE.md under 150 lines?
- [ ] No duplicate information?
- [ ] INDEX.md links valid?
- [ ] Changes committed?
