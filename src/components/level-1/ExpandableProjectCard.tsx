import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ActivityStatusDot, CombinedLanguageActivityBar } from "@/components/shared";
import { useReducedMotion, useResponsive } from "@/hooks";
import { getLanguageColor } from "@/lib/constants";
import { formatNumber } from "@/lib/statistics";
import { cn } from "@/lib/utils";
import {
  calculateContributionPercent,
  getContributionBadgeClass,
  getRoleLabel,
} from "@/lib/utils/contribution-helpers";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  GitCommit,
  GitFork,
  GitPullRequest,
  MessageSquare,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import type { CompactProject, LanguageInfo } from "../level-0/CompactProjectRow";
import { MetricTooltip } from "./MetricTooltip";
import { analyzeProjectHealth } from "@/lib/project-health";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Team member for avatar display
 */
export interface TeamMember {
  /** Display name */
  name: string;
  /** Avatar URL */
  avatar: string;
  /** GitHub login */
  login?: string;
  /** Number of commits (for tooltip) */
  commits?: number;
  /** Number of PRs (for tooltip) */
  prs?: number;
}

/**
 * Enhanced project data with inline metrics
 */
export interface ExpandableProject extends CompactProject {
  /** Repository URL for external link */
  url: string;
  /** Fork count */
  forks?: number;
  /** User's commit percentage (0-100) */
  contributionPercent?: number;
  /** Total commits in the repo */
  totalCommits?: number;
  /** User's commits */
  userCommits?: number;
  /** PRs merged by this user */
  prsMerged?: number;
  /** Code reviews by this user */
  reviews?: number;
  /** Active period string */
  activePeriod?: string;
  /** Total contributors */
  teamCount?: number;
  /** Top contributors for avatar display */
  topContributors?: TeamMember[];
  /** Whether project is archived */
  isArchived?: boolean;
  /** Last push date (ISO string) */
  pushedAt?: string | null;
}

export interface ExpandableProjectCardProps {
  /** Project data */
  project: ExpandableProject;
  /** Whether card is expanded */
  isExpanded: boolean;
  /** Toggle expand/collapse */
  onToggle: () => void;
  /** Maximum commits for bar normalization */
  maxCommits: number;
}

/**
 * Expandable project card with inline analytics
 *
 * Features:
 * - Full card clickability for expand/collapse
 * - Combined language + activity bar
 * - Inline metrics with tooltips for context
 * - No modal - all information displayed inline
 * - Reduced motion support
 *
 * @example
 * ```tsx
 * <ExpandableProjectCard
 *   project={projectData}
 *   isExpanded={isExpanded}
 *   onToggle={() => toggleProject(project.id)}
 *   maxCommits={500}
 * />
 * ```
 */
