/**
 * CompactProjectRowGlass Wrapper - Glass UI styled compact project row
 *
 * Wraps CompactProjectRow with Glass UI effects while maintaining
 * the same props interface for backward compatibility.
 *
 * Changes from original:
 * - Row container: glass background with blur/glow on hover
 * - Badge: Already using BadgeGlass via ui/badge.tsx
 * - HoverCard: Styled with glass effects via className
 */

import { ActivityStatusDot } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useResponsive } from "@/hooks";
import { getLanguageColor } from "@/lib/constants";
import { formatNumber } from "@/lib/statistics";
import type { CompactProject } from "@/lib/types/project.types";
import { cn } from "@/lib/utils";
import {
  calculateContributionPercent,
  getContributionBadgeClass,
} from "@/lib/utils/contribution-helpers";
import { GitFork, Star } from "lucide-react";

// Re-export types for backward compatibility
export type { CompactProject, LanguageInfo } from "@/lib/types/project.types";

export interface CompactProjectRowGlassProps {
  /** Project data to display */
  project: CompactProject;
  /** Maximum commits in the list (for normalizing bar height) */
  maxCommits: number;
  /** Click handler */
  onClick: () => void;
  /** Whether this row is expanded (Level 1 visible) */
  isExpanded: boolean;
}

/**
 * Glass UI styled compact project row for Level 0 list view
 *
 * Features glass morphism effects:
 * - Semi-transparent background with backdrop blur
 * - Glow effect on hover
 * - Smooth glass transitions
 *
 * @example
 * ```tsx
 * <CompactProjectRowGlass
 *   project={projectData}
 *   maxCommits={500}
 *   isExpanded={false}
 *   onClick={() => handleExpand(project.id)}
 * />
 * ```
 */
export function CompactProjectRowGlass({
  project,
  maxCommits: _maxCommits,
  onClick,
  isExpanded,
}: CompactProjectRowGlassProps) {
  const { isMobile } = useResponsive();
  // maxCommits is kept for interface compatibility but no longer used
  void _maxCommits;

  // Get language color
  const languageColor = getLanguageColor(project.language);

  // Calculate contribution percentage
  const contributionPercent = calculateContributionPercent(
    project.commits,
    project.totalRepoCommits,
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const rowContent = (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${project.name}, ${contributionPercent}% contribution. Press Enter to expand.`}
      aria-expanded={isExpanded}
      className={cn(
        // Base styles
        "group relative flex items-center gap-3 rounded-md px-3 py-2",
        // Height: 56px desktop, 48px mobile
        "h-14 md:h-14",
        isMobile && "h-12",
        // Glass morphism base
        "backdrop-blur-sm",
        // Background states with glass effects
        "transition-all duration-200 ease-out",
        isExpanded
          ? "bg-primary/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]"
          : [
              "bg-card/30",
              "hover:bg-card/50",
              "hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]",
              "hover:scale-[1.02]",
            ],
        // Focus ring
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        // Cursor
        "cursor-pointer",
        // Border for glass effect
        "border border-transparent",
        isExpanded && "border-primary/20",
        !isExpanded && "hover:border-primary/10",
      )}
    >
      {/* Contribution % Badge - MOST PROMINENT */}
      <Badge
        variant="outline"
        className={cn(
          "h-7 w-12 shrink-0 justify-center border text-sm font-bold",
          "backdrop-blur-sm",
          getContributionBadgeClass(contributionPercent),
        )}
        title={`Your contribution: ${contributionPercent}%`}
      >
        {contributionPercent}%
      </Badge>

      {/* Project name */}
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {project.name}
      </span>

      {/* Fork badge - only shown if forked */}
      {project.isFork && (
        <Badge
          variant="outline"
          className="flex-shrink-0 gap-1 text-xs backdrop-blur-sm"
        >
          <GitFork className="h-3 w-3" aria-hidden="true" />
          {!isMobile && <span>Fork</span>}
        </Badge>
      )}

      {/* Metrics */}
      <div className="flex flex-shrink-0 items-center gap-3 text-xs text-muted-foreground">
        {/* Commits */}
        <span title={`${project.commits} of your commits`}>
          {formatNumber(project.commits)}
          {!isMobile && "c"}
        </span>

        {/* Stars */}
        <span
          className="flex items-center gap-0.5"
          title={`${project.stars} stars`}
        >
          <Star className="h-3 w-3" aria-hidden="true" />
          {formatNumber(project.stars)}
        </span>

        {/* Activity Status */}
        <ActivityStatusDot
          lastActivityDate={project.lastActivityDate}
          size="sm"
        />

        {/* Language */}
        {project.language && (
          <span className="flex items-center gap-1">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_6px_currentColor]"
              style={{
                backgroundColor: languageColor,
                boxShadow: `0 0 6px ${languageColor}40`,
              }}
              aria-hidden="true"
            />
            {!isMobile && <span>{project.language}</span>}
          </span>
        )}
      </div>
    </div>
  );

  // On mobile, no hover card
  if (isMobile) {
    return rowContent;
  }

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{rowContent}</HoverCardTrigger>
      <HoverCardContent
        side="right"
        className={cn(
          "w-80",
          // Glass morphism for hover card
          "bg-popover/95 backdrop-blur-md",
          "border-primary/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        )}
      >
        <div className="space-y-3">
          {/* Header with contribution badge */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold">{project.name}</h4>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 text-xs font-bold",
                getContributionBadgeClass(contributionPercent),
              )}
            >
              {contributionPercent}% contribution
            </Badge>
          </div>

          {project.description && (
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          )}

          {/* Your contribution section */}
          <div className="space-y-1 border-t border-border/50 pt-2">
            <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Your Contribution
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span>
                <span className="font-medium">
                  {formatNumber(project.commits)}
                </span>
                {project.totalRepoCommits && (
                  <span className="text-muted-foreground">
                    {" "}
                    of {formatNumber(project.totalRepoCommits)} commits
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <ActivityStatusDot
                  lastActivityDate={project.lastActivityDate}
                  showLabel
                />
              </span>
            </div>
          </div>

          {/* Project stats */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              {formatNumber(project.stars)} stars
            </span>
            {project.language && (
              <span className="flex items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: languageColor,
                    boxShadow: `0 0 4px ${languageColor}40`,
                  }}
                />
                {project.language}
              </span>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
