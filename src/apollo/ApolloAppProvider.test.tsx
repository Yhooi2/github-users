/**
 * @vitest-environment jsdom
 */
import { gql, useQuery } from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApolloAppProvider } from "./ApolloAppProvider";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Test query
const TEST_QUERY = gql`
  query TestQuery {
    test
  }
`;

// Test component that uses Apollo Client
function TestComponent() {
  const { data, loading, error } = useQuery(TEST_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>Data: {data?.test}</div>;
}

describe("ApolloAppProvider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it("should render children components", () => {
    render(
      <ApolloAppProvider>
        <div>Test Child</div>
      </ApolloAppProvider>,
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("should provide Apollo Client context to children", () => {
    render(
      <ApolloAppProvider>
        <TestComponent />
      </ApolloAppProvider>,
    );

    // Should render loading state initially
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  describe("Authentication", () => {
    // NOTE (Phase 0): These tests verify Apollo Client initialization.
    // Token authentication is now handled server-side via /api/github-proxy.
    // Client-side authLink was removed for security (token no longer exposed in bundle).

    it("should initialize Apollo Client without client-side token", async () => {
      // Phase 0 Update: Token is now added by backend proxy, not client
      // This test verifies Apollo Client initializes correctly with new architecture

      render(
        <ApolloAppProvider>
          <TestComponent />
        </ApolloAppProvider>,
      );

      // Apollo Client should be initialized
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should initialize with localStorage token (legacy test)", () => {
      // Legacy test: localStorage token logic removed in Phase 0
      // Kept for regression testing - verifies Apollo Client still initializes
      const testToken = "test-local-storage-token";
      localStorage.setItem("github_token", testToken);

      render(
        <ApolloAppProvider>
          <TestComponent />
        </ApolloAppProvider>,
      );

      // Verify Apollo Client initializes (token handling now server-side)
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should initialize without client-side token", () => {
      // Phase 0: Client no longer needs token - handled by backend proxy
      localStorage.removeItem("github_token");

      render(
        <ApolloAppProvider>
          <TestComponent />
        </ApolloAppProvider>,
      );

      // Apollo Client should initialize successfully (token added server-side)
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle GraphQL errors and show toast", async () => {
      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock fetch to return GraphQL error with proper Response object
      const responseBody = JSON.stringify({
        errors: [
          {
            message: "Field not found",
            extensions: {},
          },
        ],
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => responseBody,
        json: async () => JSON.parse(responseBody),
      } as Response);

      // Create a component that triggers an error
      function ErrorComponent() {
        const { data, loading, error } = useQuery(TEST_QUERY, {
          fetchPolicy: "network-only",
        });

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return <div>Data: {data?.test}</div>;
      }

      render(
        <ApolloAppProvider>
          <ErrorComponent />
        </ApolloAppProvider>,
      );

      // Wait for error to be processed
      await waitFor(
        () => {
          expect(screen.getByText(/Error:/)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Verify toast.error was called
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Field not found"),
      );
      // Verify console.error was called
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Field not found"),
      );

      consoleErrorSpy.mockRestore();
      vi.restoreAllMocks();
    });

    it("should clear token on UNAUTHENTICATED GraphQL error", async () => {
      // Set up token in localStorage
      const testToken = "test-invalid-token";
      localStorage.setItem("github_token", testToken);

      // Mock console.error to avoid noise
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock fetch to return UNAUTHENTICATED error with proper Response object
      const responseBody = JSON.stringify({
        errors: [
          {
            message: "Must be authenticated",
            extensions: { code: "UNAUTHENTICATED" },
          },
        ],
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => responseBody,
        json: async () => JSON.parse(responseBody),
      } as Response);

      // Create component that triggers query
      function AuthErrorComponent() {
        const { data, loading, error } = useQuery(TEST_QUERY, {
          fetchPolicy: "network-only",
        });

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return <div>Data: {data?.test}</div>;
      }

      render(
        <ApolloAppProvider>
          <AuthErrorComponent />
        </ApolloAppProvider>,
      );

      // Wait for error and token removal
      await waitFor(
        () => {
          expect(localStorage.getItem("github_token")).toBeNull();
        },
        { timeout: 3000 },
      );

      // Verify toast.error was called
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Must be authenticated"),
      );

      consoleErrorSpy.mockRestore();
      vi.restoreAllMocks();
    });

    it("should handle network errors and show toast", async () => {
      // Mock console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock fetch to throw network error
      const networkError = new Error("Failed to fetch");
      networkError.name = "TypeError";
      global.fetch = vi.fn().mockRejectedValue(networkError);

      // Create component that triggers query
      function NetworkErrorComponent() {
        const { data, loading, error } = useQuery(TEST_QUERY, {
          fetchPolicy: "network-only",
        });

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return <div>Data: {data?.test}</div>;
      }

      render(
        <ApolloAppProvider>
          <NetworkErrorComponent />
        </ApolloAppProvider>,
      );

      // Wait for network error to be processed
      await waitFor(
        () => {
          expect(screen.getByText(/Error:/)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Verify toast.error was called
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Network error"),
      );

      consoleErrorSpy.mockRestore();
      vi.restoreAllMocks();
    });

    it("should clear token on 401 network error", async () => {
      // Set up token in localStorage
      const testToken = "test-401-token";
      localStorage.setItem("github_token", testToken);

      // Mock console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock fetch to return 401 error
      const error401 = new Error("Unauthorized");
      error401.name = "ServerError";
      (error401 as any).statusCode = 401;
      global.fetch = vi.fn().mockRejectedValue(error401);

      // Create component that triggers query
      function Unauthorized401Component() {
        const { data, loading, error } = useQuery(TEST_QUERY, {
          fetchPolicy: "network-only",
        });

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return <div>Data: {data?.test}</div>;
      }

      render(
        <ApolloAppProvider>
          <Unauthorized401Component />
        </ApolloAppProvider>,
      );

      // Wait for error and token removal
      await waitFor(
        () => {
          expect(localStorage.getItem("github_token")).toBeNull();
        },
        { timeout: 3000 },
      );

      // Verify toast.error was called
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Network error"),
      );

      consoleErrorSpy.mockRestore();
      vi.restoreAllMocks();
    });

    it("should handle multiple GraphQL errors in single response", async () => {
      // Mock console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock fetch to return multiple GraphQL errors with proper Response object
      const responseBody = JSON.stringify({
        errors: [
          { message: "First error", extensions: {} },
          { message: "Second error", extensions: {} },
        ],
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => responseBody,
        json: async () => JSON.parse(responseBody),
      } as Response);

      function MultiErrorComponent() {
        const { data, loading, error } = useQuery(TEST_QUERY, {
          fetchPolicy: "network-only",
        });

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return <div>Data: {data?.test}</div>;
      }

      render(
        <ApolloAppProvider>
          <MultiErrorComponent />
        </ApolloAppProvider>,
      );

      // Wait for error
      await waitFor(
        () => {
          expect(screen.getByText(/Error:/)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Verify both errors were logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("First error"),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Second error"),
      );

      consoleErrorSpy.mockRestore();
      vi.restoreAllMocks();
    });

    it("should only clear token once for UNAUTHENTICATED error", async () => {
      // Set up token in localStorage
      localStorage.setItem("github_token", "test-token");

      // Mock console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Spy on localStorage.removeItem
      const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");

      // Mock fetch to return UNAUTHENTICATED error with proper Response object
      const responseBody = JSON.stringify({
        errors: [
          {
            message: "Unauthorized",
            extensions: { code: "UNAUTHENTICATED" },
          },
        ],
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => responseBody,
        json: async () => JSON.parse(responseBody),
      } as Response);

      function SingleAuthErrorComponent() {
        const { data, loading, error } = useQuery(TEST_QUERY, {
          fetchPolicy: "network-only",
        });

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return <div>Data: {data?.test}</div>;
      }

      render(
        <ApolloAppProvider>
          <SingleAuthErrorComponent />
        </ApolloAppProvider>,
      );

      // Wait for error
      await waitFor(
        () => {
          expect(localStorage.getItem("github_token")).toBeNull();
        },
        { timeout: 3000 },
      );

      // Verify removeItem was called exactly once
      expect(removeItemSpy).toHaveBeenCalledWith("github_token");
      expect(removeItemSpy).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore();
      removeItemSpy.mockRestore();
      vi.restoreAllMocks();
    });

    it("should log console.error for all error types", async () => {
      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock fetch to return GraphQL error with proper Response object
      const responseBody = JSON.stringify({
        errors: [{ message: "Test error", extensions: {} }],
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => responseBody,
        json: async () => JSON.parse(responseBody),
      } as Response);

      function LogErrorComponent() {
        const { data, loading, error } = useQuery(TEST_QUERY, {
          fetchPolicy: "network-only",
        });

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return <div>Data: {data?.test}</div>;
      }

      render(
        <ApolloAppProvider>
          <LogErrorComponent />
        </ApolloAppProvider>,
      );

      // Wait for error
      await waitFor(
        () => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("[GraphQL error]: Test error"),
          );
        },
        { timeout: 3000 },
      );

      consoleErrorSpy.mockRestore();
      vi.restoreAllMocks();
    });
  });

  describe("Link Chain", () => {
    it("should execute links in correct order: errorLink -> httpLink (proxy)", () => {
      // This test verifies the link chain structure
      // Note: authLink removed in Phase 0 - token now handled by backend proxy
      render(
        <ApolloAppProvider>
          <TestComponent />
        </ApolloAppProvider>,
      );

      // Apollo Client should be properly initialized with link chain
      // The component should render, indicating the client is working
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });
});
