import { useLayoutEffect, useRef } from 'react';
import { Video, Palette, Clapperboard, Sparkles, MonitorPlay, Lightbulb } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { icon: Video, title: 'Cinematography', desc: 'Visual storytelling through precise camera work and composition.' },
  { icon: Clapperboard, title: 'Directing', desc: 'Leading creative vision from concept to final cut delivery.' },
  { icon: Palette, title: 'Color Grading', desc: 'Crafting mood and tone with professional color grading techniques.' },
  { icon: MonitorPlay, title: 'Video Editing', desc: ' Smooth, engaging edits with strong rhythm and storytelling flow.' },
  { icon: Sparkles, title: 'VFX & Motion', desc: 'Adding visual effects and motion graphics to elevate stories.' },
  { icon: Lightbulb, title: 'Creative Direction', desc: 'Shaping brand identity through cohesive visual language.' },
];

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = Array.from(gridRef.current?.querySelectorAll('.skill-card') ?? []);
      if (!cards.length) return;
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { 
            y: 40, 
            opacity: 0,
            scale: 0.95 
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="relative z-20 py-32 px-6 md:pl-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">Expertise</span>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className="skill-card glass-card p-6 group hover:border-primary/30 transition-transform duration-500 ease-out hover:scale-105 hover:rotate-1"
              style={{ opacity: 0, willChange: 'transform, opacity' }}
            >
              <skill.icon className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{skill.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}