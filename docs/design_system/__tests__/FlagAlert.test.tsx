import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FlagAlert } from "../FlagAlert";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

describe("FlagAlert", () => {
  it("renders danger variant with title", () => {
    renderWithTheme(
      <FlagAlert type="danger" title="No collaboration" />
    );
    expect(screen.getByText("No collaboration")).toBeInTheDocument();
  });

  it("renders warning variant with title", () => {
    renderWithTheme(
      <FlagAlert type="warning" title="Low activity" />
    );
    expect(screen.getByText("Low activity")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    renderWithTheme(
      <FlagAlert
        type="danger"
        title="No collaboration"
        description="0 PRs to external repos · 0 code reviews"
      />
    );
    expect(screen.getByText("0 PRs to external repos · 0 code reviews")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = renderWithTheme(
      <FlagAlert type="danger" title="No collaboration" />
    );
    // Should only have the title, not a description paragraph
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("renders status indicator for danger type", () => {
    const { container } = renderWithTheme(
      <FlagAlert type="danger" title="Error" />
    );
    // StatusIndicator renders a colored dot
    expect(container.querySelector(".rounded-full")).toBeInTheDocument();
  });

  it("renders status indicator for warning type", () => {
    const { container } = renderWithTheme(
      <FlagAlert type="warning" title="Warning" />
    );
    expect(container.querySelector(".rounded-full")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <FlagAlert type="danger" title="Test" className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("applies correct styling for danger type", () => {
    const { container } = renderWithTheme(
      <FlagAlert type="danger" title="Danger alert" />
    );
    const alertDiv = container.querySelector(".rounded-xl");
    expect(alertDiv).toBeInTheDocument();
    // Verify it has inline styles applied
    expect(alertDiv).toHaveAttribute("style");
  });

  it("applies correct styling for warning type", () => {
    const { container } = renderWithTheme(
      <FlagAlert type="warning" title="Warning alert" />
    );
    const alertDiv = container.querySelector(".rounded-xl");
    expect(alertDiv).toBeInTheDocument();
    // Verify it has inline styles applied
    expect(alertDiv).toHaveAttribute("style");
  });
});
