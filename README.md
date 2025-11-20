# GitHub User Info

> Modern React application for searching and displaying GitHub user information via GraphQL API

[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/tests-1302%20passed-success)](./src)
[![Coverage](https://img.shields.io/badge/coverage-90.04%25-brightgreen)](./src)

## ✨ Features

### Core Features

- 🔍 **Search GitHub Users** - Find any public GitHub user by username
- 🔐 **OAuth Authentication** - Sign in with GitHub for higher rate limits (Phase 7)
- 📊 **Comprehensive Statistics** - Detailed profile information with advanced analytics
- 🎨 **Modern UI** - Built with 17+ shadcn/ui components (New York style)
- 🌓 **Theme Support** - Dark and light mode with smooth transitions
- ⚡ **Fast & Responsive** - Powered by Vite 7 and React 19
- 🧪 **Fully Tested** - 1302 tests with 90%+ coverage (Unit + Integration + E2E)

### Advanced Features

- 🎯 **Authenticity Score** - AI-powered analysis to detect genuine vs. forked/inactive profiles
  - Original repositories percentage
  - Activity score (recent contributions)
  - Engagement metrics (stars, forks, watchers)
  - Code ownership analysis (languages, commits, project size)

- 🔎 **Advanced Repository Filtering**
  - Filter by language, stars, fork status, archived status
  - Search by name/description
  - Filter by topics and last activity
  - Smart filters for templates and inactive repos

- 📈 **Visual Statistics & Charts**
  - Commit activity charts (3-year history)
  - Language usage breakdown with percentages
  - Contribution activity timeline
  - Repository engagement metrics

- 📋 **Repository Management**
  - Sortable table view (stars, forks, commits, updated, created)
  - Pagination with configurable page size
  - Card and table layout options
  - Detailed repository metadata

## 🛠 Tech Stack

- React 19.2.0, TypeScript 5.8.3, Vite 7.1.2
- Tailwind CSS v4.1.12, shadcn/ui
- Apollo Client 3.14.0, GitHub GraphQL API
- Vitest, React Testing Library, Playwright
- Storybook 10.0.3

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment (required for demo mode)
cp .env.example .env.local
# Add your GitHub token to .env.local for demo mode

# Start dev server
npm run dev
```

## 🔐 Authentication

The application supports two modes of operation:

### 1. Demo Mode (Default)

- **No sign-in required** - Start using the app immediately
- Uses shared GitHub API token
- 5000 requests/hour shared across all users
- Perfect for trying out the app

### 2. OAuth Mode (Sign in with GitHub)

- **Personal rate limits** - 5000 requests/hour per user
- **Fresher data** - 10-minute cache vs 30-minute in demo mode
- **Seamless upgrade** - Sign in anytime during usage
- **Graceful fallback** - Automatically returns to demo mode on errors

**To enable OAuth authentication:**

1. **Create GitHub OAuth App** (for deployment):
   - Go to: https://github.com/settings/developers
   - Click "New OAuth App"
   - Application name: `GitHub Users Analytics`
   - Homepage URL: `https://your-domain.vercel.app`
   - Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback`

2. **Set environment variables**:

   ```bash
   # Required for both modes
   GITHUB_TOKEN=ghp_xxxxx              # Demo mode token

   # Required for OAuth
   GITHUB_OAUTH_CLIENT_ID=Ov23li...    # OAuth App client ID
   GITHUB_OAUTH_CLIENT_SECRET=1a2b...  # OAuth App client secret

   # Auto-configured by Vercel (for session storage)
   KV_URL=redis://...
   KV_REST_API_URL=https://...
   KV_REST_API_TOKEN=...
   ```

3. **Setup Vercel KV** (for OAuth sessions):
   - Vercel Dashboard → Storage → Create KV Database
   - Link to your project

**Demo Mode Token** (always required):

Get token at: https://github.com/settings/tokens

Required scopes: `read:user`, `user:email`

**Documentation:**

- [OAuth Security Checklist](./docs/PHASE_7_SECURITY_CHECKLIST.md)
- [Phase 7 Implementation Summary](./docs/PHASE_7_COMPLETION_SUMMARY.md)

## 🚀 Scripts

```bash
npm run dev           # Dev server
npm run build         # Production build
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run storybook     # Storybook
```

## 🧪 Testing

- ✅ **1302 Unit & Integration Tests** (Vitest + React Testing Library)
- ✅ **39 E2E Tests** (Playwright - Chrome, Firefox, Safari)
- ✅ **90.04% Test Coverage** (exceeds 90% goal)
- ✅ **82+ Storybook Stories** (all UI components documented)

```bash
npm run test              # Unit tests (watch mode)
npm run test:coverage     # Coverage report
npm run test:e2e          # E2E tests (headless)
npm run test:e2e:ui       # E2E tests (UI mode)
npm run test:all          # All tests (unit + E2E)
npm run storybook         # Component documentation
```

**Test Breakdown:**

- Utilities & Hooks: 95%+ coverage
- Components: 85%+ coverage
- Integration Tests: 80%+ coverage
- E2E: All critical user flows

## 📚 Documentation

### Core Documentation

- [Architecture Overview](./docs/architecture.md) - System design and architecture
- [GraphQL API Reference](./docs/graphql-api.md) - GitHub GraphQL API details
- [Dependencies Overview](./docs/dependencies.md) - Complete dependency reference

### OAuth Integration (Phase 7)

- [Phase 7 Completion Summary](./docs/PHASE_7_COMPLETION_SUMMARY.md) - Complete OAuth implementation details
- [Security Checklist](./docs/PHASE_7_SECURITY_CHECKLIST.md) - Security verification and best practices
- [Implementation Plan](./docs/PHASE_7_IMPLEMENTATION_PLAN_RU.md) - Detailed implementation plan (Russian)

### Development Guides

- [Component Development](./docs/component-development.md) - React component workflow with shadcn/ui & Storybook
- [TypeScript Guide](./docs/typescript-guide.md) - TypeScript 5.8 configuration and patterns
- [Testing Guide](./docs/testing-guide.md) - Testing strategy with Vitest, Playwright & RTL
- [Apollo Client Guide](./docs/apollo-client-guide.md) - GraphQL integration and best practices

### Framework & Library Guides

- [React 19 Features](./docs/react-19-features.md) - New hooks and breaking changes
- [Tailwind v4 Migration](./docs/tailwind-v4-migration.md) - CSS-first configuration guide

### MCP & AI Development

- [MCP Servers Setup](./docs/mcp-setup.md) - AI-assisted development setup
- [MCP Verification Checklist](./docs/mcp-verification-checklist.md) - MCP testing guide

## 🤖 MCP Servers

Supports 4 MCP servers for AI development:

- Playwright MCP
- Storybook MCP
- shadcn UI MCP
- Vite MCP (built-in)

See [docs/mcp-setup.md](./docs/mcp-setup.md)

## 📁 Project Structure

```
src/
├── apollo/                      # Data layer (Apollo Client & GraphQL)
│   ├── ApolloAppProvider.tsx   # Apollo Client setup with link chain
│   ├── useQueryUser.ts         # Custom data-fetching hook
│   ├── queriers.ts             # GraphQL queries (GET_USER_INFO)
│   ├── date-helpers.ts         # Date range utilities
│   └── github-api.types.ts     # TypeScript types for GitHub API
│
├── components/                  # React components (30+ components)
│   ├── layout/                 # Layout components (9)
│   │   ├── StatsCard.tsx       # Statistics card wrapper
│   │   ├── Section.tsx         # Content section wrapper
│   │   ├── MainTabs.tsx        # Tab navigation
│   │   ├── UserMenu.tsx        # OAuth authentication menu (Phase 7)
│   │   ├── RateLimitBanner.tsx # Rate limit warnings with OAuth CTA
│   │   ├── EmptyState.tsx      # Empty state placeholder
│   │   ├── ErrorState.tsx      # Error display
│   │   ├── LoadingState.tsx    # Loading skeletons
│   │   └── ThemeToggle.tsx     # Dark/light mode toggle
│   │
│   ├── user/                   # User profile components (6)
│   │   ├── UserHeader.tsx      # Avatar, name, authenticity score
│   │   ├── UserStats.tsx       # Followers, repos, gists
│   │   ├── UserAuthenticity.tsx # Score breakdown
│   │   ├── ContributionHistory.tsx # 3-year commit chart
│   │   ├── RecentActivity.tsx  # Latest contributions
│   │   └── UserProfile.tsx     # Main user view container
│   │
│   ├── repository/             # Repository components (7)
│   │   ├── RepositoryCard.tsx  # Card layout view
│   │   ├── RepositoryList.tsx  # List container
│   │   ├── RepositoryTable.tsx # Table layout view
│   │   ├── RepositoryFilters.tsx # Advanced filtering UI
│   │   ├── RepositorySorting.tsx # Sort controls
│   │   ├── RepositoryEmpty.tsx # Empty state for repos
│   │   └── RepositoryPagination.tsx # Pagination controls
│   │
│   ├── statistics/             # Charts & analytics (4)
│   │   ├── CommitChart.tsx     # Commit activity chart
│   │   ├── LanguageChart.tsx   # Language usage pie chart
│   │   ├── ActivityChart.tsx   # Contribution timeline
│   │   └── StatsOverview.tsx   # Summary statistics
│   │
│   ├── ui/                     # shadcn/ui components (17+)
│   │   ├── button.tsx          # Button component
│   │   ├── card.tsx            # Card component
│   │   ├── tabs.tsx            # Tabs component
│   │   ├── table.tsx           # Table component
│   │   └── ...                 # + 13 more components
│   │
│   └── SearchForm.tsx          # Search input component
│
├── lib/                        # Utility functions
│   ├── authenticity.ts         # Authenticity score calculation
│   ├── repository-filters.ts   # Repository filtering logic
│   ├── statistics.ts           # Statistical calculations
│   ├── constants.ts            # Language colors, constants
│   └── utils.ts                # Helper functions (cn)
│
├── hooks/                      # Custom React hooks
│   ├── useAuthenticityScore.ts # Calculate authenticity score
│   ├── useRepositoryFilters.ts # Repository filtering state
│   └── useRepositorySorting.ts # Repository sorting state
│
├── types/                      # TypeScript type definitions
│   ├── filters.ts              # Filter & sort types
│   └── metrics.ts              # Statistics types
│
└── test/                       # Test utilities
    ├── setup.ts                # Vitest setup
    └── mocks/
        └── github-data.ts      # Centralized mock data

e2e/                            # Playwright E2E tests
docs/                           # Comprehensive documentation
```

## 🏗️ Architecture

The application follows a clean **layered architecture**:

1. **Data Layer** - Apollo Client with link chain (error → http → GitHub API)
2. **Authentication Layer** - OAuth 2.0 flow with session management (Vercel KV)
3. **Business Logic** - Custom hooks and utility functions
4. **Presentation** - React components with shadcn/ui
5. **UI Library** - Reusable components built on Radix UI

**Authentication Architecture:**

- **Demo Mode**: Shared GitHub token, 30-minute cache, no authentication required
- **OAuth Mode**: User-specific tokens, 10-minute cache, httpOnly session cookies
- **Graceful Degradation**: Automatic fallback from OAuth to demo mode on errors

For detailed architecture information, see [docs/architecture.md](./docs/architecture.md)

## 📝 License

MIT

---

**Built with React 19, Vite 7, and Tailwind CSS v4**
