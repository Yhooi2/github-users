# Metrics Explanation — GitHub User Analytics V2

**Version:** 2.0
**Date:** 2025-11-17
**Status:** Conceptual - See [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md) for API limitations

**⚠️ API LIMITATIONS WARNING:**

This document describes metrics v2.0 concepts. However, some GitHub GraphQL API limitations affect implementation:

- ❌ **commit.additions/deletions** - NOT available in GitHub GraphQL API
- ✅ **pullRequest.additions/deletions** - Available (but requires fetching all PRs = slow + rate limit)
- ❌ **commit.author.email** - NOT available (privacy reasons)
- ✅ **commit.author.user** - Available (null if email not linked to GitHub account)

**Recommendation:** Use metrics v1.0 (based on `src/lib/authenticity.ts`) which uses only available API fields.

---

## 📊 Overview

This document explains the GitHub User Analytics metrics system:
- **What** each metric measures
- **How** it's calculated (formulas)
- **Why** it matters for evaluating developers
- **What** the benchmark ranges mean
- **How** to detect fraud and fake activity

---

## 🎯 Main Question

**"Can this person bring value to our team?"**

This question breaks down into 4 sub-questions:

1. **Do they work regularly?** → **Activity Score**
2. **Do people use their work?** → **Impact Score**
3. **Do they write reliable code?** → **Quality Score (Engineering Maturity)**
4. **Are they growing?** → **Growth Score (Learning Trajectory)**

Plus: **Fraud Detection** to identify fake GitHub activity patterns.

---

## 🛡️ FRAUD DETECTION SYSTEM

### Purpose

Detect GitHub farming and fake activity created using tools that manipulate `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE`.

### Fraud Score: 0-100

**Formula:**
```
Fraud Score = (empty_commits_ratio × 30) +
              (perfect_pattern_score × 25) +
              (temporal_anomaly × 20) +
              (mass_commits_ratio × 15) +
              (fork_without_changes × 10)
```

**Range:** 0-100 (where 100 = 100% suspicion of fraud)

### Detection Signals

| Signal | How to Detect | Weight | Criticality |
|--------|---------------|--------|-------------|
| **Empty commits** | `additions + deletions == 0` | 30% | 🔴 High |
| **Backdated commits** | Commits before account creation | Auto-flag | 🔴 Critical |
| **Bot patterns** | Perfect daily commits at same time | 25% | 🟡 Medium |
| **Temporal anomalies** | Commits outside usual working hours | 20% | 🟢 Low |
| **Mass commits** | >1000 lines in single commit | 15% | 🟡 Medium |
| **Fork farming** | Many forks with no modifications | 10% | 🟡 Medium |
| **Multiple emails** | >10 different emails in commits | Flag only | 🟡 Medium |
| **No GPG signing** | All commits unverified | Flag only | 🟢 Low |

### Benchmark Ranges

| Score | Level | Interpretation | Action |
|-------|-------|----------------|--------|
| 0-19 | Clean | No suspicious patterns | ✅ Safe to hire |
| 20-39 | Low Risk | Minor irregularities | ⚠️ Monitor |
| 40-59 | Medium Risk | Multiple red flags | 🟡 Investigate further |
| 60-79 | High Risk | Significant fraud indicators | 🔴 Major concern |
| 80-100 | Critical | Likely fake profile | ❌ Do not hire |

### Example Output

```
⚠️ Fraud Risk: 35% (Medium)

Issues detected:
• 15% of commits are empty (4.5 points)
• 30% commits outside working hours (6.0 points)
• 8 different email addresses used (flag)
• 3 unmodified forks in profile (3.0 points)

Total Score: 35/100 → Medium Risk

Recommendations:
✓ Use GPG signing for verified commits
✓ Clean up inactive forks
✓ Add meaningful commit messages
```

---

## 📊 METRIC 1: Activity Score → Productivity Signal

### Purpose

Measures **how productively** the developer works, not just "how many commits". Focuses on real code output and work patterns.

