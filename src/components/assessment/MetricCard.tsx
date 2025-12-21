import { Card, CardContent } from "@/components/ui/card";
import { getScoreColor } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import {
  Activity,
  Calendar,
  Shield,
  Sparkles,
  Target,
  Users,
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
    | "Weak";
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
    case "consistency":
      return Calendar;
    case "collaboration":
      return Users;
    case "authenticity":
      return Shield;
    default:
      return Activity;
  }
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
  const scoreColor = getScoreColor(score);

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
        "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg",
        "active:scale-[0.98]",
        onExplainClick && "group",
      )}
      onClick={onExplainClick}
      role={onExplainClick ? "button" : undefined}
      tabIndex={onExplainClick ? 0 : undefined}
      onKeyDown={
        onExplainClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onExplainClick();
              }
            }
          : undefined
      }
      aria-label={
        onExplainClick
          ? `View ${title} details: ${score}% - ${level}`
          : undefined
      }
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              "bg-primary/10 text-primary",
              "transition-colors group-hover:bg-primary/20",
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>

          {/* Title and Score */}
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {title}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-2xl font-bold", scoreColor)}>
                {score}
              </span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        {/* Level indicator - subtle */}
        <div className="mt-2 text-[10px] tracking-wider text-muted-foreground/70 uppercase">
          {level}
        </div>
      </CardContent>
    </Card>
  );
}
