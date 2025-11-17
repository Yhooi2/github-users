# GitHub GraphQL API Documentation

## Overview

This document describes the GraphQL query used in the git-user-info application to fetch GitHub user data. The application uses a single comprehensive query (`GET_USER_INFO`) that retrieves profile information, contribution statistics, and repository data.

## API Endpoint

- **URL:** `https://api.github.com/graphql`
- **Method:** POST
- **Authentication:** Bearer token (GitHub Personal Access Token)
- **Content-Type:** `application/json`

## Query: GET_USER_INFO

### Query Structure

```graphql
query GetUser(
  $login: String!,
  $from: DateTime!,
  $to: DateTime!,
  $year1From: DateTime!,
  $year1To: DateTime!,
  $year2From: DateTime!,
  $year2To: DateTime!,
  $year3From: DateTime!,
  $year3To: DateTime!
)
```

### Query Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `$login` | String! | GitHub username to query | `"octocat"` |
| `$from` | DateTime! | Start date for main contribution period | `"2024-01-01T00:00:00Z"` |
| `$to` | DateTime! | End date for main contribution period | `"2024-12-31T23:59:59Z"` |
| `$year1From` | DateTime! | Start date for year 1 (current-2 years) | `"2023-01-01T00:00:00Z"` |
| `$year1To` | DateTime! | End date for year 1 | `"2023-12-31T23:59:59Z"` |
| `$year2From` | DateTime! | Start date for year 2 (current-1 year) | `"2024-01-01T00:00:00Z"` |
| `$year2To` | DateTime! | End date for year 2 | `"2024-12-31T23:59:59Z"` |
| `$year3From` | DateTime! | Start date for year 3 (current year) | `"2025-01-01T00:00:00Z"` |
| `$year3To` | DateTime! | End date for year 3 (up to today) | `"2025-11-03T00:00:00Z"` |

**Note:** Date variables are computed by `date-helpers.ts` functions:
- `getQueryDates(daysBack)` → `$from`, `$to`
- `getThreeYearRanges()` → `$year1From/To`, `$year2From/To`, `$year3From/To`

## Response Structure

### Root Object

```typescript
{
  user: GitHubUser | null
}
```

### User Object (GitHubUser)

#### Profile Fields

| Field | Type | Description | Nullable |
|-------|------|-------------|----------|
| `id` | ID | GitHub internal user ID | No |
| `login` | String | Username (e.g., "octocat") | No |
| `name` | String | Display name (e.g., "The Octocat") | Yes |
| `avatarUrl` | URI | Profile picture URL | No |
| `bio` | String | User biography/description | Yes |
| `url` | URI | GitHub profile URL | No |
| `location` | String | User's location | Yes |
| `createdAt` | DateTime | Account creation date | No |

#### Connection Counts

| Field | Type | Structure | Description |
|-------|------|-----------|-------------|
| `followers` | Connection | `{ totalCount: Int! }` | Number of followers |
| `following` | Connection | `{ totalCount: Int! }` | Number of users following |
| `gists` | Connection | `{ totalCount: Int! }` | Number of gists created |

#### Contribution Statistics

**Yearly Contributions (3 years):**

| Field | Type | Structure | Description |
|-------|------|-----------|-------------|
| `year1` | ContributionsCollection | `{ totalCommitContributions: Int! }` | Commits in year 1 (current-2) |
| `year2` | ContributionsCollection | `{ totalCommitContributions: Int! }` | Commits in year 2 (current-1) |
| `year3` | ContributionsCollection | `{ totalCommitContributions: Int! }` | Commits in year 3 (current) |

**Note:** Year aliases use generic names (`year1`, `year2`, `year3`). The actual year numbers are calculated dynamically by `getYearLabels()` in `date-helpers.ts`.

**Main Contribution Period:**

```typescript
contributionsCollection(from: $from, to: $to) {
  totalCommitContributions: Int!
  commitContributionsByRepository: [CommitContributionsByRepository!]!
}
```

**CommitContributionsByRepository Structure:**

```typescript
{
  contributions: {
    totalCount: Int!  // Number of commits in this repo
  }
  repository: {
    name: String!  // Repository name
  }
}
```

- **Max Repositories:** 100 (hardcoded in query)
- **Purpose:** Shows which repositories the user contributed to

#### Repositories

```typescript
repositories(first: 100, affiliations: OWNER) {
  totalCount: Int!
  pageInfo: {
    endCursor: String
    hasNextPage: Boolean!
  }
  nodes: [Repository!]!
}
```

