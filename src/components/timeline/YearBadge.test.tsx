import { TooltipProvider } from "@/components/ui/tooltip";
import type { YearBadge as YearBadgeType } from "@/lib/year-badges";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { YearBadge } from "./YearBadge";

// Helper to wrap component with TooltipProvider
const renderWithTooltip = (ui: React.ReactElement) => {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
};

// Mock badge data
const createMockBadge = (type: YearBadgeType["type"]): YearBadgeType => {
  const badges: Record<YearBadgeType["type"], YearBadgeType> = {
    peak: {
      type: "peak",
      emoji: "🔥",
      label: "Peak Year",
      labelRu: "Самый продуктивный",
      color: "text-warning",
      description: "Год с максимальным количеством коммитов",
    },
    growth: {
      type: "growth",
      emoji: "📈",
      label: "Growth",
      labelRu: "Рост",
      color: "text-success",
      description: "Рост активности более 20% по сравнению с прошлым годом",
    },
    stable: {
      type: "stable",
      emoji: "📊",
      label: "Stable",
      labelRu: "Стабильный",
      color: "text-primary",
      description: "Стабильная активность (±20% от прошлого года)",
    },
    start: {
      type: "start",
      emoji: "🌱",
      label: "Beginning",
      labelRu: "Начало пути",
      color: "text-success",
      description: "Первый год активности на GitHub",
    },
    decline: {
      type: "decline",
      emoji: "📉",
      label: "Decline",
      labelRu: "Спад",
      color: "text-muted-foreground",
      description: "Снижение активности более 20% по сравнению с прошлым годом",
    },
    inactive: {
      type: "inactive",
      emoji: "⚫",
      label: "Inactive",
      labelRu: "Низкая активность",
      color: "text-muted-foreground",
      description: "Менее 100 коммитов за год",
    },
  };
  return badges[type];
};

