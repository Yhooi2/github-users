# GitHub User Metrics V2 - Detailed Specification

**Version:** 2.0
**Last Updated:** 2025-11-17
**Status:** Ready for Implementation

---

## 🎯 Main Question

**"Can this person bring value to our team?"**

This breaks down into 4 sub-questions:

1. **Do they work regularly?** → Activity
2. **Do people use their work?** → Impact
3. **Do they write reliable code?** → Engineering Maturity (Quality)
4. **Are they growing?** → Learning Trajectory (Growth)

---

## 🔴 Problem: GitHub Farming (Fake Activity)

### Typical Fake Patterns

There are tools that generate fake commits with arbitrary dates by manipulating `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` environment variables.

**What "farmers" do:**

- **Backdating** — commits allegedly made in the past
- **Empty commits** — commits without real code (`git commit --allow-empty`)
- **Identity spoofing** — other people's email/username
- **Tutorial cloning** — copying educational projects
- **Bot patterns** — perfectly uniform activity (every day at 8:00 AM)

### Red Flags (Signs of Fake)

Farm accounts usually don't contain original code, have lots of tutorial-level code, and overcompensate on the README profile page. Also indicative are follower/following patterns and multiple different email addresses in commit messages.

**Technical indicators:**

- ❌ Commits before account creation — physically impossible
- ❌ Too perfect patterns — exactly N commits every day
- ❌ Anomalous time zones — commit at 3 AM when usually asleep
- ❌ Multiple email addresses — 10+ different emails in one repository
- ❌ No verified commits — doesn't use GPG signing
- ❌ One massive commit — 10,000 lines at once
- ❌ Follower/following patterns — clusters of "friends" recommending each other

---

## 📊 METRIC 1: Activity → Productivity Signal

**What we measure:** Not "how many commits", but "how productively they work"

### Components (100 points):

#### A. Code Throughput (35 points) — Real Output

**What we count:**

- **Pull request size** — elite level teams have average PR size less than 85 changed lines of code
- Not commit count, but **merged PRs with real code**
- **Lines added + deleted** for the last 3 months
- Only **merged PRs** (not drafts, not abandoned)

**Why this is better:**

- 1 commit can be 1 line or 10,000 lines
- Lines changed = more honest indicator
- Protection from empty commits

**Scoring:**

```
0-1000 lines/month = Low (0-15 points)
1000-5000 = Moderate (15-25)
5000-15000 = High (25-35)
15000+ = Very High (35)
```

**Anti-fake protection:**

- Ignore repositories with one massive commit
- If 90% of code in one PR — suspicious (likely a clone)

**Implementation:**

```typescript
interface CodeThroughput {
  linesChanged: number; // additions + deletions
  mergedPRs: number;
  averagePRSize: number;
  massCommitRatio: number; // % of code in commits >1000 lines
}

function calculateCodeThroughput(repos: Repository[]): number {
  const last3Months = filterLast3Months(repos);

  let totalLines = 0;
  let totalPRs = 0;
  let massCommits = 0;

  last3Months.forEach(repo => {
    const mergedPRs = repo.pullRequests.nodes.filter(pr => pr.merged);

    mergedPRs.forEach(pr => {
      const linesChanged = pr.additions + pr.deletions;
      totalLines += linesChanged;
      totalPRs++;

      // Flag mass commits
      if (linesChanged > 1000) {
        massCommits++;
      }
    });
  });

  const linesPerMonth = totalLines / 3;
  const massCommitRatio = totalPRs > 0 ? massCommits / totalPRs : 0;

  // Penalty for mass commits
  let score = 0;
  if (linesPerMonth < 1000) score = (linesPerMonth / 1000) * 15;
  else if (linesPerMonth < 5000) score = 15 + ((linesPerMonth - 1000) / 4000) * 10;
  else if (linesPerMonth < 15000) score = 25 + ((linesPerMonth - 5000) / 10000) * 10;
  else score = 35;

  // Penalty: -10 points if >50% mass commits
  if (massCommitRatio > 0.5) {
    score = Math.max(0, score - 10);
  }

  return Math.round(score);
}
```

---

#### B. Consistency & Rhythm (25 points) — Regularity

**What we measure:**

- **Active weeks** for the last 12 months
- **Longest streak** (consecutive active weeks)
- **Behavior patterns** of developer: what time of day and days of week they commit, establishing a baseline of "normal" behavior

**Scoring:**

```
40+ active weeks out of 52 = High (20-25 points)
20-39 weeks = Moderate (10-19)
<20 weeks = Low (0-9)
Bonus: +5 points for streak >26 weeks (half a year straight)
```

**Anti-fake protection (CRITICAL): Temporal Pattern Analysis**

If commits every day exactly at 8:00 AM — suspicious (bot)
If commits scattered by time, but always during working hours — normal
If suddenly changes timezone (was 9-17 UTC, became 2-5 UTC) — flag

**Implementation:**

For each user:

1. Build histogram of commit times (0-23 hours)
2. Find "working window" (where 80% of activity is)
3. Check consistency of this window
4. If commits outside window >10% — flag "Irregular pattern"

**UI Insight:**

✅ "You code mostly 9 AM - 6 PM (consistent)"
⚠️ "Your commit times vary widely (irregular pattern detected)"

```typescript
interface ConsistencyMetrics {
  activeWeeks: number;
  longestStreak: number;
  workingWindow: { start: number; end: number }; // 0-23 hours
  irregularityScore: number; // 0-1, where 1 = highly irregular
}

function calculateConsistency(commits: Commit[]): number {
  // Active weeks calculation
  const weeks = groupByWeek(commits);
  const activeWeeks = weeks.filter(w => w.commits.length > 0).length;

  // Longest streak
  let currentStreak = 0;
  let longestStreak = 0;
  weeks.forEach(week => {
    if (week.commits.length > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  // Temporal pattern analysis
  const hourHistogram = buildHourHistogram(commits);
  const workingWindow = findWorkingWindow(hourHistogram, 0.8);
  const outsideWindowRatio = calculateOutsideWindowRatio(commits, workingWindow);

  // Base score
  let score = 0;
  if (activeWeeks >= 40) score = 20 + (activeWeeks - 40) / 12 * 5;
  else if (activeWeeks >= 20) score = 10 + (activeWeeks - 20) / 20 * 10;
  else score = (activeWeeks / 20) * 10;

  // Streak bonus
  if (longestStreak >= 26) score += 5;

  // Irregularity penalty
  if (outsideWindowRatio > 0.1) {
    score = Math.max(0, score - 5);
  }

  return Math.round(Math.min(25, score));
}

function buildHourHistogram(commits: Commit[]): number[] {
  const histogram = new Array(24).fill(0);
  commits.forEach(commit => {
    const hour = new Date(commit.committedDate).getHours();
    histogram[hour]++;
  });
  return histogram;
}

function findWorkingWindow(histogram: number[], threshold: number): { start: number; end: number } {
  const total = histogram.reduce((a, b) => a + b, 0);
  const targetCount = total * threshold;

  // Find continuous window with 80% of commits
  let maxSum = 0;
  let bestWindow = { start: 0, end: 23 };

  for (let windowSize = 8; windowSize <= 24; windowSize++) {
    for (let start = 0; start <= 24 - windowSize; start++) {
      const end = start + windowSize - 1;
      const sum = histogram.slice(start, end + 1).reduce((a, b) => a + b, 0);

      if (sum >= targetCount && sum > maxSum) {
        maxSum = sum;
        bestWindow = { start, end };
      }
    }
  }

  return bestWindow;
}
```

