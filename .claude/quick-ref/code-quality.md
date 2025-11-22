# Code Quality - Quick Reference

> **Purpose**: Standards for ESLint, TS, types  
> **For full rules**: See eslint.config.js

### ESLint Rules

**Config:** eslint.config.js (flat format)  
**Custom Rules:** no-console: warn (allows warn/error, blocks log)  
**Plugins:** TypeScript ESLint, React Hooks, React Refresh, Tailwind CSS, Storybook, Prettier.

### TypeScript

**Version:** 5.8.3  
**Configs:** tsconfig.json (base), tsconfig.app.json (app, excludes tests), tsconfig.node.json (tools).  
**Important:** Exclude tests from build to avoid errors.

### Type Conventions

- Props: Descriptive, specific (e.g., UserAuthenticityProps).
- Capitalize type names.
- Avoid generic Props — be descriptive.
- Handlers: handler prefix (e.g., handlerOnSubmit).
