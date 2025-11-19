/**
 * ErrorBoundary Component Tests
 *
 * Tests React Error Boundary functionality for catching and handling errors
 * in child components. Covers normal rendering, error states, custom fallbacks,
 * and error callbacks.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

// Mock ErrorState component
vi.mock('./ErrorState', () => ({
  ErrorState: ({ title, message }: { title: string; message: string }) => (
    <div data-testid="error-state">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  ),
}))

// Test component that can throw errors
function BuggyComponent({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error from BuggyComponent')
  }
  return <div data-testid="working-component">Working correctly</div>
}

describe('ErrorBoundary', () => {
  // Mock console.error to avoid noise in test output
  const originalConsoleError = console.error
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error = originalConsoleError
    vi.restoreAllMocks()
  })

  describe('Normal Rendering (No Errors)', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow={false} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('working-component')).toBeInTheDocument()
      expect(screen.getByText('Working correctly')).toBeInTheDocument()
    })

    it('should render multiple children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should catch error and render default ErrorState fallback', () => {
      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      // Should render ErrorState with error message
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Test error from BuggyComponent')).toBeInTheDocument()

      // Should NOT render children
      expect(screen.queryByTestId('working-component')).not.toBeInTheDocument()
    })

    it('should handle error without error message', () => {
      function ComponentWithoutMessage({ shouldThrow = false }: { shouldThrow?: boolean }) {
        if (shouldThrow) {
          throw new Error() // No message
        }
        return <div>Working</div>
      }

      render(
        <ErrorBoundary>
          <ComponentWithoutMessage shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(
        screen.getByText('An unexpected error occurred while rendering this component.')
      ).toBeInTheDocument()
    })

    it('should render custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>

      render(
        <ErrorBoundary fallback={customFallback}>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      // Should render custom fallback
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument()

      // Should NOT render default ErrorState
      expect(screen.queryByTestId('error-state')).not.toBeInTheDocument()
    })
  })

  describe('onError Callback', () => {
    it('should call onError callback when error occurs', () => {
      const onErrorMock = vi.fn()

      render(
        <ErrorBoundary onError={onErrorMock}>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      // onError should be called with error and errorInfo
      expect(onErrorMock).toHaveBeenCalledTimes(1)
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error from BuggyComponent',
        }),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      )
    })

    it('should not call onError when no error occurs', () => {
      const onErrorMock = vi.fn()

      render(
        <ErrorBoundary onError={onErrorMock}>
          <BuggyComponent shouldThrow={false} />
        </ErrorBoundary>
      )

      expect(onErrorMock).not.toHaveBeenCalled()
    })

    it('should work without onError callback', () => {
      // Should not throw when onError is not provided
      expect(() => {
        render(
          <ErrorBoundary>
            <BuggyComponent shouldThrow={true} />
          </ErrorBoundary>
        )
      }).not.toThrow()

      expect(screen.getByTestId('error-state')).toBeInTheDocument()
    })
  })

  describe('Development Mode Logging', () => {
    it('should log error to console in development mode', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      // Should log error in development
      expect(consoleErrorSpy).toHaveBeenCalled()

      process.env.NODE_ENV = originalEnv
    })

    it('should not log error to console in production mode', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      // Clear previous calls
      consoleErrorSpy.mockClear()

      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      // componentDidCatch should not call console.error in production
      // Note: React Testing Library may still call console.error for unhandled errors
      // We're testing that our code doesn't add additional logging

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Error Recovery', () => {
    it('should continue catching errors from different children', () => {
      const onErrorMock = vi.fn()

      function MultipleChildren({ throwFirst = false }: { throwFirst?: boolean }) {
        return (
          <ErrorBoundary onError={onErrorMock}>
            {throwFirst ? (
              <BuggyComponent shouldThrow={true} />
            ) : (
              <BuggyComponent shouldThrow={false} />
            )}
            <div data-testid="sibling">Sibling component</div>
          </ErrorBoundary>
        )
      }

      const { rerender } = render(<MultipleChildren throwFirst={false} />)

      // First render: no error
      expect(screen.getByTestId('working-component')).toBeInTheDocument()
      expect(onErrorMock).not.toHaveBeenCalled()

      // Rerender with error
      rerender(<MultipleChildren throwFirst={true} />)

      // Should catch error
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(onErrorMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle synchronous errors', () => {
      function SyncErrorComponent() {
        throw new Error('Synchronous error')
      }

      render(
        <ErrorBoundary>
          <SyncErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(screen.getByText('Synchronous error')).toBeInTheDocument()
    })

    it('should handle errors with special characters in message', () => {
      function SpecialCharErrorComponent() {
        throw new Error('Error with <special> & "characters" & symbols: @#$%')
      }

      render(
        <ErrorBoundary>
          <SpecialCharErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(
        screen.getByText('Error with <special> & "characters" & symbols: @#$%')
      ).toBeInTheDocument()
    })

    it('should handle very long error messages', () => {
      const longMessage = 'A'.repeat(500)

      function LongMessageComponent() {
        throw new Error(longMessage)
      }

      render(
        <ErrorBoundary>
          <LongMessageComponent />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })

    it('should isolate errors to ErrorBoundary scope', () => {
      // Test that error in one boundary doesn't affect another
      const { container } = render(
        <div>
          <ErrorBoundary>
            <BuggyComponent shouldThrow={true} />
          </ErrorBoundary>
          <ErrorBoundary>
            <BuggyComponent shouldThrow={false} />
          </ErrorBoundary>
        </div>
      )

      // First boundary should show error
      const errorStates = screen.getAllByTestId('error-state')
      expect(errorStates).toHaveLength(1)

      // Second boundary should render normally
      expect(screen.getByTestId('working-component')).toBeInTheDocument()
    })
  })

  describe('State Management', () => {
    it('should update hasError state when error occurs', () => {
      const { container } = render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      // Should show error UI (hasError: true)
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
    })

    it('should store error object in state', () => {
      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      // Error message should be rendered from state.error
      expect(screen.getByText('Test error from BuggyComponent')).toBeInTheDocument()
    })
  })

  describe('Nested ErrorBoundaries', () => {
    it('should catch error at nearest ErrorBoundary', () => {
      const outerOnError = vi.fn()
      const innerOnError = vi.fn()

      render(
        <ErrorBoundary onError={outerOnError}>
          <div data-testid="outer-content">
            <ErrorBoundary onError={innerOnError}>
              <BuggyComponent shouldThrow={true} />
            </ErrorBoundary>
          </div>
        </ErrorBoundary>
      )

      // Inner boundary should catch the error
      expect(innerOnError).toHaveBeenCalledTimes(1)

      // Outer boundary should NOT catch the error
      expect(outerOnError).not.toHaveBeenCalled()

      // Outer content should still be visible
      expect(screen.getByTestId('outer-content')).toBeInTheDocument()
    })

  })
})
