import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

/**
 * Error Boundary component to catch and handle errors in child components.
 *
 * Wraps components that might throw errors and displays a fallback UI
 * when errors occur, preventing the entire app from crashing.
 */
const meta = {
  title: "Layout/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Component that throws an error when button is clicked
 */
function ThrowErrorButton({
  message = "Test error thrown!",
}: {
  message?: string;
}) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error(message);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground">Click button to trigger an error</p>
      <Button onClick={() => setShouldThrow(true)} variant="destructive">
        Throw Error
      </Button>
    </div>
  );
}

/**
 * Normal state - no errors, children render successfully
 */
export const Default: Story = {
  args: {
    children: (
      <div className="rounded-lg border p-8">
        <h2 className="mb-2 text-xl font-semibold">Working Component</h2>
        <p className="text-muted-foreground">
          This component renders normally without any errors.
        </p>
      </div>
    ),
  },
};

/**
 * Error caught - default ErrorState fallback displayed
 */
export const WithError: Story = {
  args: {
    children: <ThrowErrorButton message="Something went wrong!" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When a child component throws an error, ErrorBoundary catches it and displays the default ErrorState fallback.",
      },
    },
  },
};

/**
 * Error with custom message
 */
export const WithCustomErrorMessage: Story = {
  args: {
    children: (
      <ThrowErrorButton message="Failed to load user data from GitHub API" />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error messages are passed through and displayed in the ErrorState component.",
      },
    },
  },
};

/**
 * Error with custom fallback UI
 */
export const WithCustomFallback: Story = {
  args: {
    fallback: (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
        <h2 className="mb-2 text-lg font-semibold text-destructive">
          Custom Error UI
        </h2>
        <p className="text-sm text-muted-foreground">
          This is a custom fallback component instead of the default ErrorState.
        </p>
      </div>
    ),
    children: <ThrowErrorButton />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "You can provide a custom fallback component to render when an error occurs.",
      },
    },
  },
};

/**
 * Error with callback handler
 */
export const WithErrorCallback: Story = {
  args: {
    onError: (error, errorInfo) => {
      console.log("Error caught by ErrorBoundary:", error.message);
      console.log("Component stack:", errorInfo.componentStack);
      // In real app: send to error tracking service (Sentry, etc.)
    },
    children: <ThrowErrorButton message="Error logged to console" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The onError callback is triggered when an error is caught, useful for logging to error tracking services.",
      },
    },
  },
};

/**
 * Network error simulation
 */
export const NetworkError: Story = {
  args: {
    children: (
      <ThrowErrorButton message="Failed to fetch: Network request failed" />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Simulates a network error that might occur during API calls.",
      },
    },
  },
};

/**
 * Rendering error simulation
 */
export const RenderError: Story = {
  args: {
    children: (
      <ThrowErrorButton message="Cannot read property 'map' of undefined" />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Simulates a rendering error that might occur with malformed data.",
      },
    },
  },
};

/**
 * Multiple children - one throws error
 */
export const PartialError: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-4">
        <div className="rounded border p-4">
          <p>This component renders fine</p>
        </div>
        <ThrowErrorButton message="Only this component failed" />
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "When one child throws an error, the entire ErrorBoundary tree shows the fallback. Consider using separate ErrorBoundaries for independent sections.",
      },
    },
  },
};
