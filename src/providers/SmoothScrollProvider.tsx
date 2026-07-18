import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LenisScrollTo = Lenis["scrollTo"];

interface SmoothScrollContextValue {
  scrollTo: LenisScrollTo;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function useSmoothScroll(): SmoothScrollContextValue {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used within SmoothScrollProvider");
  return ctx;
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

function nativeScrollTo(
  target: Parameters<LenisScrollTo>[0],
  options?: Parameters<LenisScrollTo>[1]
): void {
  const offset = typeof options?.offset === "number" ? options.offset : 0;
  let top = 0;

  if (typeof target === "number") {
    top = target;
  } else if (typeof target === "string") {
    const el = document.querySelector(target);
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY + offset;
  } else if (target instanceof HTMLElement) {
    top = target.getBoundingClientRect().top + window.scrollY + offset;
  } else {
    return;
  }

  window.scrollTo({ top, behavior: "smooth" });
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    document.documentElement.classList.add("lenis");

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: document.body });
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("lenis");
      ScrollTrigger.scrollerProxy(document.body, {});
      ScrollTrigger.refresh();
    };
  }, []);

  const scrollTo: LenisScrollTo = useCallback((target, options) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, options);
      return;
    }
    nativeScrollTo(target, options);
  }, []);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
    document.body.style.overflow = "hidden";
  }, []);

  const start = useCallback(() => {
    document.body.style.overflow = "";
    lenisRef.current?.start();
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, stop, start }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
