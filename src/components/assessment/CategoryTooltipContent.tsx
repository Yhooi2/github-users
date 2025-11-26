import { cn } from "@/lib/utils";
import { type MetricCategory } from "@/lib/metrics/categories";

export interface CategoryTooltipContentProps {
  /** Category key for lookup */
  category: MetricCategory;
  /** Current category score */
  score: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Category explanation config with calculation details
 */
const CATEGORY_EXPLANATIONS: Record<
  MetricCategory,
  {
    title: string;
    description: string;
    calculation: string;
    metrics: [string, string];
  }
> = {
  OUTPUT: {
    title: "Output",
    description:
      "Measures overall productivity combining coding activity frequency with project community reach and influence.",
    calculation: "Average of Activity and Impact scores",
    metrics: ["Activity", "Impact"],
  },
  QUALITY: {
    title: "Quality",
    description:
      "Evaluates code standards, documentation quality, and consistency of contribution patterns over time.",
    calculation: "Average of Quality and Consistency scores",
    metrics: ["Quality", "Consistency"],
  },
  TRUST: {
    title: "Trust",
    description:
      "Assesses profile authenticity and collaborative nature. Detects genuine developers vs automated or fake accounts.",
    calculation: "Average of Authenticity and Collaboration scores",
    metrics: ["Authenticity", "Collaboration"],
  },
};

/**
 * CategoryTooltipContent - Content for category tooltips and sheets
 *
 * Displays category description and calculation method.
 * Used in both Tooltip (desktop hover) and Sheet (mobile tap).
 *
 * @example
 * ```tsx
 * <CategoryTooltipContent
 *   category="OUTPUT"
 *   score={75}
 * />
 * ```
 */
export function CategoryTooltipContent({
  category,
  score,
  className,
}: CategoryTooltipContentProps) {
  const explanation = CATEGORY_EXPLANATIONS[category];

  if (!explanation) {
    return null;
  }

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

      {/* Calculation method */}
      <div className="space-y-1 border-t border-border/50 pt-2">
        <div className="text-xs font-medium text-foreground">How it's calculated:</div>
        <div className="text-xs text-muted-foreground">{explanation.calculation}</div>
        <div className="flex gap-2 pt-1">
          {explanation.metrics.map((metric) => (
            <span
              key={metric}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {metric}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
