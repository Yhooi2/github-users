import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import SearchForm from './SearchForm'
import { Toaster } from '@/components/ui/sonner'

const meta: Meta<typeof SearchForm> = {
  title: 'Components/SearchForm',
  component: SearchForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster richColors closeButton />
      </>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    userName: {
      control: 'text',
      description: 'Current username value',
    },
    setUserName: {
      action: 'setUserName',
      description: 'Callback to update username',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Wrapper component to handle state
const SearchFormWrapper = (args: { userName: string }) => {
  const [userName, setUserName] = useState(args.userName)

  return (
    <div className="w-[400px]">
      <SearchForm
        userName={userName}
        setUserName={(name) => {
          setUserName(name)
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <SearchFormWrapper userName="" />,
}

export const WithInitialValue: Story = {
  render: () => <SearchFormWrapper userName="octocat" />,
}

export const WithLongUsername: Story = {
  render: () => <SearchFormWrapper userName="this-is-a-very-long-github-username" />,
}

export const EmptyState: Story = {
  render: () => <SearchFormWrapper userName="" />,
  parameters: {
    docs: {
      description: {
        story: 'Shows error toast when submitting an empty form',
      },
    },
  },
}

export const Interactive: Story = {
  render: () => {
    const [userName, setUserName] = useState('')

    return (
      <div className="w-[500px] p-5">
        <h3 className="mb-4">Try searching for a GitHub user</h3>
        <SearchForm userName={userName} setUserName={setUserName} />
        {userName && (
          <div className="bg-muted mt-4 rounded-md p-3">
            <strong>Current username:</strong> {userName}
          </div>
        )}
      </div>
    )
  },
}
