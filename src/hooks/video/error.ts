import { useCallback, useState } from 'react';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useError = ({ videoRef }: Dependencies) => {
  const [videoError, setVideoError] = useState<MediaError | null>(null);

  const errorHandler = useCallback(() => {
    const video = videoRef.current!;
    video.error && setVideoError(video.error);
  }, [videoRef]);

  return { videoError, errorHandler };
};