**Range:** 0-100 points

### Formula

```
Activity = Code Throughput (35) +
           Consistency & Rhythm (25) +
           Collaboration (20) +
           Project Focus (20)
```

### Components

#### A. Code Throughput (0-35 points)

**What it measures:** Real output via **lines changed** in **merged PRs**.

**Why:** 1 commit can be 1 line or 10,000 lines. Lines changed is a more honest indicator.

**Calculation:**
```typescript
linesChanged = sum(mergedPRs.map(pr => pr.additions + pr.deletions))
linesPerMonth = linesChanged / 3 // Last 3 months

Scoring:
• 0-1000 lines/month     → 0-15 points (Low)
• 1000-5000 lines/month  → 15-25 points (Moderate)
• 5000-15000 lines/month → 25-35 points (High)
• 15000+ lines/month     → 35 points (Very High)

Penalty: -10 points if >50% of code in mass commits (>1000 lines)
```

**Anti-fake protection:**
- Ignore repos with one massive commit (90% code in single PR = likely clone)
- Flag if average PR size >1000 lines

---

#### B. Consistency & Rhythm (0-25 points)

**What it measures:** Regular work patterns and commit streaks.

**Calculation:**
```typescript
activeWeeks = count weeks with ≥1 commit (last 12 months)
longestStreak = max consecutive active weeks

Base score:
• 40+ weeks out of 52 → 20-25 points (High)
• 20-39 weeks → 10-19 points (Moderate)
• <20 weeks → 0-9 points (Low)

Bonus: +5 points if longestStreak ≥ 26 weeks (half year)
```

**Temporal Pattern Analysis (Anti-bot):**
```typescript
// Build hour histogram (0-23 hours)
commitTimes = commits.map(c => hour(c.committedDate))
workingWindow = findWindow(commitTimes, 80%) // Where 80% commits are

Flag if >10% commits outside working window
Penalty: -5 points for irregular patterns
```

**Red flags:**
- ❌ Commits every day at exactly 8:00 AM → bot pattern
- ✅ Commits scattered 9 AM - 6 PM → normal human pattern
- ⚠️ Sudden timezone change (was 9-17 UTC, became 2-5 UTC) → suspicious

---

#### C. Collaboration (0-20 points)

**What it measures:** Teamwork through PR reviews, issue participation, discussions.

**Why it matters:** Senior developers spend 30-50% of time on code reviews.

**Calculation:**
```typescript
reviewsDone = count substantive PR reviews (last 6 months)
issuesParticipated = count unique issues with comments
prDiscussionsAvg = avg comments per own PR

Scoring:
• Reviews:     20+ reviews → 10 points
• Issues:      10+ issues participated → 5 points
• Discussions: 3+ avg comments per PR → 5 points
```

**Anti-fake protection:**
- Filter out "LGTM" only reviews (less than 10 characters)
- Filter out "me too" only comments

**Note:** Solo coders will score 0 here — that's OK for freelancers!

---

#### D. Project Focus (0-20 points)

**What it measures:** Specialization vs scatter across repositories.

**The Paradox:**
```
1 repo     = excellent (deep focus)
2-5 repos  = ideal (perfect balance)
6-10 repos = good (wide range)
11-20 repos = suspicious (scattered)
20+ repos = red flag (likely fake or bot)
```

**Calculation:**
```typescript
activeRepos = count repos with commits in last 3 months

Scoring:
• 2-5 repos   → 20 points (ideal balance)
• 1 repo      → 15 points (deep focus)
• 6-10 repos  → 12 points (wide range)
• 11-20 repos → 5 points (scattered)
• 20+ repos   → 0 points (suspicious)

Penalties:
• -5 points if >50% repos are unmodified forks
• -5 points if >70% repos created on same day
```

### Benchmark Ranges

