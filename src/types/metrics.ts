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
