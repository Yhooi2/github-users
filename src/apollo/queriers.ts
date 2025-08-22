import { gql } from "@apollo/client";

// GraphQL фрагменты для повторяющихся полей
const USER_BASIC_INFO_FRAGMENT = gql`
  fragment UserBasicInfo on User {
    id
    login
    name
    avatarUrl
    bio
    url
    location
    createdAt
  }
`;

const USER_CONNECTIONS_FRAGMENT = gql`
  fragment UserConnections on User {
    followers {
      totalCount
    }
    following {
      totalCount
    }
    gists {
      totalCount
    }
  }
`;

const CONTRIBUTIONS_COLLECTION_FRAGMENT = gql`
  fragment ContributionsCollection on ContributionsCollection {
    totalCommitContributions
    commitContributionsByRepository(maxRepositories: 100) {
      contributions {
        totalCount
      }
      repository {
        name
      }
    }
  }
`;

const REPOSITORY_LANGUAGES_FRAGMENT = gql`
  fragment RepositoryLanguages on Repository {
    languages(first: 5) {
      totalSize
      edges {
        size
        node {
          name
        }
      }
    }
  }
`;

const REPOSITORY_BASIC_INFO_FRAGMENT = gql`
  fragment RepositoryBasicInfo on Repository {
    id
    name
    description
    forkCount
    stargazerCount
    url
    primaryLanguage {
      name
    }
  }
`;

const REPOSITORY_COMMIT_HISTORY_FRAGMENT = gql`
  fragment RepositoryCommitHistory on Repository {
    defaultBranchRef {
      target {
        ... on Commit {
          history {
            totalCount
          }
        }
      }
    }
  }
`;

// Функция для создания динамического запроса с произвольным количеством годов
export const createDynamicUserQuery = (startYear: number, endYear: number) => {
  const yearCount = endYear - startYear + 1;
  
  // Создаем переменные для годов
  const yearVariables = Array.from({ length: yearCount }, (_, index) => {
    const year = startYear + index;
    return `$year${year}From: DateTime!, $year${year}To: DateTime!`;
  }).join(',\n    ');

  // Создаем поля для вкладов по годам
  const yearContributions = Array.from({ length: yearCount }, (_, index) => {
    const year = startYear + index;
    return `contrib${year}: contributionsCollection(from: $year${year}From, to: $year${year}To) {
        totalCommitContributions
      }`;
  }).join('\n      ');

  return gql`
    query GetUserDynamic($login: String!, 
      $from: DateTime!, 
      $to: DateTime!,
      ${yearVariables}
    ) {
      user(login: $login) {
        ...UserBasicInfo
        ...UserConnections
        ${yearContributions}
        contributionsCollection(from: $from, to: $to) {
          ...ContributionsCollection
        }
        repositories(first: 100, ownerAffiliations: [OWNER]) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            ...RepositoryBasicInfo
            ...RepositoryCommitHistory
            ...RepositoryLanguages
          }
        }
      }
    }
    ${USER_BASIC_INFO_FRAGMENT}
    ${USER_CONNECTIONS_FRAGMENT}
    ${CONTRIBUTIONS_COLLECTION_FRAGMENT}
    ${REPOSITORY_BASIC_INFO_FRAGMENT}
    ${REPOSITORY_COMMIT_HISTORY_FRAGMENT}
    ${REPOSITORY_LANGUAGES_FRAGMENT}
  `;
};

// Вспомогательная функция для получения года из даты
export const getYearFromDate = (date: string | Date): number => {
  return new Date(date).getFullYear();
};

// Функция для создания запроса на основе даты создания аккаунта
export const createUserQueryFromCreationDate = (createdAt: string | Date) => {
  const startYear = getYearFromDate(createdAt);
  const currentYear = new Date().getFullYear();
  return createDynamicUserQuery(startYear, currentYear);
};

// Временный запрос по умолчанию (будет заменен на динамический после обновления хука)
export const GET_USER_INFO = createDynamicUserQuery(new Date().getFullYear() - 2, new Date().getFullYear());

// Динамический запрос (будет использоваться после получения даты создания аккаунта)
export const GET_USER_INFO_DYNAMIC = GET_USER_INFO;