| Score | Level | Interpretation | Hiring Decision |
|-------|-------|----------------|-----------------|
| 0-39 | Low | Inactive or inconsistent work | ⚠️ Concern |
| 40-59 | Moderate | Regular contributor | ✅ Consider |
| 60-79 | High | Strong consistent productivity | ⭐ Strong candidate |
| 80-100 | Very High | Elite developer productivity | 🌟 Excellent |

### Example Output

```
Activity Score: 85/100 (High) ✅

Breakdown:
├─ Code Throughput:      35/35 (12,500 lines/month)
├─ Consistency & Rhythm: 25/25 (48 weeks active, 32-week streak)
├─ Collaboration:        18/20 (25 reviews, 12 issues)
└─ Project Focus:        20/20 (4 active repos, balanced)

Fraud Risk: 12% (Low) ✅
```

---

## 🌟 METRIC 2: Impact Score → Ecosystem Reach

### Purpose

Measures **whether people actually use the developer's work**, not just stars (which can be bought).

**Range:** 0-100 points

### Formula

```
Impact = Adoption Signal (40) +
         Community Engagement (30) +
         Social Proof (20) +
         Package Registry Stats (10)
```

### Components

#### A. Adoption Signal (0-40 points)

**What it measures:** Real usage indicators.

**Calculation:**
```typescript
activeForks = forks with commits ahead of parent (real modifications)
watchers = people following repo updates
contributors = developers who committed
recentActivity = pushed in last 30 days

Score =
  log10(activeForks + 1) × 5 +
  log10(watchers + 1) × 3 +
  min(contributors × 0.5, 10) +
  (recentActivity ? 5 : 0)
```

**Anti-fake protection:**
- Check if forks have actual commits (not just empty forks)
- Verify issues/PRs exist (sign of live project)

**Why active forks matter:** 100 forks with 0 changes = nobody actually uses it. 10 forks with 50+ commits each = real adoption.

---

#### B. Community Engagement (0-30 points)

**What it measures:** Live community activity.

**Calculation:**
```typescript
totalIssues = sum of all issues across repos
closedIssues = issues marked as closed
closureRate = closedIssues / totalIssues
externalPRs = PRs from contributors (not repo owner)

Scoring:
• Issues (0-15 points):
  - 50+ issues + >50% closed → 15 points
  - 10-50 issues → 10 points
  - <10 issues but >80% closed → 8 points (small but responsive)
  - <10 issues + <50% closed → 3 points

• External PRs (0-10 points):
  - 20+ external PRs → 10 points
  - Proportional scaling

• Discussions (0-5 points):
  - GitHub Discussions/Wiki activity
```

**Why issues matter:**
- 0 issues ≠ perfect code
- 0 issues = either nobody uses it OR maintainer ignores them

---

#### C. Social Proof (0-20 points)

**What it measures:** Stars and visibility (with logarithmic scale to prevent gaming).

**Calculation:**
```typescript
starsScore = min(log10(totalStars + 1) × 3, 15)
trendingBonus = wasInTrending ? 5 : 0

Total = starsScore + trendingBonus
```

**Why logarithmic scale:**
```
10 stars → 1,000 stars = +2 points
1,000 stars → 10,000 stars = +2 points (not +9000)
```

This prevents star farming from having outsized impact.

---

#### D. Package Registry Stats (0-10 points)

**What it measures:** Real package downloads from npm/PyPI/crates.io/Docker Hub.

**MVP Implementation:**
```typescript
hasPackageJson = repo has package.json → 5 points
hasDownloadStats = can fetch npm/PyPI stats → +5 points
```

**⚠️ DEFERRED TO PHASE 5+** — Requires external API calls to npm, PyPI, etc.

### Benchmark Ranges

| Score | Level | Interpretation | Hiring Decision |
|-------|-------|----------------|-----------------|
| 0-19 | None | No community presence | ⚠️ Junior |
| 20-39 | Local | Small personal projects | ✅ Mid-level potential |
| 40-59 | Community | Active in OSS community | ⭐ Mid to Senior |
| 60-79 | Regional | Recognized in ecosystem | 🌟 Senior |
| 80-100 | Global | Industry-wide impact | 💎 Staff/Principal |

