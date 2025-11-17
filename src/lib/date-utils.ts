/**
 * Date utilities for GitHub user analytics
 * Generates year ranges for timeline data fetching
 */

export interface YearRange {
  year: number
  from: string
  to: string
  label: string
}

/**
 * Generate year ranges from account creation to now
 *
 * @param createdAt - ISO date string of account creation (e.g., "2015-03-15T12:00:00Z")
 * @returns Array of year ranges, each with year number, ISO date range, and label
 *
 * @example
 * const ranges = generateYearRanges('2022-01-15T00:00:00Z')
 * // Returns: [
 * //   { year: 2022, from: '2022-01-01T...', to: '2022-12-31T...', label: '2022' },
 * //   { year: 2023, from: '2023-01-01T...', to: '2023-12-31T...', label: '2023' },
 * //   { year: 2024, from: '2024-01-01T...', to: '2024-12-31T...', label: '2024' },
 * //   { year: 2025, from: '2025-01-01T...', to: '2025-11-17T...' (now), label: '2025' }
 * // ]
 */
export function generateYearRanges(createdAt: string): YearRange[] {
  const created = new Date(createdAt)

  // Validate date
  if (isNaN(created.getTime())) {
    return []
  }

  const now = new Date()

  const startYear = created.getFullYear()
  const currentYear = now.getFullYear()

  const ranges: YearRange[] = []

  for (let year = startYear; year <= currentYear; year++) {
    const from = new Date(year, 0, 1) // January 1st
    const to = year === currentYear
      ? now // Current date for current year
      : new Date(year, 11, 31, 23, 59, 59) // December 31st for past years

    ranges.push({
      year,
      from: from.toISOString(),
      to: to.toISOString(),
      label: year.toString(),
    })
  }

  return ranges
}

/**
 * Format date for display in UI
 *
 * @param date - ISO date string or Date object
 * @returns Formatted date string (e.g., "Jan 15, 2023")
 *
 * @example
 * formatDate('2023-01-15T12:00:00Z') // "Jan 15, 2023"
 * formatDate(new Date()) // "Nov 17, 2025"
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get year from ISO date string
 *
 * @param date - ISO date string
 * @returns Year number
 *
 * @example
 * getYear('2023-01-15T12:00:00Z') // 2023
 */
export function getYear(date: string): number {
  return new Date(date).getFullYear()
}

/**
 * Check if a date is in the current year
 *
 * @param date - ISO date string or Date object
 * @returns True if date is in current year
 *
 * @example
 * isCurrentYear('2025-01-15T12:00:00Z') // true (in 2025)
 * isCurrentYear('2024-01-15T12:00:00Z') // false
 */
export function isCurrentYear(date: string | Date): boolean {
  const year = new Date(date).getFullYear()
  const currentYear = new Date().getFullYear()
  return year === currentYear
}
