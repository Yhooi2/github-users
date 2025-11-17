import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateYearRanges,
  formatDate,
  getYear,
  isCurrentYear,
  type YearRange,
} from './date-utils'

describe('date-utils', () => {
  describe('generateYearRanges', () => {
    beforeEach(() => {
      // Mock current date to 2025-11-17 for consistent tests
      vi.setSystemTime(new Date('2025-11-17T12:00:00Z'))
    })

    it('generates ranges from creation to now', () => {
      const ranges = generateYearRanges('2022-01-15T00:00:00Z')

      expect(ranges.length).toBe(4) // 2022, 2023, 2024, 2025
      expect(ranges[0].year).toBe(2022)
      expect(ranges[ranges.length - 1].year).toBe(2025)
    })

    it('handles current year correctly', () => {
      const ranges = generateYearRanges('2025-01-01T00:00:00Z')
      const currentYear = ranges.find((r) => r.year === 2025)

      expect(currentYear).toBeDefined()
      expect(currentYear!.year).toBe(2025)
      expect(new Date(currentYear!.from).getMonth()).toBe(0) // January
      expect(new Date(currentYear!.to).getFullYear()).toBe(2025)
      // Current year 'to' should be now, not Dec 31
      expect(new Date(currentYear!.to).getMonth()).toBe(10) // November
    })

    it('handles accounts older than 10 years', () => {
      const ranges = generateYearRanges('2010-01-01T00:00:00Z')

      expect(ranges.length).toBe(16) // 2010-2025
      expect(ranges[0].year).toBe(2010)
      expect(ranges[ranges.length - 1].year).toBe(2025)
    })

    it('handles account created in current year', () => {
      const ranges = generateYearRanges('2025-06-15T00:00:00Z')

      expect(ranges.length).toBe(1)
      expect(ranges[0].year).toBe(2025)
    })

    it('generates correct ISO date strings', () => {
      const ranges = generateYearRanges('2023-01-01T00:00:00Z')

      ranges.forEach((range) => {
        expect(range.from).toMatch(/^\d{4}-\d{2}-\d{2}T/)
        expect(range.to).toMatch(/^\d{4}-\d{2}-\d{2}T/)
        expect(() => new Date(range.from)).not.toThrow()
        expect(() => new Date(range.to)).not.toThrow()
      })
    })

    it('generates correct labels', () => {
      const ranges = generateYearRanges('2022-01-01T00:00:00Z')

      expect(ranges[0].label).toBe('2022')
      expect(ranges[1].label).toBe('2023')
      expect(ranges[2].label).toBe('2024')
      expect(ranges[3].label).toBe('2025')
    })

    it('sets from date to January 1st for each year', () => {
      const ranges = generateYearRanges('2022-06-15T00:00:00Z')

      ranges.forEach((range) => {
        const fromDate = new Date(range.from)
        expect(fromDate.getMonth()).toBe(0) // January
        expect(fromDate.getDate()).toBe(1)
      })
    })

    it('sets to date to December 31st for past years', () => {
      const ranges = generateYearRanges('2022-01-01T00:00:00Z')
      const pastYears = ranges.filter((r) => r.year < 2025)

      pastYears.forEach((range) => {
        const toDate = new Date(range.to)
        expect(toDate.getMonth()).toBe(11) // December
        expect(toDate.getDate()).toBe(31)
      })
    })

    it('handles account created mid-year', () => {
      const ranges = generateYearRanges('2022-07-15T14:30:00Z')

      // Should still start from Jan 1 of creation year
      const firstYear = ranges[0]
      expect(firstYear.year).toBe(2022)
      expect(new Date(firstYear.from).getMonth()).toBe(0) // January
    })

    it('returns empty array for invalid date', () => {
      const ranges = generateYearRanges('invalid-date')
      expect(ranges).toEqual([])
    })

    it('handles leap years correctly', () => {
      const ranges = generateYearRanges('2024-01-01T00:00:00Z')
      const year2024 = ranges.find((r) => r.year === 2024)

      expect(year2024).toBeDefined()
      // 2024 is a leap year, but our logic uses Dec 31 regardless
      const toDate = new Date(year2024!.to)
      expect(toDate.getDate()).toBe(31)
      expect(toDate.getMonth()).toBe(11)
    })
  })

  describe('formatDate', () => {
    it('formats ISO string to readable format', () => {
      const formatted = formatDate('2023-01-15T12:00:00Z')
      expect(formatted).toBe('Jan 15, 2023')
    })

    it('formats Date object to readable format', () => {
      const date = new Date('2024-03-20T08:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Mar 20, 2024/)
    })

    it('handles current date', () => {
      const now = new Date()
      const formatted = formatDate(now)
      expect(formatted).toMatch(/\w{3} \d{1,2}, \d{4}/)
    })

    it('handles different months', () => {
      expect(formatDate('2023-06-01T00:00:00Z')).toBe('Jun 1, 2023')
      expect(formatDate('2023-12-25T00:00:00Z')).toBe('Dec 25, 2023')
    })
  })

  describe('getYear', () => {
    it('extracts year from ISO string', () => {
      expect(getYear('2023-01-15T12:00:00Z')).toBe(2023)
      expect(getYear('2024-12-31T23:59:59Z')).toBe(2024)
    })

    it('handles different date formats', () => {
      expect(getYear('2022-06-15T00:00:00Z')).toBe(2022)
      expect(getYear('2025-01-01T00:00:00.000Z')).toBe(2025)
    })
  })

  describe('isCurrentYear', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2025-11-17T12:00:00Z'))
    })

    it('returns true for dates in current year', () => {
      expect(isCurrentYear('2025-01-01T00:00:00Z')).toBe(true)
      expect(isCurrentYear('2025-11-17T12:00:00Z')).toBe(true)
      expect(isCurrentYear('2025-12-31T23:59:59Z')).toBe(true)
    })

    it('returns false for dates in past years', () => {
      expect(isCurrentYear('2024-12-31T23:59:59Z')).toBe(false)
      expect(isCurrentYear('2020-01-01T00:00:00Z')).toBe(false)
    })

    it('handles Date objects', () => {
      expect(isCurrentYear(new Date('2025-06-15T00:00:00Z'))).toBe(true)
      expect(isCurrentYear(new Date('2024-06-15T00:00:00Z'))).toBe(false)
    })
  })

  describe('YearRange type', () => {
    it('should have correct structure', () => {
      const ranges = generateYearRanges('2023-01-01T00:00:00Z')
      const range: YearRange = ranges[0]

      expect(typeof range.year).toBe('number')
      expect(typeof range.from).toBe('string')
      expect(typeof range.to).toBe('string')
      expect(typeof range.label).toBe('string')
    })
  })
})
