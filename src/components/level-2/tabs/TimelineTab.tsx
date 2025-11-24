import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { eventColors, type EventType } from "@/lib/design-tokens";
import { GitCommit, GitMerge, GitPullRequest, MessageSquare } from "lucide-react";
import type { ProjectForModal } from "../ProjectAnalyticsModal";

export interface TimelineTabProps {
  project: ProjectForModal;
}

interface TimelineEvent {
  id: string;
  type: EventType;
  title: string;
  date: string;
  description?: string;
}

// Placeholder data
const SAMPLE_EVENTS: TimelineEvent[] = [
  {
    id: "1",
    type: "commit",
    title: "feat: add new dashboard component",
    date: "2 days ago",
  },
  {
    id: "2",
    type: "pr",
    title: "PR #142: Implement user settings",
    date: "5 days ago",
    description: "Added user preferences and notification settings",
  },
  {
    id: "3",
    type: "review",
    title: "Reviewed PR #138",
    date: "1 week ago",
  },
  {
    id: "4",
    type: "merge",
    title: "Merged PR #135: Fix authentication bug",
    date: "2 weeks ago",
  },
  {
    id: "5",
    type: "commit",
    title: "chore: update dependencies",
    date: "3 weeks ago",
  },
];

const EVENT_ICONS = {
  commit: GitCommit,
  pr: GitPullRequest,
  review: MessageSquare,
  merge: GitMerge,
};

const EVENT_COLORS = eventColors;

/**
 * Timeline tab content for project analytics modal
 *
 * Shows chronological list of user's activities in the project
 */
export function TimelineTab({ project: _project }: TimelineTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SAMPLE_EVENTS.map((event, index) => (
              <div key={event.id}>
                <TimelineEventItem event={event} />
                {index < SAMPLE_EVENTS.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Monthly contribution chart would be displayed here with commits,
            PRs, and reviews per month.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TimelineEventItem({ event }: { event: TimelineEvent }) {
  const Icon = EVENT_ICONS[event.type];
  const colorClass = EVENT_COLORS[event.type];

  return (
    <div className="flex gap-3">
      <div className={`mt-0.5 flex-shrink-0 ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{event.title}</p>
        {event.description && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{event.date}</p>
      </div>
    </div>
  );
}
