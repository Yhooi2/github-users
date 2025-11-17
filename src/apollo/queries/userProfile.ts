import { gql } from '@apollo/client'

/**
 * GraphQL query to fetch user profile information
 *
 * Returns basic user data including:
 * - Profile details (name, bio, avatar, etc.)
 * - Account creation date (needed for year range generation)
 * - Social stats (followers, following, gists, repos)
 *
 * This query is the first step in the analytics flow:
 * 1. Fetch profile → Get createdAt
 * 2. Generate year ranges from createdAt to now
 * 3. Fetch yearly contributions (parallel)
 *
 * Cache key: user:{username}:profile
 * TTL: 30 minutes
 */
export const GET_USER_PROFILE = gql`
  query GetUserProfile($login: String!) {
    user(login: $login) {
      id
      login
      name
      avatarUrl
      bio
      url
      location
      createdAt
      email
      company
      websiteUrl
      twitterUsername
      followers {
        totalCount
      }
      following {
        totalCount
      }
      gists {
        totalCount
      }
      repositories(first: 1, ownerAffiliations: OWNER) {
        totalCount
      }
    }
  }
`

/**
 * TypeScript type for user profile data
 */
export interface UserProfile {
  id: string
  login: string
  name: string | null
  avatarUrl: string
  bio: string | null
  url: string
  location: string | null
  createdAt: string
  email: string | null
  company: string | null
  websiteUrl: string | null
  twitterUsername: string | null
  followers: {
    totalCount: number
  }
  following: {
    totalCount: number
  }
  gists: {
    totalCount: number
  }
  repositories: {
    totalCount: number
  }
}

/**
 * GraphQL response type for GetUserProfile query
 */
export interface GetUserProfileResponse {
  user: UserProfile
}

/**
 * GraphQL variables for GetUserProfile query
 */
export interface GetUserProfileVariables {
  login: string
}
