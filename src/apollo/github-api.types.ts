// Pagination types
type PageInfo = {
  endCursor: string;
  hasNextPage: boolean;
};

// Programming language types
type ProgrammingLanguage = {
  name: string;
};

type LanguageEdge = {
  size: number;
  node: ProgrammingLanguage;
};

type Languages = {
  totalSize: number;
  edges: LanguageEdge[];
};

// Commit history types
type CommitHistory = {
  totalCount: number;
};

type GitTarget = {
  history: CommitHistory;
};

type BranchRef = {
  target: GitTarget;
};

// Repository contribution types
type ContributionsByRepository = {
  totalCount: number;
};

type RepositoryContributions = {
  contributions: ContributionsByRepository;
  repository: {
    name: string;
  };
};

// Contribution collection types
type ContributionsCollection = {
  totalCommitContributions: number;
  commitContributionsByRepository: RepositoryContributions[];
};

// Yearly contribution types
type YearlyContributions = {
  totalCommitContributions: number;
};

// Connection count types (followers/following/gists)
type ConnectionCount = {
  totalCount: number;
};

// Repository owner type
type RepositoryOwner = {
  login: string;
  avatarUrl: string;
};

// Parent repository type (for forks)
type ParentRepository = {
  name: string;
  owner: RepositoryOwner;
  url: string;
};

// Repository topic type
type RepositoryTopic = {
  topic: {
    name: string;
  };
};

type RepositoryTopics = {
  nodes: RepositoryTopic[];
};

// License information type
type LicenseInfo = {
  name: string;
};

// Repository type
type Repository = {
  name: string;
  id: string;
  description: string | null;
  forkCount: number;
  stargazerCount: number;
  url: string;

  // Owner
  owner: RepositoryOwner;

  // Authenticity fields
  isFork: boolean;
  isTemplate: boolean;
  parent: ParentRepository | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;

  // Additional stats
  diskUsage: number | null;
  isArchived: boolean;
  homepageUrl: string | null;

  // Engagement
  watchers: ConnectionCount;
  issues: ConnectionCount;

  // Topics and license
  repositoryTopics: RepositoryTopics;
  licenseInfo: LicenseInfo | null;

  // Existing fields
  defaultBranchRef: BranchRef | null;
  primaryLanguage: ProgrammingLanguage | null;
  languages: Languages;
};

// Repository collection types
type Repositories = {
  totalCount: number;
  pageInfo: PageInfo;
  nodes: Repository[];
};

// GitHub user type
type GitHubUser = {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  url: string;
  location: string | null;
  // Optional profile fields (from GET_USER_PROFILE query)
  email?: string | null;
  company?: string | null;
  websiteUrl?: string | null;
  twitterUsername?: string | null;
  // Social stats
  followers: ConnectionCount;
  following: ConnectionCount;
  gists: ConnectionCount;
  // Yearly contributions
  year1: YearlyContributions;
  year2: YearlyContributions;
  year3: YearlyContributions;
  createdAt: string;
  contributionsCollection: ContributionsCollection;
  repositories: Repositories;
};

// Rate limit information from backend proxy
type RateLimit = {
  remaining: number;
  limit: number;
  reset: number;
  used: number;
  isDemo: boolean;
  userLogin?: string;
};

// Root GraphQL response type
type GitHubGraphQLResponse = {
  user: GitHubUser;
  rateLimit?: RateLimit; // Optional: added by backend proxy
};

export type {
  ConnectionCount,
  ContributionsCollection,
  GitHubGraphQLResponse,
  GitHubUser,
  Languages,
  LicenseInfo,
  PageInfo,
  ParentRepository,
  ProgrammingLanguage,
  RateLimit,
  Repository,
  RepositoryContributions,
  RepositoryOwner,
  RepositoryTopic,
  RepositoryTopics,
  YearlyContributions,
};
