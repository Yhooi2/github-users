# GitHub User Info

> Modern React application for searching and displaying GitHub user information via GraphQL API

[![CI](https://github.com/Yhooi2/git-user-info/actions/workflows/ci.yml/badge.svg)](https://github.com/Yhooi2/git-user-info/actions/workflows/ci.yml)
[![E2E](https://github.com/Yhooi2/git-user-info/actions/workflows/e2e.yml/badge.svg)](https://github.com/Yhooi2/git-user-info/actions/workflows/e2e.yml)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/tests-1557%20passed-success)](./src)

## Features

### Core Features

- **Search GitHub Users** - Find any public GitHub user by username
- **OAuth Authentication** - Sign in with GitHub for higher rate limits
- **Comprehensive Statistics** - Detailed profile information with advanced analytics
- **Modern UI** - Built with 17+ shadcn/ui components (New York style)
- **Theme Support** - Dark and light mode with smooth transitions
- **Fast & Responsive** - Powered by Vite 7 and React 19
- **Fully Tested** - 1557 tests (Unit + Integration + E2E)

### Advanced Features

- **Authenticity Score** - AI-powered analysis to detect genuine vs. forked/inactive profiles
  - Original repositories percentage
  - Activity score (recent contributions)
  - Engagement metrics (stars, forks, watchers)
  - Code ownership analysis (languages, commits, project size)

- **Advanced Repository Filtering**
  - Filter by language, stars, fork status, archived status
  - Search by name/description
  - Filter by topics and last activity
  - Smart filters for templates and inactive repos

- **Visual Statistics & Charts**
  - Commit activity charts (3-year history)
  - Language usage breakdown with percentages
  - Contribution activity timeline
  - Repository engagement metrics

- **Repository Management**
  - Sortable table view (stars, forks, commits, updated, created)
  - Pagination with configurable page size
  - Card and table layout options
  - Detailed repository metadata

## Tech Stack

- React 19.2.0, TypeScript 5.8.3, Vite 7.1.2
- Tailwind CSS v4.1.12, shadcn/ui
- Apollo Client 3.14.0, GitHub GraphQL API
- Vitest, React Testing Library, Playwright
- Storybook 10.1.0

## Installation

```bash
# Install dependencies
npm install

# Setup environment (required for demo mode)
cp .env.example .env.local
# Add your GitHub token to .env.local for demo mode

# Start dev server
npm run dev
```

## Authentication

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
   - Vercel Dashboard -> Storage -> Create KV Database
   - Link to your project

**Demo Mode Token** (always required):

Get token at: https://github.com/settings/tokens

Required scopes: `read:user`, `user:email`

## Scripts

```bash
npm run dev           # Dev server
npm run build         # Production build
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run storybook     # Storybook
```

## Testing

- **1557 Unit & Integration Tests** (Vitest + React Testing Library)
- **39 E2E Tests** (Playwright - Chrome, Firefox, Safari)
- **82+ Storybook Stories** (all UI components documented)

```bash
npm run test              # Unit tests (watch mode)
npm run test:coverage     # Coverage report
npm run test:e2e          # E2E tests (headless)
npm run test:e2e:ui       # E2E tests (UI mode)
npm run test:all          # All tests (unit + E2E)
npm run storybook         # Component documentation
```

## Documentation

### Core Documentation

- [Architecture Overview](./docs/architecture.md) - System design and architecture
- [Components Guide](./docs/components-guide.md) - Component catalog & usage
- [Apollo Client Guide](./docs/apollo-client-guide.md) - GraphQL integration
- [Testing Guide](./docs/phases/testing-guide.md) - Testing strategy
- [OAuth Integration](./docs/phases/phase-7-oauth-integration.md) - OAuth implementation

### Quick References

- [Design Tokens](./.claude/quick-ref/quick_ref_design_tokens.md) - Colors, spacing, typography
- [Responsive Design](./.claude/quick-ref/quick_ref_responsive.md) - Breakpoints and rules
- [Tech Stack](./.claude/quick-ref/quick_ref_tech_stack.md) - Technology overview
- [3-Level System](./.claude/quick-ref/quick_ref_3_levels.md) - Progressive disclosure

## MCP Servers

Supports 4 MCP servers for AI development:

- Playwright MCP
- Storybook MCP
- shadcn UI MCP
- Context7 MCP

## Project Structure

```
src/
├── apollo/                      # Data layer (Apollo Client & GraphQL)
│   ├── ApolloAppProvider.tsx   # Apollo Client setup with link chain
│   ├── useQueryUser.ts         # Custom data-fetching hook
│   ├── queriers.ts             # GraphQL queries
│   ├── date-helpers.ts         # Date range utilities
│   └── github-api.types.ts     # TypeScript types for GitHub API
│
├── components/                  # React components (30+ components)
│   ├── level-0/                # Ultra-compact list view
│   ├── level-1/                # Expandable card view
│   ├── level-2/                # Full analytics modal
│   ├── assessment/             # Metrics display components
│   ├── timeline/               # Activity timeline components
│   ├── layout/                 # Layout components
│   ├── user/                   # User profile components
│   ├── shared/                 # Shared UI components
│   └── ui/                     # shadcn/ui components (17+)
│
├── hooks/                      # Custom React hooks
│   ├── useAuthenticityScore.ts # Calculate authenticity score
│   ├── useProgressiveDisclosure.ts # Progressive content expansion
│   ├── useReducedMotion.ts     # Accessibility for animations
│   └── useResponsive.ts        # Responsive breakpoints
│
├── lib/                        # Utility functions
│   ├── metrics/                # Scoring algorithms
│   ├── adapters/               # Data transformation
│   ├── authenticity.ts         # Authenticity score calculation
│   ├── statistics.ts           # Statistical calculations
│   └── utils.ts                # Helper functions
│
├── types/                      # TypeScript type definitions
│
└── test/                       # Test utilities
    ├── setup.ts                # Vitest setup
    └── mocks/                  # Mock data

api/                            # Backend API routes
├── auth/                       # OAuth endpoints
├── user/                       # User endpoints
└── github-proxy.ts             # GitHub API proxy

e2e/                            # Playwright E2E tests
docs/                           # Documentation
```

## Architecture

The application follows a clean **layered architecture**:

1. **Data Layer** - Apollo Client with link chain (error -> http -> GitHub API)
2. **Authentication Layer** - OAuth 2.0 flow with session management (Vercel KV)
3. **Business Logic** - Custom hooks and utility functions
4. **Presentation** - React components with shadcn/ui
5. **UI Library** - Reusable components built on Radix UI

**Authentication Architecture:**

- **Demo Mode**: Shared GitHub token, 30-minute cache, no authentication required
- **OAuth Mode**: User-specific tokens, 10-minute cache, httpOnly session cookies
- **Graceful Degradation**: Automatic fallback from OAuth to demo mode on errors

For detailed architecture information, see [docs/architecture.md](./docs/architecture.md)

## License

Apache 2.0

---

**Built with React 19, Vite 7, and Tailwind CSS v4**
