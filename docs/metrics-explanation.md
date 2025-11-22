# Metrics Explanation — GitHub User Analytics V1.0

**Version:** 1.0 Production
**Status:** ✅ Implemented
**Last Updated:** November 2025

---

## Overview

GitHub User Analytics calculates 4 core metrics to provide a comprehensive assessment of a developer's activity and impact:

| Metric | Range | Purpose |
|--------|-------|---------|
| **Activity** | 0-100 | Current engagement level |
| **Impact** | 0-100 | Community influence |
| **Quality** | 0-100 | Code and project quality |
| **Growth** | -100 to +100 | Year-over-year trends |

---

## Activity Score (0-100)

**Purpose:** Measures how actively a developer has been contributing recently.

### Calculation

```
Activity = Recent Commits (40) + Consistency (30) + Diversity (30)
```

**Components:**

| Component | Weight | Calculation |
|-----------|--------|-------------|
| Recent Commits | 40 | Last 90 days commits, scaled 0-40 |
| Consistency | 30 | Weeks with activity / Total weeks |
| Diversity | 30 | Unique repos contributed to |

### Labels

| Score | Label |
|-------|-------|
| 71-100 | High |
| 41-70 | Moderate |
| 0-40 | Low |

### Implementation

**File:** `src/lib/metrics/activity.ts`

```typescript
export interface ActivityMetric {
  score: number;           // 0-100
  level: "High" | "Moderate" | "Low";
  breakdown: {
    recentCommits: number;   // 0-40
    consistency: number;     // 0-30
    diversity: number;       // 0-30
  };
}
```

---

## Impact Score (0-100)

**Purpose:** Measures the community influence and reach of a developer's work.

### Calculation

```
Impact = Stars (35) + Forks (20) + Contributors (15) + Reach (20) + Engagement (10)
```

**Components:**

| Component | Weight | Calculation |
|-----------|--------|-------------|
| Stars | 35 | Total stars across owned repos |
| Forks | 20 | Total forks (others using your code) |
| Contributors | 15 | People contributing to your repos |
| Reach | 20 | Watchers + downloads estimate |
| Engagement | 10 | Issues + PR activity |

### Labels

| Score | Label |
|-------|-------|
| 81-100 | Exceptional |
| 61-80 | Strong |
| 41-60 | Moderate |
| 21-40 | Low |
| 0-20 | Minimal |

### Implementation

**File:** `src/lib/metrics/impact.ts`

```typescript
export interface ImpactMetric {
  score: number;           // 0-100
  level: "Exceptional" | "Strong" | "Moderate" | "Low" | "Minimal";
  breakdown: {
    stars: number;         // 0-35
    forks: number;         // 0-20
    contributors: number;  // 0-15
    reach: number;         // 0-20
    engagement: number;    // 0-10
  };
}
```

---

## Quality Score (0-100)

**Purpose:** Assesses the quality and maturity of a developer's projects.

### Calculation

```
Quality = Originality (30) + Documentation (25) + Ownership (20) + Maturity (15) + Stack (10)
```

**Components:**

| Component | Weight | Calculation |
|-----------|--------|-------------|
| Originality | 30 | % non-forked repos |
| Documentation | 25 | Repos with README, description |
| Ownership | 20 | Own repos vs contributions ratio |
| Maturity | 15 | Average repo age |
| Stack | 10 | Technology diversity |

### Labels

| Score | Label |
|-------|-------|
| 81-100 | Excellent |
| 61-80 | Strong |
| 41-60 | Good |
| 21-40 | Fair |
| 0-20 | Weak |

### Implementation

**File:** `src/lib/metrics/quality.ts`

```typescript
export interface QualityMetric {
  score: number;           // 0-100
  level: "Excellent" | "Strong" | "Good" | "Fair" | "Weak";
  breakdown: {
    originality: number;   // 0-30
    documentation: number; // 0-25
    ownership: number;     // 0-20
    maturity: number;      // 0-15
    stack: number;         // 0-10
  };
}
```

---

## Growth Score (-100 to +100)

**Purpose:** Shows year-over-year trend in activity and impact.

### Calculation

```
Growth = Activity Growth (40) + Impact Growth (30) + Skills Growth (30)
```

**Components:**

| Component | Weight | Calculation |
|-----------|--------|-------------|
| Activity Growth | 40 | This year vs last year commits |
| Impact Growth | 30 | Stars/forks growth rate |
| Skills Growth | 30 | New languages/technologies |

### Labels

| Score | Label |
|-------|-------|
| 51 to 100 | Rapid Growth |
| 21 to 50 | Growing |
| -20 to 20 | Stable |
| -50 to -21 | Declining |
| -100 to -51 | Rapid Decline |

### Implementation

**File:** `src/lib/metrics/growth.ts`

```typescript
export interface GrowthMetric {
  score: number;           // -100 to +100
  level: "Rapid Growth" | "Growing" | "Stable" | "Declining" | "Rapid Decline";
  breakdown: {
    activityGrowth: number;  // -40 to +40
    impactGrowth: number;    // -30 to +30
    skillsGrowth: number;    // -30 to +30
  };
}
```

---

## Data Requirements

### GraphQL Fields Used

```graphql
query GetUserInfo($login: String!) {
  user(login: $login) {
    # Profile
    login
    name
    createdAt

    # Contribution data (per year range)
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
          }
        }
      }
    }

    # Repository data
    repositories(first: 100, ownerAffiliations: OWNER) {
      nodes {
        stargazerCount
        forkCount
        isFork
        description
        languages(first: 5) { nodes { name } }
        createdAt
        updatedAt
      }
    }

    # Contribution repos (not owned)
    repositoriesContributedTo(first: 50) {
      totalCount
      nodes {
        nameWithOwner
      }
    }
  }
}
```

### API Limitations

- GitHub GraphQL API returns max 100 repositories per query
- Contribution data available for date ranges (ISO 8601)
- Rate limit: 5000 requests/hour (per token)

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/lib/metrics/activity.ts` | Activity score calculation |
| `src/lib/metrics/impact.ts` | Impact score calculation |
| `src/lib/metrics/quality.ts` | Quality score calculation |
| `src/lib/metrics/growth.ts` | Growth score calculation |
| `src/lib/metrics/index.ts` | Combined exports |
| `src/hooks/useMetrics.ts` | React hook for metrics |
| `src/components/assessment/MetricCard.tsx` | UI component |
| `src/components/assessment/QuickAssessment.tsx` | 4-metric grid |

---

## Testing

All metrics have comprehensive test coverage:

| File | Tests | Coverage |
|------|-------|----------|
| `activity.test.ts` | 28 | 100% |
| `impact.test.ts` | 44 | 100% |
| `quality.test.ts` | 47 | 100% |
| `growth.test.ts` | 42 | 100% |

**Total:** 161 metric-specific tests

---

## Changelog

### V1.0 (November 2025) - Current
- ✅ All 4 metrics fully implemented
- ✅ 100% test coverage
- ✅ UI components (MetricCard, QuickAssessment, Modal)
- ✅ Deployed to production

### V0.1 (Initial Concept)
- Activity metric prototype
- Basic scoring system
