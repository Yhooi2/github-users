import { useQuery, gql } from "@apollo/client"
import { useMemo } from "react"
import { getQueryDates, getAllYearRanges, validateCreatedAt } from "./date-helpers";
import { createDynamicUserQuery } from "./queriers";
import type { GitHubGraphQLResponse } from "./github-api.types";
import { useQueryUserCreatedAt } from "./useQueryUserCreatedAt";

// Фиктивный запрос для случая пропуска
const EMPTY_QUERY = gql`
  query EmptyQuery {
    __typename
  }
`;

// Тип возвращаемого значения хука
export type UseQueryUserResult = {
  data?: GitHubGraphQLResponse;
  loading: boolean;
  error?: any;
  createdAt?: string;
  refetch: () => void;
  networkStatus: number;
};

function useQueryUser(login: string, daysBack: number = 365): UseQueryUserResult {
  // Предварительный запрос для получения даты создания
  const { data: createdAtData, loading: loadingCreatedAt, error: errorCreatedAt, refetch: refetchCreatedAt } =
    useQueryUserCreatedAt(login);
  
  const createdAt = createdAtData?.user?.createdAt;

  // Основной запрос с использованием реальной даты создания
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
      
      // Получаем все годовые диапазоны на основе реальной даты создания
      const allYearRanges = getAllYearRanges(createdAt, currentDate);
      
      // Вычисляем количество полных лет с момента создания аккаунта
      const startYear = createdAtDate.getFullYear();
      const currentYear = currentDate.getFullYear();
      
      // Создаем динамический запрос со всеми годами
      const dynamicQuery = createDynamicUserQuery(startYear, currentYear);
      
      const queryVariables: Record<string, any> = {
        login,
        from: queryDates.from,
        to: queryDates.to,
      };
      
      // Формируем переменные для каждого года
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
    fetchPolicy: 'cache-first' // Используем кэширование
  });

  return {
    ...mainQuery,
    loading: loadingCreatedAt || mainQuery.loading,
    error: errorCreatedAt || mainQuery.error,
    createdAt, // Возвращаем дату создания для использования в компонентах
    refetch: () => {
      refetchCreatedAt();
      mainQuery.refetch();
    }
  };
};

export default useQueryUser
