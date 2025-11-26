import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TabToggle } from "../TabToggle";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);

const tabs = [
  { value: "your" as const, label: "Your" },
  { value: "contrib" as const, label: "Contrib" },
];

describe("TabToggle", () => {
  it("renders all tabs", () => {
    renderWithTheme(
      <TabToggle tabs={tabs} activeTab="your" onChange={() => {}} />
    );
    expect(screen.getByText("Your")).toBeInTheDocument();
    expect(screen.getByText("Contrib")).toBeInTheDocument();
  });

  it("calls onChange when tab is clicked", () => {
    const handleChange = vi.fn();
    renderWithTheme(
      <TabToggle tabs={tabs} activeTab="your" onChange={handleChange} />
    );

    fireEvent.click(screen.getByText("Contrib"));

    expect(handleChange).toHaveBeenCalledWith("contrib");
  });

  it("renders with correct number of buttons", () => {
    renderWithTheme(
      <TabToggle tabs={tabs} activeTab="your" onChange={() => {}} />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <TabToggle
        tabs={tabs}
        activeTab="your"
        onChange={() => {}}
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with three tabs", () => {
    const threeTabs = [
      { value: "list" as const, label: "List" },
      { value: "grid" as const, label: "Grid" },
      { value: "timeline" as const, label: "Timeline" },
    ];
    renderWithTheme(
      <TabToggle tabs={threeTabs} activeTab="list" onChange={() => {}} />
    );

    expect(screen.getByText("List")).toBeInTheDocument();
    expect(screen.getByText("Grid")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
  });

  it("clicking active tab also triggers onChange", () => {
    const handleChange = vi.fn();
    renderWithTheme(
      <TabToggle tabs={tabs} activeTab="your" onChange={handleChange} />
    );

    fireEvent.click(screen.getByText("Your"));

    expect(handleChange).toHaveBeenCalledWith("your");
  });
});
