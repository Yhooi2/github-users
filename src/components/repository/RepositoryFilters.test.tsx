import type { RepositoryFilter } from "@/types/filters";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RepositoryFilters } from "./RepositoryFilters";

describe("RepositoryFilters", () => {
  const mockOnFilterChange = vi.fn();
  const mockOnClearFilters = vi.fn();

  const defaultProps = {
    filters: {},
    onFilterChange: mockOnFilterChange,
    onClearFilters: mockOnClearFilters,
    availableLanguages: ["TypeScript", "JavaScript", "Python"],
  };

  /**
   * Helper function to expand filters by clicking the header
   * Filters are collapsed by default, so we need to expand them first
   */
  const expandFilters = async () => {
    const user = userEvent.setup();
    const filterHeader = screen.getByText("Filters");
    await user.click(filterHeader);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render search input", async () => {
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      expect(screen.getByLabelText("Search")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search repositories..."),
      ).toBeInTheDocument();
    });

    it("should render language select when languages are available", async () => {
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      expect(screen.getByLabelText("Language")).toBeInTheDocument();
    });

    it("should not render language select when no languages available", async () => {
      render(<RepositoryFilters {...defaultProps} availableLanguages={[]} />);
      await expandFilters();

      expect(screen.queryByLabelText("Language")).not.toBeInTheDocument();
    });

    it("should render minimum stars input", async () => {
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      expect(screen.getByLabelText("Minimum Stars")).toBeInTheDocument();
    });

    it("should render all boolean filter checkboxes", async () => {
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      expect(
        screen.getByLabelText("Original repositories only"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Forked repositories only"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Hide archived")).toBeInTheDocument();
      expect(screen.getByLabelText("Has topics")).toBeInTheDocument();
      expect(screen.getByLabelText("Has license")).toBeInTheDocument();
    });

    it("should not render clear filters button when no filters active", async () => {
      render(<RepositoryFilters {...defaultProps} hasActiveFilters={false} />);
      await expandFilters();

      expect(
        screen.queryByRole("button", { name: /clear/i }),
      ).not.toBeInTheDocument();
    });

    it("should render clear filters button when filters are active", async () => {
      render(<RepositoryFilters {...defaultProps} hasActiveFilters={true} />);
      await expandFilters();

      expect(
        screen.getByRole("button", { name: /clear/i }),
      ).toBeInTheDocument();
    });

    it("should display active filter count badge", () => {
      render(
        <RepositoryFilters
          {...defaultProps}
          hasActiveFilters={true}
          activeFilterCount={3}
        />,
      );

      // Badge is visible even when collapsed
      expect(screen.getByLabelText("3 active filters")).toBeInTheDocument();
    });

    it("should render in compact mode without card wrapper", () => {
      const { container } = render(
        <RepositoryFilters {...defaultProps} compact />,
      );

      // Should not have card elements
      expect(
        container.querySelector('[data-slot="card"]'),
      ).not.toBeInTheDocument();
      // In compact mode, filters are always visible (no collapse)
      expect(screen.getByLabelText("Search")).toBeInTheDocument();
    });
  });

  describe("Search Query", () => {
    it("should call onFilterChange when typing in search input", async () => {
      const user = userEvent.setup();
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      const searchInput = screen.getByPlaceholderText("Search repositories...");
      await user.type(searchInput, "test");

      // onChange is called for each character separately
      expect(mockOnFilterChange).toHaveBeenCalledWith("searchQuery", "t");
      expect(mockOnFilterChange).toHaveBeenCalledWith("searchQuery", "e");
      expect(mockOnFilterChange).toHaveBeenCalledWith("searchQuery", "s");
      expect(mockOnFilterChange).toHaveBeenCalledWith("searchQuery", "t");
      expect(mockOnFilterChange).toHaveBeenCalledTimes(4);
    });

    it("should display current search query value", async () => {
      render(
        <RepositoryFilters
          {...defaultProps}
          filters={{ searchQuery: "react-app" }}
        />,
      );
      await expandFilters();

      const searchInput = screen.getByPlaceholderText("Search repositories...");
      expect(searchInput).toHaveValue("react-app");
    });

    it("should call onFilterChange with undefined when search is cleared", async () => {
      const user = userEvent.setup();
      render(
        <RepositoryFilters
          {...defaultProps}
          filters={{ searchQuery: "test" }}
        />,
      );
      await expandFilters();

      const searchInput = screen.getByPlaceholderText("Search repositories...");
      await user.clear(searchInput);

      expect(mockOnFilterChange).toHaveBeenCalledWith("searchQuery", undefined);
    });
  });

  describe("Language Filter", () => {
    it("should display selected language", async () => {
      render(
        <RepositoryFilters
          {...defaultProps}
          filters={{ language: "TypeScript" }}
        />,
      );
      await expandFilters();

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    // Note: @radix-ui/react-select has issues with hasPointerCapture in jsdom
    // Interactive tests with Select are skipped
  });

  describe("Minimum Stars", () => {
    it("should call onFilterChange when minimum stars is set", async () => {
      const user = userEvent.setup();
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      const starsInput = screen.getByLabelText("Minimum Stars");
      await user.type(starsInput, "100");

      // onChange is called for each digit (type="number" behaves differently in tests)
      expect(mockOnFilterChange).toHaveBeenCalled();
      // Verify it was called with minStars key
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        "minStars",
        expect.any(Number),
      );
    });

    it("should display current minimum stars value", async () => {
      render(
        <RepositoryFilters {...defaultProps} filters={{ minStars: 50 }} />,
      );
      await expandFilters();

      const starsInput = screen.getByLabelText("Minimum Stars");
      expect(starsInput).toHaveValue(50);
    });

    it("should call onFilterChange with undefined when stars input is cleared", async () => {
      const user = userEvent.setup();
      render(
        <RepositoryFilters {...defaultProps} filters={{ minStars: 100 }} />,
      );
      await expandFilters();

      const starsInput = screen.getByLabelText("Minimum Stars");
      await user.clear(starsInput);

      expect(mockOnFilterChange).toHaveBeenCalledWith("minStars", undefined);
    });
  });

  describe("Boolean Filters", () => {
    it('should call onFilterChange when "Original only" is checked', async () => {
      const user = userEvent.setup();
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      const checkbox = screen.getByLabelText("Original repositories only");
      await user.click(checkbox);

      expect(mockOnFilterChange).toHaveBeenCalledWith("originalOnly", true);
    });

    it('should call onFilterChange with undefined when "Original only" is unchecked', async () => {
      const user = userEvent.setup();
      render(
        <RepositoryFilters
          {...defaultProps}
          filters={{ originalOnly: true }}
        />,
      );
      await expandFilters();

      const checkbox = screen.getByLabelText("Original repositories only");
      await user.click(checkbox);

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        "originalOnly",
        undefined,
      );
    });

    it('should call onFilterChange when "Forks only" is checked', async () => {
      const user = userEvent.setup();
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      const checkbox = screen.getByLabelText("Forked repositories only");
      await user.click(checkbox);

      expect(mockOnFilterChange).toHaveBeenCalledWith("forksOnly", true);
    });

    it('should call onFilterChange when "Hide archived" is checked', async () => {
      const user = userEvent.setup();
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      const checkbox = screen.getByLabelText("Hide archived");
      await user.click(checkbox);

      expect(mockOnFilterChange).toHaveBeenCalledWith("hideArchived", true);
    });

    it('should call onFilterChange when "Has topics" is checked', async () => {
      const user = userEvent.setup();
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      const checkbox = screen.getByLabelText("Has topics");
      await user.click(checkbox);

      expect(mockOnFilterChange).toHaveBeenCalledWith("hasTopics", true);
    });

    it('should call onFilterChange when "Has license" is checked', async () => {
      const user = userEvent.setup();
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      const checkbox = screen.getByLabelText("Has license");
      await user.click(checkbox);

      expect(mockOnFilterChange).toHaveBeenCalledWith("hasLicense", true);
    });

    it("should display checked state for active boolean filters", async () => {
      const filters: RepositoryFilter = {
        originalOnly: true,
        hideArchived: true,
        hasTopics: true,
      };

      render(<RepositoryFilters {...defaultProps} filters={filters} />);
      await expandFilters();

      expect(screen.getByLabelText("Original repositories only")).toBeChecked();
      expect(screen.getByLabelText("Hide archived")).toBeChecked();
      expect(screen.getByLabelText("Has topics")).toBeChecked();
      expect(
        screen.getByLabelText("Forked repositories only"),
      ).not.toBeChecked();
      expect(screen.getByLabelText("Has license")).not.toBeChecked();
    });
  });

  describe("Clear Filters", () => {
    it("should call onClearFilters when clear button is clicked", async () => {
      const user = userEvent.setup();
      render(<RepositoryFilters {...defaultProps} hasActiveFilters={true} />);
      await expandFilters();

      const clearButton = screen.getByRole("button", { name: /clear/i });
      await user.click(clearButton);

      expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for all inputs", async () => {
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      expect(screen.getByLabelText("Search")).toBeInTheDocument();
      expect(screen.getByLabelText("Language")).toBeInTheDocument();
      expect(screen.getByLabelText("Minimum Stars")).toBeInTheDocument();
    });

    it("should have proper labels for all checkboxes", async () => {
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      expect(
        screen.getByLabelText("Original repositories only"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Forked repositories only"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Hide archived")).toBeInTheDocument();
      expect(screen.getByLabelText("Has topics")).toBeInTheDocument();
      expect(screen.getByLabelText("Has license")).toBeInTheDocument();
    });

    it("should have aria-label for clear filters button", async () => {
      render(<RepositoryFilters {...defaultProps} hasActiveFilters={true} />);
      await expandFilters();

      const clearButton = screen.getByRole("button", {
        name: "Clear all filters",
      });
      expect(clearButton).toBeInTheDocument();
    });

    it("should have aria-label for active filters badge", () => {
      render(
        <RepositoryFilters
          {...defaultProps}
          hasActiveFilters={true}
          activeFilterCount={2}
        />,
      );

      // Badge is visible even when collapsed
      expect(screen.getByLabelText("2 active filters")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty filters object", async () => {
      render(<RepositoryFilters {...defaultProps} filters={{}} />);
      await expandFilters();

      const searchInput = screen.getByPlaceholderText("Search repositories...");
      expect(searchInput).toHaveValue("");

      const starsInput = screen.getByLabelText("Minimum Stars");
      expect(starsInput).toHaveValue(null);
    });

    it("should handle all filters active", async () => {
      const allFilters: RepositoryFilter = {
        searchQuery: "test",
        language: "TypeScript",
        minStars: 100,
        originalOnly: true,
        forksOnly: false,
        hideArchived: true,
        hasTopics: true,
        hasLicense: true,
      };

      render(
        <RepositoryFilters
          {...defaultProps}
          filters={allFilters}
          hasActiveFilters={true}
          activeFilterCount={7}
        />,
      );
      await expandFilters();

      expect(screen.getByPlaceholderText("Search repositories...")).toHaveValue(
        "test",
      );
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByLabelText("Minimum Stars")).toHaveValue(100);
      expect(screen.getByLabelText("Original repositories only")).toBeChecked();
      expect(screen.getByLabelText("Hide archived")).toBeChecked();
      expect(screen.getByLabelText("Has topics")).toBeChecked();
      expect(screen.getByLabelText("Has license")).toBeChecked();
    });

    it("should handle negative minimum stars input", async () => {
      const user = userEvent.setup();
      render(<RepositoryFilters {...defaultProps} />);
      await expandFilters();

      const starsInput = screen.getByLabelText("Minimum Stars");
      await user.type(starsInput, "-10");

      // Browser should prevent negative input due to min="0"
      // But we still handle it in onChange
      expect(mockOnFilterChange).toHaveBeenCalled();
    });
  });
});
