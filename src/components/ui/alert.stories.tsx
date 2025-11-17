import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { AlertCircle, CheckCircle2, Info, XCircle, Terminal } from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An alert component for displaying important messages. Supports default and destructive variants with optional icons and titles.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Alert>;

// Story 1: Default alert
export const Default: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <Info />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert message with informational content.
      </AlertDescription>
    </Alert>
  ),
};

// Story 2: Destructive alert
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[500px]">
      <XCircle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again to continue.
      </AlertDescription>
    </Alert>
  ),
};

// Story 3: Success message (GitHub use case)
export const SuccessMessage: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <CheckCircle2 />
      <AlertTitle>Repository forked successfully</AlertTitle>
      <AlertDescription>
        You can now make changes to your fork and submit a pull request to the original repository.
      </AlertDescription>
    </Alert>
  ),
};

// Story 4: Error message (GitHub use case)
export const ErrorMessage: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[500px]">
      <AlertCircle />
      <AlertTitle>Failed to create pull request</AlertTitle>
      <AlertDescription>
        The base branch does not exist or you do not have permission to create a pull request.
      </AlertDescription>
    </Alert>
  ),
};

// Story 5: Without icon
export const WithoutIcon: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>
        A new version of the application is available. Please refresh the page to update.
      </AlertDescription>
    </Alert>
  ),
};

// Story 6: Without title
export const WithoutTitle: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <Info />
      <AlertDescription>
        Your changes have been saved automatically. No action is required.
      </AlertDescription>
    </Alert>
  ),
};

// Story 7: Description only (minimal)
export const DescriptionOnly: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <AlertDescription>Simple alert message without icon or title.</AlertDescription>
    </Alert>
  ),
};

// Story 8: GitHub API rate limit warning
export const RateLimitWarning: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[550px]">
      <AlertCircle />
      <AlertTitle>API Rate Limit Exceeded</AlertTitle>
      <AlertDescription>
        You have exceeded the GitHub API rate limit. Please wait until{' '}
        <strong>3:42 PM</strong> or authenticate to increase your rate limit to 5,000
        requests per hour.
      </AlertDescription>
    </Alert>
  ),
};

// Story 9: Multiple alerts stacked
export const MultipleAlerts: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <Alert>
        <Info />
        <AlertTitle>Repository visibility changed</AlertTitle>
        <AlertDescription>This repository is now public.</AlertDescription>
      </Alert>
      <Alert>
        <CheckCircle2 />
        <AlertTitle>Workflow completed</AlertTitle>
        <AlertDescription>CI/CD pipeline finished successfully in 2m 34s.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Security alert</AlertTitle>
        <AlertDescription>
          A dependency with a known security vulnerability was detected.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

// Story 10: Long content
export const LongContent: Story = {
  render: () => (
    <Alert className="w-[550px]">
      <Terminal />
      <AlertTitle>Deployment Configuration</AlertTitle>
      <AlertDescription>
        Your deployment configuration has been updated. The following environment variables have
        been modified: DATABASE_URL, API_KEY, SESSION_SECRET. These changes will take effect on
        the next deployment. Make sure to update your local .env file accordingly to match the
        production environment. If you experience any issues, please contact the development team
        or check the deployment logs for more information.
      </AlertDescription>
    </Alert>
  ),
};

// Story 11: GitHub authentication warning
export const AuthenticationWarning: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[500px]">
      <AlertCircle />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription>
        You need to provide a GitHub Personal Access Token to use this application. Please add
        your token to the .env.local file or enter it in the settings.
      </AlertDescription>
    </Alert>
  ),
};

// Story 12: Custom styled alert
export const CustomStyled: Story = {
  render: () => (
    <Alert className="w-[500px] border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
      <CheckCircle2 />
      <AlertTitle>All tests passed</AlertTitle>
      <AlertDescription>
        The test suite completed successfully with 100% coverage.
      </AlertDescription>
    </Alert>
  ),
};
