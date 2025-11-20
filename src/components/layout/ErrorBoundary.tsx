import { Component, type ReactNode } from "react";
import { ErrorState } from "./ErrorState";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Error Boundary component to catch and handle errors in child components.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <ChartComponent data={data} />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * With custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorComponent />}>
 *   <ChartComponent data={data} />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback or default ErrorState
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          title="Something went wrong"
          message={
            this.state.error?.message ||
            "An unexpected error occurred while rendering this component."
          }
        />
      );
    }

    return this.props.children;
  }
}