describe("YearBadge", () => {
  describe("rendering", () => {
    it("renders peak badge emoji", () => {
      const badge = createMockBadge("peak");
      renderWithTooltip(<YearBadge badge={badge} />);

      expect(screen.getByText("🔥")).toBeInTheDocument();
    });

    it("renders growth badge emoji", () => {
      const badge = createMockBadge("growth");
      renderWithTooltip(<YearBadge badge={badge} />);

      expect(screen.getByText("📈")).toBeInTheDocument();
    });

    it("renders stable badge emoji", () => {
      const badge = createMockBadge("stable");
      renderWithTooltip(<YearBadge badge={badge} />);

      expect(screen.getByText("📊")).toBeInTheDocument();
    });

    it("renders start badge emoji", () => {
      const badge = createMockBadge("start");
      renderWithTooltip(<YearBadge badge={badge} />);

      expect(screen.getByText("🌱")).toBeInTheDocument();
    });

    it("renders decline badge emoji", () => {
      const badge = createMockBadge("decline");
      renderWithTooltip(<YearBadge badge={badge} />);

      expect(screen.getByText("📉")).toBeInTheDocument();
    });

    it("renders inactive badge emoji", () => {
      const badge = createMockBadge("inactive");
      renderWithTooltip(<YearBadge badge={badge} />);

      expect(screen.getByText("⚫")).toBeInTheDocument();
    });
  });

  describe("showLabel prop", () => {
    it("does not show label by default", () => {
      const badge = createMockBadge("peak");
      renderWithTooltip(<YearBadge badge={badge} />);

      expect(screen.queryByText("Самый продуктивный")).not.toBeInTheDocument();
    });

    it("shows Russian label when showLabel is true", () => {
      const badge = createMockBadge("peak");
      renderWithTooltip(<YearBadge badge={badge} showLabel />);

      expect(screen.getByText("Самый продуктивный")).toBeInTheDocument();
    });

    it("shows correct label for each badge type", () => {
      const types: YearBadgeType["type"][] = [
        "peak",
        "growth",
        "stable",
        "start",
        "decline",
        "inactive",
      ];
      const expectedLabels = [
        "Самый продуктивный",
        "Рост",
        "Стабильный",
        "Начало пути",
        "Спад",
        "Низкая активность",
      ];

      types.forEach((type, index) => {
        const badge = createMockBadge(type);
        const { unmount } = renderWithTooltip(
          <YearBadge badge={badge} showLabel />,
        );

        expect(screen.getByText(expectedLabels[index])).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("size variants", () => {
    it("uses medium size by default", () => {
      const badge = createMockBadge("peak");
      const { container } = renderWithTooltip(<YearBadge badge={badge} />);

      // Default size (md) should have text-sm class
      const badgeElement = container.querySelector(".text-sm");
      expect(badgeElement).toBeInTheDocument();
    });

    it("applies small size when size='sm'", () => {
      const badge = createMockBadge("peak");
      const { container } = renderWithTooltip(
        <YearBadge badge={badge} size="sm" />,
      );

      const badgeElement = container.querySelector(".text-xs");
      expect(badgeElement).toBeInTheDocument();
    });

    it("applies medium size when size='md'", () => {
      const badge = createMockBadge("peak");
      const { container } = renderWithTooltip(
        <YearBadge badge={badge} size="md" />,
      );

      const badgeElement = container.querySelector(".text-sm");
      expect(badgeElement).toBeInTheDocument();
    });
  });

  describe("color classes", () => {
    it("applies warning color for peak badge", () => {
      const badge = createMockBadge("peak");
      const { container } = renderWithTooltip(<YearBadge badge={badge} />);

      const badgeElement = container.querySelector(".text-warning");
      expect(badgeElement).toBeInTheDocument();
    });

    it("applies success color for growth badge", () => {
      const badge = createMockBadge("growth");
      const { container } = renderWithTooltip(<YearBadge badge={badge} />);

      const badgeElement = container.querySelector(".text-success");
      expect(badgeElement).toBeInTheDocument();
    });

    it("applies primary color for stable badge", () => {
      const badge = createMockBadge("stable");
      const { container } = renderWithTooltip(<YearBadge badge={badge} />);

      const badgeElement = container.querySelector(".text-primary");
      expect(badgeElement).toBeInTheDocument();
    });

    it("applies muted color for decline badge", () => {
      const badge = createMockBadge("decline");
      const { container } = renderWithTooltip(<YearBadge badge={badge} />);

      const badgeElement = container.querySelector(".text-muted-foreground");
      expect(badgeElement).toBeInTheDocument();
    });
  });

  describe("tooltip trigger", () => {
    it("wraps content in tooltip trigger", () => {
      const badge = createMockBadge("peak");
      const { container } = renderWithTooltip(<YearBadge badge={badge} />);

      // Tooltip trigger should be present (button or span with cursor-help)
      const trigger = container.querySelector(".cursor-help");
      expect(trigger).toBeInTheDocument();
    });

    it("badge is contained within tooltip trigger", () => {
      const badge = createMockBadge("growth");
      renderWithTooltip(<YearBadge badge={badge} />);

      // The emoji should be rendered
      expect(screen.getByText("📈")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("has cursor-help class for tooltip indication", () => {
      const badge = createMockBadge("peak");
      const { container } = renderWithTooltip(<YearBadge badge={badge} />);

      const badgeElement = container.querySelector(".cursor-help");
      expect(badgeElement).toBeInTheDocument();
    });

    it("has inline-flex for proper layout", () => {
      const badge = createMockBadge("peak");
      const { container } = renderWithTooltip(<YearBadge badge={badge} />);

      const badgeElement = container.querySelector(".inline-flex");
      expect(badgeElement).toBeInTheDocument();
    });

    it("has gap for spacing between emoji and label", () => {
      const badge = createMockBadge("peak");
      const { container } = renderWithTooltip(
        <YearBadge badge={badge} showLabel />,
      );

      const badgeElement = container.querySelector(".gap-1");
      expect(badgeElement).toBeInTheDocument();
    });
  });

  describe("label styling", () => {
    it("applies font-medium to label", () => {
      const badge = createMockBadge("peak");
      const { container } = renderWithTooltip(
        <YearBadge badge={badge} showLabel />,
      );

      const labelElement = container.querySelector(".font-medium");
      expect(labelElement).toBeInTheDocument();
    });
  });
});
