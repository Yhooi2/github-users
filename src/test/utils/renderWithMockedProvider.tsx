import { render, RenderOptions } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ThemeProvider } from 'next-themes';

/**
 * Custom render function for integration tests with Apollo MockedProvider
 *
 * Benefits:
 * - Isolated cache per test (no cross-query pollution)
 * - Only need fields for specific mocked queries
 * - Proper query matching
 * - No global fetch mocking required
 *
 * @param ui - React component to render
 * @param mocks - Array of Apollo mock responses
 * @param options - Additional render options
 *
 * @example
 * ```typescript
 * import { GET_USER_INFO } from '@/apollo/queriers';
 * import { createUserInfoMock } from '@/test/mocks/apollo-mocks';
 *
 * const mocks = [createUserInfoMock({ login: 'torvalds' })];
 *
 * renderWithMockedProvider(<App />, mocks);
 *
 * // Wait for query to resolve
 * await waitFor(() => {
 *   expect(screen.getByText(/Linus Torvalds/i)).toBeInTheDocument();
 * });
 * ```
 */
export function renderWithMockedProvider(
  ui: React.ReactElement,
  mocks: MockedResponse[] = [],
  options: Omit<RenderOptions, 'wrapper'> = {}
) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MockedProvider mocks={mocks}>
        {ui}
      </MockedProvider>
    </ThemeProvider>,
    options
  );
}

/**
 * Async wrapper for tests that need to wait for Apollo queries to resolve
 *
 * MockedProvider processes queries asynchronously, so tests need to wait
 * for the loading state to complete before making assertions.
 *
 * @example
 * ```typescript
 * it('should display user data', async () => {
 *   const mocks = [createUserInfoMock()];
 *   renderWithMockedProvider(<App />, mocks);
 *
 *   // Wait for loading to finish
 *   await waitForApollo();
 *
 *   expect(screen.getByText(/Test User/i)).toBeInTheDocument();
 * });
 * ```
 */
export async function waitForApollo(delay = 0) {
  // MockedProvider resolves queries asynchronously
  // Wait for next tick to allow queries to resolve
  await new Promise((resolve) => setTimeout(resolve, delay));
}
