import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "../Alert";
import { ThemeProvider } from "../../context/ThemeContext";
import { Bell } from "lucide-react";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

describe("Alert", () => {
  it("renders danger variant", () => {
    renderWithTheme(<Alert variant="danger">Error message</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("renders warning variant", () => {
    renderWithTheme(<Alert variant="warning">Warning message</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Warning message")).toBeInTheDocument();
  });

  it("renders info variant", () => {
    renderWithTheme(<Alert variant="info">Info message</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  it("renders with title and children", () => {
    renderWithTheme(
      <Alert variant="danger" title="Error Title">
        Error description
      </Alert>
    );
    expect(screen.getByText("Error Title")).toBeInTheDocument();
    expect(screen.getByText("Error description")).toBeInTheDocument();
  });

  it("renders custom icon", () => {
    const { container } = renderWithTheme(
      <Alert variant="info" icon={Bell}>
        Custom icon alert
      </Alert>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <Alert variant="danger" className="custom-class">
        Message
      </Alert>
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("has proper accessibility role", () => {
    renderWithTheme(<Alert variant="warning">Message</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
