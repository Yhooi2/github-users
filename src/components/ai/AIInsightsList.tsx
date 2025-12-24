/**
 * AIInsightsList - List of AI insights with layout
 *
 * Displays multiple AIInsightCard components in a responsive grid.
 * Stage 7: AI Integration
 */

import type { AIInsight } from "@/types/ai-analytics";
import { AIInsightCard } from "./AIInsightCard";

export type AIInsightsListProps = {
  /** Array of AI insights */
  insights: AIInsight[];
  /** Click handler for individual insights */
  onInsightClick?: (insight: AIInsight) => void;
  /** Show arrows on clickable insights */
  showArrows?: boolean;
  /** Animate insights on mount */
  animated?: boolean;
  /** Maximum insights to display */
  maxItems?: number;
};

/**
 * AIInsightsList - Displays a list of AI insights
 *
 * @example
 * ```tsx
 * <AIInsightsList
 *   insights={[
 *     { id: "1", category: "strength", title: "..." },
 *     { id: "2", category: "opportunity", title: "..." }
 *   ]}
 *   onInsightClick={(insight) => console.log(insight)}
 *   animated
 * />
 * ```
 */
export function AIInsightsList({
  insights,
  onInsightClick,
  showArrows = false,
  animated = false,
  maxItems,
}: AIInsightsListProps) {
  const displayedInsights = maxItems ? insights.slice(0, maxItems) : insights;

  if (displayedInsights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {displayedInsights.map((insight, index) => (
        <AIInsightCard
          key={insight.id}
          insight={insight}
          onClick={onInsightClick ? () => onInsightClick(insight) : undefined}
          showArrow={showArrows && !!onInsightClick}
          animated={animated}
          // Stagger animation delay via CSS custom property
          {...(animated && {
            style: { animationDelay: `${index * 100}ms` },
          })}
        />
      ))}
    </div>
  );
}
