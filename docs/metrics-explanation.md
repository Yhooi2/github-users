# Metrics Explanation — GitHub User Analytics

**Version:** 1.0
**Date:** 2025-11-16

---

## 📊 Overview

This document defines all metrics used in the GitHub User Analytics Dashboard, explaining:
- **What** the metric measures
- **How** it's calculated (formula)
- **Why** it matters for evaluating candidates
- **What** the benchmark ranges mean

---

## 🎯 Quick Assessment Metrics

These four metrics provide instant insight for hire/no-hire decisions.

---

### 1. Activity Score

**Purpose:** Measures how actively the developer is coding on GitHub

**Range:** 0-100%

#### Calculation Formula:

```
Activity Score = (Recent Commits × 40%) +
                 (Consistency × 30%) +
                 (Diversity × 30%)
```

#### Component Breakdown:

**A. Recent Commits (0-40 points)**
```typescript
// Last 3 months of commit activity
const recentCommits = getTotalCommits(last3Months)
const points = Math.min((recentCommits / 200) * 40, 40)

// Scoring:
// 0-20 commits   → 0-4 points
// 21-50 commits  → 5-10 points
// 51-100 commits → 11-20 points
// 101-200 commits→ 21-40 points
```

**B. Consistency (0-30 points)**
```typescript
// Commit streak and frequency
const monthsActive = countActiveMonths(last12Months)
const avgCommitsPerMonth = totalCommits / 12

// Scoring:
// 0-3 months active      → 0-10 points
// 4-6 months active      → 11-15 points
// 7-9 months active      → 16-20 points
// 10-12 months active    → 21-30 points

// Bonus: +5 points for current streak >30 days
```

**C. Diversity (0-30 points)**
```typescript
// Number of different repositories with commits
const activeRepos = countReposWithCommits(last3Months)

// Scoring:
// 1-3 repos    → 0-10 points (focused)
// 4-7 repos    → 11-20 points (balanced)
// 8-15 repos   → 21-30 points (diverse)
// 16+ repos    → 25 points (too scattered?)
```

#### Benchmark Ranges:

| Score | Label | Interpretation | Action |
|-------|-------|----------------|--------|
| 0-40% | Low | Inactive or sporadic coder | ⚠️ Concern |
| 41-70% | Moderate | Regular contributor | ✅ Consider |
| 71-100% | High | Very active developer | ⭐ Strong |

#### Visual Representation:

```
Activity Score: 85%

Breakdown:
Recent commits (last 3m): 156 commits
████████████████████████████████████ 40/40 points

Consistency (12m active):   12 months streak
██████████████████████████████ 30/30 points

Diversity (8 active repos): Balanced portfolio
███████████████ 15/30 points

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 85/100 points → High Activity
```

#### Data Sources:
- GitHub Contributions API (last 12 months)
- Commit history from all accessible repositories
- Updated every 5 minutes

---

### 2. Impact Score

**Purpose:** Measures the reach and influence of the developer's work

**Range:** 0-100%

#### Calculation Formula:

```
Impact Score = (Stars × 35%) +
               (Forks × 20%) +
               (Contributors × 15%) +
               (Contribution Reach × 20%) +
               (Community Engagement × 10%)
```

#### Component Breakdown:

**A. Repository Stars (0-35 points)**
```typescript
// Total stars across all owned repositories
const totalStars = ownedRepos.reduce((sum, r) => sum + r.stars, 0)

// Scoring (logarithmic scale):
// 0-10 stars      → 0-5 points
// 11-50 stars     → 6-10 points
// 51-100 stars    → 11-15 points
// 101-500 stars   → 16-25 points
// 501-1000 stars  → 26-30 points
// 1001+ stars     → 31-35 points
```

**B. Fork Count (0-20 points)**
```typescript
// Total forks across owned repos
const totalForks = ownedRepos.reduce((sum, r) => sum + r.forks, 0)

// Scoring:
// 0-5 forks       → 0-5 points
// 6-20 forks      → 6-10 points
// 21-50 forks     → 11-15 points
// 51+ forks       → 16-20 points
```

**C. Contributors (0-15 points)**
```typescript
// Number of repos with >1 contributor (community projects)
const communityRepos = ownedRepos.filter(r => r.contributors > 1)

// Scoring:
// 0-2 repos       → 0-5 points
// 3-5 repos       → 6-10 points
// 6+ repos        → 11-15 points
```

