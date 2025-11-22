import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/statistics";
import { GitFork, GitPullRequest, MessageSquare, Star } from "lucide-react";
import type { ProjectForModal } from "../ProjectAnalyticsModal";

export interface OverviewTabProps {
  project: ProjectForModal;
}

/**
 * Overview tab content for project analytics modal
 *
 * Shows:
 * - Key metrics cards (stars, forks, PRs, reviews)
 * - Contribution summary
 * - Activity heatmap (placeholder)
 */
export function OverviewTab({ project }: OverviewTabProps) {
  // Placeholder data - in real app, this would come from GraphQL
  const metrics = {
    stars: project.stars,
    forks: project.forks,
    prs: 42,
    reviews: 156,
  };

  const contribution = {
    commits: 347,
    commitsPercent: 18,
    totalCommits: 1923,
  };

  return (
    <div className="space-y-6">
      {/* Metrics cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          title="Stars"
          value={formatNumber(metrics.stars)}
          icon={Star}
        />
        <MetricCard
          title="Forks"
          value={formatNumber(metrics.forks)}
          icon={GitFork}
        />
        <MetricCard
          title="PRs Merged"
          value={formatNumber(metrics.prs)}
          icon={GitPullRequest}
        />
        <MetricCard
          title="Reviews"
          value={formatNumber(metrics.reviews)}
          icon={MessageSquare}
        />
      </div>

      {/* Contribution summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Contribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Commits</span>
                <span className="font-medium">
                  {contribution.commits} ({contribution.commitsPercent}% of{" "}
                  {formatNumber(contribution.totalCommits)})
                </span>
              </div>
              <Progress value={contribution.commitsPercent} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              You are a key contributor to this project, ranking in the top 5%
              of all contributors.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Activity summary placeholder */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity heatmap and contribution chart would be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: typeof Star;
}

function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-lg bg-muted p-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
