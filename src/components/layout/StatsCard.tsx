import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";

type StatsCardProps = {
  /**
   * Card title
   */
  title: string;
  /**
   * Primary value to display
   */
  value: string | number;
  /**
   * Optional icon component
   */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /**
   * Optional description/label
   */
  description?: string;
  /**
   * Optional trend indicator
   * - 'up': Trending up (green)
   * - 'down': Trending down (red)
   * - 'neutral': No change (gray)
   */
  trend?: "up" | "down" | "neutral";
  /**
   * Trend value (e.g., "+12%", "-5%", "0%")
   */
  trendValue?: string;
  /**
   * Optional badge to display
   */
  badge?: ReactNode;
  /**
   * Optional additional content
   */
  footer?: ReactNode;
};

/**
 * StatsCard displays a statistic with optional icon, trend, and badge
 *
 * @example
 * ```tsx
 * <StatsCard
 *   title="Total Repositories"
 *   value={42}
 *   icon={FolderGit2}
 *   trend="up"
 *   trendValue="+5.2%"
 *   description="Public repositories"
 * />
 * ```
 */
export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  badge,
  footer,
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingDown;
      case "neutral":
        return Minus;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600 dark:text-green-400";
      case "down":
        return "text-red-600 dark:text-red-400";
      case "neutral":
        return "text-muted-foreground";
      default:
        return "";
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          {badge && <div>{badge}</div>}
        </div>

        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2">
            {trend && TrendIcon && (
              <div
                className={`flex items-center gap-1 text-xs ${getTrendColor()}`}
              >
                <TrendIcon className="h-3 w-3" aria-hidden="true" />
                {trendValue && <span>{trendValue}</span>}
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {footer && <div className="mt-3">{footer}</div>}
      </CardContent>
    </Card>
  );
}
