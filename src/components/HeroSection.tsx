import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import Model3DViewer from "./Model3DViewer";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { scrollToSection } from "@/lib/scroll";

export default function HeroSection() {
  const { scrollTo } = useSmoothScroll();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    scrollToSection(href.slice(1), scrollTo);
  };

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleOutlineRef = useRef<HTMLHeadingElement>(null);
  const titleSolidRef = useRef<HTMLHeadingElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ─── Intro timeline ─────────────────────────────────── */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      const words = eyebrowRef.current?.querySelectorAll(".word") ?? [];
      if (words.length) {
        tl.fromTo(
          words,
          { y: -24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power2.out" },
          0.3,
        );
      }

      if (titleOutlineRef.current && titleSolidRef.current) {
        tl.fromTo(
          [titleOutlineRef.current, titleSolidRef.current],
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.9 },
          0.45,
        );
      }

      if (burstRef.current) {
        tl.fromTo(
          burstRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 0.6, scale: 1.3, duration: 0.5, ease: "power2.out" },
          0.9,
        ).to(
          burstRef.current,
          { opacity: 0, duration: 0.7, ease: "power2.in" },
          ">-0.1",
        );
      }

      if (modelRef.current) {
        tl.fromTo(
          modelRef.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" },
          0.5,
        );
      }

      const btnArr = buttonsRef.current
        ? Array.from(buttonsRef.current.children)
        : [];
      if (btnArr.length) {
        tl.fromTo(
          btnArr,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
          1.0,
        );
      }

      if (sweepRef.current) {
        tl.fromTo(
          sweepRef.current,
          { xPercent: -130, opacity: 0 },
          { xPercent: 130, opacity: 1, duration: 1.1, ease: "power2.inOut" },
          1.3,
        ).to(sweepRef.current, { opacity: 0, duration: 0.3 }, ">-0.2");
      }

      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          1.4,
        );
      }

      if (titleSolidRef.current) {
        tl.to(
          titleSolidRef.current,
          {
            filter: "drop-shadow(0 0 22px hsl(43 100% 72% / 0.4))",
            duration: 2.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
          1.2,
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ─── Large-screen check — mount 3D only on lg+ ──────── */
  const [isLg, setIsLg] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLg(mql.matches);
    mql.addEventListener("change", onChange);
    onChange();
    return () => mql.removeEventListener("change", onChange);
  }, []);

  /* ─── Cursor parallax — ultra-smooth & very light ────── */
  useLayoutEffect(() => {
    const outlineEl = titleOutlineRef.current;
    const solidEl = titleSolidRef.current;
    if (!outlineEl || !solidEl) return;

    const setOutX = gsap.quickSetter(outlineEl, "x", "px");
    const setOutY = gsap.quickSetter(outlineEl, "y", "px");
    const setSOlX = gsap.quickSetter(solidEl, "x", "px");
    const setSOlY = gsap.quickSetter(solidEl, "y", "px");

    let raf: number;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 8;
      ty = (e.clientY / window.innerHeight - 0.5) * 5;
    };

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      setOutX(-cx);
      setOutY(-cy);
      setSOlX(cx);
      setSOlY(cy);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const eyebrowWords = ["Director", "·", "Cinematographer", "·", "Storyteller"];

  return (
    <section
      ref={sectionRef}
      className="relative z-20 min-h-screen"
    >
      {/* ══ EYEBROW — centered at top ══════════════════════ */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pt-8 z-10 pointer-events-none">
        <p
          ref={eyebrowRef}
          className="font-mono text-[10px] md:text-xs text-muted-foreground tracking-[0.45em] uppercase flex flex-wrap justify-center gap-x-3"
        >
          {eyebrowWords.map((w, i) => (
            <span
              key={i}
              className="word inline-block"
              style={{ willChange: "transform, opacity" }}
            >
              {w}
            </span>
          ))}
        </p>
      </div>

      {/* ══ MAIN GRID — Left: name  |  Right: model ════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen items-center px-6 lg:px-12 xl:px-20">
        {/* ── LEFT: Name + Buttons ──────────────────────── */}
        <div className="flex flex-col items-center justify-center pt-28 pb-20 lg:py-0">
          {/* Kinetic split name */}
          <div
            ref={titleWrapRef}
            className="relative select-none overflow-hidden md:overflow-visible"
          >
            {/* Particle burst */}
            <div
              ref={burstRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, hsl(43 100% 70% / 0.25), transparent 65%)",
                willChange: "transform, opacity",
              }}
            />

            {/* Outlined layer — moves opposite cursor */}
            <h1
              ref={titleOutlineRef}
              aria-hidden="true"
              className="font-bold leading-[0.9] tracking-tighter"
              style={{
                fontSize: "clamp(3rem, 12vw, 11rem)",
                WebkitTextStroke: "1.5px hsl(43 100% 80%)",
                WebkitTextFillColor: "transparent",
                willChange: "transform, opacity",
              }}
            >
              FARES
              <br />
              AZAB
            </h1>

            {/* Solid gold layer — moves with cursor */}
            <h1
              ref={titleSolidRef}
              className="absolute inset-0 font-bold leading-[0.9] tracking-tighter"
              style={{
                fontSize: "clamp(3rem, 12vw, 11rem)",
                color: "hsl(43 100% 80%)",
                mixBlendMode: "screen",
                willChange: "transform, opacity, filter",
              }}
            >
              FARES
              <br />
              AZAB
            </h1>

            {/* Light sweep */}
            <div
              ref={sweepRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(108deg, transparent 28%, hsl(43 100% 92% / 0.28) 50%, transparent 72%)",
                mixBlendMode: "screen",
                willChange: "transform, opacity",
              }}
            />
          </div>

          {/* Buttons — centered below name */}
          <div
            ref={buttonsRef}
            className="mt-10 flex items-center justify-center gap-6"
          >
            <a
              href="#reels"
              onClick={(e) => handleAnchorClick(e, "#reels")}
              data-cursor-hover
              className="
                px-7 py-3 rounded-full
                border border-primary/30
                text-xs font-mono uppercase tracking-[0.2em]
                text-foreground
                hover:bg-primary hover:text-primary-foreground
                transition-all duration-500
              "
              style={{ willChange: "transform, opacity" }}
            >
              View Reels
            </a>
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "#contact")}
              data-cursor-hover
              className="
                px-4 py-3
                text-xs font-mono uppercase tracking-[0.2em]
                text-muted-foreground hover:text-foreground
                transition-colors duration-300
              "
              style={{ willChange: "transform, opacity" }}
            >
              Contact
            </a>
          </div>
        </div>

        {/* ── RIGHT: 3D Model (lg+ screens only) ──────── */}
        <div
          ref={modelRef}
          className={`${isLg ? 'flex' : 'hidden'} items-center justify-center h-full`}
          style={{ willChange: "transform, opacity" }}
        >
          {isLg && (
            <Model3DViewer
              height="100vh"
              width="100%"
              transparent={true}
              floatEffect={true}
              showShadow={false}
            />
          )}
        </div>
      </div>

      {/* ══ SCROLL INDICATOR ════════════════════════════════ */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ willChange: "transform, opacity" }}
      >
        <span className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
      </div>
    </section>
  );
}
