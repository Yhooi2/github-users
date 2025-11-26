import { Check, Clock, Sparkles, Zap } from "lucide-react";
import { useThemeStyles } from "../context/ThemeContext";
import type { AIInsightsCardProps } from "../types";

/**
 * AIInsightsCard Component
 *
 * A glassmorphism-styled card for AI summary CTA.
 * Shows AI features and generate report button.
 *
 * @example
 * ```tsx
 * <AIInsightsCard onGenerateReport={() => generateReport()} />
 * ```
 */

export const AIInsightsCard = ({
  onGenerateReport,
  className = "",
}: AIInsightsCardProps) => {
  const t = useThemeStyles();

  return (
    <div
      className={`w-64 rounded-xl p-4 transition-all duration-300 ${className}`}
      style={{
        background: t.aiCardBg,
        border: `1px solid ${t.aiCardBorder}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="mb-2 flex items-center gap-2 text-sm font-semibold"
        style={{ color: t.textAccent }}
      >
        <Sparkles className="h-4 w-4" /> AI Summary
      </div>
      <p className="mb-2 text-xs" style={{ color: t.textSecondary }}>
        Get comprehensive analysis:
      </p>
      <ul className="mb-3 space-y-0.5 text-xs" style={{ color: t.textMuted }}>
        <li className="flex items-center gap-1">
          <Check className="h-3 w-3" style={{ color: t.statusGreen }} /> Code
          quality assessment
        </li>
        <li className="flex items-center gap-1">
          <Check className="h-3 w-3" style={{ color: t.statusGreen }} />{" "}
          Architecture patterns
        </li>
        <li className="flex items-center gap-1">
          <Check className="h-3 w-3" style={{ color: t.statusGreen }} /> Best
          practices
        </li>
      </ul>
      <button
        type="button"
        onClick={onGenerateReport}
        className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: t.btnPrimaryBg,
          color: t.btnPrimaryText,
          boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
        }}
      >
        <Zap className="h-4 w-4" /> Generate Report
      </button>
      <p
        className="mt-2 flex items-center justify-center gap-1 text-center text-xs"
        style={{ color: t.textMuted }}
      >
        <Clock className="h-3 w-3" /> ~30 seconds
      </p>
    </div>
  );
};

export default AIInsightsCard;
