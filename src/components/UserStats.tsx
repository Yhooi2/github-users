import { type GitHubUser } from "@/apollo/github-api.types";

type UserStatsProps = {
  user: GitHubUser;
};

// Function to convert bytes to lines of code
function bytesToLines(bytes: number): number {
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

export function UserStats({ user }: UserStatsProps) {
  // Calculate total lines of code
  const totalLinesOfCode =
    user.repositories.nodes?.reduce((total, repo) => {
      return (
        total + (repo.languages ? bytesToLines(repo.languages.totalSize) : 0)
      );
    }, 0) || 0;

  const stats = [
    {
      label: "Repositories",
      value: user.repositories.totalCount,
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      label: "Followers",
      value: user.followers.totalCount,
      icon: "👥",
      color: "bg-green-500",
    },
    {
      label: "Following",
      value: user.following.totalCount,
      icon: "👤",
      color: "bg-purple-500",
    },
    {
      label: "Gists",
      value: user.gists.totalCount,
      icon: "📝",
      color: "bg-orange-500",
    },
    {
      label: "Lines of Code",
      value: totalLinesOfCode,
      icon: "💻",
      color: "bg-indigo-500",
      formatted: formatLines(totalLinesOfCode),
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg bg-background p-4 text-center shadow-md dark:bg-muted"
        >
          <div
            className={`h-12 w-12 ${stat.color} mx-auto mb-2 flex items-center justify-center rounded-full text-xl text-white`}
          >
            {stat.icon}
          </div>
          <div className="mb-1 text-2xl font-bold text-foreground">
            {stat.formatted || stat.value.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
