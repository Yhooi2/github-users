# PART 4: Technology Stack

## Complete List of Tools, Libraries & MCP Servers

---

## 🎨 UI Framework: shadcn/ui

### Core Philosophy

> **"Copy and paste the code into your project"** - shadcn

- **Not an NPM package**: Components are copied to your project
- **Full control**: Modify any component as needed
- **Built on Radix UI**: Accessible primitives
- **Styled with Tailwind**: Utility-first CSS

### Installation

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Answer prompts:
# ✓ TypeScript: Yes
# ✓ Style: Default
# ✓ Base color: Slate
# ✓ CSS variables: Yes
# ✓ Import alias: @/components
```

### Required Components

```bash
# Core components (already needed)
npx shadcn@latest add card
npx shadcn@latest add button
npx shadcn@latest add badge
npx shadcn@latest add accordion

# New components for progressive disclosure
npx shadcn@latest add dialog       # Level 2 modal (desktop)
npx shadcn@latest add sheet        # Level 2 modal (mobile)
npx shadcn@latest add tabs         # Vertical tabs in modal
npx shadcn@latest add separator    # Section dividers
npx shadcn@latest add skeleton     # Loading states
npx shadcn@latest add scroll-area  # Smooth scrolling
npx shadcn@latest add progress     # Impact score visualization
npx shadcn@latest add tooltip      # Hover hints
npx shadcn@latest add hover-card   # Quick previews

# Data display
npx shadcn@latest add table        # For metrics tables
npx shadcn@latest add avatar       # For contributor avatars

# Optional (for future features)
npx shadcn@latest add dropdown-menu  # Sorting/filtering
npx shadcn@latest add select         # Dropdown selections
npx shadcn@latest add switch         # Toggle features
```

### Component Customization Example

```typescript
// components/ui/card.tsx (shadcn generated)
// We can modify this file directly

import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      // 🔥 Custom: Add hover effect for clickable cards
      "transition-all duration-200 hover:shadow-md",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

---

## 📊 Charts Library: Recharts

### Why Recharts?

- **React-friendly**: Built for React
- **Responsive**: Works on all devices
- **Accessible**: Good ARIA support
- **Customizable**: Easy styling

### Installation

```bash
npm install recharts
```

### Chart Types Used

#### 1. LineChart (Activity Timeline)

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={monthlyCommits}>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
    <XAxis
      dataKey="month"
      stroke="hsl(var(--muted-foreground))"
      fontSize={12}
    />
    <YAxis
      stroke="hsl(var(--muted-foreground))"
      fontSize={12}
    />
    <Tooltip
      contentStyle={{
        background: 'hsl(var(--popover))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '6px'
      }}
    />
    <Line
      type="monotone"
      dataKey="commits"
      stroke="hsl(var(--primary))"
      strokeWidth={2}
      dot={{ fill: 'hsl(var(--primary))' }}
    />
  </LineChart>
