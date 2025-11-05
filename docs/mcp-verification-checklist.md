# MCP Servers Verification Checklist

## Overview

This document provides a comprehensive checklist for verifying all 4 MCP servers configured for the GitHub User Info project.

**Last Updated:** 2025-11-03

## MCP Servers Status

| Server | Status | Version | Purpose |
|--------|--------|---------|---------|
| Playwright MCP | ✅ Ready | latest | Browser automation & E2E testing |
| Storybook MCP | ✅ Configured | 0.4.0 | Component documentation access |
| shadcn UI MCP | ✅ Ready | latest | UI component library documentation |
| Vite MCP | ✅ Built-in | 0.2.5 | Build tool integration |

---

## 1. Playwright MCP Server

### Installation Status
- ✅ Package: `@playwright/mcp@latest`
- ✅ Playwright: v1.56.1 installed
- ✅ Browsers: chromium, firefox, webkit installed

### Configuration
```bash
# For VS Code / Claude Code
code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp@latest"]}'
```

### Verification Steps
1. **Check MCP is registered:**
   - Open Claude Code settings
   - Navigate to MCP servers section
   - Verify "playwright" appears in the list

2. **Test connection:**
   ```bash
   # Ask Claude Code:
   "Use Playwright MCP to check available test commands"
   ```

3. **Expected capabilities:**
   - Run Playwright tests
   - View test results
   - Debug failed tests
   - Generate test reports
   - Access browser automation APIs

### Usage Examples
```bash
# Run all E2E tests
"Use Playwright MCP to run all E2E tests"

# Run specific test file
"Use Playwright MCP to run e2e/user-search.spec.ts"

# Run tests in UI mode
"Use Playwright MCP to run tests in UI mode"

# Show test report
"Use Playwright MCP to show the last test report"
```

---

## 2. Storybook MCP Server

### Installation Status
- ✅ Package: `storybook-mcp@0.4.0` installed
- ✅ Storybook: v10.0.3 configured
- ✅ Build output: `storybook-static/` with `index.json`

### Configuration
```bash
# For VS Code / Claude Code
code --add-mcp '{
  "name":"storybook",
  "command":"npx",
  "args":["storybook-mcp", "./storybook-static"]
}'
```

### Verification Steps
1. **Check build artifacts:**
   ```bash
   ls -la storybook-static/index.json
   # Should exist and be recent
   ```

2. **Verify stories are indexed:**
   ```bash
   cat storybook-static/index.json | grep -c "stories"
   # Should show multiple stories
   ```

3. **Test connection:**
   ```bash
   # Ask Claude Code:
   "Use Storybook MCP to list all available components"
   ```

4. **Expected capabilities:**
   - Query component documentation
   - Access component props and types
   - View component examples
   - Get component usage patterns
   - Access story metadata

### Usage Examples
```bash
# List all components
"Use Storybook MCP to show all documented components"

# Get Button component details
"Use Storybook MCP to show Button component documentation"

# Find components by feature
"Use Storybook MCP to find all form-related components"

# Get SearchForm props
"Use Storybook MCP to show SearchForm props and examples"
```

### Important Notes
- **Rebuild required:** Run `npm run build-storybook` after adding/modifying stories
- **Path matters:** MCP needs the path to `storybook-static` directory
- **Dev server not needed:** MCP works with static build, not `npm run storybook`

---

## 3. shadcn UI MCP Server

### Installation Status
- ✅ shadcn/ui components installed
- ✅ MCP server available via npx

### Configuration
```bash
# For VS Code / Claude Code
code --add-mcp '{
  "name":"shadcn",
  "command":"npx",
  "args":["@anirban1809/shadcn-ui-mcp"]
}'
```

### Verification Steps
1. **Check installed components:**
   ```bash
   cat components.json | grep '"ui"'
   # Should show ui components directory
   ```

2. **List current components:**
   ```bash
   ls src/components/ui/
   # Shows: button.tsx, card.tsx, toast.tsx, etc.
   ```

3. **Test connection:**
   ```bash
   # Ask Claude Code:
   "Use shadcn MCP to show available UI components"
   ```

4. **Expected capabilities:**
   - Query shadcn/ui documentation
   - Get component installation commands
   - Access component API docs
   - View component examples
   - Get theming information

### Usage Examples
```bash
# List all shadcn components
"Use shadcn MCP to list all available components"

# Get Button component docs
"Use shadcn MCP to show Button component API"

# Add new component
"Use shadcn MCP to show how to add Dialog component"

# Get theming info
"Use shadcn MCP to show theming options for Button"
```

---

## 4. Vite MCP (Built-in)

### Installation Status
- ✅ Plugin: `vite-plugin-mcp@0.2.5` installed
- ✅ Configuration: Added to `vite.config.ts`
- ✅ Vite: v7.1.2

### Configuration
Already configured in [vite.config.ts](../vite.config.ts):
```typescript
import { ViteMcp } from 'vite-plugin-mcp'

export default defineConfig({
  plugins: [react(), tailwindcss(), ViteMcp()],
  // ...
})
```

### Verification Steps
1. **Check plugin is loaded:**
   ```bash
   npm run dev
   # Should start without errors
   ```

2. **Verify Vite configuration:**
   ```bash
   # Ask Claude Code:
   "Check the Vite configuration for MCP integration"
   ```

