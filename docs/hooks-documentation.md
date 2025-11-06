# Custom React Hooks Documentation

## Overview

This document describes the three custom React hooks created for Phase 2.6 of the refactoring plan. All hooks are fully tested with >90% coverage and optimized with React memoization.

## Created Files

```
src/hooks/
├── index.ts                           # Barrel export file
├── useAuthenticityScore.ts            # Authenticity score calculation hook
├── useAuthenticityScore.test.ts       # 26 tests, 100% coverage
├── useRepositoryFilters.ts            # Repository filtering state management
├── useRepositoryFilters.test.ts       # 28 tests, 100% coverage
├── useRepositorySorting.ts            # Repository sorting state management
└── useRepositorySorting.test.ts       # 33 tests, 100% coverage
```

## Test Results

```bash
✓ src/hooks/useAuthenticityScore.test.ts (26 tests)
✓ src/hooks/useRepositoryFilters.test.ts (28 tests)
✓ src/hooks/useRepositorySorting.test.ts (33 tests)

Total: 87 tests passed
Coverage: 100% for all hooks
```

---

## 1. useAuthenticityScore

**Purpose**: Calculates GitHub user authenticity score with memoization.

**Location**: `src/hooks/useAuthenticityScore.ts`

### API

```typescript
function useAuthenticityScore(repositories: Repository[]): AuthenticityScore
```

### Parameters

- `repositories` - Array of user's repositories from GitHub GraphQL API

### Returns

`AuthenticityScore` object containing:
- `score` (number) - Total score 0-100
- `category` ('High' | 'Medium' | 'Low' | 'Suspicious')
- `breakdown` - Score breakdown by component (originality, activity, engagement, code ownership)
- `flags` - Array of warning strings
- `metadata` - Repository statistics

### Example Usage

```tsx
import { useAuthenticityScore } from '@/hooks';

function UserProfile({ repositories }) {
  const authenticityScore = useAuthenticityScore(repositories);

  return (
    <div>
      <h2>Authenticity Score: {authenticityScore.score}/100</h2>
      <span className={getAuthenticityColor(authenticityScore.category)}>
        {authenticityScore.category}
      </span>

      {authenticityScore.flags.length > 0 && (
        <ul>
          {authenticityScore.flags.map(flag => (
            <li key={flag}>{flag}</li>
          ))}
        </ul>
      )}

      <div>
        <p>Originality: {authenticityScore.breakdown.originalityScore}/25</p>
        <p>Activity: {authenticityScore.breakdown.activityScore}/25</p>
        <p>Engagement: {authenticityScore.breakdown.engagementScore}/25</p>
        <p>Code Ownership: {authenticityScore.breakdown.codeOwnershipScore}/25</p>
      </div>
    </div>
  );
}
```

### Performance

- Uses `useMemo` to cache calculation results
- Recalculates only when `repositories` array reference changes
- Recommended for use in components that re-render frequently

---

## 2. useRepositoryFilters

**Purpose**: Manages repository filter state and applies filters with memoization.

**Location**: `src/hooks/useRepositoryFilters.ts`

### API

```typescript
function useRepositoryFilters(repositories: Repository[]): {
  filteredRepositories: Repository[];
  filters: RepositoryFilter;
  updateFilter: <K extends keyof RepositoryFilter>(key: K, value: RepositoryFilter[K]) => void;
  setMultipleFilters: (filters: Partial<RepositoryFilter>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}
```

### Parameters

- `repositories` - Array of repositories to filter

### Returns

Object with:
- `filteredRepositories` - Filtered repository array (memoized)
- `filters` - Current filter state
- `updateFilter` - Update single filter
- `setMultipleFilters` - Set multiple filters at once
- `clearFilters` - Clear all filters
- `hasActiveFilters` - Boolean indicating if any filters are active
- `activeFilterCount` - Number of active filters

### Supported Filters

```typescript
type RepositoryFilter = {
  originalOnly?: boolean;      // Show only original (non-forked) repos
  forksOnly?: boolean;          // Show only forked repos
  hideArchived?: boolean;       // Hide archived repos
  language?: string;            // Filter by primary language
  minStars?: number;            // Minimum star count
  searchQuery?: string;         // Search in name/description
  hasTopics?: boolean;          // Show only repos with topics
  hasLicense?: boolean;         // Show only repos with license
}
```

### Example Usage