**Repository Fields:**

| Field | Type | Description | Nullable |
|-------|------|-------------|----------|
| `id` | ID | Repository ID | No |
| `name` | String | Repository name | No |
| `description` | String | Repository description | Yes |
| `forkCount` | Int | Number of forks | No |
| `stargazerCount` | Int | Number of stars | No |
| `url` | URI | Repository URL | No |
| `defaultBranchRef` | Ref | Default branch reference | Yes |
| `primaryLanguage` | Language | Primary programming language | Yes |
| `languages` | LanguageConnection | All languages used (max 5) | No |

**DefaultBranchRef Structure:**

```typescript
defaultBranchRef {
  target {
    ... on Commit {
      history {
        totalCount: Int!  // Total commits in default branch
      }
    }
  }
}
```

**Language Information:**

```typescript
primaryLanguage {
  name: String!  // e.g., "TypeScript", "JavaScript"
}

languages(first: 5) {
  totalSize: Int!  // Total code size in bytes
  edges: [LanguageEdge!]!
}

LanguageEdge {
  size: Int!      // Size of this language in bytes
  node: {
    name: String!  // Language name
  }
}
```

## Example Request

```json
{
  "query": "query GetUser($login: String!, $from: DateTime!, ...) { ... }",
  "variables": {
    "login": "octocat",
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-12-31T23:59:59.999Z",
    "year1From": "2023-01-01T00:00:00.000Z",
    "year1To": "2023-12-31T23:59:59.999Z",
    "year2From": "2024-01-01T00:00:00.000Z",
    "year2To": "2024-12-31T23:59:59.999Z",
    "year3From": "2025-01-01T00:00:00.000Z",
    "year3To": "2025-11-03T12:00:00.000Z"
  }
}
```

## Example Response

```json
{
  "data": {
    "user": {
      "id": "MDQ6VXNlcjU4MzIzMQ==",
      "login": "octocat",
      "name": "The Octocat",
      "avatarUrl": "https://avatars.githubusercontent.com/u/583231?v=4",
      "bio": "GitHub mascot",
      "url": "https://github.com/octocat",
      "location": "San Francisco",
      "followers": {
        "totalCount": 10000
      },
      "following": {
        "totalCount": 5
      },
      "gists": {
        "totalCount": 8
      },
      "year1": {
        "totalCommitContributions": 1250
      },
      "year2": {
        "totalCommitContributions": 1500
      },
      "year3": {
        "totalCommitContributions": 342
      },
      "createdAt": "2011-01-25T18:44:36Z",
      "contributionsCollection": {
        "totalCommitContributions": 342,
        "commitContributionsByRepository": [
          {
            "contributions": {
              "totalCount": 150
            },
            "repository": {
              "name": "Hello-World"
            }
          }
        ]
      },
      "repositories": {
        "totalCount": 8,
        "pageInfo": {
          "endCursor": "Y3Vyc29yOnYyOpHOAEPssg==",
          "hasNextPage": false
        },
        "nodes": [
          {
            "id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
            "name": "Hello-World",
            "description": "My first repository on GitHub!",
            "forkCount": 2500,
            "stargazerCount": 2000,
            "url": "https://github.com/octocat/Hello-World",
            "defaultBranchRef": {
              "target": {
                "history": {
                  "totalCount": 250
                }
              }
            },
            "primaryLanguage": {
              "name": "JavaScript"
            },
            "languages": {
              "totalSize": 125000,
              "edges": [
                {
                  "size": 100000,
                  "node": {
                    "name": "JavaScript"
                  }
                },
                {
                  "size": 25000,
                  "node": {
                    "name": "TypeScript"
                  }
                }
              ]
            }
          }
        ]
      }
    }
  }
}
```

## Error Responses

### User Not Found

```json
{
  "data": {
    "user": null
  }
}
```

**Application Handling:** UserProfile component displays "User Not Found"

### Authentication Error

