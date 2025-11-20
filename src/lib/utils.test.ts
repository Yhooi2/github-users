/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should combine multiple class strings", () => {
    const result = cn("px-4", "py-2", "bg-blue-500");
    expect(result).toBe("px-4 py-2 bg-blue-500");
  });

  it("should handle conditional classes with falsy values", () => {
    const isActive = false;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class");
  });

  it("should handle conditional classes with truthy values", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("should merge conflicting Tailwind classes correctly", () => {
    // Later padding should override earlier padding
    const result = cn("px-4 py-2", "px-2");
    expect(result).toBe("py-2 px-2");
  });

  it("should handle array inputs", () => {
    const result = cn(["flex", "items-center"], "justify-center");
    expect(result).toBe("flex items-center justify-center");
  });

  it("should handle object syntax", () => {
    const result = cn({
      "text-blue-500": true,
      "text-red-500": false,
      "font-bold": true,
    });
    expect(result).toBe("text-blue-500 font-bold");
  });

  it("should handle complex combinations of strings, arrays, and objects", () => {
    const isLarge = true;
    const isDisabled = false;

    const result = cn(
      "base-class",
      ["flex", "items-center"],
      {
        "text-lg": isLarge,
        "opacity-50": isDisabled,
      },
      isLarge && "p-4",
    );

    expect(result).toBe("base-class flex items-center text-lg p-4");
  });

  it("should handle empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle undefined and null values", () => {
    const result = cn("base-class", undefined, null, "other-class");
    expect(result).toBe("base-class other-class");
  });

  it("should merge conflicting margin/padding classes", () => {
    // Test multiple Tailwind utility conflicts
    const result = cn("m-4 p-2", "m-2 p-4");
    expect(result).toBe("m-2 p-4");
  });

  it("should merge conflicting color classes", () => {
    const result = cn("text-blue-500 bg-red-500", "text-green-500");
    expect(result).toBe("bg-red-500 text-green-500");
  });

  it("should preserve non-Tailwind classes", () => {
    const result = cn("custom-class-1", "px-4", "custom-class-2");
    expect(result).toBe("custom-class-1 px-4 custom-class-2");
  });

  it("should handle responsive Tailwind classes", () => {
    const result = cn("text-sm md:text-base lg:text-lg", "text-xs");
    // twMerge should intelligently handle responsive variants
    expect(result).toContain("md:text-base");
    expect(result).toContain("lg:text-lg");
  });
});
