import React from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Github,
  Sparkles,
  Star,
} from "lucide-react";
import { useThemeStyles } from "../context/ThemeContext";
import { StatusIndicator } from "./StatusIndicator";
import { getStatusType } from "./helpers";
import type { RepoCardProps } from "../types";

/**
 * RepoCard Component
 *
 * A glassmorphism-styled card for displaying repository information.
 * Supports expanded state with detailed stats and actions.
 *
 * @example
 * ```tsx
 * <RepoCard
 *   repo={repoData}
 *   expanded={isExpanded}
 *   onClick={() => toggleExpanded()}
 *   onGitHubClick={() => openGitHub()}
 *   onAnalysisClick={() => runAnalysis()}
 * />
 * ```
 */
export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  expanded = false,
  showFlaggedOnly = false,
  onClick,
  onGitHubClick,
  onAnalysisClick,
  className = "",
}) => {
  const t = useThemeStyles();

  return (
    <div
      className={`cursor-pointer rounded-xl border p-3 transition-all duration-300 ${className}`}
      style={{
        background: expanded ? t.cardHoverBg : t.cardBg,
        borderColor: t.cardBorder,
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium" style={{ color: t.textPrimary }}>
            {repo.name}
          </span>
          <StatusIndicator type={getStatusType(repo.status)} size="large" />
          {repo.stars > 0 && (
            <span
              className="flex items-center gap-0.5 text-xs"
              style={{ color: t.textMuted }}
            >
              <Star className="h-3 w-3 fill-current" />
              {repo.stars}
            </span>
          )}
        </div>
        <span
          className="flex items-center gap-1 text-sm"
          style={{ color: t.textSecondary }}
        >
          {repo.commits} commits
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </div>

      {/* Languages */}
      <div
        className="mt-1.5 flex items-center gap-2 text-xs"
        style={{ color: t.textSecondary }}
      >
        {repo.langs.map((l) => (
          <span key={l.name} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${l.color}`} />
            {l.name} {l.percent}%
          </span>
        ))}
        <span>·</span>
        <span>{repo.contribution}% contribution</span>
      </div>

      {/* Flagged Only Mode - Issues */}
      {showFlaggedOnly && repo.issues !== undefined && (
        <div
          className="mt-2 pt-2"
          style={{ borderTop: `1px solid ${t.cardBorder}` }}
        >
          <p className="mb-1 text-xs" style={{ color: t.textMuted }}>
            Issues:
          </p>
          {repo.issues.map((issue) => (
            <p key={issue} className="text-xs" style={{ color: t.alertDangerText }}>
              • {issue}
            </p>
          ))}
        </div>
      )}

      {/* Expanded Content */}
      {expanded && (
        <div
          className="mt-3 space-y-3 pt-3"
          style={{ borderTop: `1px solid ${t.cardBorder}` }}
        >
          {/* Issues Alert */}
          {repo.issues !== undefined && (
            <div
              className="rounded-lg border p-2"
              style={{
                background: t.alertDangerBg,
                borderColor: t.alertDangerBorder,
              }}
            >
              <p
                className="mb-1 flex items-center gap-1 text-xs font-medium"
                style={{ color: t.alertDangerText }}
              >
                <AlertTriangle className="h-3 w-3" /> Issues detected
              </p>
              {repo.issues.map((issue) => (
                <p
                  key={issue}
                  className="text-xs"
                  style={{ color: `${t.alertDangerText}cc` }}
                >
                  • {issue}
                </p>
              ))}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div
              className="rounded-lg border p-2"
              style={{
                background: t.expandedBg,
                borderColor: t.cardBorder,
              }}
            >
              <p className="text-xs" style={{ color: t.textMuted }}>
                Your Contribution
              </p>
              <p className="font-medium" style={{ color: t.textPrimary }}>
                {repo.commits} commits
              </p>
              <p className="text-xs" style={{ color: t.textSecondary }}>
                {repo.contribution}% of project
              </p>
            </div>
            <div
              className="rounded-lg border p-2"
              style={{
                background: t.expandedBg,
                borderColor: t.cardBorder,
              }}
            >
              <p className="text-xs" style={{ color: t.textMuted }}>
                Full Project
              </p>
              <p className="font-medium" style={{ color: t.textPrimary }}>
                {repo.commits} commits
              </p>
              <p className="text-xs" style={{ color: t.textSecondary }}>
                1 contributor
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onGitHubClick?.();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm transition-all duration-300"
              style={{
                background: t.btnSecondaryBg,
                color: t.btnSecondaryText,
                borderColor: t.btnSecondaryBorder,
              }}
            >
              <Github className="h-4 w-4" /> GitHub
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAnalysisClick?.();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: t.btnPrimaryBg,
                color: t.btnPrimaryText,
                boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
              }}
            >
              <Sparkles className="h-4 w-4" /> AI Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoCard;
