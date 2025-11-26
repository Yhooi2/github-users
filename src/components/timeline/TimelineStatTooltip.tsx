/**
 * TimelineStatTooltip - Tooltip content for timeline statistics
 *
 * Provides explanations for each stat type shown in YearCard and DesktopTimelineLayout.
 */

import { cn } from "@/lib/utils";
import { CircleDot, FolderGit2, GitCommit, GitPullRequest, type LucideIcon } from "lucide-react";

export type TimelineStatType = "commits" | "prs" | "issues" | "repos";

export interface TimelineStatTooltipProps {
  /** Type of stat to explain */
  statType: TimelineStatType;
  /** Current value */
  value: number;
  /** Optional: context (year or "all time") */
  context?: string;
  /** Additional class names */
  className?: string;
}

interface StatConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
}

const STAT_CONFIGS: Record<TimelineStatType, StatConfig> = {
  commits: {
    icon: GitCommit,
    title: "Commits",
    description: "Code changes pushed to repositories",
    detail: "Each commit represents a snapshot of changes made to the codebase. More commits indicate higher coding activity.",
  },
  prs: {
    icon: GitPullRequest,
    title: "Pull Requests",
    description: "Code contributions submitted for review",
    detail: "PRs show collaboration and code review participation. Includes both opened and merged pull requests.",
  },
  issues: {
    icon: CircleDot,
    title: "Issues",
    description: "Bug reports and feature requests created",
    detail: "Issues track bugs, feature requests, and tasks. Creating issues shows engagement with project management.",
  },
  repos: {
    icon: FolderGit2,
    title: "Repositories",
    description: "Projects worked on",
    detail: "Count of unique repositories with activity. Includes both owned projects and contributions to others.",
  },
};

/**
 * TimelineStatTooltip Component
 *
 * Displays detailed information about a timeline statistic.
 * Used in tooltips for YearCard and DesktopTimelineLayout stats.
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger>
 *     <GitCommit /> 629
 *   </TooltipTrigger>
 *   <TooltipContent>
 *     <TimelineStatTooltip statType="commits" value={629} context="2025" />
 *   </TooltipContent>
 * </Tooltip>
 * ```
 */
export function TimelineStatTooltip({
  statType,
  value,
  context,
  className,
}: TimelineStatTooltipProps) {
  const config = STAT_CONFIGS[statType];
  const Icon = config.icon;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header with icon and title */}
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        <span className="font-semibold text-foreground">{config.title}</span>
      </div>

      {/* Value display */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-primary tabular-nums">
          {value.toLocaleString()}
        </span>
        {context && (
          <span className="text-sm text-muted-foreground">
            {context === "all" ? "all time" : `in ${context}`}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground">{config.description}</p>

      {/* Detailed explanation */}
      <p className="text-xs text-muted-foreground/80 border-t border-border pt-2">
        {config.detail}
      </p>
    </div>
  );
}
