import { useState, useEffect } from 'react'
import { useQuery, useApolloClient, ApolloError } from '@apollo/client'
import {
  GET_USER_PROFILE,
  type UserProfile,
  type GetUserProfileResponse,
  type GetUserProfileVariables,
} from '@/apollo/queries/userProfile'
import {
  GET_YEAR_CONTRIBUTIONS,
  type RepositoryContribution,
  type GetYearContributionsResponse,
  type GetYearContributionsVariables,
} from '@/apollo/queries/yearContributions'
import { generateYearRanges } from '@/lib/date-utils'

/**
 * Year data with contributions and repositories
 */
export interface YearData {
  year: number
  totalCommits: number
  totalIssues: number
  totalPRs: number
  totalReviews: number
  ownedRepos: RepositoryContribution[]
  contributions: RepositoryContribution[]
}

/**
 * Hook return type
 */
export interface UseUserAnalyticsReturn {
  profile: UserProfile | null
  timeline: YearData[]
  loading: boolean
  error: ApolloError | undefined
}

/**
 * Custom hook for fetching user analytics data
 *
 * This hook orchestrates the following flow:
 * 1. Fetch user profile (including createdAt)
 * 2. Generate year ranges from account creation to now
 * 3. Fetch contributions for each year in parallel
 * 4. Separate owned repositories from contributions
 * 5. Return timeline data sorted by year (newest first)
 *
 * @param username - GitHub username to analyze
 * @returns Object with profile, timeline, loading state, and error
 *
 * @example
 * ```tsx
 * function UserAnalytics({ username }: { username: string }) {
 *   const { profile, timeline, loading, error } = useUserAnalytics(username)
 *
 *   if (loading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!profile) return <div>User not found</div>
 *
 *   return (
 *     <div>
 *       <h1>{profile.name}</h1>
 *       {timeline.map(year => (
 *         <YearCard key={year.year} data={year} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useUserAnalytics(username: string): UseUserAnalyticsReturn {
  const client = useApolloClient()
  const [timeline, setTimeline] = useState<YearData[]>([])
  const [yearLoading, setYearLoading] = useState(true)

  // Step 1: Get user profile
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useQuery<GetUserProfileResponse, GetUserProfileVariables>(
    GET_USER_PROFILE,
    {
      variables: { login: username },
      skip: !username,
      // Cache key for backend proxy
      context: { cacheKey: `user:${username}:profile` },
    }
  )

  // Handle empty username case
  useEffect(() => {
    if (!username) {
      setYearLoading(false)
    }
  }, [username])

  // Step 2: Fetch yearly data when profile loads
  useEffect(() => {
    if (!profileData || profileLoading || !username) {
      return
    }

    async function fetchYears() {
      // Null guard: Ensure user exists and has valid createdAt
      if (!profileData?.user?.createdAt) {
        console.error('No user found or invalid createdAt')
        setYearLoading(false)
        return
      }

      try {
        setYearLoading(true)

        const createdAt = profileData.user.createdAt
        const yearRanges = generateYearRanges(createdAt)

        // Step 3: Parallel queries for each year
        const yearPromises = yearRanges.map(async ({ year, from, to }) => {
          const result = await client.query<
            GetYearContributionsResponse,
            GetYearContributionsVariables
          >({
            query: GET_YEAR_CONTRIBUTIONS,
            variables: { login: username, from, to },
            // Cache key for backend proxy
            context: { cacheKey: `user:${username}:year:${year}` },
          })

          const collection = result.data.user.contributionsCollection
          const repos = collection.commitContributionsByRepository

          // Step 4: Separate owned repos from contributions
          const ownedRepos = repos.filter(
            (r) => r.repository.owner.login === username
          )
          const contributions = repos.filter(
            (r) => r.repository.owner.login !== username
          )

          return {
            year,
            totalCommits: collection.totalCommitContributions,
            totalIssues: collection.totalIssueContributions,
            totalPRs: collection.totalPullRequestContributions,
            totalReviews: collection.totalPullRequestReviewContributions,
            ownedRepos,
            contributions,
          }
        })

        // Wait for all year queries to complete
        const years = await Promise.all(yearPromises)

        // Step 5: Sort by year (newest first)
        const sortedYears = years.sort((a, b) => b.year - a.year)

        setTimeline(sortedYears)
        setYearLoading(false)
      } catch (error) {
        console.error('Year data fetch error:', error)
        setYearLoading(false)
      }
    }

    fetchYears()
  }, [profileData, profileLoading, username, client])

  return {
    profile: profileData?.user ?? null,
    timeline,
    loading: profileLoading || yearLoading,
    error: profileError,
  }
}
