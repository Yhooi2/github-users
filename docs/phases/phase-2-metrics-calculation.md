# Phase 2: Metrics Calculation System

**Priority:** P0 (Critical)
**Estimated Time:** 2 days
**Status:** Ready for Implementation

---

## 🎯 Goal

Calculate 4 key metrics: Activity, Impact, Quality, and Growth.

**Current State:**
- Only Authenticity score exists (`src/lib/authenticity.ts`)
- Perfect template for new metrics

**Target State:**
- 4 new metrics with same pattern
- 100-point scoring system
- Component breakdown
- Category/level labels
- Metadata tracking

---

## 📊 Metric Formulas

### Activity (0-100%)
Recent commits (40%) + Consistency (30%) + Diversity (30%)

**Breakdown:**
- **A. Recent commits (0-40 points):** Last 3 months commit volume
- **B. Consistency (0-30 points):** Active months in last 12 months
- **C. Diversity (0-30 points):** Number of unique repositories (8-15 = optimal)

**Labels:**
- 71-100: High
- 41-70: Moderate
- 0-40: Low

---

### Impact (0-100%)
Stars (35%) + Forks (20%) + Contributors (15%) + Reach (20%) + Engagement (10%)

**Breakdown:**
- **A. Stars (0-35 points):** Total stars across all repos
- **B. Forks (0-20 points):** Total forks
- **C. Contributors (0-15 points):** Number of contributors attracted
- **D. Reach (0-20 points):** Watchers + dependent repos
- **E. Engagement (0-10 points):** Issue/PR interactions

**Labels:**
- 81-100: Exceptional
- 61-80: Strong
- 41-60: Moderate
- 21-40: Low
- 0-20: Minimal

---

### Quality (0-100%)
Originality (30%) + Documentation (25%) + Ownership (20%) + Maturity (15%) + Stack (10%)

**Breakdown:**
- **A. Originality (0-30 points):** Non-fork ratio
- **B. Documentation (0-25 points):** README, Wiki, Docs presence
- **C. Ownership (0-20 points):** Owner vs Contributor ratio
- **D. Maturity (0-15 points):** Age of maintained repos
- **E. Stack (0-10 points):** Language diversity

**Labels:**
- 81-100: Excellent
- 61-80: Strong
- 41-60: Good
- 21-40: Fair
- 0-20: Weak

---

### Growth (-100% to +100%)
YoY change in Activity (40%) + Impact (30%) + Skills (30%)

**Special:** Can be negative (declining) or positive (growing)

**Breakdown:**
- **A. Activity growth (40%):** Commits this year vs last year
- **B. Impact growth (30%):** Stars/Forks gained this year
- **C. Skills growth (30%):** New languages/technologies adopted

**Labels:**
- +51% to +100%: Rapid Growth
- +21% to +50%: Growing
- -20% to +20%: Stable
- -50% to -21%: Declining
- -100% to -51%: Rapid Decline

---

## 🏗️ Implementation Pattern

**Use `src/lib/authenticity.ts` as template!**

### Existing Pattern (authenticity.ts)

```typescript
export interface AuthenticityScore {
  score: number;              // 0-100
  category: string;           // High/Medium/Low/Suspicious
  breakdown: {
    originality: number;      // 0-25
    activity: number;         // 0-25
    engagement: number;       // 0-25
    codeOwnership: number;    // 0-25
  };
  flags: string[];
  metadata: { /* stats */ };
}
```

### Apply to New Metrics

```typescript
export interface ActivityMetric {
  score: number;              // 0-100
  level: string;              // Low/Moderate/High
  breakdown: {
    recentCommits: number;    // 0-40
    consistency: number;      // 0-30
    diversity: number;        // 0-30
  };
  details: { /* stats */ };
}
```

---

## 📋 Implementation Steps

### Step 2.1: Activity Score

**File:** `src/lib/metrics/activity.ts`

