import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useResponsive } from "@/hooks";
import { getLanguageColor } from "@/lib/constants";
import { formatNumber } from "@/lib/statistics";
import { cn } from "@/lib/utils";
import { GitFork, Star } from "lucide-react";

/**
 * Language breakdown for multi-language display
 */
export interface LanguageInfo {
  /** Language name */
  name: string;
  /** Percentage of codebase (0-100) */
  percent: number;
  /** Size in bytes */
  size?: number;
}

/**
 * Project data for compact row display
 */
export interface CompactProject {
  /** Unique identifier */
  id: string;
  /** Repository name */
  name: string;
  /** Number of commits in this period */
  commits: number;
  /** Star count */
  stars: number;
  /** Primary programming language */
  language: string;
  /** All languages with percentages (for language bar) */
  languages?: LanguageInfo[];
  /** Whether user is the owner */
  isOwner: boolean;
  /** Whether repository is a fork */
  isFork: boolean;
  /** Optional description for hover preview */
  description?: string;
  /** Repository URL */
  url?: string;
}

export interface CompactProjectRowProps {
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
 * Compact project row component for Level 0 list view
 *
 * Displays project info in a single 56px (desktop) / 48px (mobile) row with:
 * - Vertical commit bar (proportional to max commits)
 * - Project name
 * - Owner/contributor badge
 * - Metrics (commits, stars, language)
 * - Hover preview with full description
 *
 * @example
 * ```tsx
 * <CompactProjectRow
 *   project={{
 *     id: "1",
 *     name: "react-app",
 *     commits: 150,
 *     stars: 1200,
 *     language: "TypeScript",
 *     isOwner: true,
 *     description: "A React application"
 *   }}
 *   maxCommits={500}
 *   isExpanded={false}
 *   onClick={() => handleExpand("1")}
 * />
 * ```
 */
export function CompactProjectRow({
  project,
  maxCommits: _maxCommits,
  onClick,
  isExpanded,
}: CompactProjectRowProps) {
  const { isMobile } = useResponsive();
  // maxCommits is kept for interface compatibility but no longer used
  void _maxCommits;

  // Get language color
  const languageColor = getLanguageColor(project.language);

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
      aria-label={`Expand ${project.name} details`}
      aria-expanded={isExpanded}
      className={cn(
        // Base styles
        "group relative flex items-center gap-3 rounded-md px-3 py-2",
        // Height: 56px desktop, 48px mobile
        "h-14 md:h-14",
        isMobile && "h-12",
        // Background states
        "transition-all duration-200 ease-out",
        isExpanded
          ? "bg-muted/30"
          : "hover:scale-[1.02] hover:bg-muted/50 hover:shadow-md",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Cursor
        "cursor-pointer",
      )}
    >
      {/* Project name */}
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {project.name}
      </span>

      {/* Fork badge - only shown if forked */}
      {project.isFork && (
        <Badge variant="outline" className="flex-shrink-0 gap-1 text-xs">
          <GitFork className="h-3 w-3" aria-hidden="true" />
          {!isMobile && <span>Fork</span>}
        </Badge>
      )}

      {/* Metrics */}
      <div className="flex flex-shrink-0 items-center gap-3 text-xs text-muted-foreground">
        {/* Commits */}
        <span title={`${project.commits} commits`}>
          {formatNumber(project.commits)}
          {!isMobile && "c"}
        </span>

        {/* Stars */}
        <span className="flex items-center gap-0.5" title={`${project.stars} stars`}>
          <Star className="h-3 w-3" aria-hidden="true" />
          {formatNumber(project.stars)}
        </span>

        {/* Language */}
        {project.language && (
          <span className="flex items-center gap-1">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: languageColor }}
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
      <HoverCardContent side="right" className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{project.name}</h4>
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}
          <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
            <span>{formatNumber(project.commits)} commits</span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              {formatNumber(project.stars)} stars
            </span>
            {project.language && (
              <span className="flex items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: languageColor }}
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
