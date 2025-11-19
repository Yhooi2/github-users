import { useQuery } from "@apollo/client"
import { useMemo } from "react"
import { getQueryDates, getThreeYearRanges } from "./date-helpers";
import { GET_USER_INFO } from "./queriers";
import type { GitHubGraphQLResponse, RateLimit } from "./github-api.types";

/**
 * Options for useQueryUser hook
 */
export interface UseQueryUserOptions {
  /**
   * Callback function called when rate limit information is received
   */
  onRateLimitUpdate?: (rateLimit: RateLimit) => void;
}

/**
 * Custom React hook for fetching GitHub user data via GraphQL
 *
 * Fetches comprehensive user profile including:
 * - Basic profile information (name, bio, avatar, location)
 * - Connection counts (followers, following, gists)
 * - Contribution statistics over the last 3 years
 * - Repository list with metadata (max 100 repos)
 *
 * The hook automatically computes date range variables and skips the query
 * when the login parameter is empty.
 *
 * @param login - GitHub username to query
 * @param daysBack - Number of days to fetch contribution data (default: 365)
 * @param options - Optional configuration including rate limit callback
 * @returns Apollo useQuery result with data, loading, and error states
 *
 * @example
 * ```typescript
 * function UserProfile({ userName }: { userName: string }) {
 *   const { data, loading, error } = useQueryUser(userName, 365, {
 *     onRateLimitUpdate: (rateLimit) => console.log('Rate limit:', rateLimit)
 *   })
 *
 *   if (loading) return <p>Loading...</p>
 *   if (error) return <p>Error: {error.message}</p>
 *   if (!data?.user) return <p>User not found</p>
 *
 *   return <h1>{data.user.name}</h1>
 * }
 * ```
 */
function useQueryUser(
  login: string,
  daysBack: number = 365,
  options?: UseQueryUserOptions
) {
  const variables = useMemo(() => {
    const queryDates = getQueryDates(daysBack);
    const yearRanges = getThreeYearRanges();

    return {
      login,
      from: queryDates.from,
      to: queryDates.to,
      year1From: yearRanges.year1.from,
      year1To: yearRanges.year1.to,
      year2From: yearRanges.year2.from,
      year2To: yearRanges.year2.to,
      year3From: yearRanges.year3.from,
      year3To: yearRanges.year3.to,
    };
  }, [login, daysBack]);

  return useQuery<GitHubGraphQLResponse>(GET_USER_INFO, {
    variables,
    skip: !login,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      // Call rate limit callback if provided and rate limit exists in response
      if (options?.onRateLimitUpdate && data.rateLimit) {
        options.onRateLimitUpdate(data.rateLimit);
      }
    },
  });
}

export default useQueryUser
