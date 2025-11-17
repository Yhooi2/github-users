import { useMemo } from 'react';
import type { Repository } from '@/apollo/github-api.types';
import type { AuthenticityScore } from '@/types/metrics';
import { calculateAuthenticityScore } from '@/lib/authenticity';

/**
 * React hook for calculating GitHub user authenticity score
 *
 * Optimizes authenticity score calculation with memoization to prevent
 * unnecessary recalculations when repositories haven't changed.
 *
 * @param repositories - Array of user's repositories from GitHub GraphQL API
 * @returns AuthenticityScore with score, category, breakdown, and flags
 *
 * @example
 * ```typescript
 * function UserProfile({ repositories }) {
 *   const authenticityScore = useAuthenticityScore(repositories);
 *
 *   return (
 *     <div>
 *       <span>Score: {authenticityScore.score}/100</span>
 *       <span>Category: {authenticityScore.category}</span>
 *       {authenticityScore.flags.length > 0 && (
 *         <ul>
 *           {authenticityScore.flags.map(flag => <li key={flag}>{flag}</li>)}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuthenticityScore(repositories: Repository[]): AuthenticityScore {
  return useMemo(() => calculateAuthenticityScore(repositories), [repositories]);
}