```typescript
import { YearData } from '@/hooks/useUserAnalytics'

export interface ActivityMetric {
  score: number
  level: string
  breakdown: {
    recentCommits: number
    consistency: number
    diversity: number
  }
  details: {
    last3MonthsCommits: number
    activeMonths: number
    uniqueRepos: number
  }
}

export function calculateActivityScore(timeline: YearData[]): ActivityMetric {
  if (!timeline.length) {
    return {
      score: 0,
      level: 'Low',
      breakdown: { recentCommits: 0, consistency: 0, diversity: 0 },
      details: { last3MonthsCommits: 0, activeMonths: 0, uniqueRepos: 0 }
    }
  }

  const last3Months = getLastNMonths(timeline, 3)
  const last12Months = getLastNMonths(timeline, 12)

  // A. Recent commits (0-40 points)
  const recentCommits = last3Months.reduce((sum, d) => sum + d.totalCommits, 0)
  const recentPoints = Math.min((recentCommits / 200) * 40, 40)

  // B. Consistency (0-30 points)
  const activeMonths = countActiveMonths(last12Months)
  const consistencyPoints = Math.min((activeMonths / 12) * 30, 30)

  // C. Diversity (0-30 points)
  const uniqueRepos = countUniqueRepos(last3Months)
  let diversityPoints = 0
  if (uniqueRepos >= 1 && uniqueRepos <= 3) diversityPoints = 10
  else if (uniqueRepos >= 4 && uniqueRepos <= 7) diversityPoints = 20
  else if (uniqueRepos >= 8 && uniqueRepos <= 15) diversityPoints = 30
  else if (uniqueRepos > 15) diversityPoints = 25 // too scattered

  const score = Math.round(recentPoints + consistencyPoints + diversityPoints)

  return {
    score,
    level: getActivityLabel(score),
    breakdown: {
      recentCommits: Math.round(recentPoints),
      consistency: Math.round(consistencyPoints),
      diversity: Math.round(diversityPoints)
    },
    details: {
      last3MonthsCommits: recentCommits,
      activeMonths,
      uniqueRepos
    }
  }
}

function getLastNMonths(timeline: YearData[], months: number): YearData[] {
  // Get data for last N months
  const now = new Date()
  const cutoff = new Date(now.getFullYear(), now.getMonth() - months, 1)

  return timeline.filter(year => {
    const yearStart = new Date(year.year, 0, 1)
    return yearStart >= cutoff
  })
}

function countActiveMonths(data: YearData[]): number {
  return data.filter(d => d.totalCommits > 0).length
}

function countUniqueRepos(data: YearData[]): number {
  const repos = new Set<string>()
  data.forEach(year => {
    year.ownedRepos.forEach(r => repos.add(r.repository.url))
    year.contributions.forEach(r => repos.add(r.repository.url))
  })
  return repos.size
}

export function getActivityLabel(score: number): string {
  if (score >= 71) return 'High'
  if (score >= 41) return 'Moderate'
  return 'Low'
}
```

**Test:** `src/lib/metrics/activity.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { calculateActivityScore, getActivityLabel } from './activity'

describe('calculateActivityScore', () => {
  it('returns 0 for empty timeline', () => {
    const result = calculateActivityScore([])
    expect(result.score).toBe(0)
    expect(result.level).toBe('Low')
  })

  it('calculates high activity correctly', () => {
    const timeline = [
      {
        year: 2025,
        totalCommits: 300,
        totalIssues: 50,
        totalPRs: 30,
        ownedRepos: [/* ... */],
        contributions: [/* ... */]
      }
    ]

    const result = calculateActivityScore(timeline)
    expect(result.score).toBeGreaterThan(70)
    expect(result.level).toBe('High')
  })

  it('calculates breakdown correctly', () => {
    const timeline = [/* test data */]
    const result = calculateActivityScore(timeline)

    expect(result.breakdown.recentCommits).toBeLessThanOrEqual(40)
    expect(result.breakdown.consistency).toBeLessThanOrEqual(30)
    expect(result.breakdown.diversity).toBeLessThanOrEqual(30)
  })
})

describe('getActivityLabel', () => {
  it('returns correct labels', () => {
    expect(getActivityLabel(85)).toBe('High')
    expect(getActivityLabel(55)).toBe('Moderate')
    expect(getActivityLabel(25)).toBe('Low')
  })
})
```

---

### Step 2.2: Impact Score

**File:** `src/lib/metrics/impact.ts`

