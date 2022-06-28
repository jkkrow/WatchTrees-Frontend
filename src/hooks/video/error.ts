import { useCallback, useState } from 'react';

import { VideoPlayerDependencies } from 'components/Video/Player/VideoPlayer';

export const useError = ({ videoRef }: VideoPlayerDependencies) => {
  const [videoError, setVideoError] = useState<MediaError | null>(null);

  const errorHandler = useCallback(() => {
    const video = videoRef.current!;
    video.error && setVideoError(video.error);
  }, [videoRef]);

  return { videoError, errorHandler };
};
