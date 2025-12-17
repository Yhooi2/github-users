# shadcn-glass-ui - Quick Reference (v2.1.4)

> **Версия**: 2.1.4
> **Дата обновления**: 17 декабря 2025
> **Совместимость**: React 19 + TypeScript 5.x + Tailwind 4
> **Context7 ID**: `/yhooi2/shadcn-glass-ui-library`

---

## Установка

```bash
npm install shadcn-glass-ui
```

```tsx
// src/index.css
@import "shadcn-glass-ui/dist/styles.css";

// src/main.tsx
import { ThemeProvider } from 'shadcn-glass-ui';

<ThemeProvider defaultTheme="glass">
  <App />
</ThemeProvider>
```

---

## 🆕 Что нового в v2.0-2.1.4

```
✅ SparklineGlass - компонент добавлен
✅ InsightCardGlass - компонент добавлен
✅ YearCardGlass - расширен (sparklineData, insights)
✅ MetricCardGlass - расширен (sparklineData support)
✅ StepperGlass - новый компонент (wizard patterns)
✅ SplitLayoutGlass - ДОБАВЛЕН в v2.1.4! ← NEW
✅ AICardGlass - для AI analytics ← NEW
✅ 3-layer token system (225 OKLCH primitives)
✅ Context7 integration (1243 snippets, 41 rules)
✅ EXPORTS_MAP.json (AI-friendly)
✅ 1,500+ tests (visual regression)
```

---

## Component Mapping (100% покрытие)

### Базовые UI компоненты

| Проект    | Glass UI      | Совместимость | Примечания             |
| --------- | ------------- | ------------- | ---------------------- |
| Button    | ButtonGlass   | ✅ 100%       | asChild, loading, icon |
| Input     | InputGlass    | ✅ 100%       | error/success states   |
| Card      | GlassCard     | ✅ 100%       | 3 intensities          |
| Badge     | BadgeGlass    | ✅ 100%       | 7 variants             |
| Dialog    | ModalGlass    | ✅ 100%       | Compound API           |
| Sheet     | ModalGlass    | ✅ 100%       | Responsive             |
| Tabs      | TabsGlass     | ✅ 100%       | Compound API           |
| Tooltip   | TooltipGlass  | ✅ 100%       | Radix UI               |
| Alert     | AlertGlass    | ✅ 100%       | 4 variants             |
| Avatar    | AvatarGlass   | ✅ 100%       | Status indicator       |
| Progress  | ProgressGlass | ✅ 100%       | Gradient variants      |
| Skeleton  | SkeletonGlass | ✅ 100%       | 3 variants             |
| Checkbox  | CheckboxGlass | ✅ 100%       | Glow effect            |
| Switch    | ToggleGlass   | ✅ 100%       | Switch variant         |
| Slider    | SliderGlass   | ✅ 100%       | Single/range           |
| Select    | ComboBoxGlass | ✅ 100%       | Searchable             |
| Dropdown  | DropdownGlass | ✅ 100%       | Submenu                |
| HoverCard | PopoverGlass  | ✅ 100%       | Trigger+content        |

### Timeline компоненты

| Проект                 | Glass UI                | Props                                                              | Готовность |
| ---------------------- | ----------------------- | ------------------------------------------------------------------ | ---------- |
| **YearCard**           | **YearCardGlass**       | year, emoji, label, commits, progress, sparklineData✨, insights✨ | ✅ 100%    |
| **MiniActivityChart**  | **SparklineGlass** ✨   | data, labels, showLabels, highlightMax, height, gap                | ✅ 100%    |
| **YearInsight**        | **InsightCardGlass** ✨ | emoji, text, detail, variant (7 типов), displayMode                | ✅ 100%    |
| **YearBadge**          | **BadgeGlass**          | 7 variants                                                         | ✅ 95%     |
| **ActivityTimelineV2** | **CareerStatsGlass**    | timeline, username                                                 | ✅ 90%     |

### Assessment компоненты

| Проект                     | Glass UI                | Props                                                  | Готовность |
| -------------------------- | ----------------------- | ------------------------------------------------------ | ---------- |
| **MetricCard**             | **MetricCardGlass**     | label, value, change, trend, progress, sparklineData✨ | ✅ 100%    |
| **CircularMetric**         | **CircularMetricGlass** | label, value, color, size                              | ✅ 100%    |
| **MetricCategoryCard**     | GlassCard + grid        | -                                                      | ✅ 95%     |
| **MetricRowCompact**       | **StatItemGlass**       | label, value, icon                                     | ✅ 100%    |
| **MetricExplanationModal** | **ModalGlass**          | Responsive                                             | ✅ 100%    |

### User компоненты

