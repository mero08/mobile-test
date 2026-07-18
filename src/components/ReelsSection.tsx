import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, X } from 'lucide-react';
import { useHorizontalScrollSection } from '@/hooks/useHorizontalScrollSection';
import { useSmoothScroll } from '@/providers/SmoothScrollProvider';

const reels = [
  { id: 1, title: 'Desert Light', category: 'Cinematic Reel', year: '2024', color: 'from-amber-900/50', videoUrl: 'https://player.mux.com/4253PKq3sD00AG8XafSwdgCp02oaruANEeSE6obQUG01d4?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/4253PKq3sD00AG8XafSwdgCp02oaruANEeSE6obQUG01d4/thumbnail.jpg?time=2' },
  { id: 2, title: 'Midnight Run', category: 'Action Reel', year: '2024', color: 'from-blue-900/50', videoUrl: 'https://player.mux.com/lpiHpVOhqWWdb6FxoJh7RZ93d5jEMAH00rKnbF4ABwLY?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/lpiHpVOhqWWdb6FxoJh7RZ93d5jEMAH00rKnbF4ABwLY/thumbnail.jpg?time=10' },
  { id: 3, title: 'Golden Hour', category: 'Fashion Reel', year: '2023', color: 'from-rose-900/50', videoUrl: 'https://player.mux.com/LvjbtVNEnGswfIsR1f8AhK25pAh9kFJV00PnQI2SJtCQ?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/LvjbtVNEnGswfIsR1f8AhK25pAh9kFJV00PnQI2SJtCQ/thumbnail.jpg?time=20' },
  { id: 4, title: 'Raw Frames', category: 'BTS Reel', year: '2023', color: 'from-emerald-900/50', videoUrl: 'https://player.mux.com/A0054bey153tzYeOiExyLf02Bv029McbShKIGPP9NRgGT4?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/A0054bey153tzYeOiExyLf02Bv029McbShKIGPP9NRgGT4/thumbnail.jpg?time=30' },
  { id: 5, title: 'Neon Nights', category: 'Music Video', year: '2024', color: 'from-violet-900/50', videoUrl: 'https://player.mux.com/ktzRAQE6eQX00occgERo7crHsxax0201eKA2zYoYVoT6K8?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/ktzRAQE6eQX00occgERo7crHsxax0201eKA2zYoYVoT6K8/thumbnail.jpg?time=40' },
  { id: 6, title: 'Silent Motion', category: 'Documentary', year: '2023', color: 'from-cyan-900/50', videoUrl: 'https://player.mux.com/1hdjXdcToxg9JURl1OYZFH8tlAlOAR5ftzM00l92Pmtg?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/1hdjXdcToxg9JURl1OYZFH8tlAlOAR5ftzM00l92Pmtg/thumbnail.jpg?time=50' },
];

export default function ReelsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeReel, setActiveReel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { stop, start } = useSmoothScroll();

  useHorizontalScrollSection({ sectionRef, trackRef });

  useEffect(() => {
    if (activeReel === null) return;
    setIsLoading(true);
    stop();
    return () => {
      start();
    };
  }, [activeReel, stop, start]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeReel !== null) {
        setActiveReel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReel]);

  return (
    <section id="reels" ref={sectionRef} className="relative z-20 overflow-x-hidden md:overflow-hidden">
      <div className="h-screen flex flex-col justify-center items-start">
        <div className="px-6 md:pl-24 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">Reels · 9:16</span>
          </div>
        </div>

        <div ref={trackRef} className="flex gap-5 px-6 md:pl-24 will-change-transform items-start">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="glass-card flex-shrink-0 group cursor-pointer"
              onClick={() => setActiveReel(reel.id)}
              data-cursor-hover
            >
              <div
                className="aspect-[9/16] rounded-t-xl flex items-center justify-center relative overflow-hidden"
                style={{ height: '65vh' }}
              >
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-500" />
                <Play className="w-10 h-10 text-foreground/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300 relative z-10" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground mb-1">{reel.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-primary">{reel.category}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{reel.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeReel &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
            style={{
              background: 'radial-gradient(ellipse at center, hsl(0 0% 0% / 0.92) 0%, hsl(0 0% 0% / 0.98) 100%)',
              backdropFilter: 'blur(20px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
            }}
            onClick={() => setActiveReel(null)}
          >
            <button
              onClick={() => setActiveReel(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-black/40 border border-white/20 text-white hover:text-white hover:border-white/60 hover:bg-black/60 transition-all duration-200 cursor-pointer z-[110]"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="relative w-full max-w-md mx-4 h-[90vh] max-h-[850px] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-black/60 bg-card">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
                <iframe
                  key={activeReel}
                  title={reels.find((r) => r.id === activeReel)?.title ?? 'Reel'}
                  src={reels.find((r) => r.id === activeReel)?.videoUrl}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
