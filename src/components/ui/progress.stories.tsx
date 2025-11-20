import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A progress bar component for showing completion status.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: () => <Progress value={60} className="w-[300px]" />,
};

export const Empty: Story = {
  render: () => <Progress value={0} className="w-[300px]" />,
};

export const Complete: Story = {
  render: () => <Progress value={100} className="w-[300px]" />,
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
      }, 500);
      return () => clearInterval(timer);
    }, []);

    return <Progress value={progress} className="w-[300px]" />;
  },
};

export const RepositoryClone: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <div className="flex justify-between text-sm">
        <span>Cloning repository...</span>
        <span>75%</span>
      </div>
      <Progress value={75} />
    </div>
  ),
};