```typescript
import { YearData } from '@/hooks/useUserAnalytics'

export interface ImpactMetric {
  score: number
  level: string
  breakdown: {
    stars: number
    forks: number
    contributors: number
    reach: number
    engagement: number
  }
  details: {
    totalStars: number
    totalForks: number
    totalWatchers: number
    totalPRs: number
    totalIssues: number
  }
}

export function calculateImpactScore(timeline: YearData[]): ImpactMetric {
  const allRepos = timeline.flatMap(y => [...y.ownedRepos, ...y.contributions])

  // A. Stars (0-35 points)
  const totalStars = allRepos.reduce((sum, r) => sum + r.repository.stargazerCount, 0)
  const starPoints = calculateStarPoints(totalStars)

  // B. Forks (0-20 points)
  const totalForks = allRepos.reduce((sum, r) => sum + r.repository.forkCount, 0)
  const forkPoints = calculateForkPoints(totalForks)

  // C. Contributors (0-15 points) - estimated from forks
  const contributorPoints = Math.min((totalForks / 100) * 15, 15)

  // D. Reach (0-20 points) - stars + forks combined
  const reachPoints = Math.min(((totalStars + totalForks) / 500) * 20, 20)

  // E. Engagement (0-10 points)
  const totalPRs = timeline.reduce((sum, y) => sum + y.totalPRs, 0)
  const totalIssues = timeline.reduce((sum, y) => sum + y.totalIssues, 0)
  const engagementPoints = Math.min(((totalPRs + totalIssues) / 200) * 10, 10)

  const score = Math.round(starPoints + forkPoints + contributorPoints + reachPoints + engagementPoints)

  return {
    score,
    level: getImpactLabel(score),
    breakdown: {
      stars: Math.round(starPoints),
      forks: Math.round(forkPoints),
      contributors: Math.round(contributorPoints),
      reach: Math.round(reachPoints),
      engagement: Math.round(engagementPoints)
    },
    details: {
      totalStars,
      totalForks,
      totalWatchers: 0, // Not available in current API
      totalPRs,
      totalIssues
    }
  }
}

function calculateStarPoints(stars: number): number {
  if (stars >= 10000) return 35
  if (stars >= 5000) return 30
  if (stars >= 1000) return 25
  if (stars >= 500) return 20
  if (stars >= 100) return 15
  if (stars >= 50) return 10
  if (stars >= 10) return 5
  return 0
}

function calculateForkPoints(forks: number): number {
  if (forks >= 1000) return 20
  if (forks >= 500) return 16
  if (forks >= 100) return 12
  if (forks >= 50) return 8
  if (forks >= 10) return 4
  return 0
}

export function getImpactLabel(score: number): string {
  if (score >= 81) return 'Exceptional'
  if (score >= 61) return 'Strong'
  if (score >= 41) return 'Moderate'
  if (score >= 21) return 'Low'
  return 'Minimal'
}
```

---

### Step 2.3: Quality & Growth

**File:** `src/lib/metrics/quality.ts` - Similar implementation
**File:** `src/lib/metrics/growth.ts` - Similar implementation
**File:** `src/lib/metrics/benchmark.ts` - Label functions

---

### Step 2.4: Reuse Existing Helpers

**From `src/lib/statistics.ts`:**

```typescript
// Reuse these functions
import { calculateLanguageStatistics } from '@/lib/statistics'

// Use in Quality metric - Stack component
const languages = calculateLanguageStatistics(allRepos)
const stackPoints = Math.min((languages.length / 5) * 10, 10)
```

---

## ✅ Deliverables

- [ ] All 4 metrics implemented (activity, impact, quality, growth)
- [ ] Each metric follows `authenticity.ts` pattern
- [ ] 100% test coverage for all calculation functions
- [ ] Benchmark labels correct (Low/Moderate/High/etc)
- [ ] Reuses helpers from `statistics.ts` where applicable
- [ ] TypeScript types defined
- [ ] All tests passing

---

## 📊 Performance Expectations

**Calculation Times:**
- Activity: <50ms
- Impact: <50ms
- Quality: <50ms
- Growth: <100ms (needs year-over-year comparison)
- **Total:** <250ms for all 4 metrics

**Optimization:**
- Use `useMemo` in components
- Calculate once per user search
- Cache results if needed

---

## 🧪 Testing Strategy

**Test Coverage Requirements:**
- Edge cases (empty data, single year, 10+ years)
- Boundary values (0, 40, 70, 100 scores)
- Breakdown sums (should equal total score)
- Label accuracy (correct labels for scores)

**Example Test Cases:**
```typescript
// Empty data
calculateActivityScore([]) → score: 0, level: 'Low'

// High activity
200 commits/3mo, 12 active months, 10 repos → score: ~85, level: 'High'

// Moderate activity
100 commits/3mo, 8 active months, 5 repos → score: ~55, level: 'Moderate'
```

---

## 🔄 Rollback Plan

**If metrics fail:**

1. **Use fallback values:**
   ```typescript
   const activity = calculateActivityScore(timeline) ?? { score: 0, level: 'Low' }
   ```

2. **Skip metrics display:**
   ```typescript
   {metrics.activity && <MetricCard {...metrics.activity} />}
   ```

3. **Revert to authenticity only:**
   - Keep UserAuthenticity component
   - Remove new metrics

---

## 📚 Resources

**Reference Documentation:**
- [metrics-explanation.md](../metrics-explanation.md) - Detailed formulas
- [authenticity.ts](../../src/lib/authenticity.ts) - Template pattern
- [statistics.ts](../../src/lib/statistics.ts) - Reusable helpers

**Testing:**
- [Vitest Docs](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Previous Phase:** [Phase 1: GraphQL Multi-Query Architecture](./phase-1-graphql-multi-query.md)
**Next Phase:** [Phase 3: Core Components](./phase-3-core-components.md)
