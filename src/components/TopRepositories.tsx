import { type GitHubUser } from "@/apollo/github-api.types";
import { createContributionsLookup, filterRepositoriesWithUserContributions } from "./TopRepositories.helpers";

type TopRepositoriesProps = {
  user: GitHubUser;
};

// Function to convert bytes to lines of code (approximate)
function bytesToLines(bytes: number): number {
  // Approximately 4 bytes per line of code (including spaces, tabs, characters)
  return Math.round(bytes / 4);
}

// Function to format line numbers
function formatLines(lines: number): string {
  if (lines >= 1000000) {
    return `${(lines / 1000000).toFixed(1)}M`;
  } else if (lines >= 1000) {
    return `${(lines / 1000).toFixed(1)}K`;
  }
  return lines.toString();
}

export function TopRepositories({ user }: TopRepositoriesProps) {
  const repositories = user.repositories.nodes || [];
  const contributions = createContributionsLookup(user);

  // Use commit history from repository data
  const filteredRepositories = filterRepositoriesWithUserContributions(repositories, contributions);
  const topRepos = filteredRepositories
    .map((repo) => ({
      ...repo,
      commits: contributions[repo.name] || 0,
      linesOfCode: repo.languages ? bytesToLines(repo.languages.totalSize) : 0,
    }))
    .filter((repo) => repo.commits > 0) // Only show repos with commits
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 5);
  if (topRepos.length === 0) {
    return (
      <div className="mb-6 rounded-lg bg-background p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Top Repositories
        </h2>
        <p className="text-muted-foreground">No repository data available</p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg bg-background p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-foreground">
        Top Repositories
      </h2>
      <div className="space-y-3">
        {topRepos.map((repo, index) => (
          <div
            key={repo.name}
            className="flex items-center justify-between rounded-lg bg-muted p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex flex-1 items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-background">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{repo.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {repo.description || "No description"}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(() => {
                    const edges = repo.languages?.edges || [];
                    const sortedLanguages = [...edges].sort((a, b) => {
                      const aIsPrimary =
                        a.node.name === repo.primaryLanguage?.name;
                      const bIsPrimary =
                        b.node.name === repo.primaryLanguage?.name;
                      if (aIsPrimary) return -1;
                      if (bIsPrimary) return 1;
                      return b.size - a.size;
                    });

                    const colorMap: Record<
                      string,
                      { bg: string; text: string }
                    > = {
                      JavaScript: {
                        bg: "bg-[hsl(var(--muted))]",
                        text: "text-[hsl(var(--muted-foreground))]",
                      },
                      TypeScript: {
                        bg: "bg-[hsl(var(--accent))]",
                        text: "text-[hsl(var(--accent-foreground))]",
                      },
                      Python: {
                        bg: "bg-[hsl(var(--primary))]",
                        text: "text-[hsl(var(--primary-foreground))]",
                      },
                      Java: {
                        bg: "bg-[hsl(var(--destructive))]",
                        text: "text-[hsl(var(--primary-foreground))]",
                      },
                      "C++": {
                        bg: "bg-[hsl(var(--secondary))]",
                        text: "text-[hsl(var(--secondary-foreground))]",
                      },
                      Ruby: {
                        bg: "bg-[hsl(var(--ring))]",
                        text: "text-[hsl(var(--card-foreground))]",
                      },
                      Go: {
                        bg: "bg-[hsl(var(--chart-1))]",
                        text: "text-[hsl(var(--primary-foreground))]",
                      },
                      PHP: {
                        bg: "bg-[hsl(var(--chart-2))]",
                        text: "text-[hsl(var(--primary-foreground))]",
                      },
                      Rust: {
                        bg: "bg-[hsl(var(--chart-3))]",
                        text: "text-[hsl(var(--primary-foreground))]",
                      },
                    };

                    return sortedLanguages.map((edge) => {
                      const languageName = edge.node.name;
                      const isPrimary =
                        languageName === repo.primaryLanguage?.name;
                      const percentage = (
                        (edge.size / repo.languages.totalSize) *
                        100
                      ).toFixed(1);
                      const colors = colorMap[languageName] || {
                        bg: "bg-[hsl(var(--muted))]",
                        text: "text-[hsl(var(--muted-foreground))]",
                      };

                      return (
                        <span
                          key={languageName}
                          className={`inline-flex items-center px-2 py-1 ${colors.bg} ${colors.text} rounded-full text-xs ${isPrimary ? "font-medium ring-2 ring-blue-500 ring-offset-1" : ""}`}
                        >
                          {languageName}
                          <span className="ml-1 opacity-75">{percentage}%</span>
                        </span>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-lg font-bold text-primary">
                {repo.commits.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">commits</div>
              <div className="text-sm font-medium text-primary">
                {formatLines(repo.linesOfCode)} lines
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