---

#### C. Collaboration (20 points) — Teamwork

**What we measure:**

- **Review Depth** — average number of comments per PR review, indicating quality and thoroughness
- **PR reviews done** (last 6 months)
- **Issues opened/commented** (participation in discussions)
- **PR discussions** (responses to comments in own PRs)

**Why this matters:**

- Senior developers spend 30-50% of time on reviews
- Solo coders = 0 points here (and that's OK for freelancers)
- Team players = bonus

**Scoring:**

```
20+ reviews in 6 months = 10 points
10+ issues participated = 5 points
PR discussions (>3 comments per PR) = 5 points
```

**Anti-fake protection:**

- Check if there are responses from other people
- If review comments only "LGTM" — don't count
- If issue comments only "me too" — don't count

```typescript
interface CollaborationMetrics {
  reviewsDone: number;
  issuesParticipated: number;
  prDiscussionsAvg: number;
  lgtmOnlyRatio: number; // Ratio of "LGTM" only reviews
}

function calculateCollaboration(user: User): number {
  const last6Months = filterLast6Months(user);

  // PR Reviews
  const reviews = last6Months.contributedPRReviews.nodes;
  const substantiveReviews = reviews.filter(review => {
    const body = review.body.toLowerCase();
    // Filter out "lgtm" only reviews
    return body.length > 10 && !isLGTMOnly(body);
  });

  // Issue participation
  const issueComments = last6Months.issueComments.nodes;
  const substantiveIssueComments = issueComments.filter(comment => {
    return comment.body.length > 20 && !isMeTooOnly(comment.body);
  });
  const issuesParticipated = new Set(substantiveIssueComments.map(c => c.issue.id)).size;

  // PR discussions (in own PRs)
  const ownPRs = user.pullRequests.nodes.filter(pr => pr.author.login === user.login);
  const totalDiscussions = ownPRs.reduce((sum, pr) => sum + pr.comments.totalCount, 0);
  const avgDiscussions = ownPRs.length > 0 ? totalDiscussions / ownPRs.length : 0;

  // Calculate score
  let score = 0;

  // Reviews (0-10 points)
  if (substantiveReviews.length >= 20) score += 10;
  else score += (substantiveReviews.length / 20) * 10;

  // Issues (0-5 points)
  if (issuesParticipated >= 10) score += 5;
  else score += (issuesParticipated / 10) * 5;

  // PR discussions (0-5 points)
  if (avgDiscussions >= 3) score += 5;
  else score += (avgDiscussions / 3) * 5;

  return Math.round(Math.min(20, score));
}

function isLGTMOnly(text: string): boolean {
  const lgtmPattern = /^(lgtm|looks good|👍|✅|\+1)\.?$/i;
  return lgtmPattern.test(text.trim());
}

function isMeTooOnly(text: string): boolean {
  const meTooPattern = /^(me too|same|same here|\+1|same issue)\.?$/i;
  return meTooPattern.test(text.trim());
}
```

---

#### D. Project Focus (20 points) — Specialization vs Scatter

**What we measure:**

- Number of active repositories in 3 months
- Distribution of commits between them

**Paradox:**

```
1 repository = excellent (deep focus)
2-5 repositories = ideal (balance)
6-10 = good (wide range)
11-20 = suspicious (scatter)
20+ = red flag (likely fake or bot)
```

**Scoring:**

```
2-5 repos = 20 points
1 repo = 15 points (focused)
6-10 repos = 12 points
>10 repos = 5 points (scattered)
```

**Anti-fake protection:**

- If >50% repositories — forks without changes → flag
- If all repositories created on one day → flag

```typescript
interface ProjectFocusMetrics {
  activeRepos: number;
  forkWithoutChangesRatio: number;
  sameDayCreationRatio: number;
}

function calculateProjectFocus(repos: Repository[]): number {
  const last3Months = filterLast3Months(repos);
  const activeRepos = last3Months.filter(r => r.pushedAt !== null).length;

  // Check for forks without changes
  const forksWithoutChanges = last3Months.filter(r => {
    return r.isFork && (r.defaultBranchRef?.ahead || 0) === 0;
  }).length;
  const forkRatio = activeRepos > 0 ? forksWithoutChanges / activeRepos : 0;

  // Check for same-day creation
  const creationDates = last3Months.map(r => r.createdAt.split('T')[0]);
  const uniqueDates = new Set(creationDates);
  const sameDayRatio = creationDates.length > 0 ? 1 - (uniqueDates.size / creationDates.length) : 0;

  // Base score
  let score = 0;
  if (activeRepos >= 2 && activeRepos <= 5) score = 20;
  else if (activeRepos === 1) score = 15;
  else if (activeRepos >= 6 && activeRepos <= 10) score = 12;
  else if (activeRepos >= 11 && activeRepos <= 20) score = 8;
  else score = 5;

  // Penalties
  if (forkRatio > 0.5) score = Math.max(0, score - 5); // -5 for >50% unmodified forks
  if (sameDayRatio > 0.7) score = Math.max(0, score - 5); // -5 if >70% created same day

  return Math.round(score);
}
```

---

### Activity: Final Score

```typescript
interface ActivityMetric {
  score: number; // 0-100
  level: 'Low' | 'Moderate' | 'High' | 'Very High';
  breakdown: {
    codeThroughput: number; // 0-35
    consistency: number; // 0-25
    collaboration: number; // 0-20
    projectFocus: number; // 0-20
  };
  details: {
    linesChanged: number;
    mergedPRs: number;
    activeWeeks: number;
    longestStreak: number;
    reviewsDone: number;
    issuesParticipated: number;
    activeRepos: number;
  };
}

Score = Throughput + Consistency + Collaboration + Focus
Level = Low (<40) | Moderate (40-60) | High (60-80) | Very High (80-100)
```

**Fraud Detection Score (0-100, where 100 = 100% suspicion):**

```typescript
Fraud_Score =
  (empty_commits_ratio × 30) +
  (perfect_pattern_score × 25) +
  (temporal_anomaly × 20) +
  (mass_commits_ratio × 15) +
  (fork_without_changes × 10)
```

**UI for user:**

```
Score: 85 (High) ✅
Consistency: Excellent ✅
Fraud Risk: 15% (Low) ⚠️

Details:
- 3% of your commits are empty
- 12% of repositories are unmodified forks

Recommendation: Consider cleaning up inactive forks
```

---

## 🌟 METRIC 2: Impact → Ecosystem Reach

**What we measure:** Not "how many stars", but "do people use my code"

**Problem with Stars:**

- Can buy 10,000 stars for $100
- "Awesome lists" have 50k+ stars without real code
- Research shows project popularity (stars) doesn't always correlate with quality of user support

### Components (100 points):

#### A. Adoption Signal (40 points) — Real Usage

**What we measure (by priority):**

1. **Forks with real changes (15 points)**
   - Not just fork count, but "how many forks have additional commits"
   - This = "people use and modify my code"

2. **Watchers (10 points)**
   - Watching = "I'm following updates"
   - Stronger signal than stars

3. **Contributors (10 points)**
   - How many people committed to project
   - 10+ contributors = strong community

4. **Recent activity (5 points)**
   - Pushed in last 30 days = maintained
   - 6 months without updates = abandoned

**Scoring:**

```typescript
Score =
  log10(active_forks + 1) × 5 +
  log10(watchers + 1) × 3 +
  contributors_count × 0.5 +
  (is_recently_active ? 5 : 0)
```

**Anti-fake protection:**

- Check if there are commits in forks (not just empty)
- Check if there are issues/PRs (sign of live project)

```typescript
interface AdoptionSignal {
  activeForks: number; // Forks with commits ahead
  watchers: number;
  contributors: number;
  recentlyActive: boolean;
}

function calculateAdoptionSignal(repos: Repository[]): number {
  let totalActiveForks = 0;
  let totalWatchers = 0;
  let totalContributors = 0;
  let activeProjects = 0;

  repos.forEach(repo => {
    // Active forks (forks with changes)
    const forks = repo.forks.nodes;
    const activeForks = forks.filter(fork => {
      // Check if fork has commits ahead of parent
      return fork.aheadBy > 0;
    });
    totalActiveForks += activeForks.length;

    totalWatchers += repo.watchers.totalCount;
    totalContributors += repo.mentionableUsers.totalCount;

    // Recently active (pushed in last 30 days)
    const daysSincePush = daysSince(repo.pushedAt);
    if (daysSincePush <= 30) {
      activeProjects++;
    }
  });

  const score =
    Math.log10(totalActiveForks + 1) * 5 +
    Math.log10(totalWatchers + 1) * 3 +
    Math.min(totalContributors * 0.5, 10) +
    (activeProjects > 0 ? 5 : 0);

  return Math.round(Math.min(40, score));
}
```

---

#### B. Community Engagement (30 points) — Live Community

**What we measure:**

1. **Issues activity (15 points)**
   - Open issues = people use and find problems
   - Closed issues = maintainer responsive
   - Issue comments = discussions

2. **PRs from others (10 points)**
   - How many PRs from external contributors
   - Merged PRs = good maintainer

3. **Discussion activity (5 points)**
   - GitHub Discussions / Wiki activity

**Scoring:**

```
50+ issues + >50% closure rate = 15 points
10-50 issues = 10 points
<10 issues but >80% closed = 8 points (small but responsive)
<10 issues + <50% closed = 3 points
```

**Why issues matter:**

- 0 issues ≠ perfect code
- 0 issues = either nobody uses it, or maintainer ignores them

```typescript
interface CommunityEngagement {
  totalIssues: number;
  closedIssues: number;
  closureRate: number;
  externalPRs: number;
  mergedExternalPRs: number;
  discussionParticipation: number;
}

function calculateCommunityEngagement(repos: Repository[]): number {
  let totalIssues = 0;
  let closedIssues = 0;
  let externalPRs = 0;
  let mergedPRs = 0;
  let discussions = 0;

  repos.forEach(repo => {
    totalIssues += repo.issues.totalCount;
    closedIssues += repo.issues.nodes.filter(i => i.closed).length;

    // External PRs (not from owner)
    const extPRs = repo.pullRequests.nodes.filter(pr => {
      return pr.author.login !== repo.owner.login;
    });
    externalPRs += extPRs.length;
    mergedPRs += extPRs.filter(pr => pr.merged).length;

    discussions += repo.discussions?.totalCount || 0;
  });

  const closureRate = totalIssues > 0 ? closedIssues / totalIssues : 0;

  // Issues score (0-15 points)
  let issuesScore = 0;
  if (totalIssues >= 50 && closureRate > 0.5) {
    issuesScore = 15;
  } else if (totalIssues >= 10) {
    issuesScore = 10;
  } else if (totalIssues < 10 && closureRate > 0.8) {
    issuesScore = 8;
  } else {
    issuesScore = 3;
  }

  // External PRs score (0-10 points)
  const prScore = Math.min((externalPRs / 20) * 10, 10);

  // Discussions score (0-5 points)
  const discussionScore = Math.min((discussions / 50) * 5, 5);

  return Math.round(issuesScore + prScore + discussionScore);
}
```

---

#### C. Social Proof (20 points) — Stars and Visibility

**What we measure:**

- **Stars** (but with logarithmic weight)
- **Trending history** (was it in GitHub Trending)
- **Topics/Tags** (properly categorized)

**Scoring:**

```typescript
stars_score = Math.min(log10(stars + 1) × 3, 15)
trending_bonus = 5 (if was in trending)
```

**Why logarithm:**

```
10 stars → 1,000 stars = +2 points
1,000 → 10,000 = +2 points
```

Not linear growth (protection from fake stars)

```typescript
function calculateSocialProof(repos: Repository[]): number {
  let totalStars = 0;
  let wasTrending = false;
  let properlyTagged = 0;

  repos.forEach(repo => {
    totalStars += repo.stargazerCount;

    // Check trending (if repo has >100 stars in short time)
    const ageInDays = daysSince(repo.createdAt);
    const starsPerDay = repo.stargazerCount / ageInDays;
    if (starsPerDay > 5 && repo.stargazerCount > 100) {
      wasTrending = true;
    }

    // Check topics
    if (repo.repositoryTopics.nodes.length >= 3) {
      properlyTagged++;
    }
  });

  // Stars (0-15 points) - logarithmic
  const starsScore = Math.min(Math.log10(totalStars + 1) * 3, 15);

  // Trending bonus (0-5 points)
  const trendingBonus = wasTrending ? 5 : 0;

  return Math.round(starsScore + trendingBonus);
}
```

---

#### D. Package Registry Stats (10 points) — Real Downloads

**What we measure (if available):**

- npm downloads/month
- PyPI downloads
- crates.io downloads
- Docker Hub pulls

**Problem:** Requires additional API calls

**MVP solution:**

- Check for presence of `package.json` / `setup.py` / `Cargo.toml`
- If present → +5 points (publishable)
- If can fetch stats → +5 points for downloads

**⚠️ DEFERRED TO PHASE 5+** — requires external API calls

```typescript
interface PackageStats {
  isPublishable: boolean;
  monthlyDownloads: number;
  registryType: 'npm' | 'pypi' | 'cargo' | 'docker' | null;
}

// Simplified MVP implementation
function calculatePackageStats(repos: Repository[]): number {
  let publishableCount = 0;

  repos.forEach(repo => {
    // Check for package files via GraphQL
    const hasPackageJson = repo.object?.entries?.some(e => e.name === 'package.json');
    const hasSetupPy = repo.object?.entries?.some(e => e.name === 'setup.py');
    const hasCargo = repo.object?.entries?.some(e => e.name === 'Cargo.toml');

    if (hasPackageJson || hasSetupPy || hasCargo) {
      publishableCount++;
    }
  });

  // MVP: 5 points if has publishable packages
  return publishableCount > 0 ? 5 : 0;

  // Future: Fetch actual download stats (+5 points)
  // This requires external API calls to npm, PyPI, etc.
}
```

---

### Impact: Final Score

```typescript
interface ImpactMetric {
  score: number; // 0-100
  level: 'None' | 'Local' | 'Community' | 'Regional' | 'Global';
  breakdown: {
    adoptionSignal: number; // 0-40
    communityEngagement: number; // 0-30
    socialProof: number; // 0-20
    packageStats: number; // 0-10
  };
  topProjects: Array<{
    name: string;
    impactScore: number;
    stars: number;
    activeForks: number;
    contributors: number;
  }>;
}

Score = Adoption + Engagement + Social + Downloads
Level = None (<20) | Local (20-40) | Community (40-60) | Regional (60-80) | Global (80-100)
```

**Top Projects (show top 3):**

```
1. awesome-repo (75 impact points)
   - 2,450 stars, 350 active forks
   - 120 contributors, 850 issues (70% closed)
   - 50K npm downloads/month

2. useful-lib (62 impact points)
   - 850 stars, 80 active forks
   - 25 contributors, actively maintained
```

---

## 🏆 METRIC 3: Quality → Engineering Maturity

**What we measure:** Not "originality" (impossible), but "engineering maturity"

### Components (100 points):

#### A. Code Health Practices (35 points) — Engineering Habits

GitHub Code Quality assesses code reliability and maintainability through CodeQL-based rules, checking aspects like cyclomatic complexity, code coverage, and technical debt ratio.

**What we check:**

1. **CI/CD (15 points)**
   - Presence of `.github/workflows/*.yml`
   - Automated tests in CI
   - Deployment pipeline

2. **Testing (10 points)**
   - Test directory exists
   - Coverage badge in README
   - Test frameworks in dependencies

3. **Linting/Formatting (5 points)**
   - `.eslintrc`, `.prettierrc`, `pyproject.toml`
   - Pre-commit hooks

4. **Code Review Process (5 points)**
   - Branch protection rules
   - Required reviewers
   - Status checks

**How to check:**

GitHub GraphQL: `repository.object(expression: "HEAD:")` → get tree
One request instead of N HTTP calls
Parse file list

```typescript
interface CodeHealthPractices {
  cicdEnabled: boolean;
  hasTests: boolean;
  hasLinting: boolean;
  hasBranchProtection: boolean;
  cicdScore: number;
  testingScore: number;
  lintingScore: number;
  reviewScore: number;
}

function calculateCodeHealthPractices(repos: Repository[]): number {
  let cicdCount = 0;
  let testCount = 0;
  let lintCount = 0;
  let protectionCount = 0;

  repos.forEach(repo => {
    // Check CI/CD (GitHub Actions, CircleCI, Travis)
    const hasGitHubActions = repo.object?.entries?.some(e =>
      e.type === 'tree' && e.name === '.github'
    );
    const hasCircleCI = repo.object?.entries?.some(e => e.name === '.circleci');
    const hasTravis = repo.object?.entries?.some(e => e.name === '.travis.yml');

    if (hasGitHubActions || hasCircleCI || hasTravis) {
      cicdCount++;
    }

    // Check tests
    const hasTestDir = repo.object?.entries?.some(e =>
      e.type === 'tree' && (e.name === 'test' || e.name === 'tests' || e.name === '__tests__')
    );
    const hasTestFiles = repo.object?.entries?.some(e =>
      e.name.includes('.test.') || e.name.includes('.spec.')
    );

    if (hasTestDir || hasTestFiles) {
      testCount++;
    }

    // Check linting
    const hasESLint = repo.object?.entries?.some(e => e.name.startsWith('.eslintrc'));
    const hasPrettier = repo.object?.entries?.some(e => e.name.startsWith('.prettierrc'));
    const hasPyproject = repo.object?.entries?.some(e => e.name === 'pyproject.toml');

    if (hasESLint || hasPrettier || hasPyproject) {
      lintCount++;
    }

    // Check branch protection
    if (repo.branchProtectionRules?.totalCount > 0) {
      protectionCount++;
    }
  });

  const totalRepos = repos.length;

  const cicdScore = (cicdCount / totalRepos) * 15;
  const testScore = (testCount / totalRepos) * 10;
  const lintScore = (lintCount / totalRepos) * 5;
  const protectionScore = (protectionCount / totalRepos) * 5;

  return Math.round(cicdScore + testScore + lintScore + protectionScore);
}
```

---

#### B. Documentation Quality (25 points) — Explainability

**What we check:**

1. **README (15 points)**
   - **Length score (8 points):**
     - >5000 chars = 8 points (comprehensive)
     - 2000-5000 = 6 points (detailed)
     - 500-2000 = 4 points (basic)
     - <500 = 2 points (minimal)

   - **Content score (7 points):**
     - Has "Installation" section = 2
     - Has "Usage" section = 2
     - Has "Examples" = 1
     - Has "Contributing" = 1
     - Has "License" = 1

2. **Wiki (5 points)**
   - GitHub Wiki enabled and has content

3. **GitHub Pages / Docs site (5 points)**
   - Dedicated documentation website

**Anti-fake protection:**

- If README >90% copy of another project → flag
- Check: fuzzy string matching with top 100 similar projects

```typescript
interface DocumentationQuality {
  readmeLength: number;
  readmeScore: number;
  hasWiki: boolean;
  hasDocsPage: boolean;
  hasCopiedReadme: boolean;
}

function calculateDocumentationQuality(repos: Repository[]): number {
  let totalReadmeScore = 0;
  let wikiCount = 0;
  let docsCount = 0;

  repos.forEach(repo => {
    // README analysis
    const readme = repo.object?.entries?.find(e => e.name.toLowerCase() === 'readme.md');

    if (readme) {
      const length = readme.object?.text?.length || 0;

      // Length score (0-8 points)
      let lengthScore = 0;
      if (length > 5000) lengthScore = 8;
      else if (length > 2000) lengthScore = 6;
      else if (length > 500) lengthScore = 4;
      else if (length > 0) lengthScore = 2;

      // Content score (0-7 points)
      const text = readme.object?.text?.toLowerCase() || '';
      let contentScore = 0;
      if (text.includes('## install')) contentScore += 2;
      if (text.includes('## usage')) contentScore += 2;
      if (text.includes('## example')) contentScore += 1;
      if (text.includes('## contributing')) contentScore += 1;
      if (text.includes('## license')) contentScore += 1;

      totalReadmeScore += lengthScore + contentScore;
    }

    // Wiki
    if (repo.hasWikiEnabled && repo.wiki?.totalPages > 0) {
      wikiCount++;
    }

    // Docs page
    if (repo.homepageUrl || repo.hasPages) {
      docsCount++;
    }
  });

  const avgReadmeScore = repos.length > 0 ? totalReadmeScore / repos.length : 0;
  const wikiScore = (wikiCount / repos.length) * 5;
  const docsScore = (docsCount / repos.length) * 5;

  return Math.round(Math.min(25, avgReadmeScore + wikiScore + docsScore));
}
```

---

#### C. Maintenance Signal (25 points) — Responsibility

**What we measure:**

1. **Issue Response Time (10 points)**
   - Median time from issue creation to first response
   - <24h = 10 points
   - 1-3 days = 7 points
   - 1 week = 4 points
   - >1 month = 0 points

2. **Issue Resolution Rate (10 points)**
   - Closed issues / Total issues
   - >70% = 10 points
   - 50-70% = 7 points
   - <50% = 3 points

3. **Project Longevity (5 points)**
   - Age >2 years + activity last 90 days = 5 points
   - Old but abandoned = 0 points

**Why this matters:**

- Shows maintainer doesn't abandon projects
- Responsive to community

```typescript
interface MaintenanceSignal {
  medianResponseTime: number; // hours
  issueResolutionRate: number;
  projectAge: number; // days
  recentlyActive: boolean;
}

function calculateMaintenanceSignal(repos: Repository[]): number {
  let responseTimes: number[] = [];
  let totalIssues = 0;
  let closedIssues = 0;
  let matureActiveProjects = 0;

  repos.forEach(repo => {
    // Issue response time
    repo.issues.nodes.forEach(issue => {
      const created = new Date(issue.createdAt);
      const firstResponse = issue.timelineItems.nodes.find(item =>
        item.__typename === 'IssueComment'
      );

      if (firstResponse) {
        const responded = new Date(firstResponse.createdAt);
        const hoursToResponse = (responded.getTime() - created.getTime()) / (1000 * 60 * 60);
        responseTimes.push(hoursToResponse);
      }
    });

    // Resolution rate
    totalIssues += repo.issues.totalCount;
    closedIssues += repo.issues.nodes.filter(i => i.closed).length;

    // Longevity
    const ageInDays = daysSince(repo.createdAt);
    const daysSincePush = daysSince(repo.pushedAt);

    if (ageInDays > 730 && daysSincePush < 90) { // >2 years old, active in last 90 days
      matureActiveProjects++;
    }
  });

  // Response time score (0-10 points)
  const medianResponseTime = median(responseTimes);
  let responseScore = 0;
  if (medianResponseTime < 24) responseScore = 10;
  else if (medianResponseTime < 72) responseScore = 7;
  else if (medianResponseTime < 168) responseScore = 4;

  // Resolution rate score (0-10 points)
  const resolutionRate = totalIssues > 0 ? closedIssues / totalIssues : 0;
  let resolutionScore = 0;
  if (resolutionRate > 0.7) resolutionScore = 10;
  else if (resolutionRate > 0.5) resolutionScore = 7;
  else resolutionScore = 3;

  // Longevity score (0-5 points)
  const longevityScore = (matureActiveProjects / repos.length) * 5;

  return Math.round(responseScore + resolutionScore + longevityScore);
}
```

---

#### D. Architecture Complexity (15 points) — Technical Depth

**What we assess:**

1. **Project Size (5 points)**
   - Disk usage >10MB = substantial project
   - 1-10MB = moderate
   - <1MB = small

2. **Tech Stack Diversity (5 points)**
   - 5+ languages = polyglot (5 points)
   - 3-4 languages = diverse (3 points)
   - 1-2 languages = focused (1 point)

3. **Infrastructure (5 points)**
   - Docker/K8s = modern deployment (3 points)
   - Database schemas = data layer (1 point)
   - API documentation = service layer (1 point)

**Anti-fake protection:**

- If many languages, but 99% one → don't count
- Check if there's real code or just configs

```typescript
interface ArchitectureComplexity {
  avgProjectSize: number; // KB
  languageCount: number;
  hasDocker: boolean;
  hasDatabase: boolean;
  hasAPIDoc: boolean;
}

function calculateArchitectureComplexity(repos: Repository[]): number {
  let totalSize = 0;
  const allLanguages = new Set<string>();
  let dockerCount = 0;
  let dbCount = 0;
  let apiDocCount = 0;

  repos.forEach(repo => {
    totalSize += repo.diskUsage;

    // Languages
    repo.languages.edges.forEach(edge => {
      // Only count languages with >1% of codebase
      const percentage = edge.size / repo.languages.totalSize;
      if (percentage > 0.01) {
        allLanguages.add(edge.node.name);
      }
    });

    // Docker
    const hasDockerfile = repo.object?.entries?.some(e => e.name === 'Dockerfile');
    const hasDockerCompose = repo.object?.entries?.some(e => e.name === 'docker-compose.yml');
    if (hasDockerfile || hasDockerCompose) dockerCount++;

    // Database
    const hasMigrations = repo.object?.entries?.some(e =>
      e.type === 'tree' && (e.name === 'migrations' || e.name === 'db')
    );
    if (hasMigrations) dbCount++;

    // API docs
    const hasSwagger = repo.object?.entries?.some(e => e.name === 'swagger.json');
    const hasOpenAPI = repo.object?.entries?.some(e => e.name === 'openapi.yml');
    if (hasSwagger || hasOpenAPI) apiDocCount++;
  });

  const avgSize = repos.length > 0 ? totalSize / repos.length : 0;

  // Size score (0-5 points)
  let sizeScore = 0;
  if (avgSize > 10000) sizeScore = 5; // >10MB
  else if (avgSize > 1000) sizeScore = 3; // 1-10MB
  else sizeScore = 1;

  // Language diversity (0-5 points)
  let langScore = 0;
  if (allLanguages.size >= 5) langScore = 5;
  else if (allLanguages.size >= 3) langScore = 3;
  else langScore = 1;

  // Infrastructure (0-5 points)
  const infraScore =
    (dockerCount > 0 ? 3 : 0) +
    (dbCount > 0 ? 1 : 0) +
    (apiDocCount > 0 ? 1 : 0);

  return Math.round(Math.min(15, sizeScore + langScore + infraScore));
}
```

---

### Engineering Maturity: Final Score

```typescript
interface QualityMetric {
  score: number; // 0-100
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  breakdown: {
    codeHealthPractices: number; // 0-35
    documentation: number; // 0-25
    maintenanceSignal: number; // 0-25
    architectureComplexity: number; // 0-15
  };
}

Score = Practices + Documentation + Maintenance + Architecture
Level = Beginner (<40) | Intermediate (40-60) | Advanced (60-75) | Expert (75-90) | Master (90-100)
```

---

## 📈 METRIC 4: Growth → Learning Trajectory

**What we measure:** Not "does commit count grow", but "is growing as an engineer"

### Components (100 points, -100 to +100 scale):

#### A. Skill Expansion (40 points) — New Technologies

**What we measure:**

- New programming languages in last 2 years
- New frameworks/libraries
- New types of projects (web → mobile → ML)

**Scoring:**

```typescript
recent_languages = unique languages last 2 years
older_languages = unique languages years 3-5
new_languages = recent - older

score = Math.min(new_languages × 10, 40)
```

**Examples:**

- Was only JavaScript, added TypeScript + Rust = +20 points
- Was Python, added Go + Kubernetes = +20 points
- Same Java for 10 years = 0 points (stagnation)

**UI Insight:**

```
"You've learned 3 new languages in past 2 years: Rust, Go, TypeScript"
"Previously: JavaScript, Python, Java"
```

```typescript
interface SkillExpansion {
  recentLanguages: Set<string>;
  olderLanguages: Set<string>;
  newLanguages: Set<string>;
  newFrameworks: Set<string>;
}

function calculateSkillExpansion(repos: Repository[]): number {
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());

  const recentLanguages = new Set<string>();
  const olderLanguages = new Set<string>();

  repos.forEach(repo => {
    const createdAt = new Date(repo.createdAt);

    repo.languages.edges.forEach(edge => {
      if (edge.size / repo.languages.totalSize > 0.01) { // >1% of codebase
        if (createdAt >= twoYearsAgo) {
          recentLanguages.add(edge.node.name);
        } else if (createdAt >= fiveYearsAgo) {
          olderLanguages.add(edge.node.name);
        }
      }
    });
  });

  // New languages = in recent but not in older
  const newLanguages = new Set(
    [...recentLanguages].filter(lang => !olderLanguages.has(lang))
  );

  const score = Math.min(newLanguages.size * 10, 40);

  return score;
}
```

---

#### B. Project Evolution (30 points) — Growth in Complexity

**What we measure:**

Compare projects:
- Last 2 years vs Years 3-5

**Project metrics:**

- Average stars
- Average contributors
- Average project size
- CI/CD adoption rate

**Scoring:**

```typescript
recent_avg = average(recent projects complexity)
older_avg = average(older projects complexity)

growth_rate = (recent - older) / older × 100%

score = Math.max(-30, Math.min(growth_rate / 3, 30))
```

**Examples:**

- 2020: tutorial projects, 0 stars
- 2024: production apps, 100 stars
- Growth = +30 points (accelerating)

```typescript
interface ProjectEvolution {
  recentComplexity: number;
  olderComplexity: number;
  growthRate: number;
}

function calculateProjectEvolution(repos: Repository[]): number {
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());

  const recentProjects = repos.filter(r => new Date(r.createdAt) >= twoYearsAgo);
  const olderProjects = repos.filter(r => {
    const created = new Date(r.createdAt);
    return created >= fiveYearsAgo && created < twoYearsAgo;
  });

  function calculateComplexity(repo: Repository): number {
    return (
      repo.stargazerCount * 2 +
      repo.forkCount * 3 +
      (repo.diskUsage / 1000) +
      (repo.languages.edges.length * 5) +
      (hasCICD(repo) ? 20 : 0)
    );
  }

  const recentAvg = recentProjects.length > 0
    ? recentProjects.reduce((sum, r) => sum + calculateComplexity(r), 0) / recentProjects.length
    : 0;

  const olderAvg = olderProjects.length > 0
    ? olderProjects.reduce((sum, r) => sum + calculateComplexity(r), 0) / olderProjects.length
    : 0;

  if (olderAvg === 0) {
    // New developer, no older projects
    return recentAvg > 50 ? 15 : 5;
  }

  const growthRate = ((recentAvg - olderAvg) / olderAvg) * 100;
  const score = Math.max(-30, Math.min(growthRate / 3, 30));

  return Math.round(score);
}
```

---

#### C. Learning Pattern Detection (30 points) — Learning vs Production

**Key question:** Does developer experiment or only do production projects?

**Tutorial Project Detection:**

Signs of educational project:

- Name contains: `tutorial`, `learning`, `course`, `homework`, `practice`, `test`, `demo`
- Description contains: `learning`, `following tutorial`, `course project`
- 0 stars, 0 forks + created and abandoned (no commits after first week)
- README copy of tutorial
- Commits contain `lesson`, `chapter`, `exercise`

**Production Project Detection:**

Signs of production project:

- Stars >10 or Forks >3
- CI/CD configured
- Issues from other people
- Contributors >3
- README with Installation + Usage
- Maintained (commits last 90 days)

**Scoring:**

```typescript
tutorial_ratio = tutorial_projects / total_projects
production_ratio = production_projects / total_projects
```

**Ideal balance:**

```
20% tutorial (experimenting)
60% production (bringing value)
20% abandoned (normal)

score = balance_score(tutorial_ratio, production_ratio)
```

**Examples:**

- 100% tutorials = 0 points (only learning, not shipping)
- 100% production = 20 points (shipping, but not experimenting)
- 20% tutorials + 60% production = 30 points (ideal)

**UI Insight:**

```
"Balance: 15% learning projects, 70% production, 15% archived"
"You're actively learning (3 tutorial repos this year) while shipping production code"
```

```typescript
interface LearningPattern {
  tutorialProjects: number;
  productionProjects: number;
  abandonedProjects: number;
  tutorialRatio: number;
  productionRatio: number;
}

function isTutorialProject(repo: Repository): boolean {
  const tutorialKeywords = [
    'tutorial', 'learning', 'course', 'homework', 'practice',
    'test', 'demo', 'example', 'exercise', 'lesson'
  ];

  const nameMatch = tutorialKeywords.some(k =>
    repo.name.toLowerCase().includes(k)
  );

  const descMatch = repo.description && tutorialKeywords.some(k =>
    repo.description.toLowerCase().includes(k)
  );

  const abandoned = (
    repo.stargazerCount === 0 &&
    repo.forkCount === 0 &&
    daysSince(repo.pushedAt) > 14
  );

  return nameMatch || descMatch || abandoned;
}

function isProductionProject(repo: Repository): boolean {
  return (
    repo.stargazerCount > 10 ||
    repo.forkCount > 3 ||
    hasCICD(repo) ||
    repo.issues.totalCount > 5 ||
    repo.mentionableUsers.totalCount > 3 ||
    daysSince(repo.pushedAt) < 90
  );
}

function calculateLearningPattern(repos: Repository[]): number {
  let tutorialCount = 0;
  let productionCount = 0;
  let abandonedCount = 0;

  repos.forEach(repo => {
    if (isTutorialProject(repo)) {
      tutorialCount++;
    } else if (isProductionProject(repo)) {
      productionCount++;
    } else {
      abandonedCount++;
    }
  });

  const total = repos.length;
  const tutorialRatio = total > 0 ? tutorialCount / total : 0;
  const productionRatio = total > 0 ? productionCount / total : 0;

  // Ideal balance: 15-25% tutorial, 50-70% production
  let score = 0;

  if (tutorialRatio >= 0.15 && tutorialRatio <= 0.25 && productionRatio >= 0.50) {
    score = 30; // Ideal balance
  } else if (tutorialRatio === 1.0) {
    score = 0; // Only learning
  } else if (productionRatio === 1.0 && tutorialRatio === 0) {
    score = 20; // Shipping, but not experimenting
  } else {
    // Proportional score
    score = (productionRatio * 20) + (tutorialRatio * 10);
  }

  return Math.round(Math.min(30, score));
}
```

---

### Learning Trajectory: Final Score

```typescript
interface GrowthMetric {
  score: number; // -100 to +100
  trend: 'Declining' | 'Stable' | 'Growing' | 'Accelerating';
  breakdown: {
    skillExpansion: number; // 0-40
    projectEvolution: number; // -30 to +30
    learningPattern: number; // 0-30
  };
  timeline: Array<{
    year: number;
    languages: string[];
    projectTypes: string[];
    complexity: number;
  }>;
}

Score = Skill Expansion + Project Evolution + Learning Pattern
Trend = Declining (-100 to -30) | Stable (-30 to +30) | Growing (+30 to +70) | Accelerating (+70 to +100)
```

**Timeline Visualization:**

```
2020: JavaScript only, tutorial projects
2021: +TypeScript, first production app
2022: +Rust, contributing to OSS
2023: +Go, maintaining 3 production projects
2024: +Kubernetes, teaching others

Trajectory: Accelerating 🚀
```

---

## 🛡️ FRAUD DETECTION: Comprehensive System

### Fraud Score (0-100, where 100 = 100% suspicion)

```typescript
interface FraudDetectionResult {
  score: number; // 0-100
  level: 'Clean' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical';
  flags: FraudFlag[];
  breakdown: {
    emptyCommitsRatio: number; // 0-30 points
    perfectPatternScore: number; // 0-25 points
    temporalAnomalyScore: number; // 0-20 points
    massCommitsRatio: number; // 0-15 points
    forkFarmingScore: number; // 0-10 points
  };
}

interface FraudFlag {
  type: 'empty_commits' | 'backdating' | 'bot_pattern' | 'temporal_anomaly' |
        'mass_commits' | 'fork_farming' | 'multiple_emails';
  severity: 'low' | 'medium' | 'high';
  message: string;
  count?: number;
}
```

### Formula:

```typescript
FraudScore =
  (empty_commits_ratio × 30) +
  (perfect_pattern_score × 25) +
  (temporal_anomaly × 20) +
  (mass_commits_ratio × 15) +
  (fork_without_changes × 10)
```

### Detection Methods:

| Signal | How to detect | Criticality |
|--------|---------------|-------------|
| **Empty commits** | `additions + deletions == 0` | 🔴 High |
| **Backdated commits** | Commits before account creation | 🔴 Critical |
| **Bot patterns** | Perfect daily commits at same time | 🟡 Medium |
| **Temporal anomalies** | Commit outside usual hours | 🟢 Low |
| **Mass commits** | >1000 lines in single commit | 🟡 Medium |
| **Fork farming** | Many forks, no modifications | 🟡 Medium |
| **Multiple emails** | >10 emails in commits | 🟡 Medium |
| **No GPG signing** | Unverified commits | 🟢 Low |
| **Tutorial cloning** | Copy-paste of popular tutorials | 🟡 Medium |

### Implementation:

```typescript
function calculateFraudDetection(commits: Commit[], repos: Repository[]): FraudDetectionResult {
  const flags: FraudFlag[] = [];

  // 1. Empty commits (30 points)
  const emptyCommits = commits.filter(c => c.additions === 0 && c.deletions === 0);
  const emptyRatio = commits.length > 0 ? emptyCommits.length / commits.length : 0;
  const emptyScore = emptyRatio * 30;

  if (emptyRatio > 0.05) {
    flags.push({
      type: 'empty_commits',
      severity: emptyRatio > 0.15 ? 'high' : 'medium',
      message: `${(emptyRatio * 100).toFixed(1)}% of commits are empty`,
      count: emptyCommits.length
    });
  }

  // 2. Perfect pattern (25 points)
  const commitsByDay = groupByDay(commits);
  const daysWithCommits = Object.keys(commitsByDay).length;
  const avgCommitsPerDay = commits.length / daysWithCommits;
  const variance = calculateVariance(Object.values(commitsByDay).map(d => d.length));

  // If variance is very low (commits every day with same count) = bot
  const perfectPatternScore = variance < 0.1 ? 25 : 0;

  if (perfectPatternScore > 0) {
    flags.push({
      type: 'bot_pattern',
      severity: 'high',
      message: `Too uniform commit pattern (${avgCommitsPerDay.toFixed(1)} commits/day with low variance)`
    });
  }

  // 3. Temporal anomalies (20 points)
  const hourHistogram = buildHourHistogram(commits);
  const workingWindow = findWorkingWindow(hourHistogram, 0.8);
  const outsideCommits = commits.filter(c => {
    const hour = new Date(c.committedDate).getHours();
    return hour < workingWindow.start || hour > workingWindow.end;
  });
  const outsideRatio = commits.length > 0 ? outsideCommits.length / commits.length : 0;
  const temporalScore = outsideRatio > 0.3 ? outsideRatio * 20 : 0;

  if (temporalScore > 5) {
    flags.push({
      type: 'temporal_anomaly',
      severity: 'low',
      message: `${(outsideRatio * 100).toFixed(1)}% of commits outside normal working hours`,
      count: outsideCommits.length
    });
  }

  // 4. Mass commits (15 points)
  const massCommits = commits.filter(c => (c.additions + c.deletions) > 1000);
  const massRatio = commits.length > 0 ? massCommits.length / commits.length : 0;
  const massScore = massRatio * 15;

  if (massRatio > 0.1) {
    flags.push({
      type: 'mass_commits',
      severity: 'medium',
      message: `${(massRatio * 100).toFixed(1)}% of commits are massive (>1000 lines)`,
      count: massCommits.length
    });
  }

  // 5. Fork farming (10 points)
  const unmodifiedForks = repos.filter(r => r.isFork && (r.defaultBranchRef?.ahead || 0) === 0);
  const forkRatio = repos.length > 0 ? unmodifiedForks.length / repos.length : 0;
  const forkScore = forkRatio * 10;

  if (forkRatio > 0.3) {
    flags.push({
      type: 'fork_farming',
      severity: 'medium',
      message: `${(forkRatio * 100).toFixed(1)}% of repositories are unmodified forks`,
      count: unmodifiedForks.length
    });
  }

  // Total fraud score
  const totalScore = Math.round(
    emptyScore + perfectPatternScore + temporalScore + massScore + forkScore
  );

  // Determine level
  let level: FraudDetectionResult['level'];
  if (totalScore < 20) level = 'Clean';
  else if (totalScore < 40) level = 'Low Risk';
  else if (totalScore < 60) level = 'Medium Risk';
  else if (totalScore < 80) level = 'High Risk';
  else level = 'Critical';

  return {
    score: totalScore,
    level,
    flags,
    breakdown: {
      emptyCommitsRatio: Math.round(emptyScore),
      perfectPatternScore: Math.round(perfectPatternScore),
      temporalAnomalyScore: Math.round(temporalScore),
      massCommitsRatio: Math.round(massScore),
      forkFarmingScore: Math.round(forkScore)
    }
  };
}
```

### UI Display:

```
⚠️ Fraud Risk: 35% (Medium)

Issues detected:
• 15% of commits are empty
• 8 different email addresses used
• 3 unmodified forks in profile

Recommendations:
• Use GPG signing for verified commits
• Clean up inactive forks
• Add meaningful commit messages
```

---

## 🎖️ OVERALL RANK

### Overall Score (0-100):

```typescript
Overall =
  Activity × 0.25 +
  Impact × 0.30 +
  Maturity × 0.30 +
  max(0, Learning) × 0.15
```

### Rank Classification:

| Rank | Overall | Requirements |
|------|---------|--------------|
| **Junior** | <30 | Low activity, little experience |
| **Mid** | 30-50 | Regular work, some projects |
| **Senior** | 50-70 | High Maturity (>60), Impact (>40) |
| **Staff** | 70-85 | Senior + High Impact (>70) |
| **Principal** | 85-100 | Staff + Very High Activity (>70) + Global Impact (>80) |

### Examples:

**Linus Torvalds:**
```
Activity: 85 (High, but not highest — delegates a lot)
Impact: 100 (Linux kernel — billions of devices)
Maturity: 95 (Expert maintainer)
Learning: +40 (Stable, mature)
→ Rank: Principal
```

**Junior Dev:**
```
Activity: 45 (Moderate consistency)
Impact: 15 (Local projects only)
Maturity: 35 (Basic practices)
Learning: +60 (Growing fast!)
→ Rank: Junior (but growing!)
```

---

## 📝 WHAT TO INCLUDE IN MVP (Phase 2):

### ✅ Activity (35 points):
- Code throughput (lines changed)
- Consistency (3mo, 12mo, 3y windows)
- Collaboration (reviews, issues)
- **Fraud:** empty commits, backdating, multiple emails

### ✅ Impact (30 points):
- Stars + Forks (with logarithm)
- Watchers
- Contributors count
- Issues activity
- ⚠️ npm downloads (if package.json exists)

### ✅ Maturity (30 points):
- CI/CD presence
- Test directory
- README quality
- Issue response time

### ✅ Learning (5 points, bonus):
- New languages
- Tutorial detection (weighted)
- Project complexity growth

---

## ❌ WHAT TO DEFER (Phase 5+):

- ❌ Active forks analysis (complex)
- ❌ Bot pattern detection (diminishing returns)
- ❌ Dependency Graph API (unstable)
- ❌ Code similarity detection (overkill)

---

**Last Updated:** 2025-11-17
**Version:** 2.0
**Status:** Ready for Implementation
