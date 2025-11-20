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
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
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

// 4. Global error handler with onError
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Handle GraphQL errors
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      const errorMessage = `[GraphQL error]: ${message}`;
      console.error(errorMessage); // Log the error message [oai_citation:0‡apollographql.com](https://www.apollographql.com/docs/react/data/error-handling#:~:text=4%20const%20errorLink%20%3D%20onError%28%28,networkError)
      toast.error(errorMessage);
      // If unauthenticated error, clear token
      if (extensions?.code === "UNAUTHENTICATED") {
        localStorage.removeItem("github_token"); // Apollo Server uses code 'UNAUTHENTICATED' for auth issues [oai_citation:1‡apollographql.com](https://www.apollographql.com/docs/react/data/error-handling#:~:text=3%20%20%20%20for,UNAUTHENTICATED)
      }
    });
  }
  // Handle Network errors (e.g., HTTP errors)
  if (networkError) {
    // If status 401 Unauthorized, remove token
    if ("statusCode" in networkError && networkError.statusCode === 401) {
      localStorage.removeItem("github_token");
    }
    const errorMessage = `[Network error]: ${networkError}`;
    console.error(errorMessage); // Log network errors [oai_citation:2‡apollographql.com](https://www.apollographql.com/docs/react/data/error-handling#:~:text=4%20const%20errorLink%20%3D%20onError%28%28,networkError)
    toast.error(errorMessage);
  }
});

// 5. Combine links: cacheKeyLink -> errorLink -> httpLink
const link = ApolloLink.from([cacheKeyLink, errorLink, httpLink]);

// 6. Instantiate ApolloClient with cache and link chain
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  // Use the new `devtools.enabled` configuration (replaces connectToDevTools)
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

/*
Changes in Apollo Client v4 error handling (onError):
- Apollo Client v4 splits errors into classes: use `error.name` or instanceof to distinguish them (e.g. 'ApolloGraphQLError' vs 'ApolloNetworkError') [oai_citation:3‡github.com](https://github.com/apollographql/apollo-client/issues/12200#:~:text=const%20,useQuery).
- GraphQL errors are combined into a CombinedGraphQLErrors object (with a `.data` property for any partial data) [oai_citation:4‡blog.gitcode.com](https://blog.gitcode.com/8a7813ced7919b7bb3fe0587a696d8e2.html#:~:text=1.%20%E8%A7%A3%E6%9E%90%E5%93%8D%E5%BA%94%E4%BD%93%EF%BC%8C%E5%88%86%E7%A6%BB%E5%87%BA%E6%95%B0%E6%8D%AE%E5%92%8C%E9%94%99%E8%AF%AF%E9%83%A8%E5%88%86%202.%20%E5%A6%82%E6%9E%9C%E5%AD%98%E5%9C%A8%E9%94%99%E8%AF%AF%EF%BC%8C%E5%88%9B%E5%BB%BA%20,%E8%AE%BF%E9%97%AE%E8%BF%99%E4%BA%9B%E6%95%B0%E6%8D%AE). 
- Protocol errors (e.g. multipart/subscriptions) use CombinedProtocolError.
Thus, in onError we still destructure { graphQLErrors, networkError }, log them, and handle codes (like 'UNAUTHENTICATED') accordingly [oai_citation:5‡apollographql.com](https://www.apollographql.com/docs/react/data/error-handling#:~:text=4%20const%20errorLink%20%3D%20onError%28%28,networkError) [oai_citation:6‡apollographql.com](https://www.apollographql.com/docs/react/data/error-handling#:~:text=3%20%20%20%20for,UNAUTHENTICATED).
*/