export function ExpandableProjectCard({
  project,
  isExpanded,
  onToggle,
  maxCommits,
}: ExpandableProjectCardProps) {
  const { isMobile } = useResponsive();
  const prefersReducedMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  // Calculate contribution percentage (use provided or calculate from data)
  const contributionPercent = project.contributionPercent ??
    calculateContributionPercent(project.userCommits ?? project.commits, project.totalCommits);

  // Get role label based on contribution
  const roleLabel = getRoleLabel(contributionPercent, project.isOwner);

  // Prepare languages for combined bar
  const languagesForBar =
    project.languages?.map((lang) => ({
      name: lang.name,
      percent: lang.percent,
    })) ??
    (project.language ? [{ name: project.language, percent: 100 }] : []);

  // Get top 3 languages for inline display (top 2 on mobile)
  const topLanguages = (project.languages ?? []).slice(0, isMobile ? 2 : 3);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      aria-expanded={isExpanded}
      aria-controls={`card-content-${project.id}`}
      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${project.name} details`}
      className={cn(
        "overflow-hidden transition-all duration-200 cursor-pointer",
        isExpanded
          ? "shadow-md border-primary/40"
          : "hover:shadow-md hover:bg-accent/50 hover:border-primary/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
    >
      {/* Header row - always visible */}
      <div className="p-3">
        {/* Top row: Contribution badge, Name, fork badge, metrics, chevron */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Contribution % Badge - MOST PROMINENT */}
          <MetricTooltip
            content={`Your contribution: ${contributionPercent}% (${roleLabel})`}
            underline={false}
          >
            <Badge
              variant="outline"
              className={cn(
                "h-7 w-12 justify-center text-sm font-bold shrink-0 border",
                getContributionBadgeClass(contributionPercent)
              )}
            >
              {contributionPercent}%
            </Badge>
          </MetricTooltip>

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

          {/* Metrics row */}
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
            {/* Commits */}
            <MetricTooltip
              content={`${formatNumber(project.commits)} of your commits`}
              underline={false}
            >
              <span className="flex items-center gap-0.5">
                <GitCommit className="h-3 w-3" aria-hidden="true" />
                {formatNumber(project.commits)}
              </span>
            </MetricTooltip>

            {/* Stars */}
            <MetricTooltip
              content={`${formatNumber(project.stars)} stars`}
              underline={false}
            >
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3" aria-hidden="true" />
                {formatNumber(project.stars)}
              </span>
            </MetricTooltip>

            {/* Activity Status */}
            <ActivityStatusDot
              lastActivityDate={project.lastActivityDate}
              size="sm"
            />
          </div>

          {/* Expand/collapse icon with rotation animation */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <ChevronDown
              className="h-4 w-4 flex-shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </motion.div>
        </div>

        {/* Combined language + activity bar */}
        {languagesForBar.length > 0 && (
          <div className="mt-2">
            <CombinedLanguageActivityBar
              commitCount={project.commits}
              maxCommits={maxCommits}
              languages={languagesForBar}
              isSelected={isExpanded}
              compact={isMobile}
            />
          </div>
        )}

        {/* Top languages inline */}
        {topLanguages.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            {topLanguages.map((lang, index) => (
              <span key={lang.name} className="flex items-center gap-1">
                {index > 0 && <span className="mx-0.5">&#8226;</span>}
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getLanguageColor(lang.name) }}
                  aria-hidden="true"
                />
                <span>
                  {lang.name} {lang.percent}%
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expandable content - inline analytics */}
      {isExpanded && (
        <motion.div
          id={`card-content-${project.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="border-t px-3 py-3 space-y-4"
        >
          {/* Description */}
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {project.description}
            </p>
          )}

          {/* Health Indicator + AI Button Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Health indicator */}
            {(project.isArchived !== undefined || project.pushedAt !== undefined) && (
              <HealthIndicator
                isArchived={project.isArchived ?? false}
                pushedAt={project.pushedAt ?? null}
              />
            )}

            {/* AI Analytics Button */}
            <AIAnalyticsButton projectUrl={project.url} />
          </div>

          {/* Your Contribution Section */}
          <ContributionSection
            commitsPercent={contributionPercent}
            userCommits={project.userCommits ?? project.commits}
            totalCommits={project.totalCommits}
            prsMerged={project.prsMerged}
            reviews={project.reviews}
            activePeriod={project.activePeriod}
            roleLabel={roleLabel}
            lastActivityDate={project.lastActivityDate}
          />

          {/* Project Impact Section */}
          <ImpactSection
            stars={project.stars}
            forks={project.forks}
            teamCount={project.teamCount}
          />

          {/* Tech Stack Section */}
          {project.languages && project.languages.length > 0 && (
            <TechStackSection languages={project.languages} />
          )}

          {/* Team + GitHub Link Section */}
          <TeamSection
            teamCount={project.teamCount}
            topContributors={project.topContributors}
            projectUrl={project.url}
            projectName={project.name}
          />
        </motion.div>
      )}
    </Card>
  );
}

/**
 * Your Contribution section
 */
interface ContributionSectionProps {
  commitsPercent: number;
  userCommits: number;
  totalCommits?: number;
  prsMerged?: number;
  reviews?: number;
  activePeriod?: string;
  roleLabel: string;
  lastActivityDate?: string;
}

