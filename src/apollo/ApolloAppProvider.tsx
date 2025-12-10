/**
 * Apollo Client configuration and provider for GitHub GraphQL API integration
 *
 * This module sets up a complete Apollo Client with:
 * - Authentication via Bearer token (from env or localStorage)
 * - Global error handling for GraphQL and network errors
 * - Automatic token cleanup on authentication failures
 * - Toast notifications for user feedback
 *
 * @module ApolloAppProvider
 */

import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { ApolloProvider } from "@apollo/client/react";
import React from "react";
import { toast } from "sonner";

// 1. Custom link to extract cacheKey from context and add to request body
const cacheKeyLink = new ApolloLink((operation, forward) => {
  // Extract cacheKey from operation context
  const { cacheKey } = operation.getContext();

  // Add cacheKey to the request body if it exists
  if (cacheKey) {
    operation.extensions = {
      ...operation.extensions,
      cacheKey,
    };
  }

  return forward(operation);
});

// 2. HTTP link to GraphQL endpoint (via backend proxy)
const httpLink = createHttpLink({
  uri: "/api/github-proxy", // Proxy to GitHub API (token secured on server)
  includeExtensions: true, // ← CRITICAL: Include extensions in request body
  credentials: "include", // ← Include cookies for OAuth session
  fetch: (uri, options) => {
    // Extract cacheKey from extensions and add to body
    const body = JSON.parse((options?.body as string) || "{}");
    const extensions = body.extensions || {};
    const cacheKey = extensions.cacheKey;

    // Create new body with cacheKey at top level
    const newBody = {
      query: body.query,
      variables: body.variables,
      ...(cacheKey && { cacheKey }),
    };

    return fetch(uri, {
      ...options,
      credentials: "include", // Ensure cookies are sent with every request
      body: JSON.stringify(newBody),
    });
  },
});

// 3. Auth middleware: NO LONGER NEEDED (token handled by backend proxy)
// Token is now securely stored on server and added by /api/github-proxy
// This prevents token exposure in client bundle

// 4. Global error handler with ErrorLink (Apollo Client v4)
const errorLink = new ErrorLink(({ error }) => {
  // Handle GraphQL errors (Apollo Client v4 uses CombinedGraphQLErrors)
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      const errorMessage = `[GraphQL error]: ${message}`;
      console.error(errorMessage);
      toast.error(errorMessage);
      // If unauthenticated error, clear token
      if (extensions?.code === "UNAUTHENTICATED") {
        localStorage.removeItem("github_token");
      }
    });
  } else {
    // Handle Network errors and other errors
    const errorMessage = `[Network error]: ${error.message}`;
    console.error(errorMessage);
    toast.error(errorMessage);
    // If status 401 Unauthorized, remove token
    if (
      "statusCode" in error &&
      (error as { statusCode: number }).statusCode === 401
    ) {
      localStorage.removeItem("github_token");
    }
  }
});

// 5. Combine links: cacheKeyLink -> errorLink -> httpLink
const link = ApolloLink.from([cacheKeyLink, errorLink, httpLink]);

// 6. Instantiate ApolloClient with cache and link chain
const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          user: {
            merge: true, // Просто заменять весь объект user
          },
        },
      },
      Repository: {
        keyFields: ["id"], // Теперь все запросы возвращают id
        fields: {
          licenseInfo: {
            merge: true,
          },
          defaultBranchRef: {
            merge: true,
          },
          primaryLanguage: {
            merge: true,
          },
        },
      },
      License: {
        keyFields: false, // Не нормализовать
      },
      Ref: {
        keyFields: false,
      },
      Language: {
        keyFields: false,
      },
    },
  }),
  devtools: { enabled: process.env.NODE_ENV !== "production" },
});

/**
 * Apollo Provider component that wraps the React application
 *
 * Provides Apollo Client context to all child components, enabling them to use
 * Apollo hooks like `useQuery`, `useMutation`, etc.
 *
 * The client is configured with:
 * - Link chain: errorLink → httpLink (proxy to backend)
 * - InMemoryCache for automatic query result caching
 * - Global error handling with toast notifications
 * - Backend proxy handles GitHub token authentication
 *
 * @param props - Component props
 * @param props.children - React children to wrap with Apollo context
 * @returns Apollo Provider wrapper component
 *
 * @example
 * ```typescript
 * import { ApolloAppProvider } from './apollo/ApolloAppProvider'
 *
 * function App() {
 *   return (
 *     <ApolloAppProvider>
 *       <YourApp />
 *     </ApolloAppProvider>
 *   )
 * }
 * ```
 */
export function ApolloAppProvider({ children }: { children: React.ReactNode }) {
  // Load Apollo Client dev/error messages only in development on the client
  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      typeof window !== "undefined"
    ) {
      import("@apollo/client/dev")
        .then((mod) => {
          try {
            mod.loadDevMessages?.();
            mod.loadErrorMessages?.();
          } catch {
            // ignore if dev messages cannot be loaded
            // they are optional developer ergonomics only
          }
        })
        .catch(() => {
          // ignore dynamic import failures
        });
    }
  }, []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
