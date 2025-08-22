# Refactoring Plan for GitHub User Statistics

## Current State
- The application currently fetches contribution data for only the last 3 years
- The ContributionsChart component already calculates all years from account creation
- GraphQL query structure supports dynamic year queries but is limited to 3 years

## Problems to Solve
1. Query limitation to 3 years
2. Need to fetch data for all years since account creation
3. Potential performance implications with many years of data

## Proposed Changes

### 1. Update Query Generation (queriers.ts)
- Remove hardcoded year count in `createDynamicUserQuery`
- Add function to calculate required year range based on user creation date
- Modify query generation to handle variable number of years
- Add error handling for edge cases

### 2. Update Data Fetching (useQueryUser.ts)
- Add preliminary query to fetch user creation date first
- Calculate required year range based on creation date
- Generate appropriate variables for each year's query
- Implement batching if needed for users with many years of history

### 3. Update Types (github-api.types.ts)
- Modify types to support dynamic year contributions
- Add utility types for year-based data structures
- Update type guards for contribution data

### 4. Enhance ContributionsChart Component
- Add loading states for data fetching
- Implement data visualization optimizations for many years
- Add year range selection/filtering capabilities
- Consider implementing virtual scrolling for many years of data

## Implementation Steps

1. **Preliminary Changes**
   - Create utility function to calculate year ranges
   - Update GraphQL types for dynamic year support
   - Add configuration for maximum concurrent year queries

2. **Query Updates**
   ```typescript
   // Example structure
   export const calculateYearRanges = (createdAt: string) => {
     const startYear = new Date(createdAt).getFullYear();
     const currentYear = new Date().getFullYear();
     return { startYear, currentYear, totalYears: currentYear - startYear + 1 };
   };
   ```

3. **Data Fetching Logic**
   - Implement two-step query process:
     1. Fetch user creation date
     2. Generate and execute contribution queries for all years

4. **UI Updates**
   - Add loading states for year data
   - Implement progressive loading for performance
   - Add year range filters

## Potential Challenges

1. **Performance**
   - Many simultaneous GraphQL queries for users with long history
   - Large data sets in the UI
   - Solution: Implement batching and progressive loading

2. **Rate Limiting**
   - GitHub API rate limits for many queries
   - Solution: Implement query batching and caching

3. **UI Responsiveness**
   - Handling many years of data in charts
   - Solution: Virtual scrolling and data windowing

## Testing Plan

1. Test with accounts of varying ages:
   - New accounts (< 1 year)
   - Medium-age accounts (1-5 years)
   - Old accounts (5+ years)

2. Test error cases:
   - API rate limiting
   - Network failures
   - Invalid dates

## Next Steps

1. Implement utility functions for year calculations
2. Update GraphQL query generation
3. Modify data fetching logic
4. Update UI components
5. Add tests
6. Performance optimization
