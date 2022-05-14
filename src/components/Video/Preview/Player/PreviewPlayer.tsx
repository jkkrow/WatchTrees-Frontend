import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from 'components/Video/Player/UI/Loader/Loader';
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as VolumeHighIcon } from 'assets/icons/volume-high.svg';
import { ReactComponent as VolumeMuteIcon } from 'assets/icons/volume-mute.svg';
import { usePlayer } from 'hooks/video/player';
import { useVolume } from 'hooks/video/volume';
import { useLoader } from 'hooks/video/loader';
import { useLocalStorage } from 'hooks/common/storage';
import { PlayerNode } from 'store/slices/video-slice';
import './PreviewPlayer.scss';

interface PreviewPlayerProps {
  treeId: string;
  video: PlayerNode;
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ treeId, video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const [isEnded, setIsEnded] = useState(false);
  const [isMuted, setIsMuted] = useLocalStorage('preview-mute', false);

  usePlayer({ videoRef, currentVideo: video });
  const { toggleMute, configureVolume } = useVolume({ videoRef });
  const { displayLoader, showLoader, hideLoader } = useLoader();

  const previewEndedHandler = useCallback(() => {
    setIsEnded(true);
  }, []);

  const toggleMuteHandler = useCallback(() => {
    toggleMute();
    setIsMuted(!isMuted);
  }, [isMuted, toggleMute, setIsMuted]);

  const videoLoadHandler = useCallback(() => {
    configureVolume();
    isMuted && (videoRef.current!.volume = 0);
  }, [configureVolume, isMuted]);

  const navigateToVideoHandler = useCallback(() => {
    navigate(`/video/${treeId}`);
  }, [navigate, treeId]);

  return (
    <div className="preview-player">
      <div className="preview-player__loader" onClick={navigateToVideoHandler}>
        <Loader on={displayLoader} style={{ fontSize: '3rem' }} />
      </div>
      <video
        ref={videoRef}
        autoPlay={true}
        onClick={navigateToVideoHandler}
        onLoadedMetadata={videoLoadHandler}
        onEnded={previewEndedHandler}
        onWaiting={showLoader}
        onCanPlay={hideLoader}
      />
      <div
        className={`preview-player__playback${isEnded ? ' active' : ''}`}
        onClick={navigateToVideoHandler}
      >
        <PlayIcon />
      </div>
      <div
        className={`preview-player__volume${
          !displayLoader && !isEnded ? ' active' : ''
        }`}
        onClick={toggleMuteHandler}
      >
        {isMuted ? <VolumeMuteIcon /> : <VolumeHighIcon />}
      </div>
    </div>
  );
};

export default PreviewPlayer;
