/**
 * YearCardGlass Wrapper - Adapts shadcn-glass-ui YearCardGlass to our YearData
 *
 * Wraps the compound YearCardGlass component to work with our existing
 * YearData type and analysis logic while leveraging Glass UI styling.
 */

import type { YearData } from "@/hooks/useUserAnalytics";
import { analyzeYear } from "@/lib/year-badges";
import { FolderGit2, GitCommit, GitPullRequest } from "lucide-react";
import { useMemo } from "react";
import { YearCardGlass } from "shadcn-glass-ui";

export interface YearCardWrapperProps {
  /** Year data from Apollo */
  year: YearData;
  /** Max commits across all years (for progress normalization) */
  maxCommits: number;
  /** All years data (for badge analysis) */
  allYears: Array<{ year: number; totalCommits: number }>;
  /** Whether this year is currently selected */
  isSelected: boolean;
  /** Callback when year is clicked */
  onSelect: () => void;
}

/**
 * YearCardWrapper - Maps our YearData to YearCardGlass compound API
 *
 * Uses YearCardGlass.Root and sub-components for Glass styling while
 * maintaining compatibility with existing timeline logic.
 */
export function YearCardWrapper({
  year,
  maxCommits,
  allYears,
  isSelected,
  onSelect,
}: YearCardWrapperProps) {
  // Calculate progress percentage
  const widthPercent =
    maxCommits > 0 ? (year.totalCommits / maxCommits) * 100 : 0;

  // Count repositories
  const repoCount = year.ownedRepos.length + year.contributions.length;

  // Analyze year for badge
  const analysis = useMemo(
    () =>
      analyzeYear(
        year.year,
        year.totalCommits,
        allYears.map((y) => ({ year: y.year, commits: y.totalCommits })),
      ),
    [year.year, year.totalCommits, allYears],
  );

  // Convert monthly contributions to sparkline data
  const sparklineData = useMemo(
    () => year.monthlyContributions?.map((m) => m.contributions) || [],
    [year.monthlyContributions],
  );

  const sparklineLabels = useMemo(
    () => year.monthlyContributions?.map((m) => m.monthName) || [],
    [year.monthlyContributions],
  );

  return (
    <YearCardGlass.Root
      isSelected={isSelected}
      isExpanded={isSelected}
      onSelect={onSelect}
      onExpandedChange={(expanded: boolean) => {
        if (expanded) onSelect();
      }}
    >
      <YearCardGlass.Header>
        <YearCardGlass.Year>{year.year}</YearCardGlass.Year>
        <YearCardGlass.Badge
          emoji={analysis.badge.emoji}
          label={analysis.badge.label}
        />
        <YearCardGlass.Value>
          {year.totalCommits.toLocaleString()} commits
        </YearCardGlass.Value>
      </YearCardGlass.Header>

      {/* Progress bar with sparkline preview */}
      <div className="flex items-center gap-2">
        <YearCardGlass.Progress value={widthPercent} gradient="blue" />
        {sparklineData.length > 0 && (
          <YearCardGlass.Sparkline
            data={sparklineData}
            labels={sparklineLabels}
            height="sm"
            className="w-16 md:w-20"
          />
        )}
      </div>

      {/* Expanded content - stats, full sparkline */}
      <YearCardGlass.ExpandedContent>
        <YearCardGlass.Stats columns={3}>
          <YearCardGlass.StatItem
            icon={<GitCommit className="h-4 w-4" />}
            label="Commits"
            value={year.totalCommits.toLocaleString()}
          />
          <YearCardGlass.StatItem
            icon={<GitPullRequest className="h-4 w-4" />}
            label="Pull Requests"
            value={year.totalPRs}
          />
          <YearCardGlass.StatItem
            icon={<FolderGit2 className="h-4 w-4" />}
            label="Repositories"
            value={repoCount}
          />
        </YearCardGlass.Stats>

        {/* Full sparkline with labels when expanded */}
        {sparklineData.length > 0 && (
          <YearCardGlass.Sparkline
            data={sparklineData}
            labels={sparklineLabels}
            showLabels={true}
            height="md"
            className="w-full"
          />
        )}
      </YearCardGlass.ExpandedContent>
    </YearCardGlass.Root>
  );
}