</ResponsiveContainer>
```

#### 2. PieChart (Language Breakdown)

```typescript
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  CSS: '#1572b6'
}

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={languages}
      dataKey="lines"
      nameKey="name"
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={80}
      paddingAngle={2}
    >
      {languages.map((entry) => (
        <Cell key={entry.name} fill={COLORS[entry.name]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

#### 3. BarChart (PR Size Distribution)

```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={200}>
  <BarChart data={prSizes}>
    <XAxis dataKey="size" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

---

## 🤖 MCP Servers Integration

### 1. **@playwright** MCP (Browser Automation & Testing)

**Purpose**: E2E testing, visual regression, UI interaction testing

#### Installation

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Configure MCP
# Add to .claude/mcp_servers.json
{
  "playwright": {
    "command": "npx",
    "args": ["@playwright/test"]
  }
}
```

#### Usage in Development

##### Test Progressive Disclosure Flow

```typescript
// tests/e2e/progressive-disclosure.spec.ts
import { test, expect } from "@playwright/test";

test("Level 0 → Level 1 → Level 2 flow", async ({ page }) => {
  await page.goto("http://localhost:5173"); // ✅ Vite порт, НЕ 3000

  // Level 0: Click first project
  await page.click('[data-testid="project-row-0"]');

  // Level 1: Verify expansion
  await expect(page.locator('[data-testid="expanded-card-0"]')).toBeVisible();

  // Level 1: Click "View Full Analytics"
  await page.click('[data-testid="view-analytics-btn"]');

  // Level 2: Verify modal opens
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  // Level 2: Navigate tabs
  await page.click('[data-testid="tab-timeline"]');
  await expect(page.locator('[data-testid="timeline-chart"]')).toBeVisible();

  // Screenshot for visual regression
  await page.screenshot({ path: "tests/screenshots/modal-timeline.png" });
});
```

##### Test Responsive Breakpoints

```typescript
test("Mobile accordion behavior", async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto("http://localhost:5173"); // ✅ Vite порт, НЕ 3000

  // Verify all years expanded by default
  const accordionItems = page.locator('[data-state="open"]');
  await expect(accordionItems).toHaveCount(3); // 2024, 2023, 2022

  // Click project on mobile
  await page.click('[data-testid="project-row-0"]');

  // Verify only one card expanded (accordion mode)
  const expandedCards = page.locator('[data-testid^="expanded-card"]');
  await expect(expandedCards).toHaveCount(1);
});
```

##### Agent Integration

```bash
# Use test-runner-fixer agent with Playwright
claude-code invoke test-runner-fixer "Run Playwright tests for Level 2 modal and fix any failures"

# Use ux-optimization-specialist with Playwright
claude-code invoke ux-optimization-specialist "Test expansion animation smoothness with Playwright"
```

---

### 2. **@context7** MCP (Library Documentation Lookup)

**Purpose**: Query up-to-date documentation for external libraries (Apollo, Recharts, date-fns, etc.)

> ⚠️ **ВАЖНО**: Context7 — это сервер для поиска документации по библиотекам

#### Usage via Claude Code MCP

```bash
# Найти ID библиотеки
mcp__context7__resolve-library-id("recharts")
# → /recharts/recharts

# Получить документацию по теме
mcp__context7__get-library-docs("/recharts/recharts", topic="LineChart")
```

#### Usage Patterns

##### Query Recharts Documentation

```typescript
// Перед реализацией графиков, запросите актуальную документацию:
// Claude Code → Context7 MCP → resolve-library-id("recharts")
// Claude Code → Context7 MCP → get-library-docs("/recharts/recharts", topic="LineChart")

// Пример результата — актуальные примеры использования LineChart
```

##### Query date-fns v4 Documentation

```typescript
// date-fns v4 изменил API, используйте Context7 для актуальной документации:
// Claude Code → Context7 MCP → resolve-library-id("date-fns")
// Claude Code → Context7 MCP → get-library-docs("/date-fns/date-fns", topic="format")
```

##### Query Framer Motion Documentation

```typescript
// Перед добавлением анимаций:
// Claude Code → Context7 MCP → resolve-library-id("framer-motion")
// Claude Code → Context7 MCP → get-library-docs("/framer/motion", topic="AnimatePresence")
```

#### When to Use

- Перед реализацией новых компонентов с внешними библиотеками
- При обновлении версий библиотек (проверить изменения API)
- Вместо web search для получения актуальной документации

---

### 3. **@graphiti-memory** MCP (Personalization & Memory)

**Purpose**: Remember user preferences, learn patterns, personalize experience

#### Installation

```bash
# Add to .claude/mcp_servers.json
{
  "graphiti-memory": {
    "command": "graphiti-server",
    "args": ["--memory-path", "./.graphiti"]
  }
}
```

#### Usage Patterns

##### Remember User Preferences

```typescript
// lib/mcp/graphiti-client.ts
import { GraphitiClient } from "@graphiti/sdk";

const graphiti = new GraphitiClient();

export async function saveUserPreference(key: string, value: any) {
  await graphiti.remember({
    type: "user-preference",
    key,
    value,
    timestamp: Date.now(),
  });
}

export async function getUserPreference(key: string) {
  const result = await graphiti.recall({
    type: "user-preference",
    key,
  });
  return result?.value;
}

// Usage: Remember last viewed tab
await saveUserPreference("last-modal-tab", "timeline");

// On modal open, restore last tab
const lastTab = await getUserPreference("last-modal-tab");
setActiveTab(lastTab || "overview");
```

##### Learn User Patterns

```typescript
export async function trackTabOpen(tabId: string, projectId: string) {
  await graphiti.learn({
    event: "tab-opened",
    data: {
      tab: tabId,
      project: projectId,
      timestamp: Date.now(),
    },
  });
}

export async function getMostViewedTabs() {
  const events = await graphiti.recall({
    event: "tab-opened",
    limit: 100,
  });

  // Analyze patterns
  const tabCounts = events.reduce((acc, e) => {
    acc[e.data.tab] = (acc[e.data.tab] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(tabCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([tab]) => tab);
}

// Usage: Reorder tabs based on user preference
const popularTabs = await getMostViewedTabs();
// Show popular tabs first in navigation
```

##### Recently Viewed Projects

```typescript
export async function trackProjectView(projectId: string) {
  await graphiti.remember({
    type: 'project-view',
    projectId,
    timestamp: Date.now()
  })
}

export async function getRecentlyViewedProjects(limit = 5) {
  const views = await graphiti.recall({
    type: 'project-view',
    limit: 20
  })

  // Deduplicate and sort by timestamp
  const unique = [...new Map(
    views.map(v => [v.projectId, v])
  ).values()]

  return unique
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
}

// Usage: Show "Recently Viewed" section
const recent = await getRecentlyViewedProjects()
<div className="recently-viewed">
  <h3>Recently Viewed</h3>
  {recent.map(project => <ProjectCard key={project.id} {...project} />)}
</div>
```

##### Agent Integration

```bash
# teaching-mentor uses Graphiti to track learning progress
claude-code invoke teaching-mentor "Use Graphiti to remember which UX patterns user has learned"
```

---

### 4. **@vercel** MCP (Deployment & Analytics)

**Purpose**: Deploy previews, production builds, track analytics

#### Installation

```bash
# Install Vercel CLI
npm install -g vercel

# Add to .claude/mcp_servers.json
{
  "vercel": {
    "command": "vercel",
    "env": {
      "VERCEL_TOKEN": "your-token"
    }
  }
}
```

#### Usage Patterns

##### Deploy Preview for Each PR

```bash
# Automatic via GitHub Actions
# .github/workflows/preview.yml
name: Deploy Preview
on:
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: vercel deploy --preview
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

##### Track Analytics

```typescript
// lib/analytics.ts
import { track } from '@vercel/analytics'

export function trackProgressiveDisclosure(level: number, projectId: string) {
  track('progressive-disclosure', {
    level,
    projectId,
    timestamp: Date.now()
  })
}

// Usage in components
function CompactProjectRow() {
  const handleClick = () => {
    trackProgressiveDisclosure(1, project.id)
    onExpand()
  }

  return <button onClick={handleClick}>...</button>
}
```

##### Agent Integration

```bash
# Deploy with vercel MCP
claude-code invoke general-purpose "Deploy preview to Vercel for Level 2 modal changes"

# Check deployment status
claude-code invoke statusline-setup "Check Vercel deployment status for PR #42"
```

---

## 🔧 Additional Libraries

### Animation: Framer Motion

```bash
npm install framer-motion
```

**Usage**: Modal animations, tab transitions

```typescript
import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <ProjectAnalyticsModal />
    </motion.div>
  )}
</AnimatePresence>
```

### Date Formatting: date-fns

```bash
npm install date-fns
```

**Usage**: Format dates in activity timeline

```typescript
import { format, formatDistanceToNow } from "date-fns";

// "2 days ago"
const relativeTime = formatDistanceToNow(lastCommitDate, { addSuffix: true });

// "Jan 15, 2024"
const formattedDate = format(commitDate, "MMM d, yyyy");
```

### Number Formatting: numeral

```bash
npm install numeral
```

**Usage**: Format stars, commits

```typescript
import numeral from "numeral";

// 1,234 → "1.2k"
const formatted = numeral(stars).format("0.[0]a");

// 12453 → "12,453"
const withCommas = numeral(lines).format("0,0");
```

### PDF Export: jsPDF + html2canvas

```bash
npm install jspdf html2canvas
```

**Usage**: Export modal content to PDF

```typescript
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

async function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId)
  if (!element) return

  // Capture as image
  const canvas = await html2canvas(element, {
    scale: 2,
    logging: false
  })

  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  })

  pdf.addImage(canvas, 'PNG', 0, 0, canvas.width, canvas.height)
  pdf.save(filename)
}

