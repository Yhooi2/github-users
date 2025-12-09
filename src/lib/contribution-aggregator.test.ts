import { describe, expect, it } from "vitest";

import type { ContributionCalendar } from "@/apollo/queries/yearContributions";

import {
  aggregateByMonth,
  generateMiniChartData,
  getActivityLevel,
  getMostActiveMonth,
  getTotalFromMonthly,
} from "./contribution-aggregator";

describe("contribution-aggregator", () => {
  // Mock calendar data for testing
  const mockCalendar: ContributionCalendar = {
    totalContributions: 500,
    weeks: [
      {
        contributionDays: [
          { contributionCount: 5, date: "2025-01-15" },
          { contributionCount: 10, date: "2025-01-16" },
          { contributionCount: 0, date: "2025-02-01" },
          { contributionCount: 20, date: "2025-02-02" },
          { contributionCount: 15, date: "2025-03-10" },
        ],
      },
    ],
  };

  const emptyCalendar: ContributionCalendar = {
    totalContributions: 0,
    weeks: [],
  };

  describe("aggregateByMonth", () => {
    it("should return 12 months", () => {
      const result = aggregateByMonth(mockCalendar);
      expect(result).toHaveLength(12);
    });

    it("should aggregate contributions by month", () => {
      const result = aggregateByMonth(mockCalendar);

      // January: 5 + 10 = 15
      expect(result[0].month).toBe(1);
      expect(result[0].monthName).toBe("Jan");
      expect(result[0].contributions).toBe(15);

      // February: 0 + 20 = 20
      expect(result[1].month).toBe(2);
      expect(result[1].contributions).toBe(20);

      // March: 15
      expect(result[2].month).toBe(3);
      expect(result[2].contributions).toBe(15);
    });

    it("should count active days correctly", () => {
      const result = aggregateByMonth(mockCalendar);

      // January: 2 days with contributions
      expect(result[0].daysActive).toBe(2);

      // February: 1 day with contributions (0 doesn't count)
      expect(result[1].daysActive).toBe(1);
    });

    it("should track max daily contributions", () => {
      const result = aggregateByMonth(mockCalendar);

      // January max: 10
      expect(result[0].maxDaily).toBe(10);

      // February max: 20
      expect(result[1].maxDaily).toBe(20);
    });

    it("should handle empty calendar", () => {
      const result = aggregateByMonth(emptyCalendar);

      expect(result).toHaveLength(12);
      expect(result.every((m) => m.contributions === 0)).toBe(true);
      expect(result.every((m) => m.daysActive === 0)).toBe(true);
    });

    it("should have correct month names", () => {
      const result = aggregateByMonth(emptyCalendar);

      expect(result[0].monthName).toBe("Jan");
      expect(result[5].monthName).toBe("Jun");
      expect(result[11].monthName).toBe("Dec");
    });
  });

  describe("getActivityLevel", () => {
    it("should return 0 for no contributions", () => {
      expect(getActivityLevel(0, 100)).toBe(0);
    });

    it("should return 0 when maxMonthly is 0", () => {
      expect(getActivityLevel(10, 0)).toBe(0);
    });

    it("should return level 1 for < 25%", () => {
      expect(getActivityLevel(10, 100)).toBe(1);
      expect(getActivityLevel(24, 100)).toBe(1);
    });

    it("should return level 2 for 25-49%", () => {
      expect(getActivityLevel(25, 100)).toBe(2);
      expect(getActivityLevel(49, 100)).toBe(2);
    });

    it("should return level 3 for 50-74%", () => {
      expect(getActivityLevel(50, 100)).toBe(3);
      expect(getActivityLevel(74, 100)).toBe(3);
    });

    it("should return level 4 for >= 75%", () => {
      expect(getActivityLevel(75, 100)).toBe(4);
      expect(getActivityLevel(100, 100)).toBe(4);
    });
  });

  describe("generateMiniChartData", () => {
    it("should generate 12 data points", () => {
      const monthlyData = aggregateByMonth(mockCalendar);
      const chartData = generateMiniChartData(monthlyData);

      expect(chartData).toHaveLength(12);
    });

    it("should include month name, level, and contributions", () => {
      const monthlyData = aggregateByMonth(mockCalendar);
      const chartData = generateMiniChartData(monthlyData);

      expect(chartData[0]).toHaveProperty("month", "Jan");
      expect(chartData[0]).toHaveProperty("level");
      expect(chartData[0]).toHaveProperty("contributions");
    });

    it("should calculate levels relative to max month", () => {
      const monthlyData = aggregateByMonth(mockCalendar);
      const chartData = generateMiniChartData(monthlyData);

      // February has highest (20), should be level 4
      expect(chartData[1].level).toBe(4);

      // Months with 0 should be level 0
      expect(chartData[3].level).toBe(0); // April
    });

    it("should handle all-zero data", () => {
      const monthlyData = aggregateByMonth(emptyCalendar);
      const chartData = generateMiniChartData(monthlyData);

      expect(chartData.every((d) => d.level === 0)).toBe(true);
    });
  });

  describe("getMostActiveMonth", () => {
    it("should return the month with most contributions", () => {
      const monthlyData = aggregateByMonth(mockCalendar);
      const mostActive = getMostActiveMonth(monthlyData);

      expect(mostActive).not.toBeNull();
      expect(mostActive?.month).toBe(2); // February with 20
      expect(mostActive?.contributions).toBe(20);
    });

    it("should return null for empty array", () => {
      const result = getMostActiveMonth([]);
      expect(result).toBeNull();
    });
  });

  describe("getTotalFromMonthly", () => {
    it("should sum all monthly contributions", () => {
      const monthlyData = aggregateByMonth(mockCalendar);
      const total = getTotalFromMonthly(monthlyData);

      // 15 (Jan) + 20 (Feb) + 15 (Mar) = 50
      expect(total).toBe(50);
    });

    it("should return 0 for empty data", () => {
      const monthlyData = aggregateByMonth(emptyCalendar);
      const total = getTotalFromMonthly(monthlyData);

      expect(total).toBe(0);
    });
  });
});
