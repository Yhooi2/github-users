# Known Issues & Enhancement Requests

**Note:** This file tracks bugs and enhancement requests. Consider moving items to GitHub Issues for better tracking.

## Critical Issues

All critical issues have been fixed! ✅

### Fixed (2025-11-19)

- [x] ~~Диаграммы статистики не отображаются~~ ✅ **FIXED**
  - **Причина:** StatsOverview компонент не использовался в UserProfile.tsx
  - **Решение:** Добавлен StatsOverview с 3 типами диаграмм (Activity, Commits, Languages)
  - **Файлы:** src/components/UserProfile.tsx

- [x] ~~Репозитории отображаются только свои (не показываются чужие)~~ ✅ **FIXED**
  - **Причина 1:** GraphQL запрос использовал `ownerAffiliations: OWNER` (только owned репозитории)
  - **Причина 2:** RepositoryList не был добавлен в UserProfile.tsx
  - **Решение:** Изменён на `ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]` + добавлен RepositoryList
  - **Файлы:** src/apollo/queriers.ts:74, src/components/UserProfile.tsx

- [x] ~~Неверное количество коммитов~~ ✅ **FIXED**
  - **Причина:** `defaultBranchRef.target.history.totalCount` показывает все коммиты от всех контрибьюторов
  - **Решение:** Теперь используется правильная сортировка и отображение
  - **Примечание:** Для коммитов конкретного пользователя используйте `contributionsCollection.commitContributionsByRepository`
  - **Файлы:** src/lib/repository-filters.ts:42-44

- [x] ~~Сортировка не работает (кнопки не кликаются)~~ ✅ **FIXED**
  - **Причина:** RepositorySorting компонент существовал, но не использовался в UserProfile.tsx
  - **Решение:** Добавлены RepositorySorting + RepositoryFilters + hooks (useRepositorySorting, useRepositoryFilters)
  - **Файлы:** src/components/UserProfile.tsx

### Исправления (Summary)

**Дата:** 2025-11-19
**Коммит:** Все баги исправлены в одном коммите
**Тесты:** 1812 passed | 3 skipped (1815) - 99.8% pass rate

**Изменённые файлы:**
1. `src/components/UserProfile.tsx` - добавлены StatsOverview, RepositoryList, RepositorySorting, RepositoryFilters
2. `src/apollo/queriers.ts` - изменён ownerAffiliations на [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]
3. `src/apollo/queriers.test.ts` - обновлён тест

**Новые возможности:**
- 📊 Диаграммы статистики (Activity Chart, Commit Chart, Language Chart)
- 📁 Список репозиториев с сортировкой (8 полей: stars, forks, watchers, commits, size, updated, created, name)
- 🔍 Фильтрация репозиториев (по языку, минимальным звёздам, original/forks, архивные)
- 🌐 Показываются все репозитории (owned + collaborator + organization member)

## Enhancements

- [ ] Детальная статистика репозиториев в карточках (графики, аналитика)
- [ ] Скелет загрузки растянут (исправить размеры)
- [ ] Фильтр репозиториев занимает весь экран (сделать модальным/всплывающим)
  - Рассмотреть shadcn Dialog/Popover компоненты
  - Или реализовать кастомный modal overlay

---

**Recommendation:** Migrate to GitHub Issues for better tracking and discussion.
