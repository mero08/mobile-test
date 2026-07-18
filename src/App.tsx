import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Maximize2 } from "lucide-react";
import { useCinematicFullscreen } from "@/hooks/useCinematicFullscreen";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  const { enterFullscreen } = useCinematicFullscreen();

  return (
    <SmoothScrollProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative">
            <button
              onClick={enterFullscreen}
              className="fixed bottom-6 left-6 z-50 p-2.5 rounded-full glass-card hidden lg:flex items-center justify-center hover:border-primary/40 transition-all duration-300 group"
              aria-label="Enter fullscreen"
              title="Enter fullscreen"
              data-cursor-hover
            >
              <Maximize2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </button>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </SmoothScrollProvider>
  );
};

export default App;
