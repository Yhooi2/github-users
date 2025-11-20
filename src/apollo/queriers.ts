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
 * - Rate limit information (injected by proxy or available from schema)
 *
 * @remarks
 * The query uses 9 date-time variables to support multiple time ranges:
 * - $from, $to: Main contribution period
 * - $year1From, $year1To: Year 1 (current-2 years)
 * - $year2From, $year2To: Year 2 (current-1 year)
 * - $year3From, $year3To: Year 3 (current year)
 */
export const GET_USER_INFO = gql`
  query GetUser(
    $login: String!
    $from: DateTime!
    $to: DateTime!
    $year1From: DateTime!
    $year1To: DateTime!
    $year2From: DateTime!
    $year2To: DateTime!
    $year3From: DateTime!
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
        totalCommitContributions
        commitContributionsByRepository(maxRepositories: 100) {
          contributions {
            totalCount
          }
          repository {
            name
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          name
          description
          forkCount
          stargazerCount
          url
          isFork
          isTemplate
          parent {
            name
            owner {
              login
            }
            url
          }
          createdAt
          updatedAt
          pushedAt
          diskUsage
          isArchived
          homepageUrl
          watchers {
            totalCount
          }
          issues {
            totalCount
          }
          repositoryTopics(first: 20) {
            nodes {
              topic {
                name
              }
            }
          }
          licenseInfo {
            name
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
          primaryLanguage {
            name
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
        }
      }
    }
    rateLimit {
      remaining
      limit
      reset
      used
      isDemo
      userLogin
    }
  }
`;
