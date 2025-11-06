import { gql } from "@apollo/client";

/**
 * GraphQL query for fetching comprehensive GitHub user information
 *
 * This query retrieves:
 * - User profile (name, bio, avatar, location, etc.)
 * - Connection counts (followers, following, gists)
 * - Yearly contribution statistics (last 3 years)
 * - Contribution details for a specified date range
 * - Repository list with metadata (max 100 repos per query)
 *
 * @remarks
 * The query uses 9 date-time variables to support multiple time ranges:
 * - $from, $to: Main contribution period
 * - $year1From, $year1To: Year 1 (current-2 years)
 * - $year2From, $year2To: Year 2 (current-1 year)
 * - $year3From, $year3To: Year 3 (current year)
 *
 * Year aliases (year1, year2, year3) use generic names for future compatibility.
 * Years are calculated dynamically by date-helpers.ts.
 *
 * @see {@link GitHubGraphQLResponse} for the response type definition
 * @see {@link useQueryUser} for the hook that uses this query
 */
export const GET_USER_INFO= gql`query GetUser($login: String!, 
    $from: DateTime!, 
    $to: DateTime!,
    $year1From: DateTime!,
    $year1To: DateTime!,
    $year2From: DateTime!,
    $year2To: DateTime!,
    $year3From: DateTime!,
    $year3To: DateTime!
  ) {
    user(login: $login) {
      id
      login
      name
      avatarUrl
      bio
      url
      location
      followers {
        totalCount
      }
      following {
        totalCount
      }
      gists {
        totalCount
      }
      year1: contributionsCollection(from: $year1From, to: $year1To) {
        totalCommitContributions
      }
      year2: contributionsCollection(from: $year2From, to: $year2To) {
        totalCommitContributions
      }
      year3: contributionsCollection(from: $year3From, to: $year3To) {
        totalCommitContributions
      }
      createdAt
      contributionsCollection(from: $from, to: $to) {
      totalCommitContributions  # Total commits by user in the period
      commitContributionsByRepository(maxRepositories: 100) {
        contributions {
          totalCount  # Commits in this repository
        }
        repository {
          name  # Repository name
        }
      }
    }
    repositories(first: 100, affiliations: OWNER) {
      totalCount  # Total number of repositories
      pageInfo {
        endCursor  # Cursor for next page
        hasNextPage  # Indicates if more repositories exist
      }
      nodes {
        id
        name  # Repository name
        description
        forkCount
        stargazerCount
        url  # For cloning (if precise LOC is needed)

        # Authenticity detection fields
        isFork  # Is this a forked repository?
        isTemplate  # Is this a template repository?
        parent {
          # Parent repository info for forks
          name
          owner {
            login
          }
          url
        }

        # Activity timestamps
        createdAt  # Repository creation date
        updatedAt  # Last update time
        pushedAt  # Last push time (null if no pushes)

        # Additional statistics
        diskUsage  # Repository size in KB
        isArchived  # Is archived/read-only?
        homepageUrl  # Project homepage

        # Engagement metrics
        watchers {
          totalCount  # Number of watchers
        }
        issues {
          totalCount  # Total issue count
        }

        # Topics/tags
        repositoryTopics(first: 20) {
          nodes {
            topic {
              name  # Topic name (e.g., "react", "typescript")
            }
          }
        }

        # License information
        licenseInfo {
          name  # License name (e.g., "MIT License")
        }

        defaultBranchRef {
          target {
            ... on Commit {
              history {
                totalCount  # Commits in the default branch
              }
            }
          }
        }
        primaryLanguage {
          name  # Primary programming language (may be null)
        }
        languages(first: 5) {
          totalSize  # Total code size in bytes
          edges {
            size  # Size per language in bytes
            node {
              name  # Language name
            }
          }
        }
      }
    }
  }
}`