### Example Output

```
Impact Score: 72/100 (Regional) ⭐

Top Projects:
1. awesome-lib (75 impact points)
   2,450 stars, 350 active forks
   120 contributors, 850 issues (70% closed)
   50K npm downloads/month

2. useful-tool (62 impact points)
   850 stars, 80 active forks
   25 contributors, maintained (pushed 3 days ago)

Breakdown:
├─ Adoption Signal:      38/40 (350 active forks, 2.5K watchers)
├─ Community Engagement: 28/30 (850 issues, 70% closed, 45 ext PRs)
├─ Social Proof:         18/20 (3,300 total stars, was trending)
└─ Package Stats:        5/10 (publishable, stats pending)
```

---

## 🏆 METRIC 3: Quality Score → Engineering Maturity

### Purpose

Measures **engineering maturity** through code health practices, not "originality" (which is impossible to measure accurately).

**Range:** 0-100 points

### Formula

```
Quality = Code Health Practices (35) +
          Documentation Quality (25) +
          Maintenance Signal (25) +
          Architecture Complexity (15)
```

### Components

#### A. Code Health Practices (0-35 points)

**What it measures:** Modern engineering habits.

**Calculation:**
```typescript
Scoring:
• CI/CD (0-15 points):
  - GitHub Actions / CircleCI / Travis exists
  - Automated tests run in CI
  - (repos with CI/CD / total repos) × 15

• Testing (0-10 points):
  - Test directory exists (test/, tests/, __tests__)
  - Test frameworks in dependencies
  - (repos with tests / total) × 10

• Linting/Formatting (0-5 points):
  - .eslintrc, .prettierrc, pyproject.toml
  - Pre-commit hooks
  - (repos with linting / total) × 5

• Code Review Process (0-5 points):
  - Branch protection rules enabled
  - Required reviewers configured
  - (protected repos / total) × 5
```

**How to check:** Use GitHub GraphQL `repository.object(expression: "HEAD:")` to get file tree in one request.

---

#### B. Documentation Quality (0-25 points)

**What it measures:** How well projects are documented.

**Calculation:**
```typescript
Per repository:

README (0-15 points):
• Length score (0-8):
  - >5000 chars → 8 points (comprehensive)
  - 2000-5000 → 6 points (detailed)
  - 500-2000 → 4 points (basic)
  - <500 → 2 points (minimal)

• Content score (0-7):
  - Has "Installation" section → 2 points
  - Has "Usage" section → 2 points
  - Has "Examples" → 1 point
  - Has "Contributing" → 1 point
  - Has "License" → 1 point

Wiki (0-5 points):
• GitHub Wiki enabled with content → 5 points

Docs Site (0-5 points):
• GitHub Pages / dedicated docs website → 5 points
```

**Anti-fake protection:**
- Flag if README >90% copy of another project (fuzzy string matching)

---

#### C. Maintenance Signal (0-25 points)

**What it measures:** Responsiveness and project longevity.

**Calculation:**
```typescript
• Issue Response Time (0-10 points):
  medianResponseTime = median hours from issue creation to first response

  Scoring:
  - <24h → 10 points
  - 1-3 days → 7 points
  - 1 week → 4 points
  - >1 month → 0 points

• Issue Resolution Rate (0-10 points):
  closureRate = closed issues / total issues

  Scoring:
  - >70% → 10 points
  - 50-70% → 7 points
  - <50% → 3 points

• Project Longevity (0-5 points):
  ageInYears = years since repo creation
  recentActivity = pushed in last 90 days

  Scoring:
  - Age >2 years + active → 5 points
  - Old but abandoned → 0 points
```

**Why this matters:** Shows maintainer doesn't abandon projects and is responsive to community.

---

#### D. Architecture Complexity (0-15 points)

