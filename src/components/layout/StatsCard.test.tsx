import { render, screen } from "@testing-library/react";
import { Users } from "lucide-react";
import { describe, expect, it } from "vitest";
import { StatsCard } from "./StatsCard";

describe("StatsCard", () => {
  it("should render title and value", () => {
    render(<StatsCard title="Followers" value={100} />);
    expect(screen.getByText("Followers")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should render with icon", () => {
    const { container } = render(
      <StatsCard title="Followers" value={100} icon={Users} />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render description", () => {
    render(
      <StatsCard title="Followers" value={100} description="Total followers" />,
    );
    expect(screen.getByText("Total followers")).toBeInTheDocument();
  });

  it("should render trend up", () => {
    const { container } = render(
      <StatsCard title="Followers" value={100} trend="up" trendValue="+12%" />,
    );
    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(container.querySelector(".text-green-600")).toBeInTheDocument();
  });

  it("should render trend down", () => {
    const { container } = render(
      <StatsCard title="Followers" value={100} trend="down" trendValue="-5%" />,
    );
    expect(screen.getByText("-5%")).toBeInTheDocument();
    expect(container.querySelector(".text-red-600")).toBeInTheDocument();
  });

  it("should render trend neutral", () => {
    const { container } = render(
      <StatsCard
        title="Followers"
        value={100}
        trend="neutral"
        trendValue="0%"
      />,
    );
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(
      container.querySelector(".text-muted-foreground"),
    ).toBeInTheDocument();
  });

  it("should render badge", () => {
    render(
      <StatsCard title="Followers" value={100} badge={<span>New</span>} />,
    );
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("should render footer", () => {
    render(
      <StatsCard
        title="Followers"
        value={100}
        footer={<div>Footer content</div>}
      />,
    );
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("should render string value", () => {
    render(<StatsCard title="Followers" value="1.5k" />);
    expect(screen.getByText("1.5k")).toBeInTheDocument();
  });

  it("should render without optional props", () => {
    render(<StatsCard title="Followers" value={100} />);
    expect(screen.getByText("Followers")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