| Проект          | Glass UI               | Готовность |
| --------------- | ---------------------- | ---------- |
| **UserHeader**  | **ProfileHeaderGlass** | ✅ 95%     |
| **UserStats**   | **UserStatsLineGlass** | ✅ 100%    |
| **SearchForm**  | **SearchBoxGlass**     | ✅ 100%    |
| **ThemeToggle** | **ThemeToggleGlass**   | ✅ 100%    |

### Project компоненты

| Проект                    | Glass UI                             | Готовность |
| ------------------------- | ------------------------------------ | ---------- |
| **CompactProjectRow**     | **RepositoryCardGlass** (compact)    | ✅ 90%     |
| **ExpandableProjectCard** | **RepositoryCardGlass** (expandable) | ✅ 95%     |
| **ProjectAnalyticsModal** | **ModalGlass** + **TabsGlass**       | ✅ 95%     |
| **HorizontalLanguageBar** | **LanguageBarGlass**                 | ✅ 100%    |
| **ActivityStatusDot**     | **StatusIndicatorGlass**             | ✅ 100%    |

---

## Критические компоненты (детально)

### ✅ SparklineGlass (v2.0+)

```typescript
interface SparklineGlassProps {
  readonly data: readonly number[]; // [10, 25, 45, 80, ...]
  readonly labels?: readonly string[]; // ['Я', 'Ф', 'М', ...]
  readonly showLabels?: boolean;
  readonly highlightMax?: boolean;
  readonly barColor?: string;
  readonly maxBarColor?: string;
  readonly height?: "sm" | "md" | "lg"; // 16/24/32px
  readonly gap?: "none" | "sm" | "md"; // 0/1/2px
  readonly animated?: boolean;
}
```

**Использование:**

```tsx
<SparklineGlass
  data={year.monthlyContributions.map((m) => m.contributions)}
  labels={["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"]}
  showLabels
  highlightMax
  height="md"
/>
```

### ✅ InsightCardGlass (v2.0+)

```typescript
interface InsightCardGlassProps {
  readonly emoji?: string; // default: "💡"
  readonly text: string;
  readonly detail?: string;
  readonly variant?: InsightVariant;
  readonly displayMode?: "inline" | "card";
  readonly onClick?: () => void;
  readonly showArrow?: boolean;
  readonly animated?: boolean;
}

type InsightVariant =
  | "default" // 💡 нейтральный
  | "tip" // 💡 подсказка
  | "highlight" // ✨ достижение
  | "warning" // ⚠️ предупреждение
  | "stat" // 📊 статистика
  | "growth" // 📈 рост
  | "decline"; // 📉 спад
```

**Использование:**

```tsx
<InsightCardGlass
  variant="growth"
  emoji="📈"
  text="Лучший месяц: Апрель"
  detail="156 коммитов - в 2.5 раза выше среднего"
/>
```

### ✅ YearCardGlass (v2.0+ расширен)

```typescript
interface YearCardGlassProps {
  // Базовые
  readonly year: string | number;
  readonly emoji: string;
  readonly label: string;
  readonly commits: string;
  readonly progress: number;
  readonly isExpanded?: boolean;
  readonly gradient?: ProgressGradient;
  readonly prs?: number;
  readonly repos?: number;
  readonly onShowYear?: () => void;

  // ✨ НОВЫЕ в v2.0
  readonly sparklineData?: readonly number[]; // ← месячная активность
  readonly sparklineLabels?: readonly string[];
  readonly insights?: readonly YearCardGlassInsight[];
  readonly stats?: readonly YearCardGlassStat[];
  readonly actionLabel?: string;
  readonly showSparklineCollapsed?: boolean;
}

interface YearCardGlassInsight {
  readonly variant?: InsightVariant;
  readonly emoji?: string;
  readonly text: string;
  readonly detail?: string;
}
```

**Использование:**

```tsx
<YearCardGlass
  year={2024}
  emoji="🔥"
  label="Самый продуктивный"
  commits="629"
  progress={85}
  prs={43}
  repos={5}
  sparklineData={[10, 25, 45, 156, 80, 60, 70, 55, 90, 50, 35, 28]}
  sparklineLabels={["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"]}
  insights={[
    {
      variant: "growth",
      emoji: "💡",
      text: "Лучший месяц: Апрель",
      detail: "156 коммитов",
    },
  ]}
  isExpanded={isSelected}
/>
```

### ✅ MetricCardGlass (v2.0+ расширен)

```typescript
interface MetricCardGlassProps {
  readonly label: string;
  readonly value: number | string;
  readonly change?: number; // Процент изменения
  readonly trend?: "up" | "down" | "neutral";
  readonly progress?: number; // 0-100
  readonly color?: MetricColor; // emerald, amber, blue, red
  readonly sparklineData?: readonly number[]; // ✨ v2.0
  readonly onClick?: () => void;
}
```

---

## Новые компоненты v2.1.4

### ✅ SplitLayoutGlass (ДОБАВЛЕН!)

**Статус**: Готов в v2.1.4

