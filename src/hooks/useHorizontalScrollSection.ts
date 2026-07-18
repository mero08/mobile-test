import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Minimum overflow (px) required before creating a pin scrub. */
export const MIN_HORIZONTAL_PIN_DISTANCE = 80;

const MOBILE_MQ = "(max-width: 767px)";
const MOBILE_TRACK_CLASS = "horizontal-scroll-track--mobile";
const CARD_SNAP_CLASS = "horizontal-scroll-card";

export function getHorizontalScrollDistance(
  track: HTMLElement,
  viewportWidth: number = typeof window !== "undefined" ? window.innerWidth : 0
): number {
  return Math.max(0, track.scrollWidth - viewportWidth);
}

interface UseHorizontalScrollSectionOptions {
  sectionRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLElement | null>;
  /** Prefer `true` for 1:1 Lenis sync; small numbers add lag. */
  scrub?: boolean | number;
}

export function useHorizontalScrollSection({
  sectionRef,
  trackRef,
  scrub = true,
}: UseHorizontalScrollSectionOptions): void {
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    cards.forEach((card) => card.classList.add(CARD_SNAP_CLASS));

    let tween: gsap.core.Tween | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let rafRefresh = 0;

    const scheduleRefresh = () => {
      cancelAnimationFrame(rafRefresh);
      rafRefresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const killPin = () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      tween = null;
      gsap.set(track, { clearProps: "transform" });
    };

    const enableMobileTrack = () => {
      killPin();
      track.classList.add(MOBILE_TRACK_CLASS);
    };

    const disableMobileTrack = () => {
      track.classList.remove(MOBILE_TRACK_CLASS);
    };

    const setupDesktopPin = () => {
      disableMobileTrack();
      killPin();

      const distance = getHorizontalScrollDistance(track);
      if (distance < MIN_HORIZONTAL_PIN_DISTANCE) {
        return;
      }

      tween = gsap.to(track, {
        x: () => -getHorizontalScrollDistance(track),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getHorizontalScrollDistance(track)}`,
          pin: true,
          scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });
    };

    const applyMode = () => {
      if (window.matchMedia(MOBILE_MQ).matches) {
        enableMobileTrack();
      } else {
        setupDesktopPin();
      }
      scheduleRefresh();
    };

    applyMode();

    resizeObserver = new ResizeObserver(() => {
      scheduleRefresh();
      // Re-evaluate pin when track width changes (e.g. images loaded)
      if (!window.matchMedia(MOBILE_MQ).matches) {
        const distance = getHorizontalScrollDistance(track);
        if (distance < MIN_HORIZONTAL_PIN_DISTANCE) {
          killPin();
        } else if (!tween) {
          setupDesktopPin();
        }
      }
    });
    resizeObserver.observe(track);

    const onImageLoad = () => scheduleRefresh();
    const images = track.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", onImageLoad);
      }
    });

    const mql = window.matchMedia(MOBILE_MQ);
    const onBreakpoint = () => applyMode();
    mql.addEventListener("change", onBreakpoint);

    const onResize = () => scheduleRefresh();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRefresh);
      mql.removeEventListener("change", onBreakpoint);
      window.removeEventListener("resize", onResize);
      resizeObserver?.disconnect();
      images.forEach((img) => img.removeEventListener("load", onImageLoad));
      killPin();
      disableMobileTrack();
      cards.forEach((card) => card.classList.remove(CARD_SNAP_CLASS));
    };
  }, [sectionRef, trackRef, scrub]);
}
