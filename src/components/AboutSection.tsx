import { useLayoutEffect, useRef } from 'react';
import { Film, Clock, UserRound, Camera } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Clock, value: '5+', label: 'Years Experience' },
  { icon: Film, value: '500+', label: 'Projects Completed' },
  { icon: UserRound, value: '35+', label: 'Happy Clients' },
  { icon: Camera, value: '4K', label: 'Production Quality' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { x: -80, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      const cards = statsGridRef.current?.querySelectorAll('.stat-card') ?? [];
      if (cards.length && statsGridRef.current) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: statsGridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-20 py-32 px-6 md:pl-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">
            About
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div
            ref={leftRef}
            className="glass-card p-8 md:p-10"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Crafting visual stories that{' '}
              <span className="text-gold-gradient">move people</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Hello, I'm Fares, I create videos that grab attention and keep people watching.
              With over 5 years of experience, I work on short-form content, commercials, and long-form videos.
              My focus is simple: clear storytelling, smooth editing, and strong visuals that help brands and creators share their message
.
            </p>
          </div>

          <div ref={statsGridRef} className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="stat-card glass-card p-6 flex flex-col items-start gap-3 transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[0_10px_40px_-10px_hsl(43_100%_75%/0.4)]"
                style={{ opacity: 0, willChange: 'transform, opacity' }}
              >
                <stat.icon className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs font-mono text-muted-foreground tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
