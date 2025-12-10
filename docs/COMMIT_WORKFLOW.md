# Commit Workflow Guide

## Быстрый старт

```bash
# 1. Внести изменения в код
# 2. Добавить файлы в staging
git add .

# 3. Запустить интерактивный коммит (РЕКОМЕНДУЕТСЯ)
npm run commit

# 4. Следовать инструкциям Commitizen
# 5. Push в remote
git push
```

## Автоматические проверки

### Pre-commit Hook (до коммита)

Когда вы делаете `git commit`, автоматически запускается:

1. **lint-staged** - проверяет только измененные файлы:
   - `*.{ts,tsx}` → ESLint с автофиксом + Prettier
   - `*.{json,md,css}` → Prettier

**Если проверка провалилась:**

```bash
# Исправить ошибки вручную или посмотреть, что именно не прошло
npm run lint

# После исправления повторить коммит
git add .
git commit
```

### Commit-msg Hook (валидация сообщения)

Проверяет формат сообщения коммита согласно [Conventional Commits](https://www.conventionalcommits.org/).

**Формат:**

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Два способа коммита

### 1. Интерактивный (рекомендуется) - Commitizen

```bash
npm run commit
```

**Что происходит:**

1. Выбор типа коммита (feat, fix, docs и т.д.)
2. Указание scope (опционально) - например, `ui`, `api`, `tests`
3. Короткое описание (imperative mood)
4. Длинное описание (опционально)
5. Breaking changes (опционально)
6. Связанные issues (опционально)

**Пример интерактивного процесса:**

```
? Select the type of change: feat
? What is the scope? ui
? Write a short description: add dark mode toggle
? Provide a longer description: (press enter to skip)
? Are there any breaking changes? No
? Does this change affect any open issues? No
```

**Результат:** `feat(ui): add dark mode toggle`

### 2. Ручной коммит

```bash
git commit -m "feat(ui): add dark mode toggle"

# С телом сообщения
git commit -m "feat(ui): add dark mode toggle" -m "Added ThemeToggle component with system preference detection"

# Breaking change
git commit -m "feat(api)!: change authentication flow" -m "BREAKING CHANGE: API now requires OAuth tokens"
```

## Типы коммитов

| Type           | Описание                        | Влияние на версию |
| -------------- | ------------------------------- | ----------------- |
| **feat**       | Новая функциональность          | MINOR (0.1.0)     |
| **fix**        | Исправление бага                | PATCH (0.0.1)     |
| **docs**       | Изменения в документации        | -                 |
| **style**      | Форматирование, отступы         | -                 |
| **refactor**   | Рефакторинг кода                | -                 |
| **perf**       | Улучшение производительности    | PATCH             |
| **test**       | Добавление/исправление тестов   | -                 |
| **build**      | Изменения в сборке/зависимостях | -                 |
| **ci**         | Изменения в CI/CD               | -                 |
| **chore**      | Рутинные задачи                 | -                 |
| **revert**     | Откат предыдущего коммита       | -                 |
| **!** (suffix) | Breaking change                 | MAJOR (1.0.0)     |

## Примеры хороших коммитов

### Feature

```bash
feat(timeline): add interactive year navigation
feat(auth): implement GitHub OAuth login
feat!: migrate to Apollo Client v4
```

### Fix

```bash
fix(ui): resolve modal scroll issue on mobile
fix(api): handle rate limit errors correctly
fix(tests): update snapshots after React 19 upgrade
```

### Documentation

```bash
docs: update commit workflow guide
docs(readme): add badges for CI/CD workflows
```

### Refactoring

```bash
refactor(hooks): extract useProgressiveDisclosure logic
refactor: simplify metric calculation algorithm
```

### Tests

```bash
test(tabs): add coverage for CodeTab component
test: increase coverage to 90%
```

### CI/CD

```bash
ci: add CodeQL security scanning workflow
ci: update GitHub Actions to v6
```

## Workflow после коммита

### 1. Push в feature branch

```bash
git push origin feature/my-feature
```

**Что запускается:**

- **CI Workflow** (Pull Request):
  - ✅ Lint
  - ✅ TypeCheck
  - ✅ Unit Tests (90% coverage)
  - ✅ Build

### 2. Merge PR в main

**Что запускается:**

- **CI Workflow** (Push to main):
  - ✅ Lint
  - ✅ TypeCheck
  - ✅ Unit Tests
  - ✅ Build
- **E2E Workflow**:
  - ✅ Playwright Tests (Chromium)
- **Release Workflow**:
  - 📦 Анализирует коммиты с последнего релиза
  - 🏷️ Создает новый тег версии (если есть feat/fix)
  - 📝 Генерирует CHANGELOG.md
  - 🚀 Создает GitHub Release
- **CodeQL** (если есть изменения в коде):
  - 🔒 Security scanning

## Версионирование (semantic-release)

### Автоматическое определение версии

| Коммиты                             | Текущая версия | Новая версия | Причина |
| ----------------------------------- | -------------- | ------------ | ------- |
| `fix: ...`                          | 1.2.3          | 1.2.4        | PATCH   |
| `feat: ...`                         | 1.2.3          | 1.3.0        | MINOR   |
| `feat!: ...` или `BREAKING CHANGE:` | 1.2.3          | 2.0.0        | MAJOR   |
| `docs: ...`, `chore: ...`           | 1.2.3          | (без релиза) | -       |

### Пример CHANGELOG

После push в main с коммитами:

- `feat(ui): add dark mode`
- `fix(api): handle errors`

**Результат:**

```markdown
## [1.3.0] - 2025-12-10

### Features

- **ui:** add dark mode (abc123)

### Bug Fixes

- **api:** handle errors (def456)
```

## Troubleshooting

### Pre-commit hook fails

```bash
# Ошибка: ESLint нашел проблемы
✖ eslint --fix found some errors

# Решение 1: Посмотреть детали
npm run lint

# Решение 2: Если ошибки не критичны, пропустить хук (НЕ РЕКОМЕНДУЕТСЯ)
git commit --no-verify -m "feat: quick fix"
```

### Commit-msg validation fails

```bash
# Ошибка: неправильный формат
⧗   input: added new feature
✖   subject may not be empty [subject-empty]

# Решение: использовать правильный формат
git commit -m "feat: add new feature"
```

### Forgot to run npm run commit

```bash
# Если уже сделали git commit -m "wrong format"
# Можно изменить последний коммит
git commit --amend

# Откроется редактор - измените сообщение на правильный формат
# Или используйте:
git commit --amend -m "feat: correct format"
```

### Нужно обойти все проверки (крайний случай)

```bash
# Только для hotfix или экстренных ситуаций!
git commit --no-verify -m "hotfix: critical production bug"
```

## Best Practices

1. **Используйте `npm run commit`** - интерактивный режим помогает не забыть формат
2. **Пишите в imperative mood** - "add feature" не "added feature"
3. **Указывайте scope** - помогает в навигации по истории (`feat(ui)`, `fix(api)`)
4. **Один коммит = одна логическая единица** - не смешивайте feat и fix в одном коммите
5. **Breaking changes явно** - используйте `!` или `BREAKING CHANGE:` в footer
6. **Commit часто, push реже** - делайте маленькие атомарные коммиты локально
7. **Rebase перед push** - держите историю чистой

## Полный пример workflow

```bash
# 1. Создать feature branch
git checkout -b feat/dark-mode

# 2. Внести изменения
# ... редактируем код ...

# 3. Проверить что изменилось
git status
git diff

# 4. Добавить в staging
git add src/components/ThemeToggle.tsx
git add src/components/ThemeToggle.test.tsx

# 5. Коммит (интерактивный)
npm run commit
# → Select: feat
# → Scope: ui
# → Description: add dark mode toggle

# 6. Еще изменения
# ... редактируем ...
git add .
npm run commit

# 7. Push в remote
git push origin feat/dark-mode

# 8. Создать PR через GitHub UI или gh CLI
gh pr create --title "feat(ui): add dark mode toggle" --body "Implements theme switching"

# 9. После approve - merge PR
# 10. semantic-release автоматически создаст релиз 🎉
```

## Чеклист перед коммитом

- [ ] Код работает локально (`npm run dev`)
- [ ] Тесты проходят (`npm test`)
- [ ] TypeScript без ошибок (`npx tsc -b`)
- [ ] Линтер без ошибок (`npm run lint`)
- [ ] Добавлены тесты для новой функциональности
- [ ] Обновлена документация (если нужно)
- [ ] Commit message следует Conventional Commits
- [ ] Scope указан корректно
- [ ] Breaking changes отмечены (если есть)

---

**Итого:**

1. `git add .`
2. `npm run commit` (или `git commit -m "type(scope): description"`)
3. `git push`
4. CI/CD делает всё остальное ✨
