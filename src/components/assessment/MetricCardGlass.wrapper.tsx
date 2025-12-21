/**
 * MetricCardGlass Wrapper - Adapts shadcn-glass-ui MetricCardGlass to our props
 *
 * Maps our MetricCardProps interface to MetricCardGlass API while preserving
 * existing functionality (icon selection, score colors, click handling).
 */

import {
  Activity,
  Calendar,
  Shield,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { MetricCardGlass } from "shadcn-glass-ui";

export interface MetricCardWrapperProps {
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
      return <Activity className="h-5 w-5" />;
    case "impact":
      return <Target className="h-5 w-5" />;
    case "quality":
      return <Sparkles className="h-5 w-5" />;
    case "consistency":
      return <Calendar className="h-5 w-5" />;
    case "collaboration":
      return <Users className="h-5 w-5" />;
    case "authenticity":
      return <Shield className="h-5 w-5" />;
    default:
      return <Activity className="h-5 w-5" />;
  }
}

/**
 * Map score to MetricCardGlass variant
 * Using variant instead of deprecated color prop
 * Available variants: default, secondary, success, warning, destructive
 */
function getMetricVariant(
  score: number,
): "success" | "warning" | "destructive" | "default" {
  if (score >= 80) return "success";
  if (score >= 60) return "default";
  if (score >= 40) return "warning";
  return "destructive";
}

/**
 * MetricCardWrapper - Maps our props to MetricCardGlass
 *
 * Preserves existing API while leveraging Glass UI styling.
 */
export function MetricCardWrapper({
  title,
  score,
  level,
  loading = false,
  onExplainClick,
}: MetricCardWrapperProps) {
  // MetricCardGlass loading is handled via skeleton, but we'll pass it
  if (loading) {
    return (
      <MetricCardGlass
        title={title}
        value={0}
        icon={getMetricIcon(title)}
        description="Loading..."
        showSparkline={false}
        showProgress={false}
        className="animate-pulse"
      />
    );
  }

  return (
    <MetricCardGlass
      title={title}
      value={score}
      icon={getMetricIcon(title)}
      description={level}
      variant={getMetricVariant(score)}
      showExplain={!!onExplainClick}
      onExplain={onExplainClick}
      showSparkline={false}
      showProgress={true}
      progress={score}
    />
  );
}
