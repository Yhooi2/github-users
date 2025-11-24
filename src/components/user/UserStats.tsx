import { StatsCard } from "@/components/layout/StatsCard";
import { FileText, GitFork, UserPlus, Users } from "lucide-react";

type UserStatsProps = {
  stats: {
    repositories: number;
    followers: number;
    following: number;
    gists: number;
  };
};

export function UserStats({ stats }: UserStatsProps) {
  const statsConfig = [
    {
      title: "Repositories",
      value: stats.repositories,
      icon: GitFork,
    },
    {
      title: "Followers",
      value: stats.followers,
      icon: Users,
    },
    {
      title: "Following",
      value: stats.following,
      icon: UserPlus,
    },
    {
      title: "Gists",
      value: stats.gists,
      icon: FileText,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statsConfig.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
