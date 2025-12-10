import type { YearData } from "@/hooks/useUserAnalytics";
import { describe, expect, it } from "vitest";
import {
  calculateTotalForks,
  calculateTotalStars,
  clamp,
  countUniqueRepos,
  extractLanguages,
  getLastNMonths,
  getUniqueRepos,
} from "./shared";

// Helper to create mock repository contribution
function createRepoContribution(
  name: string,
  url: string,
  options: {
    stars?: number;
    forks?: number;
    language?: string;
  } = {},
) {
  return {
    contributions: { totalCount: 10 },
    repository: {
      name,
      url,
      owner: { login: "user" },
      stargazerCount: options.stars ?? 0,
      forkCount: options.forks ?? 0,
      watchers: { totalCount: 0 },
      isArchived: false,
      isFork: false,
      isPrivate: false,
      primaryLanguage: options.language ? { name: options.language } : null,
    },
  };
}

// Helper to create mock year data
function createYearData(
  year: number,
  options: {
    totalCommits?: number;
    ownedRepos?: ReturnType<typeof createRepoContribution>[];
    contributions?: ReturnType<typeof createRepoContribution>[];
  } = {},
): YearData {
  return {
    year,
    totalCommits: options.totalCommits ?? 0,
    totalIssues: 0,
    totalPRs: 0,
    totalReviews: 0,
    ownedRepos: options.ownedRepos ?? [],
    contributions: options.contributions ?? [],
  };
}

