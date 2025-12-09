import type { Repository } from "@/apollo/github-api.types";
import { gql } from "@apollo/client";

/**
 * GraphQL query to fetch user contributions for a specific year
 *
 * Returns:
 * - Contribution counts (commits, issues, PRs, reviews)
 * - Repository details with contribution counts
 * - Repository metadata (stars, forks, language, etc.)
 *
 * This query is called in parallel for each year from account creation to now.
 *
 * Cache key: user:{username}:year:{year}
 * TTL: 30 minutes
 *
 * @param login - GitHub username
 * @param from - Start date (ISO 8601, e.g., "2023-01-01T00:00:00Z")
 * @param to - End date (ISO 8601, e.g., "2023-12-31T23:59:59Z")
 */
export const GET_YEAR_CONTRIBUTIONS = gql`
  query GetYearContributions(
    $login: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        restrictedContributionsCount

        # Calendar for mini activity charts
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }

        commitContributionsByRepository(maxRepositories: 100) {
          contributions {
            totalCount
          }
          repository {
            id
            name
            nameWithOwner
            url
            description
            createdAt
            updatedAt
            pushedAt
            stargazerCount
            forkCount
            isFork
            isTemplate
            isArchived
            isPrivate
            diskUsage
            homepageUrl
            primaryLanguage {
              name
              color
            }
            owner {
              login
              avatarUrl
            }
            parent {
              id #
              name
              nameWithOwner
              url
              owner {
                login
              }
            }
            watchers {
              totalCount
            }
            issues {
              totalCount
            }
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
            languages(first: 5) {
              totalSize
              edges {
                size
                node {
                  name
                }
              }
            }
            licenseInfo {
              name
              spdxId
            }
            defaultBranchRef {
              name
              target {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
/**
 * Single day contribution data from contributionCalendar
 */
export interface ContributionDay {
  contributionCount: number;
  date: string; // ISO date "2025-01-15"
}

/**
 * Week of contribution days
 */
export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

/**
 * Contribution calendar with daily/weekly data
 * Used for mini activity charts in YearCard
 */
export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

/**
 * Repository with contribution count
 */
export interface RepositoryContribution {
  contributions: {
    totalCount: number;
  };
  repository: Repository;
}

/**
 * Contributions collection for a specific time period
 */
export interface ContributionsCollection {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  restrictedContributionsCount: number;
  contributionCalendar: ContributionCalendar;
  commitContributionsByRepository: RepositoryContribution[];
}

/**
 * GraphQL response type for GetYearContributions query
 */
export interface GetYearContributionsResponse {
  user: {
    contributionsCollection: ContributionsCollection;
  };
}

/**
 * GraphQL variables for GetYearContributions query
 */
export interface GetYearContributionsVariables {
  login: string;
  from: string;
  to: string;
}
