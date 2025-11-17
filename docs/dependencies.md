# Зависимости проекта

> Полное руководство по зависимостям проекта git-user-info с описанием версий, назначения и ключевых особенностей

## Содержание

- [Основные зависимости (Production)](#основные-зависимости-production)
- [Зависимости разработки (Development)](#зависимости-разработки-development)
- [Ключевые особенности версий](#ключевые-особенности-версий)
- [Breaking Changes](#breaking-changes)
- [Рекомендации по обновлению](#рекомендации-по-обновлению)

---

## Основные зависимости (Production)

### Frontend Framework

#### React 19.2.0
**Назначение:** Основной UI фреймворк
**Документация:** https://react.dev/

**Используемые фичи:**
- Functional Components с хуками
- `useState` для локального состояния
- `useMemo` для мемоизации вычислений
- Concurrent Features (автоматически)

**Ключевые изменения в v19:**
- ✅ Новые хуки: `useOptimistic`, `use`
- ✅ Form Actions для упрощенной работы с формами
- ✅ Улучшенная обработка ошибок
- ⚠️ **Breaking:** Удален `defaultProps` для функциональных компонентов
- ⚠️ **Breaking:** Строгие правила для хуков
- ⚠️ **Breaking:** Изменено поведение `useEffect` cleanup

**Почему именно эта версия:**
React 19 — это последняя стабильная версия с улучшенной производительностью и новыми возможностями для оптимистичных UI обновлений.

---

### Build Tools & TypeScript

#### Vite 7.1.2
**Назначение:** Сборщик и dev-сервер
**Документация:** https://vite.dev/

**Используемые фичи:**
- Быстрый HMR (Hot Module Replacement)
- Плагины (React, Tailwind, MCP)
- TypeScript поддержка из коробки
- Оптимизация продакшн-билда

**Ключевые изменения в v7:**
- ✅ Улучшенный plugin API
- ✅ Поддержка environment-specific конфигов
- ✅ Встроенная поддержка MCP через плагины
- ✅ Быстрее cold start

**Конфигурация:** `vite.config.ts`

#### TypeScript 5.8.3
**Назначение:** Статическая типизация
**Документация:** https://www.typescriptlang.org/

**Используемые фичи:**
- Strict mode (полная проверка типов)
- Path aliases (`@/*` → `./src/*`)
- JSX/TSX поддержка
- Inference для типов

**Ключевые изменения в v5.8:**
- ✅ Улучшенная производительность
- ✅ Лучший type inference
- ✅ Более понятные сообщения об ошибках

**Конфигурация:** `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

---

### Styling & UI

#### Tailwind CSS 4.1.12
**Назначение:** Utility-first CSS фреймворк
**Документация:** https://tailwindcss.com/

**Используемые фичи:**
- Utility classes для быстрой стилизации
- Responsive design (breakpoints)
- Dark mode support через `next-themes`
- Custom theming

**⚠️ CRITICAL - Tailwind v4 Breaking Changes:**
- CSS-first конфигурация (больше нет `tailwind.config.js`)
- Новый синтаксис `@theme` для кастомизации
- Переименованы утилиты: `sm`→`xs` для shadows/radius/blur
- Border color по умолчанию: `currentColor` (было `gray-200`)
- Ring width по умолчанию: `1px` (было `3px`)

**См. также:** [docs/tailwind-v4-migration.md](./tailwind-v4-migration.md)

**Плагины:**
- `@tailwindcss/vite@4.1.12` - Vite интеграция
- `@tailwindcss/postcss@4.1.12` - PostCSS интеграция

#### shadcn/ui (Radix UI Primitives)
**Назначение:** Доступные UI компоненты
**Документация:** https://ui.shadcn.com/

**Установленные компоненты:**
- `@radix-ui/react-label@2.1.7` - Доступные лейблы
- `@radix-ui/react-slot@2.1.7` - Композиция компонентов

**Утилиты:**
- `class-variance-authority@0.7.1` - Управление вариантами классов
- `clsx@2.1.1` - Условные классы
- `tailwind-merge@3.3.1` - Merge конфликтующих Tailwind классов

#### Иконки и темы

- **lucide-react@0.540.0** - Иконки (SVG)
- **next-themes@0.4.6** - Dark/Light mode переключение

---

### Data Management

#### @apollo/client 3.14.0
**Назначение:** GraphQL клиент с кэшированием
**Документация:** https://www.apollographql.com/docs/react/

**Используемые фичи:**
- `useQuery` для получения данных
- `InMemoryCache` для автоматического кэширования
- Link chain: `errorLink` → `authLink` → `httpLink`
- Error handling с toast уведомлениями

**Ключевые изменения в v3.14:**
- ✅ Новые классы ошибок: `CombinedGraphQLErrors`, `ServerError`
- ✅ Статические `.is()` методы для проверки типов ошибок
- ✅ Улучшенная TypeScript поддержка
- ⚠️ **Deprecated:** `addTypename` опция в `MockedProvider` и `InMemoryCache`

**Наша реализация:**
- Custom hook: `useQueryUser`
- Error link с автоматической очисткой токена
- Auth link с Bearer token из env/localStorage

#### GraphQL 16.11.0
**Назначение:** GraphQL core library
**Документация:** https://graphql.org/

**Используется с:** Apollo Client для работы с GitHub GraphQL API

---

### Utilities

#### date-fns 4.1.0
**Назначение:** Работа с датами
**Документация:** https://date-fns.org/

**Используемые функции:**
- Date форматирование
- Date арифметика (для диапазонов)

**Примечание:** В проекте также используются нативные JavaScript Date API.

#### sonner 2.0.7
**Назначение:** Toast уведомления
**Документация:** https://sonner.emilkowal.ski/

**Используется для:**
- Уведомления об ошибках валидации
- GraphQL/Network ошибки из Apollo
- User feedback

---

## Зависимости разработки (Development)

### Testing Framework

#### Vitest 4.0.6
**Назначение:** Тестовый фреймворк (Vite-native)
**Документация:** https://vitest.dev/

**Установленные пакеты:**
- `vitest@4.0.6` - Основной пакет
- `@vitest/ui@4.0.6` - UI для интерактивного запуска тестов
- `@vitest/coverage-v8@4.0.6` - Coverage reporter (V8)

**Ключевые фичи v4:**
- ✅ Vite-native (использует ту же конфигурацию)
- ✅ Jest-compatible API
- ✅ Fast HMR для тестов
- ✅ Browser mode support
- ✅ Встроенный coverage (V8)

**Текущее покрытие:** 62/62 тестов проходят

#### Testing Library
**Назначение:** Утилиты для тестирования React компонентов

**Установленные пакеты:**
- `@testing-library/react@16.3.0` - React тестинг утилиты
- `@testing-library/jest-dom@6.9.1` - Custom matchers для DOM
- `@testing-library/user-event@14.6.1` - Симуляция пользовательских событий

**DOM Environments:**
- `happy-dom@20.0.10` - Легковесная DOM имплементация
- `jsdom@27.1.0` - Полная DOM имплементация

---

### E2E Testing

#### Playwright 1.56.1
**Назначение:** End-to-end тестирование
**Документация:** https://playwright.dev/

**Ключевые фичи:**
- ✅ Cross-browser (Chromium, Firefox, WebKit)
- ✅ Auto-wait механизмы
- ✅ Network interception
- ✅ Trace viewer
- ✅ Codegen для генерации тестов

**Установленные пакеты:**
- `@playwright/test@1.56.1` - Test runner
- `@playwright/experimental-ct-react@1.56.1` - Component testing

**Конфигурация:** `playwright.config.ts`

---

### Component Development

#### Storybook 10.0.3
**Назначение:** Интерактивная разработка компонентов
**Документация:** https://storybook.js.org/

**Установленные пакеты:**
- `storybook@10.0.3` - Core
- `@storybook/react@10.0.3` - React поддержка
- `@storybook/react-vite@10.0.3` - Vite builder
- `@storybook/addon-essentials@10.0.3` - Основные аддоны
- `@storybook/addon-interactions@10.0.3` - Тестирование взаимодействий
- `storybook-mcp@0.4.0` - MCP интеграция

**Ключевые фичи v10:**
- ✅ Vite builder по умолчанию
- ✅ Improved performance
- ✅ Component Story Format (CSF) 3
- ✅ Interaction testing

**Stories:** `src/components/**/*.stories.tsx`

---

### Code Quality

#### ESLint 9.33.0
**Назначение:** Линтер для JavaScript/TypeScript
**Документация:** https://eslint.org/

**Установленные плагины:**
- `@eslint/js@9.33.0` - Рекомендуемые правила
- `eslint-plugin-react-hooks@5.3.0` - React Hooks правила
- `eslint-plugin-react-refresh@0.5.1` - React Refresh валидация
- `typescript-eslint@8.28.0` - TypeScript поддержка
- `eslint-plugin-storybook@0.14.0` - Storybook rules

**Конфигурация:** `eslint.config.js` (Flat Config)

#### Prettier 3.6.2
**Назначение:** Code formatter
**Документация:** https://prettier.io/

**Установленные плагины:**
- `eslint-config-prettier@10.0.3` - Интеграция с ESLint
- `eslint-plugin-prettier@5.3.1` - Prettier как ESLint правило

**Конфигурация:** `.prettierrc`

---

### Build & Dev Tools

#### Vite Plugins

- `@vitejs/plugin-react@4.3.4` - React поддержка в Vite
- `vite-plugin-mcp@0.2.3` - MCP (Model Context Protocol) интеграция

#### Type Definitions

- `@types/node@22.13.7` - Node.js типы

---

## Ключевые особенности версий

### React 19 - Новые возможности

1. **useOptimistic Hook**
   ```typescript
   const [optimisticState, addOptimistic] = useOptimistic(state, updateFn)
   ```
   Для оптимистичных UI обновлений (пока не используется в проекте)

2. **use Hook**
   ```typescript
   const value = use(promise)
   const value = use(context)
   ```
   Универсальный хук для промисов и контекста

3. **Form Actions**
   Упрощенная работа с формами через `action` проп

**См. также:** [docs/react-19-features.md](./react-19-features.md)

---

### Tailwind CSS v4 - Критические изменения

**CSS-First конфигурация:**
```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
}
```

**Переименования:**
- `shadow-sm` → `shadow-xs`
- `rounded-sm` → `rounded-xs`
- `blur-sm` → `blur-xs`

**Изменения по умолчанию:**
- Border color: `currentColor` (было `#e5e7eb`)
- Ring width: `1px` (было `3px`)

**См. также:** [docs/tailwind-v4-migration.md](./tailwind-v4-migration.md)

---

### Apollo Client 3.14 - Новая обработка ошибок

**Новые классы ошибок:**
```typescript
import { ApolloError } from '@apollo/client'

// Новые static методы
if (ApolloError.is(error)) {
  // Это Apollo ошибка
}
```

**Типы ошибок:**
- `CombinedGraphQLErrors` - GraphQL ошибки с partial data
- `ServerError` - HTTP ошибки от сервера
- `ServerParseError` - Ошибки парсинга ответа
- `CombinedProtocolError` - Multipart/subscription ошибки

**См. также:** [docs/apollo-client-guide.md](./apollo-client-guide.md)

---

### Vitest 4 - Улучшения производительности

**Новые фичи:**
- ✅ Faster test execution
- ✅ Enhanced browser mode
- ✅ Better UI mode
- ✅ V8 coverage by default (был Istanbul)

**Конфигурация:**
```typescript
// vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  }
})
```

**См. также:** [docs/testing-guide.md](./testing-guide.md)

---

## Breaking Changes

### От предыдущих версий

#### React 18 → 19
- ❌ Удален `defaultProps` для функциональных компонентов
- ⚠️ Изменено поведение `useEffect` cleanup
- ⚠️ Строже правила хуков (нельзя вызывать в условиях)

#### Tailwind CSS 3 → 4
- ❌ Убран `tailwind.config.js` (CSS-first)
- ❌ Container больше не имеет `center`/`padding` опций
- ⚠️ Изменены дефолтные значения (border, ring)
- ⚠️ Переименованы многие утилиты

#### Vite 6 → 7
- ✅ В основном обратно совместимые изменения
- ⚠️ Новый plugin API (старый deprecated)

#### Apollo Client 3.11 → 3.14
- ⚠️ `addTypename` deprecated в `MockedProvider`
- ✅ Новые методы `.is()` для проверки ошибок

---

## Рекомендации по обновлению

### Стратегия обновления зависимостей

1. **Минорные обновления (безопасно)**
   ```bash
   npm update
   ```
   Обновляет патч и минорные версии в пределах semver

2. **Мажорные обновления (осторожно)**
   ```bash
   npm outdated  # Проверить устаревшие пакеты
   ```
   Требуют проверки breaking changes и тестирования

3. **Порядок обновления:**
   - Сначала dev dependencies (тесты укажут на проблемы)
   - Затем production dependencies
   - По одному пакету за раз для изоляции проблем

### Чек-лист перед обновлением

- [ ] Прочитать CHANGELOG пакета
- [ ] Проверить breaking changes
- [ ] Обновить документацию проекта
- [ ] Запустить все тесты: `npm test`
- [ ] Проверить E2E тесты: `npm run test:e2e`
- [ ] Проверить билд: `npm run build`
- [ ] Протестировать в dev режиме: `npm run dev`

### Известные совместимости

**Работает отлично:**
- ✅ React 19 + Vite 7
- ✅ TypeScript 5.8 + Vite 7
- ✅ Tailwind v4 + Vite plugin
- ✅ Apollo Client 3.14 + React 19
- ✅ Vitest 4 + Vite 7

**Требует внимания:**
- ⚠️ Tailwind v4 - проверить все utility классы
- ⚠️ Apollo Client - убрать `addTypename` из MockedProvider

---

## Дополнительная документация

- [Architecture Overview](./architecture.md) - Общая архитектура приложения
- [GraphQL API Reference](./api-reference.md) - Работа с GitHub API
- [Tailwind v4 Migration](./tailwind-v4-migration.md) - Миграция на Tailwind v4
- [Testing Guide](./testing-guide.md) - Стратегия тестирования
- [React 19 Features](./react-19-features.md) - Новые фичи React 19
- [Apollo Client Guide](./apollo-client-guide.md) - Работа с Apollo
- [Component Development](./component-development.md) - Разработка компонентов
- [TypeScript Guide](./typescript-guide.md) - TypeScript конфигурация

---

**Последнее обновление:** Ноябрь 2025
**Версия документа:** 1.0
