import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthRequiredModal } from "./AuthRequiredModal";

const meta: Meta<typeof AuthRequiredModal> = {
  title: "Auth/AuthRequiredModal",
  component: AuthRequiredModal,
  tags: ["autodocs"],
  argTypes: {
    onGitHubAuth: { action: "GitHub auth clicked" },
    onOpenChange: { action: "open changed" },
  },
};

export default meta;
type Story = StoryObj<typeof AuthRequiredModal>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: (open) => console.log("Modal open changed:", open),
    onGitHubAuth: () => console.log("GitHub auth clicked"),
    remaining: 0,
    limit: 5000,
  },
};

export const PartiallyUsed: Story = {
  args: {
    ...Default.args,
    remaining: 50,
  },
};

export const Closed: Story = {
  args: {
    ...Default.args,
    open: false,
  },
};