// Usage
<Button onClick={() => exportToPDF('modal-content', 'project-analytics.pdf')}>
  Export PDF
</Button>
```

---

## 📦 Complete package.json (актуальный стек проекта)

```json
{
  "name": "github-profile-analyzer",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    // ✅ Vite, НЕ Next.js!

    "@apollo/client": "^3.14.0",
    "graphql": "^16.10.0",

    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",

    "recharts": "^2.15.0",
    "framer-motion": "^11.0.0",
    "date-fns": "^4.1.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",

    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "@vitejs/plugin-react": "^5.0.0",

    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.8.0",

    "tailwindcss": "^4.1.0",
    "@tailwindcss/vite": "^4.1.0",
    // ✅ Tailwind v4 использует Vite plugin, НЕ PostCSS

    "@playwright/test": "^1.50.0",
    "vitest": "^4.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.0",

    "eslint": "^9.0.0",
    "prettier": "^3.4.0"
  }
}
```

**Примечание:** `numeral` не нужен — используйте встроенный `Intl.NumberFormat`:

```typescript
// Форматирование чисел без дополнительных библиотек
new Intl.NumberFormat("en", { notation: "compact" }).format(1234); // "1.2K"
new Intl.NumberFormat("en").format(12453); // "12,453"
```

---

## 🛠️ Development Tools

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-playwright.playwright",
    "dbaeumer.vscode-eslint",
    "usernamehw.errorlens",
    "formulahendry.auto-rename-tag"
  ]
}
```

