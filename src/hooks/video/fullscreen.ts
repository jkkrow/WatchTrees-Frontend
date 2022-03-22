import { useState, useCallback, useEffect } from 'react';

export const useFullscreen = () => {
  const [fullscreenState, setFullscreenState] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.querySelector('.video-tree')!.requestFullscreen();
    }
  }, []);

  const fullscreenChangeHandler = useCallback(() => {
    if (document.fullscreenElement) {
      setFullscreenState(true);
    } else {
      setFullscreenState(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
    };
  }, [fullscreenChangeHandler]);

  return { fullscreenState, toggleFullscreen };
};