```tsx
import { useRepositoryFilters } from '@/hooks';

function RepositoryList({ repositories }) {
  const {
    filteredRepositories,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount
  } = useRepositoryFilters(repositories);

  return (
    <div>
      <div className="filters">
        <button onClick={() => updateFilter('originalOnly', true)}>
          Original Only
        </button>
        <button onClick={() => updateFilter('hideArchived', true)}>
          Hide Archived
        </button>
        <input
          type="number"
          placeholder="Min Stars"
          onChange={(e) => updateFilter('minStars', Number(e.target.value) || undefined)}
        />
        <select onChange={(e) => updateFilter('language', e.target.value || undefined)}>
          <option value="">All Languages</option>
          <option value="TypeScript">TypeScript</option>
          <option value="JavaScript">JavaScript</option>
        </select>

        {hasActiveFilters && (
          <button onClick={clearFilters}>
            Clear All Filters ({activeFilterCount})
          </button>
        )}
      </div>

      <ul>
        {filteredRepositories.map(repo => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>

      <p>Showing {filteredRepositories.length} of {repositories.length} repositories</p>
    </div>
  );
}
```

### Performance

- Uses `useMemo` to cache filtered results
- Uses `useCallback` for all update functions (stable references)
- Recalculates only when `repositories` or `filters` change
- Efficient for large repository lists

### Filter Removal

Filters are automatically removed when:
- Value is set to `undefined`
- Value is set to `false` (for boolean filters)
- Value is set to empty string `''` (for string filters)

```tsx
// All of these remove the filter:
updateFilter('language', undefined);
updateFilter('language', '');
updateFilter('originalOnly', false);
```

---

## 3. useRepositorySorting

**Purpose**: Manages repository sorting state and applies sorting with memoization.

**Location**: `src/hooks/useRepositorySorting.ts`

### API

```typescript
function useRepositorySorting(
  repositories: Repository[],
  initialSort?: RepositorySorting
): {
  sortedRepositories: Repository[];
  sorting: RepositorySorting;
  setSortBy: (field: SortBy) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleDirection: () => void;
  setSort: (field: SortBy, direction?: SortDirection) => void;
  resetSort: () => void;
  isDefaultSort: boolean;
}
```

### Parameters

- `repositories` - Array of repositories to sort
- `initialSort` - Initial sort configuration (default: `{ field: 'stars', direction: 'desc' }`)

### Returns

Object with:
- `sortedRepositories` - Sorted repository array (memoized)
- `sorting` - Current sort configuration
- `setSortBy` - Update sort field only
- `setSortDirection` - Update sort direction only
- `toggleDirection` - Toggle between asc/desc
- `setSort` - Set both field and direction
- `resetSort` - Reset to initial sort
- `isDefaultSort` - Whether using initial sort

### Supported Sort Fields

```typescript
type SortBy =
  | 'stars'      // Star count
  | 'forks'      // Fork count
  | 'watchers'   // Watcher count
  | 'commits'    // Total commit count
  | 'size'       // Repository disk size
  | 'updated'    // Last updated date
  | 'created'    // Creation date
  | 'name';      // Alphabetical by name

type SortDirection = 'asc' | 'desc';
```

### Example Usage

```tsx
import { useRepositorySorting } from '@/hooks';

function RepositoryList({ repositories }) {
  const {
    sortedRepositories,
    sorting,
    setSortBy,
    toggleDirection,
    resetSort,
    isDefaultSort
  } = useRepositorySorting(repositories);

  const SortButton = ({ field, label }: { field: SortBy; label: string }) => (
    <button
      onClick={() => setSortBy(field)}
      className={sorting.field === field ? 'active' : ''}
    >
      {label}
      {sorting.field === field && (
        <span>{sorting.direction === 'asc' ? ' ↑' : ' ↓'}</span>
      )}
    </button>
  );

  return (
    <div>
      <div className="sort-controls">
        <SortButton field="stars" label="Stars" />
        <SortButton field="forks" label="Forks" />
        <SortButton field="commits" label="Commits" />
        <SortButton field="updated" label="Updated" />
        <SortButton field="name" label="Name" />

        <button onClick={toggleDirection}>
          Toggle Direction ({sorting.direction})
        </button>

        {!isDefaultSort && (
          <button onClick={resetSort}>Reset Sort</button>
        )}
      </div>

      <ul>
        {sortedRepositories.map(repo => (
          <li key={repo.id}>
            {repo.name} - {repo.stargazerCount} stars
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Advanced Example: Combined with Filters

```tsx
import { useRepositoryFilters, useRepositorySorting } from '@/hooks';

