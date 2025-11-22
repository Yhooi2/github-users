import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/statistics";
import { Users } from "lucide-react";
import type { ProjectForModal } from "../ProjectAnalyticsModal";

export interface TeamTabProps {
  project: ProjectForModal;
}

interface Contributor {
  login: string;
  name: string;
  avatar: string;
  commits: number;
  additions: number;
  deletions: number;
}

// Placeholder data
const TOP_CONTRIBUTORS: Contributor[] = [
  {
    login: "alice",
    name: "Alice Smith",
    avatar: "https://i.pravatar.cc/150?u=alice",
    commits: 542,
    additions: 23450,
    deletions: 8920,
  },
  {
    login: "bob",
    name: "Bob Johnson",
    avatar: "https://i.pravatar.cc/150?u=bob",
    commits: 347,
    additions: 15230,
    deletions: 4560,
  },
  {
    login: "charlie",
    name: "Charlie Brown",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    commits: 289,
    additions: 12100,
    deletions: 3450,
  },
  {
    login: "diana",
    name: "Diana Prince",
    avatar: "https://i.pravatar.cc/150?u=diana",
    commits: 156,
    additions: 8900,
    deletions: 2100,
  },
  {
    login: "eve",
    name: "Eve Williams",
    avatar: "https://i.pravatar.cc/150?u=eve",
    commits: 89,
    additions: 4500,
    deletions: 1200,
  },
];

const TOTAL_CONTRIBUTORS = 24;
const MAX_COMMITS = TOP_CONTRIBUTORS[0].commits;

/**
 * Team tab content for project analytics modal
 *
 * Shows:
 * - Team size overview
 * - Top contributors with their stats
 * - Collaboration metrics
 */
export function TeamTab({ project: _project }: TeamTabProps) {
  return (
    <div className="space-y-6">
      {/* Team overview */}
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-lg bg-muted p-3">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-3xl font-bold">{TOTAL_CONTRIBUTORS}</p>
            <p className="text-sm text-muted-foreground">Total Contributors</p>
          </div>
          <div className="ml-auto flex -space-x-3">
            {TOP_CONTRIBUTORS.slice(0, 6).map((contributor) => (
              <Avatar
                key={contributor.login}
                className="h-10 w-10 border-2 border-background"
              >
                <AvatarImage src={contributor.avatar} alt={contributor.name} />
                <AvatarFallback>
                  {contributor.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {TOTAL_CONTRIBUTORS > 6 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-sm font-medium">
                +{TOTAL_CONTRIBUTORS - 6}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top contributors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Top Contributors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TOP_CONTRIBUTORS.map((contributor, index) => (
              <div key={contributor.login} className="flex items-center gap-3">
                <span className="w-5 text-center text-sm font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contributor.avatar} alt={contributor.name} />
                  <AvatarFallback>
                    {contributor.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{contributor.name}</p>
                  <p className="text-xs text-muted-foreground">@{contributor.login}</p>
                </div>
                <div className="w-24">
                  <Progress
                    value={(contributor.commits / MAX_COMMITS) * 100}
                    className="h-1.5"
                  />
                </div>
                <span className="w-16 text-right text-sm">
                  {formatNumber(contributor.commits)} commits
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collaboration stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Collaboration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold">156</p>
              <p className="text-xs text-muted-foreground">PRs Reviewed</p>
            </div>
            <div>
              <p className="text-xl font-bold">89</p>
              <p className="text-xs text-muted-foreground">Issues Closed</p>
            </div>
            <div>
              <p className="text-xl font-bold">42</p>
              <p className="text-xs text-muted-foreground">Discussions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