**What it measures:** Technical depth and scale.

**Calculation:**
```typescript
• Project Size (0-5 points):
  avgDiskUsage = average disk usage across repos

  Scoring:
  - >10MB → 5 points (substantial)
  - 1-10MB → 3 points (moderate)
  - <1MB → 1 point (small)

• Tech Stack Diversity (0-5 points):
  uniqueLanguages = count languages with >1% of codebase

  Scoring:
  - 5+ languages → 5 points (polyglot)
  - 3-4 languages → 3 points (diverse)
  - 1-2 languages → 1 point (focused)

• Infrastructure (0-5 points):
  - Has Dockerfile/docker-compose → 3 points
  - Has database migrations → 1 point
  - Has API docs (Swagger/OpenAPI) → 1 point
```

**Anti-fake protection:**
- If many languages but 99% one language → don't count
- Check for real code vs just config files

### Benchmark Ranges

| Score | Level | Interpretation | Hiring Decision |
|-------|-------|----------------|-----------------|
| 0-39 | Beginner | Basic or learning projects | ⚠️ Junior |
| 40-59 | Intermediate | Decent practices | ✅ Mid-level |
| 60-74 | Advanced | Strong engineering | ⭐ Senior |
| 75-89 | Expert | Excellent practices | 🌟 Staff |
| 90-100 | Master | Industry-leading quality | 💎 Principal |

### Example Output

```
Quality Score: 78/100 (Expert) 🌟

Breakdown:
├─ Code Health:      32/35 (CI/CD: 95%, Tests: 90%, Linting: 85%)
├─ Documentation:    22/25 (Avg README: 4200 chars, 8 wikis, 3 docs sites)
├─ Maintenance:      20/25 (Response: 18h median, Resolution: 72%)
└─ Architecture:     12/15 (Avg: 8.5MB, 4 languages, Docker: 80%)
```

---

## 📈 METRIC 4: Growth Score → Learning Trajectory

### Purpose

Measures **whether the developer is growing as an engineer**, not just whether commit count increases.

**Range:** -100 to +100 points

### Formula

```
Growth = Skill Expansion (40) +
         Project Evolution (30) +
         Learning Pattern Detection (30)
```

### Components

#### A. Skill Expansion (0-40 points)

**What it measures:** New technologies learned.

**Calculation:**
```typescript
recentLanguages = unique languages in repos created last 2 years
olderLanguages = unique languages in repos created 3-5 years ago
newLanguages = recentLanguages - olderLanguages

score = min(newLanguages.size × 10, 40)
```

**Examples:**
- Was only JavaScript, added TypeScript + Rust = +20 points
- Was Python, added Go + Kubernetes = +20 points
- Same Java for 10 years = 0 points (stagnation)

---

#### B. Project Evolution (-30 to +30 points)

**What it measures:** Growth in project complexity over time.

**Calculation:**
```typescript
recentProjects = repos created in last 2 years
olderProjects = repos created 3-5 years ago

complexityScore(repo) =
  stars × 2 +
  forks × 3 +
  diskUsage / 1000 +
  languages × 5 +
  (hasCICD ? 20 : 0)

recentAvg = avg complexity of recent projects
olderAvg = avg complexity of older projects

growthRate = ((recentAvg - olderAvg) / olderAvg) × 100%
score = max(-30, min(growthRate / 3, 30))
```

**Examples:**
- 2020: tutorial projects, 0 stars → 2024: production apps, 100 stars = +30 points
- 2020: 500 stars → 2024: 50 stars = -20 points (declining)

---

#### C. Learning Pattern Detection (0-30 points)

**What it measures:** Balance between learning (tutorials) and shipping (production).

**Tutorial Project Detection:**
```typescript
isTutorial(repo) =
  name includes 'tutorial', 'learning', 'course', 'homework', 'practice' OR
  description includes 'learning', 'following tutorial' OR
  (0 stars AND 0 forks AND abandoned after 2 weeks)
```

