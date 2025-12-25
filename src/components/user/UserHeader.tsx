/**
 * UserHeader - User profile header with Glass UI styling
 *
 * Uses ProfileHeaderGlass from shadcn-glass-ui v2.9.1
 * Includes AICardGlass on the right side
 */

import { getLanguageColor } from "@/lib/constants";
import {
  AICardGlass,
  ProfileHeaderExtendedGlass,
} from "shadcn-glass-ui/components";
import type { LanguageItem } from "./LanguagesInline";

type UserStats = {
  repositories: number;
  followers: number;
  following: number;
  gists: number;
};

type UserHeaderProps = {
  user: {
    avatarUrl: string;
    name: string | null;
    login: string;
    bio: string | null;
    location: string | null;
    url: string;
    createdAt: string;
  };
  /** Optional stats to display inline */
  stats?: UserStats;
  /** Optional programming languages */
  languages?: LanguageItem[];
  /** Callback for AI generation button */
  onAIGenerate?: () => void;
};

export function UserHeader({
  user,
  stats,
  languages,
  onAIGenerate,
}: UserHeaderProps) {
  // Transform languages to include color and round percentages
  // Limit to top 4 languages to fit in one line
  const topLanguages = languages?.slice(0, 4);
  const languagesWithColor = topLanguages?.map((lang) => ({
    name: lang.name,
    percentage: Math.round(lang.percent),
    color: getLanguageColor(lang.name),
  }));

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-6">
      <ProfileHeaderExtendedGlass
        user={{
          name: user.name,
          login: user.login,
          avatar: user.avatarUrl,
          url: user.url,
          createdAt: user.createdAt,
          bio: user.bio,
          location: user.location,
          stats: stats
            ? {
                repos: stats.repositories,
                followers: stats.followers,
                following: stats.following,
                gists: stats.gists,
              }
            : undefined,
          languages: languagesWithColor,
        }}
        showStatus
        status="online"
        transparent
        className="flex-1 p-0"
      />
      <AICardGlass onGenerate={onAIGenerate} />
    </div>
  );
}
