import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollArea } from "./scroll-area";

describe("ScrollArea", () => {
  describe("rendering", () => {
    it("should render scroll area", () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>,
      );
      expect(
        container.querySelector('[data-slot="scroll-area"]'),
      ).toBeInTheDocument();
    });

    it("should render viewport", () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>,
      );
      expect(
        container.querySelector('[data-slot="scroll-area-viewport"]'),
      ).toBeInTheDocument();
    });

    it("should render children", () => {
      const { getByText } = render(
        <ScrollArea>
          <div>Test Content</div>
        </ScrollArea>,
      );
      expect(getByText("Test Content")).toBeInTheDocument();
    });
  });

  describe("data attributes", () => {
    it('should have data-slot="scroll-area" on root', () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>,
      );
      expect(
        container.querySelector('[data-slot="scroll-area"]'),
      ).toBeInTheDocument();
    });

    it('should have data-slot="scroll-area-viewport" on viewport', () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>,
      );
      expect(
        container.querySelector('[data-slot="scroll-area-viewport"]'),
      ).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should accept custom className on root", () => {
      const { container } = render(
        <ScrollArea className="custom-scroll">
          <div>Content</div>
        </ScrollArea>,
      );
      const scrollArea = container.querySelector('[data-slot="scroll-area"]');
      expect(scrollArea).toHaveClass("custom-scroll");
    });

    it("should have relative positioning", () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>,
      );
      const scrollArea = container.querySelector('[data-slot="scroll-area"]');
      expect(scrollArea).toHaveClass("relative");
    });
  });

  describe("viewport", () => {
    it("should render viewport with proper styling", () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>,
      );
      const viewport = container.querySelector(
        '[data-slot="scroll-area-viewport"]',
      );
      expect(viewport).toHaveClass("size-full");
      expect(viewport).toHaveClass("rounded-[inherit]");
    });

    it("should render viewport with focus styling", () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>,
      );
      const viewport = container.querySelector(
        '[data-slot="scroll-area-viewport"]',
      );
      expect(viewport).toHaveClass("outline-none");
    });
  });

  describe("edge cases", () => {
    it("should render with long content", () => {
      const { getByText } = render(
        <ScrollArea>
          <div>{Array.from({ length: 100 }).map((_, i) => `Item ${i} `)}</div>
        </ScrollArea>,
      );
      expect(getByText(/Item 0/)).toBeInTheDocument();
    });

    it("should render with empty content", () => {
      const { container } = render(<ScrollArea />);
      expect(
        container.querySelector('[data-slot="scroll-area"]'),
      ).toBeInTheDocument();
    });
  });
});
