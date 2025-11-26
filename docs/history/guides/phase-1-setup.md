# Phase 1: Project Setup Guide

> **Purpose**: Step-by-step setup for Vite + React + shadcn/ui project  
> **Read this when**: Starting a new project or resetting environment  
> **For tech stack**: See `quick-ref/tech-stack.md`  
> **For responsive**: See `quick-ref/responsive-rules.md`

---

## 🎯 Overview

Эта фаза настраивает базовый проект: Vite, React 19, TypeScript, Tailwind, shadcn/ui и другие зависимости. Цель — рабочий dev server с базовыми компонентами.

**Time Estimate**: 30-60 minutes  
**Prerequisites**: Node.js ≥20, npm latest  
**Outcome**: `npm run dev` запускает app на http://localhost:5173

---

## 📋 Step-by-Step Instructions

### Step 1: Create Vite Project

```bash
npm create vite@latest git-user-info -- --template react-ts
cd git-user-info
npm install
```

- Выбери: React, TypeScript
- **Почему Vite?**: Fast HMR, лучше CRA (deprecated)

### Step 2: Install Core Dependencies

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Конфиг: `tailwind.config.js` — добавь content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']

Далее:

```bash
npm install framer-motion recharts @apollo/client graphql date-fns
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom playwright
```

- **Framer Motion**: Animations
- **Recharts**: Charts
- **Apollo**: GraphQL
- **date-fns**: Dates
- **Testing**: Vitest + Playwright

### Step 3: Initialize shadcn/ui

```bash
npx shadcn@latest init
```

- Prompts: TypeScript: Yes, Style: Default, Base: Slate, CSS vars: Yes, Alias: @/components

Установи компоненты:

```bash
npx shadcn@latest add card button badge scroll-area separator hover-card accordion dialog sheet tabs table progress skeleton tooltip avatar dropdown-menu
```

### Step 4: Configure ESLint & Prettier

```bash
npm install -D eslint@9 typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-tailwindcss prettier prettier-plugin-tailwindcss
```

- Создай `eslint.config.js` (flat config):

```javascript
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
// ... (см. quick-ref/tech-stack.md)
```

### Step 4: Configure TypeScript

- tsconfig.json: Enable "strict": true.
- Add ESLint rule: '@typescript-eslint/no-explicit-any': 'error' (запрет на `any`).
- Verification: Run `npm run lint` — no `any` should pass.

- `prettier.config.js`:

```javascript
module.exports = {
  semi: false,
  singleQuote: true,
  // ...
};
```

### Step 5: Setup Paths & Utils

- `tsconfig.json`: Добавь "paths": { "@/_": ["./src/_"] }

Создай `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Step 6: MCP Integration (Optional for Phase 1)

- Установи vite-plugin-mcp (если нужен)
- Конфиг в `vite.config.ts`

### Step 7: Run & Test Setup

```bash
npm run dev  # http://localhost:5173
npm run lint
npm run format
npm run test
```

- Добавь test: "vitest", test:e2e: "playwright test"

---

## 🧪 Verification Checklist

- [ ] Dev server runs without errors
- [ ] shadcn components importable (e.g., <Button />)
- [ ] Tailwind classes work (e.g., bg-primary)
- [ ] ESLint/Prettier fix on save (VSCode setup)
- [ ] No warnings in console

---

## 🔗 Related Docs

- **Tech Stack**: `quick-ref/tech-stack.md`
- **Testing Guide**: `guides/testing-guide.md`

---