function ContributionSection({
  commitsPercent,
  userCommits,
  totalCommits,
  prsMerged,
  reviews,
  activePeriod,
  roleLabel,
  lastActivityDate,
}: ContributionSectionProps) {
  return (
    <section aria-labelledby="contribution-heading" className="space-y-2">
      <div className="flex items-center justify-between">
        <h4
          id="contribution-heading"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Your Contribution
        </h4>
        <Badge variant="secondary" className="text-xs">
          {roleLabel}
        </Badge>
      </div>

      {/* Progress bar with commits */}
      <MetricTooltip
        content={`You contributed ${commitsPercent}% of ${formatNumber(totalCommits ?? userCommits)} total commits (${formatNumber(userCommits)} commits). ${commitsPercent > 25 ? "Significant contributor!" : "Meaningful contribution."}`}
      >
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Commits</span>
            <span className="font-medium">
              {formatNumber(userCommits)}
              {totalCommits && (
                <span className="text-muted-foreground">
                  {" "}of {formatNumber(totalCommits)} ({commitsPercent}%)
                </span>
              )}
            </span>
          </div>
          <Progress value={commitsPercent} className="h-2" />
        </div>
      </MetricTooltip>

      {/* Activity status and period */}
      <div className="flex items-center gap-3 text-sm">
        <ActivityStatusDot lastActivityDate={lastActivityDate} showLabel size="sm" />
        {activePeriod && (
          <span className="text-muted-foreground">Active: {activePeriod}</span>
        )}
      </div>

      {/* PRs and Reviews */}
      {(prsMerged !== undefined || reviews !== undefined) && (
        <div className="flex flex-wrap gap-3 text-sm">
          {prsMerged !== undefined && (
            <MetricTooltip content={`${prsMerged} pull requests merged`}>
              <span className="flex items-center gap-1">
                <GitPullRequest className="h-3.5 w-3.5 text-muted-foreground" />
                {prsMerged} PRs
              </span>
            </MetricTooltip>
          )}
          {reviews !== undefined && (
            <MetricTooltip content={`${reviews} code reviews`}>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                {reviews} reviews
              </span>
            </MetricTooltip>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * Project Impact section
 */
interface ImpactSectionProps {
  stars: number;
  forks?: number;
  teamCount?: number;
}

function ImpactSection({ stars, forks, teamCount }: ImpactSectionProps) {
  return (
    <section aria-labelledby="impact-heading">
      <h4
        id="impact-heading"
        className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Project Impact
      </h4>
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <MetricTooltip content={`${formatNumber(stars)} stars`}>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {formatNumber(stars)} stars
          </span>
        </MetricTooltip>
        {forks !== undefined && (
          <MetricTooltip content={`${formatNumber(forks)} forks`}>
            <span className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              {formatNumber(forks)} forks
            </span>
          </MetricTooltip>
        )}
        {teamCount !== undefined && (
          <MetricTooltip content={`${teamCount} total contributors`}>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {teamCount} contributors
            </span>
          </MetricTooltip>
        )}
      </div>
    </section>
  );
}

/**
 * Tech Stack section
 */
interface TechStackSectionProps {
  languages: LanguageInfo[];
}

function TechStackSection({ languages }: TechStackSectionProps) {
  const displayLanguages = languages.slice(0, 5);
  const hasMore = languages.length > 5;

  return (
    <section aria-labelledby="tech-heading">
      <h4
        id="tech-heading"
        className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Tech Stack
      </h4>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {displayLanguages.map((lang) => (
          <MetricTooltip
            key={lang.name}
            content={`${lang.name}: ${lang.percent}%${lang.size ? ` (${formatNumber(lang.size)} bytes)` : ""}`}
          >
            <span className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: getLanguageColor(lang.name) }}
                aria-hidden="true"
              />
              {lang.name} {lang.percent}%
            </span>
          </MetricTooltip>
        ))}
        {hasMore && (
          <span className="text-muted-foreground">
            +{languages.length - 5} more
          </span>
        )}
      </div>
    </section>
  );
}

/**
 * Team section with avatars and GitHub link
 */
interface TeamSectionProps {
  teamCount?: number;
  topContributors?: TeamMember[];
  projectUrl: string;
  projectName: string;
}

function TeamSection({
  teamCount,
  topContributors,
  projectUrl,
  projectName,
}: TeamSectionProps) {
  const hasTeam = teamCount !== undefined || (topContributors && topContributors.length > 0);

  return (
    <section aria-labelledby="team-heading" className="flex items-center justify-between">
      {hasTeam && (
        <div className="flex items-center gap-3">
          <h4
            id="team-heading"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Team
          </h4>
          {topContributors && topContributors.length > 0 && (
            <div className="flex -space-x-2">
              {topContributors.slice(0, 5).map((member) => (
                <MetricTooltip
                  key={member.login || member.name}
                  content={`${member.name}${member.login ? ` (${member.login})` : ""}${member.commits ? ` - ${member.commits} commits` : ""}${member.prs ? `, ${member.prs} PRs` : ""}`}
                  underline={false}
                >
                  <Avatar className="h-7 w-7 border-2 border-background hover:z-10 hover:scale-110 transition-transform">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </MetricTooltip>
              ))}
              {teamCount !== undefined && teamCount > 5 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                  +{teamCount - 5}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* GitHub link */}
      <MetricTooltip content={`View ${projectName} on GitHub`} underline={false}>
        <a
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`View ${projectName} on GitHub`}
          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </MetricTooltip>
    </section>
  );
}

/**
 * Health indicator component
 */
interface HealthIndicatorProps {
  isArchived: boolean;
  pushedAt: string | null;
}

function HealthIndicator({ isArchived, pushedAt }: HealthIndicatorProps) {
  const health = analyzeProjectHealth({ isArchived, pushedAt });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5">
          <span
            className={cn("h-2 w-2 rounded-full", {
              "bg-success": health.status === "healthy",
              "bg-warning": health.status === "maintenance",
              "bg-muted-foreground": health.status === "stale" || health.status === "archived",
            })}
            aria-hidden="true"
          />
          <span className={cn("text-xs font-medium", health.color)}>
            {health.labelRu}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">{health.reason}</p>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * AI Analytics button (placeholder for future feature)
 */
interface AIAnalyticsButtonProps {
  projectUrl: string;
}

function AIAnalyticsButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  projectUrl,
}: AIAnalyticsButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Open AI Analytics Modal
    // Future implementation: Open AI analytics modal for projectUrl
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleClick}
          disabled
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Аналитика</span>
          <Badge variant="secondary" className="text-[10px] px-1.5">
            Soon
          </Badge>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">AI-анализ архитектуры проекта (скоро)</p>
      </TooltipContent>
    </Tooltip>
  );
}
