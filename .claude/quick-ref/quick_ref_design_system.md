# Design System - Quick Reference

> **Glassmorphism UI Kit для GitHub Analytics**
> **Статус:** Production Ready | 22 компонента | 3 темы | 100% покрытие тестами

---

## Обзор

Дизайн-система построена на принципах glassmorphism с тремя темами:
- **Light** — светлая тема с мягкими градиентами
- **Aurora** — тёмная тема с северным сиянием
- **Glass** — основная glassmorphism тема с матовым стеклом

### Расположение файлов

```
docs/design_system/
├── *.tsx                    # 22 компонента
├── index.ts                 # Экспорты
├── stories/
│   ├── *.stories.tsx        # 22 Storybook stories
│   └── visual-tests/        # 23 visual test stories
├── __tests__/
│   └── *.test.tsx           # 23 unit test файла (218 тестов)
└── preview.tsx              # Storybook preview config
```

---

## Компоненты UI Kit (22 шт.)

### Core Components

| Компонент | Описание | Props |
|-----------|----------|-------|
| `GlassCard` | Основа - стеклянная карточка | `intensity`, `glow`, `className` |
| `GlassButton` | Кнопка | `variant`, `icon`, `loading`, `disabled` |
| `GlassProgress` | Прогресс-бар | `value`, `gradient`, `showValue` |
| `GlassBadge` | Бейдж/тег | `variant` (default/success/warning/danger/primary/violet) |
| `GlassInput` | Поле ввода | `icon`, `placeholder`, `value`, `onChange` |
| `GlassToggle` | Переключатель | `checked`, `onChange`, `disabled` |
| `GlassSelect` | Выпадающий список | `value`, `options`, `onChange` |

### Status & Metrics

| Компонент | Описание | Props |
|-----------|----------|-------|
| `StatusIndicator` | Индикатор статуса (точка) | `type` (green/yellow/red) |
| `MetricCard` | Карточка метрики | `label`, `value`, `variant` |
| `LanguageBar` | Полоса языков | `languages` |
| `Avatar` | Аватар пользователя | `initials`, `size`, `online`, `gradient` |
| `Alert` | Уведомление | `variant`, `title`, `children` |

### Desktop Components

| Компонент | Описание | Props |
|-----------|----------|-------|
| `SearchBar` | Поиск | `value`, `placeholder`, `onChange` |
| `TabToggle` | Переключатель табов | `tabs`, `activeTab`, `onChange` |
| `YearCard` | Карточка года | `year`, `commits`, `progress`, `isPeak` |
| `RepoCard` | Карточка репозитория | `repo`, `expanded` |
| `AIInsightsCard` | AI-инсайты | — |
| `FlagAlert` | Флаг-предупреждение | `type`, `title`, `description` |
| `IconButton` | Кнопка-иконка | `icon`, `onClick` |

### Layout

| Компонент | Описание | Props |
|-----------|----------|-------|
| `Background` | Фон с градиентом и орбами | `children`, `className` |
| `Header` | Шапка приложения | `title`, `icon`, `leftContent`, `rightContent` |
| `ThemeToggle` | Переключатель темы | `showLabel`, `className` |

---

## Темы

### ThemeProvider

```tsx
import { ThemeProvider, useTheme } from "../context/ThemeContext";

// Оборачиваем приложение
<ThemeProvider defaultTheme="glass">
  <App />
</ThemeProvider>

// Используем в компонентах
const { theme, setTheme } = useTheme();
```

### Типы тем

```typescript
type ThemeName = "light" | "aurora" | "glass";
```

### CSS переменные по темам

Каждая тема определяет ~170+ CSS переменных в `index.css`:

```css
/* Glass theme */
--glass-frost-10: rgba(255, 255, 255, 0.1);
--glass-blur-medium: 16px;
--glass-accent-primary: oklch(0.7 0.2 250);
--glass-text-primary: rgba(255, 255, 255, 0.95);
```

---

## Использование

### Базовый пример

```tsx
import {
  GlassCard,
  GlassButton,
  MetricCard,
  Background,
  ThemeProvider
} from "docs/design_system";

function App() {
  return (
    <ThemeProvider defaultTheme="glass">
      <Background>
        <GlassCard intensity="medium" glow="violet">
          <MetricCard label="Activity" value={84} variant="emerald" />
          <GlassButton variant="primary">View Details</GlassButton>
        </GlassCard>
      </Background>
    </ThemeProvider>
  );
}
```

### Интенсивность GlassCard

```tsx
<GlassCard intensity="subtle">  {/* 10% opacity, light blur */}
<GlassCard intensity="medium">  {/* 20% opacity, medium blur */}
<GlassCard intensity="strong">  {/* 30% opacity, heavy blur */}
```

### Glow эффекты

```tsx
<GlassCard glow="violet">   {/* Фиолетовое свечение */}
<GlassCard glow="emerald">  {/* Изумрудное свечение */}
<GlassCard glow="amber">    {/* Янтарное свечение */}
```

---

## Тестирование

### Unit Tests (218 тестов)

```bash
# Запуск тестов дизайн-системы
npm test -- --run docs/design_system/__tests__/

# Конкретный компонент
npm test -- --run docs/design_system/__tests__/GlassCard.test.tsx
```

### Visual Tests (Storybook)

```bash
# Сборка и запуск Storybook
npm run build-storybook
npm run storybook

# Навигация: Design System / Visual Tests
```

### Структура visual test story

```tsx
// ComponentName.visual.stories.tsx
import { AllThemesDecorator } from "./AllThemesDecorator";

export const AllThemes: Story = {
  render: () => (
    <AllThemesDecorator>
      {(theme) => <Component />}
    </AllThemesDecorator>
  ),
};
```

---

## Рефакторинг - Важные правила

### ✅ Безопасные изменения

1. **Внутренняя логика** — если не меняет визуал
2. **Оптимизация** — memo, useMemo, useCallback
3. **TypeScript типы** — строгая типизация
4. **Рефакторинг хуков** — useTheme, useThemeStyles

### ❌ Опасные изменения (требуют visual review)

1. **CSS классы** — любое изменение Tailwind классов
2. **Стили inline** — изменение style props
3. **CSS переменные** — изменение --glass-* токенов
4. **Градиенты** — любые изменения градиентов
5. **Размеры** — padding, margin, width, height
6. **Анимации** — timing, easing, transforms

### Процесс безопасного рефакторинга

1. **Перед изменениями:**
   ```bash
   npm run build-storybook
   # Сохранить скриншоты visual tests
   ```

2. **После изменений:**
   ```bash
   npm test -- --run docs/design_system/__tests__/
   npm run build-storybook
   # Сравнить скриншоты
   ```

3. **Chromatic (опционально):**
   ```bash
   npx chromatic --project-token=<TOKEN>
   ```

---

## Связанные документы

| Документ | Путь |
|----------|------|
| Design Tokens | `.claude/quick-ref/quick_ref_design_tokens.md` |
| Glassmorphism CSS | `.claude/quick-ref/quick_ref_glassmorphism.md` |
| Responsive Guide | `.claude/quick-ref/quick_ref_responsive.md` |
| 3 Levels Pattern | `.claude/quick-ref/quick_ref_3_levels.md` |
| Visual Testing Guide | `docs/design_system/stories/visual-tests/VisualTesting.mdx` |

---

## Статистика покрытия

| Тип | Количество | Покрытие |
|-----|------------|----------|
| Компоненты | 22 | — |
| Stories | 22 | 100% |
| Visual Tests | 23 | 100% |
| Unit Tests | 218 | 100% |

**Последнее обновление:** 2025-11-26
