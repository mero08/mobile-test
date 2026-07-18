import { useState } from 'react';
import { Menu, X, Home, User, Briefcase, Film, MessageSquare, Mail } from 'lucide-react';
import { useSmoothScroll } from '@/providers/SmoothScrollProvider';
import { scrollToSection } from '@/lib/scroll';

const navItems = [
  { icon: Home, label: 'Home', href: '#home' },
  { icon: User, label: 'About', href: '#about' },
  { icon: Briefcase, label: 'Expertise', href: '#expertise' },
  { icon: Film, label: 'Reels', href: '#reels' },
  { icon: Film, label: 'Projects', href: '#projects' },
  { icon: MessageSquare, label: 'Logs', href: '#logs' },
  { icon: Mail, label: 'Contact', href: '#contact' },
];

export default function CommandSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollTo } = useSmoothScroll();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    scrollToSection(href.slice(1), scrollTo);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className={`fixed left-0 top-0 h-full z-40 glass-sidebar hidden md:flex flex-col items-center py-8 transition-all duration-500 ${expanded ? 'w-52' : 'w-16'}`}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="mb-10 p-2 rounded-lg hover:bg-secondary transition-colors"
          data-cursor-hover
        >
          {expanded ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>

        <div className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              data-cursor-hover
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {expanded && (
                <span className="text-sm font-mono tracking-wide whitespace-nowrap">{item.label}</span>
              )}
            </a>
          ))}
        </div>

        <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
          {expanded ? '© 2024 FA' : 'FA'}
        </div>
      </nav>

      {/* Mobile trigger */}
      <button
        className="fixed top-4 left-4 z-50 p-3 glass-card md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
          <div
            className="absolute inset-x-0 bottom-0 p-6 pb-10 glass-sidebar rounded-t-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-6" />
            <div className="grid grid-cols-3 gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
