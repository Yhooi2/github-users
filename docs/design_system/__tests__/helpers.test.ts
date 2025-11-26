import { describe, expect, it } from "vitest";
import {
  getStatusType,
  createGlowMap,
  createBgMap,
  createBorderMap,
  getMetricColors,
} from "../helpers";
import { themeStyles } from "../../styles/tokens";

describe("helpers", () => {
  describe("getStatusType", () => {
    it("converts good to green", () => {
      expect(getStatusType("good")).toBe("green");
    });

    it("converts warning to yellow", () => {
      expect(getStatusType("warning")).toBe("yellow");
    });

    it("converts critical to red", () => {
      expect(getStatusType("critical")).toBe("red");
    });
  });

  describe("createGlowMap", () => {
    it("creates correct glow map for glass theme", () => {
      const t = themeStyles.glass;
      const glowMap = createGlowMap(t);

      expect(glowMap.blue).toBe(t.glowBlue);
      expect(glowMap.violet).toBe(t.glowViolet);
      expect(glowMap.purple).toBe(t.glowViolet);
      expect(glowMap.cyan).toBe(t.glowCyan);
    });

    it("works with all themes", () => {
      const themes = ["light", "aurora", "glass"] as const;
      themes.forEach((theme) => {
        const t = themeStyles[theme];
        const glowMap = createGlowMap(t);
        expect(glowMap).toHaveProperty("blue");
        expect(glowMap).toHaveProperty("violet");
        expect(glowMap).toHaveProperty("cyan");
      });
    });
  });

  describe("createBgMap", () => {
    it("creates correct background map", () => {
      const t = themeStyles.glass;
      const bgMap = createBgMap(t);

      expect(bgMap.subtle).toBe(t.glassSubtleBg);
      expect(bgMap.medium).toBe(t.glassMediumBg);
      expect(bgMap.strong).toBe(t.glassStrongBg);
    });
  });

  describe("createBorderMap", () => {
    it("creates correct border map", () => {
      const t = themeStyles.glass;
      const borderMap = createBorderMap(t);

      expect(borderMap.subtle).toBe(t.glassSubtleBorder);
      expect(borderMap.medium).toBe(t.glassMediumBorder);
      expect(borderMap.strong).toBe(t.glassStrongBorder);
    });
  });

  describe("getMetricColors", () => {
    it("returns correct colors for emerald", () => {
      const t = themeStyles.glass;
      const colors = getMetricColors("emerald", t);

      expect(colors.bg).toBe(t.metricEmeraldBg);
      expect(colors.text).toBe(t.metricEmeraldText);
      expect(colors.border).toBe(t.metricEmeraldBorder);
      expect(colors.gradient).toBe("from-emerald-400 to-emerald-500");
    });

    it("returns correct colors for amber", () => {
      const t = themeStyles.glass;
      const colors = getMetricColors("amber", t);

      expect(colors.bg).toBe(t.metricAmberBg);
      expect(colors.text).toBe(t.metricAmberText);
      expect(colors.gradient).toBe("from-amber-400 to-amber-500");
    });

    it("returns correct colors for blue", () => {
      const t = themeStyles.glass;
      const colors = getMetricColors("blue", t);

      expect(colors.bg).toBe(t.metricBlueBg);
      expect(colors.text).toBe(t.metricBlueText);
      expect(colors.gradient).toBe("from-blue-400 to-blue-500");
    });

    it("returns correct colors for red", () => {
      const t = themeStyles.glass;
      const colors = getMetricColors("red", t);

      expect(colors.bg).toBe(t.metricRedBg);
      expect(colors.text).toBe(t.metricRedText);
      expect(colors.gradient).toBe("from-red-400 to-red-500");
    });

    it("works with all themes", () => {
      const themes = ["light", "aurora", "glass"] as const;
      const colors = ["emerald", "amber", "blue", "red"] as const;

      themes.forEach((theme) => {
        colors.forEach((color) => {
          const t = themeStyles[theme];
          const result = getMetricColors(color, t);
          expect(result).toHaveProperty("bg");
          expect(result).toHaveProperty("text");
          expect(result).toHaveProperty("border");
          expect(result).toHaveProperty("gradient");
        });
      });
    });
  });
});
