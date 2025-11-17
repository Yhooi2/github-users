import { gql } from '@apollo/client'

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
            isArchived
            isPrivate
            primaryLanguage {
              name
              color
            }
            owner {
              login
              avatarUrl
            }
            licenseInfo {
              name
              spdxId
            }
            defaultBranchRef {
              name
            }
          }
        }
      }
    }
  }
`

/**
 * TypeScript types for repository data
 */
export interface Repository {
  id: string
  name: string
  nameWithOwner: string
  url: string
  description: string | null
  createdAt: string
  updatedAt: string
  pushedAt: string | null
  stargazerCount: number
  forkCount: number
  isFork: boolean
  isArchived: boolean
  isPrivate: boolean
  primaryLanguage: {
    name: string
    color: string
  } | null
  owner: {
    login: string
    avatarUrl: string
  }
  licenseInfo: {
    name: string
    spdxId: string
  } | null
  defaultBranchRef: {
    name: string
  } | null
}

/**
 * Repository with contribution count
 */
export interface RepositoryContribution {
  contributions: {
    totalCount: number
  }
  repository: Repository
}

/**
 * Contributions collection for a specific time period
 */
export interface ContributionsCollection {
  totalCommitContributions: number
  totalIssueContributions: number
  totalPullRequestContributions: number
  totalPullRequestReviewContributions: number
  restrictedContributionsCount: number
  commitContributionsByRepository: RepositoryContribution[]
}

/**
 * GraphQL response type for GetYearContributions query
 */
export interface GetYearContributionsResponse {
  user: {
    contributionsCollection: ContributionsCollection
  }
}

/**
 * GraphQL variables for GetYearContributions query
 */
export interface GetYearContributionsVariables {
  login: string
  from: string
  to: string
}
