import { type GitHubUser } from "@/apollo/github-api.types";
import { createContributionsLookup } from "@/components/TopRepositories.helpers";

type LanguageStatsProps = {
  user: GitHubUser;
};

// Function to convert bytes to lines of code
function bytesToLines(bytes: number): number {
  return Math.round(bytes / 4);
}

// Function to format file size
function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

export function LanguageStats({ user }: LanguageStatsProps) {
  const repositories = user.repositories.nodes || [];
  const contributions = createContributionsLookup(user);

  // Filter repositories - exclude forks without user contributions
  const filteredRepositories = repositories.filter(
    repo => !repo.isFork || (contributions[repo.name] || 0) > 0
  );

  // Collect language statistics
  const languageStats = new Map<string, { bytes: number; repos: number }>();

  filteredRepositories.forEach((repo) => {
    if (repo.languages) {
      repo.languages.edges.forEach((edge) => {
        const langName = edge.node.name;
        const current = languageStats.get(langName) || { bytes: 0, repos: 0 };
        languageStats.set(langName, {
          bytes: current.bytes + edge.size,
          repos: current.repos + 1,
        });
      });
    }
  });

  // Sort by code size
  const sortedLanguages = Array.from(languageStats.entries())
    .map(([name, stats]) => ({
      name,
      bytes: stats.bytes,
      repos: stats.repos,
      lines: bytesToLines(stats.bytes),
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);

  if (sortedLanguages.length === 0) {
    return (
      <div className="mb-6 rounded-lg bg-background p-6 shadow-md dark:bg-muted">
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Programming Languages
        </h2>
        <p className="text-muted-foreground">No language data available</p>
      </div>
    );
  }

  const totalBytes = sortedLanguages.reduce((sum, lang) => sum + lang.bytes, 0);

  return (
    <div className="mb-6 rounded-lg bg-background p-6 shadow-md dark:bg-muted">
      <h2 className="mb-4 text-xl font-bold text-foreground">
        Programming Languages
      </h2>
      <div className="space-y-3">
        {sortedLanguages.map((lang) => {
          const percentage =
            totalBytes > 0 ? (lang.bytes / totalBytes) * 100 : 0;
          return (
            <div key={lang.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-foreground">{lang.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">
                    {formatSize(lang.bytes)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lang.lines.toLocaleString()} lines
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="mr-3 h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Used in {lang.repos}{" "}
                {lang.repos === 1 ? "repository" : "repositories"}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total code size:</span>
          <span className="font-bold text-foreground">
            {formatSize(totalBytes)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total lines of code:</span>
          <span className="font-bold text-foreground">
            {bytesToLines(totalBytes).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