describe("shared metrics utilities", () => {
  describe("clamp", () => {
    it("returns value when within range", () => {
      expect(clamp(50, 0, 100)).toBe(50);
    });

    it("clamps to min when value is below", () => {
      expect(clamp(-10, 0, 100)).toBe(0);
    });

    it("clamps to max when value is above", () => {
      expect(clamp(150, 0, 100)).toBe(100);
    });

    it("handles negative ranges", () => {
      expect(clamp(-50, -100, 100)).toBe(-50);
      expect(clamp(-150, -100, 100)).toBe(-100);
    });

    it("handles equal min and max", () => {
      expect(clamp(50, 10, 10)).toBe(10);
    });

    it("handles edge cases at boundaries", () => {
      expect(clamp(0, 0, 100)).toBe(0);
      expect(clamp(100, 0, 100)).toBe(100);
    });
  });

  describe("calculateTotalStars", () => {
    it("returns 0 for year with no repos", () => {
      const yearData = createYearData(2024);
      expect(calculateTotalStars(yearData)).toBe(0);
    });

    it("sums stars from owned repos", () => {
      const yearData = createYearData(2024, {
        ownedRepos: [
          createRepoContribution("repo1", "https://github.com/user/repo1", {
            stars: 10,
          }),
          createRepoContribution("repo2", "https://github.com/user/repo2", {
            stars: 20,
          }),
        ],
      });
      expect(calculateTotalStars(yearData)).toBe(30);
    });

    it("sums stars from contributions", () => {
      const yearData = createYearData(2024, {
        contributions: [
          createRepoContribution(
            "contrib1",
            "https://github.com/other/contrib1",
            { stars: 100 },
          ),
        ],
      });
      expect(calculateTotalStars(yearData)).toBe(100);
    });

    it("sums stars from both owned and contributed repos", () => {
      const yearData = createYearData(2024, {
        ownedRepos: [
          createRepoContribution("repo1", "https://github.com/user/repo1", {
            stars: 10,
          }),
        ],
        contributions: [
          createRepoContribution(
            "contrib1",
            "https://github.com/other/contrib1",
            { stars: 50 },
          ),
        ],
      });
      expect(calculateTotalStars(yearData)).toBe(60);
    });
  });

  describe("calculateTotalForks", () => {
    it("returns 0 for year with no repos", () => {
      const yearData = createYearData(2024);
      expect(calculateTotalForks(yearData)).toBe(0);
    });

    it("sums forks from all repos", () => {
      const yearData = createYearData(2024, {
        ownedRepos: [
          createRepoContribution("repo1", "https://github.com/user/repo1", {
            forks: 5,
          }),
          createRepoContribution("repo2", "https://github.com/user/repo2", {
            forks: 3,
          }),
        ],
        contributions: [
          createRepoContribution(
            "contrib1",
            "https://github.com/other/contrib1",
            { forks: 10 },
          ),
        ],
      });
      expect(calculateTotalForks(yearData)).toBe(18);
    });
  });

  describe("extractLanguages", () => {
    it("returns empty set for year with no repos", () => {
      const yearData = createYearData(2024);
      const languages = extractLanguages(yearData);
      expect(languages.size).toBe(0);
    });

    it("extracts unique languages from owned repos", () => {
      const yearData = createYearData(2024, {
        ownedRepos: [
          createRepoContribution("repo1", "https://github.com/user/repo1", {
            language: "TypeScript",
          }),
          createRepoContribution("repo2", "https://github.com/user/repo2", {
            language: "Python",
          }),
          createRepoContribution("repo3", "https://github.com/user/repo3", {
            language: "TypeScript",
          }),
        ],
      });
      const languages = extractLanguages(yearData);
      expect(languages.size).toBe(2);
      expect(languages.has("TypeScript")).toBe(true);
      expect(languages.has("Python")).toBe(true);
    });

    it("extracts languages from both owned and contributed repos", () => {
      const yearData = createYearData(2024, {
        ownedRepos: [
          createRepoContribution("repo1", "https://github.com/user/repo1", {
            language: "TypeScript",
          }),
        ],
        contributions: [
          createRepoContribution(
            "contrib1",
            "https://github.com/other/contrib1",
            { language: "Go" },
          ),
        ],
      });
      const languages = extractLanguages(yearData);
      expect(languages.size).toBe(2);
      expect(languages.has("TypeScript")).toBe(true);
      expect(languages.has("Go")).toBe(true);
    });

    it("ignores repos without primary language", () => {
      const yearData = createYearData(2024, {
        ownedRepos: [
          createRepoContribution("repo1", "https://github.com/user/repo1", {
            language: "TypeScript",
          }),
          createRepoContribution("repo2", "https://github.com/user/repo2"), // no language
        ],
      });
      const languages = extractLanguages(yearData);
      expect(languages.size).toBe(1);
    });
  });

  describe("getLastNMonths", () => {
    it("returns empty array for empty timeline", () => {
      const result = getLastNMonths([], 3);
      expect(result).toEqual([]);
    });

    it("returns 1 year for 3 months period", () => {
      const timeline = [
        createYearData(2024),
        createYearData(2023),
        createYearData(2022),
      ];
      const result = getLastNMonths(timeline, 3);
      expect(result.length).toBe(1);
      expect(result[0].year).toBe(2024);
    });

    it("returns 2 years for 12 months period", () => {
      const timeline = [
        createYearData(2024),
        createYearData(2023),
        createYearData(2022),
      ];
      const result = getLastNMonths(timeline, 12);
      expect(result.length).toBe(2);
      expect(result[0].year).toBe(2024);
      expect(result[1].year).toBe(2023);
    });

    it("sorts timeline newest first", () => {
      const timeline = [
        createYearData(2022),
        createYearData(2024),
        createYearData(2023),
      ];
      const result = getLastNMonths(timeline, 12);
      expect(result[0].year).toBe(2024);
      expect(result[1].year).toBe(2023);
    });

    it("returns all available years if less than requested", () => {
      const timeline = [createYearData(2024)];
      const result = getLastNMonths(timeline, 12);
      expect(result.length).toBe(1);
    });
  });

  describe("countUniqueRepos", () => {
    it("returns 0 for empty data", () => {
      expect(countUniqueRepos([])).toBe(0);
    });

    it("counts unique repos across years", () => {
      const data = [
        createYearData(2024, {
          ownedRepos: [
            createRepoContribution("repo1", "https://github.com/user/repo1"),
            createRepoContribution("repo2", "https://github.com/user/repo2"),
          ],
        }),
        createYearData(2023, {
          ownedRepos: [
            createRepoContribution("repo1", "https://github.com/user/repo1"), // duplicate
            createRepoContribution("repo3", "https://github.com/user/repo3"),
          ],
        }),
      ];
      expect(countUniqueRepos(data)).toBe(3);
    });

    it("counts both owned and contributed repos", () => {
      const data = [
        createYearData(2024, {
          ownedRepos: [
            createRepoContribution("repo1", "https://github.com/user/repo1"),
          ],
          contributions: [
            createRepoContribution(
              "contrib1",
              "https://github.com/other/contrib1",
            ),
          ],
        }),
      ];
      expect(countUniqueRepos(data)).toBe(2);
    });
  });

  describe("getUniqueRepos", () => {
    it("returns empty array for empty input", () => {
      expect(getUniqueRepos([])).toEqual([]);
    });

    it("removes duplicate repos by URL", () => {
      const repos = [
        createRepoContribution("repo1", "https://github.com/user/repo1"),
        createRepoContribution("repo1-dupe", "https://github.com/user/repo1"), // same URL
        createRepoContribution("repo2", "https://github.com/user/repo2"),
      ];
      const unique = getUniqueRepos(repos);
      expect(unique.length).toBe(2);
      expect(unique[0].repository.name).toBe("repo1");
      expect(unique[1].repository.name).toBe("repo2");
    });

    it("preserves order of first occurrence", () => {
      const repos = [
        createRepoContribution("first", "https://github.com/user/first"),
        createRepoContribution("second", "https://github.com/user/second"),
        createRepoContribution("first-again", "https://github.com/user/first"),
      ];
      const unique = getUniqueRepos(repos);
      expect(unique[0].repository.name).toBe("first");
      expect(unique[1].repository.name).toBe("second");
    });

    it("keeps all repos when all URLs are unique", () => {
      const repos = [
        createRepoContribution("repo1", "https://github.com/user/repo1"),
        createRepoContribution("repo2", "https://github.com/user/repo2"),
        createRepoContribution("repo3", "https://github.com/user/repo3"),
      ];
      const unique = getUniqueRepos(repos);
      expect(unique.length).toBe(3);
    });
  });
});
