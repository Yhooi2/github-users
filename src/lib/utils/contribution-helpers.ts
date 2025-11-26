/**
 * Contribution Helpers
 *
 * Utility functions for calculating and displaying user contribution data.
 * Used by CompactProjectRow and ExpandableProjectCard components.
 */

/**
 * Contribution level thresholds and styles
 */
export type ContributionLevel = "owner" | "maintainer" | "contributor" | "minor";

export interface ContributionStyle {
  level: ContributionLevel;
  label: string;
  badgeClass: string;
  progressClass: string;
  textClass: string;
}

/**
 * Activity status based on last commit date
 */
export type ActivityStatus = "active" | "recent" | "inactive";

export interface ActivityStyle {
  status: ActivityStatus;
  label: string;
  dotClass: string;
  textClass: string;
  pulse: boolean;
}

/**
 * Thresholds for contribution levels
 */
const CONTRIBUTION_THRESHOLDS = {
  owner: 80,      // 80-100%
  maintainer: 50, // 50-79%
  contributor: 20, // 20-49%
  // minor: 0-19%
} as const;

/**
 * Thresholds for activity status (in days)
 */
const ACTIVITY_THRESHOLDS = {
  active: 30,   // 0-30 days
  recent: 90,   // 31-90 days
  // inactive: 91+ days
} as const;

/**
 * Get contribution level based on percentage
 */
export function getContributionLevel(percent: number): ContributionLevel {
  if (percent >= CONTRIBUTION_THRESHOLDS.owner) return "owner";
  if (percent >= CONTRIBUTION_THRESHOLDS.maintainer) return "maintainer";
  if (percent >= CONTRIBUTION_THRESHOLDS.contributor) return "contributor";
  return "minor";
}

/**
 * Get contribution styles based on percentage
 */
export function getContributionStyle(percent: number): ContributionStyle {
  const level = getContributionLevel(percent);

  const styles: Record<ContributionLevel, Omit<ContributionStyle, "level">> = {
    owner: {
      label: "Owner",
      badgeClass: "bg-success/10 text-success border-success/30",
      progressClass: "[&>[data-slot=progress-indicator]]:bg-success",
      textClass: "text-success",
    },
    maintainer: {
      label: "Maintainer",
      badgeClass: "bg-primary/10 text-primary border-primary/30",
      progressClass: "[&>[data-slot=progress-indicator]]:bg-primary",
      textClass: "text-primary",
    },
    contributor: {
      label: "Contributor",
      badgeClass: "bg-warning/10 text-warning border-warning/30",
      progressClass: "[&>[data-slot=progress-indicator]]:bg-warning",
      textClass: "text-warning",
    },
    minor: {
      label: "Contributor",
      badgeClass: "bg-muted text-muted-foreground border-border",
      progressClass: "[&>[data-slot=progress-indicator]]:bg-muted-foreground",
      textClass: "text-muted-foreground",
    },
  };

  return { level, ...styles[level] };
}

/**
 * Get contribution badge classes for CompactProjectRow
 */
export function getContributionBadgeClass(percent: number): string {
  const { badgeClass } = getContributionStyle(percent);
  return badgeClass;
}

/**
 * Get role label based on contribution percentage and ownership
 */
export function getRoleLabel(percent: number, isOwner: boolean): string {
  if (isOwner && percent >= CONTRIBUTION_THRESHOLDS.owner) return "Owner";
  if (percent >= CONTRIBUTION_THRESHOLDS.maintainer) return "Maintainer";
  if (percent >= CONTRIBUTION_THRESHOLDS.contributor) return "Core Contributor";
  return "Contributor";
}

/**
 * Calculate days since a given date
 */
export function daysSince(date: Date | string): number {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = now.getTime() - targetDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get activity status based on last commit date
 */
export function getActivityStatus(lastCommitDate: Date | string | null): ActivityStatus {
  if (!lastCommitDate) return "inactive";

  const days = daysSince(lastCommitDate);

  if (days <= ACTIVITY_THRESHOLDS.active) return "active";
  if (days <= ACTIVITY_THRESHOLDS.recent) return "recent";
  return "inactive";
}

/**
 * Get activity styles based on status
 */
export function getActivityStyle(status: ActivityStatus): ActivityStyle {
  const styles: Record<ActivityStatus, Omit<ActivityStyle, "status">> = {
    active: {
      label: "Active",
      dotClass: "bg-success",
      textClass: "text-success",
      pulse: true,
    },
    recent: {
      label: "Recent",
      dotClass: "bg-warning",
      textClass: "text-warning",
      pulse: false,
    },
    inactive: {
      label: "Inactive",
      dotClass: "bg-muted-foreground",
      textClass: "text-muted-foreground",
      pulse: false,
    },
  };

  return { status, ...styles[status] };
}

/**
 * Format active period string (e.g., "Jan 2023 - Nov 2024")
 */
export function formatActivePeriod(
  firstCommitDate: Date | string | null,
  lastCommitDate: Date | string | null
): string {
  if (!firstCommitDate || !lastCommitDate) return "No activity";

  const first = typeof firstCommitDate === "string" ? new Date(firstCommitDate) : firstCommitDate;
  const last = typeof lastCommitDate === "string" ? new Date(lastCommitDate) : lastCommitDate;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const firstStr = formatDate(first);
  const lastStr = formatDate(last);

  if (firstStr === lastStr) {
    return firstStr;
  }

  return `${firstStr} - ${lastStr}`;
}

/**
 * Calculate contribution percentage
 * Returns 100% if totalCommits is undefined (assume user is sole contributor)
 */
export function calculateContributionPercent(
  userCommits: number,
  totalCommits: number | undefined | null
): number {
  // If no total data, assume 100% (user is the only contributor we know)
  if (totalCommits === undefined || totalCommits === null || totalCommits === 0) {
    return userCommits > 0 ? 100 : 0;
  }
  // Cap at 100% in case of data inconsistencies
  return Math.min(100, Math.round((userCommits / totalCommits) * 100));
}