function RepositoryList({ repositories }) {
  // Apply filters first
  const {
    filteredRepositories,
    updateFilter,
    clearFilters,
    hasActiveFilters
  } = useRepositoryFilters(repositories);

  // Then apply sorting to filtered results
  const {
    sortedRepositories,
    setSortBy,
    toggleDirection,
    sorting
  } = useRepositorySorting(filteredRepositories);

  return (
    <div>
      {/* Filter controls */}
      <div className="filters">
        <button onClick={() => updateFilter('originalOnly', true)}>
          Original Only
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters}>Clear Filters</button>
        )}
      </div>

      {/* Sort controls */}
      <div className="sort-controls">
        <button onClick={() => setSortBy('stars')}>
          Sort by Stars {sorting.field === 'stars' && '⭐'}
        </button>
        <button onClick={toggleDirection}>
          {sorting.direction === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Results */}
      <ul>
        {sortedRepositories.map(repo => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>

      <p>
        Showing {sortedRepositories.length} of {repositories.length} repositories
      </p>
    </div>
  );
}
```

### Performance

- Uses `useMemo` to cache sorted results
- Uses `useCallback` for all update functions (stable references)
- Recalculates only when `repositories`, `sorting.field`, or `sorting.direction` change
- Efficient for large repository lists

---

## Test Coverage

All three hooks have comprehensive test suites:

### useAuthenticityScore (26 tests)
- ✅ Basic functionality (3 tests)
- ✅ Score categories (4 tests)
- ✅ Score breakdown (5 tests)
- ✅ Flags and warnings (8 tests)
- ✅ Memoization behavior (2 tests)
- ✅ Edge cases (4 tests)

### useRepositoryFilters (28 tests)
- ✅ Initial state (2 tests)
- ✅ updateFilter (6 tests)
- ✅ setMultipleFilters (3 tests)
- ✅ clearFilters (2 tests)
- ✅ Filter application (10 tests)
- ✅ Memoization behavior (3 tests)
- ✅ Edge cases (2 tests)

### useRepositorySorting (33 tests)
- ✅ Initial state (2 tests)
- ✅ setSortBy (3 tests)
- ✅ setSortDirection (2 tests)
- ✅ toggleDirection (4 tests)
- ✅ setSort (2 tests)
- ✅ resetSort (2 tests)
- ✅ isDefaultSort (4 tests)
- ✅ Sorting application (8 tests)
- ✅ Memoization behavior (3 tests)
- ✅ Edge cases (3 tests)

---

## Best Practices

### 1. Always Use with Memoized Props

```tsx
// ✅ Good: repositories reference is stable
const repositories = useMemo(() => user.repositories.nodes, [user]);
const score = useAuthenticityScore(repositories);

// ❌ Bad: new array created on every render
const score = useAuthenticityScore([...user.repositories.nodes]);
```

### 2. Combine Hooks for Complex UIs

```tsx
// Filter → Sort → Display pipeline
const { filteredRepositories } = useRepositoryFilters(repositories);
const { sortedRepositories } = useRepositorySorting(filteredRepositories);
const authenticityScore = useAuthenticityScore(filteredRepositories);
```

### 3. Use Barrel Export

```tsx
// ✅ Good: use barrel export
import { useAuthenticityScore, useRepositoryFilters } from '@/hooks';

// ❌ Avoid: direct imports
import { useAuthenticityScore } from '@/hooks/useAuthenticityScore';
```

### 4. Stable Update Functions

All update functions (`updateFilter`, `setSortBy`, etc.) are wrapped with `useCallback`, so they can safely be used in dependency arrays:

```tsx
const { updateFilter } = useRepositoryFilters(repositories);

// ✅ Safe: updateFilter reference is stable
useEffect(() => {
  updateFilter('language', selectedLanguage);
}, [selectedLanguage, updateFilter]);
```

---

## Integration with Existing Code

These hooks integrate with existing utilities:

- `useAuthenticityScore` → uses `lib/authenticity.ts`
- `useRepositoryFilters` → uses `lib/repository-filters.ts` (filterRepositories)
- `useRepositorySorting` → uses `lib/repository-filters.ts` (sortRepositories)

All hooks use types from:
- `apollo/github-api.types.ts` (Repository type)
- `types/filters.ts` (SortBy, SortDirection, RepositoryFilter)
- `types/metrics.ts` (AuthenticityScore)

---

## Next Steps

With Phase 2.6 complete, the next phase is:

**Phase 1.2: Install shadcn/ui Components**

Install 17 shadcn/ui components required for the UI:
```bash
npx shadcn@latest add card table tabs badge separator skeleton avatar tooltip scroll-area select checkbox switch accordion collapsible progress alert chart
```

Each component installation should be followed by:
1. Create Storybook story
2. Visual check in Storybook
3. Accessibility check (a11y addon)
4. Write component tests
5. Verify ≥85% coverage

---

## Summary

✅ **Phase 2.6 Complete**
- 3 custom hooks created
- 87 tests written (all passing)
- 100% test coverage for all hooks
- Full JSDoc documentation
- Optimized with React memoization
- Ready for UI component integration

**Files Created:**
- `src/hooks/index.ts` (barrel export)
- `src/hooks/useAuthenticityScore.ts` + tests
- `src/hooks/useRepositoryFilters.ts` + tests
- `src/hooks/useRepositorySorting.ts` + tests

**Overall Project Test Stats:**
- Total test files: 16
- Total tests: 360 (all passing)
- Overall coverage: 95.31%
- Hooks coverage: 100%
