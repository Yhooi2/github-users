import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

type Repository = {
  repository: { name: string };
  contributions: { totalCount: number };
};

type RecentActivityProps = {
  repositories: Repository[];
  maxItems?: number;
};

export function RecentActivity({
  repositories,
  maxItems = 5,
}: RecentActivityProps) {
  if (repositories.length === 0) {
    return null;
  }

  const displayedRepos = repositories.slice(0, maxItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" aria-hidden="true" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedRepos.map((repo, index) => (
            <div
              key={`${repo.repository.name}-${index}`}
              className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
            >
              <span className="font-medium">{repo.repository.name}</span>
              <span className="text-sm text-muted-foreground">
                {repo.contributions.totalCount.toLocaleString()} commits
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
