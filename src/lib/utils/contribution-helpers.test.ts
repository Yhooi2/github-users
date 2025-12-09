/**
 * Tests for Contribution Helpers
 *
 * Testing focus: User-facing contribution metrics and activity tracking
 *
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  calculateContributionPercent,
  daysSince,
  formatActivePeriod,
  getActivityStatus,
  getActivityStyle,
  getContributionBadgeClass,
  getContributionLevel,
  getContributionStyle,
  getRoleLabel,
  type ActivityStatus,
  type ContributionLevel,
} from "./contribution-helpers";

describe("Contribution Helpers", () => {
  beforeEach(() => {
    // Fix time for consistent testing
    vi.setSystemTime(new Date("2024-11-17T12:00:00Z"));
  });

  describe("getContributionLevel", () => {
    it("should classify contribution levels correctly", () => {
      expect(getContributionLevel(100)).toBe("owner");
      expect(getContributionLevel(80)).toBe("owner");
      expect(getContributionLevel(79)).toBe("maintainer");
      expect(getContributionLevel(50)).toBe("maintainer");
      expect(getContributionLevel(49)).toBe("contributor");
      expect(getContributionLevel(20)).toBe("contributor");
      expect(getContributionLevel(19)).toBe("minor");
      expect(getContributionLevel(0)).toBe("minor");
    });
  });

  describe("getContributionStyle", () => {
    it("should return correct styles for owner level", () => {
      const style = getContributionStyle(85);

      expect(style.level).toBe("owner");
      expect(style.label).toBe("Owner");
      expect(style.badgeClass).toContain("success");
      expect(style.progressClass).toContain("success");
      expect(style.textClass).toContain("success");
    });

    it("should return correct styles for maintainer level", () => {
      const style = getContributionStyle(65);

      expect(style.level).toBe("maintainer");
      expect(style.label).toBe("Maintainer");
      expect(style.badgeClass).toContain("primary");
    });

    it("should return correct styles for contributor level", () => {
      const style = getContributionStyle(35);

      expect(style.level).toBe("contributor");
      expect(style.label).toBe("Contributor");
      expect(style.badgeClass).toContain("warning");
    });

    it("should return correct styles for minor level", () => {
      const style = getContributionStyle(10);

      expect(style.level).toBe("minor");
      expect(style.label).toBe("Contributor");
      expect(style.badgeClass).toContain("muted");
    });
  });

  describe("getContributionBadgeClass", () => {
    it("should return badge class for given percentage", () => {
      expect(getContributionBadgeClass(90)).toContain("success");
      expect(getContributionBadgeClass(60)).toContain("primary");
      expect(getContributionBadgeClass(30)).toContain("warning");
      expect(getContributionBadgeClass(5)).toContain("muted");
    });
  });

  describe("getRoleLabel", () => {
    it("should return Owner for high contribution owner", () => {
      expect(getRoleLabel(85, true)).toBe("Owner");
    });

    it("should return Maintainer for maintainer level even if owner", () => {
      expect(getRoleLabel(60, true)).toBe("Maintainer");
    });

    it("should return Maintainer for non-owner with high contribution", () => {
      expect(getRoleLabel(65, false)).toBe("Maintainer");
    });

    it("should return Core Contributor for contributor level", () => {
      expect(getRoleLabel(35, false)).toBe("Core Contributor");
    });

    it("should return Contributor for minor level", () => {
      expect(getRoleLabel(10, false)).toBe("Contributor");
    });
  });

  describe("daysSince", () => {
    it("should calculate days from Date object", () => {
      const pastDate = new Date("2024-11-10T12:00:00Z"); // 7 days ago
      expect(daysSince(pastDate)).toBe(7);
    });

    it("should calculate days from ISO string", () => {
      expect(daysSince("2024-11-15T12:00:00Z")).toBe(2); // 2 days ago
    });

    it("should handle today correctly", () => {
      expect(daysSince("2024-11-17T12:00:00Z")).toBe(0);
    });

    it("should handle dates from weeks ago", () => {
      expect(daysSince("2024-10-17T12:00:00Z")).toBe(31); // ~31 days ago
    });
  });

  describe("getActivityStatus", () => {
    it("should return active for recent commits (0-30 days)", () => {
      expect(getActivityStatus("2024-11-17T12:00:00Z")).toBe("active"); // Today
      expect(getActivityStatus("2024-11-10T12:00:00Z")).toBe("active"); // 7 days ago
      expect(getActivityStatus("2024-10-18T12:00:00Z")).toBe("active"); // 30 days ago
    });

    it("should return recent for commits within 31-90 days", () => {
      expect(getActivityStatus("2024-10-17T12:00:00Z")).toBe("recent"); // 31 days ago
      expect(getActivityStatus("2024-09-01T12:00:00Z")).toBe("recent"); // ~77 days ago
      expect(getActivityStatus("2024-08-19T12:00:00Z")).toBe("recent"); // 90 days ago
    });

    it("should return inactive for old commits (91+ days)", () => {
      expect(getActivityStatus("2024-08-18T12:00:00Z")).toBe("inactive"); // 91 days ago
      expect(getActivityStatus("2024-01-01T12:00:00Z")).toBe("inactive"); // ~320 days ago
      expect(getActivityStatus("2020-01-01T12:00:00Z")).toBe("inactive"); // Years ago
    });

    it("should return inactive for null date", () => {
      expect(getActivityStatus(null)).toBe("inactive");
    });
  });

  describe("getActivityStyle", () => {
    it("should return correct styles for active status", () => {
      const style = getActivityStyle("active");

      expect(style.status).toBe("active");
      expect(style.label).toBe("Active");
      expect(style.dotClass).toContain("success");
      expect(style.textClass).toContain("success");
      expect(style.pulse).toBe(true);
    });

    it("should return correct styles for recent status", () => {
      const style = getActivityStyle("recent");

      expect(style.status).toBe("recent");
      expect(style.label).toBe("Recent");
      expect(style.dotClass).toContain("warning");
      expect(style.textClass).toContain("warning");
      expect(style.pulse).toBe(false);
    });

    it("should return correct styles for inactive status", () => {
      const style = getActivityStyle("inactive");

      expect(style.status).toBe("inactive");
      expect(style.label).toBe("Inactive");
      expect(style.dotClass).toContain("muted");
      expect(style.textClass).toContain("muted");
      expect(style.pulse).toBe(false);
    });
  });

  describe("formatActivePeriod", () => {
    it("should format date range with different months and years", () => {
      const first = "2023-01-15T00:00:00Z";
      const last = "2024-11-20T00:00:00Z";

      const result = formatActivePeriod(first, last);

      expect(result).toBe("Jan 2023 - Nov 2024");
    });

    it("should format date range within same year", () => {
      const first = "2024-01-15T00:00:00Z";
      const last = "2024-06-20T00:00:00Z";

      const result = formatActivePeriod(first, last);

      expect(result).toBe("Jan 2024 - Jun 2024");
    });

    it("should handle same month and year", () => {
      const first = "2024-11-01T00:00:00Z";
      const last = "2024-11-15T00:00:00Z";

      const result = formatActivePeriod(first, last);

      // When dates are in the same month/year, should show only once
      expect(result).toBe("Nov 2024");
    });

    it("should handle Date objects", () => {
      const first = new Date("2023-03-10T00:00:00Z");
      const last = new Date("2024-09-25T00:00:00Z");

      const result = formatActivePeriod(first, last);

      expect(result).toBe("Mar 2023 - Sep 2024");
    });

    it("should return 'No activity' for null first date", () => {
      expect(formatActivePeriod(null, "2024-11-17T00:00:00Z")).toBe("No activity");
    });

    it("should return 'No activity' for null last date", () => {
      expect(formatActivePeriod("2024-01-01T00:00:00Z", null)).toBe("No activity");
    });

    it("should return 'No activity' for both null dates", () => {
      expect(formatActivePeriod(null, null)).toBe("No activity");
    });

    it("should handle year-long project", () => {
      const first = "2024-01-01T00:00:00Z";
      const last = "2024-12-31T00:00:00Z";

      const result = formatActivePeriod(first, last);

      expect(result).toBe("Jan 2024 - Dec 2024");
    });

    it("should format multi-year project correctly", () => {
      const first = "2020-06-15T00:00:00Z";
      const last = "2024-11-17T00:00:00Z";

      const result = formatActivePeriod(first, last);

      expect(result).toBe("Jun 2020 - Nov 2024");
    });
  });

  describe("calculateContributionPercent", () => {
    it("should calculate percentage correctly", () => {
      expect(calculateContributionPercent(50, 100)).toBe(50);
      expect(calculateContributionPercent(75, 100)).toBe(75);
      expect(calculateContributionPercent(1, 4)).toBe(25);
    });

    it("should round to nearest integer", () => {
      expect(calculateContributionPercent(33, 100)).toBe(33);
      expect(calculateContributionPercent(67, 100)).toBe(67);
    });

    it("should cap at 100% for data inconsistencies", () => {
      // Edge case: user has more commits than total (data inconsistency)
      expect(calculateContributionPercent(150, 100)).toBe(100);
    });

    it("should return 100% when totalCommits is undefined", () => {
      // Assume user is sole contributor
      expect(calculateContributionPercent(50, undefined)).toBe(100);
    });

    it("should return 100% when totalCommits is null", () => {
      expect(calculateContributionPercent(50, null)).toBe(100);
    });

    it("should return 0% when user has no commits", () => {
      expect(calculateContributionPercent(0, 100)).toBe(0);
      expect(calculateContributionPercent(0, undefined)).toBe(0);
    });

    it("should return 100% when totalCommits is 0 but user has commits", () => {
      // Edge case: data inconsistency
      expect(calculateContributionPercent(50, 0)).toBe(100);
    });

    it("should handle small percentages correctly", () => {
      expect(calculateContributionPercent(1, 1000)).toBe(0); // Rounds to 0
      expect(calculateContributionPercent(5, 1000)).toBe(1); // Rounds to 1
    });
  });

  describe("Type consistency", () => {
    it("should return consistent ContributionLevel types", () => {
      const levels: ContributionLevel[] = ["owner", "maintainer", "contributor", "minor"];

      levels.forEach((level) => {
        const threshold = level === "owner" ? 80 : level === "maintainer" ? 50 : level === "contributor" ? 20 : 0;
        const result = getContributionLevel(threshold);
        expect(result).toBe(level);
      });
    });

    it("should return consistent ActivityStatus types", () => {
      const statuses: ActivityStatus[] = ["active", "recent", "inactive"];

      statuses.forEach((status) => {
        const style = getActivityStyle(status);
        expect(style.status).toBe(status);
      });
    });
  });
});
