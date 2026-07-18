import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete?: () => void;
  minimumDuration?: number;
}

export default function Preloader({
  onComplete,
  minimumDuration = 2000,
}: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const startTime = useRef(Date.now());

  useEffect(() => {
    let frame: number;
    const simulate = () => {
      const elapsed = Date.now() - startTime.current;
      const raw = Math.min(elapsed / minimumDuration, 1);
      const eased = raw * raw * (3 - 2 * raw);
      setProgress(eased);

      if (eased < 1) {
        frame = requestAnimationFrame(simulate);
      } else {
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 300);
      }
    };
    frame = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(frame);
  }, [minimumDuration, onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
        transition: "opacity 0.4s ease",
        opacity: progress === 1 ? 0 : 1,
      }}
    >
      <div className="mb-8">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="hsl(43 100% 72%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" opacity="0.2" stroke="currentColor" />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeDasharray={`${progress * 62.8} 62.8`}
            transform="rotate(-90 12 12)"
            style={{ transition: "stroke-dasharray 0.2s ease" }}
          />
        </svg>
      </div>
      <span
        className="font-mono text-xs tracking-[0.3em]"
        style={{ color: "hsl(43 100% 72% / 0.6)" }}
      >
        {Math.round(progress * 100)}%
      </span>
    </div>
  );
}
