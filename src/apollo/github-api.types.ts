// Pagination types
export type PageInfo = {
  endCursor: string;
  hasNextPage: boolean;
};

// Programming language types
export type ProgrammingLanguage = {
  name: string;
};

export type LanguageEdge = {
  size: number;
  node: ProgrammingLanguage;
};

export type Languages = {
  totalSize: number;
  edges: LanguageEdge[];
};

// Commit history types
export type CommitHistory = {
  totalCount: number;
};

export type GitTarget = {
  history: CommitHistory;
};

export type BranchRef = {
  target: GitTarget;
};

// Repository contribution types
export type ContributionsByRepository = {
  totalCount: number;
};

export type RepositoryContributions = {
  contributions: ContributionsByRepository;
  repository: {
    name: string;
  };
};

export type CommitContributionsByRepository = {
  contributions: ContributionsByRepository;
  repository: {
    name: string;
  };
};

// Contribution collection types
export type ContributionsCollection = {
  totalCommitContributions: number;
  commitContributionsByRepository: RepositoryContributions[];
};

// Yearly contributions collection with commit contributions by repository
export type YearlyContributionsCollection = {
  totalCommitContributions: number;
  commitContributionsByRepository: CommitContributionsByRepository[];
};

// Yearly contribution types
export type YearlyContributions = {
  totalCommitContributions: number;
  commitContributionsByRepository: CommitContributionsByRepository[];
};

// Contribution variables type
export type ContributionQueryVariables = {
  login: string;
  from: string;
  to: string;
  [key: `year${number}From`]: string;
  [key: `year${number}To`]: string;
};

// Connection count types (followers/following/gists)
export type ConnectionCount = {
  totalCount: number;
};

// Repository type
export type Repository = {
  name: string;
  id: string;
  description: string | null;
  forkCount: number;
  stargazerCount: number;
  url: string;
  defaultBranchRef: BranchRef | null;
  primaryLanguage: ProgrammingLanguage | null;
  languages: Languages;
};

// Repository collection types
export type Repositories = {
  totalCount: number;
  pageInfo: PageInfo;
  nodes: Repository[];
};

// Simple user type for createdAt query
export type SimpleUser = {
  createdAt: string;
};

// GitHub user type
export type GitHubUser = {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  url: string;
  location: string | null;
  createdAt: string;
  followers: ConnectionCount;
  following: ConnectionCount;
  gists: ConnectionCount;
  contributionsCollection: ContributionsCollection;
  repositories: Repositories;
  [key: `contrib${number}`]: YearlyContributions; // Dynamic properties for yearly contributions
};

// Root GraphQL response types
export type GitHubGraphQLResponse = {
  user: GitHubUser;
};

export type SimpleUserGraphQLResponse = {
  user: SimpleUser;
};

// Utility type guard for checking yearly contributions
export const isYearlyContributions = (value: any): value is YearlyContributions => {
  return value && typeof value.totalCommitContributions === 'number';
};

// Utility function for creating query variables by years
export const createYearVariables = (startYear: number, endYear: number): Partial<ContributionQueryVariables> => {
  const variables: Partial<ContributionQueryVariables> = {};
  for (let year = startYear; year <= endYear; year++) {
    variables[`year${year}From`] = `${year}-01-01T00:00:00Z`;
    variables[`year${year}To`] = `${year}-12-31T23:59:59Z`;
  }
  return variables;
};