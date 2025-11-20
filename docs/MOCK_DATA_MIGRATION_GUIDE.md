# Mock Data Migration Guide

**Week 4 P3: Mock data consolidation - reducing duplication across test files**

## Overview

This guide documents the migration from duplicate mock data scattered across 16+ test files to a centralized mock factory system. The goal is to reduce code duplication, improve maintainability, and ensure consistency across tests.

## Problem Statement

**Before migration:**
- 30+ duplicate repository mock definitions across 16 test files
- ~500+ lines of duplicated mock code
- Inconsistent mock data between tests
- Difficult to maintain and update mocks

**After migration:**
- Single source of truth: `src/test/mocks/github-data.ts`
- Centralized factory functions for creating mocks
- ~78 lines saved across 3 example files (with 13+ files remaining)
- Easy to extend and maintain

## Centralized Mock Factory

**Location:** `src/test/mocks/github-data.ts`

**Enhanced with (+320 lines):**
- Repository mocks (already existed)
- Authenticity Score mocks (4 pre-configured)
- Contribution Repository mocks (for RecentActivity component)
- Metric mocks (Activity, Impact, Quality, Growth)

## Available Mocks

### Repository Mocks

```typescript
import {
  mockRepository,              // Default repository
  mockForkedRepository,        // Forked repo
  mockArchivedRepository,      // Archived repo
  mockTemplateRepository,      // Template repo
  mockEmptyRepository,         // No commits
  mockPopularRepository,       // High stars/forks
  mockLowEngagementRepository, // Low engagement
  mockJavaScriptRepository,    // JS primary language
  mockMultiLanguageRepository, // Multiple languages
  createMockRepository,        // Factory function
  createMockRepositories,      // Bulk factory
} from '@/test/mocks/github-data';
```

### Authenticity Score Mocks

```typescript
import {
  mockHighAuthenticityScore,       // 85/100 - High
  mockMediumAuthenticityScore,     // 62/100 - Medium
  mockLowAuthenticityScore,        // 35/100 - Low
  mockSuspiciousAuthenticityScore, // 15/100 - Suspicious
  createMockAuthenticityScore,     // Factory function
} from '@/test/mocks/github-data';
```

### Contribution Repository Mocks

```typescript
import {
  mockContributionRepositories,      // 5 pre-configured
  createMockContributionRepository,   // Factory function
} from '@/test/mocks/github-data';
```

### Metric Mocks

```typescript
import {
  mockHighActivityMetric,
  mockModerateActivityMetric,
  mockLowActivityMetric,
  mockExceptionalImpactMetric,
  mockStrongImpactMetric,
  mockExcellentQualityMetric,
  mockRapidGrowthMetric,
  mockStableGrowthMetric,
} from '@/test/mocks/github-data';
```

## Migration Examples

### Example 1: RepositoryCard.test.tsx

**Before (46 lines):**
```typescript
import type { Repository } from '@/apollo/github-api.types';

const mockRepository: Repository = {
  id: '1',
  name: 'test-repo',
  description: 'A test repository description',
  url: 'https://github.com/user/test-repo',
  stargazerCount: 100,
  forkCount: 20,
  isFork: false,
  isTemplate: false,
  parent: null,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2024-11-05T10:00:00Z',
  pushedAt: '2024-11-05T10:00:00Z',
  diskUsage: 1000,
  isArchived: false,
  homepageUrl: null,
  watchers: { totalCount: 10 },
  issues: { totalCount: 5 },
  repositoryTopics: {
    nodes: [
      { topic: { name: 'react' } },
      { topic: { name: 'typescript' } },
    ],
  },
  licenseInfo: { name: 'MIT License' },
  defaultBranchRef: {
    target: {
      history: { totalCount: 50 },
    },
  },
  primaryLanguage: { name: 'TypeScript' },
  languages: {
    totalSize: 1000,
    edges: [
      { size: 800, node: { name: 'TypeScript' } },
      { size: 200, node: { name: 'CSS' } },
    ],
  },
};
```

**After (40 lines):**
```typescript
import { createMockRepository } from '@/test/mocks/github-data';

// Use centralized mock factory (Week 4 P3: Mock data consolidation)
const mockRepository = createMockRepository({
  id: '1',
  name: 'test-repo',
  description: 'A test repository description',
  url: 'https://github.com/user/test-repo',
  stargazerCount: 100,
  forkCount: 20,
  updatedAt: '2024-11-05T10:00:00Z',
  pushedAt: '2024-11-05T10:00:00Z',
  diskUsage: 1000,
  watchers: { totalCount: 10 },
  issues: { totalCount: 5 },
  repositoryTopics: {
    nodes: [
      { topic: { name: 'react' } },
      { topic: { name: 'typescript' } },
    ],
  },
  licenseInfo: { name: 'MIT License' },
  defaultBranchRef: {
    target: {
      history: { totalCount: 50 },
    },
  },
  primaryLanguage: { name: 'TypeScript' },
  languages: {
    totalSize: 1000,
    edges: [
      { size: 800, node: { name: 'TypeScript' } },
      { size: 200, node: { name: 'CSS' } },
    ],
  },
});
```

**Result:** Saved 6 lines, tests pass (34/34 ✅)

---

### Example 2: UserAuthenticity.test.tsx

