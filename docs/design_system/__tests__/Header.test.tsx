import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "../Header";
import { ThemeProvider } from "../../context/ThemeContext";
import { Settings, Bell } from "lucide-react";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

describe("Header", () => {
  it("renders with default title", () => {
    renderWithTheme(<Header />);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    renderWithTheme(<Header title="Dashboard" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const { container } = renderWithTheme(<Header icon={Settings} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders leftContent instead of default", () => {
    renderWithTheme(
      <Header leftContent={<span data-testid="left">Left Content</span>} />
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
  });

  it("renders rightContent", () => {
    renderWithTheme(
      <Header rightContent={<span data-testid="right">Right Content</span>} />
    );
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("does not render rightContent when not provided", () => {
    renderWithTheme(<Header />);
    // rightContent is not rendered, so there's no right section
    const rightContent = screen.queryByTestId("right");
    expect(rightContent).not.toBeInTheDocument();
  });

  it("renders with both leftContent and rightContent", () => {
    renderWithTheme(
      <Header
        leftContent={<span>Left</span>}
        rightContent={<span>Right</span>}
      />
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(<Header className="custom-class" />);
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("has sticky positioning", () => {
    const { container } = renderWithTheme(<Header />);
    expect(container.querySelector(".sticky")).toBeInTheDocument();
  });

  it("has backdrop blur", () => {
    const { container } = renderWithTheme(<Header />);
    expect(container.querySelector(".backdrop-blur-xl")).toBeInTheDocument();
  });

  it("has z-50 for proper layering", () => {
    const { container } = renderWithTheme(<Header />);
    expect(container.querySelector(".z-50")).toBeInTheDocument();
  });

  it("renders icon button with gradient", () => {
    const { container } = renderWithTheme(<Header />);
    const iconButton = container.querySelector(".rounded-xl");
    expect(iconButton).toBeInTheDocument();
    expect(iconButton).toHaveAttribute("style");
  });
});
