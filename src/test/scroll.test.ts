import { describe, it, expect } from "vitest";
import { getSectionOffset } from "@/lib/scroll";
import {
  getHorizontalScrollDistance,
  MIN_HORIZONTAL_PIN_DISTANCE,
} from "@/hooks/useHorizontalScrollSection";

describe("getSectionOffset", () => {
  it("accounts for desktop sidebar width", () => {
    expect(getSectionOffset(1024)).toBe(64);
    expect(getSectionOffset(1280)).toBe(64);
  });

  it("uses no offset on mobile", () => {
    expect(getSectionOffset(767)).toBe(0);
  });
});

describe("getHorizontalScrollDistance", () => {
  it("returns overflow past the viewport", () => {
    const track = { scrollWidth: 2400 } as HTMLElement;
    expect(getHorizontalScrollDistance(track, 1200)).toBe(1200);
  });

  it("never goes negative when content fits", () => {
    const track = { scrollWidth: 800 } as HTMLElement;
    expect(getHorizontalScrollDistance(track, 1200)).toBe(0);
  });

  it("is below pin threshold for short project tracks", () => {
    const track = { scrollWidth: 1100 } as HTMLElement;
    const distance = getHorizontalScrollDistance(track, 1440);
    expect(distance).toBe(0);
    expect(distance < MIN_HORIZONTAL_PIN_DISTANCE).toBe(true);
  });
});

describe("MIN_HORIZONTAL_PIN_DISTANCE", () => {
  it("skips pin for tiny overflow", () => {
    expect(MIN_HORIZONTAL_PIN_DISTANCE).toBe(80);
    const track = { scrollWidth: 1250 } as HTMLElement;
    expect(getHorizontalScrollDistance(track, 1200) < MIN_HORIZONTAL_PIN_DISTANCE).toBe(true);
  });
});
