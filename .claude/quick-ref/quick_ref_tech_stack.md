# Technology Stack - Quick Reference

> **Purpose**: List all technologies without implementation details  
> **For detailed setup**: See `guides/phase-1-setup.md`  
> **For MCP usage**: See `specs/mcp-integration.md`

---

## 🎨 UI Framework

### shadcn/ui (Primary)

**Version**: Latest  
**What it is**: Copy-paste components (Radix UI + Tailwind)  
**Why**: Full control, accessible, customizable  
**Not**: An NPM package

**Required Components**:

```bash
# Core
card, badge, button, separator, scroll-area

# Interactive
accordion, dialog, sheet, tabs, hover-card, tooltip

# Data Display
table, progress, skeleton

# Forms (future)
input, select, dropdown-menu, switch
```

**Installation**:

```bash
npx shadcn@latest init
npx shadcn@latest add <component-name>
```

---

## 🎭 Animation

### Framer Motion

**Version**: ^11.0.0  
**Why**: Only library that animates `height: auto` smoothly  
**Use for**: Card expansion, modal transitions, tab switches

**Key APIs**:

- `motion.*` - Animated components
- `AnimatePresence` - Mount/unmount animations
- `useAnimation()` - Programmatic control

**Alternative considered**: CSS transitions ❌ (can't animate `height: auto`)

---

## 📊 Charts & Visualization

### Recharts

**Version**: ^2.15.0  
**Why**: React-friendly, responsive, accessible  
**Charts used**:

- `LineChart` - Timeline activity
- `PieChart` - Language distribution
- `BarChart` - PR size distribution (optional)

**Alternative considered**: Chart.js ❌ (not React-native)

---

## 🔧 Build Tool

### Vite

**Version**: ^7.0.0  
**Port**: 5173 (default)  
**Why**: Fast HMR, excellent DX, modern  
**Plugin**: `@vitejs/plugin-react`

**NOT Next.js** - This is a Vite project!

---

## 🎨 Styling

### Tailwind CSS

**Version**: ^4.1.0  
**Why**: Utility-first, fast development  
**Plugin**: `@tailwindcss/vite` (Tailwind v4 uses Vite plugin, NOT PostCSS)

**Key Features Used**:

- Design tokens via CSS variables
- Dark mode support
- Responsive utilities
- Custom components via `@layer`

---

## 🧪 Testing

### Unit Tests: Vitest

**Version**: ^4.0.0  
**Why**: Vite-native, fast, compatible with Jest  
**Library**: `@testing-library/react` ^16.0.0

### E2E Tests: Playwright

**Version**: ^1.50.0  
**Why**: Cross-browser, reliable, MCP integration  
**Browsers**: Chromium, Firefox, WebKit

---

## 📡 GraphQL

### Apollo Client

**Version**: ^3.14.0  
**Why**: Industry standard, excellent caching  
**Alternative**: Direct fetch API for simple queries

---

## 🔤 TypeScript

**Version**: ^5.8.0  
**Config**: Strict mode enabled  
**Path aliases**: `@/*` → `src/*`

---

## 🧹 Linting

### ESLint

**Version**: ^9.0.0  
**Config**: Flat config format (`eslint.config.js`)  
**Plugins**:

- `typescript-eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `eslint-plugin-tailwindcss`
- `eslint-plugin-storybook`

**NOT `.eslintrc.js`** - ESLint 9 uses flat config!

---

## 🎨 Code Formatting

### Prettier

**Version**: ^3.4.0  
**Plugin**: `prettier-plugin-tailwindcss`

---

## 📦 Package Manager

### npm

**Version**: Latest  
**Alternative**: pnpm, yarn (but npm is default)

---

## 🤖 MCP Servers (Claude Code Integration)

### @playwright

**Purpose**: E2E testing, UI automation  
**Access**: Via `test-runner-fixer`, `ux-optimization-specialist`

### @shadcn

**Purpose**: shadcn/ui component documentation  
**Access**: Via `ui-design-specialist`  
**Commands**:

- `getComponents()` - List all components
- `getComponent(name)` - Get component docs

### @context7

**Purpose**: Library documentation lookup  
**Access**: Via `debug-specialist`  
**Use for**: Recharts, Framer Motion, date-fns docs

### @storybook (optional)

**Purpose**: Component index from Storybook  
**Requires**: `npm run build-storybook` first

### @vite

**Purpose**: Dev server integration  
**Plugin**: `vite-plugin-mcp` (auto-integrated)

---

## 📚 Utility Libraries

### Date Handling: date-fns

**Version**: ^4.1.0  
**Why**: Modern, tree-shakeable  
**Use for**: Activity timeline formatting

### Number Formatting: Intl.NumberFormat

**Built-in**: Yes (no library needed!)  
**Use for**: Stars, commits (1234 → "1.2K")

### PDF Export: jsPDF + html2canvas

**Versions**: ^2.5.1, ^1.4.1  
**Use for**: Export modal content to PDF

---

## 🚫 NOT Used (Avoid)

❌ **Next.js** - This is a Vite project  
❌ **Create React App** - Deprecated  
❌ **Emotion/Styled Components** - Using Tailwind  
❌ **Redux** - Using React Context + Apollo cache  
❌ **Moment.js** - Using date-fns v4  
❌ **numeral** - Using built-in Intl.NumberFormat  
❌ **Lodash** - Using native JS methods  
❌ **localStorage** - Not supported in Claude.ai artifacts

---

## 📊 Bundle Size Targets

| Category        | Target  | Actual |
| --------------- | ------- | ------ |
| Initial JS      | < 200KB | TBD    |
| Initial CSS     | < 50KB  | TBD    |
| Recharts (lazy) | < 100KB | ~80KB  |
| Framer Motion   | < 50KB  | ~40KB  |
| Total (gzipped) | < 300KB | TBD    |

---

## 🔗 Quick Links

### Official Docs

- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vite.dev)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

### Internal Docs

- [MCP Integration Details](../specs/mcp-integration.md)
- [Setup Guide](../guides/phase-1-setup.md)
- [Testing Guide](../guides/testing-guide.md)

---

## 📝 Quick Commands

```bash
# Development
npm run dev              # Start Vite dev server (port 5173)
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test             # Run Vitest unit tests
npm run test:ui          # Vitest UI
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Playwright UI mode

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Run Prettier

# Storybook (optional)
npm run storybook        # Start Storybook
npm run build-storybook  # Build for MCP integration
```

---

**For setup instructions**: See `guides/phase-1-setup.md`
