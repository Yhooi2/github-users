/**
 * AIInsightCard - Wrapper for InsightCardGlass
 *
 * Maps AIInsight type to InsightCardGlass component from shadcn-glass-ui.
 * Stage 7: AI Integration
 */

import { AI_INSIGHT_CATEGORIES } from "@/lib/ai-analytics-constants";
import type { AIInsight, AIInsightCategory } from "@/types/ai-analytics";
import { InsightCardGlass } from "shadcn-glass-ui";

/**
 * Maps AIInsightCategory to InsightCardGlass variant
 *
 * InsightCardGlass variants: default, tip, highlight, warning, stat, growth, decline
 */
const categoryToVariant: Record<
  AIInsightCategory,
  "default" | "tip" | "highlight" | "warning" | "stat" | "growth" | "decline"
> = {
  strength: "highlight",
  weakness: "warning",
  opportunity: "tip",
  trend: "growth",
  recommendation: "default",
};

export type AIInsightCardProps = {
  /** AI insight data */
  insight: AIInsight;
  /** Click handler */
  onClick?: () => void;
  /** Show arrow indicator */
  showArrow?: boolean;
  /** Animate on mount */
  animated?: boolean;
  /** Inline display mode */
  inline?: boolean;
};

/**
 * AIInsightCard - Displays a single AI insight
 *
 * @example
 * ```tsx
 * <AIInsightCard
 *   insight={{
 *     id: "1",
 *     category: "strength",
 *     priority: "high",
 *     title: "Strong TypeScript skills",
 *     description: "Consistent use of TypeScript across projects"
 *   }}
 *   onClick={() => console.log("clicked")}
 *   animated
 * />
 * ```
 */
export function AIInsightCard({
  insight,
  onClick,
  showArrow = false,
  animated = false,
  inline = false,
}: AIInsightCardProps) {
  const categoryMeta = AI_INSIGHT_CATEGORIES[insight.category];
  const variant = categoryToVariant[insight.category];

  return (
    <InsightCardGlass
      emoji={categoryMeta.icon}
      text={insight.title}
      detail={insight.description}
      variant={variant}
      onClick={onClick}
      showArrow={showArrow}
      animated={animated}
      inline={inline}
    />
  );
}