**D. Contribution Reach (0-20 points)**
```typescript
// Number of different repos contributed to (not owned)
const contributedRepos = contributions.length

// Scoring:
// 0-5 repos       → 0-5 points
// 6-15 repos      → 6-12 points
// 16-30 repos     → 13-17 points
// 31+ repos       → 18-20 points
```

**E. Community Engagement (0-10 points)**
```typescript
// Issues created + PRs opened
const engagement = totalIssues + totalPRs

// Scoring:
// 0-10 interactions    → 0-3 points
// 11-50 interactions   → 4-7 points
// 51+ interactions     → 8-10 points
```

#### Benchmark Ranges:

| Score | Label | Interpretation | Action |
|-------|-------|----------------|--------|
| 0-40% | Limited | Few public contributions | ⚠️ Junior level |
| 41-70% | Moderate | Some community presence | ✅ Mid-level |
| 71-100% | Strong | Recognized contributor | ⭐ Senior/Lead |

#### Visual Representation:

```
Impact Score: 72%

Breakdown:
Stars (1,234 total):
█████████████████████████ 28/35 points

Forks (189 total):
████████████████ 18/20 points

Contributors (8 community repos):
███████████ 12/15 points

Contribution reach (23 repos):
███████████ 14/20 points

Community engagement (89 issues + 156 PRs):
████████ 8/10 points

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 72/100 points → Strong Impact
```

#### Top Impactful Repositories:
1. my-awesome-project: 456 ⭐, 89 🍴
2. another-repo: 234 ⭐, 34 🍴
3. open-source-lib: 189 ⭐, 23 🍴

#### Data Sources:
- Repository stargazers count
- Fork network size
- Contributor lists
- Issue/PR activity
- Updated every 10 minutes

---

### 3. Quality Score

**Purpose:** Measures code quality indicators and best practices

**Range:** 0-100%

#### Calculation Formula:

```
Quality Score = (Originality × 30%) +
                (Documentation × 25%) +
                (Code Ownership × 20%) +
                (Project Maturity × 15%) +
                (Technology Stack × 10%)
```

#### Component Breakdown:

**A. Originality (0-30 points)**
```typescript
// Percentage of non-forked, original repositories
const originalRepos = repos.filter(r => !r.isFork)
const originalityRatio = originalRepos.length / repos.length

// Scoring:
// <30% original    → 0-10 points (mostly forks)
// 30-50% original  → 11-15 points (mixed)
// 51-70% original  → 16-20 points (good)
// 71-90% original  → 21-25 points (very good)
// >90% original    → 26-30 points (excellent)
```

**B. Documentation (0-25 points)**
```typescript
// Repos with README + LICENSE + docs
const withReadme = repos.filter(r => hasReadme(r)).length
const withLicense = repos.filter(r => r.license).length
const withHomepage = repos.filter(r => r.homepage).length

const docScore = (
  (withReadme / repos.length) * 10 +
  (withLicense / repos.length) * 10 +
  (withHomepage / repos.length) * 5
)

// Scoring:
// <30% documented   → 0-8 points
// 30-50% documented → 9-12 points
// 51-70% documented → 13-18 points
// 71-90% documented → 19-22 points
// >90% documented   → 23-25 points
```

**C. Code Ownership (0-20 points)**
```typescript
// Average commit percentage in owned repos
const avgOwnership = ownedRepos.reduce((sum, r) =>
  sum + (r.userCommits / r.totalCommits), 0
) / ownedRepos.length

// Scoring:
// <20% ownership  → 0-5 points (minor contributor)
// 20-40% ownership→ 6-10 points (co-maintainer)
// 41-60% ownership→ 11-15 points (main contributor)
// >60% ownership  → 16-20 points (primary author)
```

**D. Project Maturity (0-15 points)**
```typescript
// Age and activity of repositories
const matureRepos = repos.filter(r => {
  const ageMonths = monthsSince(r.createdAt)
  const recentActivity = daysSince(r.pushedAt) < 90
  return ageMonths > 6 && recentActivity
})

// Scoring:
// 0-20% mature     → 0-5 points
// 21-40% mature    → 6-10 points
// >40% mature      → 11-15 points
```

