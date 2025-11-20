import type { Repository } from "@/apollo/github-api.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthenticityScore } from "@/hooks/useAuthenticityScore";
import { AlertTriangle, CheckCircle2, Info, Shield } from "lucide-react";

type UserAuthenticityProps = {
  repositories: Repository[];
};

export function UserAuthenticity({ repositories }: UserAuthenticityProps) {
  const authenticity = useAuthenticityScore(repositories);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "High":
        return "bg-green-500 hover:bg-green-500/80";
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-500/80";
      case "Low":
        return "bg-orange-500 hover:bg-orange-500/80";
      case "Suspicious":
        return "bg-red-500 hover:bg-red-500/80";
      default:
        return "bg-muted";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "High":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Medium":
        return <Info className="h-4 w-4" />;
      case "Low":
      case "Suspicious":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" aria-hidden="true" />
          Authenticity Score
        </CardTitle>
        <CardDescription>
          Analysis of repository originality, activity, and code ownership
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Badge */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold">{authenticity.score}</div>
            <div className="text-sm text-muted-foreground">out of 100</div>
          </div>
          <Badge
            className={`${getCategoryColor(authenticity.category)} flex items-center gap-1`}
          >
            {getCategoryIcon(authenticity.category)}
            {authenticity.category}
          </Badge>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Score Breakdown</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Originality</span>
                <span className="font-medium">
                  {authenticity.breakdown.originalityScore}/25
                </span>
              </div>
              <Progress
                value={(authenticity.breakdown.originalityScore / 25) * 100}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Activity</span>
                <span className="font-medium">
                  {authenticity.breakdown.activityScore}/25
                </span>
              </div>
              <Progress
                value={(authenticity.breakdown.activityScore / 25) * 100}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Engagement</span>
                <span className="font-medium">
                  {authenticity.breakdown.engagementScore}/25
                </span>
              </div>
              <Progress
                value={(authenticity.breakdown.engagementScore / 25) * 100}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Code Ownership</span>
                <span className="font-medium">
                  {authenticity.breakdown.codeOwnershipScore}/25
                </span>
              </div>
              <Progress
                value={(authenticity.breakdown.codeOwnershipScore / 25) * 100}
              />
            </div>
          </div>
        </div>

        {/* Warning Flags */}
        {authenticity.flags.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning Flags:</strong>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {authenticity.flags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Metadata */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <h3 className="mb-3 text-sm font-semibold">Repository Breakdown</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">
                {authenticity.metadata.totalRepos}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Original:</span>
              <span className="font-medium">
                {authenticity.metadata.originalRepos}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Forked:</span>
              <span className="font-medium">
                {authenticity.metadata.forkedRepos}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Archived:</span>
              <span className="font-medium">
                {authenticity.metadata.archivedRepos}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Template:</span>
              <span className="font-medium">
                {authenticity.metadata.templateRepos}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
