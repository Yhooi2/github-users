import { useState, useCallback } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CATEGORY_ORDER,
  getCategoryScores,
  type AllMetricsData,
  type MetricCategory,
  type MetricKey,
} from "@/lib/metrics/categories";
import { MetricCategoryCard } from "./MetricCategoryCard";
import { MetricTooltipContent } from "./MetricTooltipContent";
import { CategoryTooltipContent } from "./CategoryTooltipContent";

export interface MetricAssessmentGridProps {
  /** All metrics data */
  metrics: AllMetricsData;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MetricAssessmentGrid - Main container for metrics dashboard
 *
 * Displays MetricCategoryCards in a responsive grid.
 *
 * Responsive behavior:
 * - Desktop (>=768px): 3-column grid, all cards expanded, hover tooltips
 * - Mobile (<768px): Vertical stack, accordion, tap for Sheet
 */
export function MetricAssessmentGrid({
  metrics,
  loading = false,
  className,
}: MetricAssessmentGridProps) {
  const { isMobile } = useResponsive();

  // Mobile accordion state - null means all collapsed
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Mobile Sheet state for metric details
  const [metricSheetState, setMetricSheetState] = useState<{
    isOpen: boolean;
    metric: MetricKey | null;
  }>({
    isOpen: false,
    metric: null,
  });

  // Mobile Sheet state for category details
  const [categorySheetState, setCategorySheetState] = useState<{
    isOpen: boolean;
    category: MetricCategory | null;
  }>({
    isOpen: false,
    category: null,
  });

  // Calculate category scores
  const categoryScores = getCategoryScores(metrics);

  // Handle accordion toggle (mobile only)
  const handleToggle = useCallback((category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  }, []);

  // Handle metric click (mobile only - opens Sheet)
  const handleMetricClick = useCallback((metricKey: MetricKey) => {
    setMetricSheetState({
      isOpen: true,
      metric: metricKey,
    });
  }, []);

  // Handle category click (mobile only - opens Sheet)
  const handleCategoryClick = useCallback((category: MetricCategory) => {
    setCategorySheetState({
      isOpen: true,
      category,
    });
  }, []);

  // Close metric Sheet
  const handleCloseMetricSheet = useCallback(() => {
    setMetricSheetState({
      isOpen: false,
      metric: null,
    });
  }, []);

  // Close category Sheet
  const handleCloseCategorySheet = useCallback(() => {
    setCategorySheetState({
      isOpen: false,
      category: null,
    });
  }, []);

  // Get data for current metric in Sheet
  const currentMetricData = metricSheetState.metric
    ? metrics[metricSheetState.metric]
    : null;

  // Get score for current category in Sheet
  const currentCategoryScore = categorySheetState.category
    ? categoryScores.find((c) => c.category === categorySheetState.category)?.score ?? 0
    : 0;

  return (
    <div className={className}>
      {/* Category Cards Grid */}
      <div
        className={
          isMobile ? "flex flex-col gap-3" : "grid grid-cols-3 gap-4"
        }
      >
        {CATEGORY_ORDER.map((categoryName) => {
          const categoryScore = categoryScores.find(
            (c) => c.category === categoryName
          );

          if (!categoryScore) return null;

          return (
            <MetricCategoryCard
              key={categoryName}
              category={categoryName}
              categoryScore={categoryScore.score}
              metrics={categoryScore.metrics}
              loading={loading}
              onMetricClick={isMobile ? handleMetricClick : undefined}
              onCategoryClick={isMobile ? handleCategoryClick : undefined}
              // Mobile-specific props
              isExpanded={expandedCategory === categoryName}
              onToggle={() => handleToggle(categoryName)}
            />
          );
        })}
      </div>

      {/* Mobile Sheet for metric details */}
      {isMobile && metricSheetState.metric && currentMetricData && (
        <Sheet open={metricSheetState.isOpen} onOpenChange={handleCloseMetricSheet}>
          <SheetContent side="bottom" className="rounded-t-xl">
            <SheetHeader className="pb-2">
              <SheetTitle className="sr-only">Metric Details</SheetTitle>
            </SheetHeader>
            <MetricTooltipContent
              metricKey={metricSheetState.metric}
              score={currentMetricData.score}
              breakdown={currentMetricData.breakdown}
              className="pb-4"
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Sheet for category details */}
      {isMobile && categorySheetState.category && (
        <Sheet open={categorySheetState.isOpen} onOpenChange={handleCloseCategorySheet}>
          <SheetContent side="bottom" className="rounded-t-xl">
            <SheetHeader className="pb-2">
              <SheetTitle className="sr-only">Category Details</SheetTitle>
            </SheetHeader>
            <CategoryTooltipContent
              category={categorySheetState.category}
              score={currentCategoryScore}
              className="pb-4"
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
