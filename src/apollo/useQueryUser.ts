import { useQuery, gql } from "@apollo/client"
import { useMemo } from "react"
import { getQueryDates, getAllYearRanges, validateCreatedAt } from "./date-helpers";
import { createDynamicUserQuery } from "./queriers";
import type { GitHubGraphQLResponse } from "./github-api.types";
import { useQueryUserCreatedAt } from "./useQueryUserCreatedAt";

// Dummy query for skip case
const EMPTY_QUERY = gql`
  query EmptyQuery {
    __typename
  }
`;

// Hook return type
export type UseQueryUserResult = {
  data?: GitHubGraphQLResponse;
  loading: boolean;
  error?: any;
  createdAt?: string;
  refetch: () => void;
  networkStatus: number;
};

function useQueryUser(login: string, daysBack: number = 365): UseQueryUserResult {
  // Pre-query to get account creation date
  const { data: createdAtData, loading: loadingCreatedAt, error: errorCreatedAt, refetch: refetchCreatedAt } =
    useQueryUserCreatedAt(login);
  
  const createdAt = createdAtData?.user?.createdAt;

  // Main query using actual creation date
  const { query, variables, skip } = useMemo(() => {
    if (!createdAt || !validateCreatedAt(createdAt)) {
      return {
        query: EMPTY_QUERY,
        variables: {},
        skip: true
      };
    }

    try {
      const queryDates = getQueryDates(daysBack);
      const currentDate = new Date();
      const createdAtDate = new Date(createdAt);
      
      // Get all year ranges based on actual creation date
      const allYearRanges = getAllYearRanges(createdAt, currentDate);
      
      // Calculate number of full years since account creation
      const startYear = createdAtDate.getFullYear();
      const currentYear = currentDate.getFullYear();
      
      // Create dynamic query for all years
      const dynamicQuery = createDynamicUserQuery(startYear, currentYear);
      
      const queryVariables: Record<string, any> = {
        login,
        from: queryDates.from,
        to: queryDates.to,
      };
      
      // Create variables for each year
      for (let year = startYear; year <= currentYear; year++) {
        const range = allYearRanges[year.toString()];
        queryVariables[`year${year}From`] = range.from;
        queryVariables[`year${year}To`] = range.to;
      };
      
      return {
        query: dynamicQuery,
        variables: queryVariables,
        skip: false
      };
    } catch (error) {
      console.error("Invalid createdAt date", error);
      return {
        query: EMPTY_QUERY,
        variables: {},
        skip: true
      };
    }
  }, [login, daysBack, createdAt]);
  
  const mainQuery = useQuery<GitHubGraphQLResponse>(query, {
    variables,
    skip: skip || !login,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first' // Using caching
  });

  return {
    ...mainQuery,
    loading: loadingCreatedAt || mainQuery.loading,
    error: errorCreatedAt || mainQuery.error,
    createdAt, // Return creation date for use in components
    refetch: () => {
      refetchCreatedAt();
      mainQuery.refetch();
    }
  };
};

export default useQueryUser