**Before (84 lines):**
```typescript
import type { AuthenticityScore } from '@/types/metrics';

const mockHighScore: AuthenticityScore = {
  score: 85,
  category: 'High',
  breakdown: {
    originalityScore: 22,
    activityScore: 20,
    engagementScore: 23,
    codeOwnershipScore: 20,
  },
  flags: [],
  metadata: {
    totalRepos: 10,
    originalRepos: 9,
    forkedRepos: 1,
    archivedRepos: 0,
    templateRepos: 0,
  },
};

const mockMediumScore: AuthenticityScore = {
  // ... 18 more lines
};

const mockLowScore: AuthenticityScore = {
  // ... 18 more lines
};

const mockSuspiciousScore: AuthenticityScore = {
  // ... 18 more lines
};
```

**After (18 lines):**
```typescript
import {
  mockHighAuthenticityScore,
  mockMediumAuthenticityScore,
  mockLowAuthenticityScore,
  mockSuspiciousAuthenticityScore,
} from '@/test/mocks/github-data';

// Use centralized mock factory (Week 4 P3: Mock data consolidation)
const mockHighScore = mockHighAuthenticityScore;
const mockMediumScore = mockMediumAuthenticityScore;
const mockLowScore = mockLowAuthenticityScore;
const mockSuspiciousScore = mockSuspiciousAuthenticityScore;
```

**Result:** Saved 68 lines, tests pass (22/22 ✅)

---

### Example 3: RecentActivity.test.tsx

**Before (11 lines):**
```typescript
const mockRepositories = [
  { repository: { name: 'awesome-project' }, contributions: { totalCount: 127 } },
  { repository: { name: 'web-app' }, contributions: { totalCount: 89 } },
  { repository: { name: 'mobile-client' }, contributions: { totalCount: 56 } },
  { repository: { name: 'api-server' }, contributions: { totalCount: 43 } },
  { repository: { name: 'documentation' }, contributions: { totalCount: 21 } },
];
```

**After (7 lines):**
```typescript
import { mockContributionRepositories } from '@/test/mocks/github-data';

// Use centralized mock factory (Week 4 P3: Mock data consolidation)
const mockRepositories = mockContributionRepositories;
```

**Result:** Saved 4 lines, tests pass (15/15 ✅)

---

## Migration Checklist

When migrating a test file:

1. **Identify duplicate mocks**
   ```bash
   grep "const mockRepo" src/components/yourfile.test.tsx
   ```

2. **Find matching centralized mock**
   - Check `src/test/mocks/github-data.ts`
   - Look for pre-configured mocks or factory functions

3. **Replace inline mock with import**
   ```typescript
   // Before
   const mockRepo: Repository = { /* 40 lines */ };

   // After
   import { createMockRepository } from '@/test/mocks/github-data';
   const mockRepo = createMockRepository({ /* only overrides */ });
   ```

4. **Run tests to verify**
   ```bash
   npm test -- src/components/yourfile.test.tsx
   ```

5. **Add comment for tracking**
   ```typescript
   // Use centralized mock factory (Week 4 P3: Mock data consolidation)
   ```

## Remaining Files to Migrate

**Files with duplicate mocks (13 remaining):**

**Repository components (5 files):**
- `src/components/repository/RepositoryList.test.tsx`
- `src/components/repository/RepositoryTable.test.tsx`
- `src/components/repository/RepositoryList.stories.tsx`
- `src/components/repository/RepositoryTable.stories.tsx`
- `src/components/repository/RepositoryCard.stories.tsx`

**Timeline components (5 files):**
- `src/components/timeline/TimelineYear.test.tsx`
- `src/components/timeline/YearExpandedView.test.tsx`
- `src/components/timeline/ActivityTimeline.stories.tsx`
- `src/components/timeline/TimelineYear.stories.tsx`
- `src/components/timeline/YearExpandedView.stories.tsx`

**Lib/hooks (3 files):**
- `src/lib/repository-filters.test.ts`
- `src/lib/statistics.test.ts`
- `src/lib/authenticity.test.ts`

**Total estimated savings:** ~400-500 lines of duplicate code

## Benefits

✅ **Reduced duplication** - Single source of truth for mock data
✅ **Improved maintainability** - Update mocks in one place
✅ **Consistent testing** - Same mock data across all tests
✅ **Easier refactoring** - Change mock structure once
✅ **Better documentation** - Centralized, well-documented mocks
✅ **Faster test writing** - Import instead of copy-paste

## Future Enhancements

Potential additions to `github-data.ts`:
- More metric variations (Medium Impact, Low Quality, etc.)
- User mocks with different profiles
- GraphQL response mocks
- Error state mocks
- Pagination mocks

## Best Practices

1. **Always use factory functions** when you need customization
2. **Import only what you need** to keep imports clean
3. **Add tracking comments** to indicate migration status
4. **Run tests after migration** to ensure nothing breaks
5. **Update documentation** when adding new mock patterns

## Questions?

If you encounter issues or need new mock patterns, update `src/test/mocks/github-data.ts` and add your pattern to the centralized factory.

---

**Status:** Week 4 P3 - Mock Data Consolidation
**Progress:** 3/16 files migrated (19%), ~78 lines saved
**Next:** Migrate remaining 13 files (~400-500 lines to save)
