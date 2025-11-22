import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowDownNarrowWide, ChevronDown, FolderGit2 } from "lucide-react";
import { useMemo } from "react";
import { CompactProjectRow, type CompactProject } from "./CompactProjectRow";

export type SortOption = "commits" | "stars" | "recent";

export interface ProjectListContainerProps {
  /** Array of projects to display */
  projects: CompactProject[];
  /** Year for the header */
  year: number;
  /** Current sort option */
  sortBy: SortOption;
  /** Handler for sort change */
  onSortChange: (sort: SortOption) => void;
  /** Handler for project click (expand to Level 1) */
  onProjectClick: (id: string) => void;
  /** Set of currently expanded project IDs */
  expandedProjects: Set<string>;
}

const SORT_LABELS: Record<SortOption, string> = {
  commits: "Commits",
  stars: "Stars",
  recent: "Recent",
};

/**
 * Container for Level 0 project list with grouping and sorting
 *
 * Features:
 * - Groups projects into "Your Projects" (owner) and "Contributions"
 * - Sortable by commits, stars, or recent activity
 * - Scrollable with fade gradient when overflowing
 * - Empty state when no projects
 *
 * @example
 * ```tsx
 * const [sortBy, setSortBy] = useState<SortOption>("commits");
 * const { expandedProjects, toggleProject } = useProgressiveDisclosure();
 *
 * <ProjectListContainer
 *   projects={yearData.projects}
 *   year={2024}
 *   sortBy={sortBy}
 *   onSortChange={setSortBy}
 *   onProjectClick={toggleProject}
 *   expandedProjects={expandedProjects}
 * />
 * ```
 */
export function ProjectListContainer({
  projects,
  year,
  sortBy,
  onSortChange,
  onProjectClick,
  expandedProjects,
}: ProjectListContainerProps) {
  // Sort and group projects
  const { ownedProjects, contributedProjects, maxCommits } = useMemo(() => {
    // Sort function
    const sortFn = (a: CompactProject, b: CompactProject) => {
      switch (sortBy) {
        case "commits":
          return b.commits - a.commits;
        case "stars":
          return b.stars - a.stars;
        case "recent":
          // For now, just use commits as proxy for recent activity
          return b.commits - a.commits;
        default:
          return 0;
      }
    };

    const sorted = [...projects].sort(sortFn);
    const owned = sorted.filter((p) => p.isOwner);
    const contributed = sorted.filter((p) => !p.isOwner);
    const max = Math.max(...projects.map((p) => p.commits), 1);

    return {
      ownedProjects: owned,
      contributedProjects: contributed,
      maxCommits: max,
    };
  }, [projects, sortBy]);

  const totalProjects = projects.length;

  // Empty state
  if (totalProjects === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FolderGit2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">
            No activity in {year}
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            No projects or contributions found for this year
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">
          Projects & Contributions ({year})
        </CardTitle>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowDownNarrowWide className="h-4 w-4" />
            {SORT_LABELS[sortBy]}
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => onSortChange(option)}
                className={cn(sortBy === option && "bg-muted")}
              >
                {SORT_LABELS[option]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="px-3 pb-3">
        <ScrollArea className="max-h-[calc(100vh-300px)]">
          <div className="space-y-1 pr-4">
            {/* Your Projects section */}
            {ownedProjects.length > 0 && (
              <section aria-labelledby="owned-projects-heading">
                <h3
                  id="owned-projects-heading"
                  className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Your Projects ({ownedProjects.length})
                </h3>
                {ownedProjects.map((project) => (
                  <CompactProjectRow
                    key={project.id}
                    project={project}
                    maxCommits={maxCommits}
                    onClick={() => onProjectClick(project.id)}
                    isExpanded={expandedProjects.has(project.id)}
                  />
                ))}
              </section>
            )}

            {/* Separator between sections */}
            {ownedProjects.length > 0 && contributedProjects.length > 0 && (
              <Separator className="my-4" />
            )}

            {/* Contributions section */}
            {contributedProjects.length > 0 && (
              <section aria-labelledby="contributions-heading">
                <h3
                  id="contributions-heading"
                  className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Contributions ({contributedProjects.length})
                </h3>
                {contributedProjects.map((project) => (
                  <CompactProjectRow
                    key={project.id}
                    project={project}
                    maxCommits={maxCommits}
                    onClick={() => onProjectClick(project.id)}
                    isExpanded={expandedProjects.has(project.id)}
                  />
                ))}
              </section>
            )}
          </div>
        </ScrollArea>

        {/* Scroll hint (optional) */}
        {totalProjects > 10 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent" />
        )}
      </CardContent>
    </Card>
  );
}