**Production Project Detection:**
```typescript
isProduction(repo) =
  stars > 10 OR
  forks > 3 OR
  has CI/CD OR
  issues > 5 OR
  contributors > 3 OR
  pushed in last 90 days
```

**Scoring:**
```typescript
tutorialRatio = tutorial projects / total
productionRatio = production projects / total

Ideal balance:
• 20% tutorial (experimenting)
• 60% production (shipping value)
• 20% abandoned (normal)

Scoring:
• 100% tutorials → 0 points (only learning, not shipping)
• 100% production → 20 points (shipping, but not experimenting)
• 15-25% tutorials + 50-70% production → 30 points (ideal!)
```

### Benchmark Ranges

| Score | Trend | Interpretation | Hiring Decision |
|-------|-------|----------------|-----------------|
| -100 to -30 | Declining | Skills/projects deteriorating | 🔴 Concern |
| -30 to +30 | Stable | Maintaining current level | ⚠️ Monitor |
| +30 to +70 | Growing | Actively learning & improving | ⭐ Strong |
| +70 to +100 | Accelerating | Rapid skill development | 🌟 Excellent |

### Example Output

```
Growth Score: +75/100 (Accelerating) 🚀

Timeline:
2020: JavaScript only, tutorial projects (complexity: 15)
2021: +TypeScript, first production app (complexity: 45)
2022: +Rust, contributing to OSS (complexity: 85)
2023: +Go, maintaining 3 production apps (complexity: 120)
2024: +Kubernetes, teaching others (complexity: 180)

Breakdown:
├─ Skill Expansion:      40/40 (4 new languages in 2 years)
├─ Project Evolution:    28/30 (+650% complexity growth)
└─ Learning Pattern:     30/30 (18% tutorials, 65% production)

Balance: Ideal (actively learning while shipping) ✅
```

---

## 🎖️ OVERALL RANK

### Overall Score Formula

```typescript
Overall =
  Activity × 0.25 +
  Impact × 0.30 +
  Quality × 0.30 +
  max(0, Growth) × 0.15

Note: Growth can be negative, but we use max(0, Growth) so
declining growth doesn't penalize too harshly.
```

### Rank Classification

| Rank | Overall Score | Requirements | Expected Level |
|------|---------------|--------------|----------------|
| **Junior** | 0-29 | Low activity, little experience | Entry-level |
| **Mid** | 30-49 | Regular work, some projects | 2-4 years exp |
| **Senior** | 50-69 | High Quality (>60), Impact (>40) | 5-8 years exp |
| **Staff** | 70-84 | Senior + High Impact (>70) | 8-12 years exp |
| **Principal** | 85-100 | Staff + Very High Activity (>70) + Global Impact (>80) | 12+ years exp |

### Example Rankings

**Example 1: Linus Torvalds**
```
Activity:  85 (High, delegates much work)
Impact:    100 (Linux kernel — billions of devices)
Quality:   95 (Expert maintainer, 30+ year project)
Growth:    +40 (Stable, mature)

Overall = 85×0.25 + 100×0.30 + 95×0.30 + 40×0.15
        = 21.25 + 30 + 28.5 + 6
        = 85.75

→ Rank: Principal 💎
```

**Example 2: Growing Junior Developer**
```
Activity:  45 (Moderate consistency, learning)
Impact:    15 (Local projects only, <100 stars)
Quality:   35 (Basic practices, minimal docs)
Growth:    +60 (Learning fast! 3 new languages)

Overall = 45×0.25 + 15×0.30 + 35×0.30 + 60×0.15
        = 11.25 + 4.5 + 10.5 + 9
        = 35.25

→ Rank: Mid ✅ (but growing rapidly — worth investing in!)
```