3. **Expected capabilities:**
   - Query Vite configuration
   - Access build configuration
   - Get plugin information
   - View development server settings
   - Access environment variables

### Usage Examples
```bash
# Show Vite config
"Show the current Vite configuration"

# Check plugins
"List all Vite plugins in use"

# View build settings
"Show the production build configuration"

# Check environment
"Show available environment variables"
```

---

## Verification Workflow

### Step 1: Install All MCP Servers
```bash
# Already completed:
✅ npm install -D storybook-mcp
✅ npm run build-storybook
✅ vite-plugin-mcp configured

# Need to configure in Claude Code:
⏳ code --add-mcp for Playwright
⏳ code --add-mcp for Storybook
⏳ code --add-mcp for shadcn
```

### Step 2: Verify Each MCP
For each MCP server, verify:
1. ✅ Installation (package installed)
2. ⏳ Configuration (added to Claude Code)
3. ⏳ Connection (MCP responds to queries)
4. ⏳ Functionality (can perform expected operations)

### Step 3: Integration Test
Test all MCPs working together:
```bash
# Example task requiring multiple MCPs:
"Use Playwright MCP to run E2E tests for the SearchForm component,
 then use Storybook MCP to update the component documentation based
 on any issues found, and finally use shadcn MCP to verify the Button
 component usage follows best practices"
```

---

## Troubleshooting

### Playwright MCP Issues

**Problem:** MCP not found
```bash
# Solution:
npm install -g @playwright/mcp
# Or use npx in configuration
```

**Problem:** Tests fail to run
```bash
# Check Playwright installation:
npx playwright --version

# Reinstall browsers if needed:
npx playwright install
```

### Storybook MCP Issues

**Problem:** No stories found
```bash
# Solution:
npm run build-storybook
# Verify index.json exists:
ls storybook-static/index.json
```

**Problem:** Stories outdated
```bash
# Rebuild Storybook:
npm run build-storybook
# Restart MCP connection
```

**Problem:** Path not found
```bash
# Check path in MCP configuration:
# Should be: "./storybook-static"
# Not: "storybook-static" or "./storybook-static/"
```

### shadcn MCP Issues

**Problem:** Components not found
```bash
# Check components.json exists:
cat components.json

# Verify ui directory:
ls src/components/ui/
```

**Problem:** MCP not responding
```bash
# Try with explicit token:
code --add-mcp '{
  "name":"shadcn",
  "command":"npx",
  "args":["@anirban1809/shadcn-ui-mcp"],
  "env": {"GITHUB_TOKEN": "your_token_here"}
}'
```

### Vite MCP Issues

**Problem:** Plugin not loaded
```bash
# Check vite.config.ts has ViteMcp() in plugins array
# Restart dev server:
npm run dev
```

**Problem:** Build fails
```bash
# Check for plugin conflicts
# Verify all imports are correct
npm run build
```

---

## Expected Outcomes

### After Full Configuration

When all MCPs are configured, you should be able to:

1. **Playwright MCP:**
   - Run E2E tests via Claude Code
   - Debug test failures
   - Generate test reports
   - Get test coverage information

2. **Storybook MCP:**
   - Query component documentation
   - Get component usage examples
   - Access component props and types
   - View all available stories

3. **shadcn UI MCP:**
   - Query UI component documentation
   - Get installation commands
   - Access theming information
   - View component examples

4. **Vite MCP:**
   - Query build configuration
   - Access plugin settings
   - View environment variables
   - Get development server info

### Success Criteria

- [ ] All 4 MCPs registered in Claude Code
- [ ] Each MCP responds to basic queries
- [ ] No error messages when connecting
- [ ] Can perform expected operations
- [ ] Integration between MCPs works

---

## Next Steps After Verification

Once all MCPs are verified:

1. **Create comprehensive tests** using Playwright MCP
2. **Document all components** using Storybook MCP
3. **Add JSDoc to functions** with MCP assistance
4. **Optimize UI components** using shadcn MCP
5. **Configure build optimization** using Vite MCP

---

## Resources

- [Playwright MCP Documentation](https://github.com/playwright/playwright)
- [Storybook MCP Documentation](https://www.npmjs.com/package/storybook-mcp)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Vite MCP Plugin](https://github.com/antfu/vite-plugin-mcp)
- [Project MCP Setup Guide](./mcp-setup.md)

---

## Checklist Summary

### Installation ✅
- [x] storybook-mcp installed
- [x] Storybook built
- [x] vite-plugin-mcp configured
- [x] All dependencies installed

### Configuration ⏳
- [ ] Playwright MCP added to Claude Code
- [ ] Storybook MCP added to Claude Code
- [ ] shadcn UI MCP added to Claude Code
- [x] Vite MCP configured in project

### Verification ⏳
- [ ] Playwright MCP connection tested
- [ ] Storybook MCP connection tested
- [ ] shadcn UI MCP connection tested
- [ ] Vite MCP functionality verified

### Documentation ✅
- [x] MCP setup guide created
- [x] Verification checklist created
- [ ] Usage examples documented
- [ ] Troubleshooting guide updated

---

**Status:** Ready for MCP configuration in Claude Code
**Last Build:** 2025-11-03 19:18
**Storybook Stories:** 5 component stories available
