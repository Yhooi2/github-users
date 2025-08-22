import {
  type GitHubUser,
  isYearlyContributions,
} from "@/apollo/github-api.types";

type ContributionsChartProps = {
  user: GitHubUser;
};

export function ContributionsChart({ user }: ContributionsChartProps) {
  // Get account creation year
  const createdAtDate = new Date(user.createdAt);
  const accountCreatedYear = isNaN(createdAtDate.getTime())
    ? new Date().getFullYear()
    : createdAtDate.getFullYear();
  const currentYear = new Date().getFullYear();

  // Create array of all years from account creation to current
  const contributions = [];
  for (let year = accountCreatedYear; year <= currentYear; year++) {
    // Find data for current year
    const contribKey = `contrib${year}` as keyof GitHubUser;
    const contribData = user[contribKey];

    // Check if data exists for this year
    if (isYearlyContributions(contribData)) {
      const commits = contribData.totalCommitContributions;

      // Skip future years and current year without data
      const isCurrentYear = year === currentYear;
      const isFutureYear = year > currentYear;
      if (commits === 0 && (isFutureYear || (isCurrentYear && !contribData))) {
        continue;
      }

      contributions.push({ year, commits });
    }
  }

  // Sort by year in reverse order (newest to oldest)
  contributions.sort((a, b) => b.year - a.year);

  const maxCommits = contributions.length
    ? Math.max(...contributions.map((c) => c.commits))
    : 0;

  return (
    <div className="mb-6 rounded-lg bg-background p-6 shadow-md dark:bg-muted">
      <h2 className="mb-4 text-xl font-bold text-foreground">Commit Activity</h2>
      <div className="space-y-4">
        {contributions.map((contribution) => {
          const percentage =
            maxCommits > 0 ? (contribution.commits / maxCommits) * 100 : 0;
          return (
            <div
              key={contribution.year}
              className="flex items-center space-x-4"
            >
              <div className="w-16 text-sm font-medium text-muted-foreground">
                {contribution.year}
              </div>
              <div className="h-6 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-20 text-right text-sm font-bold text-foreground">
                {contribution.commits.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        Total commits:{" "}
        {contributions.reduce((sum, c) => sum + c.commits, 0).toLocaleString()}
      </div>
    </div>
  );
}
