# Visual Testing - Quick Reference

> **Визуальное тестирование дизайн-системы для защиты при рефакторинге**
> **Инструменты:** Storybook + Chromatic + Vitest

---

## Структура тестов

```
docs/design_system/
├── stories/
│   ├── *.stories.tsx              # 22 component stories
│   └── visual-tests/
│       ├── AllThemesDecorator.tsx # Утилита для всех тем
│       ├── VisualTesting.mdx      # Документация
│       └── *.visual.stories.tsx   # 23 visual test stories
└── __tests__/
    └── *.test.tsx                 # 23 unit test files (218 tests)
```

---

## Команды

### Unit Tests

```bash
# Все тесты дизайн-системы
npm test -- --run docs/design_system/__tests__/

# Конкретный компонент
npm test -- --run docs/design_system/__tests__/GlassCard.test.tsx

# С покрытием
npm test -- --run docs/design_system/__tests__/ --coverage
```

### Storybook

```bash
# Сборка (ОБЯЗАТЕЛЬНО перед запуском!)
npm run build-storybook

# Запуск
npm run storybook
# → http://localhost:6006

# Навигация в Storybook:
# Design System / Visual Tests / Complete Overview
```

### Chromatic (Visual Regression)

```bash
# Запуск visual regression тестов
npx chromatic --project-token=<YOUR_TOKEN>

# С baseline
npx chromatic --auto-accept-changes
```

---

## Visual Test Stories

### AllThemesDecorator

Утилита для рендеринга компонента во всех 3 темах:

```tsx
import { AllThemesDecorator } from "./AllThemesDecorator";

export const ComponentAllThemes: Story = {
  render: () => (
    <AllThemesDecorator>
      {(theme) => (
        <YourComponent prop={value} />
      )}
    </AllThemesDecorator>
  ),
};
```

### Паттерн visual story

```tsx
// ComponentName.visual.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Component } from "../../Component";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof Component> = {
  title: "Design System/Visual Tests/ComponentName",
  component: Component,
  parameters: {
    layout: "fullscreen",
    chromatic: {
      modes: {
        light: { theme: "light" },
        aurora: { theme: "aurora" },
        glass: { theme: "glass" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const themes: Theme[] = ["light", "aurora", "glass"];

export const AllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-2 text-xs font-bold uppercase text-white/50">
              Theme: {theme}
            </div>
            <Component />
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
```

---

## Покрытие компонентов

| Компонент | Story | Visual Test | Unit Tests |
|-----------|-------|-------------|------------|
| AIInsightsCard | ✅ | ✅ | 8 |
| Alert | ✅ | ✅ | 7 |
| Avatar | ✅ | ✅ | 8 |
| Background | ✅ | ✅ | 10 |
| FlagAlert | ✅ | ✅ | 9 |
| GlassBadge | ✅ | ✅ | 10 |
| GlassButton | ✅ | ✅ | 14 |
| GlassCard | ✅ | ✅ | 7 |
| GlassInput | ✅ | ✅ | 8 |
| GlassProgress | ✅ | ✅ | 11 |
| GlassSelect | ✅ | ✅ | 6 |
| GlassToggle | ✅ | ✅ | 9 |
| Header | ✅ | ✅ | 12 |
| IconButton | ✅ | ✅ | 8 |
| LanguageBar | ✅ | ✅ | 6 |
| MetricCard | ✅ | ✅ | 9 |
| RepoCard | ✅ | ✅ | 15 |
| SearchBar | ✅ | ✅ | 9 |
| StatusIndicator | ✅ | ✅ | 10 |
| TabToggle | ✅ | ✅ | 6 |
| ThemeToggle | ✅ | ✅ | 15 |
| YearCard | ✅ | ✅ | 9 |

**Итого:** 22 компонента, 22 stories, 23 visual tests, 218 unit tests

---

## Unit Test Паттерны

### renderWithTheme helper

```tsx
const renderWithTheme = (
  ui: React.ReactElement,
  theme: "light" | "aurora" | "glass" = "glass"
) => {
  return render(
    <ThemeProvider defaultTheme={theme}>{ui}</ThemeProvider>
  );
};
```

### Тесты по темам

```tsx
it("renders orbs in glass theme", () => {
  const { container } = renderWithTheme(
    <Background>Content</Background>,
    "glass"
  );
  const orbs = container.querySelectorAll(".blur-3xl");
  expect(orbs.length).toBe(5);
});

it("renders orbs in light theme", () => {
  const { container } = renderWithTheme(
    <Background>Content</Background>,
    "light"
  );
  const orbs = container.querySelectorAll(".blur-3xl");
  expect(orbs.length).toBe(4);
});
```

### Тесты стилей

```tsx
it("applies custom className", () => {
  const { container } = renderWithTheme(
    <GlassCard className="custom-class" />
  );
  expect(container.querySelector(".custom-class")).toBeInTheDocument();
});

it("has backdrop blur", () => {
  const { container } = renderWithTheme(<Header />);
  expect(container.querySelector(".backdrop-blur-xl")).toBeInTheDocument();
});
```

---

## Workflow рефакторинга

### 1. Перед изменениями

```bash
# Запустить все тесты
npm test -- --run docs/design_system/__tests__/

# Собрать Storybook
npm run build-storybook

# (Опционально) Сохранить baseline в Chromatic
npx chromatic --auto-accept-changes
```

### 2. Внести изменения

Следить за:
- CSS классами
- Inline стилями
- CSS переменными
- Градиентами и цветами
- Размерами и отступами

### 3. После изменений

```bash
# Unit тесты
npm test -- --run docs/design_system/__tests__/

# Visual тесты
npm run build-storybook
npm run storybook
# Визуально проверить: Design System / Visual Tests / Complete Overview

# (Опционально) Chromatic diff
npx chromatic
```

### 4. Если тесты падают

1. **Unit test fail** — исправить код или обновить тест
2. **Visual diff в Chromatic** — проверить изменения, approve или reject
3. **Storybook не рендерит** — проверить импорты и ThemeProvider

---

## Что тестируют visual tests

1. **Рендеринг во всех темах** — light, aurora, glass
2. **CSS классы** — backdrop-blur, rounded, shadow
3. **Градиенты и цвета** — через inline styles
4. **Интерактивные состояния** — hover, active, disabled
5. **Размеры и отступы** — padding, margin, gap
6. **Типографика** — font-size, font-weight

---

## Chromatic Configuration

В meta каждой visual story:

```tsx
parameters: {
  chromatic: {
    modes: {
      light: { theme: "light" },
      aurora: { theme: "aurora" },
      glass: { theme: "glass" },
    },
  },
},
```

---

## Связанные документы

- [Design System Quick Ref](.claude/quick-ref/quick_ref_design_system.md)
- [Design Tokens](.claude/quick-ref/quick_ref_design_tokens.md)
- [Glassmorphism](.claude/quick-ref/quick_ref_glassmorphism.md)

**Последнее обновление:** 2025-11-26
