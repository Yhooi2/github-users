import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "./useReducedMotion";

describe("useReducedMotion", () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;
  let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

  beforeEach(() => {
    mockAddEventListener = vi.fn((event, handler) => {
      if (event === "change") {
        changeHandler = handler;
      }
    });
    mockRemoveEventListener = vi.fn();

    mockMatchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    changeHandler = null;
    vi.restoreAllMocks();
  });

  it("should return false when user does not prefer reduced motion", () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it("should return true when user prefers reduced motion", () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it("should query the correct media query", () => {
    renderHook(() => useReducedMotion());

    expect(mockMatchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)",
    );
  });

  it("should add event listener on mount", () => {
    renderHook(() => useReducedMotion());

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should remove event listener on unmount", () => {
    const { unmount } = renderHook(() => useReducedMotion());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should update when media query changes to reduced motion", () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });

  it("should update when media query changes from reduced motion to normal", () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);

    // Simulate media query change
    act(() => {
      if (changeHandler) {
        changeHandler({ matches: false } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(false);
  });
});
