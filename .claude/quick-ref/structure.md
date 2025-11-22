# Project Structure - Quick Reference

> **Purpose**: Overview of key folders and files  
> **For details**: See `docs/architecture.md`git-user-info/
> ├── api/ # Vercel serverless functions
> │ ├── github-proxy.ts # Main GitHub API proxy
> │ ├── auth/ # OAuth endpoints
> │ │ ├── login.ts # OAuth initiation
> │ │ ├── callback.ts # OAuth callback
> │ │ └── logout.ts # Session cleanup
> │ ├── user/ # User settings
> │ │ └── settings.ts
> │ └── analytics/ # Analytics endpoints
> │ └── oauth-usage.ts
> ├── src/
> │ ├── apollo/ # Apollo Client setup
> │ │ ├── ApolloAppProvider.tsx # Client configuration
> │ │ ├── useQueryUser.ts # Main query hook
> │ │ ├── queriers.ts # GraphQL queries
> │ │ ├── date-helpers.ts # Date utilities
> │ │ └── github-api.types.ts # TypeScript types
> │ ├── components/ # React components (10 folders)
> │ │ ├── assessment/ # MetricCard, QuickAssessment, Modal
> │ │ ├── auth/ # AuthRequiredModal
> │ │ ├── layout/ # EmptyState, LoadingState, UserMenu, etc.
> │ │ ├── projects/ # ProjectSection
> │ │ ├── repository/ # RepositoryCard, List, Table, Filters
> │ │ ├── statistics/ # StatsOverview, Charts
> │ │ ├── timeline/ # ActivityTimeline, TimelineYear
> │ │ ├── ui/ # shadcn/ui components (18+)
> │ │ ├── user/ # UserHeader, UserStats, UserAuthenticity
> │ │ └── analytics/ # OAuthMetricsDashboard
> │ ├── hooks/ # Custom React hooks
> │ │ ├── useAuthenticityScore.ts
> │ │ ├── useRepositoryFilters.ts
> │ │ ├── useRepositorySorting.ts
> │ │ └── useUserAnalytics.ts
> │ ├── lib/ # Utilities and business logic
> │ │ ├── metrics/ # 4 metrics calculations
> │ │ │ ├── activity.ts
> │ │ │ ├── impact.ts
> │ │ │ ├── quality.ts
> │ │ │ └── growth.ts
> │ │ ├── authenticity.ts # Authenticity calculations
> │ │ ├── statistics.ts # Statistical functions
> │ │ ├── repository-filters.ts # Filter logic
> │ │ └── date-utils.ts # Date utilities
> │ ├── types/ # TypeScript types
> │ │ ├── metrics.ts
> │ │ └── filters.ts
> │ ├── test/ # Test utilities and mocks
> │ ├── App.tsx # Main app component
> │ └── main.tsx # Entry point
> ├── e2e/ # Playwright E2E tests (10 files)
> ├── docs/ # Documentation
> │ ├── phases/ # Phase documentation (8 files)
> │ └── \*.md # Various guides
> └── .storybook/ # Storybook configuration
