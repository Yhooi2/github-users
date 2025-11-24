import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HorizontalLanguageBar } from "@/components/shared/HorizontalLanguageBar";
import { useReducedMotion, useResponsive } from "@/hooks";
import { formatNumber } from "@/lib/statistics";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  GitCommit,
  GitFork,
  LineChart,
  Star,
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
  maxCommits: _maxCommits,
  children,
}: ExpandableProjectCardProps) {
  const { isMobile } = useResponsive();
  const prefersReducedMotion = useReducedMotion();
  // maxCommits kept for interface compatibility
  void _maxCommits;

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

  // Prepare languages for horizontal bar
  const languagesForBar = project.languages?.map((lang) => ({
    name: lang.name,
    percent: lang.percent,
    size: lang.size,
  })) ?? (project.language ? [{ name: project.language, percent: 100 }] : []);

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded
          ? "shadow-md ring-2 ring-primary/20"
          : "hover:shadow-md hover:bg-accent/50 hover:border-primary/30",
      )}
    >
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
          "cursor-pointer p-3 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        )}
      >
        {/* Top row: Name, fork badge, metrics, chevron */}
        <div className="flex items-center gap-3">
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
            <span className="flex items-center gap-0.5" title={`${project.commits} commits`}>
              <GitCommit className="h-3 w-3" aria-hidden="true" />
              {formatNumber(project.commits)}
            </span>
            <span className="flex items-center gap-0.5" title={`${project.stars} stars`}>
              <Star className="h-3 w-3" aria-hidden="true" />
              {formatNumber(project.stars)}
            </span>
          </div>

          {/* Expand/collapse icon with rotation animation */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
          </motion.div>
        </div>

        {/* Horizontal language bar - below the header row */}
        {languagesForBar.length > 0 && (
          <div className="mt-2">
            <HorizontalLanguageBar
              languages={languagesForBar}
              barHeight="h-1.5"
              showLegend={!isMobile}
              maxLegendItems={4}
              showPercentages={false}
              compact
            />
          </div>
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

              {/* Action buttons with micro-interactions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
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
                </motion.div>
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
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
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
