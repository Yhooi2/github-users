# MCP Servers Setup Guide

This project is configured to work with **4 Model Context Protocol (MCP) servers** that enhance AI-assisted development:

1. **Playwright MCP** - Browser automation and E2E testing
2. **Storybook MCP** - UI component documentation access
3. **shadcn UI MCP** - Access to shadcn/ui component library docs
4. **Vite MCP** - Vite development server integration (built-in)

> **📋 [MCP Verification Checklist](./mcp-verification-checklist.md)** - Complete verification guide with troubleshooting

---

## Quick Status

| MCP Server | Installation | Configuration | Status |
| ---------- | ------------ | ------------- | ------ |
| Playwright | Ready        | Needs setup   | ⏳     |
| Storybook  | ✅ v0.4.0    | Needs setup   | ⏳     |
| shadcn UI  | Ready        | Needs setup   | ⏳     |
| Vite       | ✅ Built-in  | ✅ Done       | ✅     |

---

## Prerequisites

- Node.js 18+ installed
- VS Code with Claude extension or Claude Code
- GitHub Personal Access Token (for shadcn UI MCP)

---

## 1. Playwright MCP Server

### Installation for VS Code (Claude Code)

Using CLI:

```bash
code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp@latest"]}'
```

### Manual Configuration

Add to your VS Code settings or `~/.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### Features

- Execute browser automation commands
- Run Playwright tests
- Inspect page elements
- Take screenshots
- Record traces

### Usage Example

Ask Claude:

- "Run Playwright tests for user search"
- "Take a screenshot of the home page"
- "Inspect the search form element"

---

## 2. Storybook MCP Server

### Installation

✅ **Already installed:** `storybook-mcp@0.4.0`

```bash
# If reinstalling:
npm install -D storybook-mcp
```

### First Time Setup

✅ **Already built:** `storybook-static/index.json` exists

Build Storybook to generate the index.json file:

```bash
npm run build-storybook
```

> **Note:** Rebuild Storybook after adding or modifying stories!

### Configuration

Using CLI:

```bash
code --add-mcp '{
  "name":"storybook",
  "command":"npx",
  "args":["storybook-mcp", "./storybook-static"]
}'
```

Or add manually to your MCP settings:

```json
{
  "mcpServers": {
    "storybook": {
      "command": "npx",
      "args": ["storybook-mcp", "./storybook-static"]
    }
  }
}
```

> **Important:** Path must be `./storybook-static` (relative to project root)

### Features

- Access component stories
- Query component props and documentation
- Get component examples
- Browse all available components

### Usage Example

Ask Claude:

- "Show me all Storybook stories"
- "What are the props for the Button component?"
- "Create a story for the UserProfile component"

**Note:** You need to rebuild Storybook after adding new stories:

```bash
npm run build-storybook
```

---

## 3. shadcn UI MCP Server

### Installation

No npm install required - runs via npx.

### Configuration

Add to your MCP settings with your GitHub token:

```json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["@jpisnice/shadcn-ui-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Getting a GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo` (read access)
4. Copy the token
5. Add it to the MCP configuration above

### Why GitHub Token?

The shadcn UI MCP scrapes documentation from GitHub. Without a token:

- 60 requests/hour limit
- May hit rate limits quickly

With a token:

- 5000 requests/hour
- Reliable access to docs

### Features

- Access shadcn/ui component documentation
- Get component installation commands
- Query component variants and props
- Browse available components for React and Svelte

### Usage Example

Ask Claude:

- "Show me how to use the shadcn Dialog component"
- "What variants does the Button component have?"
- "Install the Alert Dialog component"

---

## 4. Vite MCP (Built-in)

### Installation

Already installed and configured in `vite.config.ts`!

```typescript
import { ViteMcp } from "vite-plugin-mcp";

export default defineConfig({
  plugins: [react(), tailwindcss(), ViteMcp()],
});
```

### How It Works

- Automatically runs when you start the dev server: `npm run dev`
- Accessible at: `http://localhost:5173/__mcp/sse`
- No additional configuration needed

### Features

- Vite development server info
- Hot Module Replacement (HMR) status
- Build information
- Plugin information

---

## Complete MCP Configuration Example

Here's a complete MCP configuration file with all 4 servers:

### For VS Code (settings.json or mcp.json)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "storybook": {
      "command": "npx",
      "args": ["storybook-mcp", "./storybook-static"]
    },
    "shadcn-ui": {
      "command": "npx",
      "args": ["@jpisnice/shadcn-ui-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**Note:** Vite MCP doesn't need configuration - it's built into the project!

---

## Verification Steps

### After Configuration

Once you've configured all MCP servers in Claude Code, verify they're working:

1. **Check MCP Server List**
   - Open Claude Code
   - View → Output → Select "MCP Servers"
   - You should see all 4 servers listed

2. **Test Each Server**

   **Playwright MCP:**

   ```
   Ask Claude: "Use Playwright MCP to list available test commands"
   Expected: Response with Playwright capabilities
   ```

   **Storybook MCP:**

   ```
   Ask Claude: "Use Storybook MCP to show all available components"
   Expected: List of Button, SearchForm, Header, Page stories
   ```

   **shadcn UI MCP:**

   ```
   Ask Claude: "Use shadcn MCP to show Button component variants"
   Expected: Response with default, destructive, outline, secondary, ghost, link
   ```

   **Vite MCP:**

   ```
   Ask Claude: "Show the current Vite configuration"
   Expected: Vite config from vite.config.ts
   ```

3. **Check for Errors**
   - View → Output → Select "MCP Servers"
   - Look for any error messages
   - If errors appear, see [Troubleshooting](#troubleshooting) section

### Complete Verification Checklist

For a comprehensive verification with detailed troubleshooting, see:
**[MCP Verification Checklist](./mcp-verification-checklist.md)**

This includes:

- Detailed verification steps for each MCP
- Expected capabilities and responses
- Common issues and solutions
- Integration testing procedures
- Success criteria

---

## Troubleshooting

### Playwright MCP

**Error: Browser not installed**

```bash
npx playwright install chromium
```

**Error: Permission denied**

- Make sure npx is in your PATH
- Try: `node --version` to verify Node.js is installed

### Storybook MCP

**Error: Cannot find index.json**

```bash
npm run build-storybook
```

**Error: Module not found**

```bash
npm install
```

### shadcn UI MCP

**Error: Rate limit exceeded**

- Add a GitHub Personal Access Token
- Check token has correct permissions

**Error: Token invalid**

- Generate a new token at https://github.com/settings/tokens
- Make sure token hasn't expired

### Vite MCP

**Error: Module not found 'vite-plugin-mcp'**

```bash
npm install -D vite-plugin-mcp
```

**Error: Cannot access /\_\_mcp/sse**

- Make sure dev server is running: `npm run dev`
- Check port 5173 is not blocked

---

## MCP Server Status Check

To verify all MCP servers are working, ask Claude:

```
Can you list all available MCP servers and their status?
```

You should see:

- ✅ Playwright
- ✅ Storybook (after building)
- ✅ shadcn UI (with valid token)
- ✅ Vite (when dev server is running)

---

## Best Practices

1. **Playwright MCP**
   - Use for E2E test automation
   - Great for debugging test failures
   - Use screenshots to verify UI states

2. **Storybook MCP**
   - Rebuild after adding new stories
   - Use to browse existing components
   - Document component usage

3. **shadcn UI MCP**
   - Query before adding new components
   - Check variants and customization options
   - Get installation snippets

4. **Vite MCP**
   - Always running during development
   - Useful for build debugging
   - Check HMR status

---

## Additional Resources

- [Playwright MCP Documentation](https://github.com/microsoft/playwright-mcp)
- [Storybook MCP Documentation](https://github.com/m-yoshiro/storybook-mcp)
- [shadcn UI MCP Documentation](https://github.com/jpisnice/shadcn-ui-mcp-server)
- [Vite MCP Documentation](https://github.com/antfu/nuxt-mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)

---

## Need Help?

If you encounter issues:

1. Check this documentation
2. Verify all prerequisites are installed
3. Check MCP server logs in VS Code output panel
4. Ask Claude for help with specific error messages
