import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorState } from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'Layout/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ErrorState displays error messages with different severity levels and optional retry/dismiss actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Error title/heading',
    },
    message: {
      control: 'text',
      description: 'Error message/description',
    },
    variant: {
      control: 'select',
      options: ['error', 'warning', 'info'],
      description: 'Visual severity of the error',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show icon based on variant',
    },
    retryText: {
      control: 'text',
      description: 'Custom retry button text',
    },
    dismissText: {
      control: 'text',
      description: 'Custom dismiss button text',
    },
  },
  args: {
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

/**
 * Critical error state (default)
 */
export const Error: Story = {
  args: {
    title: 'Error Loading Data',
    message: 'Unable to fetch user information from GitHub API. Please try again.',
    variant: 'error',
  },
};

/**
 * Warning state
 */
export const Warning: Story = {
  args: {
    title: 'Limited Data',
    message: 'Some repository information could not be loaded. The displayed data may be incomplete.',
    variant: 'warning',
  },
};

/**
 * Informational state
 */
export const Info: Story = {
  args: {
    title: 'Rate Limit Approaching',
    message: 'You are approaching the GitHub API rate limit. Consider authenticating for higher limits.',
    variant: 'info',
  },
};

/**
 * Error with retry action
 */
export const WithRetry: Story = {
  args: {
    title: 'Connection Failed',
    message: 'Unable to connect to the server. Please check your internet connection.',
    variant: 'error',
  },
};

/**
 * Error with dismiss action
 */
export const WithDismiss: Story = {
  args: {
    title: 'Partial Failure',
    message: 'Some data failed to load but you can continue.',
    variant: 'warning',
  },
};

/**
 * Error with both retry and dismiss
 */
export const WithBothActions: Story = {
  args: {
    title: 'Network Error',
    message: 'Failed to load repository data. You can retry or dismiss this message.',
    variant: 'error',
  },
};

/**
 * Error without icon
 */
export const WithoutIcon: Story = {
  args: {
    title: 'Simple Error',
    message: 'An error occurred without an icon.',
    variant: 'error',
    showIcon: false,
  },
};

/**
 * Error with custom button text
 */
export const CustomButtonText: Story = {
  args: {
    title: 'Authentication Required',
    message: 'You need to provide a GitHub token to access this data.',
    variant: 'warning',
    retryText: 'Add Token',
    dismissText: 'Skip',
  },
};

/**
 * Network error scenario
 */
export const NetworkError: Story = {
  args: {
    title: 'Network Error',
    message: 'Cannot reach GitHub servers. Please check your internet connection and try again.',
    variant: 'error',
    retryText: 'Retry Connection',
  },
};

/**
 * 404 Not Found scenario
 */
export const NotFound: Story = {
  args: {
    title: 'User Not Found',
    message: 'The requested GitHub user does not exist or has been deleted.',
    variant: 'error',
    dismissText: 'Go Back',
  },
};

/**
 * Rate limit exceeded scenario
 */
export const RateLimitExceeded: Story = {
  args: {
    title: 'Rate Limit Exceeded',
    message: 'You have exceeded the GitHub API rate limit. Please wait or authenticate for higher limits.',
    variant: 'warning',
    retryText: 'Authenticate',
  },
};

/**
 * Long error message
 */
export const LongMessage: Story = {
  args: {
    title: 'GraphQL Error',
    message:
      'An error occurred while executing the GraphQL query. This could be due to invalid query syntax, missing required fields, or server-side issues. Please review your query and try again. If the problem persists, contact support.',
    variant: 'error',
  },
};
