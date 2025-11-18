/**
 * Metrics and analytics types for user and repository statistics
 * Centralized type definitions for scoring, statistics, and analytics
 */

/**
 * Authenticity score result with detailed breakdown
 */
export type AuthenticityScore = {
  /** Overall score from 0-100 */
  score: number;
  /** Category based on score */
  category: 'High' | 'Medium' | 'Low' | 'Suspicious';
  /** Detailed breakdown by component */
  breakdown: {
    originalityScore: number;
    activityScore: number;
    engagementScore: number;
    codeOwnershipScore: number;
  };
  /** Warning flags for suspicious patterns */
  flags: string[];
  /** Additional metadata */
  metadata: {
    totalRepos: number;
    originalRepos: number;
    forkedRepos: number;
    archivedRepos: number;
    templateRepos: number;
  };
};

/**
 * Language statistics for a single programming language
 */
export type LanguageStats = {
  name: string;
  color: string;
  bytes: number;
  percentage: number;
  repositoryCount: number;
};

/**
 * Commit statistics by repository
 */
export type RepositoryCommitStats = {
  repositoryName: string;
  commits: number;
  percentage: number;
};

/**
 * Yearly commit statistics
 */
export type YearlyCommitStats = {
  year: number;
  commits: number;
  repositories: number;
};

/**
 * Commit activity by time period
 */
export type CommitActivity = {
  perDay: number;
  perWeek: number;
  perMonth: number;
  perYear: number;
};

/**
 * Comprehensive commit statistics summary
 */
export type CommitStatsSummary = {
  total: number;
  byRepository: RepositoryCommitStats[];
  byYear: YearlyCommitStats[];
  activity: CommitActivity;
  mostActiveRepository: string | null;
  averagePerRepository: number;
};

/**
 * Language diversity metrics
 */
export type LanguageDiversity = {
  score: number; // 0-100
  uniqueLanguages: number;
  primaryLanguage: string | null;
  distribution: 'Diverse' | 'Moderate' | 'Focused' | 'Single';
};

/**
 * Repository statistics aggregation
 */
export type RepositoryStats = {
  total: number;
  original: number;
  forked: number;
  archived: number;
  templates: number;
  withTopics: number;
  withLicense: number;
  averageStars: number;
  averageForks: number;
  averageSize: number;
  totalStars: number;
  totalForks: number;
  totalSize: number;
};

/**
 * Activity metric result with detailed breakdown
 * Measures recent activity, consistency, and repository diversity
 */
export type ActivityMetric = {
  /** Overall score from 0-100 */
  score: number;
  /** Activity level based on score */
  level: 'High' | 'Moderate' | 'Low';
  /** Detailed breakdown by component */
  breakdown: {
    recentCommits: number;
    consistency: number;
    diversity: number;
  };
  /** Additional metadata */
  details: {
    last3MonthsCommits: number;
    activeMonths: number;
    uniqueRepos: number;
  };
};

/**
 * Impact metric result with detailed breakdown
 * Measures influence through stars, forks, and community engagement
 */
export type ImpactMetric = {
  /** Overall score from 0-100 */
  score: number;
  /** Impact level based on score */
  level: 'Exceptional' | 'Strong' | 'Moderate' | 'Low' | 'Minimal';
  /** Detailed breakdown by component */
  breakdown: {
    stars: number;
    forks: number;
    contributors: number;
    reach: number;
    engagement: number;
  };
  /** Additional metadata */
  details: {
    totalStars: number;
    totalForks: number;
    totalWatchers: number;
    totalPRs: number;
    totalIssues: number;
  };
};

/**
 * Quality metric result with detailed breakdown
 * Measures code quality through originality, documentation, and maturity
 */
export type QualityMetric = {
  /** Overall score from 0-100 */
  score: number;
  /** Quality level based on score */
  level: 'Excellent' | 'Strong' | 'Good' | 'Fair' | 'Weak';
  /** Detailed breakdown by component */
  breakdown: {
    originality: number;
    documentation: number;
    ownership: number;
    maturity: number;
    stack: number;
  };
  /** Additional metadata */
  details: {
    totalRepos: number;
    originalRepos: number;
    forkedRepos: number;
    documentedRepos: number;
    ownedRepos: number;
    contributedRepos: number;
    averageRepoAge: number;
    uniqueLanguages: number;
  };
};

/**
 * Growth metric result with detailed breakdown
 * Measures year-over-year growth in activity, impact, and skills
 * Score range: -100 (rapid decline) to +100 (rapid growth)
 */
export type GrowthMetric = {
  /** Overall score from -100 to +100 */
  score: number;
  /** Growth level based on score */
  level: 'Rapid Growth' | 'Growing' | 'Stable' | 'Declining' | 'Rapid Decline';
  /** Detailed breakdown by component */
  breakdown: {
    activityGrowth: number;
    impactGrowth: number;
    skillsGrowth: number;
  };
  /** Additional metadata */
  details: {
    commitsChange: number;
    starsChange: number;
    forksChange: number;
    newLanguages: number;
    yearsCompared: number;
  };
};
