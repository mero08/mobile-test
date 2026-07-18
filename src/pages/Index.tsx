import { Suspense, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NebulaBackground from '@/components/NebulaBackground';
import CustomCursor from '@/components/CustomCursor';
import ViewfinderHUD from '@/components/ViewfinderHUD';
import HeroSection from '@/components/HeroSection';
import CommandSidebar from '@/components/CommandSidebar';
import AboutSection from '@/components/AboutSection';
import ExpertiseSection from '@/components/ExpertiseSection';
import ReelsSection from '@/components/ReelsSection';
import ProjectsSection from '@/components/ProjectsSection';
import SystemLogs from '@/components/SystemLogs';
import ContactSection from '@/components/ContactSection';
import Preloader from '@/components/Preloader';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [ready, setReady] = useState(false);

  const handlePreloaderComplete = () => {
    setReady(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <>
      {!ready && <Preloader onComplete={handlePreloaderComplete} minimumDuration={1800} />}
      <div
        id="home"
        className={`relative min-h-screen bg-background ${ready ? '' : 'invisible'}`}
      >
        <CustomCursor />
        <Suspense fallback={null}>
          <NebulaBackground />
        </Suspense>
        <ViewfinderHUD />
        <CommandSidebar />

        <main className="relative z-10">
          <HeroSection />
          <AboutSection />
          <ExpertiseSection />
          <ReelsSection />
          <ProjectsSection />
          <SystemLogs />
          <ContactSection />
        </main>
      </div>
    </>
  );
};

export default Index;
