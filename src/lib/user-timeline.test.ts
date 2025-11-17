/**
 * Integration Tests for User Timeline Generation
 *
 * Testing Philosophy: Focus on USER VALUE
 * - Test WHAT users need: accurate timelines from account creation
 * - NOT HOW it's implemented: ISO strings, UTC times, date formats
 *
 * User Value:
 * ✅ See complete GitHub history from account creation
 * ✅ Accurate year ranges for contribution tracking
 * ✅ Support for accounts of any age (new to 10+ years old)
 * ✅ Current year always includes today's contributions
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateYearRanges, formatDate, type YearRange } from './date-utils'

describe('User Timeline Generation', () => {
  beforeEach(() => {
    // Fix time for consistent testing
    vi.setSystemTime(new Date('2025-11-17T12:00:00Z'))
  })

  describe('Account History Scenarios', () => {
    it('should generate complete timeline from account creation to today', () => {
      // Arrange: User created account in 2022
      const accountCreatedAt = '2022-01-15T00:00:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)

      // Assert: Timeline covers all years from creation to now
      expect(timeline.length).toBe(4) // 2022, 2023, 2024, 2025
      expect(timeline[0].year).toBe(2022) // First year
      expect(timeline[timeline.length - 1].year).toBe(2025) // Current year
    })

    it('should support accounts older than 10 years', () => {
      // Arrange: User created account in 2010 (15 years ago)
      const accountCreatedAt = '2010-01-01T00:00:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)

      // Assert: Timeline includes all 16 years
      expect(timeline.length).toBe(16)
      expect(timeline[0].year).toBe(2010)
      expect(timeline[timeline.length - 1].year).toBe(2025)
    })

    it('should handle brand new accounts created this year', () => {
      // Arrange: User created account recently (6 months ago)
      const accountCreatedAt = '2025-06-15T00:00:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)

      // Assert: Timeline only shows current year
      expect(timeline.length).toBe(1)
      expect(timeline[0].year).toBe(2025)
    })

    it('should include current year even for today created accounts', () => {
      // Arrange: User just created account today
      const accountCreatedAt = '2025-11-17T09:00:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)

      // Assert: Current year is included
      expect(timeline.length).toBe(1)
      expect(timeline[0].year).toBe(2025)
    })
  })

  describe('Current Year Contribution Tracking', () => {
    it('should track contributions up to current moment for current year', () => {
      // Arrange: User created account in 2025
      const accountCreatedAt = '2025-01-01T00:00:00Z'

      // Act: Get current year range
      const timeline = generateYearRanges(accountCreatedAt)
      const currentYear = timeline.find((r) => r.year === 2025)

      // Assert: Current year tracks up to now (November 17)
      expect(currentYear).toBeDefined()
      const endDate = new Date(currentYear!.to)
      expect(endDate.getMonth()).toBe(10) // November (0-indexed)
      expect(endDate.getDate()).toBe(17)
    })

    it('should track full year for past years', () => {
      // Arrange: User with history spanning multiple years
      const accountCreatedAt = '2022-01-01T00:00:00Z'

      // Act: Get past year ranges
      const timeline = generateYearRanges(accountCreatedAt)
      const pastYears = timeline.filter((r) => r.year < 2025)

      // Assert: Past years track full 12 months
      pastYears.forEach((year) => {
        const endDate = new Date(year.to)
        expect(endDate.getMonth()).toBe(11) // December
        expect(endDate.getDate()).toBe(31) // Last day of year
      })
    })
  })

  describe('Data Integrity', () => {
    it('should generate valid date ranges for GraphQL API', () => {
      // Arrange: User account
      const accountCreatedAt = '2023-01-01T00:00:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)

      // Assert: All dates are valid ISO strings
      timeline.forEach((range) => {
        // Dates should be parseable
        expect(() => new Date(range.from)).not.toThrow()
        expect(() => new Date(range.to)).not.toThrow()

        // From date should be before to date
        expect(new Date(range.from).getTime()).toBeLessThan(
          new Date(range.to).getTime()
        )
      })
    })

    it('should maintain chronological order', () => {
      // Arrange: User account
      const accountCreatedAt = '2020-01-01T00:00:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)

      // Assert: Years are in ascending order
      for (let i = 1; i < timeline.length; i++) {
        expect(timeline[i].year).toBeGreaterThan(timeline[i - 1].year)
      }
    })
  })

  describe('Edge Cases - Error Handling', () => {
    it('should handle invalid date gracefully', () => {
      // Arrange: Invalid date input
      const invalidDate = 'invalid-date-string'

      // Act: Try to generate timeline
      const timeline = generateYearRanges(invalidDate)

      // Assert: Returns empty array instead of crashing
      expect(timeline).toEqual([])
    })

    it('should handle leap years correctly', () => {
      // Arrange: Account created in leap year
      const accountCreatedAt = '2024-01-01T00:00:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)
      const leapYear = timeline.find((r) => r.year === 2024)

      // Assert: Leap year is handled (full year still tracked)
      expect(leapYear).toBeDefined()
      expect(new Date(leapYear!.to).getMonth()).toBe(11) // December
      expect(new Date(leapYear!.to).getDate()).toBe(31)
    })

    it('should handle accounts created mid-year', () => {
      // Arrange: Account created in July (mid-year)
      const accountCreatedAt = '2022-07-15T14:30:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)
      const firstYear = timeline[0]

      // Assert: First year still starts from January (full year tracking)
      expect(firstYear.year).toBe(2022)
      expect(new Date(firstYear.from).getMonth()).toBe(0) // January
    })
  })

  describe('User-Facing Features', () => {
    it('should provide readable labels for UI display', () => {
      // Arrange: User account
      const accountCreatedAt = '2022-01-01T00:00:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)

      // Assert: Each year has a label
      expect(timeline[0].label).toBe('2022')
      expect(timeline[1].label).toBe('2023')
      expect(timeline[2].label).toBe('2024')
      expect(timeline[3].label).toBe('2025')
    })

    it('should format dates in human-readable format', () => {
      // Arrange: ISO date string
      const isoDate = '2023-01-15T12:00:00Z'

      // Act: Format for display
      const formatted = formatDate(isoDate)

      // Assert: Formatted as "Month Day, Year"
      expect(formatted).toBe('Jan 15, 2023')
    })

    it('should format Date objects for display', () => {
      // Arrange: Date object
      const date = new Date('2024-03-20T08:30:00Z')

      // Act: Format for display
      const formatted = formatDate(date)

      // Assert: Formatted consistently
      expect(formatted).toMatch(/Mar 20, 2024/)
    })
  })

  describe('Type Safety', () => {
    it('should return properly structured YearRange objects', () => {
      // Arrange: User account
      const accountCreatedAt = '2023-01-01T00:00:00Z'

      // Act: Generate timeline
      const timeline = generateYearRanges(accountCreatedAt)
      const range: YearRange = timeline[0]

      // Assert: All required fields exist with correct types
      expect(typeof range.year).toBe('number')
      expect(typeof range.from).toBe('string')
      expect(typeof range.to).toBe('string')
      expect(typeof range.label).toBe('string')
    })
  })
})
