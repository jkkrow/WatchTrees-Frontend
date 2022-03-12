import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shaka from 'shaka-player';

import Loader from 'components/Video/Player/UI/Loader/Loader';
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as VolumeHighIcon } from 'assets/icons/volume-high.svg';
import { ReactComponent as VolumeMuteIcon } from 'assets/icons/volume-mute.svg';
import { useTimeout } from 'hooks/timer-hook';
import { useLocalStorage } from 'hooks/storage-hook';
import { useAppSelector } from 'hooks/store-hook';
import './PreviewPlayer.scss';

interface PreviewPlayerProps {
  videoId: string;
  src: string;
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ videoId, src }) => {
  const videoVolume = useAppSelector((state) => state.video.videoVolume);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [setLoaderTimeout, clearLoaderTimeout] = useTimeout();
  const [isMuted, setIsMuted] = useLocalStorage('preview-mute', false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const showLoaderHandler = useCallback(() => {
    setLoaderTimeout(() => setIsLoading(true), 300);
  }, [setLoaderTimeout]);

  const hideLoaderHandler = useCallback(() => {
    clearLoaderTimeout();
    setIsLoading(false);
  }, [clearLoaderTimeout]);

  const previewPauseHandler = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggleMuteHandler = useCallback(() => {
    if (!videoRef.current) return;

    videoRef.current.volume = isMuted ? videoVolume || 1 : 0;
    setIsMuted(!isMuted);
  }, [isMuted, setIsMuted, videoVolume]);

  const navigateToVideoHandler = useCallback(() => {
    navigate(`/video/${videoId}`);
  }, [navigate, videoId]);

  const videoLoadHandler = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    video.volume = isMuted ? 0 : videoVolume || 1;
  }, [videoVolume, isMuted]);

  useEffect(() => {
    (async () => {
      if (!videoRef.current) return;

      const player = new shaka.Player(videoRef.current);

      await player.load(src);
    })();
  }, [src]);

  return (
    <div className="preview-player">
      <div className="preview-player__loader" onClick={navigateToVideoHandler}>
        <Loader on={isLoading} style={{ fontSize: '3rem' }} />
      </div>
      <video
        ref={videoRef}
        autoPlay={true}
        onClick={navigateToVideoHandler}
        onLoadedMetadata={videoLoadHandler}
        onPause={previewPauseHandler}
        onWaiting={showLoaderHandler}
        onCanPlay={hideLoaderHandler}
      />
      <div
        className={`preview-player__playback${!isPlaying ? ' active' : ''}`}
        onClick={navigateToVideoHandler}
      >
        <PlayIcon />
      </div>
      <div
        className={`preview-player__volume${
          !isLoading && isPlaying ? ' active' : ''
        }`}
        onClick={toggleMuteHandler}
      >
        {isMuted ? <VolumeMuteIcon /> : <VolumeHighIcon />}
      </div>
    </div>
  );
};

export default PreviewPlayer;
