# Refactoring Guide - Design System

> **Руководство по безопасному рефакторингу дизайн-системы**
> **Цель:** Сохранить 100% визуальной идентичности при любых изменениях кода

---

## Принципы

1. **Визуал неприкосновенен** — любое визуальное изменение требует явного одобрения
2. **Тесты — источник истины** — 218 unit tests + 23 visual tests
3. **Три темы обязательны** — light, aurora, glass должны проверяться всегда
4. **Инкрементальные изменения** — маленькие коммиты, частые проверки

---

## Классификация изменений

### 🟢 Безопасные (не влияют на визуал)

| Тип | Пример | Проверка |
|-----|--------|----------|
| TypeScript типы | `interface Props {}` | `npm run build` |
| Мемоизация | `useMemo`, `useCallback`, `memo` | Unit tests |
| Рефакторинг хуков | Извлечение логики в хуки | Unit tests |
| Переименование | Внутренние переменные | Unit tests |
| Комментарии | JSDoc, TODO | — |

### 🟡 Требуют внимания (потенциально влияют)

| Тип | Пример | Проверка |
|-----|--------|----------|
| Props изменения | Добавление optional props | Visual + Unit |
| Условный рендер | `{condition && <Element />}` | Visual + Unit |
| Event handlers | `onClick`, `onChange` | Unit tests |
| Ref forwarding | `forwardRef` | Unit tests |

### 🔴 Опасные (явно влияют на визуал)

| Тип | Пример | Проверка |
|-----|--------|----------|
| CSS классы | `className="..."` | Visual tests! |
| Inline styles | `style={{ }}` | Visual tests! |
| CSS переменные | `var(--glass-*)` | Visual tests! |
| Градиенты | `linear-gradient()` | Visual tests! |
| Размеры | padding, margin, width | Visual tests! |
| Анимации | duration, easing | Visual tests! |
| Цвета | oklch, rgba, hsl | Visual tests! |

---

## Workflow

### Шаг 1: Подготовка

```bash
# Убедиться что все тесты проходят
npm test -- --run docs/design_system/__tests__/

# Собрать Storybook как baseline
npm run build-storybook

# (Рекомендуется) Создать Chromatic baseline
npx chromatic --auto-accept-changes
```

### Шаг 2: Внесение изменений

1. **Один компонент за раз** — не рефакторить несколько компонентов одновременно
2. **Маленькие коммиты** — легче откатить если что-то сломается
3. **Документировать** — комментарии о причинах изменений

### Шаг 3: Проверка

```bash
# После каждого изменения
npm test -- --run docs/design_system/__tests__/ComponentName.test.tsx

# После завершения компонента
npm test -- --run docs/design_system/__tests__/

# Visual проверка
npm run build-storybook && npm run storybook
# Открыть: Design System / Visual Tests / Complete Overview
```

### Шаг 4: Коммит

```bash
git add docs/design_system/ComponentName.tsx
git commit -m "refactor(ComponentName): описание изменений"
```

---

## Чеклист перед рефакторингом

### Компонент

- [ ] Прочитать текущий код компонента
- [ ] Изучить его stories
- [ ] Изучить его visual test
- [ ] Изучить его unit tests
- [ ] Понять зависимости от других компонентов

### Тесты

- [ ] Все 218 unit tests проходят
- [ ] Storybook собирается без ошибок
- [ ] Visual tests показывают ожидаемый результат

### После изменений

- [ ] Unit tests компонента проходят
- [ ] Все 218 unit tests проходят
- [ ] Visual test компонента не изменился
- [ ] Complete Overview показывает корректный визуал

---

## Типичные ошибки

### ❌ Изменение порядка CSS классов

```tsx
// До
className="flex items-center gap-2 p-4"

// После (ПЛОХО - может изменить специфичность)
className="p-4 flex gap-2 items-center"
```

**Решение:** Сохранять порядок классов если нет явной причины менять.

### ❌ Замена CSS переменных на константы

```tsx
// До
style={{ color: 'var(--glass-text-primary)' }}

// После (ПЛОХО - потеряна тема)
style={{ color: 'rgba(255,255,255,0.95)' }}
```

**Решение:** Всегда использовать CSS переменные для цветов.

### ❌ Удаление "лишних" классов

```tsx
// До
<div className="relative z-10 flex items-center">

// После (ПЛОХО - z-10 нужен для layering)
<div className="flex items-center">
```

**Решение:** Не удалять классы без понимания их назначения.

### ❌ Изменение структуры DOM

```tsx
// До
<div className="wrapper">
  <span>{text}</span>
</div>

// После (ПЛОХО - может сломать селекторы тестов)
<span className="wrapper">{text}</span>
```

**Решение:** Сохранять структуру DOM если это не явная цель рефакторинга.

---

## Сценарии рефакторинга

### Сценарий 1: Добавление TypeScript типов

```tsx
// До
function GlassCard({ intensity, glow, children, className }) {

// После
interface GlassCardProps {
  intensity?: 'subtle' | 'medium' | 'strong';
  glow?: 'violet' | 'emerald' | 'amber';
  children: React.ReactNode;
  className?: string;
}

function GlassCard({ intensity, glow, children, className }: GlassCardProps) {
```

**Проверка:** `npm run build` + unit tests

### Сценарий 2: Извлечение хука

```tsx
// До (в компоненте)
const { theme } = useTheme();
const styles = theme === 'glass' ? glassStyles : lightStyles;

// После (новый хук)
function useThemeStyles() {
  const { theme } = useTheme();
  return theme === 'glass' ? glassStyles : lightStyles;
}

// В компоненте
const styles = useThemeStyles();
```

**Проверка:** Unit tests + visual tests

### Сценарий 3: Оптимизация рендера

```tsx
// До
function GlassCard({ intensity, children }) {
  const styles = computeStyles(intensity);
  return <div style={styles}>{children}</div>;
}

// После
const GlassCard = memo(function GlassCard({ intensity, children }) {
  const styles = useMemo(() => computeStyles(intensity), [intensity]);
  return <div style={styles}>{children}</div>;
});
```

**Проверка:** Unit tests (визуал не должен измениться)

---

## Инструменты

### VS Code

```json
// settings.json
{
  "editor.formatOnSave": true,
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Git hooks (рекомендуется)

```bash
# pre-commit
npm test -- --run docs/design_system/__tests__/ --silent
```

### Chromatic (visual regression)

```bash
# Установка
npm install --save-dev chromatic

# Запуск
npx chromatic --project-token=<TOKEN>
```

---

## Контакты

При вопросах о рефакторинге:
1. Проверить эту документацию
2. Посмотреть тесты компонента
3. Изучить visual story компонента

---

## Связанные документы

| Документ | Путь |
|----------|------|
| Design System | `.claude/quick-ref/quick_ref_design_system.md` |
| Visual Testing | `.claude/quick-ref/quick_ref_visual_testing.md` |
| Design Tokens | `.claude/quick-ref/quick_ref_design_tokens.md` |
| Glassmorphism | `.claude/quick-ref/quick_ref_glassmorphism.md` |

**Последнее обновление:** 2025-11-26