```json
{
  "errors": [
    {
      "type": "UNAUTHENTICATED",
      "message": "requires authentication",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

**Application Handling:**
1. errorLink catches the error
2. Checks `extensions.code === 'UNAUTHENTICATED'`
3. Clears token from localStorage
4. Displays toast notification

### Rate Limit Error

```json
{
  "errors": [
    {
      "type": "RATE_LIMITED",
      "message": "API rate limit exceeded"
    }
  ]
}
```

**Application Handling:**
- errorLink catches the error
- Displays toast notification
- No automatic retry (user must wait)

### Network Error (401)

**HTTP Status:** 401 Unauthorized

**Application Handling:**
1. errorLink catches networkError
2. Checks `networkError.statusCode === 401`
3. Clears token from localStorage
4. Displays toast notification

## Rate Limiting

### GitHub API Limits

| Authentication | Requests per hour | Notes |
|----------------|-------------------|-------|
| No token | 60 | Very limited |
| Personal Access Token | 5,000 | Recommended for development |
| OAuth App | 5,000 | Per user |
| GitHub App | 15,000 | Higher limit |

### Application Strategy

- **Token Required:** Application requires a valid token
- **No Client-side Rate Limiting:** Application doesn't track request count
- **Error Handling:** Displays error message if rate limit is hit
- **Recommendation:** Implement request debouncing to reduce API calls

## Pagination

### Current Implementation

- **Max Results:** 100 repositories per query
- **Pagination Support:** Query includes `pageInfo.endCursor` and `pageInfo.hasNextPage`
- **Current Limitation:** UI doesn't implement pagination (displays first 100 only)

### Future Enhancement

To implement pagination:

```graphql
repositories(first: 50, after: $cursor) {
  pageInfo {
    endCursor
    hasNextPage
  }
  nodes { ... }
}
```

Use `endCursor` from previous response as `$cursor` for next query.

## Performance Considerations

### Query Complexity

- **Fields Requested:** ~30 fields
- **Max Repositories:** 100
- **Max Languages per Repo:** 5
- **Max Commit Contributions:** 100 repos

**Estimated Response Size:** 50-200 KB (depending on repository count)

### Optimization Tips

1. **Reduce Repository Count:** Use `first: 50` instead of `first: 100`
2. **Remove Unused Fields:** If not displaying language data, remove `languages` field
3. **Implement Pagination:** Load repositories incrementally
4. **Cache Responses:** Apollo Client automatically caches (default: cache-first)

## Required Token Permissions

The GitHub Personal Access Token must have these scopes:

- `read:user` - Read user profile data
- `user:email` - Read user email addresses
- `repo` - Read public and private repository data (optional, if accessing private repos)

**Minimum Required:** `read:user` and `user:email`

## Authentication Setup

### Environment Variable

```bash
# .env.local
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

### localStorage (Fallback)

```javascript
localStorage.setItem('github_token', 'ghp_xxxxxxxxxxxxxxxxxxxx')
```

**Priority:** Environment variable takes precedence over localStorage

## API Documentation Links

- [GitHub GraphQL API Explorer](https://docs.github.com/en/graphql/overview/explorer)
- [GitHub GraphQL API Reference](https://docs.github.com/en/graphql/reference)
- [User Object Schema](https://docs.github.com/en/graphql/reference/objects#user)
- [Repository Object Schema](https://docs.github.com/en/graphql/reference/objects#repository)
- [Authentication Guide](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql#authenticating-with-graphql)

## Testing the Query

### Using GraphQL Explorer

1. Go to [GitHub GraphQL Explorer](https://docs.github.com/en/graphql/overview/explorer)
2. Copy the query from `src/apollo/queriers.ts`
3. Fill in variables in the Query Variables panel
4. Click "Play" to execute

### Using curl

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"query": "{ user(login: \"octocat\") { name } }"}' \
     https://api.github.com/graphql
```

## Troubleshooting

### Common Issues

**Issue:** "Field 'user' doesn't exist on type 'Query'"
- **Solution:** Check GitHub GraphQL API documentation for correct field names

**Issue:** "Variable $login of type String! was not provided"
- **Solution:** Ensure all required variables are passed in the request

**Issue:** "API rate limit exceeded"
- **Solution:** Wait for rate limit to reset or use a token with higher limits

**Issue:** "Could not resolve to a User with the login of 'xxx'"
- **Solution:** Username doesn't exist or is misspelled

**Issue:** Token expired or invalid
- **Solution:** Generate a new Personal Access Token on GitHub

## Data Usage in Application

### Currently Used Fields

- `user.name` - Displayed in UserProfile component

### Currently Unused Fields (Fetched but not displayed)

- `avatarUrl`, `bio`, `location`, `url`
- `followers`, `following`, `gists` counts
- `contrib2023`, `contrib2024`, `contrib2025`
- `contributionsCollection` detailed data
- `repositories` list

**Recommendation:** Expand UserProfile component to display this data or remove unused fields from query to reduce response size.
