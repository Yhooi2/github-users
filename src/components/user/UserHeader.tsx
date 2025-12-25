/**
 * UserHeader - User profile header with Glass UI styling
 *
 * Uses ProfileHeaderGlass Compound API from shadcn-glass-ui v2.11.0
 * Issue #30: Extended fields (bio, location, avatar, url, gists)
 * Issue #31: Compound Component API for AICardGlass customization
 */

import { getLanguageColor } from "@/lib/constants";
import { ProfileHeaderGlass } from "shadcn-glass-ui/components";
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
  /** Custom features for AI card */
  aiFeatures?: readonly string[];
  /** Estimated time for AI generation */
  aiEstimatedTime?: string;
};

export function UserHeader({
  user,
  stats,
  languages,
  onAIGenerate,
  aiFeatures,
  aiEstimatedTime,
}: UserHeaderProps) {
  // Transform languages to include color and round percentages
  // Limit to top 4 languages to fit in one line
  const topLanguages = languages?.slice(0, 4);
  const languagesWithColor = topLanguages?.map((lang) => ({
    name: lang.name,
    percent: Math.round(lang.percent),
    color: getLanguageColor(lang.name),
  }));

  const extendedUser = {
    name: user.name ?? user.login,
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
  };

  return (
    <ProfileHeaderGlass.Root>
      <ProfileHeaderGlass.Profile
        user={extendedUser}
        showStatus
        status="online"
      />
      <ProfileHeaderGlass.AI
        onGenerate={onAIGenerate}
        features={aiFeatures}
        estimatedTime={aiEstimatedTime}
      />
    </ProfileHeaderGlass.Root>
  );
}
