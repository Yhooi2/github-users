# GitHub User Info

> Modern React application for searching and displaying GitHub user information via GraphQL API

[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/tests-33%20passed-success)](./src)

## ✨ Features

- 🔍 **Search GitHub Users** - Find any public GitHub user by username
- 📊 **Detailed Statistics** - View comprehensive profile information
- 🎨 **Modern UI** - Built with shadcn/ui components (New York style)
- 🌓 **Theme Support** - Dark and light mode with next-themes
- ⚡ **Fast & Responsive** - Powered by Vite 7 and React 19
- 🧪 **Fully Tested** - 33 unit tests + E2E tests with Playwright

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

# Setup environment
cp .env.example .env.local
# Add your GitHub token to .env.local

# Start dev server
npm run dev
```

## 🔑 GitHub Token

Get token at: https://github.com/settings/tokens

Required scopes: `read:user`, `user:email`

## 🚀 Scripts

```bash
npm run dev           # Dev server
npm run build         # Production build
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run storybook     # Storybook
```

## 🧪 Testing

- ✅ 33 Unit Tests (Vitest + RTL)
- ✅ E2E Tests (Playwright)
- ✅ Test Coverage Available

```bash
npm run test:all      # Run all tests
```

## 📚 Documentation

### Core Documentation

- [Architecture Overview](./docs/architecture.md) - System design and architecture
- [GraphQL API Reference](./docs/graphql-api.md) - GitHub GraphQL API details
- [Dependencies Overview](./docs/dependencies.md) - Complete dependency reference

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
├── apollo/              # Data layer (Apollo Client & GraphQL)
│   ├── ApolloAppProvider.tsx    # Apollo Client setup
│   ├── useQueryUser.ts          # Custom data-fetching hook
│   ├── queriers.ts              # GraphQL queries
│   ├── date-helpers.ts          # Date utilities
│   └── github-api.types.ts      # TypeScript types
│
├── components/          # Presentation layer
│   ├── SearchForm.tsx           # Search input component
│   ├── UserProfile.tsx          # User data display
│   └── ui/                      # shadcn/ui components
│
├── lib/                 # Utilities
│   └── utils.ts                 # Helper functions
│
└── test/               # Test setup
    └── setup.ts

e2e/                    # Playwright E2E tests
docs/                   # Documentation
```

## 🏗️ Architecture

The application follows a clean **layered architecture**:

1. **Data Layer** - Apollo Client with link chain (error → auth → http)
2. **Business Logic** - Custom hooks and utility functions
3. **Presentation** - React components with shadcn/ui
4. **UI Library** - Reusable components built on Radix UI

For detailed architecture information, see [docs/architecture.md](./docs/architecture.md)

## 📝 License

MIT

---

**Built with React 19, Vite 7, and Tailwind CSS v4**
