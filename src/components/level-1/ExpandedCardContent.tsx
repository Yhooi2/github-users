import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getLanguageColor } from "@/lib/constants";
import { formatNumber } from "@/lib/statistics";
import { GitFork, GitPullRequest, MessageSquare, Star, Users } from "lucide-react";

export interface ProjectContribution {
  /** Percentage of commits by this user */
  commitsPercent: number;
  /** Total commits in the repo */
  totalCommits: number;
  /** PRs merged by this user */
  prsMerged: number;
  /** Code reviews by this user */
  reviews: number;
  /** Active period string */
  activePeriod: string;
}

export interface TechStackItem {
  /** Language name */
  lang: string;
  /** Percentage of codebase */
  percent: number;
}

export interface TeamMember {
  /** Display name */
  name: string;
  /** Avatar URL */
  avatar: string;
  /** Optional login for fallback */
  login?: string;
}

export interface ExpandedCardContentProps {
  /** Stars count */
  stars: number;
  /** Forks count */
  forks: number;
  /** User's contribution data */
  contribution?: ProjectContribution;
  /** Tech stack breakdown */
  techStack?: TechStackItem[];
  /** Team information */
  team?: {
    count: number;
    top: TeamMember[];
  };
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Content displayed in expanded Level 1 cards
 *
 * Shows 4 sections:
 * 1. Social stats (stars, forks)
 * 2. Your contribution metrics
 * 3. Tech stack breakdown
 * 4. Team overview
 *
 * @example
 * ```tsx
 * <ExpandedCardContent
 *   stars={1250}
 *   forks={89}
 *   contribution={{
 *     commitsPercent: 18,
 *     totalCommits: 1923,
 *     prsMerged: 42,
 *     reviews: 156,
 *     activePeriod: "Jan 2024 - Nov 2025"
 *   }}
 *   techStack={[
 *     { lang: "TypeScript", percent: 68 },
 *     { lang: "JavaScript", percent: 22 },
 *     { lang: "CSS", percent: 10 }
 *   ]}
 *   team={{ count: 12, top: [...] }}
 * />
 * ```
 */
export function ExpandedCardContent({
  stars,
  forks,
  contribution,
  techStack,
  team,
  isLoading = false,
}: ExpandedCardContentProps) {
  if (isLoading) {
    return <ExpandedCardContentSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Social Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Star className="h-4 w-4" />
          <span>{formatNumber(stars)} stars</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <GitFork className="h-4 w-4" />
          <span>{formatNumber(forks)} forks</span>
        </div>
      </div>

      {/* Contribution Section */}
      {contribution && (
        <>
          <Separator />
          <section aria-labelledby="contribution-heading">
            <h4
              id="contribution-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Your Contribution
            </h4>
            <div className="space-y-3">
              {/* Commits percentage */}
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Commits</span>
                  <span className="font-medium">
                    {contribution.commitsPercent}% of {formatNumber(contribution.totalCommits)}
                  </span>
                </div>
                <Progress value={contribution.commitsPercent} className="h-2" />
              </div>

              {/* PRs and Reviews */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                  <span>{contribution.prsMerged} PRs merged</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{contribution.reviews} reviews</span>
                </div>
              </div>

              {/* Active period */}
              <p className="text-xs text-muted-foreground">
                Active: {contribution.activePeriod}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Tech Stack Section */}
      {techStack && techStack.length > 0 && (
        <>
          <Separator />
          <section aria-labelledby="tech-stack-heading">
            <h4
              id="tech-stack-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Tech Stack
            </h4>
            <div className="space-y-2">
              {techStack.map((item) => (
                <div key={item.lang} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: getLanguageColor(item.lang) }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">{item.lang}</span>
                  <div className="w-20">
                    <Progress value={item.percent} className="h-1.5" />
                  </div>
                  <span className="w-10 text-right text-xs text-muted-foreground">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Team Section */}
      {team && (
        <>
          <Separator />
          <section aria-labelledby="team-heading">
            <h4
              id="team-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Team
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{team.count} contributors</span>
              </div>
              {team.top.length > 0 && (
                <div className="flex -space-x-2">
                  {team.top.slice(0, 5).map((member) => (
                    <Avatar
                      key={member.login || member.name}
                      className="h-6 w-6 border-2 border-background"
                    >
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs">
                        {member.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.top.length > 5 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                      +{team.top.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/**
 * Skeleton loader for ExpandedCardContent
 */
function ExpandedCardContentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Separator />
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-2 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}
