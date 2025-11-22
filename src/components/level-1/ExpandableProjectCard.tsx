import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useReducedMotion, useResponsive } from "@/hooks";
import { getLanguageColor } from "@/lib/constants";
import { formatNumber } from "@/lib/statistics";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LineChart,
  Star,
  User,
  Users,
} from "lucide-react";
import type { CompactProject } from "../level-0/CompactProjectRow";

export interface ExpandableProject extends CompactProject {
  /** Repository URL for external link */
  url: string;
  /** Fork count */
  forks?: number;
}

export interface ExpandableProjectCardProps {
  /** Project data */
  project: ExpandableProject;
  /** Whether card is expanded */
  isExpanded: boolean;
  /** Toggle expand/collapse */
  onToggle: () => void;
  /** Open Level 2 analytics modal */
  onOpenAnalytics: () => void;
  /** Maximum commits for bar normalization */
  maxCommits: number;
  /** Children to render in expanded area (ExpandedCardContent) */
  children?: React.ReactNode;
}

/**
 * Expandable project card for Level 1 view
 *
 * Provides inline expansion with Framer Motion animation.
 * When expanded, shows detailed project information and action buttons.
 *
 * @example
 * ```tsx
 * <ExpandableProjectCard
 *   project={projectData}
 *   isExpanded={isExpanded}
 *   onToggle={() => toggleProject(project.id)}
 *   onOpenAnalytics={() => openModal(project.id)}
 *   maxCommits={500}
 * >
 *   <ExpandedCardContent project={projectData} />
 * </ExpandableProjectCard>
 * ```
 */
export function ExpandableProjectCard({
  project,
  isExpanded,
  onToggle,
  onOpenAnalytics,
  maxCommits,
  children,
}: ExpandableProjectCardProps) {
  const { isMobile } = useResponsive();
  const prefersReducedMotion = useReducedMotion();

  // Calculate bar height
  const barHeight = maxCommits > 0 ? (project.commits / maxCommits) * 100 : 0;
  const languageColor = getLanguageColor(project.language);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  // Animation variants
  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
    },
    expanded: {
      height: "auto",
      opacity: 1,
    },
  };

  const transition = {
    duration: prefersReducedMotion ? 0 : 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  return (
    <Card className={cn("overflow-hidden transition-shadow", isExpanded && "shadow-md")}>
      {/* Header row - always visible */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={`card-content-${project.id}`}
        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${project.name} details`}
        className={cn(
          "flex cursor-pointer items-center gap-3 p-3 transition-colors",
          "h-14 md:h-14",
          isMobile && "h-12",
          "hover:bg-muted/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        )}
      >
        {/* Commit bar */}
        <div className="relative h-full w-1 flex-shrink-0 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "absolute bottom-0 w-full rounded-full transition-all duration-300",
              project.isOwner
                ? "bg-gradient-to-t from-blue-600 to-blue-400"
                : "bg-gradient-to-t from-green-600 to-green-400",
            )}
            style={{ height: `${barHeight}%` }}
            aria-hidden="true"
          />
        </div>

        {/* Project name */}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {project.name}
        </span>

        {/* Owner/Contributor badge */}
        <Badge
          variant={project.isOwner ? "default" : "secondary"}
          className="flex-shrink-0 gap-1"
        >
          {project.isOwner ? (
            <>
              <User className="h-3 w-3" aria-hidden="true" />
              {!isMobile && <span>Owner</span>}
            </>
          ) : (
            <>
              <Users className="h-3 w-3" aria-hidden="true" />
              {!isMobile && <span>Contrib</span>}
            </>
          )}
        </Badge>

        {/* Metrics */}
        <div className="flex flex-shrink-0 items-center gap-3 text-xs text-muted-foreground">
          <span title={`${project.commits} commits`}>
            {formatNumber(project.commits)}
            {!isMobile && "c"}
          </span>
          <span className="flex items-center gap-0.5" title={`${project.stars} stars`}>
            <Star className="h-3 w-3" aria-hidden="true" />
            {formatNumber(project.stars)}
          </span>
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

        {/* Expand/collapse icon */}
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
      </div>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`card-content-${project.id}`}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            transition={transition}
            className="overflow-hidden"
          >
            <div className="border-t p-4">
              {/* Description */}
              {project.description && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {project.description}
                </p>
              )}

              {/* Custom content (ExpandedCardContent) */}
              {children}

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAnalytics();
                  }}
                  className="gap-1"
                >
                  <LineChart className="h-4 w-4" />
                  View Analytics
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
