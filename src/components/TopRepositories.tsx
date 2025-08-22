import { type GitHubUser } from "@/apollo/github-api.types";

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

  // Use commit history from repository data
  const topRepos = repositories
    .map((repo) => ({
      ...repo,
      commits: repo.defaultBranchRef?.target?.history?.totalCount || 0,
      linesOfCode: repo.languages ? bytesToLines(repo.languages.totalSize) : 0,
    }))
    .filter((repo) => repo.commits > 0) // Only show repos with commits
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 5);
  if (topRepos.length === 0) {
    return (
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Top Repositories
        </h2>
        <p className="text-gray-600">No repository data available</p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Top Repositories</h2>
      <div className="space-y-3">
        {topRepos.map((repo, index) => (
          <div
            key={repo.name}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <div className="flex flex-1 items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{repo.name}</h3>
                <p className="text-sm text-gray-600">
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
                        bg: "bg-yellow-100",
                        text: "text-yellow-800",
                      },
                      TypeScript: { bg: "bg-blue-100", text: "text-blue-800" },
                      Python: { bg: "bg-green-100", text: "text-green-800" },
                      Java: { bg: "bg-orange-100", text: "text-orange-800" },
                      "C++": { bg: "bg-purple-100", text: "text-purple-800" },
                      Ruby: { bg: "bg-red-100", text: "text-red-800" },
                      Go: { bg: "bg-cyan-100", text: "text-cyan-800" },
                      PHP: { bg: "bg-indigo-100", text: "text-indigo-800" },
                      Rust: { bg: "bg-amber-100", text: "text-amber-800" },
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
                        bg: "bg-gray-100",
                        text: "text-gray-800",
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
              <div className="text-lg font-bold text-green-600">
                {repo.commits.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">commits</div>
              <div className="text-sm font-medium text-blue-600">
                {formatLines(repo.linesOfCode)} lines
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
