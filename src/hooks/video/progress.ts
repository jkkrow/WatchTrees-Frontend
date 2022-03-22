import { useState, useRef, useCallback } from 'react';

import { formatTime } from 'util/format';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useProgress = ({ videoRef }: Dependencies) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [progressTooltip, setProgressTooltip] = useState('00:00');
  const [progressTooltipPosition, setProgressTooltipPosition] = useState('');

  const progressSeekData = useRef(0);

  const updateProgress = useCallback(() => {
    const video = videoRef.current!;
    const duration = video.duration || 0;
    const currentTime = video.currentTime || 0;
    const buffer = video.buffered;

    setCurrentProgress(currentTime);

    if (duration > 0) {
      for (let i = 0; i < buffer.length; i++) {
        if (
          buffer.start(buffer.length - 1 - i) === 0 ||
          buffer.start(buffer.length - 1 - i) < video.currentTime
        ) {
          setBufferProgress(
            (buffer.end(buffer.length - 1 - i) / duration) * 100
          );
          break;
        }
      }
    }
  }, [videoRef]);

  const updateTooltip = useCallback(
    (event: React.MouseEvent) => {
      const video = videoRef.current!;

      const rect = event.currentTarget.getBoundingClientRect();
      const skipTo = (event.nativeEvent.offsetX / rect.width) * video.duration;

      progressSeekData.current = skipTo;

      let formattedTime: string;

      if (skipTo > video.duration) {
        formattedTime = formatTime(video.duration);
      } else if (skipTo < 0) {
        formattedTime = '00:00';
      } else {
        formattedTime = formatTime(skipTo);
        setProgressTooltipPosition(`${event.nativeEvent.offsetX}px`);
      }

      setProgressTooltip(formattedTime);
    },
    [videoRef]
  );

  const changeProgressWithInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current!;

      const skipTo = progressSeekData.current || +event.target.value;

      video.currentTime = skipTo;
      setCurrentProgress(skipTo);
    },
    [videoRef]
  );

  const changeProgressWithKey = useCallback(
    (direction: 1 | 0) => {
      const video = videoRef.current!;

      if (direction) {
        video.currentTime += 10;
        return;
      }

      video.currentTime -= 10;
    },
    [videoRef]
  );

  const configureDuration = useCallback(() => {
    const video = videoRef.current!;
    setVideoDuration(video.duration);
  }, [videoRef]);

  return {
    currentProgress,
    bufferProgress,
    videoDuration,
    progressTooltip,
    progressTooltipPosition,
    updateProgress,
    updateTooltip,
    changeProgressWithInput,
    changeProgressWithKey,
    configureDuration,
  };
};
