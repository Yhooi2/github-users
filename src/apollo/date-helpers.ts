/**
 * Converts a Date object to ISO 8601 string format for GitHub GraphQL API
 *
 * @param date - The date to format
 * @returns ISO 8601 formatted string (e.g., "2024-01-15T10:30:00.000Z")
 * @example
 * ```typescript
 * formatDate(new Date('2024-01-15'))
 * // Returns: "2024-01-15T00:00:00.000Z"
 * ```
 */
export const formatDate = (date: Date): string => {
    return date.toISOString();
  };

  /**
   * Calculates date ranges for the last 3 calendar years for contribution tracking
   *
   * Returns three year ranges:
   * - year1: 2 years ago (full calendar year)
   * - year2: 1 year ago (full calendar year)
   * - year3: current year (from Jan 1 to current date)
   *
   * @param currentDate - Reference date for calculations (defaults to today)
   * @returns Object containing three year ranges with from/to ISO strings
   * @example
   * ```typescript
   * // On November 3, 2025:
   * getThreeYearRanges()
   * // Returns:
   * // {
   * //   year1: { from: "2023-01-01T00:00:00.000Z", to: "2023-12-31T23:59:59.000Z" },
   * //   year2: { from: "2024-01-01T00:00:00.000Z", to: "2024-12-31T23:59:59.000Z" },
   * //   year3: { from: "2025-01-01T00:00:00.000Z", to: "2025-11-03T12:00:00.000Z" }
   * // }
   * ```
   */
  export const getThreeYearRanges = (currentDate: Date = new Date()) => {
    const currentYear: number = currentDate.getFullYear();
    
    const year1: number = currentYear - 2;
    const year2: number = currentYear - 1; 
    const year3: number = currentYear;
    
    return {
      year1: {
        from: formatDate(new Date(year1, 0, 1)), // Jan 1
        to: formatDate(new Date(year1, 11, 31, 23, 59, 59)) // Dec 31
      },
      year2: {
        from: formatDate(new Date(year2, 0, 1)),
        to: formatDate(new Date(year2, 11, 31, 23, 59, 59))
      },
      year3: {
        from: formatDate(new Date(year3, 0, 1)),
        to: formatDate(currentDate) // up to today
      }
    };
  };

  /**
   * Calculates date range for querying GitHub contributions over a specified number of days
   *
   * @param daysBack - Number of days to go back from current date (defaults to 365)
   * @param currentDate - Reference date for calculations (defaults to today)
   * @returns Object with from/to ISO date strings
   * @example
   * ```typescript
   * // Get last 30 days
   * getQueryDates(30)
   * // Returns: { from: "2025-10-04T12:00:00.000Z", to: "2025-11-03T12:00:00.000Z" }
   *
   * // Get last year
   * getQueryDates(365)
   * // Returns: { from: "2024-11-03T12:00:00.000Z", to: "2025-11-03T12:00:00.000Z" }
   * ```
   */
  export const getQueryDates = (daysBack: number = 365, currentDate: Date = new Date()) => {
    const to: Date = currentDate;
    const from: Date = new Date(currentDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

    return {
      from: formatDate(from),
      to: formatDate(to)
    };
  };

  /**
   * Gets the actual year numbers for the three-year range
   *
   * @param currentDate - Reference date for calculations (defaults to today)
   * @returns Object containing year numbers for year1, year2, year3
   * @example
   * ```typescript
   * // On November 3, 2025:
   * getYearLabels()
   * // Returns: { year1: 2023, year2: 2024, year3: 2025 }
   * ```
   */
  export const getYearLabels = (currentDate: Date = new Date()) => {
    const currentYear: number = currentDate.getFullYear();

    return {
      year1: currentYear - 2,
      year2: currentYear - 1,
      year3: currentYear
    };
  };