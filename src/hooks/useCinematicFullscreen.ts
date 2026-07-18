import { useEffect, useCallback } from 'react';

export function useCinematicFullscreen() {
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      document.documentElement.classList.add('cinematic-fullscreen');
    } catch {
      /* fullscreen blocked — site behaves normally, no classes added */
    }
  }, []);

  useEffect(() => {
    const onChange = () => {
      if (document.fullscreenElement) {
        document.documentElement.classList.add('cinematic-fullscreen');
      } else {
        document.documentElement.classList.remove('cinematic-fullscreen');
      }
    };

    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    document.addEventListener('mozfullscreenchange', onChange);
    document.addEventListener('MSFullscreenChange', onChange);

    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
      document.removeEventListener('mozfullscreenchange', onChange);
      document.removeEventListener('MSFullscreenChange', onChange);
    };
  }, []);

  return { enterFullscreen };
}
