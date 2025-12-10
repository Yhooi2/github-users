/**
 * Shared utility functions for metrics calculations
 *
 * This module contains common helper functions used across multiple metric modules
 * (activity.ts, quality.ts, growth.ts) to avoid code duplication.
 */

import type { YearData } from "@/hooks/useUserAnalytics";

/**
 * Clamp a value between min and max
 *
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 *
 * @example
 * ```typescript
 * clamp(150, 0, 100); // 100
 * clamp(-50, 0, 100); // 0
 * clamp(50, 0, 100);  // 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate total stars across all repositories in a year
 *
 * @param yearData - Year contribution data containing owned and contributed repos
 * @returns Total stargazer count across all repositories
 */
export function calculateTotalStars(yearData: YearData): number {
  const allRepos = [...yearData.ownedRepos, ...yearData.contributions];
  return allRepos.reduce((sum, r) => sum + r.repository.stargazerCount, 0);
}

/**
 * Calculate total forks across all repositories in a year
 *
 * @param yearData - Year contribution data containing owned and contributed repos
 * @returns Total fork count across all repositories
 */
export function calculateTotalForks(yearData: YearData): number {
  const allRepos = [...yearData.ownedRepos, ...yearData.contributions];
  return allRepos.reduce((sum, r) => sum + r.repository.forkCount, 0);
}

/**
 * Extract unique languages from year data
 *
 * @param yearData - Year contribution data containing owned and contributed repos
 * @returns Set of unique language names
 */
export function extractLanguages(yearData: YearData): Set<string> {
  const languages = new Set<string>();
  const allRepos = [...yearData.ownedRepos, ...yearData.contributions];

  allRepos.forEach((r) => {
    if (r.repository.primaryLanguage?.name) {
      languages.add(r.repository.primaryLanguage.name);
    }
  });

  return languages;
}

/**
 * Get data for last N months from timeline
 * Note: Since timeline is yearly, we approximate by treating recent years
 *
 * @param timeline - Array of yearly contribution data
 * @param months - Number of months to include
 * @returns Subset of timeline data for the specified period
 */
export function getLastNMonths(
  timeline: YearData[],
  months: number,
): YearData[] {
  if (timeline.length === 0) return [];

  // For 3 months: include current year only
  // For 12 months: include current year + potentially last year
  const yearsToInclude =
    months <= 3 ? 1 : months <= 12 ? 2 : Math.ceil(months / 12);

  return timeline
    .sort((a, b) => b.year - a.year) // newest first
    .slice(0, yearsToInclude);
}

/**
 * Count unique repositories across YearData array
 *
 * @param data - Array of yearly contribution data
 * @returns Number of unique repositories
 */
export function countUniqueRepos(data: YearData[]): number {
  const repos = new Set<string>();
  data.forEach((year) => {
    year.ownedRepos.forEach((r) => repos.add(r.repository.url));
    year.contributions.forEach((r) => repos.add(r.repository.url));
  });
  return repos.size;
}

/**
 * Get unique repositories by URL to avoid duplicates across years
 * Generic version that works with any repository-containing object
 *
 * @param repos - Array of objects containing repository data with URL
 * @returns Deduplicated array of repositories
 */
export function getUniqueRepos<T extends { repository: { url: string } }>(
  repos: T[],
): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const repo of repos) {
    if (!seen.has(repo.repository.url)) {
      seen.add(repo.repository.url);
      unique.push(repo);
    }
  }

  return unique;
}
