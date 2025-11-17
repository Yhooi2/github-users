import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A checkbox component for boolean input. Built on Radix UI with checked, unchecked, and indeterminate states.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Story 1: Default unchecked
export const Default: Story = {
  render: () => <Checkbox />,
};

// Story 2: Checked
export const Checked: Story = {
  render: () => <Checkbox defaultChecked />,
};

// Story 3: Disabled unchecked
export const Disabled: Story = {
  render: () => <Checkbox disabled />,
};

// Story 4: Disabled checked
export const DisabledChecked: Story = {
  render: () => <Checkbox disabled defaultChecked />,
};

// Story 5: With label
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
};

// Story 6: GitHub repository settings use case
export const RepositorySettings: Story = {
  render: () => (
    <div className="space-y-4 rounded-lg border p-4" style={{ width: '400px' }}>
      <div className="text-sm font-semibold">Repository Settings</div>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox id="issues" defaultChecked />
          <div className="grid gap-1">
            <label
              htmlFor="issues"
              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Issues
            </label>
            <p className="text-muted-foreground text-xs">
              Track and manage project issues and bugs
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Checkbox id="wiki" />
          <div className="grid gap-1">
            <label
              htmlFor="wiki"
              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Wiki
            </label>
            <p className="text-muted-foreground text-xs">Document your project with wiki pages</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Checkbox id="projects" defaultChecked />
          <div className="grid gap-1">
            <label
              htmlFor="projects"
              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Projects
            </label>
            <p className="text-muted-foreground text-xs">
              Organize and prioritize your work with project boards
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Checkbox id="discussions" defaultChecked />
          <div className="grid gap-1">
            <label
              htmlFor="discussions"
              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Discussions
            </label>
            <p className="text-muted-foreground text-xs">Enable community discussions</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Story 7: Notification preferences
export const NotificationPreferences: Story = {
  render: () => (
    <div className="space-y-4 rounded-lg border p-4" style={{ width: '400px' }}>
      <div className="text-sm font-semibold">Notification Preferences</div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="email-notify" defaultChecked />
          <label
            htmlFor="email-notify"
            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email notifications
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="push-notify" defaultChecked />
          <label
            htmlFor="push-notify"
            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Push notifications
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="mention-notify" />
          <label
            htmlFor="mention-notify"
            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mention notifications
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="watch-notify" disabled />
          <label
            htmlFor="watch-notify"
            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Watch notifications (unavailable)
          </label>
        </div>
      </div>
    </div>
  ),
};

// Story 8: Multiple checkboxes
export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Checkbox />
      <Checkbox defaultChecked />
      <Checkbox disabled />
      <Checkbox disabled defaultChecked />
    </div>
  ),
};

// Story 9: With description
export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-3 rounded-lg border p-4" style={{ width: '400px' }}>
      <Checkbox id="privacy" />
      <div className="grid gap-1.5">
        <label
          htmlFor="privacy"
          className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Make repository private
        </label>
        <p className="text-muted-foreground text-xs">
          Only you and collaborators you explicitly grant access to will be able to see this
          repository. You can change this setting later.
        </p>
      </div>
    </div>
  ),
};

// Story 10: Controlled checkbox
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="controlled" checked={checked} onCheckedChange={setChecked} />
          <label
            htmlFor="controlled"
            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Controlled checkbox
          </label>
        </div>
        <div className="text-muted-foreground text-xs">Status: {checked ? 'Checked' : 'Unchecked'}</div>
      </div>
    );
  },
};

// Story 11: Indeterminate state
export const Indeterminate: Story = {
  render: () => <Checkbox checked="indeterminate" />,
};

// Story 12: GitHub PR checklist
export const PullRequestChecklist: Story = {
  render: () => (
    <div className="space-y-3 rounded-lg border p-4" style={{ width: '450px' }}>
      <div className="text-sm font-semibold">Pull Request Checklist</div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="pr-1" defaultChecked />
          <label
            htmlFor="pr-1"
            className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Code follows project style guidelines
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="pr-2" defaultChecked />
          <label
            htmlFor="pr-2"
            className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tests added for new functionality
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="pr-3" />
          <label
            htmlFor="pr-3"
            className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Documentation updated
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="pr-4" defaultChecked />
          <label
            htmlFor="pr-4"
            className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            All tests passing
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="pr-5" />
          <label
            htmlFor="pr-5"
            className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Reviewed by maintainer
          </label>
        </div>
      </div>
    </div>
  ),
};
