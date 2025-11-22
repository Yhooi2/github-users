import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BREAKPOINTS, useResponsive } from "./useResponsive";

describe("useResponsive", () => {
  const originalInnerWidth = window.innerWidth;
  let resizeHandler: (() => void) | null = null;

  beforeEach(() => {
    vi.spyOn(window, "addEventListener").mockImplementation((event, handler) => {
      if (event === "resize") {
        resizeHandler = handler as () => void;
      }
    });
    vi.spyOn(window, "removeEventListener").mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: originalInnerWidth,
    });
    resizeHandler = null;
    vi.restoreAllMocks();
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: width,
    });
  };

  describe("BREAKPOINTS", () => {
    it("should have correct breakpoint values", () => {
      expect(BREAKPOINTS.mobile).toBe(0);
      expect(BREAKPOINTS.tablet).toBe(768);
      expect(BREAKPOINTS.desktop).toBe(1440);
    });
  });

  describe("initial state", () => {
    it("should detect mobile breakpoint for small screens", () => {
      setWindowWidth(375);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("mobile");
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.width).toBe(375);
    });

    it("should detect tablet breakpoint for medium screens", () => {
      setWindowWidth(768);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("tablet");
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.width).toBe(768);
    });

    it("should detect tablet breakpoint for 1024px", () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("tablet");
      expect(result.current.isTablet).toBe(true);
    });

    it("should detect desktop breakpoint for large screens", () => {
      setWindowWidth(1440);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("desktop");
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.width).toBe(1440);
    });

    it("should detect desktop for very large screens", () => {
      setWindowWidth(2560);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("desktop");
      expect(result.current.isDesktop).toBe(true);
    });
  });

  describe("resize handling", () => {
    it("should add resize event listener on mount", () => {
      setWindowWidth(768);
      renderHook(() => useResponsive());

      expect(window.addEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );
    });

    it("should remove resize event listener on unmount", () => {
      setWindowWidth(768);
      const { unmount } = renderHook(() => useResponsive());

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );
    });

    it("should update state when window is resized to mobile", () => {
      setWindowWidth(1440);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.isDesktop).toBe(true);

      act(() => {
        setWindowWidth(375);
        resizeHandler?.();
      });

      expect(result.current.breakpoint).toBe("mobile");
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.width).toBe(375);
    });

    it("should update state when window is resized to tablet", () => {
      setWindowWidth(375);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.isMobile).toBe(true);

      act(() => {
        setWindowWidth(768);
        resizeHandler?.();
      });

      expect(result.current.breakpoint).toBe("tablet");
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isMobile).toBe(false);
    });

    it("should update state when window is resized to desktop", () => {
      setWindowWidth(768);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.isTablet).toBe(true);

      act(() => {
        setWindowWidth(1440);
        resizeHandler?.();
      });

      expect(result.current.breakpoint).toBe("desktop");
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.isTablet).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle exact breakpoint boundaries correctly", () => {
      // Just below tablet
      setWindowWidth(767);
      const { result: result1 } = renderHook(() => useResponsive());
      expect(result1.current.breakpoint).toBe("mobile");

      // Exact tablet
      setWindowWidth(768);
      const { result: result2 } = renderHook(() => useResponsive());
      expect(result2.current.breakpoint).toBe("tablet");

      // Just below desktop
      setWindowWidth(1439);
      const { result: result3 } = renderHook(() => useResponsive());
      expect(result3.current.breakpoint).toBe("tablet");

      // Exact desktop
      setWindowWidth(1440);
      const { result: result4 } = renderHook(() => useResponsive());
      expect(result4.current.breakpoint).toBe("desktop");
    });
  });
});