```tsx
<SplitLayoutGlass
  sidebar={<YearCardsList years={years} />}
  main={<YearDetailPanel year={selectedYear} />}
  sidebarWidth="33%"
  gap="md"
  stickyHeader
  responsive
/>
```

> **Примечание**: Context7 индекс ещё не обновлён для этого компонента.

### ✅ StepperGlass

**Статус**: Готов в v2.1

```tsx
<StepperGlass.Root currentStep={2} orientation="horizontal">
  <StepperGlass.Step step={1} status="completed">
    <StepperGlass.Indicator />
    <StepperGlass.Title>Choose Plan</StepperGlass.Title>
  </StepperGlass.Step>
</StepperGlass.Root>
```

### ✅ AICardGlass (для AI Analytics)

**Статус**: Готов

```tsx
<AICardGlass
  title="AI Analysis"
  status={analysisStatus}
  progress={loadingProgress}
  result={analysisResult}
  onRetry={handleRetry}
/>
```

---

## Theming

```tsx
// 3 темы: glass (dark), light, aurora
<ThemeProvider defaultTheme="glass">
  <App />
</ThemeProvider>;

// Использование хука
const { theme, setTheme } = useTheme();
setTheme("aurora");
```

---

## Design Tokens (v2.0)

### 3-Layer System

```
PRIMITIVE (225 tokens)
├── oklch-primitives.css
│   ├── Colors: oklch-neutral-*, oklch-primary-*, oklch-success-*
│   ├── Blur: blur-{subtle|medium|heavy|extreme}
│   ├── Radius: radius-{xs|sm|md|lg|xl|2xl|full}
│   └── Spacing: space-{0.5|1|2|...}
│
SEMANTIC (mapping)
├── semantic.css
│   ├── --semantic-bg-primary
│   ├── --semantic-text-primary
│   └── --semantic-border-default
│
COMPONENT (auto-inherit)
└── component.css
    ├── --button-bg: var(--semantic-surface-interactive)
    └── --button-text: var(--semantic-text-on-surface)
```

### Основные токены

```css
/* Glass surfaces */
--glass-frost-20: oklch(1 0 0 / 60%);
--glass-blur-medium: 16px;
--glass-radius-md: 16px;

/* Glow effects */
--glass-glow-primary: 0 0 20px oklch(0.6 0.2 250 / 40%);
--glass-glow-success: 0 0 20px oklch(0.65 0.18 145 / 40%);
```

---

## Migration Priority

### Этап 1: Base UI (2-3 дня)

Button, Input, Card, Badge, Dialog, Tabs, Tooltip, etc.

### Этап 2: Timeline (3-4 дня)

YearCard → YearCardGlass (со sparklineData, insights)
MiniActivityChart → SparklineGlass
YearInsight → InsightCardGlass

### Этап 3: Assessment (2-3 дня)

MetricCard → MetricCardGlass (со sparklineData)
CircularMetric → CircularMetricGlass

### Этап 4: User & Projects (2-3 дня)

UserHeader → ProfileHeaderGlass
ExpandableProjectCard → RepositoryCardGlass

### Этап 5: Финализация (2-3 дня)

Тесты, Stories, Accessibility, Performance

**Общее время**: 11-16 дней

---

## Context7 MCP Usage

```typescript
// Поиск библиотеки
mcp__context7__resolve_library_id({ libraryName: "shadcn-glass-ui" });
// → /yhooi2/shadcn-glass-ui-library

// Получение документации
mcp__context7__get_library_docs({
  context7CompatibleLibraryID: "/yhooi2/shadcn-glass-ui-library",
  topic: "ButtonGlass variants",
  mode: "code",
});
```

**Stats**: 1243 snippets | 41 rules | Score: 77.6/100

---

## Links

- 📘 [Полный аудит](../../docs/GLASS_UI_LIBRARY_AUDIT_V2.md)
- 📦 [NPM](https://www.npmjs.com/package/shadcn-glass-ui)
- 🐙 [GitHub](https://github.com/Yhooi2/shadcn-glass-ui-library)
- 📚 [Storybook](https://yhooi2.github.io/shadcn-glass-ui-library)
- 🧠 [Context7](https://github.com/yhooi2/shadcn-glass-ui-library/blob/main/context7.json)

---

## Compatibility Check

| Технология   | Библиотека     | Проект | Status |
| ------------ | -------------- | ------ | ------ |
| React        | 18.0+ or 19.0+ | 19.2.0 | ✅     |
| TypeScript   | 5.x            | 5.8.3  | ✅     |
| Tailwind CSS | 4.0+           | 4.1.12 | ✅     |
| Vite         | 7.x            | 7.1.2  | ✅     |
| Storybook    | 10.x           | 10.1.5 | ✅     |

**Вердикт**: 🎉 **100% совместимость - готов к миграции!**
