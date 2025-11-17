# API Reference

> Complete reference for GraphQL queries, custom hooks, utility functions, and TypeScript types

**Last Updated**: 2025-11-16
**API Version**: GitHub GraphQL API v4

---

## Table of Contents

1. [GraphQL API](#graphql-api)
2. [Custom Hooks](#custom-hooks)
3. [Utility Functions](#utility-functions)
4. [TypeScript Types](#typescript-types)
5. [Constants](#constants)

---

## GraphQL API

### GET_USER_INFO

**File**: `src/apollo/queriers.ts`

**Description**: Main GraphQL query to fetch comprehensive GitHub user information.

**Type**: `DocumentNode`

**Variables**:
```typescript
{
  login: string;          // GitHub username
  from: string;           // Start date (ISO 8601)
  to: string;             // End date (ISO 8601)
  year1From: string;      // Year 1 start date
  year1To: string;        // Year 1 end date
  year2From: string;      // Year 2 start date
  year2To: string;        // Year 2 end date
  year3From: string;      // Year 3 start date
  year3To: string;        // Year 3 end date
}
```

**Returns**:
```typescript
{
  user: {
    // Basic Info
    id: string;
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    url: string;
    location: string | null;
    createdAt: string;

    // Counts
    followers: { totalCount: number };
    following: { totalCount: number };
    gists: { totalCount: number };

    // Contributions (3 years)
    year1: { totalCommitContributions: number };
    year2: { totalCommitContributions: number };
    year3: { totalCommitContributions: number };
    contributionsCollection: {
      totalCommitContributions: number;
      commitContributionsByRepository: RepositoryContributions[];
    };

    // Repositories
    repositories: {
      totalCount: number;
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
      nodes: Repository[];
    };
  };
}
```

**Usage**:
```typescript
import { useQuery } from '@apollo/client';
import { GET_USER_INFO } from '@/apollo/queriers';

const { data, loading, error } = useQuery(GET_USER_INFO, {
  variables: {
    login: 'octocat',
    from: '2024-01-01T00:00:00Z',
    to: '2025-01-01T00:00:00Z',
    // ... year ranges
  },
});
```

**Query Fields**:
- User profile information
- Contribution statistics (3-year breakdown)
- Repository list (up to 100 repos)
- For each repository:
  - Basic metadata (name, description, URLs)
  - Statistics (stars, forks, watchers, issues, PRs)
  - Language information
  - Topics and topics
  - Fork/template status
  - Activity dates
  - License information

---

## Custom Hooks

### useQueryUser

**File**: `src/apollo/useQueryUser.ts`

**Description**: Custom hook that wraps `useQuery` with automatic date variable computation.

**Signature**:
```typescript
function useQueryUser(
  login: string | null
): {
  data?: QueryUserData;
  loading: boolean;
  error?: ApolloError;
}
```

**Parameters**:
- `login` - GitHub username to query (null to skip query)

**Returns**:
- `data` - User data from GraphQL query
- `loading` - Loading state
- `error` - Error object if query failed

**Usage**:
```typescript
import useQueryUser from '@/apollo/useQueryUser';

function UserProfile({ userName }: { userName: string }) {
  const { data, loading, error } = useQueryUser(userName);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.user) return <div>User not found</div>;

  return <div>{data.user.name}</div>;
}
```

**Features**:
- Automatic date range calculation (3 years)
- Skips query when `login` is null/empty
- Handles network status changes
- Error policy: 'all' (returns partial data on errors)

---

### useAuthenticityScore

**File**: `src/hooks/useAuthenticityScore.ts`

**Description**: Calculates authenticity score from repository data.

**Signature**:
```typescript
function useAuthenticityScore(
  repositories: Repository[]
): AuthenticityScore
```

**Parameters**:
- `repositories` - Array of repository objects

**Returns**:
```typescript
{
  overallScore: number;           // 0-100
  breakdown: {
    originalReposPercent: number; // Percentage of non-fork repos
    activityScore: number;        // Recent activity score
    engagementScore: number;      // Stars/forks/watchers score
    codeOwnershipScore: number;   // Languages/commits/size score
  };
  flags: {
    hasForkedRepos: boolean;      // Has any forks
    hasInactiveRepos: boolean;    // >50% repos inactive (6+ months)
    hasLowEngagement: boolean;    // Engagement score < 10
  };
}
```

**Usage**:
```typescript
import { useAuthenticityScore } from '@/hooks/useAuthenticityScore';

const authenticityScore = useAuthenticityScore(repositories);
console.log(authenticityScore.overallScore); // 85
```

**Scoring Algorithm**:
1. **Original Repos** (25 points): Percentage of non-fork, non-template repos
2. **Activity Score** (25 points): Percentage of repos updated in last 6 months
3. **Engagement Score** (25 points): Logarithmic scale of stars, forks, watchers
4. **Code Ownership** (25 points): Language diversity, commit count, project size

---

### useRepositoryFilters

**File**: `src/hooks/useRepositoryFilters.ts`

**Description**: Manages repository filtering state and logic.

**Signature**:
```typescript
function useRepositoryFilters(
  repositories: Repository[]
): {
  filters: RepositoryFilter;
  setFilters: (filters: RepositoryFilter) => void;
  filteredRepositories: Repository[];
  availableLanguages: string[];
  clearFilters: () => void;
}
```

**Parameters**:
- `repositories` - Array of all repositories

**Returns**:
- `filters` - Current filter state
- `setFilters` - Update filters
- `filteredRepositories` - Filtered repository array
- `availableLanguages` - Unique languages in all repos
- `clearFilters` - Reset all filters

**Filter Options**:
```typescript
type RepositoryFilter = {
  language?: string;          // Filter by primary language
  minStars?: number;         // Minimum star count
  isFork?: boolean;          // Show only forks/non-forks
  isTemplate?: boolean;      // Show only templates/non-templates
  hasIssues?: boolean;       // Has issues enabled
  isArchived?: boolean;      // Show only archived/non-archived
  searchQuery?: string;      // Search name/description
  topics?: string[];         // Filter by topics
  lastActivityDays?: number; // Activity within N days
}
```

**Usage**:
```typescript
import { useRepositoryFilters } from '@/hooks/useRepositoryFilters';

const {
  filters,
  setFilters,
  filteredRepositories,
  availableLanguages,
  clearFilters,
} = useRepositoryFilters(repositories);

// Set filters
setFilters({ language: 'TypeScript', minStars: 10 });

// Clear filters
clearFilters();
```

---

### useRepositorySorting

**File**: `src/hooks/useRepositorySorting.ts`

**Description**: Manages repository sorting state and logic.

**Signature**:
```typescript
function useRepositorySorting(
  repositories: Repository[]
): {
  sortBy: SortField;
  sortDirection: SortDirection;
  setSorting: (field: SortField, direction: SortDirection) => void;
  sortedRepositories: Repository[];
}
```

**Parameters**:
- `repositories` - Array of repositories to sort

**Returns**:
- `sortBy` - Current sort field
- `sortDirection` - Current sort direction ('asc' | 'desc')
- `setSorting` - Update sorting
- `sortedRepositories` - Sorted repository array

**Sort Fields**:
```typescript
type SortField =
  | 'stars'      // Star count
  | 'forks'      // Fork count
  | 'commits'    // Commit count
  | 'updated'    // Last updated date
  | 'created'    // Creation date
  | 'name'       // Repository name (alphabetical)
  | 'size';      // Repository size
```

**Usage**:
```typescript
import { useRepositorySorting } from '@/hooks/useRepositorySorting';

const {
  sortBy,
  sortDirection,
  setSorting,
  sortedRepositories,
} = useRepositorySorting(repositories);

// Sort by stars (descending)
setSorting('stars', 'desc');

// Sort by name (ascending)
setSorting('name', 'asc');
```

---

## Utility Functions

### Authenticity Functions

**File**: `src/lib/authenticity.ts`

#### calculateAuthenticityScore

```typescript
function calculateAuthenticityScore(
  repositories: Repository[]
): AuthenticityScore
```

**Description**: Calculates comprehensive authenticity score from repositories.

**Algorithm**: See [useAuthenticityScore](#useauthenticityscore) hook documentation.

#### getScoreColor

```typescript
function getScoreColor(
  score: number
): 'default' | 'secondary' | 'destructive'
```

**Description**: Returns badge color variant based on score.

**Rules**:
- score ≥ 70: 'default' (green)
- score ≥ 40: 'secondary' (yellow)
- score < 40: 'destructive' (red)

#### getScoreLabel

```typescript
function getScoreLabel(score: number): string
```

**Description**: Returns human-readable label for score.

**Labels**:
- score ≥ 90: 'Exceptional'
- score ≥ 70: 'Authentic'
- score ≥ 50: 'Moderate'
- score ≥ 30: 'Suspicious'
- score < 30: 'Low Activity'

---

### Filtering Functions

**File**: `src/lib/repository-filters.ts`

#### filterRepositories

```typescript
function filterRepositories(
  repositories: Repository[],
  filters: RepositoryFilter
): Repository[]
```

**Description**: Filters repositories based on provided criteria.

**Parameters**:
- `repositories` - Array of repositories
- `filters` - Filter object

**Returns**: Filtered repository array

**Filter Logic**:
- `language`: Exact match on primary language
- `minStars`: Greater than or equal
- `isFork`: Boolean match
- `isTemplate`: Boolean match
- `hasIssues`: Boolean match
- `isArchived`: Boolean match
- `searchQuery`: Case-insensitive substring match on name/description
- `topics`: Repository has all specified topics
- `lastActivityDays`: `pushedAt` within last N days

---

### Statistics Functions

**File**: `src/lib/statistics.ts`

#### calculateRepositoryCommitStats

```typescript
function calculateRepositoryCommitStats(
  contributionsByRepo: RepositoryContributions[]
): RepositoryCommitStats[]
```

**Description**: Calculates per-repository commit statistics.

**Returns**:
```typescript
Array<{
  repositoryName: string;
  totalCommits: number;
  userCommits: number;
  percentage: number;  // (userCommits / totalCommits) * 100
}>
```

#### calculateLanguageStats

```typescript
function calculateLanguageStats(
  repositories: Repository[]
): LanguageStats[]
```

**Description**: Aggregates language usage across all repositories.

**Returns**:
```typescript
Array<{
  name: string;              // Language name
  size: number;              // Total bytes
  percentage: number;        // Percentage of total
  repositoryCount: number;   // Number of repos using this language
}>
```

#### calculateYearlyCommits

```typescript
function calculateYearlyCommits(
  year1: number,
  year2: number,
  year3: number
): YearlyCommitStats[]
```

**Description**: Formats yearly commit data for charts.

**Returns**:
```typescript
Array<{
  year: number;
  commits: number;
}>
```

#### calculateCommitActivity

```typescript
function calculateCommitActivity(
  totalCommits: number,
  dateRange: { from: Date; to: Date }
): CommitActivity
```

**Description**: Calculates commit activity metrics over time period.

**Returns**:
```typescript
{
  total: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
}
```

#### calculateCommitSummary

```typescript
function calculateCommitSummary(
  repositories: Repository[],
  contributionsByRepo: RepositoryContributions[]
): CommitSummary
```

**Description**: Generates comprehensive commit statistics summary.

**Returns**:
```typescript
{
  totalRepositoryCommits: number;     // All commits in all repos
  userRepositoryCommits: number;      // User's commits
  userContributionPercentage: number; // User's percentage
  topRepositoryCommits: number;       // Highest commit count in single repo
}
```

#### formatNumber

```typescript
function formatNumber(value: number): string
```

**Description**: Formats numbers with K/M suffixes.

**Examples**:
- `formatNumber(999)` → `"999"`
- `formatNumber(1000)` → `"1K"`
- `formatNumber(1500)` → `"1.5K"`
- `formatNumber(5000)` → `"5K"`
- `formatNumber(1000000)` → `"1M"`
- `formatNumber(2500000)` → `"2.5M"`

**Rules**:
- Values ≥ 1M: Format as "X.YM" or "XM"
- Values ≥ 1K: Format as "X.YK" or "XK"
- Remove ".0" decimals (e.g., "1.0K" → "1K")

#### formatBytes

```typescript
function formatBytes(bytes: number): string
```

**Description**: Converts bytes to human-readable size.

**Examples**:
- `formatBytes(500)` → `"500.0 B"`
- `formatBytes(1024)` → `"1.0 KB"`
- `formatBytes(1500000)` → `"1.4 MB"`

---

### Date Helper Functions

**File**: `src/apollo/date-helpers.ts`

#### getQueryDates

```typescript
function getQueryDates(daysBack: number = 365): { from: string; to: string }
```

**Description**: Generates date range for GraphQL query.

**Parameters**:
- `daysBack` - Number of days to go back (default: 365)

**Returns**:
```typescript
{
  from: string;  // ISO 8601 start date
  to: string;    // ISO 8601 end date (current time)
}
```

#### getThreeYearRanges

```typescript
function getThreeYearRanges(currentDate?: Date): {
  year1From: string;
  year1To: string;
  year2From: string;
  year2To: string;
  year3From: string;
  year3To: string;
}
```

**Description**: Generates date ranges for 3 consecutive years.

**Parameters**:
- `currentDate` - Reference date (default: now)

**Returns**: 6 ISO 8601 date strings for 3 year ranges

**Year Calculation**:
- Year 1: 2 years ago
- Year 2: 1 year ago
- Year 3: Current year (to now)

---

### Utility Functions

**File**: `src/lib/utils.ts`

#### cn

```typescript
function cn(...inputs: ClassValue[]): string
```

**Description**: Merges Tailwind CSS class names with proper precedence.

**Usage**:
```typescript
import { cn } from '@/lib/utils';

cn('px-4 py-2', 'bg-blue-500');
// → "px-4 py-2 bg-blue-500"

cn('px-4', { 'py-2': true, 'bg-red-500': false });
// → "px-4 py-2"
```

---

### Constants

**File**: `src/lib/constants.ts`

#### getLanguageColor

```typescript
function getLanguageColor(language: string): string
```

**Description**: Returns color hex code for programming language.

**Supported Languages**:
- TypeScript: `#3178c6`
- JavaScript: `#f1e05a`
- Python: `#3572A5`
- Java: `#b07219`
- Go: `#00ADD8`
- Rust: `#dea584`
- C++: `#f34b7d`
- Ruby: `#701516`
- PHP: `#4F5D95`
- Swift: `#F05138`
- Kotlin: `#A97BFF`
- C#: `#178600`
- HTML: `#e34c26`
- CSS: `#563d7c`
- Shell: `#89e051`
- Default: `#8b949e`

---

## TypeScript Types

### GitHub API Types

**File**: `src/apollo/github-api.types.ts`

#### Repository

```typescript
type Repository = {
  id: string;
  name: string;
  description: string | null;
  forkCount: number;
  stargazerCount: number;
  url: string;

  // Language info
  primaryLanguage: ProgrammingLanguage | null;
  languages: Languages;

  // Commit info
  defaultBranchRef: BranchRef | null;

  // Fork/template status
  isFork: boolean;
  parent: ParentRepository | null;
  isTemplate: boolean;

  // Activity dates
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;

  // Statistics
  diskUsage: number | null;
  watchers: ConnectionCount;
  issues: ConnectionCount;
  pullRequests: ConnectionCount;

  // Metadata
  licenseInfo: License | null;
  repositoryTopics: { nodes: RepositoryTopic[] };
  hasIssuesEnabled: boolean;
  hasWikiEnabled: boolean;
  isArchived: boolean;
  isEmpty: boolean;
};
```

#### GitHubUser

```typescript
type GitHubUser = {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  url: string;
  location: string | null;
  createdAt: string;

  // Counts
  followers: ConnectionCount;
  following: ConnectionCount;
  gists: ConnectionCount;

  // Contributions
  year1: YearlyContributions;
  year2: YearlyContributions;
  year3: YearlyContributions;
  contributionsCollection: ContributionsCollection;

  // Repositories
  repositories: RepositoryConnection;
};
```

#### ProgrammingLanguage

```typescript
type ProgrammingLanguage = {
  name: string;
  color: string;
};
```

#### Languages

```typescript
type Languages = {
  totalSize: number;
  edges: Array<{
    size: number;
    node: ProgrammingLanguage;
  }>;
};
```

---

### Filter & Sort Types

**File**: `src/types/filters.ts`

#### RepositoryFilter

```typescript
type RepositoryFilter = {
  language?: string;
  minStars?: number;
  isFork?: boolean;
  isTemplate?: boolean;
  hasIssues?: boolean;
  isArchived?: boolean;
  searchQuery?: string;
  topics?: string[];
  lastActivityDays?: number;
};
```

#### RepositorySorting

```typescript
type RepositorySorting = {
  field: SortField;
  direction: SortDirection;
};

type SortField =
  | 'stars'
  | 'forks'
  | 'commits'
  | 'updated'
  | 'created'
  | 'name'
  | 'size';

type SortDirection = 'asc' | 'desc';
```

---

### Metrics Types

**File**: `src/types/metrics.ts`

#### AuthenticityScore

```typescript
type AuthenticityScore = {
  overallScore: number;
  breakdown: {
    originalReposPercent: number;
    activityScore: number;
    engagementScore: number;
    codeOwnershipScore: number;
  };
  flags: {
    hasForkedRepos: boolean;
    hasInactiveRepos: boolean;
    hasLowEngagement: boolean;
  };
};
```

#### LanguageStats

```typescript
type LanguageStats = {
  name: string;
  size: number;
  percentage: number;
  repositoryCount: number;
};
```

#### RepositoryCommitStats

```typescript
type RepositoryCommitStats = {
  repositoryName: string;
  totalCommits: number;
  userCommits: number;
  percentage: number;
};
```

#### YearlyCommitStats

```typescript
type YearlyCommitStats = {
  year: number;
  commits: number;
};
```

#### CommitActivity

```typescript
type CommitActivity = {
  total: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
};
```

#### CommitSummary

```typescript
type CommitSummary = {
  totalRepositoryCommits: number;
  userRepositoryCommits: number;
  userContributionPercentage: number;
  topRepositoryCommits: number;
};
```

---

## Error Handling

### Apollo Client Errors

**File**: `src/apollo/ApolloAppProvider.tsx`

**Error Link**: Global error handler

**GraphQL Errors**:
```typescript
{
  message: string;
  locations: Array<{ line: number; column: number }>;
  path: string[];
  extensions: {
    code?: string;  // e.g., 'UNAUTHENTICATED'
  };
}
```

**Network Errors**:
```typescript
{
  name: string;
  message: string;
  statusCode?: number;  // HTTP status
  result?: any;         // Response body
}
```

**Error Handling**:
1. GraphQL errors: Logged to console, displayed via toast
2. `UNAUTHENTICATED` code: Shows auth error message
3. Network errors: Logged to console, displayed via toast
4. 401 status: Clears token from localStorage

---

## Rate Limits

### GitHub GraphQL API

**Rate Limit**: 5000 points/hour (authenticated)

**Cost Calculation**:
- Simple field: 1 point
- Connection (first: N): N points
- Nested queries: Additive

**GET_USER_INFO Query Cost**: ~102 points
- User fields: 1 point
- Contributions (3 years): 3 points
- Repositories (first: 100): 100 points × 1 (per repo fields)

**Best Practices**:
- Cache aggressively (Apollo InMemoryCache)
- Use pagination for large datasets
- Monitor rate limit headers
- Implement retry logic with exponential backoff

---

## Additional Resources

- [GraphQL API Documentation](./api-reference.md)
- [Apollo Client Guide](./apollo-client-guide.md)
- [TypeScript Guide](./typescript-guide.md)
- [Testing Guide](./testing-guide.md)

---

**Note**: This API reference is kept in sync with code changes. Last updated: 2025-11-16
