import { useState, useCallback, useEffect, useRef } from 'react';

import { useCompare, useFirstRender } from 'hooks/cycle-hook';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
  autoPlay?: boolean;
  active?: boolean;
}

export const usePlayback = ({
  videoRef,
  autoPlay = true,
  active = true,
}: Dependencies) => {
  const [playbackState, setPlaybackState] = useState(false);

  const playPromise = useRef<Promise<void>>();

  const activeChange = useCompare(active);
  const firstRender = useFirstRender();

  const togglePlayback = useCallback(() => {
    const video = videoRef.current!;

    if (video.paused || video.ended) {
      playPromise.current = video.play();
      return;
    }

    if (!playPromise.current) {
      return;
    }

    playPromise.current.then(() => video.pause());
  }, [videoRef]);

  const startAutoPlay = useCallback(() => {
    const video = videoRef.current!;

    if (active && autoPlay) {
      playPromise.current = video.play();
    }
  }, [videoRef, active, autoPlay]);

  useEffect(() => {
    if (firstRender || !activeChange) return;

    const video = videoRef.current!;

    if (active) {
      playPromise.current = video.play();
    }

    if (!active) {
      video.currentTime = 0;
      playPromise.current && playPromise.current.then(() => video.pause());
    }
  }, [videoRef, active, firstRender, activeChange]);

  return {
    playbackState,
    setPlaybackState,
    togglePlayback,
    startAutoPlay,
  };
};
