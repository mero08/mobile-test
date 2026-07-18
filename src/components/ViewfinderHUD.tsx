import { useState, useEffect } from 'react';

function Timecode() {
  const [time, setTime] = useState('00:00:00:00');

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const h = String(Math.floor(elapsed / 3600000) % 24).padStart(2, '0');
      const m = String(Math.floor(elapsed / 60000) % 60).padStart(2, '0');
      const s = String(Math.floor(elapsed / 1000) % 60).padStart(2, '0');
      const f = String(Math.floor((elapsed % 1000) / (1000 / 24))).padStart(2, '0');
      setTime(`${h}:${m}:${s}:${f}`);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, []);

  return <span className="font-mono text-xs text-muted-foreground tracking-widest">{time}</span>;
}

export default function ViewfinderHUD() {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none p-6 md:p-10">
      {/* Corner brackets — top-left inset on mobile clears the left hamburger */}
      <div className="viewfinder-corner viewfinder-corner--tl top-16 left-6 md:top-10 md:left-10" />
      <div className="viewfinder-corner viewfinder-corner--tr top-6 right-6 md:top-10 md:right-10" />
      <div className="viewfinder-corner viewfinder-corner--bl bottom-6 left-6 md:bottom-10 md:left-10" />
      <div className="viewfinder-corner viewfinder-corner--br bottom-6 right-6 md:bottom-10 md:right-10" />

      {/* REC indicator — right side free now that menu moved left */}
      <div className="absolute top-8 right-6 md:top-12 md:right-14 flex items-center gap-2">
        <div className="rec-dot" />
        <span className="font-mono text-xs tracking-widest" style={{ color: 'hsl(var(--rec-red))' }}>REC</span>
      </div>

      {/* Timecode */}
      <div className="absolute bottom-8 right-6 md:bottom-12 md:right-14">
        <Timecode />
      </div>

      {/* Camera info */}
      <div className="absolute bottom-8 left-6 md:bottom-12 md:left-14 font-mono text-xs text-muted-foreground">
        <span>24fps · 4K · LOG</span>
      </div>
    </div>
  );
}
