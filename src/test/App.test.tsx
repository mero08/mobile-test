import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";

vi.mock("@/providers/SmoothScrollProvider", () => ({
  SmoothScrollProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSmoothScroll: () => ({ scrollTo: vi.fn(), stop: vi.fn(), start: vi.fn() }),
}));

vi.mock("@/components/NebulaBackground", () => ({
  default: () => null,
}));

vi.mock("@/components/Model3DViewer", () => ({
  default: () => <div data-testid="model-viewer" />,
}));

vi.mock("@/components/ReelsSection", () => ({
  default: () => <section id="reels">Reels</section>,
}));

vi.mock("@/components/ProjectsSection", () => ({
  default: () => <section id="projects">Projects</section>,
}));

vi.mock("@/components/Preloader", () => ({
  default: ({ onComplete }: { onComplete?: () => void }) => {
    queueMicrotask(() => onComplete?.());
    return null;
  },
}));

describe("App", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders home route", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("View Reels")).toBeInTheDocument();
    });
    expect(document.getElementById("home")).toBeInTheDocument();
  });

  it("renders 404 for unknown routes", () => {
    window.history.pushState({}, "", "/unknown");
    render(<App />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
