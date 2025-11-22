import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProgressiveDisclosure } from "./useProgressiveDisclosure";

describe("useProgressiveDisclosure", () => {
  let originalLocation: Location;
  let mockReplaceState: ReturnType<typeof vi.fn>;
  let popstateHandler: ((event: PopStateEvent) => void) | null = null;

  beforeEach(() => {
    originalLocation = window.location;
    mockReplaceState = vi.fn();

    // Mock window.history.replaceState
    Object.defineProperty(window, "history", {
      writable: true,
      value: {
        replaceState: mockReplaceState,
        pushState: vi.fn(),
      },
    });

    // Mock window.location
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        href: "http://localhost:3000/",
        search: "",
        pathname: "/",
      },
    });

    // Capture popstate handler
    vi.spyOn(window, "addEventListener").mockImplementation((event, handler) => {
      if (event === "popstate") {
        popstateHandler = handler as (event: PopStateEvent) => void;
      }
    });
    vi.spyOn(window, "removeEventListener").mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
    popstateHandler = null;
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("should initialize with empty expanded projects", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      expect(result.current.expandedProjects.size).toBe(0);
    });

    it("should initialize with modal closed", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      expect(result.current.modalOpen).toBe(false);
      expect(result.current.selectedProjectId).toBeNull();
    });

    it("should initialize with default tab", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      expect(result.current.activeTab).toBe("overview");
    });

    it("should restore modal state from URL", () => {
      Object.defineProperty(window, "location", {
        writable: true,
        value: {
          href: "http://localhost:3000/?modal=project-123&tab=code",
          search: "?modal=project-123&tab=code",
          pathname: "/",
        },
      });

      const { result } = renderHook(() => useProgressiveDisclosure());

      expect(result.current.modalOpen).toBe(true);
      expect(result.current.selectedProjectId).toBe("project-123");
      expect(result.current.activeTab).toBe("code");
    });

    it("should use default tab if URL tab is invalid", () => {
      Object.defineProperty(window, "location", {
        writable: true,
        value: {
          href: "http://localhost:3000/?modal=project-123&tab=invalid",
          search: "?modal=project-123&tab=invalid",
          pathname: "/",
        },
      });

      const { result } = renderHook(() => useProgressiveDisclosure());

      expect(result.current.modalOpen).toBe(true);
      expect(result.current.activeTab).toBe("overview");
    });
  });

  describe("project expansion (Level 1)", () => {
    it("should toggle project expansion", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.toggleProject("project-1");
      });

      expect(result.current.isExpanded("project-1")).toBe(true);

      act(() => {
        result.current.toggleProject("project-1");
      });

      expect(result.current.isExpanded("project-1")).toBe(false);
    });

    it("should allow multiple expanded projects by default", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.expandProject("project-1");
        result.current.expandProject("project-2");
      });

      expect(result.current.isExpanded("project-1")).toBe(true);
      expect(result.current.isExpanded("project-2")).toBe(true);
    });

    it("should collapse other projects when allowMultipleExpanded is false", () => {
      const { result } = renderHook(() =>
        useProgressiveDisclosure({ allowMultipleExpanded: false }),
      );

      act(() => {
        result.current.expandProject("project-1");
      });

      expect(result.current.isExpanded("project-1")).toBe(true);

      act(() => {
        result.current.toggleProject("project-2");
      });

      expect(result.current.isExpanded("project-1")).toBe(false);
      expect(result.current.isExpanded("project-2")).toBe(true);
    });

    it("should collapse specific project", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.expandProject("project-1");
        result.current.expandProject("project-2");
      });

      act(() => {
        result.current.collapseProject("project-1");
      });

      expect(result.current.isExpanded("project-1")).toBe(false);
      expect(result.current.isExpanded("project-2")).toBe(true);
    });

    it("should collapse all projects", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.expandProject("project-1");
        result.current.expandProject("project-2");
        result.current.expandProject("project-3");
      });

      act(() => {
        result.current.collapseAll();
      });

      expect(result.current.expandedProjects.size).toBe(0);
    });
  });

  describe("modal (Level 2)", () => {
    it("should open modal with project id", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.openModal("project-123");
      });

      expect(result.current.modalOpen).toBe(true);
      expect(result.current.selectedProjectId).toBe("project-123");
      expect(result.current.activeTab).toBe("overview");
    });

    it("should open modal with specific tab", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.openModal("project-123", "timeline");
      });

      expect(result.current.activeTab).toBe("timeline");
    });

    it("should close modal", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.openModal("project-123");
      });

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.modalOpen).toBe(false);
      expect(result.current.selectedProjectId).toBeNull();
      expect(result.current.activeTab).toBe("overview");
    });

    it("should change active tab", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.openModal("project-123");
      });

      act(() => {
        result.current.setActiveTab("code");
      });

      expect(result.current.activeTab).toBe("code");
    });
  });

  describe("URL persistence", () => {
    it("should update URL when modal opens", async () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.openModal("project-123", "timeline");
      });

      await waitFor(() => {
        expect(mockReplaceState).toHaveBeenCalled();
      });

      // Find the call that contains the modal param (not the initial cleanup)
      const urlCalls = mockReplaceState.mock.calls.map((call) => call[2] as string);
      const urlWithModal = urlCalls.find((url) => url.includes("modal="));
      expect(urlWithModal).toBeDefined();
      expect(urlWithModal).toContain("modal=project-123");
      expect(urlWithModal).toContain("tab=timeline");
    });

    it("should remove URL params when modal closes", async () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      act(() => {
        result.current.openModal("project-123");
      });

      await waitFor(() => {
        expect(mockReplaceState).toHaveBeenCalled();
      });

      act(() => {
        result.current.closeModal();
      });

      await waitFor(() => {
        const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1];
        const url = lastCall[2] as string;
        expect(url).not.toContain("modal=");
        expect(url).not.toContain("tab=");
      });
    });

    it("should not update URL when persistToUrl is false", () => {
      const { result } = renderHook(() =>
        useProgressiveDisclosure({ persistToUrl: false }),
      );

      act(() => {
        result.current.openModal("project-123");
      });

      expect(mockReplaceState).not.toHaveBeenCalled();
    });

    it("should handle popstate event", () => {
      const { result } = renderHook(() => useProgressiveDisclosure());

      // Simulate URL change via back button
      Object.defineProperty(window, "location", {
        writable: true,
        value: {
          href: "http://localhost:3000/?modal=project-456&tab=team",
          search: "?modal=project-456&tab=team",
          pathname: "/",
        },
      });

      act(() => {
        popstateHandler?.(new PopStateEvent("popstate"));
      });

      expect(result.current.modalOpen).toBe(true);
      expect(result.current.selectedProjectId).toBe("project-456");
      expect(result.current.activeTab).toBe("team");
    });
  });
});
