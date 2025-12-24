/**
 * UserHeader - User profile header with Glass UI styling
 *
 * Stage 6 migration: Uses ProfileHeaderExtendedGlass from shadcn-glass-ui v2.8.0
 */

import { getLanguageColor } from "@/lib/constants";
import { ProfileHeaderExtendedGlass } from "shadcn-glass-ui/components";
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
  /** Optional action buttons slot */
  actions?: React.ReactNode;
};

export function UserHeader({
  user,
  stats,
  languages,
  actions,
}: UserHeaderProps) {
  // Transform languages to include color
  const languagesWithColor = languages?.map((lang) => ({
    name: lang.name,
    percent: lang.percent,
    color: getLanguageColor(lang.name),
  }));

  return (
    <ProfileHeaderExtendedGlass
      user={{
        name: user.name ?? user.login,
        login: user.login,
        avatar: user.avatarUrl,
        url: user.url,
        createdAt: user.createdAt,
        bio: user.bio ?? undefined,
        location: user.location ?? undefined,
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
      actions={actions}
    />
  );
}
