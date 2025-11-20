import { GET_USER_INFO } from "@/apollo/queriers";
import { MockedProvider } from "@apollo/client/testing";
import type { Meta, StoryObj } from "@storybook/react-vite";
import UserProfile from "./UserProfile";

const meta: Meta<typeof UserProfile> = {
  title: "Components/UserProfile",
  component: UserProfile,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[600px] p-5">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Success mock with variableMatcher
const successMock = {
  request: {
    query: GET_USER_INFO,
  },
  variableMatcher: () => true,
  result: {
    data: {
      user: {
        id: "MDQ6VXNlcjU4MzIzMQ==",
        login: "octocat",
        name: "The Octocat",
        avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
        bio: "GitHub mascot and leader of the Octocat community",
        url: "https://github.com/octocat",
        location: "San Francisco, CA",
        followers: {
          totalCount: 10523,
          __typename: "FollowerConnection",
        },
        following: {
          totalCount: 9,
          __typename: "FollowingConnection",
        },
        gists: {
          totalCount: 8,
          __typename: "GistConnection",
        },
        year1: {
          totalCommitContributions: 1250,
          __typename: "ContributionsCollection",
        },
        year2: {
          totalCommitContributions: 1876,
          __typename: "ContributionsCollection",
        },
        year3: {
          totalCommitContributions: 342,
          __typename: "ContributionsCollection",
        },
        createdAt: "2011-01-25T18:44:36Z",
        contributionsCollection: {
          totalCommitContributions: 342,
          commitContributionsByRepository: [
            {
              contributions: {
                totalCount: 150,
                __typename: "CreatedCommitContributionConnection",
              },
              repository: {
                name: "Hello-World",
                __typename: "Repository",
              },
              __typename: "CommitContributionsByRepository",
            },
            {
              contributions: {
                totalCount: 92,
                __typename: "CreatedCommitContributionConnection",
              },
              repository: {
                name: "Spoon-Knife",
                __typename: "Repository",
              },
              __typename: "CommitContributionsByRepository",
            },
          ],
          __typename: "ContributionsCollection",
        },
        repositories: {
          totalCount: 8,
          pageInfo: {
            endCursor: "Y3Vyc29yOnYyOpHOAEPssg==",
            hasNextPage: false,
            __typename: "PageInfo",
          },
          __typename: "RepositoryConnection",
          nodes: [
            {
              id: "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
              name: "Hello-World",
              description: "My first repository on GitHub!",
              forkCount: 2500,
              stargazerCount: 2135,
              url: "https://github.com/octocat/Hello-World",
              defaultBranchRef: {
                target: {
                  history: {
                    totalCount: 250,
                    __typename: "CommitHistoryConnection",
                  },
                  __typename: "Commit",
                },
                __typename: "Ref",
              },
              primaryLanguage: {
                name: "JavaScript",
                __typename: "Language",
              },
              languages: {
                totalSize: 125000,
                edges: [
                  {
                    size: 100000,
                    node: {
                      name: "JavaScript",
                      __typename: "Language",
                    },
                    __typename: "LanguageEdge",
                  },
                  {
                    size: 25000,
                    node: {
                      name: "TypeScript",
                      __typename: "Language",
                    },
                    __typename: "LanguageEdge",
                  },
                ],
                __typename: "LanguageConnection",
              },
              __typename: "Repository",
            },
            {
              id: "MDEwOlJlcG9zaXRvcnkxMzAwMjc1",
              name: "Spoon-Knife",
              description: "This repo is for demonstration purposes only.",
              forkCount: 15000,
              stargazerCount: 12800,
              url: "https://github.com/octocat/Spoon-Knife",
              defaultBranchRef: {
                target: {
                  history: {
                    totalCount: 180,
                    __typename: "CommitHistoryConnection",
                  },
                  __typename: "Commit",
                },
                __typename: "Ref",
              },
              primaryLanguage: {
                name: "HTML",
                __typename: "Language",
              },
              languages: {
                totalSize: 8500,
                edges: [
                  {
                    size: 8000,
                    node: {
                      name: "HTML",
                      __typename: "Language",
                    },
                    __typename: "LanguageEdge",
                  },
                  {
                    size: 500,
                    node: {
                      name: "CSS",
                      __typename: "Language",
                    },
                    __typename: "LanguageEdge",
                  },
                ],
                __typename: "LanguageConnection",
              },
              __typename: "Repository",
            },
          ],
        },
        __typename: "User",
      },
    },
  },
};

// Not found mock
const notFoundMock = {
  request: {
    query: GET_USER_INFO,
  },
  variableMatcher: () => true,
  result: {
    data: {
      user: null,
    },
  },
};

// Error mock
const errorMock = {
  request: {
    query: GET_USER_INFO,
  },
  variableMatcher: () => true,
  error: new Error("Network error: Unable to connect to GitHub API"),
};

// Loading mock with delay
const loadingMock = {
  request: {
    query: GET_USER_INFO,
  },
  variableMatcher: () => true,
  delay: 30000, // 30 second delay to show loading state
  result: {
    data: {
      user: {
        id: "MDQ6VXNlcjU4MzIzMQ==",
        login: "octocat",
        name: "The Octocat",
        avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
        bio: "GitHub mascot and leader of the Octocat community",
        url: "https://github.com/octocat",
        location: "San Francisco, CA",
        followers: {
          totalCount: 10523,
          __typename: "FollowerConnection",
        },
        following: {
          totalCount: 9,
          __typename: "FollowingConnection",
        },
        gists: {
          totalCount: 8,
          __typename: "GistConnection",
        },
        year1: {
          totalCommitContributions: 1250,
          __typename: "ContributionsCollection",
        },
        year2: {
          totalCommitContributions: 1876,
          __typename: "ContributionsCollection",
        },
        year3: {
          totalCommitContributions: 342,
          __typename: "ContributionsCollection",
        },
        createdAt: "2011-01-25T18:44:36Z",
        contributionsCollection: {
          totalCommitContributions: 342,
          commitContributionsByRepository: [],
          __typename: "ContributionsCollection",
        },
        repositories: {
          totalCount: 8,
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
            __typename: "PageInfo",
          },
          __typename: "RepositoryConnection",
          nodes: [],
        },
        __typename: "User",
      },
    },
  },
};

// Loading state story
export const Loading: Story = {
  render: () => (
    <MockedProvider mocks={[loadingMock]}>
      <UserProfile userName="octocat" />
    </MockedProvider>
  ),
};

// Success state with full data
export const Success: Story = {
  render: () => (
    <MockedProvider mocks={[successMock]}>
      <UserProfile userName="octocat" />
    </MockedProvider>
  ),
};

// User not found state
export const UserNotFound: Story = {
  render: () => (
    <MockedProvider mocks={[notFoundMock]}>
      <UserProfile userName="nonexistentuser12345" />
    </MockedProvider>
  ),
};

// Error state
export const ErrorState: Story = {
  render: () => (
    <MockedProvider mocks={[errorMock]}>
      <UserProfile userName="erroruser" />
    </MockedProvider>
  ),
};

// Empty username (skipped query)
export const EmptyUsername: Story = {
  render: () => (
    <MockedProvider mocks={[]}>
      <UserProfile userName="" />
    </MockedProvider>
  ),
};
