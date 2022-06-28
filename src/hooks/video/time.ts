import { useState, useCallback } from 'react';

import { VideoPlayerDependencies } from 'components/Video/Player/VideoPlayer';
import { formatTime } from 'util/format';

export const useTime = ({ videoRef }: VideoPlayerDependencies) => {
  const [currentTimeUI, setCurrentTimeUI] = useState('00:00');
  const [remainedTimeUI, setRemainedTimeUI] = useState('00:00');

  const updateTime = useCallback(() => {
    const video = videoRef.current!;
    const duration = video.duration || 0;
    const currentTime = video.currentTime || 0;

    setCurrentTimeUI(formatTime(Math.round(currentTime)));
    setRemainedTimeUI(
      formatTime(Math.round(duration) - Math.round(currentTime))
    );
  }, [videoRef]);

  return { currentTimeUI, remainedTimeUI, updateTime };
};