**E. Technology Stack (0-10 points)**
```typescript
// Diversity of modern technologies
const modernTechs = ['TypeScript', 'Rust', 'Go', 'Python']
const usedTechs = new Set(repos.flatMap(r => r.languages))
const modernUsage = modernTechs.filter(t => usedTechs.has(t))

// Scoring:
// 0-1 modern tech  → 0-3 points
// 2-3 modern tech  → 4-7 points
// 4+ modern tech   → 8-10 points
```

#### Benchmark Ranges:

| Score | Label | Interpretation | Action |
|-------|-------|----------------|--------|
| 0-40% | Poor | Low quality indicators | ❌ Red flag |
| 41-70% | Good | Adequate practices | ✅ Acceptable |
| 71-100% | Excellent | High standards | ⭐ Impressive |

#### Visual Representation:

```
Quality Score: 68%

Breakdown:
Originality (85% original repos):
█████████████████████████ 25/30 points

Documentation (72% have README+License):
██████████████████ 18/25 points

Code ownership (avg 58% in owned repos):
█████████████ 14/20 points

Project maturity (45% mature & active):
███████████ 11/15 points

Technology stack (TS, Python, Go):
███████ 7/10 points

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 68/100 points → Good Quality
```

#### Data Sources:
- Repository metadata (fork status, creation date)
- File analysis (README, LICENSE detection)
- Commit history analysis
- Language statistics
- Updated every 30 minutes

---

### 4. Growth Score

**Purpose:** Measures developer growth and improvement over time

**Range:** -100% to +100%

#### Calculation Formula:

```
Growth Score = Year-over-Year Change in:
  (Activity × 40%) +
  (Impact × 30%) +
  (Skill Expansion × 30%)
```

#### Component Breakdown:

**A. Activity Growth (0-40 points)**
```typescript
// Compare commits: current year vs previous year
const thisYearCommits = yearlyData[currentYear].totalCommits
const lastYearCommits = yearlyData[currentYear - 1].totalCommits
const activityGrowth = ((thisYear - lastYear) / lastYear) * 100

// Scoring:
// -50% or less    → -20 points (declining)
// -49% to -10%    → -10 to 0 points (slight decline)
// -9% to +9%      → 0 to 10 points (stable)
// +10% to +50%    → 11 to 30 points (growing)
// +51% or more    → 31 to 40 points (rapid growth)
```

**B. Impact Growth (0-30 points)**
```typescript
// Compare stars/forks gained this year vs last
const thisYearStars = calculateNewStars(currentYear)
const lastYearStars = calculateNewStars(currentYear - 1)
const impactGrowth = ((thisYear - lastYear) / lastYear) * 100

// Similar scoring to activity growth, scaled to 30 points
```

**C. Skill Expansion (0-30 points)**
```typescript
// New languages or technologies learned
const thisYearLangs = yearlyData[currentYear].languages
const lastYearLangs = yearlyData[currentYear - 1].languages
const newLanguages = thisYearLangs.filter(l => !lastYearLangs.includes(l))

// Scoring:
// 0 new languages    → 0-10 points (stagnant)
// 1-2 new languages  → 11-20 points (learning)
// 3+ new languages   → 21-30 points (expanding)
```

#### Benchmark Ranges:

| Score | Label | Interpretation | Action |
|-------|-------|----------------|--------|
| <-20% | Declining | Activity decreasing | ⚠️ Concern |
| -19% to +9% | Stable | Consistent activity | ✅ Steady |
| +10% to +49% | Growing | Improving developer | ⭐ Good |
| +50%+ | Rapid | Exponential growth | 🚀 Excellent |

#### Visual Representation:

```
Growth Score: +24%

Breakdown:
Activity growth (2024 vs 2023):
2023: 456 commits
2024: 678 commits → +48.7% growth
████████████████████████████ 35/40 points

Impact growth (stars gained):
2023: +89 stars
2024: +234 stars → +163% growth
██████████████████████████ 30/30 points

Skill expansion:
New in 2024: TypeScript, Rust
████████████ 15/30 points

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: +24% YoY growth → Growing
```

#### Data Sources:
- Year-over-year commit comparison
- Repository creation/star timeline
- Language usage trends
- Updated daily

---

## 📊 Timeline Metrics

These metrics provide year-by-year breakdown.

