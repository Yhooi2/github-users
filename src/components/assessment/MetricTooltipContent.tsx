import { cn } from "@/lib/utils";
import { type MetricKey } from "@/lib/metrics/categories";

export interface MetricTooltipContentProps {
  /** Metric key for lookup */
  metricKey: MetricKey;
  /** Current score */
  score: number;
  /** Score breakdown by component */
  breakdown?: Record<string, number>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Metric explanation config with component descriptions
 */
const METRIC_EXPLANATIONS: Record<
  MetricKey,
  {
    title: string;
    description: string;
    components: Record<string, string>;
  }
> = {
  activity: {
    title: "Activity",
    description: "Recent coding activity, consistency, and project diversity",
    components: {
      recentCommits: "Commits in last 3 months",
      consistency: "Active months in last year",
      diversity: "Unique repositories",
    },
  },
  impact: {
    title: "Impact",
    description: "Community reach and engagement",
    components: {
      stars: "Total stars",
      forks: "Total forks",
      contributors: "Contributors attracted",
      reach: "Watchers + dependents",
      engagement: "Issue/PR activity",
    },
  },
  quality: {
    title: "Quality",
    description: "Code quality, documentation, and maturity",
    components: {
      originality: "Original work",
      documentation: "README quality",
      ownership: "Code ownership",
      maturity: "Project stability",
      stack: "Tech diversity",
    },
  },
  consistency: {
    title: "Consistency",
    description: "Regularity and stability of coding activity",
    components: {
      regularity: "Commit distribution",
      streak: "Active years streak",
      recency: "Recent activity",
    },
  },
  authenticity: {
    title: "Authenticity",
    description: "Repository originality and activity patterns",
    components: {
      originalityScore: "Original work",
      activityScore: "Activity patterns",
      engagementScore: "Community engagement",
      codeOwnershipScore: "Code ownership",
    },
  },
  collaboration: {
    title: "Collaboration",
    description: "Contributions to other developers' projects",
    components: {
      contributionRatio: "External contributions",
      diversity: "External projects",
      engagement: "Contribution quality",
    },
  },
};

/**
 * MetricTooltipContent - Content for metric tooltips and sheets
 *
 * Displays metric description and score breakdown.
 * Used in both Tooltip (desktop hover) and Sheet (mobile tap).
 *
 * @example
 * ```tsx
 * <MetricTooltipContent
 *   metricKey="activity"
 *   score={85}
 *   breakdown={{ recentCommits: 35, consistency: 25, diversity: 25 }}
 * />
 * ```
 */
export function MetricTooltipContent({
  metricKey,
  score,
  breakdown,
  className,
}: MetricTooltipContentProps) {
  const explanation = METRIC_EXPLANATIONS[metricKey];

  if (!explanation) {
    return null;
  }

  const hasBreakdown = breakdown && Object.keys(breakdown).length > 0;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header with score */}
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-foreground">{explanation.title}</span>
        <span className="text-sm font-bold tabular-nums text-foreground">
          {score}%
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground">{explanation.description}</p>

      {/* Breakdown */}
      {hasBreakdown && (
        <div className="space-y-1 border-t border-border/50 pt-2">
          {Object.entries(breakdown).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground">
                {explanation.components[key] || key}
              </span>
              <span className="font-medium tabular-nums text-foreground">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
