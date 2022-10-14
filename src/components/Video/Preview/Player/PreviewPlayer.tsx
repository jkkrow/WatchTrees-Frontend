import { useCallback, useState } from 'react';

import Loader from 'components/Video/Player/UI/Loader/Loader';
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as VolumeHighIcon } from 'assets/icons/volume-high.svg';
import { ReactComponent as VolumeMuteIcon } from 'assets/icons/volume-mute.svg';
import { usePlayer } from 'hooks/video/player';
import { useVolume } from 'hooks/video/volume';
import { useLoader } from 'hooks/video/loader';
import { useLocalStorage } from 'hooks/common/storage';
import { VideoNode } from 'store/types/video';
import './PreviewPlayer.scss';

interface PreviewPlayerProps extends VideoNode {
  children: VideoNode[];
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = (props) => {
  const [isEnded, setIsEnded] = useState(false);
  const [isMuted, setIsMuted] = useLocalStorage('preview-mute', false);

  const videoPlayerDependencies = usePlayer(props);
  const { toggleMute, configureVolume } = useVolume(videoPlayerDependencies);
  const { displayLoader, showLoader, hideLoader } = useLoader();

  const previewEndedHandler = useCallback(() => {
    setIsEnded(true);
  }, []);

  const toggleMuteHandler = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      toggleMute();
      setIsMuted(!isMuted);
    },
    [isMuted, toggleMute, setIsMuted]
  );

  const videoLoadHandler = useCallback(() => {
    configureVolume();
    isMuted && (videoPlayerDependencies.videoRef.current!.volume = 0);
  }, [configureVolume, videoPlayerDependencies.videoRef, isMuted]);

  return (
    <div className="preview-player">
      <div className="preview-player__loader">
        <Loader on={displayLoader} style={{ fontSize: '3rem' }} />
      </div>
      <video
        ref={videoPlayerDependencies.videoRef}
        autoPlay={true}
        onLoadedMetadata={videoLoadHandler}
        onEnded={previewEndedHandler}
        onWaiting={showLoader}
        onCanPlay={hideLoader}
      />
      <div className={`preview-player__playback${isEnded ? ' active' : ''}`}>
        <PlayIcon />
      </div>
      <div
        className="preview-player__volume"
        data-active={!displayLoader && !isEnded}
        onClick={toggleMuteHandler}
      >
        {isMuted ? <VolumeMuteIcon /> : <VolumeHighIcon />}
      </div>
    </div>
  );
};

export default PreviewPlayer;
