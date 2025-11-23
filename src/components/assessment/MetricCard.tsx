import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  Shield,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export interface MetricCardProps {
  title: string;
  score: number;
  level:
    | "Low"
    | "Moderate"
    | "High"
    | "Medium"
    | "Suspicious"
    | "Strong"
    | "Excellent"
    | "Exceptional"
    | "Minimal"
    | "Good"
    | "Fair"
    | "Weak"
    | "Rapid Growth"
    | "Growing"
    | "Stable"
    | "Declining"
    | "Rapid Decline";
  breakdown?: Array<{
    label: string;
    value: number;
    max: number;
  }>;
  loading?: boolean;
  onExplainClick?: () => void;
}

/**
 * Get metric icon based on title
 */
function getMetricIcon(title: string) {
  switch (title.toLowerCase()) {
    case "activity":
      return Activity;
    case "impact":
      return Target;
    case "quality":
      return Sparkles;
    case "growth":
      return TrendingUp;
    case "authenticity":
      return Shield;
    default:
      return Activity;
  }
}

/**
 * Get score color based on value and metric type
 */
function getScoreColor(score: number, title: string): string {
  // Growth can be negative
  if (title.toLowerCase() === "growth") {
    if (score >= 20) return "text-green-600 dark:text-green-400";
    if (score >= 0) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  }

  // Standard metrics (0-100)
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 40) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

/**
 * MetricCard - Compact metric display per design plan
 *
 * Shows: Icon + Title + Score in a compact clickable card.
 * Per plan: "Only icon + name + number, click for details"
 */
export function MetricCard({
  title,
  score,
  level,
  loading = false,
  onExplainClick,
}: MetricCardProps) {
  const Icon = getMetricIcon(title);
  const scoreColor = getScoreColor(score, title);
  const isGrowth = title.toLowerCase() === "growth";

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="flex-1">
              <div className="mb-1 h-4 w-16 rounded bg-muted" />
              <div className="h-6 w-12 rounded bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/50",
        "active:scale-[0.98]",
        onExplainClick && "group"
      )}
      onClick={onExplainClick}
      role={onExplainClick ? "button" : undefined}
      tabIndex={onExplainClick ? 0 : undefined}
      onKeyDown={onExplainClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onExplainClick();
        }
      } : undefined}
      aria-label={onExplainClick ? `View ${title} details: ${score}${isGrowth ? "" : "%"} - ${level}` : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            "bg-primary/10 text-primary",
            "group-hover:bg-primary/20 transition-colors"
          )}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>

          {/* Title and Score */}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-2xl font-bold", scoreColor)}>
                {isGrowth && score > 0 && "+"}
                {score}
              </span>
              {!isGrowth && (
                <span className="text-sm text-muted-foreground">%</span>
              )}
            </div>
          </div>
        </div>

        {/* Level indicator - subtle */}
        <div className="mt-2 text-[10px] text-muted-foreground/70 uppercase tracking-wider">
          {level}
        </div>
      </CardContent>
    </Card>
  );
}