---

### Year Activity Breakdown

For each year, we calculate:

#### Total Contributions:
```typescript
interface YearMetrics {
  year: number
  totalCommits: number
  totalIssues: number
  totalPRs: number
  totalReviews: number

  // Breakdown by type
  ownedRepos: Repository[]      // User is owner
  contributions: Repository[]    // Contributed to others

  // Time distribution
  peakMonth: string             // Month with most commits
  activeMonths: number          // Months with >0 commits
  avgCommitsPerMonth: number

  // Technology
  languages: LanguageStats[]
  topLanguage: string
}
```

#### Visual Representation:

```
2024 Activity: 678 commits

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CONTRIBUTION TYPES:
• Commits:      678 ████████████████████
• Issues:        45 ██
• Pull Requests: 89 ████
• Code Reviews:  34 ██

📦 PROJECT BREAKDOWN:
Your Projects (15 repos):
• my-awesome-project: 234 commits
• another-repo:        89 commits
• third-project:       45 commits

Open Source (8 repos):
• facebook/react:      89 commits
• vercel/next.js:      23 commits

📅 MONTHLY DISTRIBUTION:
Peak: July (89 commits)
Active: 12/12 months
Avg: 56.5 commits/month

💻 LANGUAGES:
TypeScript  ████████████████ 65%
JavaScript  ████         25%
CSS         ██            10%
```

---

## 🏆 Project-Level Metrics

For individual repositories:

### Contribution Percentage

```typescript
interface ContributionMetric {
  userCommits: number
  totalCommits: number
  percentage: number
  role: 'Primary' | 'Co-Maintainer' | 'Contributor' | 'Minor'
}

// Role determination:
// >60% → Primary Author
// 40-60% → Co-Maintainer
// 10-40% → Contributor
// <10% → Minor Contributor
```

### Repository Health

```typescript
interface RepositoryHealth {
  stars: number
  forks: number
  watchers: number
  openIssues: number

  // Activity indicators
  lastCommit: Date
  ageMonths: number
  isActive: boolean  // Commit in last 90 days
  isArchived: boolean

  // Quality indicators
  hasReadme: boolean
  hasLicense: boolean
  hasHomepage: boolean
  hasTopics: boolean
}
```

---

## 📈 Comparative Metrics

### Benchmarks

All scores are compared against:

1. **GitHub Average** — Median of all GitHub users
2. **Language-Specific** — Developers using same primary language
3. **Experience Level** — Based on account age

Example:
```
Your Activity Score: 85%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GitHub Average:      54% ───── (You: +31%)
TypeScript Devs:     67% ───── (You: +18%)
2-3 Year Experience: 71% ───── (You: +14%)

Percentile: Top 15% of all users
```

---

## 🔄 Update Frequency

| Metric | Update Frequency | Cache Duration |
|--------|-----------------|----------------|
| Activity Score | 5 minutes | 5 minutes |
| Impact Score | 10 minutes | 10 minutes |
| Quality Score | 30 minutes | 30 minutes |
| Growth Score | 24 hours | 24 hours |
| Timeline Data | 1 hour | 1 hour |

---

## 📚 Data Sources

All metrics derive from:

1. **GitHub GraphQL API**
   - Contributions Collection
   - Repository metadata
   - Commit history

2. **Computed Analytics**
   - Language distribution (GitHub Linguist)
   - Contributor counts (Git log analysis)
   - Activity trends (Time series analysis)

3. **Third-Party Benchmarks** (optional future)
   - GitHub Archive data
   - OSS Insight statistics

---

## 🎯 Usage Examples

### For Recruiters:

**Screening:**
- Activity >70% → Active coder ✅
- Impact >60% → Has influence ✅
- Quality >50% → Good practices ✅
- Growth >0% → Improving ✅

**Red Flags:**
- Activity <40% → Inactive ⚠️
- Quality <40% → Poor practices ❌
- Growth <-20% → Declining ⚠️

### For Developers (Self-Assessment):

**Improvement Areas:**
- Low Activity → Commit more regularly
- Low Impact → Focus on quality over quantity
- Low Quality → Add documentation, licenses
- Negative Growth → Learn new technologies

---

**Last Updated:** 2025-11-16
**Version:** 1.0
**Next Review:** After Phase 3 implementation