**Example 3: Experienced Mid-Level**
```
Activity:  62 (High, consistent contributor)
Impact:    48 (Active OSS contributor, 1K+ stars)
Quality:   58 (Good CI/CD, decent docs)
Growth:    +25 (Stable, slow growth)

Overall = 62×0.25 + 48×0.30 + 58×0.30 + 25×0.15
        = 15.5 + 14.4 + 17.4 + 3.75
        = 51.05

→ Rank: Senior ⭐
```

---

## 📝 What to Include in MVP (Phase 2)

### ✅ Include (Core Features):

**Activity (35 points):**
- ✅ Code throughput (lines changed in merged PRs)
- ✅ Consistency (3mo, 12mo, 3yr windows)
- ✅ Collaboration (PR reviews, issue participation)
- ✅ Project focus (active repos count)
- ✅ Fraud detection: empty commits, backdating, multiple emails

**Impact (30 points):**
- ✅ Stars + Forks (logarithmic scale)
- ✅ Watchers
- ✅ Contributors count
- ✅ Issues activity (total, closure rate)
- ⚠️ Package stats (if package.json exists) — simplified

**Quality (30 points):**
- ✅ CI/CD presence (GitHub Actions detection)
- ✅ Test directory detection
- ✅ README quality scoring (length + content)
- ✅ Issue response time (median hours)

**Growth (5 points, bonus):**
- ✅ New languages (last 2 years vs 3-5 years ago)
- ✅ Tutorial vs production detection (weighted)
- ✅ Project complexity growth (year-over-year)

---

## ❌ Defer to Phase 5+ (Advanced Features):

- ❌ **Active forks analysis** — Requires fetching each fork's commit history (complex, slow)
- ❌ **Bot pattern detection** — Diminishing returns, temporal analysis covers most cases
- ❌ **Dependency Graph API** — Unstable GitHub API endpoint
- ❌ **Code similarity detection** — Overkill for MVP, computationally expensive
- ❌ **Full package registry stats** — Requires external API calls to npm, PyPI, cargo, Docker Hub

---

## 🔧 GraphQL Data Requirements

### New Fields Needed (vs Current Implementation)

Current `GET_USER_INFO` query **does NOT include:**

❌ **For Activity:**
- PR additions/deletions (for Code Throughput)
- PR review comments (for Collaboration)
- Issue comments by user (for Collaboration)
- Commit timestamps with `occurredAt` (for Temporal Pattern Analysis)

❌ **For Fraud Detection:**
- Commit `additions` and `deletions` (for Empty Commits detection)
- Commit `authoredDate` vs `committedDate` (for Backdating)
- Commit author email addresses (for Multiple Emails)

❌ **For Quality:**
- Repository file tree (for CI/CD, test detection)
- Issue timeline events (for Response Time)
- Branch protection rules (for Code Review Process)

### Required GraphQL Updates (Phase 1.5)

**New query:** `GET_USER_ANALYTICS` with:

```graphql
pullRequests(first: 100) {
  nodes {
    additions    # NEW
    deletions    # NEW
    merged       # NEW
    reviews {    # NEW
      nodes {
        body
        author { login }
      }
    }
  }
}

commitContributions {
  nodes {
    occurredAt          # NEW (for temporal analysis)
    commitCount
    repository {
      defaultBranchRef {
        target {
          ... on Commit {
            additions   # NEW
            deletions   # NEW
            author {
              email     # NEW
            }
          }
        }
      }
    }
  }
}

repositories {
  nodes {
    object(expression: "HEAD:") {  # NEW (file tree)
      ... on Tree {
        entries {
          name
          type
        }
      }
    }
    branchProtectionRules {  # NEW
      totalCount
    }
    issues {
      nodes {
        timelineItems(first: 1, itemTypes: [ISSUE_COMMENT]) {  # NEW
          nodes {
            ... on IssueComment {
              createdAt
            }
          }
        }
      }
    }
  }
}
```

---

**Last Updated:** 2025-11-17
**Version:** 2.0
**Status:** Ready for Implementation

For detailed TypeScript implementations, see [METRICS_V2_DETAILED.md](./METRICS_V2_DETAILED.md).