### ESLint Configuration (Flat Config — ESLint 9)

```javascript
// eslint.config.js (НЕ .eslintrc.js — старый формат!)
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwindcss from "eslint-plugin-tailwindcss";
import storybook from "eslint-plugin-storybook";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      tailwindcss,
    },
    rules: {
      // Enforce accessibility
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",

      // Code quality
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  ...storybook.configs["flat/recommended"],
  prettier,
);
```

> ⚠️ **ВАЖНО**: Проект использует ESLint 9 с flat config формата. Старый `.eslintrc.js` НЕ поддерживается!

### Prettier Configuration

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## 🎯 Technology Stack Summary

| Category         | Tool                | Purpose             |
| ---------------- | ------------------- | ------------------- |
| **Build**        | Vite 7              | Fast dev server     |
| **UI Framework** | shadcn/ui           | Component library   |
| **Styling**      | Tailwind v4         | Utility-first CSS   |
| **GraphQL**      | Apollo Client       | Data fetching       |
| **Charts**       | Recharts            | Data visualization  |
| **Animation**    | Framer Motion       | Smooth transitions  |
| **Testing**      | Vitest + Playwright | Unit + E2E          |
| **Docs**         | Context7 MCP        | Library docs lookup |
| **Memory**       | Graphiti MCP        | Personalization     |
| **UI Docs**      | shadcn MCP          | Component docs      |
| **Components**   | Storybook MCP       | Component index     |
| **Deploy**       | Vercel MCP          | CI/CD               |

---

## 🔌 Additional MCP Servers (из CLAUDE.md)

### 5. **@shadcn** MCP (UI Component Documentation)

**Purpose**: Get shadcn/ui component documentation, variants, and examples

```bash
# Перед созданием UI компонентов:
mcp__shadcn__getComponents()      # список всех компонентов
mcp__shadcn__getComponent("tabs") # документация по компоненту
```

**When to Use**: ОБЯЗАТЕЛЬНО вызывать перед созданием или модификацией UI компонентов

---

### 6. **@storybook** MCP (Component Index)

**Purpose**: Index existing project components from Storybook

**Prerequisite**: `npm run build-storybook` before using

```bash
# После build-storybook доступны:
# - Список всех компонентов проекта
# - Их варианты и состояния
# - Примеры использования
```

**When to Use**: Перед созданием новых компонентов — проверить, существует ли похожий

---

### 7. **@vite** MCP (Development Server)

**Purpose**: Auto-integrated via `vite-plugin-mcp` — runs with dev server

**Features**:

- HMR integration
- Build analytics
- Dev server control

---

**Next**: Read [PART 5: Agents Configuration](part-5) for agent setup and
workflows.
