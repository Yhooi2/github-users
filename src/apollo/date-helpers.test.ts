import { describe, it, expect } from 'vitest'
import { formatDate, getThreeYearRanges, getQueryDates } from './date-helpers'

describe('date-helpers', () => {
  describe('formatDate', () => {
    it('formats date to ISO string', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      const result = formatDate(date)

      expect(result).toBe('2024-01-15T12:00:00.000Z')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })

    it('handles leap year dates', () => {
      const date = new Date('2024-02-29T00:00:00Z')
      const result = formatDate(date)

      expect(result).toBe('2024-02-29T00:00:00.000Z')
    })

    it('handles end of year date', () => {
      const date = new Date('2024-12-31T23:59:59Z')
      const result = formatDate(date)

      expect(result).toContain('2024-12-31')
    })
  })

  describe('getThreeYearRanges', () => {
    it('returns correct year ranges for 2024', () => {
      const testDate = new Date('2024-06-15T12:00:00Z')
      const currentYear = testDate.getFullYear()
      const ranges = getThreeYearRanges(testDate)

      // Year 1: currentYear - 2
      const year1From = new Date(ranges.year1.from)
      const year1To = new Date(ranges.year1.to)
      expect(year1From.getFullYear()).toBe(currentYear - 2)
      expect(year1From.getMonth()).toBe(0) // January
      expect(year1From.getDate()).toBe(1)
      expect(year1To.getFullYear()).toBe(currentYear - 2)
      expect(year1To.getMonth()).toBe(11) // December

      // Year 2: currentYear - 1
      const year2From = new Date(ranges.year2.from)
      const year2To = new Date(ranges.year2.to)
      expect(year2From.getFullYear()).toBe(currentYear - 1)
      expect(year2From.getMonth()).toBe(0)
      expect(year2To.getFullYear()).toBe(currentYear - 1)
      expect(year2To.getMonth()).toBe(11)

      // Year 3: currentYear (up to current date)
      const year3From = new Date(ranges.year3.from)
      expect(year3From.getFullYear()).toBe(currentYear)
      expect(year3From.getMonth()).toBe(0)
      expect(ranges.year3.to).toBe(testDate.toISOString())
    })

    it('returns correct year ranges for 2025', () => {
      const testDate = new Date('2025-03-10T12:00:00Z')
      const currentYear = testDate.getFullYear()
      const ranges = getThreeYearRanges(testDate)

      const year1From = new Date(ranges.year1.from)
      const year2From = new Date(ranges.year2.from)
      const year3From = new Date(ranges.year3.from)

      expect(year1From.getFullYear()).toBe(currentYear - 2)
      expect(year2From.getFullYear()).toBe(currentYear - 1)
      expect(year3From.getFullYear()).toBe(currentYear)
    })

    it('year3.to is current date', () => {
      const testDate = new Date('2024-11-03T10:30:00Z')
      const ranges = getThreeYearRanges(testDate)

      expect(ranges.year3.to).toBe(testDate.toISOString())
    })

    it('uses current date when no date provided', () => {
      const beforeCall = new Date()
      const ranges = getThreeYearRanges()
      const afterCall = new Date()

      const year3To = new Date(ranges.year3.to)
      expect(year3To.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime())
      expect(year3To.getTime()).toBeLessThanOrEqual(afterCall.getTime())
    })

    it('all year ranges are in ISO format', () => {
      const testDate = new Date('2024-06-15T12:00:00Z')
      const ranges = getThreeYearRanges(testDate)

      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

      expect(ranges.year1.from).toMatch(isoRegex)
      expect(ranges.year1.to).toMatch(isoRegex)
      expect(ranges.year2.from).toMatch(isoRegex)
      expect(ranges.year2.to).toMatch(isoRegex)
      expect(ranges.year3.from).toMatch(isoRegex)
      expect(ranges.year3.to).toMatch(isoRegex)
    })
  })

  describe('getQueryDates', () => {
    it('returns dates for last 365 days by default', () => {
      const testDate = new Date('2024-06-15T12:00:00Z')
      const dates = getQueryDates(365, testDate)

      const from = new Date(dates.from)
      const to = new Date(dates.to)

      expect(to.toISOString()).toBe(testDate.toISOString())

      // Check that from is 365 days before to
      const daysDiff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
      expect(daysDiff).toBe(365)
    })

    it('returns dates for custom days back', () => {
      const testDate = new Date('2024-06-15T12:00:00Z')
      const dates = getQueryDates(30, testDate)

      const from = new Date(dates.from)
      const to = new Date(dates.to)

      const daysDiff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
      expect(daysDiff).toBe(30)
    })

    it('returns dates for last 7 days', () => {
      const testDate = new Date('2024-06-15T12:00:00Z')
      const dates = getQueryDates(7, testDate)

      const from = new Date(dates.from)
      const to = new Date(dates.to)

      const daysDiff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
      expect(daysDiff).toBe(7)
    })

    it('returns dates in ISO format', () => {
      const testDate = new Date('2024-06-15T12:00:00Z')
      const dates = getQueryDates(365, testDate)

      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      expect(dates.from).toMatch(isoRegex)
      expect(dates.to).toMatch(isoRegex)
    })

    it('to date equals provided current date', () => {
      const testDate = new Date('2024-11-03T14:25:30Z')
      const dates = getQueryDates(365, testDate)

      expect(dates.to).toBe(testDate.toISOString())
    })

    it('uses current date when no date provided', () => {
      const beforeCall = new Date()
      const dates = getQueryDates(365)
      const afterCall = new Date()

      const toDate = new Date(dates.to)
      expect(toDate.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime())
      expect(toDate.getTime()).toBeLessThanOrEqual(afterCall.getTime())
    })

    it('handles 0 days back', () => {
      const testDate = new Date('2024-06-15T12:00:00Z')
      const dates = getQueryDates(0, testDate)

      expect(dates.from).toBe(dates.to)
      expect(dates.to).toBe(testDate.toISOString())
    })

    it('handles 1 day back', () => {
      const testDate = new Date('2024-06-15T12:00:00Z')
      const dates = getQueryDates(1, testDate)

      const from = new Date(dates.from)
      const to = new Date(dates.to)

      const hoursDiff = (to.getTime() - from.getTime()) / (1000 * 60 * 60)
      expect(hoursDiff).toBe(24)
    })
  })
})
