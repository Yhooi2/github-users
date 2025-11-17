import type { Meta, StoryObj } from '@storybook/react'
import { toast } from 'sonner'
import { Toaster } from './sonner'
import { Button } from './button'

const meta: Meta<typeof Toaster> = {
  title: 'UI/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster richColors closeButton />
      </>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success('Success! Your changes have been saved.')}>
      Show Success Toast
    </Button>
  ),
}

export const Error: Story = {
  render: () => (
    <Button variant="destructive" onClick={() => toast.error('Error! Something went wrong.')}>
      Show Error Toast
    </Button>
  ),
}

export const Warning: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.warning('Warning! Please check your input.')}>
      Show Warning Toast
    </Button>
  ),
}

export const Info: Story = {
  render: () => (
    <Button variant="secondary" onClick={() => toast.info('Info: New update available.')}>
      Show Info Toast
    </Button>
  ),
}

export const Default: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast('This is a default toast notification.')}>
      Show Default Toast
    </Button>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.success('Profile updated', {
          description: 'Your profile changes have been saved successfully.',
        })
      }
    >
      Toast with Description
    </Button>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast('New message received', {
          description: 'You have a new message from John Doe.',
          action: {
            label: 'View',
            onClick: () => {},
          },
        })
      }
    >
      Toast with Action
    </Button>
  ),
}

export const Promise: Story = {
  render: () => {
    const handlePromise = () => {
      const promise = new Promise((resolve) => setTimeout(() => resolve({ name: 'John' }), 2000))

      toast.promise(promise, {
        loading: 'Loading data...',
        success: (data: any) => `Successfully loaded ${data.name}'s profile!`,
        error: 'Failed to load data',
      })
    }

    return <Button onClick={handlePromise}>Show Promise Toast</Button>
  },
}

export const CustomDuration: Story = {
  render: () => (
    <Button onClick={() => toast('This toast will last 10 seconds', { duration: 10000 })}>
      Toast with Long Duration
    </Button>
  ),
}

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => toast.success('Success!')}>
        Success
      </Button>
      <Button size="sm" variant="destructive" onClick={() => toast.error('Error!')}>
        Error
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast.warning('Warning!')}>
        Warning
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.info('Info!')}>
        Info
      </Button>
      <Button size="sm" variant="ghost" onClick={() => toast('Default')}>
        Default
      </Button>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    let count = 0

    return (
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => {
            count++
            toast.success(`Toast #${count}`, {
              description: `You've clicked the button ${count} time${count > 1 ? 's' : ''}`,
            })
          }}
        >
          Show Sequential Toasts
        </Button>
        <Button variant="outline" onClick={() => toast.dismiss()}>
          Dismiss All Toasts
        </Button>
      </div>
    )
  },
}

export const LoadingState: Story = {
  render: () => {
    const handleLoading = () => {
      const id = toast.loading('Processing your request...')

      setTimeout(() => {
        toast.success('Request completed!', { id })
      }, 3000)
    }

    return <Button onClick={handleLoading}>Show Loading Toast</Button>
  },
}
