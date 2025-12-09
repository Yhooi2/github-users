/**
 * Project health analyzer
 *
 * Analyzes project activity status based on last push date
 * and archive status.
 */

export type ProjectHealth = 'healthy' | 'maintenance' | 'stale' | 'archived';

export interface ProjectHealthAnalysis {
  status: ProjectHealth;
  label: string;
  labelRu: string;
  color: string;
  reason: string;
}

/**
 * Analyze project health based on last activity
 *
 * Rules:
 * - archived: Project is explicitly archived
 * - healthy: Updated in last 30 days
 * - maintenance: Updated in last 6 months
 * - stale: No updates for 6+ months
 *
 * @param project - Project data with archive status and last push date
 * @returns Health analysis with status, label, and color
 */
export function analyzeProjectHealth(project: {
  isArchived: boolean;
  pushedAt: string | null;
}): ProjectHealthAnalysis {
  if (project.isArchived) {
    return {
      status: 'archived',
      label: 'Archived',
      labelRu: 'Архивирован',
      color: 'text-muted-foreground',
      reason: 'Project is archived'
    };
  }

  const daysSinceUpdate = project.pushedAt
    ? Math.floor((Date.now() - new Date(project.pushedAt).getTime()) / (1000 * 60 * 60 * 24))
    : Infinity;

  if (daysSinceUpdate <= 30) {
    return {
      status: 'healthy',
      label: 'Active',
      labelRu: 'Активный',
      color: 'text-success',
      reason: 'Updated in last 30 days'
    };
  }

  if (daysSinceUpdate <= 180) {
    return {
      status: 'maintenance',
      label: 'Maintenance',
      labelRu: 'На поддержке',
      color: 'text-warning',
      reason: 'Updated in last 6 months'
    };
  }

  return {
    status: 'stale',
    label: 'Stale',
    labelRu: 'Устарел',
    color: 'text-muted-foreground',
    reason: 'No updates for 6+ months'
  };
}
