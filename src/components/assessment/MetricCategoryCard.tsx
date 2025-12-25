import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useResponsive } from "@/hooks/useResponsive";
import { getScoreColor } from "@/lib/design-tokens";
import {
  CATEGORY_CONFIGS,
  type MetricCategory,
  type MetricData,
  type MetricKey,
} from "@/lib/metrics/categories";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { CategoryTooltipContent } from "./CategoryTooltipContent";
import { MetricRowCompact } from "./MetricRowCompact";

export interface MetricCategoryCardProps {
  /** Category identifier */
  category: MetricCategory;
  /** Average score of the category's metrics */
  categoryScore: number;
  /** Metrics data for this category */
  metrics: {
    first: MetricData & { key: MetricKey };
    second: MetricData & { key: MetricKey };
  };
  /** Loading state */
  loading?: boolean;
  /** Callback when metric is clicked (mobile only, for Sheet) */
  onMetricClick?: (metricKey: MetricKey) => void;
  /** Callback when category header is clicked (mobile only, for Sheet) */
  onCategoryClick?: (category: MetricCategory) => void;
  /** Controlled expanded state (for mobile accordion) */
  isExpanded?: boolean;
  /** Callback when accordion is toggled (mobile only) */
  onToggle?: () => void;
}

/**
 * MetricCategoryCard - Category card for metrics dashboard
 *
 * Displays a category (OUTPUT, QUALITY, TRUST) with its two metrics.
 *
 * Responsive behavior:
 * - Desktop (>=768px): Always expanded, hover tooltips on header and metrics
 * - Mobile (<768px): Collapsible accordion, tap header/metrics for Sheet
 */
export function MetricCategoryCard({
  category,
  categoryScore,
  metrics,
  loading = false,
  onMetricClick,
  onCategoryClick,
  isExpanded,
  onToggle,
}: MetricCategoryCardProps) {
  const { isMobile } = useResponsive();
  const config = CATEGORY_CONFIGS[category];
  const Icon = config.icon;
  const scoreColor = getScoreColor(categoryScore);

  // Get metric configs for display
  const [firstMetricConfig, secondMetricConfig] = config.metrics;

  if (loading) {
    return (
      <Card className="h-[220px] animate-pulse">
        <CardContent className="flex h-full flex-col gap-4 p-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
              </div>
            </div>
            <div className="h-8 w-12 rounded bg-muted" />
          </div>
          {/* Metrics skeleton */}
          <div className="flex-1 space-y-4 pt-2">
            <div className="h-8 w-full rounded bg-muted" />
            <div className="h-8 w-full rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Card content (shared between desktop and mobile)
  const cardContent = (
    <div className="space-y-4">
      <MetricRowCompact
        metricKey={metrics.first.key}
        title={firstMetricConfig.title}
        score={metrics.first.score}
        level={metrics.first.level}
        icon={firstMetricConfig.icon}
        breakdown={metrics.first.breakdown}
        onMetricClick={
          onMetricClick ? () => onMetricClick(metrics.first.key) : undefined
        }
      />
      <MetricRowCompact
        metricKey={metrics.second.key}
        title={secondMetricConfig.title}
        score={metrics.second.score}
        level={metrics.second.level}
        icon={secondMetricConfig.icon}
        breakdown={metrics.second.breakdown}
        onMetricClick={
          onMetricClick ? () => onMetricClick(metrics.second.key) : undefined
        }
      />
    </div>
  );

  // Mobile: Collapsible accordion
  if (isMobile) {
    return (
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <Card className="overflow-hidden">
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center justify-between p-4",
                "text-left transition-colors",
                "hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              )}
              aria-expanded={isExpanded}
            >
              {/* Left: Icon + Title - tappable for info */}
              <div
                className={cn(
                  "-m-1 flex items-center gap-3 rounded-lg p-1",
                  onCategoryClick && "active:bg-muted/50",
                )}
                onClick={
                  onCategoryClick
                    ? (e) => {
                        e.stopPropagation();
                        onCategoryClick(category);
                      }
                    : undefined
                }
                role={onCategoryClick ? "button" : undefined}
                tabIndex={onCategoryClick ? 0 : undefined}
                aria-label={
                  onCategoryClick
                    ? `${config.title}: ${categoryScore}%. Tap for details.`
                    : undefined
                }
                onKeyDown={
                  onCategoryClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          e.preventDefault();
                          onCategoryClick(category);
                        }
                      }
                    : undefined
                }
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-wide text-foreground uppercase">
                    {config.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>
              </div>

              {/* Right: Score + Chevron */}
              <div className="flex items-center gap-2">
                <span
                  className={cn("text-xl font-bold tabular-nums", scoreColor)}
                >
                  {categoryScore}%
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="border-t px-4 pt-4 pb-4">
              {cardContent}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  // Desktop: Always expanded, fixed height with tooltip on header
  return (
    <Card className="h-[220px] overflow-hidden">
      <CardContent className="flex h-full flex-col gap-3 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Left: Icon + Title with Tooltip */}
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-3 rounded-md transition-colors hover:bg-muted/30">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-wide text-foreground uppercase">
                    {config.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" className="w-72">
              <CategoryTooltipContent
                category={category}
                score={categoryScore}
              />
            </TooltipContent>
          </Tooltip>

          {/* Right: Score */}
          <span
            className={cn("text-2xl font-bold tabular-nums", scoreColor)}
            aria-label={`${config.title} category score: ${categoryScore}%`}
          >
            {categoryScore}%
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Metrics */}
        <div className="flex flex-1 flex-col justify-center py-2">
          {cardContent}
        </div>
      </CardContent>
    </Card>
  );
}
