# 📋 MASTER PLAN: GitHub Profile Analyzer

## Navigation & Overview Document

---

## 📚 План разбит на следующие файлы:

### **PART 1: Research & Architecture**

`01-research-and-architecture.md`

- UX Research findings
- 3-Level Progressive Disclosure обоснование
- Сравнение подходов
- Best practices from Nielsen Norman Group, Decision Lab

### **PART 2: Level Specifications**

`02-level-specifications.md`

- Level 0: Ultra-Compact List (detailed specs)
- Level 1: Expandable Cards (detailed specs)
- Level 2: Modal with Vertical Tabs (detailed specs)
- Visual mockups and wireframes

### **PART 3: Responsive Design**

`03-responsive-design.md`

- Desktop (≥1440px): 33/67 split
- Tablet (768-1439px): Fixed minimum width
- Mobile (<768px): Accordion layout
- **CRITICAL**: All years expanded by default
- Breakpoint strategies

### **PART 4: Technology Stack**

`04-technology-stack.md`

- shadcn/ui components (полный список)
- MCP servers integration:
  - @playwright (testing)
  - @context7 (state management)
  - @graphiti-memory (personalization)
  - @vercel (deployment)
- React libraries (Recharts, etc.)

### **PART 5: Agents Configuration**

`05-agents-configuration.md`

- Custom project agents (4 existing)
- NEW agents (2 to create):
  - ui-design-specialist (with @shadcn MCP)
  - ux-optimization-specialist (with @playwright MCP)
- Agent usage workflows
- Agent task assignments

### **PART 6: Implementation TODO - Phase 1-3**

`06-implementation-phase-1-3.md`

- Phase 1: Level 0 (Compact List)
- Phase 2: Level 1 (Expandable Cards)
- Phase 3: Level 2 (Modal with Tabs)
- Detailed subtasks for each component

### **PART 7: Implementation TODO - Phase 4-6**

`07-implementation-phase-4-6.md`

- Phase 4: State Management
- Phase 5: Animations & Transitions
- Phase 6: Responsive Behavior

### **PART 8: Testing & Quality**

`08-testing-and-quality.md`

- Unit tests (Vitest)
- Integration tests
- E2E tests (Playwright)
- Visual regression (Chromatic/Storybook)
- Accessibility testing (WCAG 2.1 AA)

### **PART 9: Performance & Optimization**

`09-performance-optimization.md`

- Virtual scrolling (50+ projects)
- Lazy loading strategies
- Code splitting
- Memoization patterns
- Bundle size optimization

### **PART 10: Design System & Specs**

`10-design-system-specs.md`

- Color palette
- Typography scale
- Spacing system
- Component dimensions
- Animation timings
- Shadow and border specs

---

## 🚀 Quick Start Guide

### 1. Read in this order for implementation:

```
01 → 02 → 04 → 05 → 06 → 07 → 08
    ↓
   03 (reference for responsive)
   09 (reference for optimization)
   10 (reference for design specs)
```

### 2. Before starting development:

- [ ] Read **PART 1** (understand WHY 3 levels)
- [ ] Read **PART 2** (understand WHAT each level does)
- [ ] Read **PART 4** (setup technology stack)
- [ ] Read **PART 5** (configure agents)

### 3. During development:

- Follow **PART 6-7** TODO lists sequentially
- Reference **PART 3** for responsive behavior
- Reference **PART 10** for design specs
- Use **PART 5** agents for specific tasks

### 4. Before deployment:

- Complete **PART 8** testing checklist
- Apply **PART 9** optimizations
- Verify **PART 3** responsive breakpoints

---

## 🎯 Critical Decisions Summary

### ✅ APPROVED:

1. **3-Level Progressive Disclosure** (maximum допустимый)
2. **Modal без табов** — если контента мало (один скролл), табы только если много контента
3. **All Years COLLAPSED by Default** (на обеих платформах — mobile + desktop)
4. **shadcn/ui** для всех UI компонентов
5. **Расширять существующие компоненты** — НЕ создавать дубликаты (использовать `RepositoryCard` variants)
6. **Framer Motion** для smooth height animations
7. **Интуитивная навигация** — без явных подсказок, всё понятно сразу

### 📊 METRICS SYSTEM (5 метрик):

**Компактный вид в шапке профиля:**

```
Activity    Impact     Quality    Growth    Authenticity
  📊 89      🎯 76       ✓ 92      ↗ +45      🛡️ 88
```

- Только иконка + название + число
- Клик на любую → детали

**Desktop:** Клик → Dialog (Modal) с breakdown
**Mobile:** Клик → Sheet снизу на всю ширину (НЕ modal!)

**5 метрик:**
| Метрика | Иконка | Диапазон |
|---------|--------|----------|
| Activity | 📊 | 0-100 |
| Impact | 🎯 | 0-100 |
| Quality | ✓ | 0-100 |
| Growth | ↗ | -100 to +100 |
| Authenticity | 🛡️ | 0-100 |

**Authenticity breakdown (уже реализовано):**

- Originality (25 pts) — Оригинальные vs форки
- Activity (25 pts) — Частота коммитов
- Engagement (25 pts) — Stars, forks, watchers
- Code Ownership (25 pts) — Разнообразие языков

**Категории Authenticity:**

- High (80-100) — Genuine active developer
- Medium (60-79) — Moderate activity
- Low (40-59) — Limited original work
- Suspicious (0-39) — 🚨 Likely fake

### 🔧 RESPONSIVE STRATEGY:

- **Desktop (≥1440px)**: 33/67 split, timeline справа, **collapsed by default**
- **Tablet (768-1439px)**: Fixed 280px left, flexible right, **collapsed by default**
- **Mobile (<768px)**: Full-width accordion, **collapsed by default** (NOT "all expanded" — anti-pattern)

### 🤖 AGENT USAGE:

- **UI work**: ui-design-specialist + @shadcn MCP
- **UX work**: ux-optimization-specialist + @playwright MCP
- **Testing**: test-runner-fixer + @playwright MCP
- **Code review**: code-review-specialist

---

## 📊 Success Metrics (from Part 1)

### Level 0 (Baseline):

- ✅ 100% users see compact list
- ✅ Average scan time: 5-10 seconds
- ✅ Scroll depth: 50%+ reach bottom

### Level 1 (Interest):

- 🎯 40-60% users expand at least 1 card
- 🎯 Average cards expanded: 1.5-2.5
- 🎯 Time spent: 15-30 seconds

### Level 2 (Deep Engagement):

- 🎯 10-20% users open full analytics
- 🎯 Time in modal: 45+ seconds
- 🎯 PDF export rate: 5-10% of modal opens

---

## 🗂️ File Structure After Implementation

```
src/
├── components/
│   ├── ui/                    # shadcn components
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx         # NEW: для mobile Level 2
│   │   ├── tabs.tsx
│   │   ├── scroll-area.tsx
│   │   └── ...
│   │
│   ├── repository/           # РАСШИРЯЕМ существующие компоненты
│   │   ├── RepositoryCard.tsx        # variants: 'compact' | 'expanded' | 'minimal'
│   │   ├── RepositoryList.tsx        # container для Level 0-1
│   │   ├── RepositoryExpandedContent.tsx  # Level 1 content
│   │   └── ...
│   │
│   └── analytics/            # Level 2: Modals (без табов, один скролл)
│       ├── RepositoryModal.tsx       # Детали репозитория + Authenticity breakdown
│       └── AuthenticityModal.tsx     # Объяснение формул (клик на оценку в шапке)
│
├── hooks/
│   ├── useProgressiveDisclosure.ts
│   ├── useResponsive.ts
│   └── useProjectAnalytics.ts
│
├── lib/
│   ├── mcp/
│   │   ├── playwright-client.ts
│   │   ├── context7-client.ts
│   │   ├── graphiti-client.ts
│   │   └── vercel-client.ts
│   │
│   └── utils/
│       ├── project-sort.ts
│       ├── analytics-calculator.ts
│       └── pdf-export.ts
│
└── tests/
    ├── unit/
    │   ├── level-0/
    │   ├── level-1/
    │   └── level-2/
    ├── integration/
    └── e2e/
```

---

## 🎨 Visual Preview

```
FLOW: User Journey через 3 уровня

┌─────────────┐
│  Level 0    │  ← User lands here (все проекты видны)
│  Compact    │     Quick scan: 5-10 seconds
│  List       │
└──────┬──────┘
       │ Click project
       ↓
┌─────────────┐
│  Level 1    │  ← Inline expansion (can compare)
│  Expandable │     Medium detail
│  Card       │     Decision making: 15-30 seconds
└──────┬──────┘
       │ Click "View Full Analytics"
       ↓
┌─────────────┐
│  Level 2    │  ← Modal with vertical tabs
│  Full       │     Deep dive analytics
│  Analytics  │     Engagement: 45+ seconds
└─────────────┘
```

---

## 📝 Next Steps

1. **Начни с чтения PART 1** - понять обоснование решений
2. **Затем PART 2** - детальные спецификации каждого уровня
3. **Setup окружение** (PART 4) - установи shadcn, настрой MCP
4. **Создай агентов** (PART 5) - ui-design и ux-optimization
5. **Follow TODO** (PART 6-7) - последовательная реализация
6. **Test thoroughly** (PART 8) - качество на каждом этапе
7. **Optimize** (PART 9) - производительность в конце

---

## ⚠️ Critical Reminders

### MUST DO:

- ✅ Use shadcn/ui for ALL UI components
- ✅ **COLLAPSED by default** на обеих платформах (mobile + desktop)
- ✅ **5 метрик компактно** — иконка + название + число (в шапке профиля)
- ✅ **Desktop:** клик на метрику → Dialog (Modal) с breakdown
- ✅ **Mobile:** клик на метрику → Sheet снизу на всю ширину (НЕ modal!)
- ✅ **Расширять существующий `RepositoryCard`** через variants (НЕ дублировать компоненты)
- ✅ **Framer Motion** для height animations
- ✅ Use agents for specialized tasks
- ✅ Test with @playwright MCP
- ✅ Desktop: 33/67 split (≥1440px)

### NEVER DO:

- ❌ Skip accessibility testing
- ❌ Ignore responsive breakpoints
- ❌ Hardcode design values (use design system)
- ❌ Implement without agent assistance
- ❌ Deploy without E2E tests
- ❌ **Create duplicate components** (extend existing ones!)
- ❌ **"All expanded by default"** — это anti-pattern для accordion
- ❌ **Табы без необходимости** — если контент умещается в скролл, табы не нужны

---

**🎯 Цель**: Создать best-in-class progressive disclosure interface для GitHub profile анализа, используя современные инструменты (shadcn, MCP, agents) и следуя UX best practices.

**📅 Timeline**: Phased implementation (Phase 1-9), каждая фаза тестируется перед следующей.

**🤝 Team**: You + 6 specialized agents для максимальной эффективности!
